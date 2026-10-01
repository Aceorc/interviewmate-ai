/**
 * Strict Answer Validation and Marking Utility for InterviewMate AI
 * 
 * Enforces Core Marking Rules:
 * - CORRECT ANSWER -> configured marks
 * - WRONG VALID ANSWER -> 0 marks
 * - RANDOM KEYBOARD INPUT -> 0 marks
 * - INVALID ANSWER -> 0 marks
 * - EMPTY / NULL / UNDEFINED ANSWER -> 0 marks
 * - UNKNOWN OPTION -> 0 marks
 * 
 * Strictly prohibits fuzzy, partial, or default/fallback scoring.
 */

// Common keyboard mashing sequences (forward and reverse)
const KEYBOARD_MASH_PATTERNS = [
  'qwerty', 'wertyu', 'ertyui', 'rtyuio', 'tyuiop',
  'asdfgh', 'sdfghj', 'dfghjk', 'fghjkl', 'ghjkl;',
  'zxcvbn', 'xcvbnm',
  'poiuyt', 'lkjhgf', 'mnbvcx',
  '123456', '234567', '345678', '456789', '987654'
];

// Common valid English words to distinguish legitimate short/medium answers from keyboard spam
const COMMON_DICTIONARY_WORDS = new Set([
  'the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have', 'i', 'it', 'for', 'not', 'on', 'with', 'he',
  'as', 'you', 'do', 'at', 'this', 'but', 'his', 'by', 'from', 'they', 'we', 'say', 'her', 'she', 'or',
  'an', 'will', 'my', 'one', 'all', 'would', 'there', 'their', 'what', 'so', 'up', 'out', 'if', 'about',
  'who', 'get', 'which', 'go', 'me', 'when', 'make', 'can', 'like', 'time', 'no', 'just', 'him', 'know',
  'take', 'people', 'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other', 'than', 'then',
  'now', 'look', 'only', 'come', 'its', 'over', 'think', 'also', 'back', 'after', 'use', 'two', 'how', 'our',
  'work', 'first', 'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give', 'day', 'most', 'us',
  // Technical / professional common vocabulary
  'string', 'builder', 'buffer', 'java', 'python', 'thread', 'memory', 'heap', 'stack', 'safe', 'safety',
  'mutable', 'immutable', 'object', 'class', 'method', 'lock', 'gil', 'process', 'sql', 'query', 'table',
  'where', 'having', 'join', 'index', 'database', 'pointer', 'leak', 'free', 'malloc', 'team', 'project',
  'situation', 'task', 'action', 'result', 'learned', 'goal', 'leadership', 'challenge', 'solution', 'bug',
  'code', 'performance', 'data', 'algorithm', 'system', 'design', 'frontend', 'backend', 'api', 'server',
  'client', 'react', 'node', 'component', 'function', 'test', 'testing', 'error', 'debug', 'developer',
  'computer', 'network', 'protocol', 'tcp', 'ip', 'http', 'https', 'speed', 'time', 'work', 'profit',
  'loss', 'percent', 'percentage', 'ratio', 'series', 'number', 'reasoning', 'question', 'answer'
]);

/**
 * Detects whether a free-text input is random keyboard input, gibberish, or completely invalid.
 * @param {string} text - The submitted text.
 * @returns {boolean} - true if the text is gibberish or invalid, false if it appears to be genuine text.
 */
