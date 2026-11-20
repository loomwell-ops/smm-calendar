/* =========================================================
   MURNOVA — INTERACTIVE SOCIAL MEDIA CALENDAR ENGINE
   ========================================================= */

/**
 * Smooth GSAP Sliding Pill (Inspired directly by the video's slidePill helper)
 */
function slidePill(pill, box, target, animate = true) {
  if (!pill || !box || !target) return;
  const W = pill.offsetWidth;
  const H = pill.offsetHeight;
  const L = target.offsetLeft;
  const T = target.offsetTop;
  const w = target.offsetWidth;
  const h = target.offsetHeight;

  if (!animate || typeof gsap === 'undefined') {
    pill.style.width = `${w}px`;
    pill.style.height = `${h}px`;
    pill.style.transform = `translate(${L}px, ${T}px)`;
    return;
  }

  gsap.to(pill, {
    x: L,
    y: T,
    width: w,
    height: h,
    duration: 0.36,
    ease: 'power3.out'
  });
}

// =========================================================
// STATE & SEED DATA
// =========================================================
const STORAGE_KEY = 'murnova_social_calendar_v1';
const THEME_KEY = 'murnova_theme_v1';

const TODAY_ISO = '2026-11-20';

const DEFAULT_POSTS = [
  {
    id: 'p1',
    title: 'Q4 Design System Launch Reel',
    caption: 'Introducing our next-gen glassmorphic workflow. Built for speed & clarity. #DesignSystems #ProductLaunch',
    platform: 'instagram',
    format: 'Reel / Short',
    date: '2026-11-03',
    time: '10:00',
    status: 'approved',
    pillar: 'Product Launch',
    color: 'emerald'
  },
  {
    id: 'p2',
    title: 'Founder Thread: Scaling Content Ops',
    caption: 'How we cut campaign approval bottlenecks by 64% using async visual calendars.',
    platform: 'x',
    format: 'Text Thread',
    date: '2026-11-05',
    time: '14:30',
    status: 'approved',
    pillar: 'Educational',
    color: 'sky'
  },
  {
    id: 'p3',
    title: 'Enterprise Workflow Deep-Dive',
    caption: 'Full breakdown of multi-channel publishing metrics for B2B marketing teams.',
    platform: 'linkedin',
    format: 'Carousel',
    date: '2026-11-10',
    time: '09:00',
    status: 'approved',
    pillar: 'Educational',
    color: 'emerald'
  },
  {
    id: 'p4',
    title: 'Behind the Studio: Motion Physics',
    caption: 'A quick look at how we tune spring physics for micro-interactions.',
    platform: 'tiktok',
    format: 'Reel / Short',
    date: '2026-11-12',
    time: '16:00',
    status: 'scheduled',
    pillar: 'Behind the Scenes',
    color: 'violet'
  },
  {
    id: 'p5',
    title: 'Product Walkthrough & Q&A',
    caption: 'Live walkthrough of our publishing calendar, approval flows, and analytics.',
    platform: 'youtube',
    format: 'Video',
    date: '2026-11-16',
    time: '11:00',
    status: 'approved',
    pillar: 'Product Launch',
    color: 'emerald'
  },
  {
    id: 'p6',
    title: 'Customer Spotlight: Studio North',
    caption: 'How Studio North manages 45+ weekly social posts without spreadsheets.',
    platform: 'linkedin',
    format: 'Single Image',
    date: '2026-11-20',
    time: '13:00',
    status: 'scheduled',
    pillar: 'Community',
    color: 'violet'
  },
  {
    id: 'p7',
    title: 'Weekend Creator Challenge',
    caption: 'Drop your workspace setup below and tag 2 creators! #CreatorSetup',
    platform: 'instagram',
    format: 'Carousel',
    date: '2026-11-20',
    time: '18:00',
    status: 'approved',
    pillar: 'Community',
    color: 'emerald'
  },
  {
    id: 'p8',
    title: 'Black Friday Early Access Teaser',
    caption: '48 hours early access for our newsletter & community members.',
    platform: 'instagram',
    format: 'Reel / Short',
    date: '2026-11-24',
    time: '10:00',
    status: 'pending',
    pillar: 'Product Launch',
    color: 'amber'
  },
  {
    id: 'p9',
    title: '2027 Social Trends Report',
    caption: 'Data from 12,000+ creator accounts on what formats drive highest saves.',
    platform: 'linkedin',
    format: 'Carousel',
    date: '2026-11-26',
    time: '09:30',
    status: 'pending',
    pillar: 'Educational',
    color: 'rose'
  },
  {
    id: 'p10',
    title: 'Monthly Community Recap',
    caption: 'Top community builds, templates, and feature requests shipped in November.',
    platform: 'youtube',
    format: 'Video',
    date: '2026-11-28',
    time: '15:00',
    status: 'scheduled',
    pillar: 'Community',
    color: 'sky'
  },
  // Unscheduled Drafts
  {
    id: 'd1',
    title: 'AI Caption Assistant Demo',
    caption: 'Drafting 5 platform-native variations in one click.',
    platform: 'tiktok',
    format: 'Reel / Short',
    date: '',
    time: '12:00',
    status: 'draft',
    pillar: 'Product Launch',
    color: 'violet'
  },
  {
    id: 'd2',
    title: 'Dark Mode UI Wallpaper Pack',
    caption: 'Free 4K abstract glass gradients for our community.',
    platform: 'x',
    format: 'Single Image',
    date: '',
    time: '11:00',
    status: 'draft',
    pillar: 'Community',
    color: 'rose'
  },
  {
    id: 'd3',
    title: 'Agency Onboarding Checklist',
    caption: 'Step-by-step guide to migrating client workspaces.',
    platform: 'linkedin',
    format: 'Carousel',
    date: '',
    time: '09:00',
    status: 'pending',
    pillar: 'Educational',
    color: 'amber'
  }
];

