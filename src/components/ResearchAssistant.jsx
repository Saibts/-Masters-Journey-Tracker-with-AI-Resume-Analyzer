import { useState } from 'react';
import { saveResearchPapers } from '../utils/storage';


const VENUES = {
  robotics: [
    { name: 'IEEE ICRA', type: 'Conference', level: 'Elite', cycle: 'September deadline (annual)', desc: 'International Conference on Robotics and Automation. The premier flagship robotics conference.' },
    { name: 'IROS', type: 'Conference', level: 'Top-tier', cycle: 'March deadline (annual)', desc: 'IEEE/RSJ International Conference on Intelligent Robots and Systems.' },
    { name: 'RSS', type: 'Conference', level: 'Elite', cycle: 'January deadline (annual)', desc: 'Robotics: Science and Systems. Highly selective, focus on mathematical and algorithmic foundations.' },
    { name: 'IEEE T-RO', type: 'Journal', level: 'Elite', cycle: 'Year-round', desc: 'IEEE Transactions on Robotics. High-impact journal for comprehensive research papers.' }
  ],
  ml_ai: [
    { name: 'NeurIPS', type: 'Conference', level: 'Elite', cycle: 'May deadline (annual)', desc: 'Neural Information Processing Systems. The largest and most prestigious machine learning conference.' },
    { name: 'ICML', type: 'Conference', level: 'Elite', cycle: 'January deadline (annual)', desc: 'International Conference on Machine Learning.' },
    { name: 'CVPR', type: 'Conference', level: 'Elite', cycle: 'November deadline (annual)', desc: 'IEEE Conference on Computer Vision and Pattern Recognition. Highest impact in computer vision.' },
    { name: 'IROS / ICRA (Learning Track)', type: 'Conference', level: 'Top-tier', cycle: 'Varies', desc: 'Robotics venues with heavy learning-based control focus.' }
  ],
  control_systems: [
    { name: 'CDC', type: 'Conference', level: 'Top-tier', cycle: 'March deadline (annual)', desc: 'IEEE Conference on Decision and Control. Premier control theory conference.' },
    { name: 'ACC', type: 'Conference', level: 'Top-tier', cycle: 'September deadline (annual)', desc: 'American Control Conference.' },
    { name: 'Automatica', type: 'Journal', level: 'Elite', cycle: 'Year-round', desc: 'IFAC Journal. Flagship venue for control theory, mathematical systems.' }
  ]
};

const COURSE_RECOMMENDATIONS = {
  robotics: {
    title: 'Robotics and Automation',
    topics: [
      'ROS2-based multi-agent cooperative path planning',
      'SLAM mapping and loop closure optimization in dynamic environments',
      'Manipulator kinematics and trajectory generation under dynamic constraints'
    ],
    advice: 'Since you are in a Robotics program, leverage ROS/ROS2, simulation suites (Gazebo/Webots), and microcontrollers to build end-to-end hardware-in-the-loop projects.'
  },
  mechanical: {
    title: 'Mechanical Engineering',
    topics: [
      'CAD optimization and lightweight structural design of custom drone chassis',
      'Finite Element Analysis (FEA) of robot joints under high dynamic load stresses',
      'Dynamic modeling and system identification of non-linear mechanical links'
    ],
    advice: 'With a Mechanical background, emphasize your structural, kinematic, and dynamics expertise. Focus on CAD, mechanical dynamic simulations, materials, and physical stress modeling.'
  },
  electronics: {
    title: 'Electronics and Communication Engineering',
    topics: [
      'High-speed PCB design for micro-controller sensor hubs with low-latency SPI/I2C communication',
      'Custom embedded firmware design for IMU-to-motor PID feedback loop control',
      'FPGA implementation of real-time image processing filters for camera streams'
    ],
    advice: 'For Electronics/Electrical students, highlight embedded systems, firmware, sensor fusion, PCBs, and microcontroller programming. Focus on hardware-software interfaces.'
  },
  production: {
    title: 'Production Engineering',
    topics: [
      'PLC-based automated sortation system design and logic validation',
      'Optimization of supply chain warehouse logistics using digital twin simulation modeling',
      'Lean manufacturing layout optimization for robotic automated assembly lines'
    ],
    advice: 'Highlight process automation, factory simulation, PLC logic, warehousing optimization, and industrial controls. Show how automation increases production efficiency.'
  },
  ai_ds: {
    title: 'AI/DS',
    topics: [
      'Deep reinforcement learning for autonomous driving navigation policy training',
      'Predictive maintenance of industrial robot actuators using time-series anomaly detection',
      'Generative model fine-tuning for robotic grasp pose estimation in clutter'
    ],
    advice: 'Emphasize dataset preparation, deep neural network training, model evaluation metrics, and predictive algorithm deployment.'
  },
  computer_science: {
    title: 'Computer Science Engineering',
    topics: [
      'Real-time multi-threaded point cloud compression and transmission pipelines',
      'Secure edge-computing communication protocols for decentralized IoT robot swarms',
      'Distributed server architectures for real-time fleet localization and telemetry tracking'
    ],
    advice: 'Highlight algorithmic efficiency, system networks, operating system scheduling, data structures, and software architecture.'
  },
  it: {
    title: 'Information Technology (IT)',
    topics: [
      'Web-based real-time telemetry dashboard for remote robot monitoring and control',
      'Cloud infrastructure setup for fleet management and automated OTA firmware updates',
      'Database schema design and queries for high-frequency sensor log storage'
    ],
    advice: 'Focus on web telemetry, cloud orchestration, databases, network protocols, and end-to-end fullstack data pipelines.'
  },
  rubber_plastics: {
    title: 'Rubber and Plastics Technology',
    topics: [
      'Characterization and finite element modeling of hyperelastic elastomer compounds in robotic soft grippers',
      'Optimization of injection molding parameters for plastic robot enclosures',
      'Material wear testing and simulation of polymer gears in robotic joints'
    ],
    advice: 'Leverage your material science, polymer compounds, molding, and elastomer structural modeling expertise. Focus on soft robotics and mechanical wear materials.'
  },
  general: {
    title: 'General Engineering',
    topics: [
      'Literature survey on current state-of-the-art in autonomous driving safety metrics',
      'Basic sensor integration and data logging analysis with Python',
      'Simulation of simple kinematics using MATLAB / Python scripts'
    ],
    advice: 'Explore introductory coursework in Linux, Python, and ROS. Focus on building solid software and hardware fundamentals to start your research journey.'
  }
};

