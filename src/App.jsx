import { useState, useEffect, useRef } from "react";

const API = "http://localhost:8000";

// ─── ICONS ──────────────────────────────────────────────────────────────────
const Icon = ({ d, size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const icons = {
  home: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z",
  upload: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12",
  chat: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
  history: "M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z",
  star: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z",
  chart: "M18 20V10M12 20V4M6 20v-6",
  brain: "M12 2a4 4 0 0 1 4 4 4 4 0 0 0 4 4 2 2 0 0 1 0 4 4 4 0 0 0-4 4 4 4 0 0 1-8 0 4 4 0 0 0-4-4 2 2 0 0 1 0-4 4 4 0 0 0 4-4 4 4 0 0 1 4-4z",
  logout: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9",
  send: "M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z",
  check: "M20 6L9 17l-5-5",
  alert: "M12 2L2 22h20L12 2zm0 9v4m0 4h.01",
  file: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z M14 2v6h6",
  user: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  target: "M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22ZM12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6C8.68629 6 6 8.68629 6 12C6 15.3137 8.68629 18 12 18ZM12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z",
  x: "M18 6L6 18M6 6l12 12",
  menu: "M3 12h18M3 6h18M3 18h18",
  plus: "M12 5v14M5 12h14",
};

// ─── STYLES ──────────────────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,600;0,800;1,400&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #0a0a0f;
    --bg2: #111118;
    --bg3: #18181f;
    --card: rgba(255,255,255,0.04);
    --card-hover: rgba(255,255,255,0.07);
    --border: rgba(255,255,255,0.08);
    --border-glow: rgba(250,189,0,0.3);
    --gold: #fab900;
    --gold-light: #ffd060;
    --gold-dim: rgba(250,189,0,0.15);
    --text: #f0ede8;
    --text-muted: rgba(240,237,232,0.5);
    --text-dim: rgba(240,237,232,0.3);
    --red: #ff4d6d;
    --green: #00c896;
    --blue: #4da6ff;
    --radius: 16px;
    --radius-sm: 10px;
    --shadow: 0 20px 60px rgba(0,0,0,0.6);
    --glow: 0 0 40px rgba(250,189,0,0.1);
  }

  html, body { height: 100%; overflow: hidden; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--bg);
    color: var(--text);
    line-height: 1.6;
  }

  #root { height: 100%; }

  /* Scrollbars */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: var(--border); border-radius: 4px; }

  /* Layout */
  .app { display: flex; height: 100vh; }

  /* Sidebar */
  .sidebar {
    width: 260px;
    min-width: 260px;
    background: var(--bg2);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    padding: 0;
    position: relative;
    z-index: 10;
    transition: width 0.3s ease;
  }

  .sidebar-logo {
    padding: 28px 24px 20px;
    border-bottom: 1px solid var(--border);
  }

  .logo-text {
    font-family: 'Playfair Display', serif;
    font-size: 22px;
    font-weight: 800;
    background: linear-gradient(135deg, var(--gold), var(--gold-light));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    letter-spacing: -0.5px;
  }

  .logo-sub {
    font-size: 11px;
    color: var(--text-muted);
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-top: 2px;
  }

  .sidebar-nav {
    flex: 1;
    padding: 16px 12px;
    overflow-y: auto;
  }

  .nav-section-label {
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--text-dim);
    padding: 0 12px;
    margin: 12px 0 6px;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 11px 14px;
    border-radius: var(--radius-sm);
    cursor: pointer;
    font-size: 14px;
    font-weight: 400;
    color: var(--text-muted);
    transition: all 0.2s ease;
    border: 1px solid transparent;
    margin-bottom: 2px;
  }

  .nav-item:hover {
    background: var(--card);
    color: var(--text);
    border-color: var(--border);
  }

  .nav-item.active {
    background: var(--gold-dim);
    color: var(--gold-light);
    border-color: var(--border-glow);
    font-weight: 500;
  }

  .nav-item .nav-icon {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background: var(--card);
    flex-shrink: 0;
    transition: background 0.2s;
  }

  .nav-item.active .nav-icon {
    background: rgba(250,189,0,0.2);
  }

  .sidebar-footer {
    padding: 16px 12px;
    border-top: 1px solid var(--border);
  }

  .user-card {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border-radius: var(--radius-sm);
    cursor: pointer;
    transition: background 0.2s;
  }

  .user-card:hover { background: var(--card); }

  .avatar {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--gold), #ff8c42);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: 700;
    color: var(--bg);
    flex-shrink: 0;
  }

  .user-name { font-size: 13px; font-weight: 500; }
  .user-email { font-size: 11px; color: var(--text-muted); }

  /* Main content */
  .main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: var(--bg);
    position: relative;
  }

  .topbar {
    padding: 20px 32px;
    border-bottom: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--bg);
    z-index: 5;
  }

  .page-title {
    font-family: 'Playfair Display', serif;
    font-size: 26px;
    font-weight: 700;
    letter-spacing: -0.5px;
  }

  .page-subtitle {
    font-size: 13px;
    color: var(--text-muted);
    margin-top: 1px;
  }

  .content {
    flex: 1;
    overflow-y: auto;
    padding: 32px;
  }

  /* Cards */
  .card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 24px;
    transition: all 0.25s ease;
  }

  .card:hover {
    background: var(--card-hover);
    border-color: rgba(255,255,255,0.12);
    box-shadow: var(--shadow);
  }

  .card-gold {
    background: var(--gold-dim);
    border-color: var(--border-glow);
  }

  /* Grid */
  .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
  .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
  .grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }

  /* Stat cards */
  .stat-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius);
    padding: 22px 24px;
    position: relative;
    overflow: hidden;
    transition: all 0.3s;
  }

  .stat-card::after {
    content: '';
    position: absolute;
    top: 0; right: 0;
    width: 80px; height: 80px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(250,189,0,0.08) 0%, transparent 70%);
    transform: translate(20px, -20px);
  }

  .stat-value {
    font-family: 'Playfair Display', serif;
    font-size: 36px;
    font-weight: 800;
    line-height: 1;
    margin-bottom: 6px;
  }

  .stat-label {
    font-size: 12px;
    color: var(--text-muted);
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  .stat-accent { color: var(--gold); }
  .stat-green { color: var(--green); }
  .stat-red { color: var(--red); }
  .stat-blue { color: var(--blue); }

  /* Buttons */
  .btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 11px 22px;
    border-radius: var(--radius-sm);
    border: none;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.2s ease;
    text-decoration: none;
    white-space: nowrap;
  }

  .btn-primary {
    background: linear-gradient(135deg, var(--gold), #ffaa00);
    color: #0a0a0f;
    font-weight: 600;
    box-shadow: 0 4px 20px rgba(250,189,0,0.3);
  }

  .btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 28px rgba(250,189,0,0.4);
  }

  .btn-primary:active { transform: translateY(0); }

  .btn-primary:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  .btn-ghost {
    background: var(--card);
    color: var(--text);
    border: 1px solid var(--border);
  }

  .btn-ghost:hover {
    background: var(--card-hover);
    border-color: rgba(255,255,255,0.15);
  }

  .btn-danger {
    background: rgba(255,77,109,0.15);
    color: var(--red);
    border: 1px solid rgba(255,77,109,0.3);
  }

  .btn-danger:hover { background: rgba(255,77,109,0.25); }

  /* Inputs */
  .input {
    width: 100%;
    background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 12px 16px;
    color: var(--text);
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    transition: all 0.2s;
    outline: none;
  }

  .input:focus {
    border-color: var(--gold);
    box-shadow: 0 0 0 3px rgba(250,189,0,0.1);
  }

  .input::placeholder { color: var(--text-dim); }

  .label {
    font-size: 12px;
    font-weight: 500;
    color: var(--text-muted);
    letter-spacing: 0.5px;
    text-transform: uppercase;
    margin-bottom: 8px;
    display: block;
  }

  .field { margin-bottom: 20px; }

  /* Badge */
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px;
    border-radius: 100px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.3px;
  }

  .badge-gold { background: rgba(250,189,0,0.15); color: var(--gold); border: 1px solid rgba(250,189,0,0.2); }
  .badge-green { background: rgba(0,200,150,0.12); color: var(--green); border: 1px solid rgba(0,200,150,0.2); }
  .badge-red { background: rgba(255,77,109,0.12); color: var(--red); border: 1px solid rgba(255,77,109,0.2); }
  .badge-blue { background: rgba(77,166,255,0.12); color: var(--blue); border: 1px solid rgba(77,166,255,0.2); }

  /* Progress bar */
  .progress-track {
    height: 6px;
    background: var(--bg3);
    border-radius: 100px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    border-radius: 100px;
    background: linear-gradient(90deg, var(--gold), var(--gold-light));
    transition: width 0.8s ease;
  }

  /* Toast */
  .toast-container {
    position: fixed;
    top: 24px;
    right: 24px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .toast {
    background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 14px 18px;
    font-size: 13px;
    box-shadow: var(--shadow);
    animation: slideIn 0.3s ease;
    max-width: 320px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .toast.success { border-left: 3px solid var(--green); }
  .toast.error { border-left: 3px solid var(--red); }

  @keyframes slideIn {
    from { opacity: 0; transform: translateX(20px); }
    to { opacity: 1; transform: translateX(0); }
  }

  /* Auth screen */
  .auth-screen {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg);
    position: relative;
    overflow: hidden;
  }

  .auth-bg {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 60% 50% at 80% 20%, rgba(250,189,0,0.06) 0%, transparent 60%),
      radial-gradient(ellipse 40% 60% at 10% 80%, rgba(77,166,255,0.04) 0%, transparent 60%);
  }

  .auth-box {
    position: relative;
    width: 420px;
    background: var(--bg2);
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 48px 40px;
    box-shadow: 0 40px 80px rgba(0,0,0,0.7);
  }

  .auth-title {
    font-family: 'Playfair Display', serif;
    font-size: 32px;
    font-weight: 800;
    text-align: center;
    margin-bottom: 8px;
    background: linear-gradient(135deg, var(--text), var(--gold-light));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .auth-sub {
    text-align: center;
    color: var(--text-muted);
    font-size: 14px;
    margin-bottom: 36px;
  }

  .auth-switch {
    text-align: center;
    margin-top: 24px;
    font-size: 13px;
    color: var(--text-muted);
  }

  .auth-switch span {
    color: var(--gold);
    cursor: pointer;
    font-weight: 500;
  }

  .auth-switch span:hover { text-decoration: underline; }

  /* Interview chat */
  .chat-area {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .chat-bubble {
    max-width: 75%;
    padding: 14px 18px;
    border-radius: 16px;
    font-size: 14px;
    line-height: 1.7;
    animation: fadeUp 0.3s ease;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .chat-bubble.ai {
    background: var(--card);
    border: 1px solid var(--border);
    border-bottom-left-radius: 4px;
    align-self: flex-start;
  }

  .chat-bubble.user {
    background: var(--gold-dim);
    border: 1px solid var(--border-glow);
    border-bottom-right-radius: 4px;
    align-self: flex-end;
  }

  .chat-input-area {
    padding: 20px 24px;
    border-top: 1px solid var(--border);
    display: flex;
    gap: 12px;
    align-items: flex-end;
  }

  .chat-input {
    flex: 1;
    resize: none;
    max-height: 120px;
    min-height: 46px;
  }

  /* Evaluate section */
  .score-ring {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    border: 3px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
  }

  .score-num {
    font-family: 'Playfair Display', serif;
    font-size: 26px;
    font-weight: 800;
  }

  /* Upload zone */
  .upload-zone {
    border: 2px dashed var(--border);
    border-radius: var(--radius);
    padding: 48px;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s;
    background: var(--card);
  }

  .upload-zone:hover, .upload-zone.dragging {
    border-color: var(--gold);
    background: var(--gold-dim);
  }

  .upload-icon {
    width: 56px;
    height: 56px;
    background: var(--gold-dim);
    border: 1px solid var(--border-glow);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 16px;
  }

  /* Resume list */
  .resume-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px 20px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    margin-bottom: 10px;
    transition: all 0.2s;
  }

  .resume-item:hover {
    background: var(--card-hover);
    border-color: rgba(255,255,255,0.12);
  }

  .resume-icon {
    width: 40px;
    height: 40px;
    background: rgba(250,189,0,0.12);
    border: 1px solid rgba(250,189,0,0.2);
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  /* Divider */
  .divider {
    height: 1px;
    background: var(--border);
    margin: 24px 0;
  }

  /* Section title */
  .section-title {
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    font-weight: 700;
    margin-bottom: 16px;
  }

  /* Loading dot */
  .loading-dots {
    display: flex;
    gap: 5px;
    align-items: center;
    padding: 14px 18px;
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 16px;
    border-bottom-left-radius: 4px;
    align-self: flex-start;
  }

  .dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: var(--gold);
    animation: bounce 1.2s infinite;
  }

  .dot:nth-child(2) { animation-delay: 0.2s; }
  .dot:nth-child(3) { animation-delay: 0.4s; }

  @keyframes bounce {
    0%, 80%, 100% { transform: scale(0.7); opacity: 0.5; }
    40% { transform: scale(1); opacity: 1; }
  }

  /* Skill bar */
  .skill-item {
    margin-bottom: 14px;
  }

  .skill-header {
    display: flex;
    justify-content: space-between;
    font-size: 13px;
    margin-bottom: 6px;
  }

  /* Weak topics */
  .weak-chip {
    display: inline-block;
    padding: 6px 14px;
    background: rgba(255,77,109,0.1);
    border: 1px solid rgba(255,77,109,0.2);
    border-radius: 100px;
    font-size: 12px;
    color: var(--red);
    margin: 4px;
  }

  /* Tabs */
  .tabs {
    display: flex;
    gap: 4px;
    background: var(--bg3);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    padding: 4px;
    width: fit-content;
    margin-bottom: 24px;
  }

  .tab {
    padding: 8px 18px;
    border-radius: 7px;
    font-size: 13px;
    font-weight: 500;
    cursor: pointer;
    color: var(--text-muted);
    transition: all 0.2s;
    border: none;
    background: none;
    font-family: 'DM Sans', sans-serif;
  }

  .tab.active {
    background: var(--bg2);
    color: var(--gold);
    border: 1px solid var(--border);
  }

  .tab:hover:not(.active) { color: var(--text); }

  .flex { display: flex; }
  .flex-col { flex-direction: column; }
  .items-center { align-items: center; }
  .justify-between { justify-content: space-between; }
  .gap-3 { gap: 12px; }
  .gap-4 { gap: 16px; }
  .mb-4 { margin-bottom: 16px; }
  .mb-6 { margin-bottom: 24px; }
  .mt-4 { margin-top: 16px; }
  .mt-2 { margin-top: 8px; }
  .full { width: 100%; }

  .text-sm { font-size: 13px; }
  .text-xs { font-size: 11px; }
  .text-muted { color: var(--text-muted); }
  .text-gold { color: var(--gold); }
  .text-green { color: var(--green); }
  .text-red { color: var(--red); }
  .font-serif { font-family: 'Playfair Display', serif; }

  @media (max-width: 768px) {
    .sidebar { display: none; }
    .grid-4, .grid-3 { grid-template-columns: 1fr 1fr; }
    .grid-2 { grid-template-columns: 1fr; }
    .content { padding: 20px; }
  }
`;

// ─── TOAST ────────────────────────────────────────────────────────────────────
let toastId = 0;
const toastCallbacks = { add: null };

function ToastContainer() {
  const [toasts, setToasts] = useState([]);
  toastCallbacks.add = (msg, type = "success") => {
    const id = ++toastId;
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  };
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.type}`}>
          <Icon d={t.type === "success" ? icons.check : icons.alert} size={16} color={t.type === "success" ? "var(--green)" : "var(--red)"} />
          {t.msg}
        </div>
      ))}
    </div>
  );
}

