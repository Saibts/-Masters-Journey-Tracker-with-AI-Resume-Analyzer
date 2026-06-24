import { ENGINEERING_KEYWORDS } from '../data/constants';

const RESEARCH_TOKENS = ['ieee', 'publication', 'journal', 'conference'];
const PREMIER_TOKENS = ['iit', 'iisc', 'internship', 'fellowship'];

const COURSE_KEYWORDS = {
  'be robotics and automation': ['ROS', 'Control Systems', 'Robotics', 'C++', 'Path Planning', 'MATLAB'],
  'be mechanical engineering': ['Control Systems', 'MATLAB', 'Robotics', 'Kinematics', 'Autonomous', 'Linux'],
  'electronics and communication engineering': ['Embedded Systems', 'C++', 'Control Systems', 'Arduino', 'Linux', 'Sensor Fusion'],
  'production engineering': ['Control Systems', 'Robotics', 'MATLAB', 'Arduino', 'PLC', 'Linux'],
  'ai/ds': ['Machine Learning', 'Python', 'Deep Learning', 'PyTorch', 'TensorFlow', 'Neural Networks'],
  'computer science engineering': ['Python', 'C++', 'Machine Learning', 'Linux', 'Deep Learning', 'OpenCV'],
  'information technology (it)': ['Python', 'C++', 'Machine Learning', 'Linux', 'Deep Learning', 'OpenCV'],
  'rubber and plastics technology': ['Control Systems', 'Robotics', 'MATLAB', 'Autonomous', 'Linux', 'Python']
};

export function extractKeywords(text) {
  const lower = text.toLowerCase();
  return ENGINEERING_KEYWORDS.filter((keyword) => lower.includes(keyword.toLowerCase()));
}

export function detectGaps(text, foundKeywords, currentCourse = '') {
  const lower = text.toLowerCase();
  const gaps = [];
  const courseKey = (currentCourse || '').trim().toLowerCase();

  const hasResearch = RESEARCH_TOKENS.some((token) => lower.includes(token));
  if (!hasResearch) {
    gaps.push({
      id: 'gap-research-publication',
      severity: 'critical',
      text: '🔴 CRITICAL GAP: No research publication found on resume. Consider publishing a paper to improve elite program compatibility.',
    });
  }

  const hasPremier = PREMIER_TOKENS.some((token) => lower.includes(token));
  if (!hasPremier) {
    gaps.push({
      id: 'gap-internship-exposure',
      severity: 'warning',
      text: '🟡 GAP: Missing high-impact research internship exposure. Target a summer/winter fellowship at an IIT/IISc lab.',
    });
  }

  const targetCore = COURSE_KEYWORDS[courseKey] || ['Python', 'Machine Learning', 'ROS', 'Control Systems'];

  targetCore.forEach((keyword) => {
    if (!foundKeywords.some((k) => k.toLowerCase() === keyword.toLowerCase())) {
      gaps.push({
        id: `gap-missing-${keyword.toLowerCase().replace(/\s+/g, '-')}`,
        severity: 'info',
        text: `🟠 GAP: "${keyword}" not detected on resume — strengthen this for your branch (${currentCourse || 'General'}) alignment.`,
      });
    }
  });

  return gaps;
}

export function buildStrengths(foundKeywords) {
  if (foundKeywords.length === 0) {
    return [{
      id: 'strength-none',
      text: 'ℹ️ No core engineering keywords detected yet. Upload a detailed resume to unlock strengths.',
    }];
  }

  return foundKeywords.map((keyword) => ({
    id: `strength-${keyword.toLowerCase().replace(/\s+/g, '-')}`,
    text: `✅ STRENGTH: "${keyword}" detected on resume — aligns with target program expectations.`,
  }));
}

export function analyzeResume(text, currentCourse = '') {
  const extractedKeywords = extractKeywords(text);
  const strengths = buildStrengths(extractedKeywords);
  const gaps = detectGaps(text, extractedKeywords, currentCourse);

  // Calculate ATS Score
  let score = 50;

  // Keyword density
  score += Math.min(25, extractedKeywords.length * 2.5);

  // Research experience
  const hasResearch = RESEARCH_TOKENS.some((token) => text.toLowerCase().includes(token));
  if (hasResearch) score += 12;

  // Premier internships
  const hasPremier = PREMIER_TOKENS.some((token) => text.toLowerCase().includes(token));
  if (hasPremier) score += 13;

  // Word count check
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  if (wordCount >= 200 && wordCount <= 1200) {
    score += 10;
  } else if (wordCount > 0) {
    score -= 10; // Too short or too long
  }

  const atsScore = Math.max(10, Math.min(100, Math.round(score)));

  // Generate dynamic AI Recommendations to improve ATS score
  const aiRecommendations = [];
  if (!hasResearch) {
    aiRecommendations.push('Submit a research preprint or paper (target IEEE ICRA/IROS or a local journal) to fill the publication gap.');
  }
  if (!hasPremier) {
    aiRecommendations.push('Apply for research internships or winter/summer fellowships at IITs, IISc, or international labs.');
  }
  if (extractedKeywords.length < 5) {
    aiRecommendations.push('Include more core engineering skills (C++, Python) and domain-specific keywords (ROS, SLAM, OpenCV) relevant to your target programs.');
  }
  if (wordCount < 200) {
    aiRecommendations.push('Your resume is too brief. Expand on your project methodologies, tools, and quantitative results.');
  }

  return {
    extractedKeywords,
    resumeStrengths: strengths,
    resumeGaps: gaps,
    atsScore,
    aiRecommendations,
    resumeParsedAt: new Date().toISOString(),
  };
}

export function mergeResumeIntoProfile(profile, resumeData, analysis) {
  const mergedInterests = mergeResearchInterests(profile.researchInterests, analysis.extractedKeywords);

  return {
    ...profile,
    resumeFileName: resumeData.fileName,
    resumeDataUrl: resumeData.dataUrl,
    resumeText: resumeData.text,
    extractedKeywords: analysis.extractedKeywords,
    resumeStrengths: analysis.resumeStrengths,
    resumeGaps: analysis.resumeGaps,
    atsScore: analysis.atsScore,
    aiRecommendations: analysis.aiRecommendations,
    resumeParsedAt: analysis.resumeParsedAt,
    researchInterests: mergedInterests,
  };
}

function mergeResearchInterests(existing, keywords) {
  const existingTerms = (existing || '')
    .split(/[,;\n]+/)
    .map((t) => t.trim())
    .filter(Boolean);

  const newTerms = keywords.filter(
    (kw) => !existingTerms.some((t) => t.toLowerCase() === kw.toLowerCase())
  );

  if (newTerms.length === 0) return existing || '';

  const combined = [...existingTerms, ...newTerms];
  return combined.join(', ');
}
