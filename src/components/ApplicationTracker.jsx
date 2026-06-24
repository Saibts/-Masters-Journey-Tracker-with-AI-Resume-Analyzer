import { useState } from 'react';
import { COLLEGES, KANBAN_COLUMNS } from '../data/constants';
import { moveKanbanCard } from '../utils/storage';

export default function ApplicationTracker({ state, onStateChange }) {
  const [draggedId, setDraggedId] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const kanban = state.kanban || {};
  const bookmarks = state.bookmarks || [];

  const getCollege = (id) => COLLEGES.find((c) => c.id === id);

  const findColumnForCard = (collegeId) => {
    for (const col of KANBAN_COLUMNS) {
      if ((kanban[col.id] || []).includes(collegeId)) return col.id;
    }
    return null;
  };

  const handleDragStart = (e, collegeId) => {
    setDraggedId(collegeId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, columnId) => {
    e.preventDefault();
    setDragOverColumn(columnId);
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = (e, toColumn) => {
    e.preventDefault();
    if (!draggedId) return;
    const fromColumn = findColumnForCard(draggedId);
    if (fromColumn && fromColumn !== toColumn) {
      moveKanbanCard(draggedId, fromColumn, toColumn);
      onStateChange();
    }
    setDraggedId(null);
    setDragOverColumn(null);
  };

  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverColumn(null);
  };

  if (bookmarks.length === 0) {
    return (
      <div className="section">
        <div className="empty-state card">
          <h2>Application Tracker</h2>
          <p>Bookmark programs to track your application progress on the Kanban board.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="section-header">
        <h2>Application Tracker</h2>
        <p className="section-desc">Drag and drop bookmarked programs across stages</p>
      </div>

      <div className="kanban-board">
        {KANBAN_COLUMNS.map((column) => {
          const cards = (kanban[column.id] || []).filter((id) => bookmarks.includes(id));

          return (
            <div
              key={column.id}
              className={`kanban-column ${dragOverColumn === column.id ? 'drag-over' : ''}`}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="kanban-column-header" style={{ borderColor: column.color }}>
                <span className="kanban-column-title">{column.title}</span>
                <span className="kanban-count">{cards.length}</span>
              </div>
              <div className="kanban-cards">
                {cards.map((collegeId) => {
                  const college = getCollege(collegeId);
                  if (!college) return null;

                  return (
                    <div
                      key={collegeId}
                      className={`kanban-card ${draggedId === collegeId ? 'dragging' : ''}`}
                      draggable
                      onDragStart={(e) => handleDragStart(e, collegeId)}
                      onDragEnd={handleDragEnd}
                    >
                      <h4 className="kanban-card-title">{college.name}</h4>
                      <p className="kanban-card-program">{college.program}</p>
                      <span className="kanban-card-region">{college.country}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