const toast = (msg, type) => toastCallbacks.add?.(msg, type);

// ─── API HELPERS ──────────────────────────────────────────────────────────────
async function apiFetch(path, options = {}, token = null) {
  const headers = { "Content-Type": "application/json", ...(options.headers || {}) };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(API + path, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || `Error ${res.status}`);
  }
  return res.json();
}

// ─── AUTH ──────────────────────────────────────────────────────────────────────
function AuthScreen({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ email: "", password: "", full_name: "" });
  const [loading, setLoading] = useState(false);

  const handle = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "register") {
        await apiFetch("/users", {
          method: "POST",
          body: JSON.stringify({ email: form.email, password: form.password, full_name: form.full_name })
        });
        toast("Account created! Please log in.", "success");
        setMode("login");
      } else {
        const params = new URLSearchParams({ username: form.email, password: form.password });
        const res = await fetch(API + "/login", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: params
        });
        if (!res.ok) throw new Error("Invalid credentials");
        const data = await res.json();
        onLogin(data.access_token);
        toast("Welcome back!", "success");
      }
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-screen">
      <div className="auth-bg" />
      <div className="auth-box">
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>🎯</div>
          <div className="auth-title">InterviewIQ</div>
          <div className="auth-sub">
            {mode === "login" ? "Sign in to your coaching dashboard" : "Create your coaching account"}
          </div>
        </div>
        <form onSubmit={handle}>
          {mode === "register" && (
            <div className="field">
              <label className="label">Full Name</label>
              <input className="input" placeholder="Jane Smith" value={form.full_name}
                onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} />
            </div>
          )}
          <div className="field">
            <label className="label">Email</label>
            <input className="input" type="email" placeholder="you@example.com" value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))} required />
          </div>
          <div className="field">
            <label className="label">Password</label>
            <input className="input" type="password" placeholder="••••••••" value={form.password}
              onChange={e => setForm(f => ({ ...f, password: e.target.value }))} required />
          </div>
          <button className="btn btn-primary full" type="submit" disabled={loading}
            style={{ justifyContent: "center", marginTop: 8 }}>
            {loading ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>
        <div className="auth-switch">
          {mode === "login" ? <>No account? <span onClick={() => setMode("register")}>Sign up free</span></> :
            <>Have an account? <span onClick={() => setMode("login")}>Sign in</span></>}
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function Dashboard({ token }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/dashboard", {}, token)
      .then(setData)
      .catch(() => toast("Failed to load dashboard", "error"))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <LoadingState label="Loading your dashboard…" />;

  const score = data?.average_score || 0;
  const scoreColor = score >= 7 ? "var(--green)" : score >= 5 ? "var(--gold)" : "var(--red)";

  return (
    <div>
      <div className="grid-4 mb-6">
        <div className="stat-card">
          <div className="stat-value stat-accent">{data?.average_score || 0}<span style={{ fontSize: 16 }}>/10</span></div>
          <div className="stat-label">Avg Interview Score</div>
          <div style={{ marginTop: 12 }}>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${(data?.average_score || 0) * 10}%` }} />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-value stat-blue">{data?.total_interviews || 0}</div>
          <div className="stat-label">Practice Sessions</div>
        </div>
        <div className="stat-card">
          <div className="stat-value" style={{ color: scoreColor }}>
            {data?.ats_score != null ? `${data.ats_score}%` : "—"}
          </div>
          <div className="stat-label">ATS Resume Score</div>
          {data?.ats_score != null && (
            <div style={{ marginTop: 12 }}>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${data.ats_score}%`, background: `linear-gradient(90deg, ${scoreColor}, ${scoreColor}88)` }} />
              </div>
            </div>
          )}
        </div>
        <div className="stat-card">
          <div className="stat-value stat-red">{data?.weak_topics?.length || 0}</div>
          <div className="stat-label">Weak Areas Found</div>
        </div>
      </div>

      {data?.recommendation && (
        <div className="card card-gold mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div style={{ fontSize: 24 }}>💡</div>
            <div>
              <div className="section-title" style={{ marginBottom: 0 }}>AI Recommendation</div>
              <div className="text-sm text-muted">Based on your performance</div>
            </div>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text-muted)" }}>{data.recommendation}</p>
        </div>
      )}

      {data?.weak_topics?.length > 0 && (
        <div className="card">
          <div className="section-title">Areas to Strengthen</div>
          <div>
            {data.weak_topics.slice(0, 6).map((t, i) => (
              <span key={i} className="weak-chip">{t.length > 50 ? t.slice(0, 50) + "…" : t}</span>
            ))}
          </div>
        </div>
      )}

      {!data?.total_interviews && (
        <div className="card" style={{ textAlign: "center", padding: "48px 24px" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🚀</div>
          <div className="font-serif" style={{ fontSize: 22, marginBottom: 8 }}>Start Your Journey</div>
          <p className="text-muted text-sm">Upload your resume and begin practicing interviews to see your analytics here.</p>
        </div>
      )}
    </div>
  );
}

