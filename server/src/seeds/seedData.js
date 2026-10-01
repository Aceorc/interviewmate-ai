const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Question = require('../models/Question');
const { connectDB } = require('../config/db');

const SEED_QUESTIONS = [
  // --- APTITUDE: Quantitative / Numbers / Percentages / Profit & Loss / Time & Work / Speed & Distance / Probability / Ratios / Averages ---
  {
    category: 'aptitude',
    topic: 'Percentages',
    difficulty: 'Easy',
    question: 'A student multiplied a number by 3/5 instead of 5/3. What is the percentage error in the calculation?',
    options: ['34%', '44%', '54%', '64%'],
    correctAnswer: 3, // index 3 = 64%
    explanation: 'Let the number be 15 (LCM of 5 and 3). Correct result = 15 * (5/3) = 25. Erroneous result = 15 * (3/5) = 9. Error = 25 - 9 = 16. Percentage error = (16 / 25) * 100 = 64%.'
  },
  {
    category: 'aptitude',
    topic: 'Profit and loss',
    difficulty: 'Medium',
    question: 'An article is sold at a profit of 20%. If both the cost price and selling price are reduced by $20, the profit would be 25%. What is the cost price?',
    options: ['$80', '$100', '$120', '$150'],
    correctAnswer: 1, // index 1 = $100
    explanation: 'Let CP = x. Then SP = 1.20x. New CP = x - 20, New SP = 1.20x - 20. New profit is 25%, so 1.20x - 20 = 1.25(x - 20). 1.20x - 20 = 1.25x - 25 => 0.05x = 5 => x = $100.'
  },
  {
    category: 'aptitude',
    topic: 'Time and work',
    difficulty: 'Medium',
    question: 'A can complete a piece of work in 12 days and B can complete it in 18 days. If they work on it together for 4 days, what fraction of work is left?',
    options: ['4/9', '5/9', '7/18', '1/3'],
    correctAnswer: 0, // index 0 = 4/9
    explanation: "A's 1-day work = 1/12, B's 1-day work = 1/18. Combined 1-day work = (3 + 2)/36 = 5/36. In 4 days, they complete 4 * (5/36) = 20/36 = 5/9 of the work. Remaining work = 1 - 5/9 = 4/9."
  },
  {
    category: 'aptitude',
    topic: 'Time, speed and distance',
    difficulty: 'Medium',
    question: 'A train 150 meters long passes an electric pole in 15 seconds and another train of same length traveling in opposite direction in 12 seconds. What is the speed of the second train?',
    options: ['45 km/h', '54 km/h', '60 km/h', '72 km/h'],
    correctAnswer: 1, // index 1 = 54 km/h
    explanation: 'Speed of first train (v1) = 150 / 15 = 10 m/s. Relative speed (v1 + v2) = (150 + 150) / 12 = 300 / 12 = 25 m/s. Therefore v2 = 25 - 10 = 15 m/s = 15 * (18/5) = 54 km/h.'
  },
  {
    category: 'aptitude',
    topic: 'Probability',
    difficulty: 'Easy',
    question: 'Two dice are tossed simultaneously. What is the probability of getting a total sum of 8?',
    options: ['5/36', '7/36', '1/6', '1/9'],
    correctAnswer: 0, // index 0 = 5/36
    explanation: 'Total outcomes = 6 * 6 = 36. Favorable outcomes for sum 8 are: (2,6), (3,5), (4,4), (5,3), (6,2) = 5 pairs. Probability = 5/36.'
  },
  {
    category: 'aptitude',
    topic: 'Ratios',
    difficulty: 'Easy',
    question: 'If A : B = 3 : 4 and B : C = 8 : 9, what is the ratio of A : C?',
    options: ['1 : 2', '2 : 3', '3 : 2', '4 : 5'],
    correctAnswer: 1, // index 1 = 2 : 3
    explanation: 'A/B = 3/4 and B/C = 8/9. A/C = (A/B) * (B/C) = (3/4) * (8/9) = 24/36 = 2/3. Thus A : C = 2 : 3.'
  },
  {
    category: 'aptitude',
    topic: 'Averages',
    difficulty: 'Medium',
    question: 'The average weight of 8 persons increases by 2.5 kg when a new person comes in place of one of them weighing 65 kg. What is the weight of the new person?',
    options: ['76 kg', '80 kg', '85 kg', '90 kg'],
    correctAnswer: 2, // index 2 = 85 kg
    explanation: 'Total increase in weight for all 8 persons = 8 * 2.5 = 20 kg. Weight of new person = Weight of replaced person + total increase = 65 + 20 = 85 kg.'
  },
  {
    category: 'aptitude',
    topic: 'Number system',
    difficulty: 'Easy',
    question: 'What is the unit digit in the product (784 * 618 * 917 * 463)?',
    options: ['2', '4', '6', '8'],
    correctAnswer: 0, // index 0 = 2
    explanation: 'Multiply only the unit digits: 4 * 8 = 32 (unit digit 2); 2 * 7 = 14 (unit digit 4); 4 * 3 = 12 (unit digit 2). Hence, the unit digit is 2.'
  },
  {
    category: 'aptitude',
    topic: 'Quantitative aptitude',
    difficulty: 'Hard',
    question: 'Find the greatest number which on dividing 1657 and 2037 leaves remainders 6 and 5 respectively.',
    options: ['123', '127', '235', '305'],
    correctAnswer: 1, // index 1 = 127
    explanation: 'Required number = HCF of (1657 - 6) and (2037 - 5) = HCF of 1651 and 2032. 2032 = 1651 * 1 + 381; 1651 = 381 * 4 + 127; 381 = 127 * 3 + 0. Thus HCF is 127.'
  },

  // --- LOGICAL REASONING: Number series, Coding-decoding, Blood relations, Direction, Syllogisms, Analogies, Seating, Pattern ---
  {
    category: 'reasoning',
    topic: 'Number series',
    difficulty: 'Easy',
    question: 'Look at this series: 2, 1, (1/2), (1/4), ... What number should come next?',
    options: ['(1/3)', '(1/8)', '(2/8)', '(1/16)'],
    correctAnswer: 1, // index 1 = (1/8)
    explanation: 'This is a geometric division series; each number is half of the previous number: 1/4 divided by 2 is 1/8.'
  },
  {
    category: 'reasoning',
    topic: 'Coding-decoding',
    difficulty: 'Medium',
    question: 'In a certain code, MONKEY is written as XDJMNL. How is TIGER written in that code?',
    options: ['QDFHS', 'SDFHS', 'SHFDQ', 'UJHFS'],
    correctAnswer: 0, // index 0 = QDFHS
    explanation: 'Pattern: The letters of MONKEY from right to left are decremented by 1. Y-1=X, E-1=D, K-1=J, N-1=M, O-1=N, M-1=L. For TIGER from right to left: R-1=Q, E-1=D, G-1=F, I-1=H, T-1=S. Result: QDFHS.'
  },
  {
    category: 'reasoning',
    topic: 'Blood relations',
    difficulty: 'Medium',
    question: 'Pointing to a photograph of a boy, Suresh said, "He is the son of the only son of my mother." How is Suresh related to that boy?',
    options: ['Brother', 'Uncle', 'Cousin', 'Father'],
    correctAnswer: 3, // index 3 = Father
    explanation: "The only son of Suresh's mother is Suresh himself. So, the boy in the photo is Suresh's son. Thus Suresh is the father of the boy."
  },
  {
    category: 'reasoning',
    topic: 'Direction sense',
    difficulty: 'Easy',
    question: 'A man walks 5 km East, then turns right and walks 4 km, then turns left and walks 5 km. In which direction is he now from his starting point?',
    options: ['North-East', 'South-East', 'North-West', 'South-West'],
    correctAnswer: 1, // index 1 = South-East
    explanation: 'From start: 5 km East, then 4 km South, then 5 km East. Net displacement is 10 km East and 4 km South. Hence he is South-East of the starting point.'
  },
  {
    category: 'reasoning',
    topic: 'Syllogisms',
    difficulty: 'Medium',
    question: 'Statements: (1) All mangoes are golden in color. (2) No golden colored things are cheap. Conclusions: I. All mangoes are cheap. II. Golden colored mangoes are not cheap.',
    options: ['Only conclusion I follows', 'Only conclusion II follows', 'Either I or II follows', 'Neither follows'],
    correctAnswer: 1, // index 1 = Only conclusion II follows
    explanation: 'Since all mangoes are golden and no golden things are cheap, mangoes cannot be cheap. Conclusion II clearly follows.'
  },
  {
    category: 'reasoning',
    topic: 'Analogies',
    difficulty: 'Easy',
    question: 'Architect : Building :: Sculptor : ?',
    options: ['Museum', 'Stone', 'Statue', 'Chisel'],
    correctAnswer: 2, // index 2 = Statue
    explanation: 'An architect designs/creates a building; similarly, a sculptor creates a statue.'
  },
  {
    category: 'reasoning',
    topic: 'Seating arrangement',
    difficulty: 'Hard',
    question: 'Five colleagues A, B, C, D, and E are sitting in a circle facing the center. C is between A and E. B is to the immediate right of E. Who is to the immediate left of A?',
    options: ['B', 'C', 'D', 'E'],
    correctAnswer: 2, // index 2 = D
    explanation: 'Circular clockwise arrangement with C between A and E and B to immediate right of E: E -> C -> A -> D -> B -> E. The person immediately to the left of A is D.'
  },
  {
    category: 'reasoning',
    topic: 'Pattern problems',
    difficulty: 'Medium',
    question: 'Which word does NOT belong with the others?',
    options: ['Leopard', 'Cougar', 'Elephant', 'Lion'],
    correctAnswer: 2, // index 2 = Elephant
    explanation: 'Leopard, cougar, and lion are all members of the feline (cat) family; elephant is a pachyderm.'
  },

  // --- TECHNICAL INTERVIEW: Java, Python, C, SQL, OOP, DSA, DBMS, CN, OS ---
  {
    category: 'technical',
    topic: 'Java',
    difficulty: 'Medium',
    question: 'Explain the difference between String, StringBuilder, and StringBuffer in Java, focusing on memory allocation and thread safety.',
    sampleAnswer: 'In Java, String is immutable; whenever a String is modified, a new object is created in the String Constant Pool or Heap. StringBuffer is mutable and thread-safe because its methods are synchronized, making it slower. StringBuilder is mutable and not synchronized, offering the best performance for single-threaded string concatenation.',
    explanation: 'Strings are immutable for security and caching. StringBuffer is synchronized (thread-safe). StringBuilder is unsynchronized and faster.'
  },
  {
    category: 'technical',
    topic: 'Python',
    difficulty: 'Medium',
    question: 'What is Python’s Global Interpreter Lock (GIL), why does it exist, and how do developers bypass it for CPU-bound tasks?',
    sampleAnswer: 'The GIL is a mutex that prevents multiple native threads from executing Python bytecodes at once in CPython. It simplifies CPython memory management and reference counting. To bypass the GIL for CPU-bound workloads, developers use the multiprocessing module (which spawns separate OS processes with isolated memory), C-extensions (NumPy, Cython), or asynchronous I/O for I/O-bound tasks.',
    explanation: 'GIL ensures thread-safe memory management in CPython. Multiprocessing is the standard approach to leverage multi-core CPUs in Python.'
  },
  {
    category: 'technical',
    topic: 'C',
    difficulty: 'Medium',
    question: 'Explain memory leaks and dangling pointers in C. How can you prevent them during dynamic memory allocation?',
    sampleAnswer: 'A memory leak occurs when heap memory is allocated using malloc/calloc but not deallocated with free(), leaving it inaccessible. A dangling pointer arises when a pointer still references a memory location after that memory has been freed. Prevention involves always setting freed pointers to NULL, matching every malloc with a free, and utilizing tools like Valgrind.',
    explanation: 'Always free allocated memory and assign pointers to NULL immediately after freeing to prevent undefined behavior.'
  },
  {
    category: 'technical',
    topic: 'SQL',
    difficulty: 'Medium',
    question: 'What is the difference between WHERE and HAVING clauses in SQL? Provide a scenario where HAVING is required.',
    sampleAnswer: 'WHERE filters rows before any aggregate functions are applied and cannot reference aggregated columns. HAVING filters groups after the GROUP BY clause and aggregate calculations (like COUNT, SUM, AVG) have occurred. For example, SELECT department, AVG(salary) FROM employees GROUP BY department HAVING AVG(salary) > 75000 requires HAVING.',
    explanation: 'WHERE filters individual records prior to grouping; HAVING filters aggregated groups.'
  },
  {
    category: 'technical',
    topic: 'OOP',
    difficulty: 'Easy',
    question: 'Explain the 4 fundamental pillars of Object-Oriented Programming with real-world software examples.',
    sampleAnswer: '1. Encapsulation: Bundling data and methods into a single class with private variables and public getters/setters. 2. Abstraction: Hiding internal complexities and exposing only essential interfaces. 3. Inheritance: Reusing parent class fields and methods (e.g. ElectricCar extends Vehicle). 4. Polymorphism: Ability to take multiple forms through method overloading (compile-time) and method overriding (run-time).',
    explanation: 'Encapsulation protects internal state; Abstraction simplifies interfaces; Inheritance promotes reusability; Polymorphism enables dynamic method dispatch.'
  },
  {
    category: 'technical',
    topic: 'Data Structures',
    difficulty: 'Hard',
    question: 'Compare the internal collision resolution strategies in Hash Maps: Chaining vs Open Addressing (Linear Probing, Quadratic Probing, Double Hashing).',
    sampleAnswer: 'In Separate Chaining, each bucket stores a linked list or balanced red-black tree (like Java 8 HashMap) of key-value pairs that hash to the same index. Memory overhead is due to pointers, but it degrades gracefully under high load factors. In Open Addressing, all elements reside within the bucket array itself. When a collision occurs, alternative cells are probed until an empty slot is found. Open Addressing offers better CPU cache locality but suffers from clustering when the load factor exceeds 0.7.',
    explanation: 'Chaining handles high load factors gracefully using linked nodes or trees; Open Addressing achieves superior cache locality but requires lower load factors.'
  },
  {
    category: 'technical',
    topic: 'DBMS',
    difficulty: 'Medium',
    question: 'Explain the ACID properties of database transactions and describe the 4 standard SQL transaction isolation levels.',
    sampleAnswer: 'ACID stands for Atomicity (all-or-nothing execution), Consistency (maintains valid schema constraints), Isolation (concurrent transactions execute independently), and Durability (committed changes persist despite system crashes). The 4 isolation levels are: Read Uncommitted (allows dirty reads), Read Committed (prevents dirty reads), Repeatable Read (prevents non-repeatable reads), and Serializable (strictest isolation, prevents phantom reads via lock ranges).',
    explanation: 'ACID guarantees database reliability. Higher isolation levels prevent anomalies (dirty reads, phantom reads) at the expense of concurrency throughput.'
  },
  {
    category: 'technical',
    topic: 'Operating Systems',
    difficulty: 'Medium',
    question: 'What are the 4 Coffman conditions necessary for a deadlock to occur in an operating system? How can deadlocks be prevented or avoided?',
    sampleAnswer: 'The 4 Coffman conditions are: 1. Mutual Exclusion (resources cannot be shared), 2. Hold and Wait (process holds resource while awaiting another), 3. No Preemption (resources cannot be forcefully confiscated), 4. Circular Wait (a circular chain of processes awaiting resources). Deadlocks can be prevented by invalidating any of these conditions (e.g., ordering resource acquisition to eliminate circular wait) or avoided dynamically using Dijkstra’s Banker’s Algorithm.',
    explanation: 'Breaking any one of the four Coffman conditions guarantees deadlock freedom.'
  },
  {
    category: 'technical',
    topic: 'Computer Networks',
    difficulty: 'Medium',
    question: 'Explain the 3-Way Handshake in TCP connection establishment and contrast TCP with UDP in terms of reliability and latency.',
    sampleAnswer: 'TCP 3-Way Handshake: 1. Client sends SYN (Synchronize sequence number). 2. Server responds with SYN-ACK (Acknowledging client sequence and sending server sequence). 3. Client replies with ACK. Once established, TCP guarantees reliable, ordered byte streams via checksums, sequence numbers, and retransmissions. UDP is a connectionless, lightweight protocol with zero connection setup overhead, making it ideal for low-latency streaming and gaming where occasional packet loss is acceptable.',
    explanation: 'TCP is connection-oriented, reliable, and flow-controlled. UDP is connectionless and low-latency.'
  },

  // --- HR INTERVIEW: Behavioral, STAR method, Career Goals ---
  {
    category: 'hr',
    topic: 'Self Introduction',
    difficulty: 'Easy',
    question: 'Tell me about yourself, your educational background, and what drives your passion for technology.',
    sampleAnswer: 'I am a final-year Computer Science student passionate about building scalable web solutions. Over the past four years, I have strengthened my core engineering fundamentals in data structures, algorithms, and system design, while building full-stack applications with React and Node.js. Beyond coursework, I led our campus coding club and completed an internship where I optimized API performance. I am excited to contribute my problem-solving skills to your team.',
    explanation: 'Structure: Present (current degree & core strengths) -> Past (key projects & accomplishments) -> Future (why this role excites you).'
  },
  {
    category: 'hr',
    topic: 'Company Fit',
    difficulty: 'Easy',
    question: 'Why do you want to join our company specifically rather than other tech firms?',
    sampleAnswer: 'I have closely followed your company’s engineering culture, especially your commitment to scalable distributed systems and open-source contributions. Your product directly impacts millions of users, which demands high availability and clean architecture. Joining your organization gives me the mentorship and platform to tackle challenging real-world problems alongside world-class engineers.',
    explanation: 'Demonstrate research into the company’s products, culture, and growth trajectory.'
  },
  {
    category: 'hr',
    topic: 'Strengths and Weaknesses',
    difficulty: 'Medium',
    question: 'What is your greatest technical strength, and what is one area or weakness you are actively working to improve?',
    sampleAnswer: 'My greatest strength is my persistence in debugging complex issues and learning new frameworks quickly under tight deadlines. As for an area of improvement, I used to hesitate when delegating tasks in group hackathons, wanting to verify every line of code myself. I realized this bottlenecked the team, so I have actively practiced clear sprint planning, modular documentation, and trusting my peers.',
    explanation: 'Highlight a genuine technical strength with proof, and share a real weakness followed by concrete proactive steps you took to improve.'
  },
  {
    category: 'hr',
    topic: 'Conflict Resolution',
    difficulty: 'Medium',
    question: 'Tell me about a time you faced a serious challenge or disagreement during a team project. How did you resolve it?',
    sampleAnswer: 'During our senior capstone project, our team disagreed on whether to use SQL or MongoDB for our primary database. Instead of debating subjectively, I scheduled a 30-minute sync where we mapped out our data access patterns, scalability requirements, and query complexity. We benchmarked prototype read/write operations and agreed that PostgreSQL provided the ACID guarantees and relational structure we needed. By anchoring the decision on data and team goals, we completed the sprint ahead of schedule.',
    explanation: 'Use the STAR method (Situation, Task, Action, Result). Focus on constructive, data-driven resolution without personal blame.'
  },
  {
    category: 'hr',
    topic: 'Long-term Goals',
    difficulty: 'Easy',
    question: 'Where do you see yourself in five years in your software engineering journey?',
    sampleAnswer: 'In five years, I envision myself as a Senior Full Stack Engineer, taking ownership of core system architecture, mentoring junior engineers, and contributing to strategic technical design decisions. I aim to develop deep domain expertise in scalable cloud systems while maintaining strong business acumen.',
    explanation: 'Demonstrate ambition, realistic career progression, and dedication to long-term engineering excellence.'
  }
];

