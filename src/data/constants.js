export const FUNDING_OPTIONS = [
  'Seeking Full Scholarships (e.g., Gates Cambridge)',
  'Partial Funding',
  'Self-Funded',
];

export const COUNTRIES = ['USA', 'UK', 'Germany', 'Switzerland', 'India', 'New Zealand'];

export const DEFAULT_PROFILE = {
  fullName: '',
  targetTerm: 'Fall 2028',
  currentCourse: 'Robotics and Automation',
  collegeName: '',
  cgpa: '',
  funding: FUNDING_OPTIONS[0],
  researchInterests: '',
  internships: '',
  targetCountries: [], // empty array means "Any / No Preference"
  greScore: '',
  englishTestType: 'None', // 'None', 'IELTS', 'TOEFL'
  englishScore: '',
  lorsCount: 0,
  sopStatus: 'Not Started', // 'Not Started', 'Drafting', 'Under Review', 'Completed'
  transcriptsStatus: 'Not Started', // 'Not Started', 'Requested', 'Received'
  resumeFileName: '',
  resumeDataUrl: '',
  resumeText: '',
  extractedKeywords: [],
  resumeStrengths: [],
  resumeGaps: [],
  resumeParsedAt: null,
  graduatingYear: 2028,
};

export const ENGINEERING_KEYWORDS = [
  'Python',
  'Machine Learning',
  'ROS',
  'Control Systems',
  'C++',
  'TensorFlow',
  'PyTorch',
  'SLAM',
  'Computer Vision',
  'Reinforcement Learning',
  'Embedded Systems',
  'MATLAB',
  'Robotics',
  'Deep Learning',
  'Autonomous',
  'Kinematics',
  'PID',
  'OpenCV',
  'Linux',
  'Arduino',
  'PLC',
  'Neural Networks',
  'Path Planning',
  'Sensor Fusion',
];

