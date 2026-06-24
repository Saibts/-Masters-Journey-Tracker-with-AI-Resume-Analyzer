function StrengthsGapsChecklist({ profile }) {
  const strengths = profile.resumeStrengths || [];
  const gaps = profile.resumeGaps || [];
  const hasResumeData = profile.resumeText || profile.extractedKeywords?.length > 0;

  if (!hasResumeData) {
    return (
      <div className="dashboard-card card full-width">
        <h3>💪 Strengths vs Gaps</h3>
        <p className="muted">Upload your resume above to generate a personalized strengths and gaps checklist.</p>
      </div>
    );
  }

  return (
    <div className="dashboard-card card full-width">
      <h3>💪 Strengths vs Gaps</h3>
      <p className="card-desc">
        Auto-generated from resume analysis
        {profile.resumeParsedAt && (
          <> · Last parsed {new Date(profile.resumeParsedAt).toLocaleString()}</>
        )}
      </p>
      <div className="checklist-grid">
        <div className="checklist-column strengths-column">
          <h4 className="checklist-heading">Strengths</h4>
          <ul className="checklist-list">
            {strengths.map((item) => (
              <li key={item.id} className="checklist-item strength-item">
                {item.text}
              </li>
            ))}
          </ul>
        </div>
        <div className="checklist-column gaps-column">
          <h4 className="checklist-heading">Gaps</h4>
          <ul className="checklist-list">
            {gaps.length === 0 ? (
              <li className="checklist-item gap-item gap-none">
                ✅ No critical gaps detected — strong resume alignment.
              </li>
            ) : (
              gaps.map((item) => (
                <li
                  key={item.id}
                  className={`checklist-item gap-item severity-${item.severity}`}
                >
                  {item.text}
                </li>
              ))
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default StrengthsGapsChecklist;