const GUIDE_STEPS = [
  { id: 1, title: 'Literature Search & Gap Finder', desc: 'Identify 10-15 key papers in your subfield. Create a summary matrix detailing their methodologies, datasets, and limitations/gaps. Focus on what those papers missed (e.g., real-time performance limitations, lack of generalization in outdoor environments).' },
  { id: 2, title: 'Formulating Hypothesis', desc: 'Define a specific problem statement. "I want to make SLAM better" is too broad. "I want to improve visual SLAM drift in low-texture environments by incorporating IMU sensor fusion using an EKF filter" is highly actionable.' },
  { id: 3, title: 'Simulation & Code Prototype', desc: 'Start with simulated environments (Gazebo, Webots, Isaac Sim) to prototype control or navigation algorithms. Save all code in a clean GitHub repository—it serves as proof of work for admissions committees.' },
  { id: 4, title: 'Writing the Draft (SOP/Paper)', desc: 'Follow the standard structural format: Abstract, Introduction, Related Work, Proposed Methodology, Experiments/Results, Discussion, Conclusion. Highlight your contribution clearly in the intro.' },
  { id: 5, title: 'Advisor Review & Submission', desc: 'Share your draft with a university professor or lab mentor. Target a conference or journal submission 3 months in advance to leave time for iterations and review.' }
];