export const COLLEGES = [
  // Computer Science Engineering & IT Programs
  {
    id: 'cmu-cs',
    name: 'Carnegie Mellon University',
    program: 'MS in Computer Science',
    country: 'USA',
    region: 'USA',
    minCgpa: 8.5,
    fundingTypes: ['partial', 'self'],
    tags: ['Elite', 'CS', 'Software Systems'],
    description: 'Premier computer science program in the world with access to world-class software systems, databases, and algorithms research.',
    keywords: ['python', 'c++', 'software systems', 'machine learning', 'linux', 'algorithms'],
    suitedBackgrounds: ['computer_science', 'it'],
  },
  {
    id: 'stanford-cs',
    name: 'Stanford University',
    program: 'MS in Computer Science',
    country: 'USA',
    region: 'USA',
    minCgpa: 8.7,
    fundingTypes: ['partial', 'self'],
    tags: ['Elite', 'CS', 'AI/Systems'],
    description: 'Silicon Valley gateway program with top-tier research tracks in algorithms, security, networks, and advanced software systems.',
    keywords: ['python', 'c++', 'algorithms', 'deep learning', 'software systems', 'linux'],
    suitedBackgrounds: ['computer_science', 'it', 'ai_ds'],
  },
  {
    id: 'mit-eecs-cs',
    name: 'MIT',
    program: 'Master of Engineering in Computer Science',
    country: 'USA',
    region: 'USA',
    minCgpa: 8.9,
    fundingTypes: ['full', 'partial'],
    tags: ['Elite', 'CS', 'Algorithms'],
    description: 'Highly competitive and prestigious computing program covering theoretical computer science, systems, and hardware-software integration.',
    keywords: ['python', 'c++', 'algorithms', 'linux', 'software systems'],
    suitedBackgrounds: ['computer_science', 'it'],
  },
  {
    id: 'oxford-cs',
    name: 'University of Oxford',
    program: 'MSc in Advanced Computer Science',
    country: 'UK',
    region: 'UK/Europe',
    minCgpa: 8.6,
    fundingTypes: ['full', 'partial'],
    tags: ['Elite', 'CS', 'Theory'],
    description: 'Highly mathematical CS curriculum with prestigious Clarendon and Oxford scholarship tracks.',
    keywords: ['algorithms', 'python', 'mathematics', 'machine learning', 'neural networks'],
    suitedBackgrounds: ['computer_science', 'it'],
  },
  {
    id: 'cambridge-cs',
    name: 'University of Cambridge',
    program: 'MPhil in Advanced Computer Science',
    country: 'UK',
    region: 'UK/Europe',
    minCgpa: 8.7,
    fundingTypes: ['full', 'partial'],
    tags: ['Elite', 'CS', 'Cambridge'],
    description: 'High-caliber research-focused computing degree with eligibility for the world-renowned Gates Cambridge Scholarship.',
    keywords: ['algorithms', 'python', 'c++', 'linux', 'neural networks'],
    suitedBackgrounds: ['computer_science', 'it'],
  },

  // AI & Data Science (AI/DS) Programs
  {
    id: 'mit-ai',
    name: 'MIT',
    program: 'MS in Artificial Intelligence and Decision Making',
    country: 'USA',
    region: 'USA',
    minCgpa: 8.8,
    fundingTypes: ['partial', 'self'],
    tags: ['Elite', 'AI/DS', 'Research'],
    description: 'Top-tier research program covering probabilistic systems, deep neural networks, machine learning, and decision theories.',
    keywords: ['machine learning', 'python', 'deep learning', 'neural networks', 'pyt', 'pytorch', 'tensorflow'],
    suitedBackgrounds: ['ai_ds', 'computer_science', 'it'],
  },
  {
    id: 'cmu-msml',
    name: 'Carnegie Mellon University',
    program: 'MS in Machine Learning',
    country: 'USA',
    region: 'USA',
    minCgpa: 8.8,
    fundingTypes: ['partial', 'self'],
    tags: ['Elite', 'AI/DS', 'ML'],
    description: 'Dedicated machine learning curriculum through the CMU Machine Learning Department, focusing on statistics and deep learning.',
    keywords: ['machine learning', 'python', 'deep learning', 'pytoch', 'pytorch', 'tensorflow', 'neural networks'],
    suitedBackgrounds: ['ai_ds', 'computer_science'],
  },
  {
    id: 'imperial-ai',
    name: 'Imperial College London',
    program: 'MSc in Artificial Intelligence',
    country: 'UK',
    region: 'UK/Europe',
    minCgpa: 8.3,
    fundingTypes: ['partial', 'self'],
    tags: ['Elite', 'AI', 'London'],
    description: 'Rigorous machine learning and data science curriculum in the heart of London, emphasizing reinforcement learning and deep models.',
    keywords: ['python', 'machine learning', 'pytorch', 'neural networks', 'deep learning'],
    suitedBackgrounds: ['ai_ds', 'computer_science', 'it'],
  },
  {
    id: 'ethz-ds',
    name: 'ETH Zurich',
    program: 'MS in Data Science',
    country: 'Switzerland',
    region: 'UK/Europe',
    minCgpa: 8.6,
    fundingTypes: ['partial', 'self'],
    tags: ['Elite', 'Data Science', 'Europe'],
    description: 'Excellent computational data science and artificial intelligence program in Switzerland with solid mathematical foundations.',
    keywords: ['python', 'machine learning', 'deep learning', 'neural networks', 'algorithms'],
    suitedBackgrounds: ['ai_ds', 'computer_science', 'it'],
  },

  // Robotics and Automation Programs
  {
    id: 'eth-robotics',
    name: 'ETH Zurich',
    program: 'MS in Robotics, Systems and Control',
    country: 'Switzerland',
    region: 'UK/Europe',
    minCgpa: 8.5,
    fundingTypes: ['partial', 'self'],
    tags: ['Elite', 'Robotics', 'Control'],
    description: 'Leading European systems control and autonomous systems robotics hub with cutting-edge laboratories.',
    keywords: ['ros', 'control systems', 'robotics', 'c++', 'slam', 'path planning', 'matlab'],
    suitedBackgrounds: ['robotics', 'electronics', 'mechanical'],
  },
  {
    id: 'upenn-robotics',
    name: 'University of Pennsylvania',
    program: 'MS in Robotics (ROBO)',
    country: 'USA',
    region: 'USA',
    minCgpa: 8.2,
    fundingTypes: ['partial', 'self'],
    tags: ['Elite', 'Robotics', 'Perception'],
    description: 'Famous GRASP Lab hosting cutting-edge multi-disciplinary robotics systems, kinematics, and computer vision.',
    keywords: ['robotics', 'computer vision', 'control systems', 'ros', 'slam', 'kinematics'],
    suitedBackgrounds: ['robotics', 'computer_science', 'electronics'],
  },
  {
    id: 'cmu-mrds',
    name: 'Carnegie Mellon University',
    program: 'MS in Robotic Systems Development (MRSD)',
    country: 'USA',
    region: 'USA',
    minCgpa: 8.6,
    fundingTypes: ['partial', 'self'],
    tags: ['Elite', 'Robotics', 'Systems'],
    description: 'Highly competitive and project-focused professional degree at CMU Robotics Institute incorporating software and hardware systems.',
    keywords: ['robotics', 'ros', 'c++', 'python', 'control systems', 'computer vision', 'slam'],
    suitedBackgrounds: ['robotics', 'electronics', 'mechanical', 'computer_science'],
  },
  {
    id: 'tum-robotics',
    name: 'Technical University of Munich (TUM)',
    program: 'MS in Robotics, Cognition, Intelligence',
    country: 'Germany',
    region: 'UK/Europe',
    minCgpa: 7.8,
    fundingTypes: ['full', 'partial'],
    tags: ['Robotics', 'Cognition', 'Germany'],
    description: 'German flagship degree linking cognitive robotics, control theory, autonomous agents, and system dynamics.',
    keywords: ['robotics', 'control systems', 'c++', 'python', 'linux', 'slam'],
    suitedBackgrounds: ['robotics', 'electronics', 'mechanical', 'computer_science'],
  },

  // Mechanical Engineering Programs
  {
    id: 'mit-mech',
    name: 'MIT',
    program: 'MS in Mechanical Engineering',
    country: 'USA',
    region: 'USA',
    minCgpa: 8.7,
    fundingTypes: ['partial', 'self'],
    tags: ['Elite', 'Mechanical', 'Dynamics'],
    description: 'World-renowned research labs in design, thermo-fluids, dynamic systems controls, and robotic kinematics.',
    keywords: ['control systems', 'matlab', 'kinematics', 'robotics', 'autonomous', 'linux'],
    suitedBackgrounds: ['mechanical', 'robotics'],
  },
  {
    id: 'berkeley-mech',
    name: 'UC Berkeley',
    program: 'MS in Mechanical Engineering',
    country: 'USA',
    region: 'USA',
    minCgpa: 8.5,
    fundingTypes: ['partial', 'self'],
    tags: ['Elite', 'Mechanical', 'Control'],
    description: 'Leading research in biomechanics, controls, mechanical design, and micro-electromechanical systems (MEMS).',
    keywords: ['matlab', 'control systems', 'linux', 'kinematics', 'autonomous'],
    suitedBackgrounds: ['mechanical', 'robotics'],
  },
  {
    id: 'stanford-mech',
    name: 'Stanford University',
    program: 'MS in Mechanical Engineering',
    country: 'USA',
    region: 'USA',
    minCgpa: 8.6,
    fundingTypes: ['partial', 'self'],
    tags: ['Elite', 'Mechanical', 'Design'],
    description: 'Elite mechanical engineering track focusing on hardware systems prototyping, controls, dynamics, and structural analysis.',
    keywords: ['matlab', 'control systems', 'kinematics', 'robotics', 'autonomous'],
    suitedBackgrounds: ['mechanical', 'robotics'],
  },
  {
    id: 'delft-mech',
    name: 'TU Delft',
    program: 'MSc in Mechanical Engineering',
    country: 'Netherlands',
    region: 'UK/Europe',
    minCgpa: 8.0,
    fundingTypes: ['partial', 'self'],
    tags: ['Elite', 'Mechanical', 'Europe'],
    description: 'Premier European program focusing on high-tech systems, structural design, and multi-body dynamics.',
    keywords: ['matlab', 'control systems', 'kinematics', 'robotics', 'linux'],
    suitedBackgrounds: ['mechanical', 'production'],
  },

  // Electronics and Communication Engineering (ECE) Programs
  {
    id: 'gatech-ece',
    name: 'Georgia Institute of Technology',
    program: 'MS in Electrical and Computer Engineering',
    country: 'USA',
    region: 'USA',
    minCgpa: 8.0,
    fundingTypes: ['partial', 'self'],
    tags: ['Elite', 'ECE', 'Embedded Systems'],
    description: 'Vast research areas in VLSI design, digital signal processing, telecommunications, micro-sensors, and embedded systems.',
    keywords: ['embedded systems', 'c++', 'arduino', 'sensor fusion', 'control systems', 'linux'],
    suitedBackgrounds: ['electronics', 'robotics'],
  },
  {
    id: 'eth-ee',
    name: 'ETH Zurich',
    program: 'MS in Electrical Engineering and IT',
    country: 'Switzerland',
    region: 'UK/Europe',
    minCgpa: 8.5,
    fundingTypes: ['partial', 'self'],
    tags: ['Elite', 'EE', 'Signal Processing'],
    description: 'Premier European ECE program specializing in wireless communications, integrated systems, and sensor fusion chips.',
    keywords: ['embedded systems', 'control systems', 'sensor fusion', 'linux', 'c++', 'arduino'],
    suitedBackgrounds: ['electronics', 'robotics'],
  },
  {
    id: 'stanford-ee',
    name: 'Stanford University',
    program: 'MS in Electrical Engineering',
    country: 'USA',
    region: 'USA',
    minCgpa: 8.7,
    fundingTypes: ['partial', 'self'],
    tags: ['Elite', 'EE', 'Hardware'],
    description: 'Elite ECE curriculum offering world-class VLSI labs, physical sensor systems research, and embedded architectures.',
    keywords: ['embedded systems', 'c++', 'linux', 'sensor fusion', 'control systems'],
    suitedBackgrounds: ['electronics', 'robotics'],
  },
  {
    id: 'ntu-ece',
    name: 'Nanyang Technological University (NTU)',
    program: 'MSc in Electronics',
    country: 'Singapore',
    region: 'Asia',
    minCgpa: 8.0,
    fundingTypes: ['partial', 'self'],
    tags: ['ECE', 'Semiconductor', 'Asia'],
    description: 'Asian hub for VLSI design, semiconductor devices, embedded microcontroller firmware, and signal processing.',
    keywords: ['embedded systems', 'arduino', 'c++', 'sensor fusion', 'control systems'],
    suitedBackgrounds: ['electronics', 'robotics'],
  },

  // Production Engineering Programs
  {
    id: 'columbia-ieor',
    name: 'Columbia University',
    program: 'MS in Operations Research & Production Systems',
    country: 'USA',
    region: 'USA',
    minCgpa: 8.4,
    fundingTypes: ['partial', 'self'],
    tags: ['Elite', 'Production', 'Operations'],
    description: 'Focuses on production logistics, automation scheduling, industrial processes, PLC controls, and mathematical optimization.',
    keywords: ['control systems', 'robotics', 'matlab', 'arduino', 'plc', 'linux'],
    suitedBackgrounds: ['production', 'mechanical'],
  },
  {
    id: 'michigan-ioe',
    name: 'University of Michigan',
    program: 'MS in Industrial and Operations Engineering',
    country: 'USA',
    region: 'USA',
    minCgpa: 8.2,
    fundingTypes: ['partial', 'self'],
    tags: ['Elite', 'Production', 'Logistics'],
    description: 'Focuses on factory automation, human-machine interaction, layout optimizations, and industrial logistics.',
    keywords: ['control systems', 'robotics', 'matlab', 'plc', 'linux'],
    suitedBackgrounds: ['production', 'mechanical'],
  },
  {
    id: 'kth-production',
    name: 'KTH Royal Institute of Technology',
    program: 'MS in Production Engineering and Management',
    country: 'Sweden',
    region: 'UK/Europe',
    minCgpa: 7.8,
    fundingTypes: ['partial', 'self'],
    tags: ['Production', 'Manufacturing', 'Europe'],
    description: 'Sweden\'s flagship production degree covering CNC automation, additive manufacturing, and robotics production lines.',
    keywords: ['control systems', 'robotics', 'matlab', 'plc', 'linux'],
    suitedBackgrounds: ['production', 'mechanical'],
  },
  {
    id: 'rwth-production',
    name: 'RWTH Aachen University',
    program: 'MSc in Production Engineering',
    country: 'Germany',
    region: 'UK/Europe',
    minCgpa: 7.5,
    fundingTypes: ['full', 'partial'],
    tags: ['Production', 'Industrial', 'Germany'],
    description: 'Highly prestigious German production engineering program specializing in manufacturing automation, machine tools, and industrial robotics.',
    keywords: ['control systems', 'matlab', 'plc', 'robotics', 'linux'],
    suitedBackgrounds: ['production', 'mechanical'],
  },

  // Rubber and Plastics / Materials Science & Technology Programs
  {
    id: 'mit-materials',
    name: 'MIT',
    program: 'MS in Materials Science (Polymer/Soft Matter Track)',
    country: 'USA',
    region: 'USA',
    minCgpa: 8.7,
    fundingTypes: ['partial', 'self'],
    tags: ['Elite', 'Materials', 'Polymers'],
    description: 'Leading studies in synthetic soft matter, rubber mechanics, smart elastomers, and block copolymer structures.',
    keywords: ['control systems', 'matlab', 'robotics', 'autonomous', 'linux', 'python'],
    suitedBackgrounds: ['rubber_plastics', 'mechanical'],
  },
  {
    id: 'northwestern-materials',
    name: 'Northwestern University',
    program: 'MS in Materials Science (Soft Materials)',
    country: 'USA',
    region: 'USA',
    minCgpa: 8.3,
    fundingTypes: ['partial', 'self'],
    tags: ['Elite', 'Materials', 'Soft Matter'],
    description: 'Premier materials research institute specializing in soft materials characterization, polymer dynamics, and elastic structural rubbers.',
    keywords: ['control systems', 'robotics', 'matlab', 'autonomous', 'python', 'linux'],
    suitedBackgrounds: ['rubber_plastics', 'mechanical'],
  },
  {
    id: 'auckland-materials',
    name: 'University of Auckland',
    program: 'Master of Engineering in Materials Engineering',
    country: 'New Zealand',
    region: 'Oceania',
    minCgpa: 7.5,
    fundingTypes: ['partial', 'self'],
    tags: ['Materials', 'Polymer Science', 'Oceania'],
    description: 'Specialized programs in industrial polymer properties, structural elastomeric testing, and composite material failures.',
    keywords: ['control systems', 'matlab', 'robotics', 'embedded systems', 'linux', 'python'],
    suitedBackgrounds: ['rubber_plastics', 'mechanical'],
  },
  {
    id: 'akron-polymers',
    name: 'University of Akron',
    program: 'MS in Polymer Science and Polymer Engineering',
    country: 'USA',
    region: 'USA',
    minCgpa: 7.8,
    fundingTypes: ['full', 'partial'],
    tags: ['Elite', 'Polymers', 'Rubber'],
    description: 'World-famous flagship institution for rubber research, polymer engineering, and elastomer chemical mechanics.',
    keywords: ['control systems', 'matlab', 'python', 'autonomous', 'linux'],
    suitedBackgrounds: ['rubber_plastics', 'mechanical'],
  },
];

