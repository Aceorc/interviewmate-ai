const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

let isConnectedToMongo = false;
const dataDir = path.join(__dirname, '../../data');
const fallbackDbPath = path.join(dataDir, 'local_db.json');

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Memory / Local file fallback store
class LocalCollection {
  constructor(name) {
    this.name = name;
  }

  _readAll() {
    try {
      if (!fs.existsSync(fallbackDbPath)) {
        fs.writeFileSync(fallbackDbPath, JSON.stringify({}), 'utf8');
      }
      const raw = fs.readFileSync(fallbackDbPath, 'utf8');
      const data = JSON.parse(raw || '{}');
      return data[this.name] || [];
    } catch (e) {
      console.error(`Error reading ${this.name} from local_db:`, e.message);
      return [];
    }
  }

  _writeAll(items) {
    try {
      let data = {};
      if (fs.existsSync(fallbackDbPath)) {
        const raw = fs.readFileSync(fallbackDbPath, 'utf8');
        data = JSON.parse(raw || '{}');
      }
      data[this.name] = items;
      fs.writeFileSync(fallbackDbPath, JSON.stringify(data, null, 2), 'utf8');
    } catch (e) {
      console.error(`Error writing ${this.name} to local_db:`, e.message);
    }
  }

  async find(filter = {}) {
    let items = this._readAll();
    const filtered = items.filter(item => {
      for (const [key, value] of Object.entries(filter)) {
        if (value && typeof value === 'object' && value.$in) {
          if (!value.$in.includes(item[key])) return false;
        } else if (value && typeof value === 'object' && value.$regex) {
          const regex = new RegExp(value.$regex, value.$options || 'i');
          if (!regex.test(item[key] || '')) return false;
        } else if (item[key] !== value) {
          return false;
        }
      }
      return true;
    });

    // Provide query helpers: .sort(), .limit(), .skip(), .lean(), .populate()
    const query = {
      _data: filtered,
      sort(criteria) {
        if (criteria) {
          const [field, order] = Object.entries(criteria)[0] || [];
          if (field) {
            this._data.sort((a, b) => {
              if (order === -1 || order === 'desc') return (b[field] > a[field] ? 1 : -1);
              return (a[field] > b[field] ? 1 : -1);
            });
          }
        }
        return this;
      },
      limit(num) {
        this._data = this._data.slice(0, num);
        return this;
      },
      skip(num) {
        this._data = this._data.slice(num);
        return this;
      },
      populate() {
        return this;
      },
      lean() {
        return this._data;
      },
      then(resolve, reject) {
        resolve(this._data);
      }
    };

    return query;
  }

  async findOne(filter = {}) {
    const items = this._readAll();
    const item = items.find(doc => {
      for (const [key, value] of Object.entries(filter)) {
        if (key === '_id') {
          if (String(doc._id) !== String(value)) return false;
        } else if (value && typeof value === 'object' && value.$regex) {
          const regex = new RegExp(value.$regex, value.$options || 'i');
          if (!regex.test(doc[key] || '')) return false;
        } else if (doc[key] !== value) {
          return false;
        }
      }
      return true;
    });

    if (!item) return null;
    return this._wrapDoc(item);
  }

  async findById(id) {
    return this.findOne({ _id: id });
  }

  async create(data) {
    const items = this._readAll();
    const doc = {
      ...data,
      _id: data._id || 'id_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9),
      createdAt: data.createdAt || new Date(),
      updatedAt: new Date()
    };
    items.push(doc);
    this._writeAll(items);
    return this._wrapDoc(doc);
  }

  async insertMany(arrayData) {
    const items = this._readAll();
    const added = arrayData.map(d => ({
      ...d,
      _id: d._id || 'id_' + Date.now() + '_' + Math.random().toString(36).substring(2, 9),
      createdAt: d.createdAt || new Date(),
      updatedAt: new Date()
    }));
    items.push(...added);
    this._writeAll(items);
    return added.map(d => this._wrapDoc(d));
  }

