import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useToast } from '../components/Toast';
import confetti from 'canvas-confetti';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Award,
  Layers,
  HelpCircle,
  Briefcase,
  Code,
  ArrowRight,
  FileCheck
} from 'lucide-react';

export const ResumeAnalyzerPage = ({ onNavigate }) => {
  const { addToast } = useToast();

  const [file, setFile] = useState(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    loadLatest();
  }, []);

  const loadLatest = async () => {
    try {
      const res = await api.getLatestResume();
      if (res.success && res.analysis) {
        setAnalysis(res.analysis);
      }
    } catch (err) {
      console.error('Error fetching resume analysis:', err);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selected = e.dataTransfer.files[0];
      if (selected.type === 'application/pdf' || selected.name.endsWith('.pdf')) {
        setFile(selected);
      } else {
        addToast('Please upload a PDF document.', 'warning');
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.type === 'application/pdf' || selected.name.endsWith('.pdf')) {
        setFile(selected);
      } else {
        addToast('Please upload a PDF document.', 'warning');
      }
    }
  };

  const handleUploadAndAnalyze = async () => {
    if (!file) {
      addToast('Please select a PDF file first.', 'warning');
      return;
    }

    setAnalyzing(true);
    const formData = new FormData();
    formData.append('resume', file);

    try {
      const res = await api.uploadResume(formData);
      if (res.success && res.analysis) {
        setAnalysis(res.analysis);
        if (res.analysis.overallScore >= 75) {
          confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
        }
        addToast(`Resume analyzed! ATS Score: ${res.analysis.overallScore}/100`, 'success');
      }
    } catch (err) {
      addToast(err.message || 'Failed to analyze resume.', 'error');
    } finally {
      setAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 font-semibold text-xs mb-1">
          <FileText className="w-4 h-4" />
          <span>ATS Resume Intelligence</span>
        </div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
          Resume ATS Analyzer
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Upload your PDF resume to extract skills, detect missing sections, evaluate your ATS score, and receive targeted interview questions
        </p>
      </div>

      {/* 1. UPLOAD ZONE */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`p-8 rounded-3xl border-2 border-dashed transition-all text-center relative ${
          dragActive
            ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/30'
            : 'border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900'
        }`}
      >
        <input
          type="file"
          id="resume-upload"
          accept=".pdf"
          onChange={handleFileChange}
          className="hidden"
        />

        <div className="max-w-md mx-auto space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto shadow-inner">
            <UploadCloud className="w-7 h-7" />
          </div>

          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              {file ? file.name : 'Upload Your PDF Resume'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {file
                ? `${(file.size / (1024 * 1024)).toFixed(2)} MB PDF selected`
                : 'Drag and drop your PDF resume here, or click to browse'}
            </p>
          </div>

          <div className="flex items-center justify-center space-x-3 pt-2">
            <label
              htmlFor="resume-upload"
              className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold cursor-pointer transition-colors"
            >
              Choose File
            </label>

            {file && (
              <button
                onClick={handleUploadAndAnalyze}
                disabled={analyzing}
                className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-600/25 flex items-center space-x-1.5 transition-all"
              >
                {analyzing ? (
                  <div className="flex items-center space-x-1.5">
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Analyzing PDF...</span>
                  </div>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Analyze with AI</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. REPORT VIEW */}
      {analysis && (
        <div className="space-y-6 animate-slide-in">
          {/* Top Banner with ATS Score */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white shadow-xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-2 text-center md:text-left">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold">
                  <FileCheck className="w-4 h-4" />
                  <span>Resume Scanned: {analysis.fileName}</span>
                </div>
                <h2 className="text-2xl font-extrabold">ATS Compatibility Report</h2>
                <p className="text-xs text-slate-300">
                  Evaluated against campus applicant tracking systems & recruiter keyword density
                </p>
              </div>

              {/* ATS Score Gauge */}
              <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 shrink-0">
                <span className="text-[11px] uppercase tracking-wider text-amber-300 font-bold">
                  ATS Score
                </span>
                <div className="text-5xl font-black mt-1 text-white">
                  {analysis.overallScore}
                  <span className="text-xl text-slate-400 font-medium">/100</span>
                </div>
                <span className="text-[11px] font-bold px-3 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 mt-2">
                  {analysis.overallScore >= 75 ? 'ATS Optimized' : 'Needs Enhancement'}
                </span>
              </div>
            </div>
          </div>

          {/* Detected Skills */}
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>Extracted & Verified Skills</span>
            </h3>

            {/* Technical Skills */}
            <div>
              <span className="text-xs font-semibold text-slate-500 block mb-2">
                Technical Languages & Frameworks:
              </span>
              <div className="flex flex-wrap gap-2">
                {analysis.detectedSkills?.technical?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold border border-indigo-200/60 dark:border-indigo-800/60"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Soft Skills & Tools */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <span className="text-xs font-semibold text-slate-500 block mb-2">Soft Skills:</span>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.detectedSkills?.soft?.map((s, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-500 block mb-2">Developer Tools:</span>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.detectedSkills?.tools?.map((t, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Missing Sections & Suggestions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Missing Sections */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
              <span className="text-xs font-bold text-rose-600 dark:text-rose-400 flex items-center space-x-1.5 uppercase tracking-wider">
                <AlertCircle className="w-4 h-4" />
                <span>Missing Critical Elements</span>
              </span>
              {analysis.missingSections && analysis.missingSections.length > 0 ? (
                <ul className="space-y-2">
                  {analysis.missingSections.map((sec, idx) => (
                    <li key={idx} className="text-xs text-slate-600 dark:text-slate-400 flex items-center space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      <span>{sec}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-emerald-600 font-medium">
                  All standard resume sections (Education, Projects, Experience, Links) detected!
                </p>
              )}
            </div>

            {/* Suggested Skills to Add */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
              <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 flex items-center space-x-1.5 uppercase tracking-wider">
                <Sparkles className="w-4 h-4" />
                <span>Recommended Skills to Learn</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {analysis.suggestedSkills?.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 text-xs font-semibold border border-purple-200/60"
                  >
                    + {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Suggested Projects */}
          {analysis.suggestedProjects && (
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-3">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <Briefcase className="w-4 h-4 text-cyan-600" />
                <span>High-Impact Portfolio Project Ideas</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {analysis.suggestedProjects.map((proj, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-xs"
                  >
                    <span className="text-indigo-600 dark:text-indigo-400 font-bold block mb-1">
                      Project #{idx + 1}
                    </span>
                    <p className="text-slate-800 dark:text-slate-200 font-semibold">{proj}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* AI Tailored Interview Questions based on Resume */}
          {analysis.suggestedInterviewQuestions && (
            <div className="p-6 rounded-3xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/50 space-y-3">
              <h3 className="text-sm font-bold text-indigo-900 dark:text-indigo-100 flex items-center space-x-2">
                <HelpCircle className="w-4 h-4 text-indigo-600" />
                <span>Questions Recruiters Will Ask From Your Resume</span>
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Practice answering these specific questions before attending your upcoming interviews:
              </p>
              <div className="space-y-2 pt-1">
                {analysis.suggestedInterviewQuestions.map((q, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-200/80 dark:border-slate-800 text-xs text-slate-800 dark:text-slate-200 flex items-start space-x-2.5 shadow-sm"
                  >
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                      {idx + 1}
                    </span>
                    <span className="font-medium leading-relaxed">{q}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
