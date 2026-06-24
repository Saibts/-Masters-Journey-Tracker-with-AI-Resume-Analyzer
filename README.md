# My Masters Journey Tracker

A private, single-user web application for tracking your masters application journey. All data is stored locally in your browser via **LocalStorage** — nothing is sent to any server.

## Features

- **Profile & Dashboard** — Indian academic system inputs (10-point CGPA, funding preferences, research interests)
- **Resume Intelligence Engine** — Client-side PDF/TXT parsing with keyword extraction, gap detection, and live match recalculation
- **College Discovery** — Real-time matching against elite global robotics programs
- **Active Roadmaps** — Auto-generated timelines based on your graduation year (May 2028)
- **Application Tracker** — Drag-and-drop Kanban board (Interested → In Progress → Submitted → Decisions)

### Resume Parsing

Upload a `.pdf` or `.txt` resume on the dashboard. The app uses `pdfjs-dist` (PDF) and `FileReader` (TXT) to extract text entirely in the browser. It then:

1. Extracts engineering keywords (Python, ROS, Machine Learning, etc.)
2. Detects critical gaps (publications, IIT/IISc internships)
3. Recalculates university match scores and updates LocalStorage

## Quick Start

```bash
npm install
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173`).

## Build for Production

```bash
npm run build
npm run preview
```

## Data Persistence

All profile data, bookmarks, roadmaps, and Kanban positions are saved to `localStorage` under the key `masters-journey-tracker`. Your data survives browser refreshes and tab closures.

## Tech Stack

- React 18
- Vite 6
- pdfjs-dist (client-side PDF text extraction)
- Vanilla CSS (dark academic theme)
- Browser LocalStorage
