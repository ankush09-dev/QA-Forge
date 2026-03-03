import { useState, useEffect, useRef, useCallback } from "react";

// ─── DESIGN TOKENS ───────────────────────────────────────────────────────────
const T = {
  bg: "#0A0C10",
  surface: "#0F1117",
  card: "#141820",
  border: "#1E2535",
  borderLight: "#252D3D",
  accent: "#00D9FF",
  accentDim: "#0096B3",
  green: "#00E87A",
  red: "#FF4D6A",
  yellow: "#FFB830",
  purple: "#A855F7",
  text: "#E8EDF5",
  textMuted: "#6B7A96",
  textDim: "#3D4A60",
};

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
const MOCK_USERS = {
  qa: { id: 1, name: "Priya Sharma", role: "QA", avatar: "PS", email: "priya@acme.com" },
  dev: { id: 2, name: "Alex Chen", role: "Developer", avatar: "AC", email: "alex@acme.com" },
  manager: { id: 3, name: "Jordan Lee", role: "Manager", avatar: "JL", email: "jordan@acme.com" },
};

const INITIAL_TEST_CASES = [
  {
    id: "TC-001", title: "User Login with Valid Credentials", status: "Passed",
    priority: "High", tags: ["auth", "smoke"], version: "v2.1", assignee: "Priya Sharma",
    steps: ["Navigate to login page", "Enter valid email", "Enter valid password", "Click Login"],
    expected: "User redirected to dashboard", automationStatus: "Automated",
    requirement: "REQ-AUTH-001", createdAt: "2025-01-15", lastRun: "2025-01-20",
    runHistory: [{ date: "2025-01-20", status: "Passed", duration: "1.2s" }, { date: "2025-01-19", status: "Passed", duration: "1.1s" }]
  },
  {
    id: "TC-002", title: "Password Reset Flow", status: "Failed",
    priority: "Critical", tags: ["auth", "regression"], version: "v2.1", assignee: "Alex Chen",
    steps: ["Click 'Forgot Password'", "Enter registered email", "Check email for reset link", "Set new password"],
    expected: "Password updated, user can login with new credentials", automationStatus: "Automated",
    requirement: "REQ-AUTH-002", createdAt: "2025-01-15", lastRun: "2025-01-20",
    runHistory: [{ date: "2025-01-20", status: "Failed", duration: "3.4s" }, { date: "2025-01-19", status: "Passed", duration: "2.8s" }]
  },
  {
    id: "TC-003", title: "Product Search with Filters", status: "Pending",
    priority: "Medium", tags: ["search", "ui"], version: "v2.0", assignee: "Priya Sharma",
    steps: ["Navigate to search page", "Enter search term", "Apply category filter", "Apply price range"],
    expected: "Filtered results displayed correctly", automationStatus: "Manual",
    requirement: "REQ-SEARCH-001", createdAt: "2025-01-10", lastRun: "2025-01-18",
    runHistory: [{ date: "2025-01-18", status: "Pending", duration: "-" }]
  },
  {
    id: "TC-004", title: "Checkout Payment Processing", status: "Passed",
    priority: "Critical", tags: ["payment", "checkout", "smoke"], version: "v2.1", assignee: "Priya Sharma",
    steps: ["Add item to cart", "Proceed to checkout", "Enter payment details", "Confirm order"],
    expected: "Order placed, confirmation email sent", automationStatus: "Automated",
    requirement: "REQ-PAY-001", createdAt: "2025-01-12", lastRun: "2025-01-20",
    runHistory: [{ date: "2025-01-20", status: "Passed", duration: "4.1s" }, { date: "2025-01-19", status: "Passed", duration: "3.9s" }]
  },
  {
    id: "TC-005", title: "User Profile Update", status: "Skipped",
    priority: "Low", tags: ["profile", "ui"], version: "v2.0", assignee: "Alex Chen",
    steps: ["Navigate to profile", "Update display name", "Upload avatar", "Save changes"],
    expected: "Profile updated with new information", automationStatus: "Manual",
    requirement: "REQ-PROF-001", createdAt: "2025-01-08", lastRun: "2025-01-16",
    runHistory: [{ date: "2025-01-16", status: "Skipped", duration: "-" }]
  },
];

// ─── ICONS ────────────────────────────────────────────────────────────────────
const Icon = ({ name, size = 16, color = "currentColor" }) => {
  const icons = {
    upload: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
    ai: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2a4 4 0 014 4 4 4 0 01-4 4 4 4 0 01-4-4 4 4 0 014-4"/><path d="M20 12a4 4 0 014 4 4 4 0 01-4 4 4 4 0 01-4-4 4 4 0 014-4"/><path d="M4 12a4 4 0 014 4 4 4 0 01-4 4 4 4 0 01-4-4 4 4 0 014-4"/><line x1="12" y1="10" x2="12" y2="14"/><line x1="10" y1="12" x2="14" y2="12"/></svg>,
    test: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v11l3 3 3-3V3M7 21h10"/></svg>,
    matrix: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
    export: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>,
    dashboard: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>,
    check: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>,
    x: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>,
    plus: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
    tag: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>,
    filter: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>,
    chevron: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>,
    users: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>,
    automation: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.07 4.93l-1.41 1.41M4.93 4.93l1.41 1.41M12 2v2M12 20v2M20 12h2M2 12h2M19.07 19.07l-1.41-1.41M4.93 19.07l1.41-1.41"/></svg>,
    link: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>,
    edit: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
    trash: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a1 1 0 011-1h4a1 1 0 011 1v2"/></svg>,
    play: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>,
    clock: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    warning: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    logout: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
    sparkle: <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/><path d="M5 3l.75 2.25L8 6l-2.25.75L5 9l-.75-2.25L2 6l2.25-.75z"/><path d="M19 15l.75 2.25L22 18l-2.25.75L19 21l-.75-2.25L16 18l2.25-.75z"/></svg>,
  };
  return icons[name] || null;
};

// ─── STATUS BADGE ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status, size = "sm" }) => {
  const map = {
    Passed: { bg: "#00E87A18", color: T.green, border: "#00E87A33", dot: T.green },
    Failed: { bg: "#FF4D6A18", color: T.red, border: "#FF4D6A33", dot: T.red },
    Pending: { bg: "#FFB83018", color: T.yellow, border: "#FFB83033", dot: T.yellow },
    Skipped: { bg: "#6B7A9618", color: T.textMuted, border: "#6B7A9633", dot: T.textMuted },
    Critical: { bg: "#FF4D6A18", color: T.red, border: "#FF4D6A33" },
    High: { bg: "#FFB83018", color: T.yellow, border: "#FFB83033" },
    Medium: { bg: "#00D9FF18", color: T.accent, border: "#00D9FF33" },
    Low: { bg: "#6B7A9618", color: T.textMuted, border: "#6B7A9633" },
    Automated: { bg: "#A855F718", color: T.purple, border: "#A855F733" },
    Manual: { bg: "#00D9FF18", color: T.accent, border: "#00D9FF33" },
  };
  const s = map[status] || map.Pending;
  const pad = size === "sm" ? "2px 8px" : "4px 12px";
  const fs = size === "sm" ? 11 : 12;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: s.bg, color: s.color, border: `1px solid ${s.border}`,
      borderRadius: 20, padding: pad, fontSize: fs, fontWeight: 600,
      fontFamily: "'DM Mono', monospace", letterSpacing: "0.02em", whiteSpace: "nowrap"
    }}>
      {s.dot && <span style={{ width: 5, height: 5, borderRadius: "50%", background: s.dot, flexShrink: 0 }} />}
      {status}
    </span>
  );
};