export const KANBAN_COLUMNS = [
  { id: 'interested', title: 'Interested', color: '#64748b' },
  { id: 'in-progress', title: 'In Progress', color: '#0d9488' },
  { id: 'submitted', title: 'Submitted', color: '#3b82f6' },
  { id: 'decisions', title: 'Decisions', color: '#a855f7' },
];

export function cgpaToUsEquivalent(cgpa) {
  const value = parseFloat(cgpa);
  if (isNaN(value) || value < 0 || value > 10) return null;
  const usGpa = (value / 10) * 4;
  return usGpa.toFixed(1);
}

export function getCourseCategory(currentCourse) {
  const course = (currentCourse || '').toLowerCase().trim();
  if (course.includes('robotics')) {
    return 'robotics';
  }
  if (course.includes('mechanical')) {
    return 'mechanical';
  }
  if (course.includes('electronics')) {
    return 'electronics';
  }
  if (course.includes('production')) {
    return 'production';
  }
  if (course.includes('ai') || course.includes('ds')) {
    return 'ai_ds';
  }
  if (course.includes('computer')) {
    return 'computer_science';
  }
  if (course.includes('information') || course.includes('(it)') || course === 'it') {
    return 'it';
  }
  if (course.includes('rubber') || course.includes('plastics')) {
    return 'rubber_plastics';
  }
  return 'general';
}