async function seedDatabase() {
  try {
    await connectDB();
    console.log('[Seed] Checking database contents...');

    // 1. Seed Demo Admin & Student Users
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const adminEmail = 'admin@interviewmate.ai';
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      await User.create({
        name: 'Placement Officer / Admin',
        email: adminEmail,
        password: hashedPassword,
        college: 'InterviewMate HQ',
        degree: 'Faculty / Admin',
        graduationYear: 2024,
        targetRole: 'Platform Administrator',
        skills: ['Curriculum Design', 'Interview Moderation', 'Analytics'],
        role: 'admin'
      });
      console.log('[Seed] Created default Admin user: admin@interviewmate.ai (password123)');
    }

    const studentEmail = 'demo.student@interviewmate.ai';
    let student = await User.findOne({ email: studentEmail });
    if (!student) {
      await User.create({
        name: 'Rohan Sharma',
        email: studentEmail,
        password: hashedPassword,
        college: 'National Institute of Technology',
        degree: 'B.Tech in Computer Science',
        graduationYear: 2026,
        targetRole: 'Full Stack Software Engineer',
        skills: ['Java', 'React', 'Node.js', 'SQL', 'Data Structures', 'Docker'],
        role: 'student'
      });
      console.log('[Seed] Created default Student user: demo.student@interviewmate.ai (password123)');
    }

    // 2. Seed Questions if count is low
    const count = await Question.countDocuments();
    if (count < 15) {
      console.log(`[Seed] Current question count is ${count}. Seeding ${SEED_QUESTIONS.length} placement questions...`);
      for (const q of SEED_QUESTIONS) {
        const exists = await Question.findOne({ question: q.question });
        if (!exists) {
          await Question.create(q);
        }
      }
      console.log('[Seed] Questions seeded successfully!');
    } else {
      console.log(`[Seed] Database already populated with ${count} questions.`);
    }

    console.log('[Seed] Seeding process completed.');
  } catch (err) {
    console.error('[Seed] Error during seeding:', err.message);
  }
}

if (require.main === module) {
  seedDatabase().then(() => process.exit(0));
}

module.exports = { seedDatabase, SEED_QUESTIONS };
