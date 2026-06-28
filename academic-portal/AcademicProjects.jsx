import { useState } from 'react';
import { saveProfile } from '../src/utils/storage';

export default function AcademicProjects({ state, onStateChange }) {
  const profile = state.profile;
  const [editingProj, setEditingProj] = useState(null);
  const [filterSem, setFilterSem] = useState('all');

  const projects = profile?.projects || [];

  const handleSaveProject = (e) => {
    e.preventDefault();
    if (!profile) {
      alert('Please setup your profile first.');
      return;
    }

    const formData = new FormData(e.target);
    const projectData = {
      id: editingProj?.id || `proj-${Date.now()}`,
      title: formData.get('title'),
      semester: parseInt(formData.get('semester')) || 1,
      techStack: formData.get('techStack'),
      description: formData.get('description'),
      githubUrl: formData.get('githubUrl')
    };

    let updatedProjects;
    if (editingProj?.id) {
      updatedProjects = projects.map(p => p.id === editingProj.id ? projectData : p);
    } else {
      updatedProjects = [...projects, projectData];
    }

    const updatedProfile = {
      ...profile,
      projects: updatedProjects
    };

    saveProfile(updatedProfile);
    onStateChange();
    setEditingProj(null);
  };

  const handleDeleteProject = (projId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    const updatedProjects = projects.filter(p => p.id !== projId);
    const updatedProfile = {
      ...profile,
      projects: updatedProjects
    };
    saveProfile(updatedProfile);
    onStateChange();
  };

  if (!profile) {
    return (
      <div className="section">
        <div className="empty-state card">
          <h2>Profile Required</h2>
          <p>Please setup your profile on the main dashboard before adding academic projects.</p>
        </div>
      </div>
    );
  }

  const filteredProjects = filterSem === 'all' 
    ? projects 
    : projects.filter(p => p.semester === parseInt(filterSem));

  return (
    <div className="section">
      <div className="section-header">
        <h2>Academic & Capstone Projects</h2>
        <button className="btn btn-primary" onClick={() => setEditingProj({ title: '', semester: 1, techStack: '', description: '', githubUrl: '' })}>
          + Add New Project
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
        
        {/* Left Side: Filter and Project Cards List */}
        <div style={{ flex: 2, minWidth: '350px' }}>
          {/* Semester Filter */}
          <div className="card" style={{ marginBottom: '1.25rem', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Filter by Semester:</span>
            <select 
              value={filterSem} 
              onChange={(e) => setFilterSem(e.target.value)}
              style={{
                background: 'var(--bg-deep)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                color: 'inherit',
                padding: '0.4rem 0.8rem',
                cursor: 'pointer'
              }}
            >
              <option value="all">All Semesters</option>
              {Array.from({ length: 8 }, (_, i) => (
                <option key={i+1} value={i+1}>Semester {i+1}</option>
              ))}
            </select>
          </div>

          {filteredProjects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', background: 'var(--bg-card)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
              No projects recorded for the selected filter. Click "+ Add New Project" to get started.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
              {filteredProjects.map((proj) => (
                <div key={proj.id} className="card" style={{ padding: '1.5rem', background: 'var(--bg-card)', border: '1px solid var(--border)', position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h3 style={{ margin: 0, color: 'var(--accent-teal)' }}>{proj.title}</h3>
                    <span className="badge" style={{
                      fontSize: '0.75rem',
                      background: 'var(--accent-teal-glow)',
                      color: 'var(--accent-teal)',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px'
                    }}>
                      Semester {proj.semester}
                    </span>
                  </div>

                  {proj.techStack && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--purple)', fontFamily: 'var(--font-mono)', marginBottom: '0.75rem' }}>
                      ⚙️ {proj.techStack}
                    </div>
                  )}

                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem', whiteSpace: 'pre-line' }}>
                    {proj.description || 'No description provided.'}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    {proj.githubUrl ? (
                      <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" style={{ fontSize: '0.85rem', color: 'var(--accent-teal)', textDecoration: 'none' }}>
                        🔗 GitHub Repository
                      </a>
                    ) : <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No repository linked</span>}
                    
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button className="btn" onClick={() => setEditingProj(proj)} style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem', border: '1px solid var(--border)', color: 'var(--text-secondary)', background: 'transparent' }}>
                        ✏️ Edit
                      </button>
                      <button className="btn" onClick={() => handleDeleteProject(proj.id)} style={{ fontSize: '0.8rem', padding: '0.3rem 0.6rem', border: '1px solid #ef4444', color: '#ef4444', background: 'transparent' }}>
                        🗑 Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Form (shown when adding/editing) */}
        {editingProj && (
          <div className="card" style={{ flex: 1.2, minWidth: '300px', padding: '1.5rem', background: 'var(--bg-slate)', border: '1px solid var(--border)' }}>
            <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)' }}>
              {editingProj.id ? 'Edit Project' : 'Add New Project'}
            </h3>
            
            <form onSubmit={handleSaveProject} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label>Project Title</label>
                <input
                  type="text"
                  name="title"
                  required
                  defaultValue={editingProj.title}
                  placeholder="e.g. Autonomous Robot Navigation"
                  style={{ background: 'var(--bg-deep)', border: '1px solid var(--border)', borderRadius: '6px', color: 'inherit', padding: '0.5rem' }}
                />
              </div>

              <div className="form-group">
                <label>Academic Semester</label>
                <select
                  name="semester"
                  defaultValue={editingProj.semester}
                  style={{ background: 'var(--bg-deep)', border: '1px solid var(--border)', borderRadius: '6px', color: 'inherit', padding: '0.5rem', cursor: 'pointer' }}
                >
                  {Array.from({ length: 8 }, (_, i) => (
                    <option key={i+1} value={i+1}>Semester {i+1}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Tech Stack / Keywords</label>
                <input
                  type="text"
                  name="techStack"
                  defaultValue={editingProj.techStack}
                  placeholder="e.g. ROS, C++, Python, OpenCV"
                  style={{ background: 'var(--bg-deep)', border: '1px solid var(--border)', borderRadius: '6px', color: 'inherit', padding: '0.5rem' }}
                />
              </div>

              <div className="form-group">
                <label>Project Description</label>
                <textarea
                  name="description"
                  rows={4}
                  defaultValue={editingProj.description}
                  placeholder="Describe your project, methodology, and results..."
                  style={{ background: 'var(--bg-deep)', border: '1px solid var(--border)', borderRadius: '6px', color: 'inherit', padding: '0.5rem', resize: 'vertical' }}
                />
              </div>

              <div className="form-group">
                <label>Project Code Link (GitHub / GitLab)</label>
                <input
                  type="url"
                  name="githubUrl"
                  defaultValue={editingProj.githubUrl}
                  placeholder="https://github.com/username/project"
                  style={{ background: 'var(--bg-deep)', border: '1px solid var(--border)', borderRadius: '6px', color: 'inherit', padding: '0.5rem' }}
                />
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Project</button>
                <button type="button" className="btn btn-ghost" onClick={() => setEditingProj(null)} style={{ flex: 1 }}>Cancel</button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
