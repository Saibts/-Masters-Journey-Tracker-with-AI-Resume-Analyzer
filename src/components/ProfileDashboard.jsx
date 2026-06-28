import { useState, useEffect } from 'react';
import { FUNDING_OPTIONS, DEFAULT_PROFILE, COUNTRIES, cgpaToUsEquivalent, JOB_OPPORTUNITIES } from '../data/constants';
import { saveProfile, importState } from '../utils/storage';
import ResumeUpload from './ResumeUpload';
import StrengthsGapsChecklist from './StrengthsGapsChecklist';
import { processResumeUpload } from '../utils/resumeParser';
import { analyzeResume, mergeResumeIntoProfile } from '../utils/resumeAnalysis';

const COURSE_OPTIONS = [
  'Robotics and Automation',
  'Mechanical Engineering',
  'Electronics and Communication Engineering',
  'Production Engineering',
  'AI/DS',
  'Computer Science Engineering',
  'Information Technology (IT)',
  'Rubber and Plastics Technology'
];

function ProfileField({ label, value, children, isEditing }) {
  return (
    <div className="profile-field">
      <label className="field-label">{label}</label>
      {isEditing ? children : <p className="field-value">{value || '—'}</p>}
    </div>
  );
}

export default function ProfileDashboard({ state, matchedColleges, onStateChange, portal, onDeleteProfile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(DEFAULT_PROFILE);
  const profile = state.profile;

  useEffect(() => {
    if (profile) {
      setForm({ ...DEFAULT_PROFILE, ...profile });
    }
  }, [profile]);

  const [isParsingResume, setIsParsingResume] = useState(false);

  const handleChange = (field, value) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === 'currentCourse' && prev.resumeText) {
        // Re-analyze resume with the new course and update strengths/gaps/ATS score
        const analysis = analyzeResume(prev.resumeText, value);
        return {
          ...updated,
          resumeStrengths: analysis.resumeStrengths,
          resumeGaps: analysis.resumeGaps,
          atsScore: analysis.atsScore,
          aiRecommendations: analysis.aiRecommendations,
        };
      }
      return updated;
    });
  };

  const handleCountryToggle = (country) => {
    const current = form.targetCountries || [];
    const updated = current.includes(country)
      ? current.filter((c) => c !== country)
      : [...current, country];
    handleChange('targetCountries', updated);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'txt'].includes(extension)) {
      alert('Please upload a .pdf or .txt file.');
      return;
    }

    setIsParsingResume(true);
    try {
      // Parse file using the common loader
      const resumeData = await processResumeUpload(file, () => {});
      const analysis = analyzeResume(resumeData.text, form.currentCourse);
      
      setForm((prev) => mergeResumeIntoProfile(prev, resumeData, analysis));
    } catch (err) {
      alert(err?.message || 'Failed to parse resume.');
    } finally {
      setIsParsingResume(false);
    }
  };

  const handleSave = () => {
    saveProfile(form);
    onStateChange();
    setIsEditing(false);
  };

  const usGpa = cgpaToUsEquivalent(form.cgpa || profile?.cgpa);
  const topMatches = matchedColleges.filter((c) => c.isRecommended).slice(0, 4);
  const scholarshipMatches = matchedColleges.filter((c) => c.highScholarshipChance);
  const courseJobs = profile ? JOB_OPPORTUNITIES[profile.currentCourse] : null;

  if (!profile) {
    return (
      <div className="section">
        {!isEditing ? (
          <div className="empty-state card">
            <h2>Welcome to Your Journey</h2>
            <p>Set up your academic profile to unlock personalized college recommendations and roadmaps.</p>
            <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
              Create Profile
            </button>
          </div>
        ) : (
          <div className="profile-card card editing">
            <div className="section-header">
              <h2>Create Your Profile</h2>
            </div>
            <ProfileForm
              form={form}
              handleChange={handleChange}
              handleCountryToggle={handleCountryToggle}
              handleFileUpload={handleFileUpload}
              handleSave={handleSave}
              usGpa={usGpa}
              setIsEditing={setIsEditing}
              hasProfile={false}
              isParsingResume={isParsingResume}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="section">
      <div className="section-header">
        <h2>My Profile & Dashboard</h2>
        {!isEditing && (
          <button className="btn btn-primary" onClick={() => setIsEditing(true)}>
            Edit Profile
          </button>
        )}
      </div>

      <div className={`profile-card card ${isEditing ? 'editing' : 'readonly'}`}>
        {isEditing ? (
          <ProfileForm
            form={form}
            handleChange={handleChange}
            handleCountryToggle={handleCountryToggle}
            handleFileUpload={handleFileUpload}
            handleSave={handleSave}
            usGpa={usGpa}
            setIsEditing={setIsEditing}
            hasProfile={!!profile}
            isParsingResume={isParsingResume}
          />
        ) : (
          <div className="profile-readonly">
            <div className="profile-grid">
              <ProfileField label="Full Name" value={profile.fullName} />
              <ProfileField label="Target Term" value={profile.targetTerm} />
              <ProfileField label="Undergrad College / University" value={profile.collegeName} />
              <ProfileField label="Current B.E. Course" value={profile.currentCourse} />
              <ProfileField
                label="CGPA (10-point scale)"
                value={profile.cgpa ? `${profile.cgpa} / 10` : null}
              />
              {profile.cgpa && (
                <p className="cgpa-note">
                  {profile.cgpa}/10 ≈ roughly {cgpaToUsEquivalent(profile.cgpa)}/4.0 GPA (US equivalent)
                </p>
              )}
              <ProfileField label="Funding Preference" value={profile.funding} />
              <ProfileField label="Research Interests" value={profile.researchInterests} />
              <ProfileField label="Current Internships" value={profile.internships} />
              <ProfileField
                label="Target Countries"
                value={profile.targetCountries && profile.targetCountries.length > 0 ? profile.targetCountries.join(', ') : 'Any / No Preference'}
              />
              <ProfileField label="Resume / CV" value={profile.resumeFileName || 'No file uploaded'} />
            </div>

            <div className="requirements-tracker-section">
              <h3 className="sub-section-title">📋 Admission Requirements Status</h3>
              <div className="requirements-summary-grid">
                <div className="req-summary-item">
                  <span className="req-summary-icon">📝</span>
                  <div className="req-summary-details">
                    <span className="req-label">GRE General Test</span>
                    <span className="req-value">{profile.greScore ? `Score: ${profile.greScore}` : 'Not Taken / Not Required'}</span>
                  </div>
                </div>
                <div className="req-summary-item">
                  <span className="req-summary-icon">🗣️</span>
                  <div className="req-summary-details">
                    <span className="req-label">English Proficiency</span>
                    <span className="req-value">
                      {profile.englishTestType !== 'None' && profile.englishScore
                        ? `${profile.englishTestType}: ${profile.englishScore}`
                        : 'No Test Set'}
                    </span>
                  </div>
                </div>
                <div className="req-summary-item">
                  <span className="req-summary-icon">✉️</span>
                  <div className="req-summary-details">
                    <span className="req-label">Recommendation Letters</span>
                    <span className="req-value">{profile.lorsCount || 0} / 3 LORs Secured</span>
                  </div>
                </div>
                <div className="req-summary-item">
                  <span className="req-summary-icon">📑</span>
                  <div className="req-summary-details">
                    <span className="req-label">SOP / Personal Statement</span>
                    <span className="req-value">{profile.sopStatus || 'Not Started'}</span>
                  </div>
                </div>
                <div className="req-summary-item">
                  <span className="req-summary-icon">🏫</span>
                  <div className="req-summary-details">
                    <span className="req-label">Official Transcripts</span>
                    <span className="req-value">{profile.transcriptsStatus || 'Not Started'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {profile && (
        <>
          <ResumeUpload profile={profile} onStateChange={onStateChange} />

          <div className="dashboard-grid">
            <div className="dashboard-card card">
              <h3>📊 Quick Stats</h3>
              {portal === 'academic' ? (
                <div className="stats-row">
                  <div className="stat">
                    <span className="stat-value">{profile.cgpa || '—'}</span>
                    <span className="stat-label">Current CGPA</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">
                      {Object.keys(profile.semesters || {}).filter(key => (profile.semesters[key] || []).length > 0).length} / 8
                    </span>
                    <span className="stat-label">Semesters Loaded</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{(profile.projects || []).length}</span>
                    <span className="stat-label">Academic Projects</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{profile.extractedKeywords?.length || 0}</span>
                    <span className="stat-label">Resume Keywords</span>
                  </div>
                </div>
              ) : (
                <div className="stats-row">
                  <div className="stat">
                    <span className="stat-value">{matchedColleges.filter((c) => c.isRecommended).length}</span>
                    <span className="stat-label">Matched Programs</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{state.bookmarks.length}</span>
                    <span className="stat-label">Bookmarked</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{scholarshipMatches.length}</span>
                    <span className="stat-label">Scholarship Fits</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value">{profile.extractedKeywords?.length || 0}</span>
                    <span className="stat-label">Resume Keywords</span>
                  </div>
                </div>
              )}
            </div>

            {courseJobs && (
              <div className="dashboard-card card job-outlook-card">
                <h3>💼 Career & Job Opportunities Outlook</h3>
                <p className="card-desc" style={{ marginBottom: '1.25rem' }}>
                  Market analysis and employment stats for <strong>{profile.currentCourse}</strong>
                </p>
                <div className="stats-row" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '1rem', marginBottom: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem' }}>
                  <div className="stat">
                    <span className="stat-value" style={{ fontSize: '1.4rem', color: 'var(--accent-teal)' }}>{courseJobs.globalOpenings}</span>
                    <span className="stat-label">Global Active Openings</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value" style={{ fontSize: '1.4rem', color: 'var(--accent-teal)' }}>{courseJobs.employmentChance}</span>
                    <span className="stat-label">Employment Chance</span>
                  </div>
                  <div className="stat">
                    <span className="stat-value" style={{ fontSize: '1.1rem' }}>{courseJobs.marketTrend}</span>
                    <span className="stat-label">Market Trend</span>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div>
                    <span className="stat-label" style={{ display: 'block', fontSize: '0.8rem', opacity: 0.8, marginBottom: '0.25rem' }}>Top Hiring Sectors</span>
                    <span style={{ fontSize: '0.9rem', fontWeight: '500' }}>{courseJobs.topSectors.join(', ')}</span>
                  </div>
                  <div>
                    <span className="stat-label" style={{ display: 'block', fontSize: '0.8rem', opacity: 0.8, marginBottom: '0.4rem' }}>In-Demand Roles</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                      {courseJobs.popularRoles.map((role, idx) => (
                        <span key={idx} className="badge" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                          {role}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {portal !== 'academic' && scholarshipMatches.length > 0 && (
              <div className="dashboard-card card highlight-card">
                <h3>🏆 High Scholarship Potential</h3>
                <p className="card-desc">Based on your CGPA ≥ 8.5 and full scholarship preference</p>
                <div className="mini-college-list">
                  {scholarshipMatches.slice(0, 3).map((c) => (
                    <div key={c.id} className="mini-college-item">
                      <strong>{c.name}</strong>
                      <span className="badge badge-scholarship">High Chance for Fully Funded Scholarship</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <StrengthsGapsChecklist profile={profile} />

            {portal !== 'academic' && (
              <div className="dashboard-card card full-width">
                <h3>🎯 Top Recommendations</h3>
                {topMatches.length === 0 ? (
                  <p className="muted">Complete your profile to see recommendations.</p>
                ) : (
                  <div className="recommendation-grid">
                    {topMatches.map((college) => (
                      <div key={college.id} className="recommendation-item">
                        <div className="rec-header">
                          <strong>{college.name}</strong>
                          <span className="match-score">{college.matchScore}% match</span>
                        </div>
                        <p className="rec-program">{college.program} ({college.country})</p>
                        {college.resumeKeywordHits?.length > 0 && (
                          <p className="rec-keywords">
                            Resume match: {college.resumeKeywordHits.join(', ')}
                          </p>
                        )}
                        {college.highScholarshipChance && (
                          <span className="badge badge-scholarship">High Chance for Fully Funded Scholarship</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {profile && !isEditing && (
        <div className="dashboard-danger-backup-grid" style={{ marginTop: '2.5rem', borderTop: '1px solid var(--border)', paddingTop: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            
            <div className="card" style={{ padding: '1.5rem', borderRadius: '8px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 0.5rem 0' }}>
                💾 Backup & Restore
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0 0 1rem 0', lineHeight: '1.5' }}>
                Export your profile, roadmaps, and bookmarked colleges to a JSON file, or restore them from a backup.
              </p>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button 
                  onClick={() => {
                    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
                    const downloadAnchor = document.createElement('a');
                    downloadAnchor.setAttribute("href", dataStr);
                    downloadAnchor.setAttribute("download", `${profile.fullName || 'profile'}_masters_tracker_backup.json`);
                    document.body.appendChild(downloadAnchor);
                    downloadAnchor.click();
                    downloadAnchor.remove();
                  }}
                  className="btn btn-secondary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  📥 Export Backup
                </button>
                
                <label className="btn btn-secondary" style={{ cursor: 'pointer', margin: 0, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  📤 Import Backup
                  <input 
                    type="file" 
                    accept=".json" 
                    style={{ display: 'none' }} 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        try {
                          const importedData = JSON.parse(event.target.result);
                          if (importedData && importedData.profile) {
                            importState(importedData);
                            onStateChange();
                            alert('Backup restored successfully!');
                          } else {
                            alert('Invalid backup file structure: missing profile data.');
                          }
                        } catch (err) {
                          alert('Failed to parse backup JSON file.');
                        }
                      };
                      reader.readAsText(file);
                    }}
                  />
                </label>
              </div>
            </div>

            <div className="card" style={{ borderColor: 'rgba(239, 68, 68, 0.4)', background: 'rgba(239, 68, 68, 0.03)', padding: '1.5rem', borderRadius: '8px' }}>
              <h3 style={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 0 0.5rem 0' }}>
                ⚠️ Danger Zone
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: '0 0 1rem 0', lineHeight: '1.5' }}>
                Permanently delete this user profile and all associated data (including academic grades, roadmaps, and bookmarked colleges) from this browser. This action cannot be undone.
              </p>
              <button 
                onClick={onDeleteProfile} 
                className="btn" 
                style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '0.6rem 1.2rem', cursor: 'pointer', fontWeight: 'bold' }}
              >
                Delete Profile
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

function ProfileForm({ form, handleChange, handleCountryToggle, handleFileUpload, handleSave, usGpa, setIsEditing, hasProfile, isParsingResume }) {
  return (
    <div className="profile-form">
      <div className="form-grid">
        <div className="form-group">
          <label>Full Name</label>
          <input
            type="text"
            value={form.fullName || ''}
            onChange={(e) => handleChange('fullName', e.target.value)}
            placeholder="e.g., Jane Doe"
          />
        </div>
        <div className="form-group">
          <label>Target Term</label>
          <input
            type="text"
            value={form.targetTerm}
            onChange={(e) => handleChange('targetTerm', e.target.value)}
            placeholder="e.g., Fall 2028"
          />
        </div>
        <div className="form-group">
          <label>Current B.E. Course</label>
          <select
            value={form.currentCourse}
            onChange={(e) => handleChange('currentCourse', e.target.value)}
          >
            {COURSE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Undergrad College / University</label>
          <input
            type="text"
            value={form.collegeName || ''}
            onChange={(e) => handleChange('collegeName', e.target.value)}
            placeholder="e.g., Anna University"
          />
        </div>
        <div className="form-group">
          <label>CGPA (10-point scale)</label>
          <input
            type="number"
            min="0"
            max="10"
            step="0.01"
            value={form.cgpa}
            onChange={(e) => handleChange('cgpa', e.target.value)}
            placeholder="e.g., 8.99"
          />
          {usGpa && (
            <p className="cgpa-note">{form.cgpa}/10 ≈ roughly {usGpa}/4.0 GPA (US equivalent)</p>
          )}
        </div>
        <div className="form-group">
          <label>Funding Preference</label>
          <select value={form.funding} onChange={(e) => handleChange('funding', e.target.value)}>
            {FUNDING_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </div>

        <div className="form-group full-width">
          <label>Preferred Countries</label>
          <div className="country-checkbox-group">
            {COUNTRIES.map((country) => {
              const isSelected = (form.targetCountries || []).includes(country);
              return (
                <button
                  key={country}
                  type="button"
                  className={`country-tag-btn ${isSelected ? 'active' : ''}`}
                  onClick={() => handleCountryToggle(country)}
                >
                  {country}
                </button>
              );
            })}
          </div>
          <span className="form-hint">Select one or more target countries. If none are selected, programs worldwide will match.</span>
        </div>

        <div className="form-group full-width">
          <label>My Research Interests</label>
          <textarea
            rows={2}
            value={form.researchInterests}
            onChange={(e) => handleChange('researchInterests', e.target.value)}
            placeholder="e.g., Autonomous navigation, SLAM, reinforcement learning..."
          />
        </div>
        <div className="form-group full-width">
          <label>Current Internships</label>
          <textarea
            rows={2}
            value={form.internships}
            onChange={(e) => handleChange('internships', e.target.value)}
            placeholder="e.g., Summer research at IIT Bombay Robotics Lab..."
          />
        </div>

        <div className="requirements-edit-section full-width">
          <h3 className="requirements-title">📋 Admission Requirements Progress</h3>
          <div className="requirements-form-grid">
            <div className="form-group">
              <label>GRE Score</label>
              <input
                type="text"
                value={form.greScore || ''}
                onChange={(e) => handleChange('greScore', e.target.value)}
                placeholder="e.g., 324 (or N/A)"
              />
            </div>
            <div className="form-group">
              <label>English Test Type</label>
              <select
                value={form.englishTestType || 'None'}
                onChange={(e) => handleChange('englishTestType', e.target.value)}
              >
                <option value="None">None / Not Required</option>
                <option value="IELTS">IELTS</option>
                <option value="TOEFL">TOEFL</option>
              </select>
            </div>
            <div className="form-group">
              <label>English Test Score</label>
              <input
                type="text"
                disabled={form.englishTestType === 'None'}
                value={form.englishScore || ''}
                onChange={(e) => handleChange('englishScore', e.target.value)}
                placeholder="e.g., 7.5 or 105"
              />
            </div>
            <div className="form-group">
              <label>Secured LORs Count (0 to 3)</label>
              <input
                type="number"
                min="0"
                max="3"
                value={form.lorsCount || 0}
                onChange={(e) => handleChange('lorsCount', parseInt(e.target.value) || 0)}
              />
            </div>
            <div className="form-group">
              <label>SOP Status</label>
              <select
                value={form.sopStatus || 'Not Started'}
                onChange={(e) => handleChange('sopStatus', e.target.value)}
              >
                <option value="Not Started">Not Started</option>
                <option value="Drafting">Drafting</option>
                <option value="Under Review">Under Review</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            <div className="form-group">
              <label>Academic Transcripts</label>
              <select
                value={form.transcriptsStatus || 'Not Started'}
                onChange={(e) => handleChange('transcriptsStatus', e.target.value)}
              >
                <option value="Not Started">Not Started</option>
                <option value="Requested">Requested</option>
                <option value="Received">Received</option>
              </select>
            </div>
          </div>
        </div>

        <div className="form-group full-width">
          <label>My Resume / CV</label>
          <div className="file-upload">
            <input 
              type="file" 
              accept=".pdf,.txt" 
              onChange={handleFileUpload} 
              id="resume-upload" 
              disabled={isParsingResume} 
            />
            <label 
              htmlFor="resume-upload" 
              className={`file-upload-label ${isParsingResume ? 'disabled' : ''}`}
              style={{ opacity: isParsingResume ? 0.7 : 1, cursor: isParsingResume ? 'not-allowed' : 'pointer' }}
            >
              {isParsingResume ? '⏳ Parsing & Analyzing Resume...' : (form.resumeFileName ? `📄 ${form.resumeFileName}` : '📎 Upload Resume/CV (PDF, TXT)')}
            </label>
            <p className="form-hint">
              {isParsingResume 
                ? 'Extracting keywords, calculating ATS score, and analyzing skill gaps...' 
                : 'Resume is automatically parsed & analyzed. Keywords, gaps, and matches will update.'}
            </p>
          </div>
        </div>
      </div>
      <div className="form-actions">
        <button className="btn btn-primary" onClick={handleSave}>Save Changes</button>
        {hasProfile && (
          <button className="btn btn-ghost" onClick={() => setIsEditing(false)}>Cancel</button>
        )}
      </div>
    </div>
  );
}