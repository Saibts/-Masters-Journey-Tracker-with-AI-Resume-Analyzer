import { useState, useRef, useCallback } from 'react';
import { LOADING_STEPS, processResumeUpload } from '../utils/resumeParser';
import { analyzeResume, mergeResumeIntoProfile } from '../utils/resumeAnalysis';
import { saveProfile } from '../utils/storage';

export default function ResumeUpload({ profile, onStateChange }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState(null);
  const [lastResult, setLastResult] = useState(null);
  const inputRef = useRef(null);

  const handleUpload = useCallback(async (file) => {
    if (!file || !profile) return;

    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'txt'].includes(extension)) {
      setError('Please upload a .pdf or .txt file.');
      return;
    }

    setError(null);
    setIsProcessing(true);
    setCurrentStep(0);
    setLastResult(null);

    try {
      const resumeData = await processResumeUpload(file, setCurrentStep);
      const analysis = analyzeResume(resumeData.text, profile.currentCourse);
      const updatedProfile = mergeResumeIntoProfile(profile, resumeData, analysis);

      saveProfile(updatedProfile);
      onStateChange();

      setLastResult({
        keywords: analysis.extractedKeywords,
        strengths: analysis.resumeStrengths.length,
        gaps: analysis.resumeGaps.length,
      });
    } catch (err) {
      setError(err?.message || 'Failed to parse resume. Please try another file.');
    } finally {
      setIsProcessing(false);
      setCurrentStep(0);
      if (inputRef.current) inputRef.current.value = '';
    }
  }, [profile, onStateChange]);

  const onFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div className="resume-upload-section card">
      <div className="resume-upload-header">
        <div>
          <h3>📄 Resume Intelligence Engine</h3>
          <p className="card-desc">
            Upload your resume (.pdf or .txt) to extract keywords, detect gaps, and recalculate university matches.
          </p>
        </div>
        {profile.resumeFileName && !isProcessing && (
          <span className="resume-file-badge">Last: {profile.resumeFileName}</span>
        )}
      </div>

      <div
        className={`resume-dropzone ${isDragging ? 'dragging' : ''} ${isProcessing ? 'processing' : ''}`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onClick={() => !isProcessing && inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && !isProcessing && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.txt"
          onChange={onFileSelect}
          hidden
          disabled={isProcessing}
        />

        {isProcessing ? (
          <div className="resume-loading">
            <div className="loading-spinner" />
            <p className="loading-step-label">{LOADING_STEPS[currentStep]}</p>
            <div className="loading-steps">
              {LOADING_STEPS.map((step, i) => (
                <div key={step} className={`loading-step ${i <= currentStep ? 'active' : ''} ${i < currentStep ? 'done' : ''}`}>
                  <span className="step-dot" />
                  <span className="step-text">{step}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="dropzone-content">
            <span className="dropzone-icon">📎</span>
            <p className="dropzone-title">Drop your resume here or click to browse</p>
            <p className="dropzone-hint">Supports .pdf and .txt — parsed entirely in your browser</p>
          </div>
        )}
      </div>

      {error && (
        <div className="resume-error" role="alert">
          {error}
        </div>
      )}

      {lastResult && !isProcessing && (
        <div className="resume-success">
          ✅ Parsed successfully — {lastResult.keywords.length} keywords found, {lastResult.strengths} strengths, {lastResult.gaps} gaps identified. Matches updated.
        </div>
      )}

      {profile.atsScore !== undefined && !isProcessing && (
        <div className="ats-analysis-report">
          <div className="ats-score-row">
            <div className="ats-dial-container">
              <div className={`ats-score-badge score-${profile.atsScore >= 80 ? 'green' : profile.atsScore >= 50 ? 'orange' : 'red'}`}>
                <span className="score-val">{profile.atsScore}%</span>
                <span className="score-lbl">ATS SCORE</span>
              </div>
            </div>
            <div className="ats-summary-text">
              <h4>🤖 Agentic Resume Performance Report</h4>
              <p>
                {profile.atsScore >= 80 
                  ? 'Excellent! Your resume exhibits highly competitive keyword alignment and meets core target program expectations.' 
                  : profile.atsScore >= 50 
                    ? 'Good starting point. Your resume meets basic criteria, but missing crucial keywords or milestones is capping your compatibility.' 
                    : 'Critical improvements needed. Your resume lacks primary research, internship indicators, or key engineering keywords.'}
              </p>
            </div>
          </div>

          {profile.aiRecommendations && profile.aiRecommendations.length > 0 && (
            <div className="ats-recommendations">
              <h5>💡 AI Actionable Recommendations to Boost Score</h5>
              <ul className="rec-list">
                {profile.aiRecommendations.map((rec, i) => (
                  <li key={i} className="rec-item">{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {profile.extractedKeywords?.length > 0 && !isProcessing && (
        <div className="extracted-keywords">
          <span className="keywords-label">Detected keywords:</span>
          <div className="keywords-list">
            {profile.extractedKeywords.map((kw) => (
              <span key={kw} className="keyword-chip">{kw}</span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