function isGibberishOrRandomInput(text) {
  if (!text || typeof text !== 'string') return true;
  const clean = text.trim();
  if (clean.length === 0) return true;

  // Very short non-word text (e.g. "n", "ccc", "as", single random chars)
  if (clean.length < 4 && !COMMON_DICTIONARY_WORDS.has(clean.toLowerCase())) {
    return true;
  }

  const lower = clean.toLowerCase();

  // Check 1: Keyboard row mashing patterns (e.g. "asdfghjk", "qwertyuiop", "zxcvbnm")
  for (const mash of KEYBOARD_MASH_PATTERNS) {
    if (lower.includes(mash)) {
      return true;
    }
  }

  // Check 2: Repeated character spam (e.g. "aaaaa", "xxxxxxx", "111111")
  if (/(.)\1{4,}/.test(clean)) {
    return true;
  }

  // Check 3: Repetitive substring pattern (e.g. "xyzxyz", "abcabcabc")
  if (/^(.{2,4})\1{2,}$/.test(clean)) {
    return true;
  }

  // Split into words, strip non-alphanumeric punctuation
  const words = clean.split(/\s+/).map(w => w.replace(/[^a-zA-Z0-9]/g, '').toLowerCase()).filter(Boolean);
  if (words.length === 0) return true;

  // Check 4: Excessive consonant clusters (e.g. "safdtfkyvbvgf" has "fdtfk" and "vbvgf")
  // In English, 5 consecutive pure consonants without a vowel (a, e, i, o, u, y) is gibberish
  if (words.length <= 3 && /[bcdfghjklmnpqrstvwxz]{5,}/i.test(clean)) {
    return true;
  }

  // Check 5: Word-level dictionary and phonology validation
  // For single-word submissions, it must be a recognized valid term, valid number, or phonologically sound
  if (words.length === 1) {
    const singleWord = words[0];
    if (/^\d+(\.\d+)?%?$/.test(singleWord)) return false; // valid number/percentage
    if (COMMON_DICTIONARY_WORDS.has(singleWord)) return false;
    // Check vowel-to-consonant ratio
    const vowels = (singleWord.match(/[aeiouy]/gi) || []).length;
    const ratio = vowels / singleWord.length;
    if (ratio < 0.20 || ratio > 0.85) return true;
    // Pure consonant cluster in single word
    if (/[bcdfghjklmnpqrstvwxz]{5,}/i.test(singleWord)) return true;
    // If it's a random string of 7+ chars not in dictionary with 4 pure consonants
    if (singleWord.length >= 7 && /[bcdfghjklmnpqrstvwxz]{4,}/i.test(singleWord)) return true;
  }

  // For multi-word submissions, check how many words are recognized or have valid English phonology
  let recognizedCount = 0;
  for (const w of words) {
    if (COMMON_DICTIONARY_WORDS.has(w) || /^\d+$/.test(w)) {
      recognizedCount++;
    } else {
      // Check if word has valid vowel ratio
      const vowels = (w.match(/[aeiouy]/gi) || []).length;
      const ratio = w.length > 0 ? vowels / w.length : 0;
      if (ratio >= 0.20 && ratio <= 0.85 && !/[bcdfghjklmnpqrstvwxz]{5,}/i.test(w)) {
        recognizedCount += 0.7; // credit for valid technical or domain term
      }
    }
  }

  // If less than 35% of words are recognizable/valid, consider it spam
  const validityRatio = recognizedCount / words.length;
  if (validityRatio < 0.35) {
    return true;
  }

  return false;
}

/**
 * Normalizes question correct answer to integer option index.
 * @param {Object} question - The question document
 * @returns {number|null} - 0-indexed integer or null if invalid
 */
function getNormalizedCorrectAnswerIndex(question) {
  if (!question || question.correctAnswer === null || question.correctAnswer === undefined) {
    return null;
  }

  const raw = question.correctAnswer;

  // Case 1: Already an integer index (0, 1, 2, 3)
  if (typeof raw === 'number' && Number.isInteger(raw)) {
    if (question.options && raw >= 0 && raw < question.options.length) {
      return raw;
    }
  }

  // Case 2: String numeric index ('0', '1', '2', '3')
  if (typeof raw === 'string' && /^\d+$/.test(raw.trim())) {
    const idx = parseInt(raw.trim(), 10);
    if (question.options && idx >= 0 && idx < question.options.length) {
      return idx;
    }
  }

  // Case 3: Letter ('A', 'B', 'C', 'D' / 'a', 'b', 'c', 'd')
  if (typeof raw === 'string' && /^[a-dA-D]$/.test(raw.trim())) {
    const letterIdx = raw.trim().toUpperCase().charCodeAt(0) - 65;
    if (question.options && letterIdx >= 0 && letterIdx < question.options.length) {
      return letterIdx;
    }
  }

  // Case 4: Exact string match with one of the options
  if (typeof raw === 'string' && question.options && Array.isArray(question.options)) {
    const target = raw.trim().toLowerCase();
    const foundIdx = question.options.findIndex(opt => opt.trim().toLowerCase() === target);
    if (foundIdx !== -1) {
      return foundIdx;
    }
  }

  return null;
}

/**
 * Strictly validates an MCQ answer submission against question options and correct answer.
 * NO fuzzy, NO partial, NO similarity, NO guessing.
 *
 * @param {Object} question - The question object from DB
 * @param {*} submittedOption - The user's submitted option (index, letter, or string)
 * @returns {Object} validationResult: { isAnswered, isValid, isCorrect, normalizedSelected, normalizedCorrect, marksAwarded, maxMarks }
 */