let state = {
  posts: [],
  activeTab: 'calendar', // Start directly on Calendar or Overview; user asked for Social Media Calendar
  calView: 'month',
  currentYear: 2026,
  currentMonth: 10, // 0-indexed -> 10 = November 2026
  selectedDate: TODAY_ISO,
  platformFilter: 'all',
  statusFilter: 'all',
  draggedPostId: null
};

// Load saved posts or defaults
function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    state.posts = raw ? JSON.parse(raw) : structuredClone(DEFAULT_POSTS);
  } catch {
    state.posts = structuredClone(DEFAULT_POSTS);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state.posts));
}

// =========================================================
// THEME SWITCHER (LIGHT & DARK WALLPAPERS)
// =========================================================
function initTheme() {
  const saved = localStorage.getItem(THEME_KEY) || 'light';
  document.documentElement.setAttribute('data-theme', saved);

  document.getElementById('themeToggle').addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem(THEME_KEY, next);
    showToast(`Switched to ${next === 'dark' ? 'Dark' : 'Light'} Mode`);
  });
}

// =========================================================
// NAVIGATION & SLIDING PILLS
// =========================================================
function switchTab(tabName, animate = true) {
  state.activeTab = tabName;

  // Update top nav buttons
  const navBox = document.getElementById('mainNav');
  const navPill = document.getElementById('mainNavPill');
  const navItems = navBox.querySelectorAll('.nav-item');

  navItems.forEach(btn => {
    const isMatch = btn.dataset.tab === tabName;
    btn.classList.toggle('active', isMatch);
    if (isMatch) {
      slidePill(navPill, navBox, btn, animate);
    }
  });

  // Update left rail active state
  document.querySelectorAll('.rail-btn[data-tab-jump]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tabJump === tabName);
  });

  // Show target view
  document.querySelectorAll('.tab-view').forEach(view => {
    view.classList.toggle('active', view.id === `view-${tabName}`);
  });

  // Refresh view-specific elements & pill sizes
  if (tabName === 'calendar') {
    refreshCalViewPill(false);
    renderCalendar();
  } else if (tabName === 'overview') {
    renderOverview();
  } else if (tabName === 'approvals') {
    renderApprovals();
  } else if (tabName === 'inbox') {
    renderInbox();
  } else if (tabName === 'listening') {
    renderListening();
  }
}

function refreshCalViewPill(animate = true) {
  const box = document.getElementById('calViewSwitcher');
  const pill = document.getElementById('calViewPill');
  const activeBtn = box.querySelector('.seg-btn.active');
  if (activeBtn) {
    slidePill(pill, box, activeBtn, animate);
  }
}

// =========================================================
// FILTERING HELPERS
// =========================================================
function getFilteredPosts() {
  return state.posts.filter(p => {
    const platOk = state.platformFilter === 'all' || p.platform === state.platformFilter;
    const statusOk = state.statusFilter === 'all' || p.status === state.statusFilter;
    return platOk && statusOk;
  });
}

