import { useState, useEffect } from 'react';
import { FUNDING_OPTIONS, DEFAULT_PROFILE, COUNTRIES, cgpaToUsEquivalent } from '../data/constants';
import { saveProfile } from '../utils/storage';
import ResumeUpload from './ResumeUpload';
import StrengthsGapsChecklist from './StrengthsGapsChecklist';

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

export default function ProfileDashboard({ state, matchedColleges, onStateChange, portal }) {
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState(DEFAULT_PROFILE);
  const profile = state.profile;

  useEffect(() => {
    if (profile) {
      setForm({ ...DEFAULT_PROFILE, ...profile });
    }
  }, [profile]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCountryToggle = (country) => {
    const current = form.targetCountries || [];
    const updated = current.includes(country)
      ? current.filter((c) => c !== country)
      : [...current, country];
    handleChange('targetCountries', updated);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm((prev) => ({
        ...prev,
        resumeFileName: file.name,
        resumeDataUrl: ev.target.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    saveProfile(form);
    onStateChange();
    setIsEditing(false);
  };

  const usGpa = cgpaToUsEquivalent(form.cgpa || profile?.cgpa);
  const topMatches = matchedColleges.filter((c) => c.isRecommended).slice(0, 4);
  const scholarshipMatches = matchedColleges.filter((c) => c.highScholarshipChance);

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
    </div>
  );
}

function ProfileForm({ form, handleChange, handleCountryToggle, handleFileUpload, handleSave, usGpa, setIsEditing, hasProfile }) {
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
            <input type="file" accept=".pdf,.txt" onChange={handleFileUpload} id="resume-upload" />
            <label htmlFor="resume-upload" className="file-upload-label">
              {form.resumeFileName ? `📄 ${form.resumeFileName}` : '📎 Upload Resume/CV (PDF, TXT)'}
            </label>
            <p className="form-hint">For full parsing & gap analysis, use the Resume Intelligence Engine on the dashboard.</p>
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