  async findByIdAndUpdate(id, updates, options = {}) {
    const items = this._readAll();
    const idx = items.findIndex(d => String(d._id) === String(id));
    if (idx === -1) return null;
    
    // Check for $set or direct keys
    const actualUpdates = updates.$set ? { ...updates.$set } : { ...updates };
    items[idx] = { ...items[idx], ...actualUpdates, updatedAt: new Date() };
    this._writeAll(items);
    return this._wrapDoc(items[idx]);
  }

  async findOneAndUpdate(filter, updates, options = {}) {
    const doc = await this.findOne(filter);
    if (!doc) return null;
    return this.findByIdAndUpdate(doc._id, updates, options);
  }

  async findByIdAndDelete(id) {
    let items = this._readAll();
    const idx = items.findIndex(d => String(d._id) === String(id));
    if (idx === -1) return null;
    const removed = items.splice(idx, 1)[0];
    this._writeAll(items);
    return removed;
  }

  async deleteOne(filter) {
    const items = this._readAll();
    const idx = items.findIndex(doc => {
      for (const [key, value] of Object.entries(filter)) {
        if (key === '_id') {
          if (String(doc._id) !== String(value)) return false;
        } else if (doc[key] !== value) {
          return false;
        }
      }
      return true;
    });
    if (idx !== -1) {
      items.splice(idx, 1);
      this._writeAll(items);
      return { deletedCount: 1 };
    }
    return { deletedCount: 0 };
  }

  async countDocuments(filter = {}) {
    const res = await this.find(filter);
    const arr = Array.isArray(res) ? res : (res._data || []);
    return arr.length;
  }

  async distinct(field) {
    const items = this._readAll();
    const set = new Set();
    items.forEach(i => {
      if (i[field]) set.add(i[field]);
    });
    return Array.from(set);
  }

  _wrapDoc(rawDoc) {
    const self = this;
    const doc = { ...rawDoc };
    doc.save = async function() {
      const items = self._readAll();
      const idx = items.findIndex(d => String(d._id) === String(doc._id));
      doc.updatedAt = new Date();
      if (idx !== -1) {
        items[idx] = { ...doc };
      } else {
        items.push(doc);
      }
      self._writeAll(items);
      return doc;
    };
    return doc;
  }
}

const localModels = {};
function getLocalModel(name) {
  if (!localModels[name]) {
    localModels[name] = new LocalCollection(name);
  }
  return localModels[name];
}

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/interviewmate';
  const net = require('net');

  // Fast socket check for local instances
  const isPortOpen = await new Promise((resolve) => {
    if (!uri.includes('127.0.0.1') && !uri.includes('localhost')) {
      return resolve(true); // Remote MongoDB Atlas URI
    }
    const sock = new net.Socket();
    sock.setTimeout(400);
    sock.on('connect', () => { sock.destroy(); resolve(true); });
    sock.on('error', () => { sock.destroy(); resolve(false); });
    sock.on('timeout', () => { sock.destroy(); resolve(false); });
    sock.connect(27017, '127.0.0.1');
  });

  if (!isPortOpen) {
    isConnectedToMongo = false;
    console.log(`[DB] Local MongoDB is offline. Using high-performance JSON persistence adapter (${fallbackDbPath}).`);
    return;
  }

  try {
    mongoose.set('strictQuery', false);
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
      connectTimeoutMS: 2000
    });
    isConnectedToMongo = true;
    console.log(`[DB] Connected successfully to MongoDB at ${uri}`);
  } catch (err) {
    isConnectedToMongo = false;
    console.warn(`[DB] Could not connect to MongoDB server (${err.message}). Activating local persistence engine.`);
  }
};

const getModel = (name, mongooseModel) => {
  if (isConnectedToMongo && mongoose.connection.readyState === 1) {
    return mongooseModel;
  }

  return getLocalModel(name);
};

module.exports = {
  connectDB,
  getModel,
  getLocalModel,
  isMongoActive: () => isConnectedToMongo && mongoose.connection.readyState === 1
};
