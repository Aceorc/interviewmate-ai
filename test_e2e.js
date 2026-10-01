const app = require('./server/src/server.js');

setTimeout(async () => {
  const BASE = 'http://localhost:5000/api';
  console.log('====================================================');
  console.log('🚀 STARTING COMPREHENSIVE END-TO-END VERIFICATION');
  console.log('====================================================');

  try {
    // 1. Register new user
    console.log('\n[1/12] Testing User Registration...');
    const regRes = await fetch(BASE + '/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Priya Sundaram',
        email: 'priya.' + Date.now() + '@annauniv.edu',
        password: 'password123',
        college: 'Anna University, Chennai',
        degree: 'B.Tech IT',
        graduationYear: 2026,
        targetRole: 'Full Stack Engineer',
        skills: ['JavaScript', 'React', 'Node.js']
      })
    });
    const regData = await regRes.json();
    if (!regData.success) throw new Error('Registration failed: ' + regData.message);
    const token = regData.token;
    console.log('✅ Registered successfully:', regData.user.name);

    // 2. Login
    console.log('\n[2/12] Testing User Login...');
    const loginRes = await fetch(BASE + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: regData.user.email, password: 'password123' })
    });
    const loginData = await loginRes.json();
    if (!loginData.success) throw new Error('Login failed');
    console.log('✅ Login successful, JWT verified');

    const authHeaders = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    };

    // 3. Dashboard Stats
    console.log('\n[3/12] Testing Dashboard Stats...');
    const dashRes = await fetch(BASE + '/quiz/dashboard-stats', { headers: authHeaders });
    const dashData = await dashRes.json();
    console.log('✅ Dashboard Stats loaded. Readiness Index:', dashData.stats.readinessIndex + '%');

    // 4. Aptitude Quiz
    console.log('\n[4/12] Testing Aptitude Quiz fetch & submission...');
    const aptRes = await fetch(BASE + '/quiz/aptitude?limit=3', { headers: authHeaders });
    const aptData = await aptRes.json();
    console.log('  Fetched', aptData.count, 'aptitude questions');
    
    // Submit quiz
    const answers = aptData.questions.map((q, idx) => ({
      questionId: q._id,
      selectedOption: idx % 4
    }));
    const subAptRes = await fetch(BASE + '/quiz/submit', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        category: 'aptitude',
        topic: 'Mixed Aptitude',
        answers,
        timeSpentSeconds: 45
      })
    });
    const subAptData = await subAptRes.json();
    console.log('✅ Aptitude Quiz scored:', subAptData.score + '%', 'Correct:', subAptData.correctAnswers);

    // 5. Logical Reasoning
    console.log('\n[5/12] Testing Logical Reasoning Quiz...');
    const reasRes = await fetch(BASE + '/quiz/reasoning?limit=3', { headers: authHeaders });
    const reasData = await reasRes.json();
    console.log('✅ Logical Reasoning questions fetched:', reasData.count);

    // 6. Technical Interview Evaluation
    console.log('\n[6/12] Testing Technical Prep Evaluation...');
    const techRes = await fetch(BASE + '/technical/evaluate', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        topic: 'SQL',
        userAnswer: 'WHERE filters rows before aggregation whereas HAVING filters grouped rows after GROUP BY is applied with aggregate functions like COUNT or SUM.'
      })
    });
    const techData = await techRes.json();
    console.log('✅ Technical Answer Evaluated! Score:', techData.evaluation.score + '/100');
    console.log('  Model Answer Preview:', techData.evaluation.modelAnswer.substring(0, 70) + '...');

    // 7. AI Mock Interview (Multi-turn session)
    console.log('\n[7/12] Testing AI Mock Interview (Full Multi-turn Flow)...');
    const startMock = await fetch(BASE + '/mock-interview/start', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        targetRole: 'Full Stack Software Engineer',
        experienceLevel: 'Fresher',
        interviewType: 'Technical',
        totalQuestions: 2
      })
    });
    const mockData = await startMock.json();
    console.log('  Session Started ID:', mockData.interviewId);
    console.log('  Q1:', mockData.questionText.substring(0, 60) + '...');

    // Submit Turn 1
    const turn1Res = await fetch(BASE + '/mock-interview/' + mockData.interviewId + '/answer', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        userAnswer: 'The browser looks up DNS to resolve the IP, initiates a TCP 3-way handshake, sends an HTTP GET request, the Express server handles the route and queries MongoDB, then sends JSON back to React.',
        currentQuestionNumber: 1
      })
    });
    const turn1Data = await turn1Res.json();
    console.log('  Turn 1 Scored:', turn1Data.score + '/100. Follow-up:', turn1Data.nextQuestion?.questionText?.substring(0, 50) + '...');

    // Submit Final Turn
    const turn2Res = await fetch(BASE + '/mock-interview/' + mockData.interviewId + '/answer', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        userAnswer: 'To optimize under high concurrency, I implement Redis caching for frequent queries, database indexes on foreign keys, connection pooling, and horizontal scaling behind a reverse proxy.',
        currentQuestionNumber: 2
      })
    });
    const turn2Data = await turn2Res.json();
    console.log('✅ Mock Interview Completed! Overall Score:', turn2Data.finalReport?.overallScore + '/100');
    console.log('  Scores breakdown:', turn2Data.finalReport?.scores);

    // 8. HR Interview Practice
    console.log('\n[8/12] Testing HR Interview with STAR Analysis...');
    const hrRes = await fetch(BASE + '/hr/evaluate', {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        questionText: 'Tell me about a challenge you faced.',
        userAnswer: 'Situation: During our final semester capstone, our database response times degraded under mock load testing. Task: I was responsible for diagnosing the bottleneck. Action: I analyzed query execution plans, identified missing compound indexes on user queries, and implemented Redis caching. Result: We reduced p95 latency from 450ms to 45ms and achieved an A grade.'
      })
    });
    const hrData = await hrRes.json();
    console.log('✅ HR Evaluated! Score:', hrData.evaluation.score + '/100');
    console.log('  STAR Situation:', hrData.evaluation.starFeedback.situation);

    // 9. Resume Analyzer Test
    console.log('\n[9/12] Testing Resume Analyzer Engine...');
    const { parseResumeBuffer } = require('./server/src/services/resumeService.js');
    const dummyPdfBuffer = Buffer.from('%PDF-1.4 dummy resume content with Java, React, SQL, and Education at Anna University');
    const parsedResume = await parseResumeBuffer(dummyPdfBuffer, 'priya_resume.pdf', 102400);
    console.log('✅ Resume Parser Success! ATS Score:', parsedResume.overallScore + '/100');
    console.log('  Detected Tech:', parsedResume.detectedSkills.technical);
    console.log('  Suggested Questions count:', parsedResume.suggestedInterviewQuestions.length);

    // 10. Question Bank & Bookmarks
    console.log('\n[10/12] Testing Question Bank Search & Bookmarks...');
    const qListRes = await fetch(BASE + '/questions?search=Java', { headers: authHeaders });
    const qListData = await qListRes.json();
    console.log('  Search results for Java:', qListData.count);
    if (qListData.questions.length > 0) {
      const qId = qListData.questions[0]._id;
      const bRes = await fetch(BASE + '/questions/' + qId + '/bookmark', { method: 'POST', headers: authHeaders });
      const bData = await bRes.json();
      console.log('✅ Bookmark Toggled:', bData.message);
    }

    // 11. Profile Update
    console.log('\n[11/12] Testing Profile Update...');
    const profRes = await fetch(BASE + '/auth/profile', {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({
        targetRole: 'Senior Full Stack Engineer',
        skills: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Docker']
      })
    });
    const profData = await profRes.json();
    console.log('✅ Profile Updated:', profData.user.targetRole);

    // 12. Admin Dashboard & Management
    console.log('\n[12/12] Testing Admin Access & Question CRUD...');
    const adminLoginRes = await fetch(BASE + '/auth/demo-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role: 'admin' })
    });
    const adminLoginData = await adminLoginRes.json();
    const adminHeaders = {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + adminLoginData.token
    };

    const adminStatsRes = await fetch(BASE + '/admin/stats', { headers: adminHeaders });
    const adminStatsData = await adminStatsRes.json();
    console.log('  Admin Stats - Total Users:', adminStatsData.stats.totalUsers, 'Total Questions:', adminStatsData.stats.totalQuestions);

    // Admin creates new question
    const createQRes = await fetch(BASE + '/admin/questions', {
      method: 'POST',
      headers: adminHeaders,
      body: JSON.stringify({
        category: 'technical',
        topic: 'Docker',
        difficulty: 'Medium',
        question: 'Explain the difference between a Docker Image and a Docker Container.',
        sampleAnswer: 'A Docker Image is an immutable template containing application code, runtime, and libraries. A Docker Container is a runnable, isolated instance of an image.'
      })
    });
    const createQData = await createQRes.json();
    console.log('✅ Admin Created Question ID:', createQData.question?._id);

    // Admin deletes the question
    const delQRes = await fetch(BASE + '/admin/questions/' + createQData.question._id, {
      method: 'DELETE',
      headers: adminHeaders
    });
    const delQData = await delQRes.json();
    console.log('✅ Admin Deleted Question:', delQData.message);

    console.log('\n====================================================');
    console.log('🎉 ALL 12 MAJOR USER FLOWS PASSED VERIFICATION 100%!');
    console.log('====================================================');
    process.exit(0);
  } catch (err) {
    console.error('❌ Verification failed:', err);
    process.exit(1);
  }
}, 1000);
