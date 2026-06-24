import { generateRoadmap } from '../data/constants';
import { toggleBookmark, saveRoadmap } from '../utils/storage';

export default function CollegeCard({ college, isBookmarked, onBookmarkChange, graduatingYear = 2028, profile }) {
  const handleBookmark = () => {
    toggleBookmark(college.id);
    if (!isBookmarked) {
      const steps = generateRoadmap(college, graduatingYear, profile?.currentCourse);
      saveRoadmap(college.id, steps);
    }
    onBookmarkChange();
  };

  return (
    <div className={`college-card card ${college.isRecommended ? 'recommended' : ''}`}>
      <div className="college-card-header">
        <div>
          <h3 className="college-name">{college.name}</h3>
          <p className="college-program">{college.program}</p>
        </div>
        <span className="college-region">{college.country}</span>
      </div>

      <p className="college-desc">{college.description}</p>

      <div className="college-tags">
        {college.tags.map((tag) => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>

      <div className="college-meta">
        <span className="meta-item">Min CGPA: {college.minCgpa}/10</span>
        <span className="meta-item match-score-pill">{college.matchScore}% match</span>
      </div>

      {college.courseMatch && profile && (
        <span className="badge badge-course-match">
          ✓ Fits {profile.currentCourse}
        </span>
      )}

      {college.resumeKeywordHits && college.resumeKeywordHits.length > 0 && (
        <div className="card-resume-hits">
          <span className="hits-label">Resume Match:</span>
          <div className="hits-chips">
            {college.resumeKeywordHits.map((kw) => (
              <span key={kw} className="hit-chip">{kw}</span>
            ))}
          </div>
        </div>
      )}

      {college.highScholarshipChance && (
        <span className="badge badge-scholarship">High Chance for Fully Funded Scholarship</span>
      )}

      <button
        className={`btn ${isBookmarked ? 'btn-bookmarked' : 'btn-outline'}`}
        onClick={handleBookmark}
      >
        {isBookmarked ? '★ Bookmarked' : '☆ Bookmark Program'}
      </button>
    </div>
  );
}