export function generateRoadmap(college, graduatingYear = 2028, currentCourse = '') {
  const preFinalYear = graduatingYear - 1;
  const appYear = graduatingYear - 1;
  const category = getCourseCategory(currentCourse);

  let internshipText = 'Build research credentials aligned with ' + college.program;
  let portfolioText = 'Develop dynamic mechanical designs and stress analysis reports.';

  if (category === 'computer_science') {
    internshipText = 'Secure a software development or AI research internship focusing on ML models or software SLAM.';
    portfolioText = 'Host your code on GitHub; build a portfolio of ML, CV, or robotics control software repositories.';
  } else if (category === 'electronics') {
    internshipText = 'Secure an embedded systems or IoT lab research internship focusing on sensor integration or PCB layouts.';
    portfolioText = 'Build physical prototypes with microcontroller firmware (STM32, ESP32, Arduino) and custom SPI/I2C PCB hubs.';
  } else if (category === 'mechanical') {
    internshipText = 'Secure a mechanical engineering or control dynamics research internship focusing on CAD design or FEA simulations.';
    portfolioText = 'Develop mechanical simulations, design physical CAD robot assemblies, and run Finite Element Analysis stress studies.';
  } else if (category === 'robotics') {
    internshipText = 'Secure a robotics lab research internship focusing on ROS/ROS2 node coding, SLAM mapping, or path planning.';
    portfolioText = 'Design simulation tasks using Gazebo/Webots; build ROS2 nodes for kinematics and sensor feedback control loops.';
  }

  return [
    {
      id: `${college.id}-1`,
      phase: 'Pre-Final Year',
      date: `May ${preFinalYear - 1}`,
      title: 'Secure Research Internship',
      description: internshipText,
      status: 'upcoming',
    },
    {
      id: `${college.id}-2`,
      phase: 'Pre-Final Year',
      date: `August ${preFinalYear - 1}`,
      title: 'Identify Supervisors & Research Fit',
      description: `Research faculty at ${college.name} and draft outreach emails`,
      status: 'upcoming',
    },
    {
      id: `${college.id}-3`,
      phase: 'Final Year Semester 7',
      date: `January ${appYear}`,
      title: 'Take IELTS/GRE',
      description: 'Complete standardized tests; target IELTS 7.5+ / GRE 320+',
      status: 'upcoming',
    },
    {
      id: `${college.id}-4`,
      phase: 'Final Year Semester 7',
      date: `March ${appYear}`,
      title: 'Build Project Portfolio',
      description: portfolioText,
      status: 'upcoming',
    },
    {
      id: `${college.id}-5`,
      phase: 'Final Year Semester 7',
      date: `April ${appYear}`,
      title: 'Request Recommendation Letters',
      description: 'Secure 3 strong LORs from professors and internship mentors',
      status: 'upcoming',
    },
    {
      id: `${college.id}-6`,
      phase: 'Final Year Semester 8',
      date: `June ${appYear}`,
      title: 'Draft Statement of Purpose',
      description: `Tailor SOP for ${college.name} — ${college.program}`,
      status: 'upcoming',
    },
    {
      id: `${college.id}-7`,
      phase: 'Final Year Semester 8',
      date: `September ${appYear}`,
      title: 'Submit Application',
      description: `Complete portal submission for ${college.name}`,
      status: 'upcoming',
    },
    {
      id: `${college.id}-8`,
      phase: 'Application Cycle',
      date: `December ${appYear}`,
      title: college.region === 'UK/Europe' ? 'Submit Gates Cambridge Application' : 'Apply for Funding/Scholarships',
      description: college.region === 'UK/Europe'
        ? 'Gates Cambridge / Clarendon / DAAD scholarship deadlines'
        : 'Fellowship and assistantship applications',
      status: 'upcoming',
    },
    {
      id: `${college.id}-9`,
      phase: 'Post-Graduation',
      date: `May ${graduatingYear}`,
      title: 'Graduate & Prepare for Departure',
      description: 'Complete B.E., obtain transcripts, arrange visa',
      status: 'upcoming',
    },
  ];
}

