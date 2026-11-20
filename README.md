# Murnova Social Media Calendar — First Design + Full V1 Supabase & Automation Backend

This package combines the **exact glassmorphic UI & GSAP sliding pill motion** from your first design with the **complete Supabase backend & automation workflows** from your V1 calendar.

## What Is Included
- **Exact First Design Interface (`index.html` + `style.css`)**:
  - Glassmorphic workspace shell with your custom Light (`assets/bg-light.webp`) and Dark (`assets/bg-dark.jpg`) ribbon wallpapers.
  - Top GSAP sliding pill navigation (`Overview`, `Calendar`, `Inbox`, `Approvals`, `Analytics`, `Ideas & Tools`) and calendar view switcher (`Week`, `Month`, `Board`, `Timeline`).
  - Right-hand mini calendar and drag-and-drop **Drafts & Repost Queue**.
- **Complete V1 Supabase Backend & Automations**:
  - **Live Supabase Sync**: Real-time posts, comments, approvals, and client switcher (`clients`, `posts`, `comments`, `ideas`, `hashtag_sets`, `client_settings`, `key_dates`).
  - **Automated Workflows**:
    - **Copy Month**: Duplicate an entire month's posts to next month by weekday or calendar date.
    - **Auto-Fill Weekly Gaps**: Automatically generate draft posts to meet each platform's weekly goal.
    - **Excel & Meta Business Suite CSV Importers**: Bulk import posts from `.xlsx` or reach/engagement insights from Meta CSV exports.
    - **Google Drive Media Uploads**: Upload photos/videos directly inside the post modal (`temp-media` bucket -> Google Drive).
    - **Evergreen Repost Queue & Client Approval Reminders**: Automatic repost eligibility tracking and one-click client reminder copy.

## Deploying to GitHub Pages
1. Extract `murnova-design1-backend2-integrated.zip` into the root of your GitHub repository.
2. Push to `main`—GitHub Pages will serve the app automatically with zero build steps.