// ─── UPLOAD RESUME ────────────────────────────────────────────────────────────
function UploadResume({ token }) {
  const [file, setFile] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [tab, setTab] = useState("upload");
  const inputRef = useRef();

  const fetchResumes = () => {
    apiFetch("/my-resumes", {}, token).then(setResumes).catch(() => {});
  };

  useEffect(() => { fetchResumes(); }, []);

  const doUpload = async () => {
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch(API + "/upload-resume", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: fd
      });
      if (!res.ok) throw new Error("Upload failed");
      toast("Resume uploaded & parsed!", "success");
      setFile(null);
      fetchResumes();
      setTab("resumes");
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="tabs">
        <button className={`tab ${tab === "upload" ? "active" : ""}`} onClick={() => setTab("upload")}>Upload New</button>
        <button className={`tab ${tab === "resumes" ? "active" : ""}`} onClick={() => { setTab("resumes"); fetchResumes(); }}>
          My Resumes {resumes.length > 0 && `(${resumes.length})`}
        </button>
      </div>

      {tab === "upload" && (
        <div className="grid-2" style={{ gridTemplateColumns: "1fr 1fr", alignItems: "start" }}>
          <div>
            <div
              className={`upload-zone ${dragging ? "dragging" : ""}`}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => {
                e.preventDefault(); setDragging(false);
                const f = e.dataTransfer.files[0];
                if (f?.type === "application/pdf") setFile(f);
                else toast("Only PDF files are allowed", "error");
              }}
              onClick={() => inputRef.current?.click()}
            >
              <input ref={inputRef} type="file" accept=".pdf" style={{ display: "none" }}
                onChange={e => { const f = e.target.files[0]; if (f) setFile(f); }} />
              <div className="upload-icon">
                <Icon d={icons.upload} size={24} color="var(--gold)" />
              </div>
              <div className="font-serif" style={{ fontSize: 18, marginBottom: 8 }}>
                {file ? file.name : "Drop your PDF here"}
              </div>
              <div className="text-sm text-muted">
                {file ? `${(file.size / 1024).toFixed(1)} KB` : "or click to browse"}
              </div>
              {file && (
                <div className="badge badge-green" style={{ marginTop: 12 }}>
                  <Icon d={icons.check} size={11} /> Ready to upload
                </div>
              )}
            </div>
            <button className="btn btn-primary full" style={{ justifyContent: "center", marginTop: 16 }}
              onClick={doUpload} disabled={!file || uploading}>
              {uploading ? "Uploading…" : "Upload Resume"}
            </button>
          </div>

          <div className="card">
            <div className="section-title">Why Upload Your Resume?</div>
            {[
              ["🎯", "ATS Score Analysis", "Get an instant compatibility score for job applications"],
              ["🤖", "AI Interview Coach", "Personalized questions generated from your experience"],
              ["📊", "Gap Analysis", "Identify missing skills before your interview"],
            ].map(([emoji, title, desc]) => (
              <div key={title} className="flex gap-3 mb-4 items-center">
                <div style={{ fontSize: 22, flexShrink: 0 }}>{emoji}</div>
                <div>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>{title}</div>
                  <div className="text-xs text-muted">{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {tab === "resumes" && (
        <div>
          {resumes.length === 0 ? (
            <div className="card" style={{ textAlign: "center", padding: 48 }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📄</div>
              <div className="text-muted">No resumes uploaded yet</div>
            </div>
          ) : (
            resumes.map((r, i) => (
              <div key={r.id} className="resume-item">
                <div className="resume-icon">
                  <Icon d={icons.file} size={18} color="var(--gold)" />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 500, fontSize: 14 }}>{r.file_name?.split("_").slice(1).join("_") || r.file_name}</div>
                  <div className="text-xs text-muted">
                    {r.created_at ? new Date(r.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "Recent"}
                  </div>
                </div>
                {i === 0 && <div className="badge badge-green">Active</div>}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

// ─── INTERVIEW PRACTICE ───────────────────────────────────────────────────────
function InterviewPractice({ token }) {
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hello! I'm your AI interview coach. Ask me any interview question or say 'Give me a question from my resume' to start practicing." }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const send = async () => {
    const q = input.trim();
    if (!q || loading) return;
    setInput("");
    setMessages(m => [...m, { role: "user", text: q }]);
    setLoading(true);
    try {
      const data = await apiFetch("/ask", { method: "POST", body: JSON.stringify({ question: q }) }, token);
      setMessages(m => [...m, { role: "ai", text: data.answer }]);
    } catch (err) {
      toast(err.message, "error");
      setMessages(m => [...m, { role: "ai", text: "Sorry, I couldn't process that. Make sure you have a resume uploaded." }]);
    } finally {
      setLoading(false);
    }
  };

  const starters = [
    "Tell me about your background",
    "What's your greatest strength?",
    "Why do you want this role?",
    "Give me a technical question from my resume"
  ];

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 110px)" }}>
      {messages.length === 1 && (
        <div style={{ padding: "16px 24px", display: "flex", gap: 8, flexWrap: "wrap" }}>
          {starters.map(s => (
            <button key={s} className="btn btn-ghost" style={{ fontSize: 12 }} onClick={() => { setInput(s); }}>
              {s}
            </button>
          ))}
        </div>
      )}
      <div className="chat-area">
        {messages.map((m, i) => (
          <div key={i} className={`chat-bubble ${m.role}`}>
            {m.role === "ai" && <div style={{ fontSize: 11, color: "var(--gold)", fontWeight: 600, marginBottom: 6 }}>INTERVIEW AI</div>}
            {m.text}
          </div>
        ))}
        {loading && (
          <div className="loading-dots">
            <div className="dot" /><div className="dot" /><div className="dot" />
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div className="chat-input-area">
        <textarea
          className="input chat-input"
          placeholder="Ask a question or practice answering one…"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          rows={1}
        />
        <button className="btn btn-primary" onClick={send} disabled={loading || !input.trim()}>
          <Icon d={icons.send} size={16} color="var(--bg)" />
          Send
        </button>
      </div>
    </div>
  );
}

// ─── EVALUATE ─────────────────────────────────────────────────────────────────
function Evaluate({ token }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const doEvaluate = async () => {
    if (!question.trim() || !answer.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const data = await apiFetch("/evaluate", {
        method: "POST",
        body: JSON.stringify({ question, user_answer: answer })
      }, token);
      setResult(data);
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = result?.score >= 8 ? "var(--green)" : result?.score >= 5 ? "var(--gold)" : "var(--red)";
  const scoreLabel = result?.score >= 8 ? "Excellent" : result?.score >= 5 ? "Good" : "Needs Work";

  return (
    <div>
      <div className="grid-2 mb-6">
        <div>
          <div className="field">
            <label className="label">Interview Question</label>
            <input className="input" placeholder="e.g. Explain the difference between REST and GraphQL" value={question}
              onChange={e => setQuestion(e.target.value)} />
          </div>
          <div className="field">
            <label className="label">Your Answer</label>
            <textarea className="input" rows={8} placeholder="Type your full answer here…" value={answer}
              onChange={e => setAnswer(e.target.value)} style={{ resize: "vertical" }} />
          </div>
          <button className="btn btn-primary" onClick={doEvaluate} disabled={loading || !question || !answer}>
            {loading ? "Evaluating…" : "→ Evaluate Answer"}
          </button>
        </div>

        <div>
          {!result && !loading && (
            <div className="card" style={{ height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, textAlign: "center" }}>
              <div style={{ fontSize: 48 }}>🧠</div>
              <div className="font-serif" style={{ fontSize: 20 }}>AI-Powered Feedback</div>
              <p className="text-sm text-muted">Get technical feedback and a score from 1–10 based on your answer quality, accuracy, and communication.</p>
            </div>
          )}

          {loading && <LoadingState label="Evaluating your answer…" />}

          {result && (
            <div className="card" style={{ animation: "fadeUp 0.4s ease" }}>
              <div className="flex items-center gap-4 mb-6">
                <div className="score-ring" style={{ borderColor: scoreColor }}>
                  <div className="score-num" style={{ color: scoreColor }}>{result.score}</div>
                </div>
                <div>
                  <div className="font-serif" style={{ fontSize: 22 }}>Score: {result.score}/10</div>
                  <div className="badge" style={{ background: `${scoreColor}20`, color: scoreColor, border: `1px solid ${scoreColor}40`, marginTop: 4 }}>
                    {scoreLabel}
                  </div>
                </div>
              </div>

              {result.technical_feedback && (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5 }}>Technical Feedback</div>
                  <p style={{ fontSize: 14, lineHeight: 1.7 }}>{result.technical_feedback}</p>
                </div>
              )}

              {result.improvements && (
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13, marginBottom: 8, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5 }}>Improvements</div>
                  <p style={{ fontSize: 14, lineHeight: 1.7, color: "var(--text-muted)" }}>{result.improvements}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── HISTORY ──────────────────────────────────────────────────────────────────
function History({ token }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    apiFetch("/history?limit=20", {}, token)
      .then(setHistory)
      .catch(() => toast("Failed to load history", "error"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState label="Loading history…" />;

  return (
    <div>
      {history.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: 48 }}>
          <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
          <div className="text-muted">No interview history yet</div>
        </div>
      ) : (
        history.map((h, i) => (
          <div key={h.id} className="card mb-4" style={{ cursor: "pointer" }}
            onClick={() => setExpanded(expanded === i ? null : i)}>
            <div className="flex items-center justify-between">
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 500, fontSize: 14, marginBottom: 4 }}>{h.question}</div>
                <div className="text-xs text-muted">
                  {h.created_at ? new Date(h.created_at).toLocaleString() : "Recent"}
                </div>
              </div>
              <div style={{ transform: expanded === i ? "rotate(180deg)" : "none", transition: "0.2s", color: "var(--text-muted)" }}>▾</div>
            </div>
            {expanded === i && (
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border)", fontSize: 14, lineHeight: 1.7, color: "var(--text-muted)", animation: "fadeUp 0.2s ease" }}>
                {h.answer}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

// ─── RESUME ANALYSIS ──────────────────────────────────────────────────────────
function ResumeAnalysis({ token }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const doAnalyze = async () => {
    setLoading(true);
    setResult(null);
    try {
      const data = await apiFetch("/analyze-resume", { method: "POST" }, token);
      setResult(data);
      toast("Resume analyzed!", "success");
    } catch (err) {
      toast(err.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const scoreColor = result?.ats_score >= 80 ? "var(--green)" : result?.ats_score >= 60 ? "var(--gold)" : "var(--red)";

  return (
    <div>
      {!result && (
        <div className="card" style={{ textAlign: "center", padding: 48, marginBottom: 24 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🎯</div>
          <div className="font-serif" style={{ fontSize: 24, marginBottom: 8 }}>ATS Resume Analyzer</div>
          <p className="text-muted text-sm" style={{ maxWidth: 400, margin: "0 auto 24px" }}>
            Analyze your resume for ATS compatibility, identify gaps, and get actionable improvements.
          </p>
          <button className="btn btn-primary" onClick={doAnalyze} disabled={loading}>
            {loading ? "Analyzing…" : "🔍 Analyze My Resume"}
          </button>
        </div>
      )}

      {loading && <LoadingState label="AI is analyzing your resume…" />}

      {result && (
        <div style={{ animation: "fadeUp 0.4s ease" }}>
          <div className="grid-3 mb-6">
            <div className="stat-card" style={{ gridColumn: "1" }}>
              <div className="stat-value" style={{ color: scoreColor }}>{result.ats_score}<span style={{ fontSize: 16 }}>%</span></div>
              <div className="stat-label">ATS Compatibility Score</div>
              <div style={{ marginTop: 12 }}>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${result.ats_score}%`, background: `linear-gradient(90deg, ${scoreColor}, ${scoreColor}88)` }} />
                </div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-value stat-green">{result.strengths?.length || 0}</div>
              <div className="stat-label">Strengths Found</div>
            </div>
            <div className="stat-card">
              <div className="stat-value stat-red">{result.missing_skills?.length || 0}</div>
              <div className="stat-label">Skills to Add</div>
            </div>
          </div>

          <div className="grid-2">
            <div className="card">
              <div className="section-title" style={{ color: "var(--green)" }}>✓ Strengths</div>
              {result.strengths?.map((s, i) => (
                <div key={i} style={{ fontSize: 13, padding: "8px 0", borderBottom: "1px solid var(--border)", color: "var(--text-muted)", display: "flex", gap: 8 }}>
                  <span style={{ color: "var(--green)" }}>✓</span> {s}
                </div>
              ))}
            </div>

            <div>
              <div className="card mb-4">
                <div className="section-title" style={{ color: "var(--red)" }}>⚠ Missing Skills</div>
                {result.missing_skills?.map((s, i) => (
                  <div key={i} style={{ fontSize: 13, padding: "8px 0", borderBottom: "1px solid var(--border)", color: "var(--text-muted)", display: "flex", gap: 8 }}>
                    <span style={{ color: "var(--red)" }}>+</span> {s}
                  </div>
                ))}
              </div>

              <div className="card">
                <div className="section-title" style={{ color: "var(--gold)" }}>💡 Improvements</div>
                {result.improvements?.map((s, i) => (
                  <div key={i} style={{ fontSize: 13, padding: "8px 0", borderBottom: "1px solid var(--border)", color: "var(--text-muted)", display: "flex", gap: 8 }}>
                    <span style={{ color: "var(--gold)" }}>→</span> {s}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginTop: 16, textAlign: "center" }}>
            <button className="btn btn-ghost" onClick={doAnalyze} disabled={loading}>Re-Analyze</button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── WEAK AREAS ───────────────────────────────────────────────────────────────
function WeakAreas({ token }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/weak-areas", {}, token)
      .then(setData)
      .catch(() => toast("Failed to load weak areas", "error"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState label="Analyzing your performance…" />;

  if (data?.message) {
    return (
      <div className="card" style={{ textAlign: "center", padding: 48 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>📝</div>
        <div className="text-muted">No evaluations found yet. Try evaluating some answers first!</div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid-3 mb-6">
        <div className="stat-card">
          <div className="stat-value stat-accent">{data?.average_score || 0}<span style={{ fontSize: 16 }}>/10</span></div>
          <div className="stat-label">Average Score</div>
        </div>
        <div className="stat-card">
          <div className="stat-value stat-blue">{data?.total_attempts || 0}</div>
          <div className="stat-label">Total Attempts</div>
        </div>
        <div className="stat-card">
          <div className="stat-value stat-red">{data?.weak_topics?.length || 0}</div>
          <div className="stat-label">Weak Areas</div>
        </div>
      </div>

      {data?.weak_topics?.length > 0 && (
        <div className="card mb-6">
          <div className="section-title">Questions Needing Improvement</div>
          {data.weak_topics.map((t, i) => (
            <div key={i} style={{ padding: "12px 0", borderBottom: "1px solid var(--border)", display: "flex", alignItems: "center", gap: 12 }}>
              <div className="badge badge-red">Low</div>
              <div style={{ fontSize: 13 }}>{t}</div>
            </div>
          ))}
        </div>
      )}

      {data?.recommendation && (
        <div className="card card-gold">
          <div className="flex items-center gap-3 mb-4">
            <div style={{ fontSize: 28 }}>🤖</div>
            <div className="section-title" style={{ marginBottom: 0 }}>AI Study Plan</div>
          </div>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: "var(--text-muted)" }}>{data.recommendation}</p>
        </div>
      )}
    </div>
  );
}

// ─── LOADING ──────────────────────────────────────────────────────────────────
function LoadingState({ label }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 24px", gap: 16 }}>
      <div className="loading-dots">
        <div className="dot" /><div className="dot" /><div className="dot" />
      </div>
      <div className="text-sm text-muted">{label}</div>
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard", label: "Dashboard", icon: icons.home },
  { id: "upload", label: "Resume", icon: icons.upload },
  { id: "practice", label: "Practice", icon: icons.chat },
  { id: "evaluate", label: "Evaluate", icon: icons.star },
  { id: "history", label: "History", icon: icons.history },
  { id: "analysis", label: "ATS Analysis", icon: icons.target },
  { id: "weak", label: "Weak Areas", icon: icons.chart },
];

const PAGE_META = {
  dashboard: { title: "Dashboard", sub: "Your performance at a glance" },
  upload: { title: "Resume", sub: "Upload and manage your resumes" },
  practice: { title: "Practice Interview", sub: "Chat with your AI interview coach" },
  evaluate: { title: "Evaluate Answers", sub: "Get scored feedback on your responses" },
  history: { title: "History", sub: "Review past practice sessions" },
  analysis: { title: "ATS Analysis", sub: "Resume compatibility scoring" },
  weak: { title: "Weak Areas", sub: "Focus your preparation" },
};

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem("iq_token"));
  const [page, setPage] = useState("dashboard");
  const [user, setUser] = useState(null);

  useEffect(() => {
    if (token) {
      apiFetch("/me", {}, token).then(setUser).catch(() => {
        localStorage.removeItem("iq_token");
        setToken(null);
      });
    }
  }, [token]);

  const handleLogin = (tok) => {
    localStorage.setItem("iq_token", tok);
    setToken(tok);
  };

  const handleLogout = () => {
    localStorage.removeItem("iq_token");
    setToken(null);
    setUser(null);
  };

  const meta = PAGE_META[page];

  if (!token) return (
    <>
      <style>{css}</style>
      <ToastContainer />
      <AuthScreen onLogin={handleLogin} />
    </>
  );

  return (
    <>
      <style>{css}</style>
      <ToastContainer />
      <div className="app">
        <aside className="sidebar">
          <div className="sidebar-logo">
            <div className="logo-text">InterviewIQ</div>
            <div className="logo-sub">AI Coaching Platform</div>
          </div>
          <nav className="sidebar-nav">
            <div className="nav-section-label">Main</div>
            {NAV.slice(0, 2).map(n => (
              <div key={n.id} className={`nav-item ${page === n.id ? "active" : ""}`} onClick={() => setPage(n.id)}>
                <div className="nav-icon"><Icon d={n.icon} size={16} /></div>
                {n.label}
              </div>
            ))}
            <div className="nav-section-label">Practice</div>
            {NAV.slice(2, 5).map(n => (
              <div key={n.id} className={`nav-item ${page === n.id ? "active" : ""}`} onClick={() => setPage(n.id)}>
                <div className="nav-icon"><Icon d={n.icon} size={16} /></div>
                {n.label}
              </div>
            ))}
            <div className="nav-section-label">Insights</div>
            {NAV.slice(5).map(n => (
              <div key={n.id} className={`nav-item ${page === n.id ? "active" : ""}`} onClick={() => setPage(n.id)}>
                <div className="nav-icon"><Icon d={n.icon} size={16} /></div>
                {n.label}
              </div>
            ))}
          </nav>
          <div className="sidebar-footer">
            <div className="user-card">
              <div className="avatar">{user?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="user-name" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user?.full_name || "User"}
                </div>
                <div className="user-email" style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user?.email}
                </div>
              </div>
              <div onClick={handleLogout} style={{ cursor: "pointer", color: "var(--text-dim)", flexShrink: 0 }}>
                <Icon d={icons.logout} size={15} />
              </div>
            </div>
          </div>
        </aside>

        <main className="main">
          <div className="topbar">
            <div>
              <div className="page-title">{meta.title}</div>
              <div className="page-subtitle">{meta.sub}</div>
            </div>
          </div>
          <div className={`content ${page === "practice" ? "" : ""}`}
            style={page === "practice" ? { padding: 0, overflow: "hidden" } : {}}>
            {page === "dashboard" && <Dashboard token={token} />}
            {page === "upload" && <UploadResume token={token} />}
            {page === "practice" && <InterviewPractice token={token} />}
            {page === "evaluate" && <Evaluate token={token} />}
            {page === "history" && <History token={token} />}
            {page === "analysis" && <ResumeAnalysis token={token} />}
            {page === "weak" && <WeakAreas token={token} />}
          </div>
        </main>
      </div>
    </>
  );
}