export default function ResearchAssistant({ state, onStateChange }) {
  const papers = state.researchPapers || [];
  const profile = state.profile || {};
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Form states
  const [title, setTitle] = useState('');
  const [area, setArea] = useState('robotics');
  const [targetVenue, setTargetVenue] = useState('');
  const [status, setStatus] = useState('Ideation');
  const [notes, setNotes] = useState('');
  const [completedChecklist, setCompletedChecklist] = useState([]);

  // Detect user research area from profile interests
  const getUserResearchArea = () => {
    const interests = (profile.researchInterests || '').toLowerCase();
    if (interests.includes('learning') || interests.includes('ml') || interests.includes('networks') || interests.includes('vision') || interests.includes('cv')) {
      return 'ml_ai';
    }
    if (interests.includes('control') || interests.includes('feedback') || interests.includes('systems') || interests.includes('pid')) {
      return 'control_systems';
    }
    return 'robotics'; // default
  };

  const getCourseCategory = () => {
    const course = (profile.currentCourse || '').toLowerCase().trim();
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
  };

  const activeArea = getUserResearchArea();
  const recommendedVenues = VENUES[activeArea] || VENUES.robotics;
  
  const courseCategory = getCourseCategory();
  const courseRecommends = COURSE_RECOMMENDATIONS[courseCategory];

  const handleQuickStartTopic = (topic) => {
    setTitle(topic);
    setStatus('Ideation');
    setIsAdding(true);
    // Smooth scroll to the form card
    setTimeout(() => {
      document.querySelector('.form-card')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleAddProject = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newPaper = {
      id: editingId || Date.now().toString(),
      title,
      area,
      targetVenue,
      status,
      notes,
      completedChecklist,
      updatedAt: new Date().toISOString()
    };

    let updatedPapers;
    if (editingId) {
      updatedPapers = papers.map(p => p.id === editingId ? newPaper : p);
    } else {
      updatedPapers = [...papers, newPaper];
    }

    saveResearchPapers(updatedPapers);
    onStateChange();
    resetForm();
  };

  const handleEdit = (paper) => {
    setEditingId(paper.id);
    setTitle(paper.title);
    setArea(paper.area);
    setTargetVenue(paper.targetVenue);
    setStatus(paper.status);
    setNotes(paper.notes);
    setCompletedChecklist(paper.completedChecklist || []);
    setIsAdding(true);
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this research project?')) {
      const updated = papers.filter(p => p.id !== id);
      saveResearchPapers(updated);
      onStateChange();
    }
  };

  const resetForm = () => {
    setTitle('');
    setArea('robotics');
    setTargetVenue('');
    setStatus('Ideation');
    setNotes('');
    setCompletedChecklist([]);
    setEditingId(null);
    setIsAdding(false);
  };

  const toggleChecklistItem = (paperId, item) => {
    const updated = papers.map(p => {
      if (p.id === paperId) {
        const list = p.completedChecklist || [];
        const newList = list.includes(item)
          ? list.filter(i => i !== item)
          : [...list, item];
        return { ...p, completedChecklist: newList };
      }
      return p;
    });
    saveResearchPapers(updated);
    onStateChange();
  };

  const checklistItems = [
    'Literature Review (Read 10+ papers)',
    'Simulation / Mathematical Model setup',
    'Main Experiments completed',
    'Result graphs/plots created',
    'First Draft Outline completed',
    'Methods & Results section drafted',
    'Intro & Abstract drafted',
    'Advisor / Professor review feedback integrated',
  ];

  return (
    <div className="section">
      <div className="section-header">
        <div>
          <h2>Research & Publication Assistant</h2>
          <p className="section-desc">Design, track, and publish your research to boost your masters applications</p>
        </div>
        {!isAdding && (
          <button className="btn btn-primary" onClick={() => setIsAdding(true)}>
            + New Research Project
          </button>
        )}
      </div>

      <div className="research-grid-layout">
        {/* Left column: Projects and Forms */}
        <div className="research-main-col">
          {isAdding && (
            <div className="card form-card">
              <h3>{editingId ? 'Edit Research Project' : 'New Research Project'}</h3>
              <form onSubmit={handleAddProject} className="research-form">
                <div className="form-group full-width">
                  <label>Paper / Project Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., EKF IMU-Visual SLAM sensor fusion in low-texture environments"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Research Domain</label>
                  <select value={area} onChange={(e) => setArea(e.target.value)}>
                    <option value="robotics">Robotics & Autonomous Systems</option>
                    <option value="ml_ai">Machine Learning & AI</option>
                    <option value="control_systems">Control Systems & Math</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Target Publication Venue</label>
                  <input
                    type="text"
                    placeholder="e.g., IEEE ICRA 2028 or Letters"
                    value={targetVenue}
                    onChange={(e) => setTargetVenue(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Current Status</label>
                  <select value={status} onChange={(e) => setStatus(e.target.value)}>
                    <option value="Ideation">Ideation / Pitching</option>
                    <option value="Literature Review">Literature Review</option>
                    <option value="Methodology & Experimentation">Methodology & Experiments</option>
                    <option value="Drafting Paper">Drafting Paper</option>
                    <option value="Under Review">Under Review / Submitted</option>
                    <option value="Published">Accepted / Published</option>
                  </select>
                </div>

                <div className="form-group full-width">
                  <label>Project Notes / Details</label>
                  <textarea
                    rows={3}
                    placeholder="Key concepts, hardware, lab teammates, or action items..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                  />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">
                    {editingId ? 'Update Project' : 'Add Project'}
                  </button>
                  <button type="button" className="btn btn-ghost" onClick={resetForm}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {papers.length === 0 ? (
            <div className="empty-state card">
              <h3>No Active Research Projects</h3>
              <p>Adding publications, preprints, or major robotics project reports to your profile dramatically improves your chances of getting admitted into top programs. Start your first research project card now!</p>
              <button className="btn btn-primary" onClick={() => setIsAdding(true)}>
                Start First Project
              </button>
            </div>
          ) : (
            <div className="papers-list-container">
              {papers.map((paper) => {
                const checkedCount = (paper.completedChecklist || []).length;
                const progressPct = Math.round((checkedCount / checklistItems.length) * 100);

                return (
                  <div key={paper.id} className="card paper-project-card">
                    <div className="paper-card-header">
                      <div>
                        <span className={`badge badge-${paper.area}`}>
                          {paper.area === 'robotics' ? '🤖 Robotics' : paper.area === 'ml_ai' ? '🧠 AI/ML' : '⚙️ Controls'}
                        </span>
                        <h4>{paper.title}</h4>
                      </div>
                      <div className="card-actions">
                        <button className="btn-icon" onClick={() => handleEdit(paper)} title="Edit Project">✏️</button>
                        <button className="btn-icon delete" onClick={() => handleDelete(paper.id)} title="Delete Project">🗑️</button>
                      </div>
                    </div>

                    <div className="paper-card-meta">
                      <span><strong>Target Venue:</strong> {paper.targetVenue || 'TBD'}</span>
                      <span><strong>Status:</strong> <span className="status-label">{paper.status}</span></span>
                    </div>

                    {paper.notes && <p className="paper-card-notes">{paper.notes}</p>}

                    {/* Progress Bar */}
                    <div className="progress-section">
                      <div className="progress-bar-label">
                        <span>Milestone Progress</span>
                        <span>{progressPct}% ({checkedCount}/{checklistItems.length})</span>
                      </div>
                      <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{ width: `${progressPct}%` }}></div>
                      </div>
                    </div>

                    {/* Collapsible checklist */}
                    <details className="checklist-details">
                      <summary>📋 Project Milestones Checklist</summary>
                      <div className="project-checklist">
                        {checklistItems.map((item) => {
                          const isChecked = (paper.completedChecklist || []).includes(item);
                          return (
                            <label key={item} className="checklist-label">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => toggleChecklistItem(paper.id, item)}
                              />
                              <span className={isChecked ? 'completed-text' : ''}>{item}</span>
                            </label>
                          );
                        })}
                      </div>
                    </details>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right column: Guides and submission advice */}
        <div className="research-sidebar-col">
          {/* Course-tailored Recommendations */}
          <div className="card highlight-card shadow-accent">
            <h3>💡 Course-Tailored Starter Topics</h3>
            <p className="card-desc">
              Based on your degree: <strong style={{ color: 'var(--accent-teal)' }}>{profile.currentCourse || 'General Engineering'}</strong>
            </p>
            <div className="starter-advice-box">
              <p>{courseRecommends.advice}</p>
            </div>
            <div className="starter-topics-list">
              {courseRecommends.topics.map((topic, i) => (
                <div key={i} className="starter-topic-item" onClick={() => handleQuickStartTopic(topic)}>
                  <span className="plus-icon">+</span>
                  <span className="topic-text">{topic}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Submission Venue Match */}
          <div className="card">
            <h3>🎯 Match-Specific Venues</h3>
            <p className="card-desc">
              Recommended for your profile interest: <strong style={{ color: 'var(--accent-teal)' }}>{activeArea.replace('_', ' ').toUpperCase()}</strong>
            </p>
            <div className="venues-list">
              {recommendedVenues.map((venue) => (
                <div key={venue.name} className="venue-item">
                  <div className="venue-header">
                    <strong>{venue.name}</strong>
                    <span className="badge badge-scholarship">{venue.level}</span>
                  </div>
                  <span className="venue-meta">{venue.type} • {venue.cycle}</span>
                  <p className="venue-desc">{venue.desc}</p>
                </div>
              ))}
            </div>
          </div>


          {/* Research Guide */}
          <div className="card">
            <h3>🎓 How to Write a Research Paper</h3>
            <p className="card-desc">Follow this systematic timeline to write highly competitive research projects:</p>
            <div className="guide-steps-list">
              {GUIDE_STEPS.map((step) => (
                <div key={step.id} className="guide-step-item">
                  <div className="guide-step-num">{step.id}</div>
                  <div className="guide-step-content">
                    <h5>{step.title}</h5>
                    <p>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