function getPlatformShort(plat) {
  const map = { instagram: 'IG', linkedin: 'IN', x: '𝕏', youtube: 'YT', tiktok: 'TT' };
  return map[plat] || plat.toUpperCase();
}

function formatMonthYear(year, month) {
  const d = new Date(year, month, 1);
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

function toISODate(year, month, day) {
  const m = String(month + 1).padStart(2, '0');
  const d = String(day).padStart(2, '0');
  return `${year}-${m}-${d}`;
}

// =========================================================
// CALENDAR RENDERING (MONTH / WEEK / TIMELINE)
// =========================================================
function renderCalendar() {
  document.getElementById('currentPeriodLabel').textContent = formatMonthYear(state.currentYear, state.currentMonth);
  document.getElementById('miniCalLabel').textContent = formatMonthYear(state.currentYear, state.currentMonth);

  const area = document.getElementById('calendarRenderArea');
  const filtered = getFilteredPosts();

  if (state.calView === 'month') {
    renderMonthGrid(area, filtered);
  } else if (state.calView === 'week') {
    renderWeekGrid(area, filtered);
  } else {
    renderTimelineView(area, filtered);
  }

  renderMiniCalendar();
  renderUnscheduledDrafts();
  updateBadges();
}

function renderMonthGrid(container, posts) {
  const year = state.currentYear;
  const month = state.currentMonth;
  const firstDay = new Date(year, month, 1);
  // Monday-first index (0 = Mon ... 6 = Sun)
  let startOffset = firstDay.getDay() - 1;
  if (startOffset < 0) startOffset = 6;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  let html = `
    <div class="month-weekdays">
      <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
    </div>
    <div class="month-grid">
  `;

  // Total cells = 35 or 42
  const totalCells = startOffset + daysInMonth > 35 ? 42 : 35;

  for (let i = 0; i < totalCells; i++) {
    let cellYear = year;
    let cellMonth = month;
    let dayNum;
    let isOther = false;

    if (i < startOffset) {
      dayNum = prevMonthDays - startOffset + i + 1;
      cellMonth = month - 1;
      if (cellMonth < 0) { cellMonth = 11; cellYear--; }
      isOther = true;
    } else if (i >= startOffset + daysInMonth) {
      dayNum = i - (startOffset + daysInMonth) + 1;
      cellMonth = month + 1;
      if (cellMonth > 11) { cellMonth = 0; cellYear++; }
      isOther = true;
    } else {
      dayNum = i - startOffset + 1;
    }

    const iso = toISODate(cellYear, cellMonth, dayNum);
    const isToday = iso === TODAY_ISO;
    const dayPosts = posts
      .filter(p => p.date === iso)
      .sort((a, b) => (a.time || '').localeCompare(b.time || ''));

    html += `
      <div class="day-cell ${isOther ? 'other-month' : ''} ${isToday ? 'today' : ''}" data-date="${iso}">
        <div class="day-header">
          <span class="day-num">${dayNum}</span>
          <button class="day-add-btn" data-add-date="${iso}" title="Add post on ${iso}">+</button>
        </div>
        ${dayPosts.map(p => `
          <div class="event-pill ${p.color || 'emerald'}" draggable="true" data-post-id="${p.id}" title="${p.time} · ${p.title}">
            <span class="ev-plat-tag">${getPlatformShort(p.platform)}</span>
            <span class="ev-title-text">${escapeHtml(p.title)}</span>
          </div>
        `).join('')}
      </div>
    `;
  }

  html += `</div>`;
  container.innerHTML = html;
  bindCalendarCellEvents(container);
}

function renderWeekGrid(container, posts) {
  // Show the week containing selectedDate
  const base = new Date(state.selectedDate + 'T00:00:00');
  const day = base.getDay();
  const diffToMon = (day === 0 ? -6 : 1 - day);
  const monday = new Date(base);
  monday.setDate(base.getDate() + diffToMon);

  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  let html = `<div class="week-grid">`;

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const iso = toISODate(d.getFullYear(), d.getMonth(), d.getDate());
    const dayPosts = posts.filter(p => p.date === iso);

    html += `
      <div class="week-col day-cell" data-date="${iso}">
        <div class="week-col-head">
          <div class="week-col-day">${dayNames[i]}</div>
          <div class="week-col-num">${d.getDate()}</div>
        </div>
        ${dayPosts.map(p => `
          <div class="week-card event-pill ${p.color || 'emerald'}" draggable="true" data-post-id="${p.id}">
            <div style="display:flex;justify-content:space-between;align-items:center;">
              <span class="ev-plat-tag">${getPlatformShort(p.platform)}</span>
              <span style="font-size:0.7rem;opacity:0.9;">${p.time || '10:00'}</span>
            </div>
            <strong>${escapeHtml(p.title)}</strong>
            <span style="font-size:0.7rem;opacity:0.85;">${p.format} · ${p.status}</span>
          </div>
        `).join('')}
        <button class="btn-ghost btn-sm" data-add-date="${iso}" style="margin-top:auto;">+ Add</button>
      </div>
    `;
  }

  html += `</div>`;
  container.innerHTML = html;
  bindCalendarCellEvents(container);
}

