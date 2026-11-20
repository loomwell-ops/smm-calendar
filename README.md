# Murnova — Social Media Management & Publishing Calendar

A lightweight, zero-build, glassmorphic **Social Media Publishing Calendar** designed for hosting directly on **GitHub Pages**.

## Features
- **Inspired UI & Smooth Spring Transitions**: Top navigation tabs (`Overview`, `Calendar`, `Inbox`, `Approvals`, `Analytics`, `Listening`) and view switchers (`Week`, `Month`, `Timeline`) powered by smooth GSAP pill animations.
- **Custom Light & Dark Mode Wallpapers**: Seamless theme toggle (`☀️ / 🌙`) switching between your custom light ribbon (`assets/bg-light.webp`) and dark ribbon (`assets/bg-dark.jpg`) backgrounds.
- **Interactive Publishing Calendar**:
  - **Create, Edit & Delete Posts** across Instagram, LinkedIn, X/Twitter, YouTube, and TikTok.
  - **Drag-and-Drop Scheduling**: Drag unscheduled drafts or existing posts onto any date cell to reschedule instantly.
  - **Multi-View Support**: Switch between Month Grid, 7-Day Week Board, and Chronological Timeline.
  - **Channel & Status Filtering**: Filter posts by social platform or approval status (`Approved`, `Scheduled`, `Pending`, `Draft`).
- **Local Persistence & JSON Export**: Automatically saves changes in `localStorage` with one-click JSON backup export.

## How to Host on GitHub Pages
1. Create a new GitHub repository (e.g. `social-media-calendar`).
2. Upload all files from this folder (`index.html`, `style.css`, `app.js`, `README.md`, and the `assets/` folder).
3. Go to **Settings → Pages** in your GitHub repository.
4. Under **Build and deployment**, select **Deploy from a branch**, choose `main` and `/ (root)`, then click **Save**.
5. Your live Social Media Calendar will be published at `https://<your-username>.github.io/social-media-calendar/`.