// ─── METRIC CARD ──────────────────────────────────────────────────────────────
const MetricCard = ({ label, value, sub, color, icon }) => (
  <div style={{
    background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: "20px 24px",
    display: "flex", flexDirection: "column", gap: 8, position: "relative", overflow: "hidden"
  }}>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: color, opacity: 0.7 }} />
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
      <span style={{ fontSize: 12, color: T.textMuted, fontWeight: 500, letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</span>
      <span style={{ color, opacity: 0.7 }}><Icon name={icon} size={16} color={color} /></span>
    </div>
    <span style={{ fontSize: 32, fontWeight: 700, color: T.text, fontFamily: "'DM Mono', monospace", lineHeight: 1 }}>{value}</span>
    {sub && <span style={{ fontSize: 12, color: T.textMuted }}>{sub}</span>}
  </div>
);

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function QATestPlatform() {
  const [currentUser, setCurrentUser] = useState(null);
  const [loginRole, setLoginRole] = useState("qa");
  const [activeTab, setActiveTab] = useState("dashboard");
  const [testCases, setTestCases] = useState(INITIAL_TEST_CASES);
  const [selectedTC, setSelectedTC] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [showNewTC, setShowNewTC] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterTag, setFilterTag] = useState("All");
  const [searchQ, setSearchQ] = useState("");
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiProgress, setAiProgress] = useState(0);
  const [aiResults, setAiResults] = useState(null);
  const [uploadedDoc, setUploadedDoc] = useState(null);
  const [prdText, setPrdText] = useState("");
  const [notification, setNotification] = useState(null);
  const fileRef = useRef();

  const showNotif = (msg, type = "success") => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const login = () => {
    setCurrentUser(MOCK_USERS[loginRole]);
    setActiveTab("dashboard");
  };

  const logout = () => { setCurrentUser(null); setActiveTab("dashboard"); };

  const canEdit = currentUser?.role !== "Developer";
  const isManager = currentUser?.role === "Manager";

  // Stats
  const stats = {
    total: testCases.length,
    passed: testCases.filter(t => t.status === "Passed").length,
    failed: testCases.filter(t => t.status === "Failed").length,
    pending: testCases.filter(t => t.status === "Pending").length,
    passRate: testCases.length ? Math.round((testCases.filter(t => t.status === "Passed").length / testCases.length) * 100) : 0,
    automated: testCases.filter(t => t.automationStatus === "Automated").length,
  };

  // Filter test cases
  const filtered = testCases.filter(tc => {
    const matchStatus = filterStatus === "All" || tc.status === filterStatus;
    const matchTag = filterTag === "All" || tc.tags.includes(filterTag);
    const matchSearch = !searchQ || tc.title.toLowerCase().includes(searchQ.toLowerCase()) || tc.id.toLowerCase().includes(searchQ.toLowerCase());
    return matchStatus && matchTag && matchSearch;
  });

  const allTags = [...new Set(testCases.flatMap(t => t.tags))];

  // AI Generation
  const generateTestCases = async () => {
    if (!prdText.trim()) { showNotif("Please enter PRD content first", "error"); return; }
    setAiGenerating(true);
    setAiProgress(0);
    setAiResults(null);

    // Simulate progress
    const interval = setInterval(() => {
      setAiProgress(p => {
        if (p >= 85) { clearInterval(interval); return p; }
        return p + Math.random() * 12;
      });
    }, 400);

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `You are a senior QA engineer. Analyze the following PRD/user story and generate structured test cases in JSON format.

PRD Content:
${prdText}

Return ONLY a JSON array (no markdown, no explanation) with exactly 4 test cases. Each object must have:
- id: string like "TC-00X"
- title: string
- priority: "Critical"|"High"|"Medium"|"Low"
- tags: array of 2-3 strings
- steps: array of 3-5 action strings
- expected: string
- automationStatus: "Automated"|"Manual"
- requirement: string like "REQ-XXX-001"

Example format:
[{"id":"TC-006","title":"...","priority":"High","tags":["tag1"],"steps":["step1"],"expected":"...","automationStatus":"Manual","requirement":"REQ-XXX-001"}]`
          }]
        })
      });

      clearInterval(interval);
      setAiProgress(100);

      const data = await response.json();
      const raw = data.content?.map(c => c.text || "").join("") || "";
      const clean = raw.replace(/```json|```/g, "").trim();

      let generated;
      try { generated = JSON.parse(clean); } catch { generated = null; }

      if (generated && Array.isArray(generated)) {
        const withMeta = generated.map((tc, i) => ({
          ...tc,
          id: `TC-00${testCases.length + i + 1}`,
          status: "Pending", version: "v2.2", assignee: currentUser.name,
          createdAt: new Date().toISOString().split("T")[0],
          lastRun: "-", runHistory: []
        }));
        setAiResults(withMeta);
      } else {
        // Fallback
        setAiResults([{
          id: `TC-00${testCases.length + 1}`, title: "AI-Generated Test Case",
          priority: "High", tags: ["ai-generated"], steps: ["Step extracted from PRD"],
          expected: "Feature works as described", automationStatus: "Manual",
          requirement: "REQ-AI-001", status: "Pending", version: "v2.2",
          assignee: currentUser.name, createdAt: new Date().toISOString().split("T")[0],
          lastRun: "-", runHistory: []
        }]);
      }
    } catch (e) {
      clearInterval(interval);
      setAiProgress(0);
      showNotif("API error. Check your connection.", "error");
    } finally {
      setAiGenerating(false);
    }
  };

  const importAiResults = () => {
    if (!aiResults) return;
    setTestCases(prev => [...prev, ...aiResults]);
    setAiResults(null);
    setPrdText("");
    setUploadedDoc(null);
    setShowUpload(false);
    showNotif(`${aiResults.length} test cases imported successfully!`);
    setActiveTab("testcases");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedDoc(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setPrdText(ev.target.result);
    reader.readAsText(file);
  };

  const updateTCStatus = (id, status) => {
    setTestCases(prev => prev.map(tc => tc.id === id ? {
      ...tc, status, lastRun: new Date().toISOString().split("T")[0],
      runHistory: [{ date: new Date().toISOString().split("T")[0], status, duration: `${(Math.random() * 5 + 0.5).toFixed(1)}s` }, ...tc.runHistory]
    } : tc));
    showNotif(`Test case updated to ${status}`);
  };

  const deleteTC = (id) => {
    setTestCases(prev => prev.filter(tc => tc.id !== id));
    if (selectedTC?.id === id) setSelectedTC(null);
    showNotif("Test case deleted");
  };

  if (!currentUser) return <LoginScreen loginRole={loginRole} setLoginRole={setLoginRole} login={login} />;

  return (
    <div style={{ display: "flex", height: "100vh", background: T.bg, color: T.text, fontFamily: "'DM Sans', 'Segoe UI', sans-serif", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${T.border}; border-radius: 2px; }
        .nav-item { transition: all 0.15s ease; cursor: pointer; border-radius: 8px; }
        .nav-item:hover { background: ${T.card} !important; }
        .nav-item.active { background: ${T.accent}18 !important; }
        .tc-row { transition: background 0.1s; cursor: pointer; }
        .tc-row:hover { background: ${T.card} !important; }
        .btn { transition: all 0.15s ease; cursor: pointer; border: none; font-family: inherit; }
        .btn:hover { opacity: 0.85; transform: translateY(-1px); }
        .btn:active { transform: translateY(0); }
        textarea, input { font-family: inherit; }
        textarea:focus, input:focus { outline: none; }
        .tag-chip { display: inline-flex; align-items: center; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 500; background: ${T.accent}15; color: ${T.accent}; border: 1px solid ${T.accent}25; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes progress { from { width: 0% } }
        .fade-in { animation: fadeIn 0.3s ease forwards; }
        @keyframes pulse { 0%,100% { opacity: 1 } 50% { opacity: 0.5 } }
        .pulse { animation: pulse 1.5s ease infinite; }
      `}</style>

      {/* ── SIDEBAR ── */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} currentUser={currentUser} logout={logout} isManager={isManager} />

      {/* ── MAIN ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Header */}
        <div style={{ padding: "0 28px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${T.border}`, background: T.surface, flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <h1 style={{ fontSize: 16, fontWeight: 600, color: T.text }}>
              {activeTab === "dashboard" && "Dashboard"}
              {activeTab === "testcases" && "Test Cases"}
              {activeTab === "upload" && "AI Generation"}
              {activeTab === "matrix" && "Traceability Matrix"}
              {activeTab === "automation" && "Automation Tracking"}
              {activeTab === "export" && "Export"}
              {activeTab === "team" && "Team & Access"}
            </h1>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {canEdit && activeTab === "testcases" && (
              <button className="btn" onClick={() => setShowNewTC(true)} style={{ display: "flex", alignItems: "center", gap: 6, background: T.accent, color: T.bg, padding: "7px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600 }}>
                <Icon name="plus" size={14} color={T.bg} /> New Test Case
              </button>
            )}
            {canEdit && activeTab === "upload" && (
              <button className="btn" onClick={generateTestCases} disabled={aiGenerating || !prdText.trim()} style={{ display: "flex", alignItems: "center", gap: 6, background: aiGenerating ? T.border : T.accent, color: T.bg, padding: "7px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, opacity: (!prdText.trim() && !aiGenerating) ? 0.5 : 1 }}>
                <Icon name="sparkle" size={14} color={T.bg} /> {aiGenerating ? "Generating..." : "Generate with AI"}
              </button>
            )}
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: "auto", padding: 28 }}>
          {activeTab === "dashboard" && <DashboardView stats={stats} testCases={testCases} setActiveTab={setActiveTab} />}
          {activeTab === "testcases" && (
            <TestCasesView
              filtered={filtered} testCases={testCases} setTestCases={setTestCases}
              filterStatus={filterStatus} setFilterStatus={setFilterStatus}
              filterTag={filterTag} setFilterTag={setFilterTag}
              searchQ={searchQ} setSearchQ={setSearchQ}
              allTags={allTags} selectedTC={selectedTC} setSelectedTC={setSelectedTC}
              canEdit={canEdit} updateTCStatus={updateTCStatus} deleteTC={deleteTC}
              showNotif={showNotif}
            />
          )}
          {activeTab === "upload" && (
            <UploadView
              prdText={prdText} setPrdText={setPrdText}
              uploadedDoc={uploadedDoc} fileRef={fileRef}
              handleFileUpload={handleFileUpload}
              aiGenerating={aiGenerating} aiProgress={aiProgress}
              aiResults={aiResults} importAiResults={importAiResults}
              setAiResults={setAiResults}
            />
          )}
          {activeTab === "matrix" && <TraceabilityView testCases={testCases} />}
          {activeTab === "automation" && <AutomationView testCases={testCases} />}
          {activeTab === "export" && <ExportView testCases={testCases} showNotif={showNotif} />}
          {activeTab === "team" && <TeamView isManager={isManager} />}
        </div>
      </div>

      {/* ── MODALS ── */}
      {showNewTC && <NewTCModal onClose={() => setShowNewTC(false)} onSave={(tc) => { setTestCases(prev => [...prev, tc]); setShowNewTC(false); showNotif("Test case created!"); }} testCases={testCases} currentUser={currentUser} />}

      {/* ── NOTIFICATION ── */}
      {notification && (
        <div className="fade-in" style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 9999,
          background: notification.type === "error" ? "#FF4D6A18" : "#00E87A18",
          border: `1px solid ${notification.type === "error" ? T.red : T.green}44`,
          color: notification.type === "error" ? T.red : T.green,
          padding: "12px 20px", borderRadius: 10, fontSize: 13, fontWeight: 500,
          display: "flex", alignItems: "center", gap: 8, maxWidth: 320
        }}>
          <Icon name={notification.type === "error" ? "warning" : "check"} size={14} />
          {notification.msg}
        </div>
      )}
    </div>
  );
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function LoginScreen({ loginRole, setLoginRole, login }) {
  return (
    <div style={{ height: "100vh", background: T.bg, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Mono:wght@500&display=swap'); * { box-sizing: border-box; margin: 0; padding: 0; } .btn { transition: all 0.15s; cursor: pointer; } .btn:hover { opacity: 0.85; transform: translateY(-1px); }`}</style>
      <div style={{ width: 420, animation: "fadeIn 0.5s ease" }}>
        <style>{`@keyframes fadeIn { from { opacity:0; transform: translateY(20px) } to { opacity:1; transform: translateY(0) } }`}</style>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ width: 44, height: 44, background: `linear-gradient(135deg, ${T.accent}, #0066FF)`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="test" size={22} color="#fff" />
            </div>
            <span style={{ fontSize: 24, fontWeight: 700, color: T.text }}>QA<span style={{ color: T.accent }}>Forge</span></span>
          </div>
          <p style={{ color: T.textMuted, fontSize: 14 }}>AI-Powered Test Management Platform</p>
        </div>

        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 32 }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, marginBottom: 6, color: T.text }}>Sign in</h2>
          <p style={{ fontSize: 13, color: T.textMuted, marginBottom: 24 }}>Select your role to continue</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
            {Object.entries(MOCK_USERS).map(([key, u]) => (
              <div key={key} onClick={() => setLoginRole(key)} style={{
                padding: "14px 16px", borderRadius: 10, cursor: "pointer",
                border: `1px solid ${loginRole === key ? T.accent : T.border}`,
                background: loginRole === key ? `${T.accent}10` : T.surface,
                transition: "all 0.15s", display: "flex", alignItems: "center", gap: 12
              }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: loginRole === key ? T.accent : T.borderLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: loginRole === key ? T.bg : T.text, fontFamily: "'DM Mono', monospace" }}>{u.avatar}</div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{u.name}</div>
                  <div style={{ fontSize: 12, color: T.textMuted }}>{u.role} · {u.email}</div>
                </div>
                {loginRole === key && <div style={{ marginLeft: "auto", color: T.accent }}><Icon name="check" size={16} color={T.accent} /></div>}
              </div>
            ))}
          </div>

          <button className="btn" onClick={login} style={{ width: "100%", background: T.accent, color: T.bg, padding: "13px", borderRadius: 10, fontSize: 15, fontWeight: 700, border: "none", cursor: "pointer" }}>
            Continue as {MOCK_USERS[loginRole]?.role}
          </button>
        </div>

        <p style={{ textAlign: "center", marginTop: 20, fontSize: 12, color: T.textDim }}>Demo environment · No real credentials required</p>
      </div>
    </div>
  );
}

// ─── SIDEBAR ──────────────────────────────────────────────────────────────────
function Sidebar({ activeTab, setActiveTab, currentUser, logout, isManager }) {
  const nav = [
    { id: "dashboard", icon: "dashboard", label: "Dashboard" },
    { id: "testcases", icon: "test", label: "Test Cases" },
    { id: "upload", icon: "ai", label: "AI Generate" },
    { id: "matrix", icon: "matrix", label: "Traceability" },
    { id: "automation", icon: "automation", label: "Automation" },
    { id: "export", icon: "export", label: "Export" },
    ...(isManager ? [{ id: "team", icon: "users", label: "Team" }] : []),
  ];

  return (
    <div style={{ width: 220, background: T.surface, borderRight: `1px solid ${T.border}`, display: "flex", flexDirection: "column", flexShrink: 0 }}>
      {/* Logo */}
      <div style={{ padding: "18px 20px", borderBottom: `1px solid ${T.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, background: `linear-gradient(135deg, ${T.accent}, #0066FF)`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="test" size={16} color="#fff" />
          </div>
          <span style={{ fontSize: 16, fontWeight: 700, color: T.text }}>QA<span style={{ color: T.accent }}>Forge</span></span>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: "12px 10px", display: "flex", flexDirection: "column", gap: 2 }}>
        {nav.map(item => (
          <div key={item.id} className={`nav-item ${activeTab === item.id ? "active" : ""}`}
            onClick={() => setActiveTab(item.id)}
            style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", color: activeTab === item.id ? T.accent : T.textMuted }}>
            <Icon name={item.icon} size={16} color={activeTab === item.id ? T.accent : T.textMuted} />
            <span style={{ fontSize: 13, fontWeight: activeTab === item.id ? 600 : 400 }}>{item.label}</span>
            {item.id === "upload" && (
              <span style={{ marginLeft: "auto", background: T.accent, color: T.bg, fontSize: 9, fontWeight: 700, padding: "1px 5px", borderRadius: 4 }}>AI</span>
            )}
          </div>
        ))}
      </nav>

      {/* User */}
      <div style={{ padding: "12px 10px", borderTop: `1px solid ${T.border}` }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px" }}>
          <div style={{ width: 30, height: 30, borderRadius: 8, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: T.bg, fontFamily: "'DM Mono', monospace", flexShrink: 0 }}>{currentUser.avatar}</div>
          <div style={{ overflow: "hidden" }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{currentUser.name}</div>
            <div style={{ fontSize: 11, color: T.textMuted }}>{currentUser.role}</div>
          </div>
          <button className="btn" onClick={logout} style={{ marginLeft: "auto", background: "transparent", border: "none", color: T.textMuted, padding: 4, display: "flex", flexShrink: 0 }}>
            <Icon name="logout" size={14} color={T.textMuted} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── DASHBOARD ────────────────────────────────────────────────────────────────
function DashboardView({ stats, testCases, setActiveTab }) {
  const recentFailed = testCases.filter(t => t.status === "Failed");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
        <MetricCard label="Total Tests" value={stats.total} sub="across all versions" color={T.accent} icon="test" />
        <MetricCard label="Pass Rate" value={`${stats.passRate}%`} sub={`${stats.passed} passed`} color={T.green} icon="check" />
        <MetricCard label="Failed" value={stats.failed} sub="needs attention" color={T.red} icon="warning" />
        <MetricCard label="Automated" value={stats.automated} sub={`${Math.round((stats.automated / stats.total) * 100)}% coverage`} color={T.purple} icon="automation" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
        {/* Status Breakdown */}
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 20 }}>Status Overview</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { label: "Passed", value: stats.passed, color: T.green },
              { label: "Failed", value: stats.failed, color: T.red },
              { label: "Pending", value: stats.pending, color: T.yellow },
              { label: "Skipped", value: testCases.filter(t => t.status === "Skipped").length, color: T.textMuted },
            ].map(s => (
              <div key={s.label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 12, color: T.textMuted }}>{s.label}</span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: s.color, fontFamily: "'DM Mono', monospace" }}>{s.value}</span>
                </div>
                <div style={{ height: 4, background: T.border, borderRadius: 2, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${stats.total ? (s.value / stats.total) * 100 : 0}%`, background: s.color, borderRadius: 2, transition: "width 0.6s ease" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Failed Tests */}
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h3 style={{ fontSize: 14, fontWeight: 600, color: T.text }}>⚠ Failing Tests</h3>
            <button className="btn" onClick={() => setActiveTab("testcases")} style={{ fontSize: 12, color: T.accent, background: "transparent", border: "none" }}>View all →</button>
          </div>
          {recentFailed.length === 0
            ? <div style={{ textAlign: "center", color: T.textMuted, fontSize: 13, padding: 20 }}>All tests passing ✓</div>
            : recentFailed.map(tc => (
              <div key={tc.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: `1px solid ${T.border}` }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: T.textMuted }}>{tc.id}</span>
                <span style={{ fontSize: 13, color: T.text, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{tc.title}</span>
                <StatusBadge status={tc.priority} />
              </div>
            ))
          }
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
        {[
          { icon: "ai", label: "Generate Tests with AI", sub: "Upload PRD → Auto-generate", color: T.accent, tab: "upload" },
          { icon: "export", label: "Export to Jira / TestRail", sub: "One-click integration", color: T.purple, tab: "export" },
          { icon: "matrix", label: "Traceability Matrix", sub: "Req ↔ Test coverage map", color: T.yellow, tab: "matrix" },
        ].map(a => (
          <div key={a.tab} onClick={() => setActiveTab(a.tab)} style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 20, cursor: "pointer", transition: "border-color 0.15s" }}
            onMouseEnter={e => e.currentTarget.style.borderColor = a.color}
            onMouseLeave={e => e.currentTarget.style.borderColor = T.border}>
            <div style={{ width: 36, height: 36, background: `${a.color}18`, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
              <Icon name={a.icon} size={18} color={a.color} />
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 4 }}>{a.label}</div>
            <div style={{ fontSize: 12, color: T.textMuted }}>{a.sub}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── TEST CASES VIEW ──────────────────────────────────────────────────────────
function TestCasesView({ filtered, filterStatus, setFilterStatus, filterTag, setFilterTag, searchQ, setSearchQ, allTags, selectedTC, setSelectedTC, canEdit, updateTCStatus, deleteTC, showNotif }) {
  return (
    <div style={{ display: "flex", gap: 20, height: "100%" }}>
      {/* List */}
      <div style={{ flex: selectedTC ? "0 0 55%" : 1, display: "flex", flexDirection: "column", gap: 16, minWidth: 0 }}>
        {/* Filters */}
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 200, position: "relative" }}>
            <Icon name="filter" size={13} color={T.textMuted} />
            <input value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search tests..."
              style={{ width: "100%", background: T.card, border: `1px solid ${T.border}`, borderRadius: 8, padding: "8px 12px", fontSize: 13, color: T.text, paddingLeft: 32 }} />
            <div style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)" }}><Icon name="filter" size={13} color={T.textMuted} /></div>
          </div>
          {["All", "Passed", "Failed", "Pending", "Skipped"].map(s => (
            <button key={s} className="btn" onClick={() => setFilterStatus(s)} style={{ padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 500, background: filterStatus === s ? T.accent : T.card, color: filterStatus === s ? T.bg : T.textMuted, border: `1px solid ${filterStatus === s ? T.accent : T.border}` }}>{s}</button>
          ))}
          <select value={filterTag} onChange={e => setFilterTag(e.target.value)} style={{ background: T.card, border: `1px solid ${T.border}`, color: T.textMuted, borderRadius: 8, padding: "7px 12px", fontSize: 12 }}>
            <option value="All">All Tags</option>
            {allTags.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Table */}
        <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "90px 1fr 90px 80px 90px 90px", gap: 0, padding: "10px 16px", borderBottom: `1px solid ${T.border}`, background: T.surface }}>
            {["ID", "Title", "Status", "Priority", "Automation", "Version"].map(h => (
              <span key={h} style={{ fontSize: 11, fontWeight: 600, color: T.textMuted, letterSpacing: "0.06em", textTransform: "uppercase" }}>{h}</span>
            ))}
          </div>
          <div style={{ overflow: "auto", maxHeight: "calc(100vh - 280px)" }}>
            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: 40, color: T.textMuted, fontSize: 13 }}>No test cases match your filters</div>
            ) : filtered.map(tc => (
              <div key={tc.id} className="tc-row" onClick={() => setSelectedTC(tc)}
                style={{ display: "grid", gridTemplateColumns: "90px 1fr 90px 80px 90px 90px", gap: 0, padding: "12px 16px", borderBottom: `1px solid ${T.border}`, background: selectedTC?.id === tc.id ? `${T.accent}08` : "transparent", alignItems: "center" }}>
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: T.textMuted }}>{tc.id}</span>
                <span style={{ fontSize: 13, color: T.text, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", paddingRight: 12 }}>{tc.title}</span>
                <StatusBadge status={tc.status} />
                <StatusBadge status={tc.priority} />
                <StatusBadge status={tc.automationStatus} />
                <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: T.textMuted }}>{tc.version}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Panel */}
      {selectedTC && (
        <div className="fade-in" style={{ flex: "0 0 42%", background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, overflow: "auto", padding: 24, display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: T.textMuted, marginBottom: 4 }}>{selectedTC.id} · {selectedTC.version}</div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: T.text, lineHeight: 1.3 }}>{selectedTC.title}</h2>
            </div>
            <button className="btn" onClick={() => setSelectedTC(null)} style={{ background: "transparent", border: "none", color: T.textMuted, padding: 4 }}>
              <Icon name="x" size={16} color={T.textMuted} />
            </button>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <StatusBadge status={selectedTC.status} size="md" />
            <StatusBadge status={selectedTC.priority} size="md" />
            <StatusBadge status={selectedTC.automationStatus} size="md" />
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {selectedTC.tags.map(t => <span key={t} className="tag-chip"><Icon name="tag" size={10} color={T.accent} /> &nbsp;{t}</span>)}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {[["Assignee", selectedTC.assignee], ["Requirement", selectedTC.requirement], ["Created", selectedTC.createdAt], ["Last Run", selectedTC.lastRun]].map(([k, v]) => (
              <div key={k} style={{ background: T.surface, borderRadius: 8, padding: "10px 12px" }}>
                <div style={{ fontSize: 11, color: T.textMuted, marginBottom: 3 }}>{k}</div>
                <div style={{ fontSize: 13, color: T.text, fontWeight: 500 }}>{v}</div>
              </div>
            ))}
          </div>

          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 }}>Test Steps</div>
            {selectedTC.steps.map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8, alignItems: "flex-start" }}>
                <span style={{ width: 20, height: 20, background: T.accent, color: T.bg, borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, flexShrink: 0, fontFamily: "'DM Mono', monospace" }}>{i + 1}</span>
                <span style={{ fontSize: 13, color: T.text, lineHeight: 1.5 }}>{step}</span>
              </div>
            ))}
          </div>

          <div style={{ background: `${T.green}10`, border: `1px solid ${T.green}30`, borderRadius: 8, padding: "12px 14px" }}>
            <div style={{ fontSize: 11, color: T.green, fontWeight: 600, marginBottom: 4 }}>Expected Result</div>
            <div style={{ fontSize: 13, color: T.text }}>{selectedTC.expected}</div>
          </div>

          {/* Run History */}
          {selectedTC.runHistory.length > 0 && (
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: T.textMuted, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 10 }}>Run History</div>
              {selectedTC.runHistory.slice(0, 3).map((r, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: `1px solid ${T.border}` }}>
                  <span style={{ fontSize: 12, color: T.textMuted }}>{r.date}</span>
                  <StatusBadge status={r.status} />
                  <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: T.textMuted }}>{r.duration}</span>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          {canEdit && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {["Passed", "Failed", "Pending"].map(s => (
                <button key={s} className="btn" onClick={() => updateTCStatus(selectedTC.id, s)} style={{
                  flex: 1, padding: "8px", borderRadius: 8, fontSize: 12, fontWeight: 600, border: "none",
                  background: s === "Passed" ? `${T.green}20` : s === "Failed" ? `${T.red}20` : `${T.yellow}20`,
                  color: s === "Passed" ? T.green : s === "Failed" ? T.red : T.yellow
                }}>Mark {s}</button>
              ))}
              <button className="btn" onClick={() => deleteTC(selectedTC.id)} style={{ padding: "8px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, border: "none", background: `${T.red}15`, color: T.red }}>
                <Icon name="trash" size={13} color={T.red} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── UPLOAD / AI GENERATE ─────────────────────────────────────────────────────
function UploadView({ prdText, setPrdText, uploadedDoc, fileRef, handleFileUpload, aiGenerating, aiProgress, aiResults, importAiResults, setAiResults }) {
  return (
    <div style={{ display: "flex", gap: 24 }}>
      {/* Input */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={{ background: T.card, border: `1px dashed ${T.border}`, borderRadius: 12, padding: 24, cursor: "pointer" }}
          onClick={() => fileRef.current?.click()}>
          <input ref={fileRef} type="file" accept=".txt,.md,.pdf" onChange={handleFileUpload} style={{ display: "none" }} />
          <div style={{ textAlign: "center" }}>
            <div style={{ width: 48, height: 48, background: `${T.accent}15`, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 12px" }}>
              <Icon name="upload" size={22} color={T.accent} />
            </div>
            {uploadedDoc
              ? <><div style={{ fontSize: 14, fontWeight: 600, color: T.green }}>✓ {uploadedDoc}</div><div style={{ fontSize: 12, color: T.textMuted, marginTop: 4 }}>Click to replace</div></>
              : <><div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>Upload PRD / User Story</div><div style={{ fontSize: 12, color: T.textMuted, marginTop: 4 }}>.txt, .md, or .pdf files</div></>
            }
          </div>
        </div>

        <div>
          <div style={{ fontSize: 12, color: T.textMuted, marginBottom: 8, fontWeight: 500 }}>Or paste PRD content directly</div>
          <textarea value={prdText} onChange={e => setPrdText(e.target.value)} placeholder="Paste your product requirement document or user story here...&#10;&#10;Example:&#10;Feature: User Authentication&#10;As a user, I want to login with email and password&#10;So that I can access my account securely&#10;&#10;Acceptance Criteria:&#10;- Valid credentials should log the user in&#10;- Invalid credentials should show error&#10;- Account lockout after 5 failed attempts"
            style={{ width: "100%", minHeight: 280, background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 16, fontSize: 13, color: T.text, resize: "vertical", lineHeight: 1.6 }} />
        </div>

        {/* AI Progress */}
        {aiGenerating && (
          <div className="fade-in" style={{ background: `${T.accent}10`, border: `1px solid ${T.accent}30`, borderRadius: 12, padding: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
              <div className="pulse" style={{ width: 8, height: 8, borderRadius: "50%", background: T.accent }} />
              <span style={{ fontSize: 13, color: T.accent, fontWeight: 600 }}>AI analyzing requirements...</span>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: T.accent, marginLeft: "auto" }}>{Math.round(aiProgress)}%</span>
            </div>
            <div style={{ height: 4, background: T.border, borderRadius: 2, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${aiProgress}%`, background: `linear-gradient(90deg, ${T.accent}, ${T.purple})`, borderRadius: 2, transition: "width 0.4s ease" }} />
            </div>
            <div style={{ display: "flex", gap: 16, marginTop: 12 }}>
              {["Parsing PRD", "Identifying flows", "Generating cases", "Structuring output"].map((step, i) => (
                <span key={i} style={{ fontSize: 11, color: aiProgress > (i + 1) * 22 ? T.accent : T.textMuted, display: "flex", alignItems: "center", gap: 4 }}>
                  {aiProgress > (i + 1) * 22 ? "✓" : "·"} {step}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Results */}
      <div style={{ width: 380, flexShrink: 0 }}>
        {aiResults ? (
          <div className="fade-in" style={{ background: T.card, border: `1px solid ${T.green}40`, borderRadius: 12, padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: T.green }}>✓ {aiResults.length} Tests Generated</div>
                <div style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>Review and import below</div>
              </div>
              <button className="btn" onClick={() => setAiResults(null)} style={{ background: "transparent", border: "none", color: T.textMuted, padding: 4 }}>
                <Icon name="x" size={16} color={T.textMuted} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16, maxHeight: 380, overflow: "auto" }}>
              {aiResults.map((tc, i) => (
                <div key={i} style={{ background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "12px 14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                    <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, color: T.textMuted }}>{tc.id}</span>
                    <StatusBadge status={tc.priority} />
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: T.text, marginBottom: 8, lineHeight: 1.3 }}>{tc.title}</div>
                  <div style={{ fontSize: 12, color: T.textMuted }}>{tc.steps.length} steps · {tc.automationStatus}</div>
                  <div style={{ display: "flex", gap: 4, marginTop: 8, flexWrap: "wrap" }}>
                    {tc.tags.map(t => <span key={t} className="tag-chip">{t}</span>)}
                  </div>
                </div>
              ))}
            </div>

            <button className="btn" onClick={importAiResults} style={{ width: "100%", background: T.green, color: T.bg, padding: "12px", borderRadius: 10, fontSize: 14, fontWeight: 700, border: "none" }}>
              Import {aiResults.length} Test Cases →
            </button>
          </div>
        ) : (
          <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 24 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: T.text, marginBottom: 16 }}>How it works</div>
            {[
              { icon: "upload", step: "1", text: "Upload your PRD, user story, or acceptance criteria" },
              { icon: "sparkle", step: "2", text: "AI extracts test scenarios from your requirements" },
              { icon: "test", step: "3", text: "Review and edit the generated structured test cases" },
              { icon: "check", step: "4", text: "Import to your test suite with one click" },
            ].map(s => (
              <div key={s.step} style={{ display: "flex", gap: 12, marginBottom: 16, alignItems: "flex-start" }}>
                <div style={{ width: 28, height: 28, background: `${T.accent}20`, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon name={s.icon} size={13} color={T.accent} />
                </div>
                <div style={{ fontSize: 13, color: T.textMuted, lineHeight: 1.5, paddingTop: 4 }}>{s.text}</div>
              </div>
            ))}
            <div style={{ marginTop: 16, background: `${T.yellow}10`, border: `1px solid ${T.yellow}30`, borderRadius: 8, padding: "10px 12px", fontSize: 12, color: T.yellow }}>
              💡 Tip: More detailed PRDs produce higher quality test cases
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── TRACEABILITY MATRIX ──────────────────────────────────────────────────────
function TraceabilityView({ testCases }) {
  const reqs = [...new Set(testCases.map(t => t.requirement))].sort();
  const statusColor = { Passed: T.green, Failed: T.red, Pending: T.yellow, Skipped: T.textMuted };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>Requirements Traceability Matrix</div>
            <div style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>Mapping requirements to test coverage</div>
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            {[["Covered", T.green], ["Failing", T.red], ["Gap", T.textMuted]].map(([l, c]) => (
              <span key={l} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: c }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: c }} />{l}
              </span>
            ))}
          </div>
        </div>

        <div style={{ overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: T.surface }}>
                <th style={{ padding: "12px 20px", textAlign: "left", fontSize: 11, fontWeight: 600, color: T.textMuted, letterSpacing: "0.06em", textTransform: "uppercase", borderBottom: `1px solid ${T.border}` }}>Requirement ID</th>
                <th style={{ padding: "12px 20px", textAlign: "left", fontSize: 11, fontWeight: 600, color: T.textMuted, letterSpacing: "0.06em", textTransform: "uppercase", borderBottom: `1px solid ${T.border}` }}>Test Cases</th>
                <th style={{ padding: "12px 20px", textAlign: "left", fontSize: 11, fontWeight: 600, color: T.textMuted, letterSpacing: "0.06em", textTransform: "uppercase", borderBottom: `1px solid ${T.border}` }}>Coverage</th>
                <th style={{ padding: "12px 20px", textAlign: "left", fontSize: 11, fontWeight: 600, color: T.textMuted, letterSpacing: "0.06em", textTransform: "uppercase", borderBottom: `1px solid ${T.border}` }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {reqs.map(req => {
                const linked = testCases.filter(t => t.requirement === req);
                const hasFail = linked.some(t => t.status === "Failed");
                const allPass = linked.every(t => t.status === "Passed");
                const coverage = linked.length > 0 ? (allPass ? "Covered" : hasFail ? "Failing" : "Partial") : "No Coverage";
                const covColor = coverage === "Covered" ? T.green : coverage === "Failing" ? T.red : coverage === "Partial" ? T.yellow : T.textMuted;
                return (
                  <tr key={req} style={{ borderBottom: `1px solid ${T.border}` }}>
                    <td style={{ padding: "14px 20px" }}>
                      <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: T.accent, background: `${T.accent}15`, padding: "3px 8px", borderRadius: 4 }}>{req}</span>
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                        {linked.map(tc => (
                          <span key={tc.id} style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: statusColor[tc.status] || T.textMuted, background: `${statusColor[tc.status] || T.textMuted}15`, padding: "2px 7px", borderRadius: 4 }}>{tc.id}</span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: covColor }}>{coverage}</span>
                    </td>
                    <td style={{ padding: "14px 20px" }}>
                      <div style={{ display: "flex", gap: 6 }}>
                        {linked.map(tc => <StatusBadge key={tc.id} status={tc.status} />)}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── AUTOMATION TRACKING ──────────────────────────────────────────────────────
function AutomationView({ testCases }) {
  const automated = testCases.filter(t => t.automationStatus === "Automated");
  const manual = testCases.filter(t => t.automationStatus === "Manual");

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
        <MetricCard label="Automated" value={automated.length} sub={`${Math.round((automated.length / testCases.length) * 100)}% coverage`} color={T.purple} icon="automation" />
        <MetricCard label="Manual" value={manual.length} sub="Needs automation" color={T.yellow} icon="test" />
        <MetricCard label="CI Runs Today" value="12" sub="Last: 4 mins ago" color={T.green} icon="play" />
      </div>

      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>Automation Test Results</div>
          <div style={{ fontSize: 12, color: T.textMuted, marginTop: 2 }}>GitHub Actions CI Integration</div>
        </div>
        <div>
          {automated.map(tc => (
            <div key={tc.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 20px", borderBottom: `1px solid ${T.border}` }}>
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 11, color: T.textMuted, width: 60 }}>{tc.id}</span>
              <span style={{ flex: 1, fontSize: 13, color: T.text }}>{tc.title}</span>
              <StatusBadge status={tc.status} />
              <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: T.textMuted, width: 60, textAlign: "right" }}>
                {tc.runHistory[0]?.duration || "-"}
              </span>
              <span style={{ fontSize: 12, color: T.textMuted, width: 80, textAlign: "right" }}>{tc.lastRun}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CI Pipeline Simulation */}
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 700, color: T.text, marginBottom: 16 }}>Recent CI Pipeline Runs</div>
        {[
          { id: "#142", branch: "main", time: "4 min ago", passed: 8, failed: 1, duration: "2m 34s", status: "Failed" },
          { id: "#141", branch: "feature/checkout", time: "1h ago", passed: 9, failed: 0, duration: "2m 12s", status: "Passed" },
          { id: "#140", branch: "main", time: "3h ago", passed: 9, failed: 0, duration: "2m 18s", status: "Passed" },
        ].map(run => (
          <div key={run.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "12px 0", borderBottom: `1px solid ${T.border}` }}>
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: T.accent }}>{run.id}</span>
            <span style={{ fontSize: 12, color: T.textMuted, background: T.surface, padding: "3px 8px", borderRadius: 4 }}>{run.branch}</span>
            <span style={{ fontSize: 12, color: T.textMuted, flex: 1 }}>{run.time}</span>
            <span style={{ fontSize: 12, color: T.green }}>{run.passed} passed</span>
            {run.failed > 0 && <span style={{ fontSize: 12, color: T.red }}>{run.failed} failed</span>}
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 12, color: T.textMuted }}>{run.duration}</span>
            <StatusBadge status={run.status} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── EXPORT ───────────────────────────────────────────────────────────────────
function ExportView({ testCases, showNotif }) {
  const [format, setFormat] = useState("jira");

  const handleExport = () => {
    if (format === "csv") {
      const header = "ID,Title,Status,Priority,Tags,Requirement,Version,Assignee\n";
      const rows = testCases.map(tc => `${tc.id},"${tc.title}",${tc.status},${tc.priority},"${tc.tags.join(";")}",${tc.requirement},${tc.version},"${tc.assignee}"`).join("\n");
      const blob = new Blob([header + rows], { type: "text/csv" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "test_cases.csv"; a.click();
      showNotif("CSV exported successfully!");
    } else {
      showNotif(`${format === "jira" ? "Jira" : "TestRail"} export payload ready (API integration required in production)`);
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
      {[
        { id: "jira", name: "Jira", desc: "Export as Jira issues with test steps as checklists", color: "#0052CC", icon: "link" },
        { id: "testrail", name: "TestRail", desc: "Export to TestRail with full test case structure", color: "#65C179", icon: "test" },
        { id: "csv", name: "CSV / Excel", desc: "Download as CSV for spreadsheet tools", color: T.yellow, icon: "export" },
        { id: "json", name: "JSON", desc: "Raw JSON format for custom integrations", color: T.purple, icon: "automation" },
      ].map(f => (
        <div key={f.id} onClick={() => setFormat(f.id)} style={{ background: T.card, border: `2px solid ${format === f.id ? f.color : T.border}`, borderRadius: 12, padding: 24, cursor: "pointer", transition: "border-color 0.15s" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
            <div style={{ width: 40, height: 40, background: `${f.color}20`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name={f.icon} size={18} color={f.color} />
            </div>
            {format === f.id && <div style={{ width: 20, height: 20, background: f.color, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="check" size={12} color="#fff" />
            </div>}
          </div>
          <div style={{ fontSize: 15, fontWeight: 700, color: T.text, marginBottom: 6 }}>{f.name}</div>
          <div style={{ fontSize: 13, color: T.textMuted, lineHeight: 1.5 }}>{f.desc}</div>
        </div>
      ))}

      <div style={{ gridColumn: "1 / -1", background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, padding: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>Export {testCases.length} Test Cases</div>
            <div style={{ fontSize: 12, color: T.textMuted, marginTop: 4 }}>Selected format: <span style={{ color: T.accent, fontWeight: 600 }}>{format.toUpperCase()}</span></div>
          </div>
          <button className="btn" onClick={handleExport} style={{ display: "flex", alignItems: "center", gap: 8, background: T.accent, color: T.bg, padding: "12px 24px", borderRadius: 10, fontSize: 14, fontWeight: 700, border: "none" }}>
            <Icon name="export" size={16} color={T.bg} /> Export Now
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── TEAM ─────────────────────────────────────────────────────────────────────
function TeamView({ isManager }) {
  const perms = {
    QA: { create: true, edit: true, delete: true, viewAll: true, export: true, manage: false },
    Developer: { create: false, edit: false, delete: false, viewAll: true, export: false, manage: false },
    Manager: { create: true, edit: true, delete: true, viewAll: true, export: true, manage: true },
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Members */}
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>Team Members</div>
          {isManager && <button className="btn" style={{ display: "flex", alignItems: "center", gap: 6, background: T.accent, color: T.bg, padding: "7px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, border: "none" }}><Icon name="plus" size={12} color={T.bg} /> Invite Member</button>}
        </div>
        {Object.values(MOCK_USERS).map(u => (
          <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", borderBottom: `1px solid ${T.border}` }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: T.accent, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: T.bg, fontFamily: "'DM Mono', monospace" }}>{u.avatar}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: T.text }}>{u.name}</div>
              <div style={{ fontSize: 12, color: T.textMuted }}>{u.email}</div>
            </div>
            <span style={{ background: u.role === "QA" ? `${T.accent}20` : u.role === "Manager" ? `${T.purple}20` : `${T.green}20`, color: u.role === "QA" ? T.accent : u.role === "Manager" ? T.purple : T.green, padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>{u.role}</span>
          </div>
        ))}
      </div>

      {/* Permissions */}
      <div style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 12, overflow: "hidden" }}>
        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: T.text }}>Role Permissions</div>
        </div>
        <div style={{ overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: T.surface }}>
                <th style={{ padding: "12px 20px", textAlign: "left", fontSize: 11, fontWeight: 600, color: T.textMuted, letterSpacing: "0.06em", textTransform: "uppercase", borderBottom: `1px solid ${T.border}` }}>Permission</th>
                {["QA", "Developer", "Manager"].map(r => <th key={r} style={{ padding: "12px 20px", textAlign: "center", fontSize: 11, fontWeight: 600, color: T.textMuted, letterSpacing: "0.06em", textTransform: "uppercase", borderBottom: `1px solid ${T.border}` }}>{r}</th>)}
              </tr>
            </thead>
            <tbody>
              {[["create", "Create Test Cases"], ["edit", "Edit Test Cases"], ["delete", "Delete Test Cases"], ["viewAll", "View All Tests"], ["export", "Export Data"], ["manage", "Manage Team"]].map(([key, label]) => (
                <tr key={key} style={{ borderBottom: `1px solid ${T.border}` }}>
                  <td style={{ padding: "14px 20px", fontSize: 13, color: T.text }}>{label}</td>
                  {["QA", "Developer", "Manager"].map(role => (
                    <td key={role} style={{ padding: "14px 20px", textAlign: "center" }}>
                      {perms[role][key]
                        ? <span style={{ color: T.green, display: "inline-flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, background: `${T.green}20`, borderRadius: "50%" }}><Icon name="check" size={12} color={T.green} /></span>
                        : <span style={{ color: T.red, display: "inline-flex", alignItems: "center", justifyContent: "center", width: 22, height: 22, background: `${T.red}20`, borderRadius: "50%" }}><Icon name="x" size={12} color={T.red} /></span>
                      }
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ─── NEW TC MODAL ─────────────────────────────────────────────────────────────
function NewTCModal({ onClose, onSave, testCases, currentUser }) {
  const [form, setForm] = useState({ title: "", priority: "High", tags: "", steps: "", expected: "", automationStatus: "Manual", requirement: "" });

  const save = () => {
    if (!form.title.trim()) return;
    onSave({
      id: `TC-${String(testCases.length + 1).padStart(3, "0")}`,
      title: form.title, priority: form.priority,
      tags: form.tags.split(",").map(t => t.trim()).filter(Boolean),
      steps: form.steps.split("\n").filter(Boolean),
      expected: form.expected, automationStatus: form.automationStatus,
      requirement: form.requirement || `REQ-NEW-${String(testCases.length + 1).padStart(3, "0")}`,
      status: "Pending", version: "v2.2", assignee: currentUser.name,
      createdAt: new Date().toISOString().split("T")[0], lastRun: "-", runHistory: []
    });
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "#00000080", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="fade-in" style={{ background: T.card, border: `1px solid ${T.border}`, borderRadius: 16, padding: 32, width: 560, maxHeight: "85vh", overflow: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: T.text }}>New Test Case</h2>
          <button className="btn" onClick={onClose} style={{ background: "transparent", border: "none", color: T.textMuted, padding: 4 }}><Icon name="x" size={18} color={T.textMuted} /></button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[["Title", "title", "text", "e.g. User can reset password via email"], ["Requirement ID", "requirement", "text", "e.g. REQ-AUTH-003"], ["Tags", "tags", "text", "Comma-separated: auth, smoke, regression"]].map(([label, key, type, ph]) => (
            <div key={key}>
              <label style={{ fontSize: 12, fontWeight: 500, color: T.textMuted, display: "block", marginBottom: 6 }}>{label}</label>
              <input value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} placeholder={ph}
                style={{ width: "100%", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px 12px", fontSize: 13, color: T.text }} />
            </div>
          ))}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: T.textMuted, display: "block", marginBottom: 6 }}>Priority</label>
              <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))} style={{ width: "100%", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px 12px", fontSize: 13, color: T.text }}>
                {["Critical", "High", "Medium", "Low"].map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 12, fontWeight: 500, color: T.textMuted, display: "block", marginBottom: 6 }}>Automation</label>
              <select value={form.automationStatus} onChange={e => setForm(p => ({ ...p, automationStatus: e.target.value }))} style={{ width: "100%", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px 12px", fontSize: 13, color: T.text }}>
                {["Manual", "Automated"].map(v => <option key={v}>{v}</option>)}
              </select>
            </div>
          </div>

          {[["Test Steps (one per line)", "steps", "Enter each step on a new line..."], ["Expected Result", "expected", "What should happen when the test passes?"]].map(([label, key, ph]) => (
            <div key={key}>
              <label style={{ fontSize: 12, fontWeight: 500, color: T.textMuted, display: "block", marginBottom: 6 }}>{label}</label>
              <textarea value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))} placeholder={ph}
                style={{ width: "100%", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8, padding: "10px 12px", fontSize: 13, color: T.text, minHeight: key === "steps" ? 100 : 64, resize: "vertical" }} />
            </div>
          ))}
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 24 }}>
          <button className="btn" onClick={onClose} style={{ flex: 1, background: T.surface, border: `1px solid ${T.border}`, color: T.textMuted, padding: "12px", borderRadius: 10, fontSize: 14, fontWeight: 600 }}>Cancel</button>
          <button className="btn" onClick={save} disabled={!form.title.trim()} style={{ flex: 2, background: T.accent, color: T.bg, padding: "12px", borderRadius: 10, fontSize: 14, fontWeight: 700, border: "none", opacity: form.title.trim() ? 1 : 0.5 }}>Create Test Case</button>
        </div>
      </div>
    </div>
  );
}