function renderTimelineView(container, posts) {
  const scheduled = posts
    .filter(p => p.date)
    .sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`));

  if (!scheduled.length) {
    container.innerHTML = `<p class="muted-text" style="padding:24px;text-align:center;">No scheduled posts match your current filters.</p>`;
    return;
  }

  container.innerHTML = `
    <div class="timeline-list">
      ${scheduled.map(p => `
        <div class="timeline-row" data-post-id="${p.id}">
          <div style="display:flex;align-items:center;gap:12px;">
            <span class="event-pill ${p.color || 'emerald'}" style="padding:6px 10px;">
              ${getPlatformShort(p.platform)}
            </span>
            <div>
              <div style="font-weight:600;font-size:0.9rem;">${escapeHtml(p.title)}</div>
              <div class="muted-text">${p.date} at ${p.time || '10:00'} · ${p.format} · ${p.pillar}</div>
            </div>
          </div>
          <span class="pill-tag">${p.status.toUpperCase()}</span>
        </div>
      `).join('')}
    </div>
  `;

  container.querySelectorAll('[data-post-id]').forEach(el => {
    el.addEventListener('click', () => openPostModal(el.dataset.postId));
  });
}

function bindCalendarCellEvents(container) {
  // Click '+' on day
  container.querySelectorAll('[data-add-date]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openPostModal(null, btn.dataset.addDate);
    });
  });

  // Click existing post pill to edit
  container.querySelectorAll('[data-post-id]').forEach(pill => {
    pill.addEventListener('click', (e) => {
      e.stopPropagation();
      openPostModal(pill.dataset.postId);
    });

    // Drag start
    pill.addEventListener('dragstart', (e) => {
      state.draggedPostId = pill.dataset.postId;
      e.dataTransfer.effectAllowed = 'move';
    });
  });

  // Drag & Drop targets (day cells)
  container.querySelectorAll('.day-cell').forEach(cell => {
    cell.addEventListener('dragover', (e) => {
      e.preventDefault();
      cell.classList.add('drag-over');
    });

    cell.addEventListener('dragleave', () => {
      cell.classList.remove('drag-over');
    });

    cell.addEventListener('drop', (e) => {
      e.preventDefault();
      cell.classList.remove('drag-over');
      const targetDate = cell.dataset.date;
      if (state.draggedPostId && targetDate) {
        const post = state.posts.find(p => p.id === state.draggedPostId);
        if (post) {
          post.date = targetDate;
          if (post.status === 'draft') post.status = 'scheduled';
          saveState();
          renderCalendar();
          showToast(`Scheduled "${post.title}" for ${targetDate}`);
        }
      }
      state.draggedPostId = null;
    });
  });
}

function renderMiniCalendar() {
  const grid = document.getElementById('miniCalGrid');
  const year = state.currentYear;
  const month = state.currentMonth;
  const firstDay = new Date(year, month, 1);
  let startOffset = firstDay.getDay() - 1;
  if (startOffset < 0) startOffset = 6;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let html = '';
  for (let i = 0; i < startOffset; i++) {
    html += `<div></div>`;
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const iso = toISODate(year, month, d);
    const hasPost = state.posts.some(p => p.date === iso);
    const isToday = iso === TODAY_ISO;
    html += `<div class="mini-day ${isToday ? 'today' : ''} ${hasPost ? 'has-post' : ''}" data-mini-date="${iso}">${d}</div>`;
  }
  grid.innerHTML = html;

  grid.querySelectorAll('[data-mini-date]').forEach(el => {
    el.addEventListener('click', () => {
      state.selectedDate = el.dataset.miniDate;
      openPostModal(null, el.dataset.miniDate);
    });
  });
}

function renderUnscheduledDrafts() {
  const list = document.getElementById('unscheduledDraftsList');
  const drafts = state.posts.filter(p => !p.date);

  if (!drafts.length) {
    list.innerHTML = `<p class="muted-text">All posts are scheduled! Click "+ Add" to jot down a new idea.</p>`;
    return;
  }

  list.innerHTML = drafts.map(d => `
    <div class="draft-item" draggable="true" data-draft-id="${d.id}">
      <div class="draft-item-top">
        <span>${getPlatformShort(d.platform)} · ${d.format}</span>
        <span>Drag →</span>
      </div>
      <div class="draft-item-title">${escapeHtml(d.title)}</div>
    </div>
  `).join('');

  list.querySelectorAll('.draft-item').forEach(item => {
    item.addEventListener('click', () => openPostModal(item.dataset.draftId));
    item.addEventListener('dragstart', (e) => {
      state.draggedPostId = item.dataset.draftId;
      e.dataTransfer.effectAllowed = 'move';
    });
  });
}

// =========================================================
// OVERVIEW, APPROVALS, INBOX & LISTENING VIEWS
// =========================================================
function updateBadges() {
  const pending = state.posts.filter(p => p.status === 'pending').length;
  const scheduled = state.posts.filter(p => p.date).length;
  const ovSched = document.getElementById('ovScheduledCount');
  const ovPend = document.getElementById('ovPendingCount');
  if (ovSched) ovSched.textContent = scheduled;
  if (ovPend) ovPend.textContent = pending;
}

function renderOverview() {
  updateBadges();
  const pendingPosts = state.posts.filter(p => p.status === 'pending' || !p.date).slice(0, 3);
  const list = document.getElementById('overviewAttentionList');
  document.getElementById('attentionCount').textContent = `${pendingPosts.length} items`;

  list.innerHTML = pendingPosts.map(p => `
    <div class="attention-item">
      <div class="attention-meta">
        <span class="attention-title">${escapeHtml(p.title)}</span>
        <span class="attention-sub">${getPlatformShort(p.platform)} · ${p.date || 'Unscheduled Draft'}</span>
      </div>
      <button class="btn-secondary btn-sm" onclick="openPostModal('${p.id}')">Review</button>
    </div>
  `).join('');

  const pillars = ['Product Launch', 'Educational', 'Behind the Scenes', 'Community'];
  const pillarsEl = document.getElementById('overviewPillars');
  pillarsEl.innerHTML = pillars.map(pil => {
    const count = state.posts.filter(p => p.pillar === pil).length;
    return `
      <div class="pillar-box" onclick="switchTab('calendar')">
        <div style="font-size:0.75rem;color:var(--text-muted);margin-bottom:4px;">Content Pillar</div>
        <div style="font-weight:600;font-size:0.92rem;margin-bottom:6px;">${pil}</div>
        <span class="badge-soft">${count} posts</span>
      </div>
    `;
  }).join('');
}

function renderApprovals() {
  const grid = document.getElementById('approvalsGrid');
  const items = state.posts.filter(p => p.status === 'pending' || p.status === 'scheduled');

  grid.innerHTML = items.map(p => `
    <div class="glass-card approval-card">
      <div>
        <div class="card-top-row">
          <span class="event-pill ${p.color}">${getPlatformShort(p.platform)} · ${p.format}</span>
          <span class="pill-tag">${p.status}</span>
        </div>
        <h3 style="margin-bottom:6px;">${escapeHtml(p.title)}</h3>
        <p class="muted-text">${escapeHtml(p.caption || 'No caption added yet.')}</p>
      </div>
      <div>
        <div class="muted-text" style="margin-bottom:10px;">Target: ${p.date || 'Unscheduled'} · ${p.time || '10:00'}</div>
        <div class="approval-actions">
          <button class="btn-primary btn-sm" onclick="approvePost('${p.id}')">Approve ✓</button>
          <button class="btn-secondary btn-sm" onclick="openPostModal('${p.id}')">Edit</button>
        </div>
      </div>
    </div>
  `).join('');
}

window.approvePost = function(id) {
  const post = state.posts.find(p => p.id === id);
  if (post) {
    post.status = 'approved';
    post.color = 'emerald';
    saveState();
    renderApprovals();
    updateBadges();
    showToast(`Approved "${post.title}"`);
  }
};

function renderInbox() {
  const messages = [
    { user: '@elena.creates', plat: 'Instagram', text: 'Love the new glassmorphic calendar layout! Is there a dark mode?', time: '12m ago' },
    { user: 'Marcus Vance', plat: 'LinkedIn', text: 'Would love to feature Murnova in our Q4 Martech roundup.', time: '48m ago' },
    { user: '@dev_kieran', plat: 'X / Twitter', text: 'The spring physics on those navigation pills are super clean.', time: '2h ago' }
  ];
  document.getElementById('inboxContainer').innerHTML = messages.map(m => `
    <div class="inbox-row">
      <div>
        <div style="font-weight:600;font-size:0.9rem;">${m.user} <span class="badge-soft">${m.plat}</span></div>
        <div class="muted-text" style="margin-top:3px;">${m.text}</div>
      </div>
      <div style="display:flex;align-items:center;gap:10px;">
        <span class="muted-text">${m.time}</span>
        <button class="btn-secondary btn-sm" onclick="showToast('Reply sent to ${m.user}')">Reply</button>
      </div>
    </div>
  `).join('');
}

function renderListening() {
  const mentions = [
    { topic: '#SocialMediaCalendar', volume: '4.2K mentions', sentiment: '94% Positive' },
    { topic: 'Murnova Studio', volume: '1.8K mentions', sentiment: '96% Positive' },
    { topic: 'Content Approval Workflow', volume: '920 mentions', sentiment: '88% Positive' }
  ];
  document.getElementById('listeningList').innerHTML = mentions.map(m => `
    <div class="listen-row">
      <div>
        <div style="font-weight:600;font-size:0.95rem;">${m.topic}</div>
        <div class="muted-text">${m.volume} in the last 7 days</div>
      </div>
      <span class="trend up">${m.sentiment}</span>
    </div>
  `).join('');
}

// =========================================================
// MODAL CREATE / EDIT / DELETE
// =========================================================
window.openPostModal = function(postId = null, defaultDate = '') {
  const modal = document.getElementById('postModal');
  const form = document.getElementById('postForm');
  const delBtn = document.getElementById('deletePostBtn');
  form.reset();

  if (postId) {
    const post = state.posts.find(p => p.id === postId);
    if (!post) return;
    document.getElementById('modalTitle').textContent = 'Edit Scheduled Post';
    document.getElementById('postId').value = post.id;
    document.getElementById('postPlatform').value = post.platform;
    document.getElementById('postFormat').value = post.format;
    document.getElementById('postTitle').value = post.title;
    document.getElementById('postCaption').value = post.caption || '';
    document.getElementById('postDate').value = post.date || '';
    document.getElementById('postTime').value = post.time || '10:00';
    document.getElementById('postStatus').value = post.status;
    document.getElementById('postPillar').value = post.pillar || 'Product Launch';
    document.getElementById('postColor').value = post.color || 'emerald';
    delBtn.style.display = 'inline-block';
  } else {
    document.getElementById('modalTitle').textContent = defaultDate ? `Schedule Post · ${defaultDate}` : 'Create New Post';
    document.getElementById('postId').value = '';
    document.getElementById('postDate').value = defaultDate;
    document.getElementById('postStatus').value = defaultDate ? 'scheduled' : 'draft';
    delBtn.style.display = 'none';
  }

  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
};

function closePostModal() {
  const modal = document.getElementById('postModal');
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
}

function handleFormSubmit(e) {
  e.preventDefault();
  const id = document.getElementById('postId').value;
  const payload = {
    id: id || 'post_' + Date.now(),
    platform: document.getElementById('postPlatform').value,
    format: document.getElementById('postFormat').value,
    title: document.getElementById('postTitle').value.trim(),
    caption: document.getElementById('postCaption').value.trim(),
    date: document.getElementById('postDate').value,
    time: document.getElementById('postTime').value || '10:00',
    status: document.getElementById('postStatus').value,
    pillar: document.getElementById('postPillar').value,
    color: document.getElementById('postColor').value
  };

  if (id) {
    const idx = state.posts.findIndex(p => p.id === id);
    if (idx !== -1) state.posts[idx] = payload;
    showToast('Post updated');
  } else {
    state.posts.push(payload);
    showToast(payload.date ? `Scheduled for ${payload.date}` : 'Saved to Unscheduled Drafts');
  }

  saveState();
  closePostModal();
  renderCalendar();
  if (state.activeTab === 'overview') renderOverview();
  if (state.activeTab === 'approvals') renderApprovals();
}

function handleDeletePost() {
  const id = document.getElementById('postId').value;
  if (!id) return;
  state.posts = state.posts.filter(p => p.id !== id);
  saveState();
  closePostModal();
  renderCalendar();
  showToast('Post deleted');
}

// =========================================================
// UTILITIES
// =========================================================
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

let toastTimer;
window.showToast = function(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
};

// =========================================================
// INITIALIZATION
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
  loadState();
  initTheme();

  // Top nav pill listeners
  document.querySelectorAll('#mainNav .nav-item').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab, true));
  });

  // Jump buttons
  document.querySelectorAll('[data-tab-jump]').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tabJump, true));
  });

  // Calendar View Switcher (Week / Month / Timeline)
  document.querySelectorAll('#calViewSwitcher .seg-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#calViewSwitcher .seg-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.calView = btn.dataset.calview;
      refreshCalViewPill(true);
      renderCalendar();
    });
  });

  // Platform Filter Chips
  document.querySelectorAll('#platformFilters .plat-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      document.querySelectorAll('#platformFilters .plat-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state.platformFilter = chip.dataset.platform;
      renderCalendar();
    });
  });

  // Status Select
  document.getElementById('statusFilter').addEventListener('change', (e) => {
    state.statusFilter = e.target.value;
    renderCalendar();
  });

  // Period Navigation
  const shiftMonth = (delta) => {
    state.currentMonth += delta;
    if (state.currentMonth < 0) { state.currentMonth = 11; state.currentYear--; }
    if (state.currentMonth > 11) { state.currentMonth = 0; state.currentYear++; }
    renderCalendar();
  };

  document.getElementById('prevPeriodBtn').addEventListener('click', () => shiftMonth(-1));
  document.getElementById('nextPeriodBtn').addEventListener('click', () => shiftMonth(1));
  document.getElementById('miniPrevBtn').addEventListener('click', () => shiftMonth(-1));
  document.getElementById('miniNextBtn').addEventListener('click', () => shiftMonth(1));

  document.getElementById('todayBtn').addEventListener('click', () => {
    state.currentYear = 2026;
    state.currentMonth = 10;
    state.selectedDate = TODAY_ISO;
    renderCalendar();
    showToast('Jumped to Today (Nov 20, 2026)');
  });

  // New Post Triggers
  ['newPostBtn', 'ovNewPostBtn', 'quickNewPostRail', 'appNewPostBtn'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', () => openPostModal(null, TODAY_ISO));
  });

  document.getElementById('quickAddDraftBtn').addEventListener('click', () => openPostModal(null, ''));

  // Modal Controls
  document.getElementById('closeModalBtn').addEventListener('click', closePostModal);
  document.getElementById('cancelModalBtn').addEventListener('click', closePostModal);
  document.getElementById('postForm').addEventListener('submit', handleFormSubmit);
  document.getElementById('deletePostBtn').addEventListener('click', handleDeletePost);
  document.getElementById('postModal').addEventListener('click', (e) => {
    if (e.target.id === 'postModal') closePostModal();
  });

  // Export JSON
  document.getElementById('exportDataBtn').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(state.posts, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `social-calendar-${TODAY_ISO}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Calendar exported as JSON');
  });

  // Reset Demo Data
  document.getElementById('resetDemoBtn').addEventListener('click', () => {
    state.posts = structuredClone(DEFAULT_POSTS);
    saveState();
    renderCalendar();
    renderOverview();
    showToast('Demo schedule restored');
  });

  // Keep sliding pills aligned on window resize
  window.addEventListener('resize', () => {
    const activeNav = document.querySelector('#mainNav .nav-item.active');
    if (activeNav) slidePill(document.getElementById('mainNavPill'), document.getElementById('mainNav'), activeNav, false);
    refreshCalViewPill(false);
  });

  // Boot on Publishing Calendar tab (matching user's request)
  switchTab('calendar', false);
});