function validateMCQAnswer(question, submittedOption) {
  // 1. Resolve configured marks
  const configuredMarks = Number(question?.marks) > 0
    ? Number(question.marks)
    : (question?.category === 'reasoning' ? 15 : question?.category === 'technical' ? 50 : 10);

  // 2. Check whether an answer was submitted
  if (
    submittedOption === null ||
    submittedOption === undefined ||
    submittedOption === '' ||
    (typeof submittedOption === 'string' && submittedOption.trim() === '')
  ) {
    return {
      isAnswered: false,
      isValid: false,
      isCorrect: false,
      normalizedSelected: null,
      normalizedCorrect: getNormalizedCorrectAnswerIndex(question),
      marksAwarded: 0,
      maxMarks: configuredMarks,
      reason: 'unanswered'
    };
  }

  const options = question?.options || [];
  if (!Array.isArray(options) || options.length === 0) {
    return {
      isAnswered: true,
      isValid: false,
      isCorrect: false,
      normalizedSelected: null,
      normalizedCorrect: null,
      marksAwarded: 0,
      maxMarks: configuredMarks,
      reason: 'question_has_no_options'
    };
  }

  // 3. Strictly validate if submittedOption is a valid option for this question
  let selectedIndex = null;

  // A) Integer index (e.g. 0, 1, 2, 3)
  if (typeof submittedOption === 'number' && Number.isInteger(submittedOption)) {
    if (submittedOption >= 0 && submittedOption < options.length) {
      selectedIndex = submittedOption;
    }
  }
  // B) String integer ('0', '1', '2', '3')
  else if (typeof submittedOption === 'string' && /^\d+$/.test(submittedOption.trim())) {
    const parsed = parseInt(submittedOption.trim(), 10);
    if (parsed >= 0 && parsed < options.length) {
      selectedIndex = parsed;
    }
  }
  // C) Single option letter ('A', 'B', 'C', 'D' / 'a', 'b', 'c', 'd')
  else if (typeof submittedOption === 'string' && /^[a-zA-Z]$/.test(submittedOption.trim())) {
    const letterCode = submittedOption.trim().toUpperCase().charCodeAt(0) - 65;
    if (letterCode >= 0 && letterCode < options.length) {
      selectedIndex = letterCode;
    }
  }
  // D) Exact option text match (case-insensitive, exact trimmed equality ONLY - NO contains or startsWith)
  else if (typeof submittedOption === 'string') {
    const cleanSubmitted = submittedOption.trim().toLowerCase();
    const matchedIdx = options.findIndex(opt => opt.trim().toLowerCase() === cleanSubmitted);
    if (matchedIdx !== -1) {
      selectedIndex = matchedIdx;
    }
  }

  // If it didn't match any valid option strictly:
  // Random text like "safdtfkyvbvgf", "Pythonxxx", "123456", "Hello" -> INVALID OPTION -> 0 marks
  if (selectedIndex === null) {
    return {
      isAnswered: true,
      isValid: false,
      isCorrect: false,
      normalizedSelected: null,
      normalizedCorrect: getNormalizedCorrectAnswerIndex(question),
      marksAwarded: 0,
      maxMarks: configuredMarks,
      reason: 'invalid_option'
    };
  }

  // 4. Compare with the stored correct answer
  const correctIndex = getNormalizedCorrectAnswerIndex(question);

  if (correctIndex === null) {
    return {
      isAnswered: true,
      isValid: true,
      isCorrect: false,
      normalizedSelected: selectedIndex,
      normalizedCorrect: null,
      marksAwarded: 0,
      maxMarks: configuredMarks,
      reason: 'correct_answer_missing'
    };
  }

  const isCorrect = selectedIndex === correctIndex;
  const marksAwarded = isCorrect ? configuredMarks : 0;

  return {
    isAnswered: true,
    isValid: true,
    isCorrect,
    normalizedSelected: selectedIndex,
    normalizedCorrect: correctIndex,
    marksAwarded,
    maxMarks: configuredMarks,
    reason: isCorrect ? 'correct' : 'wrong_option'
  };
}

module.exports = {
  isGibberishOrRandomInput,
  getNormalizedCorrectAnswerIndex,
  validateMCQAnswer
};
