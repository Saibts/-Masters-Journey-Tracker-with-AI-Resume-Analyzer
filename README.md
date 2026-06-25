# Gradix | Masters & Academics Tracker

A private, local-first React application for tracking your master's application journey abroad while managing your undergraduate academics. All data is processed and stored locally in your browser via **LocalStorage** — your resumes and transcripts are never sent to a server.

## Dual-Workspace Portals

When signing in, you can toggle between two separate, integrated workspaces:

### 1. Undergrad Academic Portal 📈
*   **GPA/CGPA Tracker**: Manage your academic performance across all **8 semesters**.
*   **Anna University Grading Mapping**: Toggle between raw marks (%) or letter grades (`O`, `A+`, `A`, `B+`, `B`, `C`, `RA`) that auto-calculate GPA using the university's 10-point scale.
*   **Academic Projects**: Catalog your capstone and class projects, complete with tech stacks, descriptions, semesters, and GitHub repository links.
*   **Printable Report Card**: Preview a transcript styled in the app's dark theme, which automatically reformats into a clean monochrome document when printed or saved as a PDF (**Ctrl + P** / **Cmd + P**).

### 2. Master's Journey Tracker 🌍
*   **Profile Dashboard**: Setup target terms, funding styles, and standardised test scores (GRE, IELTS, TOEFL).
*   **Resume Intelligence Engine**: Client-side PDF/TXT parsing with keyword extraction, profile gap detection, and match updates.
*   **University Matching**: Dynamic matching scores calculated against elite international programs based on CGPA and undergrad major.
*   **Active Roadmaps**: Automatically generates application timelines based on your graduating year.
*   **Application Kanban Board**: Drag-and-drop tracker for application statuses (*Interested* → *In Progress* → *Submitted* → *Decisions*).

---

## Quick Start (Web Server)

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run local dev server**:
   ```bash
   npm run dev
   ```
   Open the URL shown in the terminal (typically `http://localhost:5173`).

---

## Desktop Application Build (Electron)

You can run or package this tracker as a standalone local desktop application:

*   **Run Desktop App in Dev Mode**:
    ```bash
    npm run electron:dev
    ```
*   **Build Standalone Desktop Bundle**:
    ```bash
    npm run electron:build
    ```
    This compiles the production assets and outputs a portable Windows executable (`Masters Journey Tracker.exe`) inside the `dist-desktop/` folder.

---

## Data Persistence

All profile details, semester grades, project portfolios, and Kanban cards are saved to browser `localStorage` keyed under your custom Profile User ID. No cloud login required.

## Tech Stack

- **Frontend**: React 18, Vite 6
- **Desktop Wrapper**: Electron 42, Electron Packager
- **PDF Engine**: `pdfjs-dist` (client-side PDF text extraction)
- **Styling**: Vanilla CSS (Premium dark academic theme)
- **Storage**: Browser LocalStorage
