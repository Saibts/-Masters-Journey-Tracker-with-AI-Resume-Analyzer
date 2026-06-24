const STORAGE_KEY = 'masters-journey-tracker';

function createDefaultState() {
  return {
    profile: null,
    bookmarks: [],
    roadmaps: {},
    kanban: {
      'interested': [],
      'in-progress': [],
      'submitted': [],
      'decisions': [],
    },
    researchPapers: [],
    activeTab: 'dashboard',
  };
}

export function getCurrentUser() {
  return localStorage.getItem('masters-journey-tracker-current-user') || null;
}

export function setCurrentUser(userId) {
  if (userId) {
    localStorage.setItem('masters-journey-tracker-current-user', userId.trim().toLowerCase());
  } else {
    localStorage.removeItem('masters-journey-tracker-current-user');
  }
}

export function logout() {
  localStorage.removeItem('masters-journey-tracker-current-user');
}

export function loadState() {
  const userId = getCurrentUser();
  if (!userId) return createDefaultState();
  const userKey = `${STORAGE_KEY}_${userId}`;
  try {
    const raw = localStorage.getItem(userKey);
    if (!raw) return createDefaultState();
    const parsed = JSON.parse(raw);
    const defaults = createDefaultState();
    return {
      ...defaults,
      ...parsed,
      kanban: {
        ...defaults.kanban,
        ...(parsed.kanban || {}),
      },
      researchPapers: parsed.researchPapers || [],
    };
  } catch {
    return createDefaultState();
  }
}

export function saveState(state) {
  const userId = getCurrentUser();
  if (!userId) return;
  const userKey = `${STORAGE_KEY}_${userId}`;
  localStorage.setItem(userKey, JSON.stringify(state));
}

export function saveResearchPapers(papers) {
  const state = loadState();
  state.researchPapers = papers;
  saveState(state);
  return state;
}

export function saveProfile(profile) {
  const state = loadState();
  state.profile = profile;
  saveState(state);
  return state;
}

export function toggleBookmark(collegeId) {
  const state = loadState();
  const index = state.bookmarks.indexOf(collegeId);
  if (index >= 0) {
    state.bookmarks.splice(index, 1);
    delete state.roadmaps[collegeId];
    Object.keys(state.kanban).forEach((col) => {
      state.kanban[col] = state.kanban[col].filter((id) => id !== collegeId);
    });
  } else {
    state.bookmarks.push(collegeId);
    if (!state.kanban.interested.includes(collegeId)) {
      state.kanban.interested.push(collegeId);
    }
  }
  saveState(state);
  return state;
}

export function saveRoadmap(collegeId, steps) {
  const state = loadState();
  state.roadmaps[collegeId] = steps;
  saveState(state);
  return state;
}

export function moveKanbanCard(collegeId, fromColumn, toColumn) {
  const state = loadState();
  if (state.kanban[fromColumn]) {
    state.kanban[fromColumn] = state.kanban[fromColumn].filter((id) => id !== collegeId);
  }
  if (state.kanban[toColumn] && !state.kanban[toColumn].includes(collegeId)) {
    state.kanban[toColumn].push(collegeId);
  }
  saveState(state);
  return state;
}

export function updateRoadmapStep(collegeId, stepId, status) {
  const state = loadState();
  if (state.roadmaps[collegeId]) {
    state.roadmaps[collegeId] = state.roadmaps[collegeId].map((step) =>
      step.id === stepId ? { ...step, status } : step
    );
    saveState(state);
  }
  return state;
}

export function saveActiveTab(tab) {
  const state = loadState();
  state.activeTab = tab;
  saveState(state);
}
