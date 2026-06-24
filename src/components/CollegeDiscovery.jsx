import CollegeCard from './CollegeCard';

export default function CollegeDiscovery({ state, matchedColleges, onStateChange }) {
  const bookmarks = state.bookmarks || [];
  const profile = state.profile;
  const graduatingYear = profile?.graduatingYear || 2028;

  const elitePrograms = matchedColleges.filter((c) => c.tags.includes('Elite'));
  const otherPrograms = matchedColleges.filter((c) => !c.tags.includes('Elite'));

  if (!profile) {
    return (
      <div className="section">
        <div className="empty-state card">
          <h2>College Discovery</h2>
          <p>Create your profile first to unlock personalized program matching.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="section-header">
        <h2>College Discovery</h2>
        <p className="section-desc">
          {matchedColleges.filter((c) => c.isRecommended).length} programs matched to your profile
        </p>
      </div>

      <div className="discovery-filters card">
        <div className="filter-chip active">All Programs</div>
        <div className="filter-chip">Elite ({elitePrograms.length})</div>
        <div className="filter-chip">
          Scholarship Fits ({matchedColleges.filter((c) => c.highScholarshipChance).length})
        </div>
        <div className="filter-chip">Bookmarked ({bookmarks.length})</div>
      </div>

      <div className="discovery-section">
        <h3 className="discovery-heading">🌟 Elite Global {profile.currentCourse || 'Engineering'} Programs</h3>
        <div className="college-grid">
          {elitePrograms.map((college) => (
            <CollegeCard
              key={college.id}
              college={college}
              isBookmarked={bookmarks.includes(college.id)}
              onBookmarkChange={onStateChange}
              graduatingYear={graduatingYear}
              profile={profile}
            />
          ))}
        </div>
      </div>

      {otherPrograms.length > 0 && (
        <div className="discovery-section">
          <h3 className="discovery-heading">📚 Additional Matches</h3>
          <div className="college-grid">
            {otherPrograms.map((college) => (
              <CollegeCard
                key={college.id}
                college={college}
                isBookmarked={bookmarks.includes(college.id)}
                onBookmarkChange={onStateChange}
                graduatingYear={graduatingYear}
                profile={profile}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
