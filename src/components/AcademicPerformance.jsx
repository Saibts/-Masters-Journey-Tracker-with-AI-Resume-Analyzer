import { useState, useEffect } from 'react';
import { saveProfile } from '../utils/storage';
import { cgpaToUsEquivalent } from '../data/constants';

const ANNA_GRADES = [
  { grade: 'O', points: 10, label: 'O (Outstanding - 10)' },
  { grade: 'A+', points: 9, label: 'A+ (Excellent - 9)' },
  { grade: 'A', points: 8, label: 'A (Very Good - 8)' },
  { grade: 'B+', points: 7, label: 'B+ (Good - 7)' },
  { grade: 'B', points: 6, label: 'B (Above Average - 6)' },
  { grade: 'C', points: 5, label: 'C (Satisfactory - 5)' },
  { grade: 'RA', points: 0, label: 'RA (Re-appearance - 0)' }
];

const DEFAULT_SUBJECTS = {
  1: [
    { id: 's1-1', name: 'Mathematics I', credits: 4, marks: 85, gradePoints: 9, grade: 'A+' },
    { id: 's1-2', name: 'Physics', credits: 4, marks: 78, gradePoints: 8, grade: 'A' },
    { id: 's1-3', name: 'Engineering Graphics', credits: 3, marks: 92, gradePoints: 10, grade: 'O' },
    { id: 's1-4', name: 'Programming in C', credits: 4, marks: 88, gradePoints: 9, grade: 'A+' }
  ],
  2: [
    { id: 's2-1', name: 'Mathematics II', credits: 4, marks: 82, gradePoints: 9, grade: 'A+' },
    { id: 's2-2', name: 'Chemistry', credits: 4, marks: 74, gradePoints: 8, grade: 'A' },
    { id: 's2-3', name: 'Basic Electrical Eng.', credits: 3, marks: 80, gradePoints: 9, grade: 'A+' },
    { id: 's2-4', name: 'Data Structures', credits: 4, marks: 86, gradePoints: 9, grade: 'A+' }
  ],
  3: [],
  4: [],
  5: [],
  6: [],
  7: [],
  8: []
};