export function matchColleges(profile) {
  const cgpa = parseFloat(profile.cgpa) || 0;
  const isFullScholarship = profile.funding === FUNDING_OPTIONS[0];
  const isHighAchiever = cgpa >= 8.5;
  const resumeKeywords = profile.extractedKeywords || [];
  const resumeText = (profile.resumeText || '').toLowerCase();
  const interestText = (profile.researchInterests || '').toLowerCase();
  const combinedContext = `${resumeText} ${interestText} ${resumeKeywords.join(' ').toLowerCase()}`;
  const targetCountries = profile.targetCountries || [];
  const courseCategory = getCourseCategory(profile.currentCourse);

  return COLLEGES.map((college) => {
    const cgpaMatch = cgpa >= college.minCgpa;
    const fundingMatch =
      profile.funding === FUNDING_OPTIONS[2]
        ? true
        : profile.funding === FUNDING_OPTIONS[1]
          ? college.fundingTypes.includes('partial') || college.fundingTypes.includes('self')
          : college.fundingTypes.includes('full') || college.fundingTypes.includes('partial');

    const countryMatch = targetCountries.length === 0 || targetCountries.includes(college.country);
    
    // Check if college matches undergrad background major
    const courseMatch = (college.suitedBackgrounds || []).includes(courseCategory);

    const researchMatch =
      !profile.researchInterests && resumeKeywords.length === 0
        ? false
        : (profile.researchInterests || '').toLowerCase().split(/[\s,]+/).some((word) =>
            word.length > 3 &&
            (college.program.toLowerCase().includes(word) ||
              college.tags.some((t) => t.toLowerCase().includes(word)) ||
              college.description.toLowerCase().includes(word))
          ) ||
          resumeKeywords.some((kw) =>
            college.program.toLowerCase().includes(kw.toLowerCase()) ||
            college.tags.some((t) => t.toLowerCase().includes(kw.toLowerCase())) ||
            college.description.toLowerCase().includes(kw.toLowerCase()) ||
            (college.keywords || []).some((k) => k.toLowerCase().includes(kw.toLowerCase()))
          );

    const collegeKeywords = college.keywords || [];
    const keywordHits = resumeKeywords.filter((kw) =>
      collegeKeywords.some((ck) => ck.toLowerCase().includes(kw.toLowerCase()) || kw.toLowerCase().includes(ck.toLowerCase())) ||
      combinedContext.includes(kw.toLowerCase()) && collegeKeywords.some((ck) => combinedContext.includes(ck))
    );

    const uniqueKeywordHits = [...new Set(keywordHits.map((k) => k.toLowerCase()))];
    const resumeAlignment = collegeKeywords.filter((ck) => combinedContext.includes(ck.toLowerCase())).length;

    let score = 0;
    if (cgpaMatch) score += 25;
    if (fundingMatch) score += 15;
    if (researchMatch) score += 15;
    if (uniqueKeywordHits.length > 0) score += Math.min(15, uniqueKeywordHits.length * 4);
    if (resumeAlignment > 0) score += Math.min(10, resumeAlignment * 3);
    if (college.region === 'UK/Europe' && isHighAchiever && isFullScholarship) score += 10;
    
    // Country boost if explicitly preferred
    if (targetCountries.length > 0 && countryMatch) score += 10;
    
    // Undergrad branch alignment boost
    if (courseMatch) score += 15;

    score = Math.min(100, score);

    const highScholarshipChance =
      isHighAchiever &&
      isFullScholarship &&
      college.region === 'UK/Europe' &&
      college.fundingTypes.includes('full') &&
      cgpaMatch;

    return {
      ...college,
      matchScore: score,
      cgpaMatch,
      fundingMatch,
      countryMatch,
      courseMatch,
      researchMatch,
      resumeKeywordHits: uniqueKeywordHits,
      highScholarshipChance,
      isRecommended: score >= 50,
    };
  }).sort((a, b) => {
    if (a.highScholarshipChance && !b.highScholarshipChance) return -1;
    if (!a.highScholarshipChance && b.highScholarshipChance) return 1;
    return b.matchScore - a.matchScore;
  });
}
