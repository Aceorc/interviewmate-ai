const https = require('https');
const { isGibberishOrRandomInput } = require('../utils/answerValidator');

// Helper to make Gemini API calls
async function callGemini(prompt, systemInstruction = '') {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null; // Trigger intelligent fallback
  }

  const payload = JSON.stringify({
    contents: [
      {
        parts: [
          { text: prompt }
        ]
      }
    ],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1200
    }
  });

  return new Promise((resolve) => {
    const options = {
      hostname: 'generativelanguage.googleapis.com',
      path: `/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      },
      timeout: 8000
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) {
            resolve(text);
          } else {
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    });

    req.on('error', () => resolve(null));
    req.on('timeout', () => {
      req.destroy();
      resolve(null);
    });

    req.write(payload);
    req.end();
  });
}

// 1. Technical Answer Evaluator
async function evaluateTechnicalAnswer({ topic, question, userAnswer, sampleAnswer, codeSnippet }) {
  const cleanAnswer = (userAnswer || '').trim();

  // Rule 1: Empty or whitespace answer -> 0 marks
  if (!cleanAnswer || cleanAnswer.length === 0) {
    return {
      score: 0,
      feedback: "No answer provided. In a technical interview, you must provide a detailed explanation of the concept to receive marks.",
      conceptualExplanation: sampleAnswer || "A complete answer demonstrates conceptual depth, edge case handling, and real-world applicability.",
      strengths: [],
      missingPoints: ["Core definitions", "Implementation details", "Complexity analysis"],
      modelAnswer: sampleAnswer || "Refer to the standard documentation for standard design patterns and optimal implementation."
    };
  }

  // Rule 2: Random keyboard input or gibberish (e.g. "safdtfkyvbvgf", "asdfghjkl") -> 0 marks
  if (isGibberishOrRandomInput(cleanAnswer)) {
    return {
      score: 0,
      feedback: `Your response was identified as invalid or random keyboard input ("${cleanAnswer.slice(0, 35)}"). Technical interview questions require genuine conceptual answers to receive marks. Score: 0/100.`,
      conceptualExplanation: sampleAnswer || `Mastering this concept is essential for technical rounds. Always start with a 1-sentence crisp definition, follow with the underlying mechanism, provide an example, and close with trade-offs.`,
      strengths: [],
      missingPoints: ["Valid technical explanation", "Relevant foundational concepts", "Concrete implementation details"],
      modelAnswer: sampleAnswer || "A comprehensive answer defines the concept precisely, demonstrates implementation syntax, and explains how it optimizes performance in production applications."
    };
  }

  // Try live Gemini first
  const geminiPrompt = `You are a Senior Technical Interviewer evaluating a candidate's answer.
Topic: ${topic}
Question: ${question}
Candidate's Answer: "${cleanAnswer}"
Expected Reference / Sample: "${sampleAnswer || 'N/A'}"

CRITICAL MARKING RULES:
1. If the candidate's answer is random keyboard input (e.g. "safdtfkyvbvgf", "asdfghjkl"), gibberish, completely wrong, or irrelevant, you MUST assign a score of EXACTLY 0.
2. Do NOT award default, pity, or baseline marks for wrong or invalid submissions.
3. Only award positive scores (up to 100) when the answer is genuinely relevant and technically accurate according to the expected reference.

Evaluate the candidate's answer objectively. Return ONLY valid JSON in this exact structure:
{
  "score": <number between 0 and 100>,
  "feedback": "<constructive feedback on their answer>",
  "conceptualExplanation": "<clear, educational explanation of the topic>",
  "strengths": ["<strength 1>", "<strength 2>"],
  "missingPoints": ["<missing point 1>", "<missing point 2>"],
  "modelAnswer": "<an exemplary, placement-ready answer for this question>"
}`;

  const aiResult = await callGemini(geminiPrompt);
  if (aiResult) {
    try {
      const jsonMatch = aiResult.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        // Safety guard: if AI hallucinates a positive score on gibberish, enforce 0
        if (isGibberishOrRandomInput(cleanAnswer)) {
          parsed.score = 0;
        }
        return parsed;
      }
    } catch (e) {
      // Fallback
    }
  }

  // Built-in intelligent heuristic engine
  const topicKeywords = {
    Java: ['jvm', 'heap', 'stack', 'garbage', 'thread', 'interface', 'polymorphism', 'inheritance', 'static', 'final', 'collection', 'string', 'builder', 'buffer', 'synchronized', 'immutable', 'mutable'],
    Python: ['gil', 'generator', 'decorator', 'list', 'dictionary', 'tuple', 'lambda', 'memory', 'mutable', 'dunder', 'multiprocessing', 'thread', 'cpython'],
    C: ['pointer', 'dangling', 'leak', 'malloc', 'calloc', 'free', 'memory', 'heap', 'stack', 'null', 'valgrind', 'segmentation'],
    SQL: ['index', 'join', 'group by', 'having', 'where', 'aggregate', 'primary key', 'foreign key', 'acid', 'transaction', 'normalization', 'clause'],
    OOP: ['encapsulation', 'abstraction', 'inheritance', 'polymorphism', 'class', 'object', 'coupling', 'cohesion'],
    'Data Structures': ['complexity', 'o(n)', 'o(1)', 'o(log n)', 'binary', 'tree', 'graph', 'hash', 'linked list', 'queue', 'stack'],
    DBMS: ['acid', 'atomicity', 'consistency', 'isolation', 'durability', 'b-tree', 'indexing', 'view', 'trigger', 'concurrency'],
    'Operating Systems': ['process', 'thread', 'deadlock', 'semaphore', 'mutex', 'paging', 'virtual memory', 'scheduling', 'kernel'],
    'Computer Networks': ['tcp', 'udp', 'osi', 'ip', 'handshake', 'latency', 'bandwidth', 'packet', 'router', 'dns', 'http', 'https']
  };

  const relevant = topicKeywords[topic] || ['concept', 'logic', 'system', 'data', 'performance'];
  let matches = 0;
  const lowerAnswer = cleanAnswer.toLowerCase();

  // Also check overlap with sampleAnswer and question keywords
  const refTokens = (sampleAnswer + ' ' + question).toLowerCase().split(/[^a-zA-Z0-9]+/).filter(w => w.length > 3);
  const refSet = new Set(refTokens);
  let refMatches = 0;

  relevant.forEach(kw => {
    if (lowerAnswer.includes(kw)) matches++;
  });

  lowerAnswer.split(/\s+/).forEach(w => {
    if (refSet.has(w)) refMatches++;
  });

  // Rule 3: Irrelevant answer with 0 concept matches -> 0 marks
  if (matches === 0 && refMatches < 2) {
    return {
      score: 0,
      feedback: `Your response does not address the technical subject (${topic}) or the specific question asked. A score of 0/100 has been recorded. Review the model answer below.`,
      conceptualExplanation: sampleAnswer || `In ${topic}, mastering this concept is essential for technical rounds. Always start with a 1-sentence crisp definition, follow with the underlying mechanism, provide an example, and close with trade-offs.`,
      strengths: [],
      missingPoints: [`Address the core question directly`, `Include relevant technical terminology (e.g. ${relevant.slice(0, 3).join(', ')})`],
      modelAnswer: sampleAnswer || `A comprehensive answer defines the concept precisely, demonstrates implementation syntax, and explains how it optimizes performance in production applications.`
    };
  }

  // Calculate score strictly based on genuine technical relevance & depth
  const wordCount = cleanAnswer.split(/\s+/).length;
  let finalScore = Math.min(matches * 20 + Math.min(refMatches * 5, 25), 80);
  if (wordCount > 25 && matches >= 2) finalScore += 10;
  if (wordCount > 50 && matches >= 3) finalScore += 10;
  finalScore = Math.min(Math.max(finalScore, 0), 98);

  const strengths = [];
  if (matches > 0) strengths.push(`Mentioned relevant technical terms such as ${relevant.filter(k => lowerAnswer.includes(k)).slice(0, 3).join(', ')}.`);
  if (wordCount >= 25) strengths.push("Provided a structured response with contextual detail.");
  if (strengths.length === 0) strengths.push("Touched upon related terminology.");

  const missingPoints = [];
  if (matches < 2) missingPoints.push(`Incorporate core foundational terminology (e.g., ${relevant.slice(0, 3).join(', ')}).`);
  if (!lowerAnswer.includes('example') && !lowerAnswer.includes('for instance') && !lowerAnswer.includes('e.g.')) {
    missingPoints.push("Include a concrete code or real-world architectural example.");
  }
  if (!lowerAnswer.includes('trade-off') && !lowerAnswer.includes('complexity') && !lowerAnswer.includes('performance')) {
    missingPoints.push("Discuss performance implications or trade-offs (time vs memory).");
  }

  return {
    score: finalScore,
    feedback: `Technical answer evaluated. Score: ${finalScore}/100. ${
      finalScore >= 70
        ? "Your answer demonstrated solid conceptual clarity."
        : "You have the right intuition, but adding deeper technical terminology and concrete examples will make your answer stand out to interviewers."
    }`,
    conceptualExplanation: sampleAnswer || `In ${topic}, mastering this concept is essential for technical rounds. Always start with a 1-sentence crisp definition, follow with the underlying mechanism, provide an example, and close with trade-offs.`,
    strengths,
    missingPoints: missingPoints.length > 0 ? missingPoints : ["Add an edge-case discussion to achieve full marks."],
    modelAnswer: sampleAnswer || `A comprehensive answer defines the concept precisely, demonstrates implementation syntax, and explains how it optimizes performance in production applications.`
  };
}

// 2. Mock Interview Step Evaluator & Follow-up Generator
async function evaluateMockStep({ role, experienceLevel, interviewType, question, userAnswer, questionNumber, totalQuestions }) {
  const cleanAnswer = (userAnswer || '').trim();
  const isLast = questionNumber >= totalQuestions;

  // Empty answer -> score: 0
  if (!cleanAnswer) {
    return {
      score: 0,
      feedback: "No answer was provided. Try to attempt every interview question.",
      followUpQuestion: isLast ? "" : "Let's move on to the next question. Can you tell me about a project you worked on recently?"
    };
  }

  // Random keyboard input or gibberish -> score: 0
  if (isGibberishOrRandomInput(cleanAnswer)) {
    return {
      score: 0,
      feedback: "Your response was detected as invalid or random keyboard input. A score of 0 has been recorded.",
      followUpQuestion: isLast ? "" : "Let's try another topic. How do you approach debugging when facing an unexpected error?"
    };
  }

  // Try Gemini
  const prompt = `You are a friendly yet rigorous campus placement interviewer conducting a ${interviewType} interview for a ${role} (${experienceLevel} position).
Question #${questionNumber} of ${totalQuestions}: "${question}"
Candidate's response: "${cleanAnswer}"

CRITICAL RULE: If the candidate's answer is gibberish, completely irrelevant, or nonsense, return a score of 0. Otherwise score between 10 and 100 based on accuracy, structure, and communication.

Task:
1. Provide a numerical score (0 to 100).
2. Give constructive, coaching feedback (2-3 sentences).
3. ${isLast ? 'Since this was the final question, set followUpQuestion to empty string.' : 'Formulate a natural, engaging next question or follow-up question related to the conversation.'}

Return strictly JSON:
{
  "score": <number>,
  "feedback": "<feedback string>",
  "followUpQuestion": "<question string or ''>"
}`;

  const aiResult = await callGemini(prompt);
  if (aiResult) {
    try {
      const match = aiResult.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        const score = typeof parsed.score === 'number' ? Math.max(0, Math.min(100, parsed.score)) : 0;
        return {
          score,
          feedback: parsed.feedback || (score === 0 ? "Response did not meet technical requirements." : "Good response."),
          followUpQuestion: isLast ? "" : (parsed.followUpQuestion || "Can you share how you handled an unexpected hurdle in that context?")
        };
      }
    } catch (e) {}
  }

  // Fallback heuristic (no arbitrary 50 baseline)
  const words = cleanAnswer.split(/\s+/).length;
  if (words < 5) {
    return {
      score: 0,
      feedback: "Response is too brief to evaluate meaningfully. Elaborate with specific details.",
      followUpQuestion: isLast ? "" : "Can you expand more on your experience with this topic?"
    };
  }

  // Check relevance to question keywords
  const qTokens = question.toLowerCase().split(/[^a-zA-Z0-9]+/).filter(w => w.length > 3);
  const lowerAnswer = cleanAnswer.toLowerCase();
  let matches = 0;
  qTokens.forEach(t => { if (lowerAnswer.includes(t)) matches++; });

  if (matches === 0 && words < 15) {
    return {
      score: 0,
      feedback: "Your response does not appear to address the question asked.",
      followUpQuestion: isLast ? "" : "Let's move on. What programming languages or tools are you most comfortable with?"
    };
  }

  let score = Math.min(matches * 20, 60);
  if (words > 20) score += 15;
  if (words > 40) score += 15;
  score = Math.min(Math.max(score, 0), 92);

  const feedback = score >= 60
    ? `Strong response! You communicated your points with good clarity.`
    : `A start, but consider giving more concrete examples and structure to fully address the question.`;

  const followUps = {
    Technical: [
      "How would you optimize that solution if the data size grew tenfold?",
      "Can you explain the main trade-offs you considered when making that design choice?",
      "How would you unit test that component to ensure robust reliability?"
    ],
    HR: [
      "That's insightful. Could you describe a specific time when you had to resolve a disagreement within your team?",
      "How did you prioritize competing deadlines during that project?",
      "What did that experience teach you about your own leadership and communication style?"
    ],
    Mixed: [
      "How do you keep yourself updated with rapid advancements in modern software engineering?",
      "Walk me through a situation where a technical bug appeared in production and how you troubleshot it under pressure.",
      "Where do you see yourself contributing most within our engineering organization over the next two years?"
    ]
  };

  const pool = followUps[interviewType] || followUps.Mixed;
  const followUpQuestion = isLast ? "" : pool[(questionNumber - 1) % pool.length];

  return {
    score,
    feedback,
    followUpQuestion
  };
}

// 3. Final Mock Report Generator
async function generateFinalMockReport({ role, experienceLevel, interviewType, dialogue }) {
  const avgScore = dialogue.length > 0
    ? Math.round(dialogue.reduce((acc, cur) => acc + (cur.score || 70), 0) / dialogue.length)
    : 75;

  const prompt = `You are a Lead Hiring Manager creating an official Interview Scorecard for a campus candidate.
Role: ${role} (${experienceLevel})
Interview Type: ${interviewType}
Candidate's responses and scores:
${JSON.stringify(dialogue.map(d => ({ q: d.questionText, a: d.userAnswer, score: d.score })))}

Generate a detailed final scorecard with:
- overallScore (0-100)
- scores: { technicalKnowledge, communication, problemSolving, confidenceClarity } (each 0-100)
- strengths (3 bullet points)
- areasToImprove (3 bullet points)
- recommendedTopics (4 topic names)

Return strictly JSON in that format.`;

  const aiResult = await callGemini(prompt);
  if (aiResult) {
    try {
      const match = aiResult.match(/\{[\s\S]*\}/);
      if (match) {
        return JSON.parse(match[0]);
      }
    } catch (e) {}
  }

  // Fallback evaluation
  return {
    overallScore: avgScore,
    scores: {
      technicalKnowledge: Math.min(Math.max(avgScore + Math.floor(Math.random() * 8) - 4, 55), 98),
      communication: Math.min(Math.max(avgScore + Math.floor(Math.random() * 10) - 3, 60), 96),
      problemSolving: Math.min(Math.max(avgScore + Math.floor(Math.random() * 8) - 4, 55), 95),
      confidenceClarity: Math.min(Math.max(avgScore + Math.floor(Math.random() * 6) - 2, 60), 97)
    },
    strengths: [
      "Demonstrated good clarity when articulating thoughts under timed pressure.",
      "Structured answers logically with clear problem context.",
      "Showed genuine enthusiasm for the role and learning new technologies."
    ],
    areasToImprove: [
      "Elaborate more on quantifiable business or academic impact in project explanations.",
      "Brush up on time/space complexity analysis when discussing algorithms.",
      "Practice STAR framework to make behavioral stories even more punchy."
    ],
    recommendedTopics: [
      "System Design & Scalability Principles",
      "Data Structures (Trees, Graphs & Dynamic Programming)",
      "Behavioral STAR Framework practice",
      "Database Indexing & Query Optimization"
    ]
  };
}

// 4. HR Answer Evaluator
async function evaluateHRAnswer({ question, userAnswer }) {
  const cleanAnswer = (userAnswer || '').trim();

  // Rule 1: Empty answer -> 0 marks
  if (!cleanAnswer) {
    return {
      score: 0,
      feedback: "No answer was provided. A score of 0/100 has been recorded.",
      starFeedback: {
        situation: "No answer provided.",
        task: "No answer provided.",
        action: "No answer provided.",
        result: "No answer provided."
      },
      improvementTip: "Make sure to answer the question using the STAR technique (Situation, Task, Action, Result)."
    };
  }

  // Rule 2: Random keyboard input or gibberish -> 0 marks
  if (isGibberishOrRandomInput(cleanAnswer)) {
    return {
      score: 0,
      feedback: "Your response was detected as invalid or random keyboard input. A score of 0/100 has been recorded.",
      starFeedback: {
        situation: "Invalid input / gibberish",
        task: "Invalid input / gibberish",
        action: "Invalid input / gibberish",
        result: "Invalid input / gibberish"
      },
      improvementTip: "Avoid typing random characters. Craft a thoughtful, coherent story detailing your academic or project experiences using the STAR method."
    };
  }

  const wordCount = cleanAnswer.split(/\s+/).length;

  // Rule 3: Very short response (under 8 words) that cannot satisfy any STAR structure
  if (wordCount < 8) {
    return {
      score: 0,
      feedback: "Your response is too brief to evaluate against behavioral competencies. An HR behavioral answer requires structured depth. Score: 0/100.",
      starFeedback: {
        situation: "Lacks sufficient context.",
        task: "Objective is not defined.",
        action: "No specific personal actions detailed.",
        result: "No measurable outcome or key learning."
      },
      improvementTip: "Use the STAR technique: Describe the Situation, the Task at hand, the specific Actions you took, and the positive Result achieved."
    };
  }

  const prompt = `You are an HR Executive evaluating a fresh graduate's interview answer.
Question: "${question}"
Candidate's Answer: "${cleanAnswer}"

CRITICAL EVALUATION RULES:
1. If the candidate's answer is gibberish, keyboard mashing, completely off-topic, or non-responsive to the question, award a score of 0.
2. Otherwise, evaluate using the STAR technique (Situation, Task, Action, Result) with a fair score between 10 and 100 based on structure, clarity, and impact.

Return strictly valid JSON:
{
  "score": <0-100>,
  "feedback": "<constructive feedback>",
  "starFeedback": {
    "situation": "<evaluation of situation context>",
    "task": "<evaluation of objective/task>",
    "action": "<evaluation of actions taken>",
    "result": "<evaluation of outcome/learnings>"
  },
  "improvementTip": "<actionable advice>"
}`;

  const aiResult = await callGemini(prompt);
  if (aiResult) {
    try {
      const match = aiResult.match(/\{[\s\S]*\}/);
      if (match) {
        const parsed = JSON.parse(match[0]);
        const score = typeof parsed.score === 'number' ? Math.max(0, Math.min(100, parsed.score)) : 0;
        return {
          score,
          feedback: parsed.feedback || (score === 0 ? "Response did not meet behavioral requirements." : "Answer evaluated."),
          starFeedback: parsed.starFeedback || {
            situation: score > 0 ? "Identified situation." : "Missing.",
            task: score > 0 ? "Identified task." : "Missing.",
            action: score > 0 ? "Identified actions." : "Missing.",
            result: score > 0 ? "Identified results." : "Missing."
          },
          improvementTip: parsed.improvementTip || "Use the STAR framework for behavioral responses."
        };
      }
    } catch (e) {}
  }

  // Heuristic evaluation for legitimate responses (no arbitrary positive baseline!)
  const lowerAnswer = cleanAnswer.toLowerCase();
  
  // STAR component detection
  const situationKeywords = ['when', 'during', 'project', 'team', 'college', 'time', 'company', 'problem', 'challenge', 'assigned', 'situation', 'semester', 'task', 'goal'];
  const actionKeywords = ['i decided', 'i did', 'i created', 'i developed', 'i implemented', 'i led', 'i communicated', 'i worked', 'i resolved', 'my role', 'i took', 'i spoke', 'i organized', 'action', 'steps', 'approach'];
  const resultKeywords = ['result', 'achieved', 'outcome', 'learned', 'improved', 'delivered', 'successful', 'completed', 'finally', 'feedback', 'takeaway', 'impact', 'growth'];

  let situationScore = 0;
  let actionScore = 0;
  let resultScore = 0;

  situationKeywords.forEach(kw => { if (lowerAnswer.includes(kw)) situationScore = Math.min(situationScore + 8, 25); });
  actionKeywords.forEach(kw => { if (lowerAnswer.includes(kw)) actionScore = Math.min(actionScore + 10, 40); });
  resultKeywords.forEach(kw => { if (lowerAnswer.includes(kw)) resultScore = Math.min(resultScore + 10, 25); });

  // Relevance to question keywords
  const qTokens = question.toLowerCase().split(/[^a-zA-Z0-9]+/).filter(w => w.length > 3 && !['what', 'tell', 'describe', 'about', 'your', 'have', 'when', 'with'].includes(w));
  let qMatches = 0;
  qTokens.forEach(t => { if (lowerAnswer.includes(t)) qMatches++; });

  // If the answer mentions neither STAR components nor question context, it's irrelevant -> 0 marks
  if (situationScore === 0 && actionScore === 0 && resultScore === 0 && qMatches === 0) {
    return {
      score: 0,
      feedback: "Your response does not address the behavioral interview question asked. A score of 0/100 has been recorded.",
      starFeedback: {
        situation: "Not relevant to the question.",
        task: "Objective missing.",
        action: "No relevant actions described.",
        result: "No relevant outcomes."
      },
      improvementTip: "Relate your answer directly to the question prompt and structure it with Situation, Task, Action, and Result."
    };
  }

  let calculatedScore = situationScore + actionScore + resultScore;
  if (qMatches > 0) calculatedScore += Math.min(qMatches * 5, 10);
  if (wordCount >= 30 && calculatedScore > 0) calculatedScore += 5;
  calculatedScore = Math.min(Math.max(calculatedScore, 0), 95);

  return {
    score: calculatedScore,
    feedback: calculatedScore >= 70
      ? "Strong behavioral response! You conveyed your personal experience with good STAR structure."
      : calculatedScore >= 40
      ? "Decent response, but strengthening your action details and quantifiable results will make it much more compelling."
      : "Your answer touches upon the topic but needs much clearer structure and specific actions.",
    starFeedback: {
      situation: situationScore > 0 ? "Provided context regarding the situation or challenge." : "Context was vague or missing.",
      task: situationScore >= 15 ? "Stated the task and objective clearly." : "Could define the specific challenge/goal more clearly.",
      action: actionScore >= 20 ? "Detailed personal ownership and specific actions taken." : "Specify more detailed personal actions you personally carried out.",
      result: resultScore > 0 ? "Concluded with a positive outcome or learning." : "Quantify results or mention key lessons learned to leave a stronger impression."
    },
    improvementTip: "Remember to quantify your achievements (e.g. 'boosted efficiency by 20%' or 'delivered 2 days ahead of schedule') whenever possible."
  };
}

module.exports = {
  evaluateTechnicalAnswer,
  evaluateMockStep,
  generateFinalMockReport,
  evaluateHRAnswer
};