export default function AcademicPerformance({ state, onStateChange }) {
  const profile = state.profile;
  const [activeSem, setActiveSem] = useState(1);
  const [gradingStyle, setGradingStyle] = useState('anna'); // 'anna' or 'numeric'
  const [showReportCard, setShowReportCard] = useState(false);
  const [isMonochrome, setIsMonochrome] = useState(false);

  const handlePrint = (mode) => {
    const isMono = mode === 'monochrome';
    setIsMonochrome(isMono);
    if (isMono) {
      document.body.classList.add('monochrome-print');
    } else {
      document.body.classList.remove('monochrome-print');
    }
    
    const cleanup = () => {
      document.body.classList.remove('monochrome-print');
      setIsMonochrome(false);
      window.removeEventListener('afterprint', cleanup);
    };
    window.addEventListener('afterprint', cleanup);

    setTimeout(() => {
      window.print();
    }, 150);
  };

  const [semesters, setSemesters] = useState(() => {
    if (profile?.semesters && Object.keys(profile.semesters).length > 0) {
      return profile.semesters;
    }
    return DEFAULT_SUBJECTS;
  });

  useEffect(() => {
    if (profile?.semesters && Object.keys(profile.semesters).length > 0) {
      setSemesters(profile.semesters);
    }
  }, [profile]);

  const mapMarksToGradePoints = (marks) => {
    const m = parseFloat(marks);
    if (isNaN(m) || m < 0) return 0;
    if (m >= 90) return 10;
    if (m >= 80) return 9;
    if (m >= 70) return 8;
    if (m >= 60) return 7;
    if (m >= 50) return 6;
    if (m >= 40) return 5;
    return 0;
  };

  const mapGradePointsToLetter = (points) => {
    const p = parseFloat(points);
    if (p >= 10) return 'O';
    if (p >= 9) return 'A+';
    if (p >= 8) return 'A';
    if (p >= 7) return 'B+';
    if (p >= 6) return 'B';
    if (p >= 5) return 'C';
    return 'RA';
  };

  const handleSubjectChange = (semNum, subId, field, value) => {
    setSemesters((prev) => {
      const updatedSubjects = prev[semNum].map((sub) => {
        if (sub.id === subId) {
          const updated = { ...sub, [field]: value };
          if (field === 'marks') {
            updated.gradePoints = mapMarksToGradePoints(value);
            updated.grade = mapGradePointsToLetter(updated.gradePoints);
          } else if (field === 'grade') {
            const gradeObj = ANNA_GRADES.find((g) => g.grade === value);
            updated.gradePoints = gradeObj ? gradeObj.points : 0;
            updated.marks = value === 'O' ? 95 : value === 'A+' ? 85 : value === 'A' ? 75 : value === 'B+' ? 65 : value === 'B' ? 55 : value === 'C' ? 45 : 0;
          } else if (field === 'gradePoints') {
            updated.grade = mapGradePointsToLetter(value);
          }
          return updated;
        }
        return sub;
      });
      return { ...prev, [semNum]: updatedSubjects };
    });
  };

  const addSubject = (semNum) => {
    const newSub = {
      id: `sub-${Date.now()}`,
      name: '',
      credits: 3,
      marks: 85,
      gradePoints: 9,
      grade: 'A+'
    };
    setSemesters((prev) => ({
      ...prev,
      [semNum]: [...prev[semNum], newSub]
    }));
  };

  const deleteSubject = (semNum, subId) => {
    setSemesters((prev) => ({
      ...prev,
      [semNum]: prev[semNum].filter((sub) => sub.id !== subId)
    }));
  };

  const calculateSemesterGPA = (subjects) => {
    if (!subjects || subjects.length === 0) return 0;
    let totalCredits = 0;
    let weightedPoints = 0;
    subjects.forEach((sub) => {
      const credits = parseFloat(sub.credits) || 0;
      const gp = parseFloat(sub.gradePoints) || 0;
      totalCredits += credits;
      weightedPoints += (credits * gp);
    });
    return totalCredits > 0 ? weightedPoints / totalCredits : 0;
  };

  const calculateOverallCGPA = () => {
    let totalCredits = 0;
    let weightedPoints = 0;
    
    Object.keys(semesters).forEach((semNum) => {
      const subjects = semesters[semNum] || [];
      subjects.forEach((sub) => {
        const credits = parseFloat(sub.credits) || 0;
        const gp = parseFloat(sub.gradePoints) || 0;
        totalCredits += credits;
        weightedPoints += (credits * gp);
      });
    });
    
    return totalCredits > 0 ? weightedPoints / totalCredits : 0;
  };

  const calculateTotalCredits = () => {
    let total = 0;
    Object.keys(semesters).forEach((semNum) => {
      const subjects = semesters[semNum] || [];
      subjects.forEach((sub) => {
        total += parseFloat(sub.credits) || 0;
      });
    });
    return total;
  };

  const overallCGPA = calculateOverallCGPA();
  const overallCGPAStr = overallCGPA > 0 ? overallCGPA.toFixed(2) : '—';
  const totalCredits = calculateTotalCredits();
  const usGpa = overallCGPA > 0 ? cgpaToUsEquivalent(overallCGPA.toFixed(2)) : '—';

  const handleSave = () => {
    if (!profile) {
      alert('Please create a profile on the dashboard tab first.');
      return;
    }
    const updatedProfile = {
      ...profile,
      semesters: semesters,
      cgpa: overallCGPA > 0 ? overallCGPA.toFixed(2) : profile.cgpa
    };
    saveProfile(updatedProfile);
    onStateChange();
    alert('Academic performance successfully saved and profile CGPA updated!');
  };

  if (!profile) {
    return (
      <div className="section">
        <div className="empty-state card">
          <h2>Profile Required</h2>
          <p>Please set up your profile on the main dashboard before adding academic performance details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="section-header">
        <h2>Academic Performance Tracker</h2>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button className="btn btn-ghost" onClick={() => setShowReportCard(true)}>
            📄 View Report Card
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Save & Sync CGPA
          </button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="dashboard-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="dashboard-card card">
          <h3>📊 Academic Summary</h3>
          <div className="stats-row">
            <div className="stat">
              <span className="stat-value">{overallCGPAStr}</span>
              <span className="stat-label">Cumulative CGPA (Anna Univ/10x)</span>
            </div>
            <div className="stat">
              <span className="stat-value">{usGpa}</span>
              <span className="stat-label">US GPA (4.0 Scale)</span>
            </div>
            <div className="stat">
              <span className="stat-value">{totalCredits}</span>
              <span className="stat-label">Total Credits Earned</span>
            </div>
          </div>
        </div>
      </div>

      {/* Semester Selection Grid */}
      <div className="semester-tabs-container card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <h3>Semesters Overview</h3>
          
          {/* Grading Style Selector Toggle */}
          <div style={{ display: 'flex', background: 'var(--bg-deep)', padding: '0.25rem', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            <button
              onClick={() => setGradingStyle('anna')}
              style={{
                background: gradingStyle === 'anna' ? 'var(--accent-teal)' : 'transparent',
                color: gradingStyle === 'anna' ? '#000' : 'var(--text-secondary)',
                border: 'none',
                padding: '0.4rem 0.8rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: gradingStyle === 'anna' ? 'bold' : 'normal',
                transition: 'all 0.2s'
              }}
            >
              Anna Univ Grades (O, A+, etc.)
            </button>
            <button
              onClick={() => setGradingStyle('numeric')}
              style={{
                background: gradingStyle === 'numeric' ? 'var(--accent-teal)' : 'transparent',
                color: gradingStyle === 'numeric' ? '#000' : 'var(--text-secondary)',
                border: 'none',
                padding: '0.4rem 0.8rem',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontWeight: gradingStyle === 'numeric' ? 'bold' : 'normal',
                transition: 'all 0.2s'
              }}
            >
              Numeric Marks (%)
            </button>
          </div>
        </div>

        <div className="semester-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {Array.from({ length: 8 }, (_, i) => {
            const semNum = i + 1;
            const subjects = semesters[semNum] || [];
            const semGpa = calculateSemesterGPA(subjects);
            const semCredits = subjects.reduce((sum, s) => sum + (parseFloat(s.credits) || 0), 0);
            const isActive = activeSem === semNum;
            
            return (
              <button
                key={semNum}
                className={`sem-tab-card ${isActive ? 'active' : ''}`}
                onClick={() => setActiveSem(semNum)}
                style={{
                  background: isActive ? 'var(--bg-elevated)' : 'var(--bg-card)',
                  border: isActive ? '1px solid var(--accent-teal)' : '1px solid var(--border)',
                  borderRadius: 'var(--radius)',
                  padding: '1rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.2s ease',
                  color: 'inherit'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <strong style={{ color: isActive ? 'var(--accent-teal)' : 'var(--text-primary)' }}>Semester {semNum}</strong>
                  <span className="badge" style={{
                    fontSize: '0.75rem',
                    background: subjects.length > 0 ? 'var(--accent-teal-glow)' : 'var(--border)',
                    color: subjects.length > 0 ? 'var(--accent-teal)' : 'var(--text-muted)',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '4px'
                  }}>
                    {subjects.length} subjects
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  GPA: <span style={{ fontWeight: 'bold', color: semGpa > 0 ? 'var(--success)' : 'var(--text-muted)' }}>
                    {semGpa > 0 ? semGpa.toFixed(2) : '—'}
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                  Credits: {semCredits}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Semester Subject List */}
        <div className="semester-detail-section" style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem' }}>Semester {activeSem} Subjects</h3>
            <button className="btn btn-ghost" onClick={() => addSubject(activeSem)} style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}>
              + Add Subject
            </button>
          </div>

          {(semesters[activeSem] || []).length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)', background: 'var(--bg-deep)', borderRadius: 'var(--radius)' }}>
              No subjects added for Semester {activeSem} yet. Click "+ Add Subject" to start loading marks.
            </div>
          ) : (
            <div className="subject-table-wrapper" style={{ overflowX: 'auto' }}>
              <table className="subject-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Subject Name</th>
                    <th style={{ padding: '0.75rem 0.5rem', width: '120px' }}>Credits</th>
                    
                    {gradingStyle === 'anna' ? (
                      <th style={{ padding: '0.75rem 0.5rem', width: '180px' }}>Anna Univ Grade</th>
                    ) : (
                      <th style={{ padding: '0.75rem 0.5rem', width: '120px' }}>Marks (%)</th>
                    )}
                    
                    <th style={{ padding: '0.75rem 0.5rem', width: '160px' }}>Grade Points (10-Scale)</th>
                    <th style={{ padding: '0.75rem 0.5rem', width: '80px', textAlign: 'center' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {(semesters[activeSem] || []).map((sub) => (
                    <tr key={sub.id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                      {/* Subject Name */}
                      <td style={{ padding: '0.75rem 0.5rem' }}>
                        <input
                          type="text"
                          value={sub.name}
                          onChange={(e) => handleSubjectChange(activeSem, sub.id, 'name', e.target.value)}
                          placeholder="e.g. Technical English"
                          style={{
                            background: 'var(--bg-deep)',
                            border: '1px solid var(--border)',
                            borderRadius: '4px',
                            color: 'inherit',
                            padding: '0.4rem 0.6rem',
                            width: '100%'
                          }}
                        />
                      </td>
                      
                      {/* Credits */}
                      <td style={{ padding: '0.75rem 0.5rem' }}>
                        <input
                          type="number"
                          min="1"
                          max="8"
                          value={sub.credits}
                          onChange={(e) => handleSubjectChange(activeSem, sub.id, 'credits', parseInt(e.target.value) || 0)}
                          style={{
                            background: 'var(--bg-deep)',
                            border: '1px solid var(--border)',
                            borderRadius: '4px',
                            color: 'inherit',
                            padding: '0.4rem 0.6rem',
                            width: '80px'
                          }}
                        />
                      </td>
                      
                      {/* Anna University Grade Dropdown */}
                      {gradingStyle === 'anna' ? (
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          <select
                            value={sub.grade || 'A+'}
                            onChange={(e) => handleSubjectChange(activeSem, sub.id, 'grade', e.target.value)}
                            style={{
                              background: 'var(--bg-deep)',
                              border: '1px solid var(--border)',
                              borderRadius: '4px',
                              color: 'inherit',
                              padding: '0.4rem 0.6rem',
                              width: '100%'
                            }}
                          >
                            {ANNA_GRADES.map((g) => (
                              <option key={g.grade} value={g.grade}>
                                {g.label}
                              </option>
                            ))}
                          </select>
                        </td>
                      ) : (
                        /* Numeric Marks Input */
                        <td style={{ padding: '0.75rem 0.5rem' }}>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={sub.marks}
                            onChange={(e) => handleSubjectChange(activeSem, sub.id, 'marks', parseFloat(e.target.value) || 0)}
                            style={{
                              background: 'var(--bg-deep)',
                              border: '1px solid var(--border)',
                              borderRadius: '4px',
                              color: 'inherit',
                              padding: '0.4rem 0.6rem',
                              width: '80px'
                            }}
                          />
                        </td>
                      )}
                      
                      {/* Grade Points */}
                      <td style={{ padding: '0.75rem 0.5rem' }}>
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.5"
                          value={sub.gradePoints}
                          onChange={(e) => handleSubjectChange(activeSem, sub.id, 'gradePoints', parseFloat(e.target.value) || 0)}
                          style={{
                            background: 'var(--bg-deep)',
                            border: '1px solid var(--border)',
                            borderRadius: '4px',
                            color: 'inherit',
                            padding: '0.4rem 0.6rem',
                            width: '80px'
                          }}
                        />
                      </td>
                      
                      {/* Action */}
                      <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>
                        <button
                          onClick={() => deleteSubject(activeSem, sub.id)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#ef4444',
                            cursor: 'pointer',
                            fontSize: '1.1rem'
                          }}
                          title="Delete Subject"
                        >
                          🗑
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Report Card Modal Overlay */}
      {showReportCard && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(15, 20, 25, 0.85)',
          backdropFilter: 'blur(5px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          padding: '2rem',
          overflowY: 'auto'
        }}>
          <div className="report-card-modal" style={{
            background: 'var(--bg-card)',
            color: 'var(--text-primary)',
            width: '100%',
            maxWidth: '850px',
            borderRadius: 'var(--radius-lg)',
            padding: '2.5rem',
            boxShadow: 'var(--shadow)',
            border: '1px solid var(--border)',
            position: 'relative',
            maxHeight: '90vh',
            overflowY: 'auto'
          }}>
            {/* Header / Actions inside modal */}
            <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', flexWrap: 'wrap' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Export Academic Report Card</h3>
              <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
                <button 
                  className="btn btn-secondary" 
                  style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }} 
                  onClick={() => handlePrint('vintage')}
                >
                  📜 Save Vintage PDF / Print
                </button>
                <button 
                  className="btn btn-secondary monochrome-print-btn" 
                  style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }} 
                  onClick={() => handlePrint('monochrome')}
                >
                  🖨️ Save Monochrome PDF / Print
                </button>
                <button 
                  className="btn btn-ghost" 
                  style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }} 
                  onClick={() => setShowReportCard(false)}
                >
                  ✕ Close
                </button>
              </div>
            </div>

            {/* Official Report Card Layout */}
            <div className="printable-report-card" style={{ border: '2px solid var(--border)', padding: '2.5rem', borderRadius: 'var(--radius)', background: 'var(--bg-slate)' }}>
              
              {/* Decorative Academic Shield Header */}
              <div style={{ textAlign: 'center', borderBottom: '2px double var(--border)', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.75rem' }}>
                  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent-teal)" strokeWidth="1.5">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7s0 6 8 10z" />
                    <path d="M12 6v11" strokeDasharray="1 1" />
                    <path d="M9 9h6" />
                    <path d="M9 13h6" />
                  </svg>
                </div>
                <h1 style={{ fontSize: '1.8rem', fontFamily: 'Georgia, serif', textTransform: 'uppercase', letterSpacing: '1.5px', margin: 0, color: 'var(--accent-teal)', fontWeight: 'bold' }}>Academic Transcript</h1>
                <p style={{ fontSize: '0.85rem', margin: '0.4rem 0 0 0', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--text-secondary)', fontWeight: '600' }}>Official Report Card & Academic Record</p>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', fontSize: '0.75rem', marginTop: '0.75rem', color: 'var(--text-muted)' }}>
                  <span>Generated: {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  <span>System: 10-Point Scale</span>
                </div>
              </div>

              {/* Student Metadata Card layout */}
              <div className="print-page-break-after" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '2rem', fontSize: '0.9rem', border: '1px solid var(--border)', padding: '1.25rem', borderRadius: 'var(--radius)', background: 'var(--bg-deep)', color: 'var(--text-secondary)' }}>
                <div style={{ borderLeft: '3px solid var(--accent-teal)', paddingLeft: '0.75rem' }}>
                  <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', letterSpacing: '0.5px' }}>Student Name</span>
                  <span style={{ fontSize: '1rem', fontWeight: '600', textTransform: 'capitalize', color: 'var(--text-primary)' }}>{profile.fullName || 'Guest User'}</span>
                </div>
                <div style={{ borderLeft: '3px solid var(--accent-teal)', paddingLeft: '0.75rem' }}>
                  <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', letterSpacing: '0.5px' }}>Program / Degree</span>
                  <span style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)' }}>{profile.currentCourse}</span>
                </div>
                <div style={{ borderLeft: '3px solid var(--accent-teal)', paddingLeft: '0.75rem' }}>
                  <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', letterSpacing: '0.5px' }}>Institution / College</span>
                  <span style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)' }}>{profile.collegeName || 'Not Specified'}</span>
                </div>
                <div style={{ borderLeft: '3px solid var(--accent-teal)', paddingLeft: '0.75rem' }}>
                  <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', letterSpacing: '0.5px' }}>Target Term</span>
                  <span style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)' }}>{profile.targetTerm || 'Not Specified'}</span>
                </div>
                <div style={{ borderLeft: '3px solid var(--accent-teal)', paddingLeft: '0.75rem' }}>
                  <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', letterSpacing: '0.5px' }}>Cumulative Credits</span>
                  <span style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--text-primary)' }}>{totalCredits}</span>
                </div>
                <div style={{ borderLeft: '3px solid var(--accent-teal)', paddingLeft: '0.75rem' }}>
                  <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', letterSpacing: '0.5px' }}>Status</span>
                  <span style={{ fontSize: '1rem', fontWeight: '600', color: 'var(--success)' }}>VERIFIED RECORD</span>
                </div>
              </div>

              {/* Semester Summaries */}
              <h3 className="print-spacer-top" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '0.4rem', fontSize: '1rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '1.25rem', color: 'var(--accent-teal)', fontWeight: 'bold' }}>Academic Record</h3>
              
              {Array.from({ length: 8 }, (_, i) => {
                const semNum = i + 1;
                const subjects = semesters[semNum] || [];
                if (subjects.length === 0) return null;
                const semGpa = calculateSemesterGPA(subjects);
                
                return (
                  <div key={semNum} className={semNum === 2 ? "print-page-break-after" : ""} style={{ marginBottom: '2rem', pageBreakInside: 'avoid' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.35rem', marginBottom: '0.5rem' }}>
                      <strong style={{ fontSize: '0.95rem', color: 'var(--text-primary)' }}>SEMESTER {semNum}</strong>
                      <span style={{ fontSize: '0.9rem', fontWeight: 'bold', color: 'var(--success)' }}>Semester GPA: {semGpa.toFixed(2)}</span>
                    </div>
                    
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                      <thead>
                        <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-primary)', textAlign: 'left', fontWeight: 'bold', background: 'rgba(255, 255, 255, 0.01)' }}>
                          <th style={{ padding: '0.6rem 0.75rem' }}>Subject Name</th>
                          <th style={{ padding: '0.6rem 0.75rem', width: '90px', textAlign: 'center' }}>Credits</th>
                          <th style={{ padding: '0.6rem 0.75rem', width: '90px', textAlign: 'center' }}>Grade</th>
                          <th style={{ padding: '0.6rem 0.75rem', width: '110px', textAlign: 'center' }}>Grade Points</th>
                        </tr>
                      </thead>
                      <tbody>
                        {subjects.map((sub, idx) => (
                          <tr key={sub.id} style={{ 
                            borderBottom: '1px solid var(--border-light)',
                            background: idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.015)'
                          }}>
                            <td style={{ padding: '0.6rem 0.75rem', color: 'var(--text-primary)', fontWeight: '500' }}>{sub.name || 'Unnamed Subject'}</td>
                            <td style={{ padding: '0.6rem 0.75rem', textAlign: 'center' }}>{sub.credits}</td>
                            <td style={{ padding: '0.6rem 0.75rem', textAlign: 'center', fontWeight: 'bold', color: 'var(--accent-teal)' }}>{sub.grade || mapGradePointsToLetter(sub.gradePoints)}</td>
                            <td style={{ padding: '0.6rem 0.75rem', textAlign: 'center' }}>{sub.gradePoints}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })}

              {/* Cumulative Result Stats Card */}
              <div style={{ marginTop: '2.5rem', padding: '1.75rem', border: '2px solid var(--border)', background: 'var(--bg-deep)', borderRadius: 'var(--radius)', position: 'relative' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', textAlign: 'center', gap: '1rem' }}>
                  <div style={{ borderRight: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem', letterSpacing: '0.5px' }}>Cumulative CGPA</span>
                    <h2 style={{ fontSize: '2rem', margin: 0, fontWeight: 'bold', color: 'var(--accent-teal)', fontFamily: 'Georgia, serif' }}>{overallCGPAStr}</h2>
                  </div>
                  <div style={{ borderRight: '1px solid var(--border)' }}>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem', letterSpacing: '0.5px' }}>US GPA (Equivalent)</span>
                    <h2 style={{ fontSize: '2rem', margin: 0, fontWeight: 'bold', color: 'var(--purple)', fontFamily: 'Georgia, serif' }}>{usGpa}</h2>
                  </div>
                  <div>
                    <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', marginBottom: '0.4rem', letterSpacing: '0.5px' }}>Total Credits Earned</span>
                    <h2 style={{ fontSize: '2rem', margin: 0, fontWeight: 'bold', color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}>{totalCredits}</h2>
                  </div>
                </div>
              </div>

              {/* Signature and Certification Area */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4rem', padding: '0 1rem' }}>
                <div style={{ textAlign: 'center', width: '200px' }}>
                  <div style={{ borderBottom: '1px solid var(--border)', height: '2.5rem', marginBottom: '0.5rem' }}></div>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', letterSpacing: '0.5px' }}>Student Signature</span>
                </div>
                
                {/* Security Verification Seal */}
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '120px', height: '120px' }}>
                  <svg width="100" height="100" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
                    <defs>
                      <path id="seal-text-path-top" d="M 15 50 A 35 35 0 0 1 85 50" fill="none" />
                      <path id="seal-text-path-bottom" d="M 85 50 A 35 35 0 0 1 15 50" fill="none" />
                    </defs>
                    <circle cx="50" cy="50" r="45" stroke="var(--accent-teal)" strokeWidth="1.5" fill="none" strokeDasharray="3 2" />
                    <circle cx="50" cy="50" r="41" stroke="var(--accent-teal)" strokeWidth="1" fill="none" />
                    <circle cx="50" cy="50" r="37" stroke="var(--accent-teal)" strokeWidth="0.5" fill="none" />
                    
                    <text fontSize="7.5" fontFamily="monospace" fontWeight="bold" fill="var(--accent-teal)">
                      <textPath href="#seal-text-path-top" startOffset="50%" textAnchor="middle">
                        OFFICIAL VERIFIED
                      </textPath>
                    </text>
                    <text fontSize="7.5" fontFamily="monospace" fontWeight="bold" fill="var(--accent-teal)">
                      <textPath href="#seal-text-path-bottom" startOffset="50%" textAnchor="middle">
                        ACADEMIC RECORD
                      </textPath>
                    </text>
                    
                    <polygon points="50,33 53,44 65,44 55,51 59,63 50,56 41,63 45,51 35,44 47,44" fill="var(--accent-teal)" opacity="0.8" />
                  </svg>
                </div>

                <div style={{ textAlign: 'center', width: '200px' }}>
                  <div style={{ borderBottom: '1px solid var(--border)', height: '2.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'monospace', fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--accent-teal)' }}>
                    {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: '2-digit' }).toUpperCase()}
                  </div>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', display: 'block', letterSpacing: '0.5px' }}>Date of Issue</span>
                </div>
              </div>

              {/* Disclaimer Description */}
              <div style={{ marginTop: '3rem', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
                *Note: This report card was dynamically generated based on academic performance data entered by the user.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global CSS for Print Mode */}
      <style>{`
        @page {
          size: A4 portrait;
          margin: ${isMonochrome ? '20mm 15mm' : '0'};
        }

        /* Hide Monochrome Print button on mobile viewports */
        @media (max-width: 768px) {
          .monochrome-print-btn {
            display: none !important;
          }
        }

        @media print {
          /* Apply print-color-adjust globally to html, body, and all elements to preserve background colors */
          html, 
          body,
          body:has(.modal-overlay) * {
            print-color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
          }

          /* Force page break at designated layout sections */
          body:has(.modal-overlay) .print-page-break-after {
            page-break-after: always !important;
            break-after: page !important;
          }

          /* Vintage mode top margins at page breaks (when page margins are 0) */
          body:has(.modal-overlay):not(.monochrome-print) .print-spacer-top {
            margin-top: 20mm !important;
          }

          body:has(.modal-overlay):not(.monochrome-print) div.print-page-break-after + div {
            margin-top: 20mm !important;
          }

          /* Force body background to fill margins in Vintage mode */
          body:has(.modal-overlay):not(.monochrome-print) {
            background: var(--bg-slate) !important; /* Solid vintage background paper color */
          }

          /* Reset root containers to auto height and visible overflow to enable multi-page prints only when modal is open */
          body:has(.modal-overlay) html, 
          body:has(.modal-overlay) body, 
          body:has(.modal-overlay) #root, 
          body:has(.modal-overlay) .app {
            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;
            overflow: visible !important;
          }

          /* Reset flexbox layout wrapper to block layout for clean page rendering */
          body:has(.modal-overlay) .app {
            display: block !important;
            width: 100% !important;
            height: auto !important;
            margin: 0 !important;
            padding: 0 !important;
            background: transparent !important;
          }

          /* Hide sidebar, headers, and other dashboard panels during report card printing */
          body:has(.modal-overlay) .sidebar,
          body:has(.modal-overlay) .page-header,
          body:has(.modal-overlay) .sidebar-overlay,
          body:has(.modal-overlay) .section > *:not(.modal-overlay),
          body:has(.modal-overlay) .no-print {
            display: none !important;
            visibility: hidden !important;
          }

          /* Reset main layout wrappers for natural print paging flow */
          body:has(.modal-overlay) .main-content {
            margin: 0 !important;
            margin-left: 0 !important; /* Remove sidebar width offset */
            padding: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            min-width: 100% !important;
            overflow: visible !important;
            display: block !important;
            position: relative !important;
            left: 0 !important;
            top: 0 !important;
          }

          body:has(.modal-overlay) .section {
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            overflow: visible !important;
            display: block !important;
          }

          /* Reset modal overlay to flow naturally as page blocks instead of a fixed centering box */
          body:has(.modal-overlay) .modal-overlay {
            position: static !important; /* Change from fixed/relative to static to participate in natural block flow */
            display: block !important;
            background: transparent !important;
            padding: 0 !important;
            margin: 0 !important;
            overflow: visible !important;
            backdrop-filter: none !important;
            z-index: auto !important;
            width: 100% !important;
            height: auto !important;
            max-height: none !important;
            max-width: none !important;
            top: auto !important;
            bottom: auto !important;
            left: auto !important;
            right: auto !important;
          }

          /* Remove max-height limits and overflows that cause page cropping */
          body:has(.modal-overlay) .report-card-modal {
            position: static !important;
            background: transparent !important;
            color: inherit !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            max-height: none !important;
            overflow: visible !important;
          }

          /* Base printable card setup for print sizing */
          body:has(.modal-overlay) .printable-report-card {
            box-sizing: border-box !important;
            overflow: visible !important;
            position: static !important; /* Eliminate absolute offset shifts */
          }

          body:has(.modal-overlay) thead {
            display: table-header-group !important;
          }

          body:has(.modal-overlay) tr {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }

          /* Monochrome print styles (when NOT in vintage mode) */
          body:has(.modal-overlay).monochrome-print {
            background: #ffffff !important;
          }

          body:has(.modal-overlay).monochrome-print .printable-report-card {
            background: #ffffff !important;
            border: 2px solid #000000 !important; /* Premium black border around report card */
            border-radius: 4px !important;
            padding: 10mm !important; /* Internal padding */
            margin: 0 !important; /* Managed by @page dynamic margins */
            width: 100% !important;
          }

          body:has(.modal-overlay).monochrome-print .printable-report-card * {
            color: #000000 !important;
            background: transparent !important;
            border-color: #000000 !important;
          }
          
          body:has(.modal-overlay).monochrome-print .printable-report-card h1,
          body:has(.modal-overlay).monochrome-print .printable-report-card h2,
          body:has(.modal-overlay).monochrome-print .printable-report-card h3,
          body:has(.modal-overlay).monochrome-print .printable-report-card strong,
          body:has(.modal-overlay).monochrome-print .printable-report-card span {
            color: #000000 !important;
          }

          /* Vintage print styles (reverts completely to the full-bleed older layout but with clean 20mm/15mm page margins) */
          body:has(.modal-overlay):not(.monochrome-print) .printable-report-card {
            background: var(--bg-slate) !important;
            border: none !important;
            border-radius: 0 !important;
            padding: 20mm 15mm !important; /* 20mm top/bottom, 15mm left/right paddings behave as page margins */
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            min-height: 297mm !important; /* Forces A4 page height */
          }

          body:has(.modal-overlay):not(.monochrome-print) .printable-report-card * {
            color: var(--text-primary) !important;
            border-color: var(--border) !important;
          }

          body:has(.modal-overlay):not(.monochrome-print) .printable-report-card td {
            color: var(--text-secondary) !important;
            border-color: var(--border-light) !important;
          }

          body:has(.modal-overlay):not(.monochrome-print) .printable-report-card h1,
          body:has(.modal-overlay):not(.monochrome-print) .printable-report-card h2,
          body:has(.modal-overlay):not(.monochrome-print) .printable-report-card h3 {
            color: var(--accent-teal) !important;
          }

          body:has(.modal-overlay):not(.monochrome-print) .printable-report-card tr {
            border-color: var(--border-light) !important;
          }
        }
      `}</style>
    </div>
  );
}
