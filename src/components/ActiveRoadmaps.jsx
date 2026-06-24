import { COLLEGES } from '../data/constants';
import { updateRoadmapStep } from '../utils/storage';

const STATUS_OPTIONS = ['upcoming', 'in-progress', 'completed'];

export default function ActiveRoadmaps({ state, onStateChange }) {
  const bookmarks = state.bookmarks || [];
  const roadmaps = state.roadmaps || {};
  const profile = state.profile;

  if (!profile) {
    return (
      <div className="section">
        <div className="empty-state card">
          <h2>My Active Roadmaps</h2>
          <p>Bookmark programs from College Discovery to auto-generate personalized roadmaps.</p>
        </div>
      </div>
    );
  }

  if (bookmarks.length === 0) {
    return (
      <div className="section">
        <div className="empty-state card">
          <h2>My Active Roadmaps</h2>
          <p>No bookmarked programs yet. Head to College Discovery and bookmark programs to generate step-by-step timelines.</p>
        </div>
      </div>
    );
  }

  const handleStepStatus = (collegeId, stepId, status) => {
    updateRoadmapStep(collegeId, stepId, status);
    onStateChange();
  };

  return (
    <div className="section">
      <div className="section-header">
        <h2>My Active Roadmaps</h2>
        <p className="section-desc">
          Graduating May {profile.graduatingYear || 2028} — personalized timelines for each bookmarked program
        </p>
      </div>

      <div className="roadmaps-container">
        {bookmarks.map((collegeId) => {
          const college = COLLEGES.find((c) => c.id === collegeId);
          const steps = roadmaps[collegeId] || [];
          if (!college) return null;

          const completed = steps.filter((s) => s.status === 'completed').length;
          const progress = steps.length ? Math.round((completed / steps.length) * 100) : 0;

          return (
            <div key={collegeId} className="roadmap-card card">
              <div className="roadmap-header">
                <div>
                  <h3>{college.name}</h3>
                  <p className="roadmap-program">{college.program}</p>
                </div>
                <div className="roadmap-progress">
                  <span className="progress-label">{progress}% complete</span>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }} />
                  </div>
                </div>
              </div>

              <div className="timeline">
                {steps.map((step, index) => (
                  <div key={step.id} className={`timeline-item status-${step.status}`}>
                    <div className="timeline-marker">
                      <span className="timeline-dot" />
                      {index < steps.length - 1 && <span className="timeline-line" />}
                    </div>
                    <div className="timeline-content">
                      <div className="timeline-meta">
                        <span className="timeline-phase">{step.phase}</span>
                        <span className="timeline-date">{step.date}</span>
                      </div>
                      <h4 className="timeline-title">{step.title}</h4>
                      <p className="timeline-desc">{step.description}</p>
                      <select
                        className="status-select"
                        value={step.status}
                        onChange={(e) => handleStepStatus(collegeId, step.id, e.target.value)}
                      >
                        {STATUS_OPTIONS.map((s) => (
                          <option key={s} value={s}>{s.replace('-', ' ')}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
