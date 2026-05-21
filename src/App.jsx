import React, { useState, useEffect, useMemo } from 'react';
import { 
  Home, Package, Lock, BarChart3, Settings, Plus, X, Copy, Download, 
  Trash2, Edit3, ChevronLeft, AlertCircle, CheckCircle2, Clock, Zap, 
  Target, Wand2, FileText, Trophy, Search, DollarSign, Activity, 
  LayoutGrid, List, ArrowUpDown, ExternalLink, Database, Flame, 
  TrendingUp, TrendingDown, AlertTriangle, Lightbulb, Repeat, Cloud, 
  CloudOff, User, Check, Bell, ToggleLeft, ToggleRight
} from 'lucide-react';

// ============================================================================
// [ZONE 1] FIREBASE CONFIGURATION (การเชื่อมต่อคลาวด์ Subcollections ระบบ v2.0)
// ============================================================================
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { 
  getFirestore, doc, setDoc, updateDoc, deleteDoc, collection, onSnapshot 
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDqum6bGwLqInO04PCxuDV8pEl5UbwphI",
  authDomain: "peem6pack-command.firebaseapp.com",
  projectId: "peem6pack-command",
  storageBucket: "peem6pack-command.firebasestorage.app",
  messagingSenderId: "843579566868",
  appId: "1:843579566868:web:1daa7700dab2739b757001"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const APP_ID = 'peem6pack-command-v1';

// ค่าควบคุมเกณฑ์การคำนวณทางธุรกิจ (Business Rules Constants)
const RESCORE_DAYS = 7; 
const PICK_THRESHOLD = 83; 
const WAIT_THRESHOLD = 55; 
const WINNER_GMV = 1000; 
const CONCENTRATION_LIMIT = 60; 
const PORTFOLIO_TARGET = { A: 60, B: 25, C: 10, D: 5 }; 
const BLENDED_COMMISSION_TARGET = 15; 
const DEFAULT_MONTHLY_CLIP_TARGET = 150;
const MONTHLY_REVENUE_TARGET = 300000; 

const DEFAULT_PILLARS = [
  { id: 'P1', name: 'Supplement Education', emoji: '📚', desc: 'สอนเลือกอาหารเสริม' },
  { id: 'P2', name: 'Mistake / Buyer Beware', emoji: '⚠️', desc: 'ซื้อผิด กินผิด' },
  { id: 'P3', name: 'Routine / Use Case', emoji: '☀️', desc: 'กินยังไงในชีวิตจริง' },
  { id: 'P4', name: 'Product Review / Comparison', emoji: '🔍', desc: 'รีวิวและเทียบสินค้า' },
  { id: 'P5', name: 'Fitness Lifestyle', emoji: '💪', desc: 'หุ่นดีจริง ใช้จริง' },
];

const ABCD_INFO = {
  A: { label: 'A — ขายดี', short: 'A', desc: 'สินค้าขายดี', bg: 'bg-[#0f5144]', text: 'text-[#0f5144]', border: 'border-[#0f5144]/10', lightBg: 'bg-emerald-50/50' },
  B: { label: 'B — มาใหม่', short: 'B', desc: 'สินค้าแนะนำ/กำลังมาแรง', bg: 'bg-[#2563eb]', text: 'text-[#2563eb]', border: 'border-blue-100', lightBg: 'bg-blue-50/50' },
  C: { label: 'C — ประหยัด', short: 'C', desc: 'สินค้าราคาจับต้องง่าย', bg: 'bg-[#d97706]', text: 'text-[#d97706]', border: 'border-amber-100', lightBg: 'bg-amber-50/50' },
  D: { label: 'D — คอมสูง', short: 'D', desc: 'สินค้าไฮเอนด์ค่าคอมหนา', bg: 'bg-[#7c3aed]', text: 'text-[#7c3aed]', border: 'border-purple-100', lightBg: 'bg-purple-50/50' },
  V: { label: 'V — Content', short: 'V', desc: 'คลิปให้คุณค่า/ความรู้', bg: 'bg-slate-500', text: 'text-slate-500', border: 'border-slate-100', lightBg: 'bg-slate-50/50' },
};

const DECISION_INFO = { 
  PICK: { label: 'PICK', bg: 'bg-[#e2f7e4]', text: 'text-[#1d7c2a]' }, 
  WAIT: { label: 'WAIT', bg: 'bg-[#fef3c7]', text: 'text-[#d97706]' }, 
  DROP: { label: 'DROP', bg: 'bg-[#fee2e2]', text: 'text-[#dc2626]' } 
};

const PRODUCT_TYPES = [
  { id: 'supplement', label: 'อาหารเสริม', emoji: '💊' }, 
  { id: 'shoes', label: 'รองเท้ากีฬา', emoji: '👟' }, 
  { id: 'equipment', label: 'อุปกรณ์ฟิตเนส', emoji: '🏋️' }, 
  { id: 'apparel', label: 'ชุดออกกำลังกาย', emoji: '👕' }, 
  { id: 'other', label: 'อื่นๆ', emoji: '📦' }
];

const SPLITTER_OPTIONS = { 
  persona: ['คนอ้วน', 'ผู้หญิง', 'มือใหม่', 'พนักงานออฟฟิศ', 'คนแก่/วัยกลางคน', 'คนเดินเยอะ', 'นักวิ่ง', 'คนลดน้ำหนัก', 'คนเล่นเวท'], 
  situation: ['เดินห้าง', 'วิ่งลู่', 'เดินงาน', 'เที่ยว', 'คาร์ดิโอ', 'เข้ายิม', 'เดินสวน', 'ทำงานออฟฟิศ', 'ก่อนนอน', 'หลังตื่นนอน'], 
  emotion: ['กลัวเจ็บ', 'ขี้เกียจเพราะเจ็บ', 'อยากเริ่มใหม่', 'อยากผอม', 'เหนื่อยจากงาน', 'อยากดูดี', 'อยากแข็งแรง', 'หมดหวังกับร่างกาย'], 
  format: ['POV', 'Story', 'Talking Head', 'Review', 'Compare', 'Voice Over', 'How-to', 'Listicle', 'Before/After'] 
};

const PAIN_SOURCES = [
  { id: 'shopee', label: '💬 Shopee/Lazada' }, 
  { id: 'tiktok', label: '🔍 TikTok "แต่..."' }, 
  { id: 'pantip', label: '💭 Pantip/Groups' }, 
  { id: 'ai', label: '🤖 AI Persona Simulation' }, 
  { id: 'personal', label: '👤 ประสบการณ์ตรง' }
];

// ============================================================================
// [ZONE 2] CORE CALCULATIONS & DATA FORMATTERS (ระบบประมวลผลข้อมูลหลังบ้าน)
// ============================================================================
const uid = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
const todayStr = () => new Date().toISOString().slice(0, 10);
const currentMonth = () => new Date().toISOString().slice(0, 7);
const daysSince = (iso) => !iso ? 999 : Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
const fmtDate = (iso) => { if (!iso) return '-'; const d = new Date(iso); return `${d.getDate()}/${d.getMonth() + 1}/${(d.getFullYear() + 543).toString().slice(2)}`; };
const fmtNum = (n) => (n ?? 0).toLocaleString('th-TH');
const truncate = (s, n) => !s ? '' : s.length > n ? s.slice(0, n) + '…' : s;
const hoursSince = (iso) => !iso ? 999 : (Date.now() - new Date(iso).getTime()) / 3600000;

const getAbcdInfo = (cat) => ABCD_INFO[cat] || ABCD_INFO['V'];
const getDecisionInfo = (dec) => DECISION_INFO[dec] || { label: 'WAIT', bg: 'bg-[#fef3c7]', text: 'text-[#d97706]' };
const getProductTypeInfo = (typeId) => PRODUCT_TYPES.find(t => t.id === typeId) || { id: 'other', label: 'อื่นๆ', emoji: '📦' };

// กู้ชีพสถิติตัวค้างแจ้งเตือน (ค้างตรวจสถิติแสดงผลค้างไว้ตลอดกาลจนกว่าจะมีค่าวิว)
function getStatsPending(clips) { 
  const pending24h = [], pending7d = []; 
  if (!Array.isArray(clips)) return { pending24h, pending7d };
  clips.forEach(c => { 
    const hrs = hoursSince(c.postedAt); 
    if (hrs >= 22 && (c.views24h === null || c.views24h === undefined || c.views24h === '')) pending24h.push(c); 
    if (hrs >= 156 && (c.views7d === null || c.views7d === undefined || c.views7d === '')) pending7d.push(c); 
  }); 
  return { pending24h, pending7d }; 
}

function calcScore(sc = {}) { 
  let total = 0, max = 0; 
  const cv = (v) => v === '' || v === null || v === undefined ? null : Number(v); 
  const commission = cv(sc.commission); 
  if (commission !== null && !isNaN(commission)) { total += commission >= 20 ? 3 : commission >= 15 ? 2 : commission >= 10 ? 1 : 0; max += 3; } 
  const g7 = cv(sc.gmv7dPct), g30 = cv(sc.gmv30dPct); 
  if (g7 !== null && g30 !== null && !isNaN(g7) && !isNaN(g30)) { if (g7 > 0 && g30 > 0) total += 3; else if (g7 < 0 && g30 < 0) total += 1; else total += 2; max += 3; } 
  const creators = cv(sc.creatorCount); 
  if (creators !== null && !isNaN(creators)) { total += creators <= 500 ? 3 : creators <= 1000 ? 2 : 1; max += 3; } 
  const angles = cv(sc.anglesCount); 
  if (angles !== null && !isNaN(angles)) { total += angles >= 3 ? 3 : angles >= 2 ? 2 : 1; max += 3; } 
  const cr = cv(sc.crPct); 
  if (cr !== null && !isNaN(cr)) { total += cr >= 20 ? 3 : cr >= 10 ? 2 : 1; max += 3; } 
  const conc = cv(sc.concentration); 
  if (conc !== null && !isNaN(conc)) { total += conc < 30 ? 3 : conc <= 60 ? 2 : 1; max += 3; } 
  return { total, max, pct: max > 0 ? Math.round((total / max) * 100) : 0 }; 
}

function getDecision(pct) { return pct >= PICK_THRESHOLD ? 'PICK' : pct >= WAIT_THRESHOLD ? 'WAIT' : 'DROP'; }

function getPortfolioBalance(products, clips, days = 30) { 
  const byCat = { A: 0, B: 0, C: 0, D: 0 }; let total = 0; 
  if (!Array.isArray(products)) return null;
  products.forEach(p => { if (!['A', 'B', 'C', 'D'].includes(p.category)) return; const sales = getProductSales(p, clips, days); byCat[p.category] += sales.primary; total += sales.primary; }); 
  if (total === 0) return null; 
  return Object.fromEntries(Object.entries(byCat).map(([k, v]) => { const actual = Math.round((v / total) * 100); const target = PORTFOLIO_TARGET[k]; const diff = actual - target; return [k, { actual, target, diff, gmv: v, status: Math.abs(diff) <= 5 ? 'ok' : diff > 0 ? 'over' : 'under' }]; })); 
}

function getBlendedCommission(products, clips, days = 30) { 
  let weightedSum = 0, totalGMV = 0; 
  if (!Array.isArray(products)) return null;
  products.forEach(p => { const sales = getProductSales(p, clips, days); const c = Number(p.scorecard?.commission) || 0; if (sales.primary > 0 && c > 0) { weightedSum += sales.primary * c; totalGMV += sales.primary; } }); 
  if (totalGMV === 0) return null; 
  return { blended: Math.round((weightedSum / totalGMV) * 100) / 100, target: BLENDED_COMMISSION_TARGET, totalGMV }; 
}

function getCategoryStack(products, clips, category) {
  if (!Array.isArray(products)) return [];
  const catProducts = products.filter(p => p.category === category);
  const withData = catProducts.map(p => {
    const sales30d = getProductSales(p, clips, 30).primary;
    const sales7d = getProductSales(p, clips, 7).primary;
    const momentum = (sales30d / 30) > 0 ? (sales7d / 7) / (sales30d / 30) : 1;
    return { product: p, sales30d, sales7d, momentum };
  }).sort((a, b) => b.sales30d - a.sales30d);

  return withData.map((s, i) => {
    let tier = i < 2 ? 'HOT' : i < 4 ? 'STEADY' : 'PASSIVE';
    let targetMonth = tier === 'HOT' ? 14 : tier === 'STEADY' ? 6 : 2.5;
    return { ...s, rank: i + 1, tier, targetMonth };
  });
}

function getECandidates(products, clips) {
  if (!Array.isArray(products)) return [];
  return products.map(p => {
    if (p.category === 'A' || daysSince(p.createdAt) < 14) return null;
    const sales30d = getProductSales(p, clips, 30).primary;
    const winnerCount = clips.filter(c => c.productId === p.id && (Number(c.gmv) || 0) >= WINNER_GMV).length;
    const commission = Number(p.scorecard?.commission || 0);

    let eScore = 0; const reasons = [];
    if (sales30d >= 30000) { eScore += 2; reasons.push(`GMV ฿${fmtNum(sales30d)}`); }
    if (winnerCount >= 1) { eScore += 1; reasons.push(`${winnerCount} Winner Clip`); }
    if (commission >= 15) { eScore += 1; reasons.push(`คอม ${commission}%`); }
    if (eScore < 2) return null;
    return { product: p, reasons, eScore };
  }).filter(Boolean).sort((a, b) => b.eScore - a.eScore);
}

function getROIAnalysis(products, clips, monthlyTargetGMV) {
  if (!Array.isArray(products)) return { items: [], totalCommRevenue: 0, gap: monthlyTargetGMV, pct: 0 };
  const items = products.map(p => {
    const sales30d = getProductSales(p, clips, 30).primary;
    const commission = Number(p.scorecard?.commission || 0);
    const price = Number(p.price) || 0;
    const commPerOrder = (price * commission) / 100;
    const currentCommRevenue = sales30d * commission / 100;
    return { product: p, sales30d, commission, price, commPerOrder, currentCommRevenue };
  }).filter(i => i.sales30d > 0 || i.commPerOrder > 0).sort((a, b) => b.currentCommRevenue - a.currentCommRevenue);

  const totalCommRevenue = items.reduce((s, i) => s + i.currentCommRevenue, 0);
  return { items, totalCommRevenue, gap: Math.max(0, monthlyTargetGMV - totalCommRevenue), pct: monthlyTargetGMV > 0 ? Math.round((totalCommRevenue / monthlyTargetGMV) * 100) : 0 };
}

function getProductsToCut(products, clips) {
  if (!Array.isArray(products)) return [];
  return products.map(p => {
    const reasons = []; const commission = Number(p.scorecard?.commission || 0);
    const sales = getProductSales(p, clips, 30);
    if (commission > 0 && commission <= 5 && sales.primary < 30000) reasons.push(`คอมต่ำ ≤ 5%`);
    if (p.scorePct && p.scorePct < WAIT_THRESHOLD) reasons.push(`เกณฑ์ Argoon < 55%`);
    if (daysSince(p.createdAt) >= 14 && sales.primary === 0) reasons.push('ไม่มีการเคลื่อนไหว 14d');
    if (reasons.length === 0) return null;
    return { product: p, reasons };
  }).filter(Boolean);
}

function getProductSales(product, clips, days) {
  if (!product) return { fromClips: 0, fromManual: 0, hasManual: false, clipCount: 0, primary: 0 };
  const cutoff = Date.now() - days * 86400000;
  const fromClips = Array.isArray(clips) ? clips.filter(c => c.productId === product.id && new Date(c.postedAt).getTime() >= cutoff).reduce((s, c) => s + (Number(c.gmv) || 0), 0) : 0;
  const clipCount = Array.isArray(clips) ? clips.filter(c => c.productId === product.id && new Date(c.postedAt).getTime() >= cutoff).length : 0;
  const fromManual = days <= 7 ? (Number(product.salesData?.last7d) || 0) : (Number(product.salesData?.last30d) || 0);
  return { fromClips, fromManual, hasManual: fromManual > 0, clipCount, primary: fromManual || fromClips };
}

function getBestAngle(product, clips) {
  if (!product?.angles?.length || !Array.isArray(clips)) return null;
  const stats = product.angles.map(angle => {
    const aclips = clips.filter(c => c.angleId === angle.id);
    const totalGMV = aclips.reduce((s, c) => s + (Number(c.gmv) || 0), 0);
    return { angle, count: aclips.length, totalGMV, avg: aclips.length > 0 ? totalGMV / aclips.length : 0 };
  }).filter(s => s.count >= 1).sort((a, b) => b.avg - a.avg);
  return stats[0] || null;
}

function getWinners(clips, products) {
  if (!Array.isArray(clips)) return [];
  return clips.filter(c => (Number(c.gmv) || 0) >= WINNER_GMV).map(c => ({ clip: c, product: Array.isArray(products) ? products.find(p => p.id === c.productId) : null, daysOld: daysSince(c.postedAt) })).sort((a, b) => (Number(b.clip.gmv) || 0) - (Number(a.clip.gmv) || 0));
}

function getRepostCandidates(clips, products) {
  return getWinners(clips, products).map(w => {
    const rs = w.clip.repostStatus || {}; let bucket = null;
    if (w.daysOld >= 30 && !rs.d30) bucket = 30;
    else if (w.daysOld >= 14 && !rs.d14) bucket = 14;
    else if (w.daysOld >= 7 && !rs.d7) bucket = 7;
    return bucket ? { ...w, repostBucket: bucket } : null;
  }).filter(Boolean).sort((a, b) => b.repostBucket - a.repostBucket);
}

function getConcentration(clips, products, days = 30) {
  const byProduct = {};
  if (!Array.isArray(products)) return null;
  products.forEach(p => { const s = getProductSales(p, clips, days); if (s.primary > 0) byProduct[p.id] = s.primary; });
  const totalGMV = Object.values(byProduct).reduce((s, v) => s + v, 0);
  if (totalGMV === 0) return null;
  const sorted = Object.entries(byProduct).sort((a, b) => b[1] - a[1]);
  if (!sorted || sorted.length === 0) return null;
  return { pct: Math.round((sorted[0][1] / totalGMV) * 100), product: products.find(p => p.id === sorted[0][0]), totalGMV };
}

// ============================================================================
// [ZONE 3] MAIN APPLICATION & LIFECYCLE (ระบบจัดการสิทธิ์ State คลาวด์)
// ============================================================================
export default function App() {
  const [user, setUser] = useState(null);
  const [dbInitialized, setDbInitialized] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [page, setPage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState(null);
  
  // Real Subcollections States
  const [products, setProducts] = useState([]);
  const [clips, setClips] = useState([]);
  const [monthlyTarget, setMonthlyTarget] = useState(DEFAULT_MONTHLY_CLIP_TARGET);
  
  const [toast, setToast] = useState(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editScoreProductId, setEditScoreProductId] = useState(null);
  const [editProductInfoId, setEditProductInfoId] = useState(null);
  const [showAddPain, setShowAddPain] = useState(false);
  const [showAddAngle, setShowAddAngle] = useState(false);
  const [showLockProduct, setShowLockProduct] = useState(false);
  const [showAddClip, setShowAddClip] = useState(false);
  const [editClipId, setEditClipId] = useState(null);
  const [clipForVOnly, setClipForVOnly] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [migrationLog, setMigrationLog] = useState(null);

  // States สำหรับ Alert-Free Custom Confirmation Overlays
  const [confirmDeleteProdId, setConfirmDeleteProdId] = useState(null);
  const [confirmDeleteClipId, setConfirmDeleteClipId] = useState(null);
  const [confirmClearDb, setConfirmClearDb] = useState(false);
  const [makeSimilarClip, setMakeSimilarClip] = useState(null);
  const [showBackup, setShowBackup] = useState(false);

  const [showGateWarning, setShowGateWarning] = useState(null); 

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 2500); };

  // 1. Firebase Authentication
  useEffect(() => {
    signInAnonymously(auth).catch(() => showToast("เชื่อมคลาวด์ล้มเหลว", "error"));
    return onAuthStateChanged(auth, setUser);
  }, []);

  // 2. Real-time Syncing จากแยกแฟ้ม Subcollections
  useEffect(() => {
    if (!user) return;
    setIsSyncing(true);

    const settingsRef = doc(db, 'artifacts', APP_ID, 'users', user.uid, 'appData', 'settings');
    const unsubSettings = onSnapshot(settingsRef, (snap) => {
      if (snap.exists()) setMonthlyTarget(snap.data().monthlyTarget || DEFAULT_MONTHLY_CLIP_TARGET);
    });

    const prodColRef = collection(db, 'artifacts', APP_ID, 'users', user.uid, 'products');
    const unsubProducts = onSnapshot(prodColRef, (snap) => {
      const prodList = []; snap.forEach(d => prodList.push({ id: d.id, ...d.data() }));
      setProducts(prodList);
      setDbInitialized(true);
      setIsSyncing(false);
    });

    const clipColRef = collection(db, 'artifacts', APP_ID, 'users', user.uid, 'clips');
    const unsubClips = onSnapshot(clipColRef, (snap) => {
      const clipList = []; snap.forEach(d => clipList.push({ id: d.id, ...d.data() }));
      setClips(clipList);
    });

    return () => { unsubSettings(); unsubProducts(); unsubClips(); };
  }, [user]);

  const updateProductInCloud = async (id, data) => {
    if (!user) return;
    await setDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'products', id), data, { merge: true });
  };

  const addProduct = async (data) => {
    const id = uid(); const s = calcScore(data.scorecard);
    const newP = { id, ...data, score: s.total, maxScore: s.max, scorePct: s.pct, decision: getDecision(s.pct), pillars: data.pillars || [], pains: [], angles: [], lastScoredAt: new Date().toISOString(), createdAt: new Date().toISOString(), locked: null };
    await updateProductInCloud(id, newP);
    showToast('เพิ่มสินค้าใหม่แล้ว!');
  };

  const updateProductScore = async (id, sc) => {
    const s = calcScore(sc);
    await updateProductInCloud(id, { scorecard: sc, score: s.total, maxScore: s.max, scorePct: s.pct, decision: getDecision(s.pct), lastScoredAt: new Date().toISOString() });
    showToast('คัดกรองคะแนนใหม่สำเร็จ!');
  };

  const executeDeleteProduct = async (id) => {
    await deleteDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'products', id));
    setPage('products'); 
    setConfirmDeleteProdId(null);
    showToast('ลบแฟ้มสินค้าเรียบร้อย');
  };

  const executeDeleteClip = async (id) => {
    await deleteDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'clips', id));
    setConfirmDeleteClipId(null);
    showToast('ลบคลิปแล้ว');
  };

  const executeClearDatabase = async () => {
    for (const p of products) await deleteDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'products', p.id));
    for (const c of clips) await deleteDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'clips', c.id));
    setConfirmClearDb(false);
    setPage('home'); 
    showToast('เคลียร์คลาวด์หมดจดแล้ว');
  };

  const addClip = async (data) => {
    if (!user) return; const id = uid();
    await setDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'clips', id), { 
      id, ...data, 
      paymentStatus: data.paymentStatus || 'pending',
      gencodeVerified: data.gencodeVerified || false,
      postedAt: data.postedAt || new Date().toISOString(), 
      createdAt: new Date().toISOString() 
    });
    showToast('บันทึกคลิปลงคลังสำเร็จ!');
  };

  const updateClip = async (id, patch) => {
    if (!user) return;
    await updateDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'clips', id), patch);
    showToast('อัพเดทคลิปแล้ว!');
  };

  const selectedProduct = selectedProductId ? products.find(p => p.id === selectedProductId) : null;
  const lockedProducts = useMemo(() => products.filter(p => p.locked && p.locked.month === currentMonth()), [products]);
  const productsNeedingRescore = useMemo(() => products.filter(p => daysSince(p.lastScoredAt) >= RESCORE_DAYS), [products]);
  const last7DaysClips = useMemo(() => {
    const cutoff = Date.now() - 7 * 86400000;
    return clips.filter(c => new Date(c.postedAt).getTime() >= cutoff).sort((a, b) => new Date(a.postedAt) - new Date(b.postedAt));
  }, [clips]);

  if (!dbInitialized) {
    return (
      <div className="min-h-screen bg-[#061b17] flex flex-col items-center justify-center space-y-4">
        <div className="w-14 h-14 border-4 border-emerald-950 border-t-lime-300 rounded-full animate-spin"></div>
        <div className="font-semibold text-emerald-100 tracking-wider text-sm animate-pulse">PEEM6PACK COMMAND CENTER INITIALIZING...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f3f6f5] text-[#0d2a23] flex flex-col lg:flex-row" style={{ fontFamily: "'Inter', 'Noto Sans Thai', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+Thai:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Inter', 'Noto Sans Thai', sans-serif; font-weight: 700; }
        .striped-bar {
          background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);
          background-size: 1rem 1rem;
        }
      `}</style>

      {/* PREMIUM DEEP EMERALD SIDEBAR WITH 6 RESTRUCTURED TABS */}
      <aside className="w-full lg:w-72 bg-[#012b25] text-white flex flex-col justify-between flex-shrink-0 shadow-2xl relative z-20">
        <div>
          <div className="p-7 flex items-center justify-between border-b border-[#053d34]">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-[#d9eb54] text-[#012b25] rounded-xl flex items-center justify-center font-extrabold text-xl shadow-lg">P6</div>
              <div>
                <h2 className="font-display text-lg leading-none tracking-tight">Pharmly</h2>
                <span className="text-[11px] text-emerald-400/80 font-medium tracking-wide">Affiliate Platform</span>
              </div>
            </div>
            {isSyncing ? <CloudOff className="w-4 h-4 text-amber-400 animate-pulse" /> : <Cloud className="w-4 h-4 text-emerald-400" />}
          </div>

          <nav className="p-5 space-y-1.5">
            {[
              { id: 'home', label: 'Overview', icon: Home },
              { id: 'products', label: 'Products', icon: Package },
              { id: 'lock', label: 'Lock Focus', icon: Lock },
              { id: 'analytics', label: 'Analytics (วิเคราะห์พอร์ต)', icon: BarChart3 },
              { id: 'log', label: 'Clip Logs (คลังวิดีโอ)', icon: Database },
              { id: 'settings', label: 'Settings (ตั้งค่าช่อง)', icon: Settings }
            ].map(item => {
              const Icon = item.icon; const active = page === item.id;
              return (
                <button 
                  key={item.id} 
                  onClick={() => setPage(item.id)} 
                  className={`w-full flex items-center gap-3.5 px-5 py-4 rounded-2xl text-sm font-medium transition-all duration-350 relative ${
                    active ? 'bg-[#d9eb54] text-[#012b25] font-bold shadow-md shadow-emerald-950/30' : 'text-emerald-100/70 hover:bg-[#043c34]/50 hover:text-white'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'stroke-[2.5]' : ''}`} /> {item.label}
                  {active && <span className="absolute right-4 w-1.5 h-1.5 rounded-full bg-[#012b25]" />}
                </button>
              );
            })}
          </nav>
        </div>
        
        <div className="p-5 border-t border-[#053d34]">
          <div className="bg-[#033c32] rounded-3xl p-5 mb-5 border border-[#095246] relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-[#d9eb54]/5 rounded-full" />
            <div className="w-8 h-8 rounded-full bg-[#d9eb54]/10 border border-[#d9eb54]/20 flex items-center justify-center mb-3"><Trophy className="w-4 h-4 text-[#d9eb54]" /></div>
            <h4 className="font-display text-sm font-bold text-white leading-tight">Upgrade Pro</h4>
            <p className="text-[10px] text-emerald-300/70 mt-1 leading-relaxed">ปลดล็อคโมดูลคำนวณและสถิติกราฟ AI ปั่นสคริปต์ได้ไม่จำกัด</p>
            <button className="w-full bg-[#d9eb54] text-[#012b25] text-xs font-bold py-2.5 rounded-xl transition-all shadow-md mt-4 hover:bg-[#eaf96c]">Upgrade Now</button>
          </div>
          <div className="flex gap-2 text-xs font-display">
            <button onClick={() => { setClipForVOnly(true); setShowAddClip(true); }} className="flex-1 bg-[#d9eb54] hover:bg-[#eaf96c] text-[#012b25] font-bold py-3 rounded-2xl transition-all shadow-md flex items-center justify-center gap-1">+ บันทึกคลิป</button>
            <button onClick={() => setPage('settings')} className="p-3 bg-[#033c32] text-emerald-100 rounded-2xl hover:text-white transition-all"><Settings className="w-4 h-4" /></button>
          </div>
        </div>
      </aside>

      {/* CONTENT AREA (Pharmly Layout Style) */}
      <main className="flex-1 overflow-y-auto pb-24 lg:pb-10">
        <header className="bg-white border-b border-[#e9eceb] px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-10">
          <div>
            <div className="text-[11px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
              <span>Overview</span>
              <ChevronRight className="w-3 h-3 text-slate-300" />
              <span className="text-emerald-800">List data</span>
            </div>
            <h1 className="font-display text-2xl text-[#012b25] mt-1 leading-none">Order Details</h1>
          </div>

          <div className="flex items-center gap-4 self-end sm:self-auto">
            <div className="relative">
              <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2.5 bg-[#f3f6f5] border border-transparent rounded-full text-xs w-48 md:w-60 focus:outline-none focus:border-emerald-700 focus:bg-white transition-all shadow-inner" />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
            <button className="p-2.5 bg-[#f3f6f5] hover:bg-slate-200/60 rounded-full transition-all text-slate-600 relative">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border border-white" />
            </button>
            <div className="flex items-center gap-3 pl-2 border-l border-slate-200">
              <div className="w-10 h-10 rounded-full bg-emerald-950 text-[#d9eb54] flex items-center justify-center font-bold shadow-md"><User className="w-5 h-5" /></div>
              <div className="text-left hidden md:block">
                <div className="text-xs font-bold text-[#012b25]">James Bond</div>
                <div className="text-[10px] text-slate-400 font-medium">@james.bond</div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 md:p-8 space-y-8 animate-fade-in">
          {page === 'home' && (
            <HomePage 
              products={products} clips={clips} lockedProducts={lockedProducts} 
              productsNeedingRescore={productsNeedingRescore} last7DaysClips={last7DaysClips} 
              monthlyTarget={monthlyTarget} onSetMonthlyTarget={(val) => setDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'appData', 'settings'), { monthlyTarget: val }, { merge: true })} 
              onGoTo={setPage} onSelectProduct={(id) => { setSelectedProductId(id); setPage('detail'); }} 
              onEditClip={(id) => setEditClipId(id)} onMakeSimilar={(clip) => setMakeSimilarClip(clip)}
              onMarkRepostDone={markRepostDone}
            />
          )}
          {page === 'products' && (
            <ProductHubPage products={products} clips={clips} onAdd={() => setShowAddProduct(true)} onSelect={(id) => { setSelectedProductId(id); setPage('detail'); }} />
          )}
          {page === 'detail' && selectedProduct && (
            <ProductDetailPage 
              product={selectedProduct} clips={clips.filter(c => c.productId === selectedProduct.id)} allClips={clips} 
              onBack={() => setPage('products')} 
              onTogglePillar={async (pid) => {
                const next = selectedProduct.pillars.includes(pid) ? selectedProduct.pillars.filter(x => x !== pid) : [...selectedProduct.pillars, pid];
                await updateProductInCloud(selectedProduct.id, { pillars: next });
              }} 
              onSetCategory={async (cat) => await updateProductInCloud(selectedProduct.id, { category: cat })} 
              onAddPain={() => setShowAddPain(true)} 
              onRemovePain={async (painId) => await updateProductInCloud(selectedProduct.id, { pains: (selectedProduct.pains || []).filter(x => x.id !== painId) })} 
              onAddAngle={() => setShowAddAngle(true)} 
              onRemoveAngle={async (angleId) => await updateProductInCloud(selectedProduct.id, { angles: (selectedProduct.angles || []).filter(x => x.id !== angleId) })} 
              onEditScore={(() => setEditScoreProductId(selectedProduct.id))} 
              onEditInfo={(() => setEditProductInfoId(selectedProduct.id))} 
              onLock={(() => setShowLockProduct(true))} 
              onUnlock={async () => await updateProductInCloud(selectedProduct.id, { locked: null })} 
              onDelete={(() => setConfirmDeleteProdId(selectedProduct.id))} 
              onAddClip={(() => { setClipForVOnly(false); setShowAddClip(true); })} 
              onEditClip={(id) => setEditClipId(id)} 
            />
          )}
          {page === 'lock' && (
            <LockListPage 
              lockedProducts={lockedProducts} products={products} clips={clips} 
              onSelectProduct={(id) => { setSelectedProductId(id); setPage('detail'); }} 
              onUnlock={async (id) => await updateProductInCloud(id, { locked: null })} 
              onLockNew={() => setPage('products')} 
            />
          )}
          {page === 'analytics' && (
            <DashboardView products={products} clips={clips} onMakeSimilar={(clip) => setMakeSimilarClip(clip)} onEditClip={(id) => setEditClipId(id)} onMarkRepostDone={markRepostDone} onPromoteToA={async (id) => await updateProductInCloud(id, { category: 'A' })} />
          )}
          {page === 'log' && (
            <ClipLogPage products={products} clips={clips} onEditClip={(id) => setEditClipId(id)} />
          )}
          {page === 'settings' && (
            <SettingsPage 
              products={products} 
              clips={clips} 
              migrationLog={migrationLog} 
              onMigrate={handleLegacyMigration} 
              onExport={() => setShowBackup(true)}
              onClearAll={() => setConfirmClearDb(true)} 
            />
          )}
        </div>
      </main>

      {/* CONFIRMATIONS & MODALS */}
      {showAddProduct && <AddProductModal onClose={() => setShowAddProduct(false)} onSave={addProduct} showGateWarning={(data) => setShowGateWarning(data)} showToast={showToast} />}
      {editScoreProductId && <EditScoreModal product={products.find(p => p.id === editScoreProductId)} onClose={() => setEditScoreProductId(null)} onSave={updateProductScore} />}
      {editProductInfoId && <EditProductInfoModal product={products.find(p => p.id === editProductInfoId)} onClose={() => setEditProductInfoId(null)} onSave={async (patch) => { await updateProductInCloud(editProductInfoId, patch); setEditProductInfoId(null); }} />}
      {showAddPain && selectedProduct && <AddPainModal onClose={() => setShowAddPain(false)} onSave={async (text, source) => { await updateProductInCloud(selectedProduct.id, { pains: [...(selectedProduct.pains || []), { id: uid(), text, source, createdAt: new Date().toISOString() }] }); setShowAddPain(false); }} />}
      {showAddAngle && selectedProduct && <AddAngleModal onClose={() => setShowAddAngle(false)} onSave={async (text) => { await updateProductInCloud(selectedProduct.id, { angles: [...(selectedProduct.angles || []), { id: uid(), text, createdAt: new Date().toISOString() }] }); setShowAddAngle(false); }} />}
      {showLockProduct && selectedProduct && <LockProductModal product={selectedProduct} onClose={() => setShowLockProduct(false)} onSave={async (target, angles) => { await updateProductInCloud(selectedProduct.id, { locked: { month: currentMonth(), targetClips: target, anglesToTest: angles, lockedAt: new Date().toISOString() } }); setShowLockProduct(false); }} />}
      {showAddClip && <AddClipModal products={products} defaultProductId={!clipForVOnly && selectedProduct ? selectedProduct.id : null} onClose={() => setShowAddClip(false)} onSave={addClip} showToast={showToast} />}
      {editClipId && <EditClipModal clip={clips.find(c => c.id === editClipId)} products={products} onClose={() => setEditClipId(null)} onSave={async (patch) => { await updateClip(editClipId, patch); setEditClipId(null); }} onDelete={() => setConfirmDeleteClipId(editClipId)} />}
      {makeSimilarClip && <MakeSimilarModal clip={makeSimilarClip} products={products} onClose={() => setMakeSimilarClip(null)} />}
      {showBackup && <BackupModal products={products} clips={clips} onClose={() => setShowBackup(false)} showToast={showToast} />}

      {confirmDeleteProdId && (
        <div className="fixed inset-0 bg-[#012b25]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center space-y-4 border border-slate-100">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto"><Trash2 className="w-6 h-6" /></div>
            <h3 className="font-display text-lg text-[#012b25]">ยืนยันการลบสินค้าถาวร?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">คุณแน่ใจหรือไม่ที่จะทำการลบข้อมูลสินค้าชิ้นนี้? ประวัติทั้งหมดจะถูกตัดออก</p>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setConfirmDeleteProdId(null)} className="flex-1 bg-slate-100 text-slate-700 py-2.5 rounded-xl font-bold text-xs">ยกเลิก</button>
              <button onClick={() => executeDeleteProduct(confirmDeleteProdId)} className="flex-1 bg-[#012b25] text-white py-2.5 rounded-xl font-bold text-xs">ยืนยันลบ</button>
            </div>
          </div>
        </div>
      )}

      {confirmDeleteClipId && (
        <div className="fixed inset-0 bg-[#012b25]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center space-y-4 border border-slate-100">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto"><Trash2 className="w-6 h-6" /></div>
            <h3 className="font-display text-lg text-[#012b25]">ยืนยันการลบคลิปถาวร?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">ข้อมูลการวิเคราะห์ ยอดวิว และผลลัพธ์รายได้ของคลิปประวัติชิ้นนี้จะถูกล้างทิ้งทั้งหมด</p>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setConfirmDeleteClipId(null)} className="flex-1 bg-slate-100 text-slate-700 py-2.5 rounded-xl font-bold text-xs">ยกเลิก</button>
              <button onClick={() => executeDeleteClip(confirmDeleteClipId)} className="flex-1 bg-rose-600 text-white py-2.5 rounded-xl font-bold text-xs">ยืนยันลบ</button>
            </div>
          </div>
        </div>
      )}

      {confirmClearDb && (
        <div className="fixed inset-0 bg-[#012b25]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center space-y-4 border border-slate-100">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto"><AlertTriangle className="w-6 h-6" /></div>
            <h3 className="font-display text-lg text-[#012b25]">ล้างฐานข้อมูลทั้งหมด?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">ข้อมูลทั้งหมดบนคลาวด์จะถูกลบถาวร!</p>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setConfirmClearDb(false)} className="flex-1 bg-slate-100 text-slate-700 py-2.5 rounded-xl font-bold text-xs">ยกเลิก</button>
              <button onClick={executeClearDatabase} className="flex-1 bg-[#012b25] text-white py-2.5 rounded-xl font-bold text-xs">ล้างทั้งหมด</button>
            </div>
          </div>
        </div>
      )}

      {showGateWarning && (
        <div className="fixed inset-0 bg-[#012b25]/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full text-center space-y-4 border border-slate-100">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto"><AlertTriangle className="w-6 h-6" /></div>
            <h3 className="font-display text-lg text-[#012b25]">คำเตือน 2-Rules Gate ติ๊กสิทธิ์ไม่ครบ</h3>
            <p className="text-xs text-slate-500 leading-relaxed">คุณยังไม่ได้ยืนยันว่าใช้จริงหรือตรง Scope ช่อง คุณต้องการบันทึกต่อไปหรือไม่?</p>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setShowGateWarning(null)} className="flex-1 bg-slate-100 text-slate-700 py-2.5 rounded-xl font-bold text-xs">ย้อนกลับ</button>
              <button onClick={() => { addProduct(showGateWarning); setShowGateWarning(null); setShowAddProduct(false); }} className="flex-1 bg-[#012b25] text-white py-2.5 rounded-xl font-bold text-xs">บันทึกต่อไป</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
          <div className="px-5 py-3 bg-[#012b25] text-[#d9eb54] rounded-2xl shadow-xl text-xs font-bold border border-[#053d34] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            {toast.msg}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// [ZONE 4] DYNAMIC GRAPHICS & VISUAL CARDS (วิดเจ็ตกราฟแคปซูลมนดึงข้อมูลจริง)
// ============================================================================
function CapsuleChart({ data }) {
  const maxValue = Math.max(...data.map(d => d.value), 100);
  return (
    <div className="flex justify-between items-end h-56 pt-6 px-2">
      {data.map((item, idx) => {
        const heightPct = Math.round((item.value / maxValue) * 100);
        const isHighlight = item.label === '07'; 
        return (
          <div key={idx} className="flex flex-col items-center flex-1 group relative">
            <div className={`absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-[#012b25] text-white text-[9px] font-mono font-bold px-2 py-1 rounded-md shadow-md z-10 ${
              isHighlight ? 'opacity-100 -top-8' : ''
            }`}>
              ฿{fmtNum(item.value)}
            </div>
            <div className="w-6 md:w-8 bg-[#f3f6f5] rounded-full h-40 flex items-end overflow-hidden border border-slate-100">
              <div 
                className={`w-full rounded-full transition-all duration-700 ${
                  isHighlight ? 'bg-[#0a4d40] striped-bar h-[85%]' : 'bg-[#0a4d40]'
                }`} 
                style={{ height: `${heightPct}%` }}
              />
            </div>
            <span className="text-[10px] text-slate-400 font-mono font-bold mt-2">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function HeatmapGrid({ clips }) {
  const days = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const hours = ['9 am', '10 am', '11 am', '12 pm', '1 pm', '2 pm', '3 pm'];
  
  const heatMapValues = useMemo(() => {
    const grid = Array(7).fill(0).map(() => Array(7).fill(0));
    if (!Array.isArray(clips)) return grid;
    
    clips.forEach(c => {
      if (!c.postedAt) return;
      const date = new Date(c.postedAt);
      const day = date.getDay(); 
      const hour = date.getHours(); 
      const dayIdxMap = [1, 2, 3, 4, 5, 6, 0]; 
      const dayIdx = dayIdxMap[day];

      let hourIdx = -1;
      if (hour >= 9 && hour <= 15) hourIdx = hour - 9;
      if (dayIdx >= 0 && dayIdx < 7 && hourIdx >= 0 && hourIdx < 7) grid[hourIdx][dayIdx] += 1;
    });
    return grid;
  }, [clips]);

  const maxHeat = useMemo(() => Math.max(...heatMapValues.flat(), 1), [heatMapValues]);

  return (
    <div className="grid grid-cols-8 gap-1.5 text-[9px] text-slate-400 font-bold font-mono">
      <div />
      {days.map(d => <div key={d} className="text-center">{d}</div>)}
      {hours.map((h, hrIdx) => (
        <React.Fragment key={h}>
          <div className="text-right pr-2 self-center">{h}</div>
          {days.map((d, dayIdx) => {
            const val = heatMapValues[hrIdx][dayIdx];
            const color = val === 0 ? 'bg-slate-100' : (val / maxHeat > 0.7 ? 'bg-[#0a4d40]' : val / maxHeat > 0.4 ? 'bg-[#186a5a]/60' : 'bg-[#186a5a]/25');
            return (
              <div key={`${d}-${h}`} className={`h-4 rounded-[4px] transition-all duration-300 ${color} hover:scale-110 cursor-pointer`} title={`สถิติจำนวนโพสต์: ${val} คลิป`} />
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
}

function HomePage({ products, clips, lockedProducts, productsNeedingRescore, last7DaysClips, monthlyTarget, onSetMonthlyTarget, onGoTo, onSelectProduct, onEditClip, onMakeSimilar, onMarkRepostDone }) {
  const today = todayStr();
  const totalGMVMonth = clips.filter(c => c.postedAt?.slice(0, 7) === currentMonth()).reduce((sum, c) => sum + (Number(c.gmv) || 0), 0);
  const pattern = last7DaysClips.map(c => { if (c.isV) return 'V'; const p = products.find(pp => pp.id === c.productId); return p?.category || '?'; });
  const repeats = []; for (let i = 0; i < pattern.length - 2; i++) { if (pattern[i] && pattern[i] === pattern[i + 1] && pattern[i] === pattern[i + 2]) repeats.push(pattern[i]); }
  const hasRepeatIssue = repeats.length > 0;

  // 3V Metrics Computations
  const vCount = last7DaysClips.filter(c => c.isV).length;
  const totalClips7d = last7DaysClips.length;
  const vRatio = totalClips7d > 0 ? Math.round((vCount / totalClips7d) * 100) : 0;
  const uniqueProducts7d = new Set(last7DaysClips.filter(c => !c.isV).map(c => c.productId)).size;
  const avgPerDay = (totalClips7d / 7).toFixed(1);

  const topSellingProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    return products.map(p => ({
      product: p,
      gmv: clips.filter(c => c.productId === p.id).reduce((sum, c) => sum + (Number(c.gmv) || 0), 0),
      commission: Number(p.scorecard?.commission || 0)
    })).filter(p => p.gmv > 0).sort((a, b) => b.gmv - a.gmv).slice(0, 3);
  }, [products, clips]);

  const salesAnalyticsData = useMemo(() => {
    const totals = Array(12).fill(0);
    clips.forEach(c => {
      const date = new Date(c.postedAt);
      if (date.getFullYear() === new Date().getFullYear()) totals[date.getMonth()] += (Number(c.gmv) || 0);
    });
    return Array.from({ length: 12 }, (_, i) => ({ label: String(i + 1).padStart(2, '0'), value: totals[i] }));
  }, [clips]);

  const statsPending = useMemo(() => getStatsPending(clips), [clips]);
  const concentration = useMemo(() => getConcentration(clips, products, 30), [clips, products]);
  const clipsThisMonth = clips.filter(c => c.postedAt?.slice(0, 7) === currentMonth()).length;
  const winners = useMemo(() => getWinners(clips, products).slice(0, 5), [clips, products]);
  const repostCandidates = useMemo(() => getRepostCandidates(clips, products).slice(0, 3), [clips, products]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <OverviewKPI icon={DollarSign} label="Total Profit (Commission)" value={`฿${fmtNum(totalGMVMonth)}`} sub="สะสมภายในเดือนนี้" isPrimary={true} />
        <OverviewKPI icon={User} label="Total Products" value={products.length} sub="รายการสินค้าคลังทั้งหมด" />
        <OverviewKPI icon={Activity} label="Total Clips" value={clips.length} sub="คลิปสะสมทั้งหมดในระบบ" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="bg-white border border-[#e9eceb] rounded-3xl p-6 shadow-sm xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg text-[#012b25]">Sales Analytics</h3>
              <p className="text-xs text-slate-400">สถิติยอด GMV คลิป (รายเดือนปีปัจจุบัน)</p>
            </div>
          </div>
          <CapsuleChart data={salesAnalyticsData} />
        </div>

        <div className="bg-white border border-[#e9eceb] rounded-3xl p-6 shadow-sm space-y-5">
          <h3 className="font-display text-base text-[#012b25]">Top Selling Products</h3>
          <div className="flex justify-around items-end h-48 pt-4">
            {topSellingProducts.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-12 w-full">ยังไม่มียอดสะสมในระบบ</p>
            ) : (
              topSellingProducts.map((pData, idx) => {
                const colors = ['bg-[#f26522]', 'bg-[#0d2a23]', 'bg-[#bcd924]'];
                const hStyles = ['h-[85%]', 'h-[65%]', 'h-[45%]'];
                return (
                  <div key={pData.product.id} className="flex flex-col items-center flex-1">
                    <div className="w-6 bg-slate-100 rounded-full h-32 flex items-end overflow-hidden">
                      <div className={`w-full ${colors[idx]} rounded-full ${hStyles[idx]} flex items-center justify-center`}>
                        <span className="text-[8px] font-bold text-white rotate-90 whitespace-nowrap">{truncate(pData.product.name, 12)}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold text-slate-800 font-mono mt-2">฿{fmtNum(pData.gmv)}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#e9eceb] rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="font-display text-base text-[#012b25]">🎯เป้าหมายคุณภาพช่อง (7 วันล่าสุด)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <VBar label="Volume (คลิป)" value={totalClips7d} target={21} sub={`${avgPerDay} คลิป/วัน`} />
          <VBar label="Value (คลิปให้ความรู้)" value={vRatio} target={30} suffix="%" sub={`${vRatio}% V-Clips`} />
          <VBar label="Variety (แบรนด์สินค้า)" value={uniqueProducts7d} target={4} sub={`${uniqueProducts7d} แบรนด์`} />
        </div>
      </div>

      {concentration && concentration.pct >= CONCENTRATION_LIMIT && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-3xl p-5 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-display text-sm">สัดส่วนพอร์ตเสี่ยงเกินเกณฑ์ ({concentration.pct}%)</h4>
            <p className="text-xs text-slate-500 mt-1">สินค้า "{concentration.product?.name}" ครองพอร์ตสูงเกินขีดจำกัดที่ {CONCENTRATION_LIMIT}% แนะนำให้เร่งสร้างคลิปสินค้าอื่นเพิ่มเติมเพื่อกระจายสัดส่วนพอร์ต</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[#e9eceb] rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="font-display text-base text-[#012b25] flex items-center gap-2"><Repeat className="w-4 h-4 text-[#7c3aed]" /> ⏱️ ระบบคิวแจ้งอัปโหลดคลิปทำเงินซ้ำ (Repost)</h3>
          <div className="space-y-3">
            {repostCandidates.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-6">ไม่มีคิวอัปเดตคลิปเก่าทำเงิน</p>
            ) : (
              repostCandidates.map(r => (
                <div key={r.clip.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-slate-800 truncate">{r.clip.hook || 'ไม่มี Hook'}</div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">ยอดวิวสะสม: {fmtNum(r.clip.views7d)} · ยอด GMV เดิม: ฿{fmtNum(r.clip.gmv)}</div>
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button onClick={() => onMakeSimilar(r.clip)} className="bg-[#d9eb54] text-[#012b25] font-bold px-3 py-1.5 rounded-lg">ทำซ้ำ</button>
                    <button onClick={() => onMarkRepostDone(r.clip.id, r.repostBucket)} className="bg-[#e2f7e4] text-[#1d7c2a] font-bold px-3 py-1.5 rounded-lg">✓ โพสต์แล้ว</button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white border border-[#e9eceb] rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="font-display text-base text-[#012b25] flex items-center gap-2"><Trophy className="w-4 h-4 text-amber-500" /> 🏆 คลังคลิปทำเงินเด่น (Winner Vault)</h3>
          <div className="space-y-3">
            {winners.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-6">ยังไม่พบคลิปยอดสะสมเกิน ฿1,000</p>
            ) : (
              winners.map(w => (
                <div key={w.clip.id} className="p-3.5 bg-amber-50/50 border border-amber-100 rounded-2xl flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-slate-800 truncate">{w.clip.hook || 'ไม่มีคำเปิดหัว'}</div>
                    <div className="text-[10px] text-slate-400 font-semibold font-mono">สินค้า: {w.product?.name || 'V-Content'}</div>
                  </div>
                  <span className="font-mono font-bold text-amber-700 text-sm">฿{fmtNum(w.clip.gmv)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[#e9eceb] rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="font-display text-base text-[#012b25]">Latest Clips (ค้างตรวจสถิติ)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead><tr className="bg-slate-50 font-bold border-b border-slate-100 text-slate-400"><th className="p-3">Clip Hook</th><th className="p-3">ประเภท</th><th className="p-3">สถานะ</th><th className="p-3 text-right">ดำเนินการ</th></tr></thead>
              <tbody className="divide-y divide-slate-50">
                {statsPending.pending24h.concat(statsPending.pending7d).length === 0 ? (
                  <tr><td colSpan="4" className="p-6 text-center text-slate-400 italic">🎉 อัปเดตสถิติวิดีโอครบหมดแล้ว</td></tr>
                ) : (
                  statsPending.pending24h.concat(statsPending.pending7d).slice(0, 5).map(c => {
                    const is7d = hoursSince(c.postedAt) >= 156;
                    return (
                      <tr key={c.id} className="hover:bg-slate-50/50">
                        <td className="p-3 truncate max-w-[150px] font-medium text-slate-800">{c.hook || 'ไม่มี Hook'}</td>
                        <td className="p-3">
                          <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${is7d ? 'bg-purple-50 text-purple-700' : 'bg-sky-50 text-sky-700'}`}>{is7d ? '7 Days' : '24 Hours'}</span>
                        </td>
                        <td className="p-3"><span className="w-2.5 h-2.5 bg-amber-400 rounded-full inline-block animate-pulse" /></td>
                        <td className="p-3 text-right"><button onClick={() => onEditClip(c.id)} className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg font-bold">อัปเดตสถิติ</button></td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white border border-[#e9eceb] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between"><h3 className="font-display text-base text-[#012b25]">Focused Products</h3><button onClick={() => onGoTo('lock')} className="text-xs font-bold text-[#012b25] hover:underline">Manage</button></div>
          <div className="space-y-3">
            {lockedProducts.slice(0, 3).map(p => {
              const made = clips.filter(c => c.productId === p.id && c.postedAt?.slice(0, 7) === currentMonth()).length;
              const target = p.locked?.targetClips || 1;
              const catInfo = getAbcdInfo(p.category);
              return (
                <div key={p.id} onClick={() => onSelectProduct(p.id)} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-100/50 transition-all">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center ${catInfo.bg} text-white`}>{catInfo.short}</div>
                    <span className="font-display font-bold text-sm text-slate-800 truncate max-w-[160px]">{p.name || 'ไม่ระบุชื่อ'}</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-600">{made}/{target} clips</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function ProductHubPage({ products, clips, onAdd, onSelect }) {
  const [search, setSearch] = useState(''); 
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('score');
  const [viewMode, setViewMode] = useState('box');

  const filtered = useMemo(() => {
    if (!Array.isArray(products)) return [];
    let list = products.filter(p => {
      if (search && !p.name?.toLowerCase().includes(search.toLowerCase())) return false;
      if (filter === 'stale') return daysSince(p.lastScoredAt) >= RESCORE_DAYS;
      if (filter === 'pick' || filter === 'wait' || filter === 'drop') return p.decision?.toLowerCase() === filter;
      if (filter === 'locked') return !!p.locked;
      if (filter !== 'all') return p.category === filter;
      return true;
    });

    if (sortBy === 'score') list.sort((a, b) => (b.scorePct || 0) - (a.scorePct || 0));
    else if (sortBy === 'rescore') list.sort((a, b) => daysSince(b.lastScoredAt) - daysSince(a.lastScoredAt));
    else if (sortBy === 'name') list.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'th'));
    else if (sortBy === 'created') list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return list;
  }, [products, search, filter, sortBy]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#e9eceb] rounded-3xl p-5 shadow-sm flex items-center justify-between">
          <div><span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Products</span><div className="font-display text-2xl text-[#012b25] mt-1">{products.length}</div></div>
          <div className="p-3 bg-slate-50 text-slate-400 rounded-2xl"><Package className="w-5 h-5" /></div>
        </div>
        <div className="bg-white border border-[#e9eceb] rounded-3xl p-5 shadow-sm flex items-center justify-between">
          <div><span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Stale Scored</span><div className="font-display text-2xl text-amber-600 mt-1">{products.filter(p=>daysSince(p.lastScoredAt) >= RESCORE_DAYS).length}</div></div>
          <div className="p-3 bg-amber-50 text-amber-500 rounded-2xl"><AlertTriangle className="w-5 h-5" /></div>
        </div>
        <div className="bg-white border border-[#e9eceb] rounded-3xl p-5 shadow-sm flex items-center justify-between">
          <div><span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Drop Items</span><div className="font-display text-2xl text-[#dc2626] mt-1">{products.filter(p=>p.decision === 'DROP').length}</div></div>
          <div className="p-3 bg-rose-50 text-rose-500 rounded-2xl"><X className="w-5 h-5" /></div>
        </div>
      </div>

      <div className="bg-white border border-[#e9eceb] rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search for items..." className="w-full pl-10 pr-4 py-2.5 bg-[#f3f6f5] border border-transparent rounded-full text-xs focus:outline-none focus:border-[#012b25]" />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={onAdd} className="bg-[#bcd924] hover:bg-[#a9c41d] text-[#0d2a23] font-bold text-xs px-5 py-2.5 rounded-full shadow-sm flex items-center gap-1"><Plus className="w-4 h-4" /> Add New Product</button>
            <select value={filter} onChange={e=>setFilter(e.target.value)} className="bg-[#f3f6f5] border-none text-xs font-bold px-4 py-2.5 rounded-full">
              <option value="all">ทุกพอร์ตสินค้า</option>
              <option value="pick">🟢 PICK Only</option>
              <option value="wait">🟡 WAIT Only</option>
              <option value="drop">🔴 DROP Only</option>
              <option value="locked">🔒 Locked Focus</option>
              <option value="stale">⏱️ Stale (ค้างคัดกรอง)</option>
              <option value="A">หมวด A (Proven)</option>
              <option value="B">หมวด B (Testing)</option>
              <option value="C">หมวด C (Volume)</option>
              <option value="D">หมวด D (Premium)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-slate-50 text-slate-500">
          <div className="flex items-center gap-1 text-xs font-bold">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select value={sortBy} onChange={e=>setSortBy(e.target.value)} className="bg-transparent border-none text-xs focus:ring-0 p-0 text-slate-600 font-bold">
              <option value="score">เรียงตามคะแนน (สูง-ต่ำ)</option>
              <option value="rescore">เรียงตามความ stale (เก่า-ใหม่)</option>
              <option value="name">เรียงตามชื่อสินค้า A-Z</option>
              <option value="created">เรียงตามวันที่เพิ่มล่าสุด</option>
            </select>
            <span className="text-[10px] text-slate-400 font-normal ml-1">พบ {filtered.length} รายการ</span>
          </div>

          <div className="flex bg-slate-100 rounded-lg p-1 border border-slate-200/50">
            <button onClick={() => setViewMode('box')} className={`p-1 rounded-md ${viewMode === 'box' ? 'bg-white text-[#012b25] shadow-sm' : 'text-slate-400 hover:text-slate-650'}`}><LayoutGrid className="w-3.5 h-3.5" /></button>
            <button onClick={() => setViewMode('list')} className={`p-1 rounded-md ${viewMode === 'list' ? 'bg-white text-[#012b25] shadow-sm' : 'text-slate-400 hover:text-slate-650'}`}><List className="w-3.5 h-3.5" /></button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-sm text-slate-400 italic">ไม่พบสินค้าในระบบ</p>
          </div>
        ) : viewMode === 'box' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 pt-2">
            {filtered.map(p => {
              const dec = getDecisionInfo(p.decision);
              const catInfo = getAbcdInfo(p.category);
              const isStale = daysSince(p.lastScoredAt) >= RESCORE_DAYS;
              return (
                <div key={p.id} onClick={() => onSelect(p.id)} className={`bg-white border ${isStale ? 'border-amber-300 shadow-sm shadow-amber-50' : 'border-slate-100'} rounded-3xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between relative group`}>
                  {p.locked && <div className="absolute top-4 right-4 text-[#012b25] bg-lime-400/20 p-1.5 rounded-full border border-lime-400/20"><Lock className="w-3.5 h-3.5" /></div>}
                  <div>
                    <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                      <div className={`w-6 h-6 rounded-md font-bold text-xs flex items-center justify-center ${catInfo.bg} text-white flex-shrink-0`}>{catInfo.short}</div>
                      {p.isShopAds && <span className="text-[9px] bg-rose-50 text-rose-700 font-bold px-1.5 py-0.5 rounded-md">🛒 Ads</span>}
                      {p.price > 0 && <span className="text-[9px] bg-slate-100 text-slate-600 font-semibold font-mono px-1.5 py-0.5 rounded-md">฿{fmtNum(p.price)}</span>}
                    </div>
                    <h3 className="font-display text-base text-slate-800 line-clamp-2 leading-tight">{p.name || 'ไม่ระบุชื่อ'}</h3>
                    <p className="text-xs text-slate-400 mt-1">{p.brand || 'No brand'}</p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-50 flex items-end justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Argoon Score</div>
                      <div className="font-mono font-bold text-sm text-slate-800 mt-0.5">{p.score}/{p.maxScore} <span className="text-xs text-slate-400 font-normal">({p.scorePct}%)</span></div>
                    </div>
                    <div className={`text-[10px] font-bold px-2.5 py-1.5 rounded-xl ${dec.bg} ${dec.text}`}>{dec.label}</div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs text-slate-600 border-collapse">
              <thead>
                <tr className="bg-slate-50/80 font-bold text-slate-400 border-b border-slate-100 uppercase text-[10px] tracking-wider">
                  <th className="p-4">Product ID</th>
                  <th className="p-4">Product Name</th>
                  <th className="p-4">Price</th>
                  <th className="p-4">Decision</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(p => {
                  const dec = getDecisionInfo(p.decision);
                  const catInfo = getAbcdInfo(p.category);
                  return (
                    <tr key={p.id} className="hover:bg-slate-50/50 group">
                      <td className="p-4 font-mono font-bold text-slate-400">#{p.id.slice(0, 6)}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-md font-bold text-xs flex items-center justify-center ${catInfo.bg} text-white flex-shrink-0`}>{catInfo.short}</div>
                          <div className="truncate max-w-[200px]"><span className="font-display font-bold text-slate-800 text-sm group-hover:text-emerald-950 block">{p.name || 'ไม่ระบุชื่อ'}</span><span className="text-[10px] text-slate-400">{p.brand || 'No brand'}</span></div>
                        </div>
                      </td>
                      <td className="p-4 font-mono font-bold text-emerald-800">฿{fmtNum(p.price)}</td>
                      <td className="p-4"><span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-full ${dec.bg} ${dec.text}`}>{dec.label}</span></td>
                      <td className="p-4 text-right"><button onClick={() => onSelect(p.id)} className="text-xs bg-[#f3f6f5] hover:bg-[#012b25] hover:text-white px-4 py-2 rounded-full font-bold transition-all">แก้ไขสเปก</button></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function ProductDetailPage({ product, clips, allClips, onBack, onTogglePillar, onSetCategory, onAddPain, onRemovePain, onAddAngle, onRemoveAngle, onEditScore, onEditInfo, onLock, onUnlock, onDelete, onAddClip, onEditClip }) {
  const sales7d = useMemo(() => getProductSales(product, allClips, 7), [product, allClips]);
  const sales30d = useMemo(() => getProductSales(product, allClips, 30), [product, allClips]);
  const bestAngle = useMemo(() => getBestAngle(product, allClips), [product, allClips]);
  const typeInfo = getProductTypeInfo(product?.productType);
  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-800 transition"><ChevronLeft className="w-4 h-4" /> Back to Products</button>
      
      <div className="bg-[#012b25] text-white rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start gap-6 border border-[#043d34]">
        <div className="space-y-3 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] bg-emerald-900 border border-emerald-800 font-bold px-3 py-1 rounded-md text-emerald-300 uppercase tracking-wider">{typeInfo.emoji} {typeInfo.label}</span>
            {product.isShopAds && <span className="text-[10px] bg-rose-500 text-white font-bold px-3 py-1 rounded-md">🛒 Shop Ads</span>}
            {product.price > 0 && <span className="text-[10px] bg-[#d9eb54] text-[#012b25] font-bold px-3 py-1 rounded-md font-mono">฿{fmtNum(product.price)}</span>}
          </div>
          <h2 className="font-display text-2xl md:text-3xl tracking-tight leading-tight">{product.name || 'ไม่ระบุชื่อ'}</h2>
          <p className="text-emerald-300 text-xs font-medium">Brand: {product.brand || 'No Brand'}</p>
          <div className="flex gap-2 pt-2">
            {product.tiktokLink && <a href={product.tiktokLink} target="_blank" rel="noreferrer" className="text-xs bg-[#033c32] hover:bg-[#075246] px-3.5 py-2 rounded-xl text-emerald-100 flex items-center gap-1.5 transition-all"><ExternalLink className="w-3.5 h-3.5" /> TikTok Store</a>}
            {product.kalodataLink && <a href={product.kalodataLink} target="_blank" rel="noreferrer" className="text-xs bg-[#033c32] hover:bg-[#075246] px-3.5 py-2 rounded-xl text-emerald-100 flex items-center gap-1.5 transition-all"><ExternalLink className="w-3.5 h-3.5" /> Kalodata Link</a>}
          </div>
        </div>

        <div className="bg-[#033c32] border border-[#075246] p-5 rounded-2xl min-w-[200px] flex flex-col justify-between">
          <div>
            <div className="text-[10px] font-bold text-emerald-300/80 uppercase tracking-wider">Argoon Score</div>
            <div className="font-mono font-bold text-2xl mt-1">{product.score}/{product.maxScore} <span className="text-xs text-emerald-400 font-normal">({product.scorePct}%)</span></div>
          </div>
          <div className="mt-4 pt-3 border-t border-[#095c4f] flex gap-2">
            <button onClick={onEditScore} className="flex-1 bg-[#d9eb54] text-[#012b25] text-xs font-bold py-2 rounded-xl text-center">Score Recalculate</button>
            <button onClick={onEditInfo} className="p-2.5 bg-[#095c4f] text-emerald-100 rounded-xl hover:text-white transition-all"><Edit3 className="w-4 h-4" /></button>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Switch Strategy Category:</span>
        <div className="flex gap-1">
          {['A', 'B', 'C', 'D'].map(cat => {
            const catInfo = getAbcdInfo(cat);
            return (
              <button key={cat} onClick={() => onSetCategory(cat)} className={`text-xs font-bold px-4 py-2 rounded-xl transition-all ${product.category === cat ? `${catInfo.bg} text-white` : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>หมวด {cat}</button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-2 bg-gradient-to-br from-[#0f5144]/5 to-white">
          <span className="text-[10px] font-bold text-[#0f5144] uppercase tracking-wider block">📊 อัตรายอดขายจริงจาก TikTok Shop</span>
          {sales30d.hasManual ? (
            <div className="space-y-1 pt-1">
              <div className="flex justify-between text-xs font-bold text-slate-700"><span>ยอดสะสม 7 วัน:</span><span className="font-mono">฿{fmtNum(sales7d.fromManual)}</span></div>
              <div className="flex justify-between text-xs font-bold text-slate-700"><span>ยอดสะสม 30 วัน:</span><span className="font-mono">฿{fmtNum(sales30d.fromManual)}</span></div>
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic py-2">ยังไม่มีประวัติยอดขาย กดแก้ไขสิทธิ์ Info เพื่อระบุตัวเลข</p>
          )}
        </div>
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-2 bg-gradient-to-br from-blue-50/20 to-white">
          <span className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">🎬 ยอดรวมที่แทร็กจากคลิป (Attribution)</span>
          <div className="space-y-1 pt-1">
            <div className="flex justify-between text-xs font-bold text-slate-700"><span>ยอดคลิปสะสม 7 วัน:</span><span className="font-mono">฿{fmtNum(sales7d.fromClips)}</span></div>
            <div className="flex justify-between text-xs font-bold text-slate-700"><span>ยอดคลิปสะสม 30 วัน:</span><span className="font-mono">฿{fmtNum(sales30d.fromClips)}</span></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[#e9eceb] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between"><h3 className="font-display text-base text-[#012b25]">😣 Pain Point Bank ({product.pains?.length || 0})</h3><button onClick={onAddPain} className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs px-3 py-2 rounded-xl transition-all">+ Add Pain</button></div>
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {(!product.pains || product.pains.length === 0) ? (
              <p className="text-xs text-slate-400 italic text-center py-6">ยังไม่มียอดคลัง Pain เพื่อไปรันระบบ Splitter</p>
            ) : (
              product.pains.map(p => (
                <div key={p.id} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-start justify-between gap-2 text-xs"><div className="space-y-1"><p className="text-slate-700 leading-normal font-medium">{p.text}</p><span className="text-[9px] text-slate-400 uppercase font-bold tracking-wide">{PAIN_SOURCES.find(s=>s.id===p.source)?.label}</span></div><button onClick={() => onRemovePain(p.id)} className="text-slate-300 hover:text-rose-500 p-1"><Trash2 className="w-3.5 h-3.5" /></button></div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white border border-[#e9eceb] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between"><h3 className="font-display text-base text-[#012b25]">🎯 Angle Bank มุมคอนเทนต์ ({product.angles?.length || 0})</h3><button onClick={onAddAngle} className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs px-3 py-2 rounded-xl transition-all">+ Add Angle</button></div>
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {bestAngle && bestAngle.count > 0 && (
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 relative shadow-inner">
                <div className="p-2.5 bg-[#bcd924] text-[#012b25] rounded-xl flex-shrink-0 shadow-sm"><Trophy className="w-5 h-5" /></div>
                <div className="space-y-0.5">
                  <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wide block">🏆 Angle ที่ดีที่สุด (Best Angle)</span>
                  <p className="text-sm font-bold text-[#012b25]">{bestAngle.angle.text}</p>
                  <p className="text-[11px] text-slate-500 font-mono mt-1 font-semibold">เฉลี่ย ฿{fmtNum(Math.round(bestAngle.avg))}/คลิป · ปั่นยอดสะสม ฿{fmtNum(bestAngle.totalGMV)} จาก {bestAngle.count} คลิป</p>
                </div>
              </div>
            )}
            {(!product.angles || product.angles.length === 0) ? (
              <p className="text-xs text-slate-400 italic text-center py-6">ยังไม่มียอดคลังปัญญา Angle นำสายตา</p>
            ) : (
              product.angles.map(a => {
                const isBest = bestAngle && bestAngle.angle.id === a.id;
                return (
                  <div key={a.id} className={`p-3 rounded-2xl flex items-center justify-between gap-2 text-xs border ${isBest ? 'bg-amber-50/30 border-amber-200/50' : 'bg-slate-50 border-slate-100'}`}><p className="text-slate-700 font-medium">{isBest && '🏆 '}{a.text}</p><button onClick={() => onRemoveAngle(a.id)} className="text-slate-300 hover:text-rose-500 p-1"><Trash2 className="w-3.5 h-3.5" /></button></div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <SplitterSection product={product} />

      <div className="bg-white border border-[#e9eceb] rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between"><h3 className="font-display text-base text-[#012b25]">🎬 คลิปสะสมที่ผูกกับสินค้านี้ ({clips.length})</h3><button onClick={onAddClip} className="bg-[#bcd924] text-[#0d2a23] font-bold text-xs px-4 py-2.5 rounded-full shadow-sm hover:bg-[#a9c41d] transition-all">+ Add Clip</button></div>
        <div className="space-y-2">
          {clips.length === 0 ? (
            <p className="text-xs text-slate-400 italic text-center py-8">ยังไม่มีคลิปที่บันทึกข้อมูลไว้</p>
          ) : (
            [...clips].reverse().map(c => (
              <div key={c.id} onClick={() => onEditClip(c.id)} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between hover:bg-slate-100/50 transition-all cursor-pointer text-xs">
                <div className="min-w-0 flex-1 pr-4">
                  <div className="font-display font-bold text-slate-800 text-sm truncate">{c.hook || '(ไม่มีประโยค Hook เปิดหัว)'}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-1 font-bold">DATE: {fmtDate(c.postedAt)} · VIEWS 7D: {fmtNum(c.views7d || 0)} views</div>
                </div>
                <div className="text-right flex-shrink-0 font-mono font-bold text-emerald-800 text-sm">฿{fmtNum(c.gmv || 0)}</div>
              </div>
            ))
          )}
        </div>
      </div>

      <button onClick={onDelete} className="w-full bg-slate-100 text-slate-400 hover:bg-rose-50 hover:text-rose-600 text-xs font-semibold py-3.5 rounded-2xl border border-slate-200/40 transition-all">⚙️ Delete item entirely from main platform</button>
    </div>
  );
}

function SplitterSection({ product }) {
  const [pillarId, setPillarId] = useState(''); const [painId, setPainId] = useState('');
  const [angleId, setAngleId] = useState(''); const [persona, setPersona] = useState('');
  const [situation, setSituation] = useState(''); const [emotion, setEmotion] = useState('');
  const [format, setFormat] = useState(''); const [duration, setDuration] = useState('45');
  const [hook, setHook] = useState(''); const [copied, setCopied] = useState(false);

  const generatePrompt = () => {
    const p = product;
    const selectedPillar = DEFAULT_PILLARS.find(x => x.id === pillarId);
    const selectedPain = (p.pains || []).find(x => x.id === painId);
    const selectedAngle = (p.angles || []).find(x => x.id === angleId);
    const catInfo = getAbcdInfo(p.category);

    return `เขียนสคริปต์ TikTok Shop สำหรับช่อง PEEM6PACK (Fitness Affiliate Creator)

[สินค้าหลัก]
ชื่อ: ${p.name || 'ไม่ระบุ'} ${p.brand ? `แบรนด์ ${p.brand}` : ''}
หมวดสินค้า: ${catInfo.label}

[เกณฑ์วิเคราะห์คำสั่งคอนเทนต์]
Pillar ช่อง: ${selectedPillar ? `${selectedPillar.id} - ${selectedPillar.name} (${selectedPillar.desc})` : 'ตามความเหมาะสม'}
Pain Point ลูกค้า: ${selectedPain ? selectedPain.text : 'ปัญหาทั่วไปที่คนรักสุขภาพเจอ'}
Angle คอนเทนต์: ${selectedAngle ? selectedAngle.text : 'มุมเล่าเน้นประโยชน์ใช้งานจริง'}

[สูตรผสมสับแถวคลิป (Splitter Combo)]
กลุ่มเป้าหมาย (Persona): ${persona || 'คนรักสุขภาพทั่วไป'}
สถานการณ์จริง (Situation): ${situation || 'ชีวิตประจำวัน'}
อารมณ์นำสายตา (Emotion): ${emotion || 'ต้องการความคุค่าและผลลัพธ์'}
รูปแบบสคริปต์ (Format): ${format || 'รีวิวการใช้งานสไตล์เพื่อนแนะนำ'}
${hook ? `\nHook เปิดคลิปบังคับใช้: "${hook}"` : ''}
ระยะเวลาความยาวคลิป: ${duration} วินาที

[เงื่อนไขการเขียนและสไตล์ช่อง]
- พูดคุยสไตล์เพื่อนแนะนำเพื่อน ตบมุกด้วยความเป็นกันเอง ไม่วิชาการจ๋าเกินไป
- ตัวตนของ ภีม: ชายอายุ 31 ปี ฟิตเนสอินฟลูเอนเซอร์ในไทย หุ่นดี ออกกำลังกายจริง ใช้จริง
- โครงสร้าง: Hook 3 วินาทีแรก -> เปิดประเด็นความเจ็บปวด -> นำเสนอผลลัพธ์ของสินค้า -> CTA (Soft Sell ตะกร้าเหลือง)
- ไม่ฮาร์ดเซลล์ ไม่เคลมสรรพคุณเกินจริง เน้น Value ก่อนขายเสมอ

[กรอบผลลัพธ์ที่ต้องการ (Output)]
1. Hook ทางเลือกเพิ่มเติม 3 แบบ
2. บทสคริปต์เต็มแบบตารางแบ่งช่องเวลา: วินาทีที่ / ฉากที่เห็นในกล้อง (Visual) / คำพูดที่ต้องอัดเสียง (Voiceover)
3. ข้อความตัวหนังสือซับไตเติ้ลหลัก (Text Overlay) ปักหมุด 3 จุดสำคัญ
4. แคปชั่นแคปโพสต์ + แฮชแท็กช่องหลัก (#PEEM6PACK และที่เกี่ยวข้อง)`;
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatePrompt()); setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {}
  };

  return (
    <div className="bg-[#012b25] text-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#043d34] space-y-4">
      <div><h3 className="font-display text-lg flex items-center gap-2 text-[#bcd924]"><Wand2 className="w-5 h-5" /> ระบบเครื่องปั่นสคริปต์ Splitter Engine v2</h3><p className="text-xs text-emerald-300">กดจับคู่ตัวแปรกวนพอร์ตรหัสคอนเทนต์เพื่อดีด Prompt ป้อนคุยกับ Claude/ChatGPT ได้ทันที</p></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div><label className="text-[10px] uppercase font-bold text-emerald-300 block mb-1">Pillar หลัก</label><select value={pillarId} onChange={e=>setPillarId(e.target.value)} className="w-full px-3 py-2.5 bg-[#033c32] border border-[#075246] rounded-xl focus:outline-none">{<option value="">-- เลือก --</option>}{DEFAULT_PILLARS.map(pl=><option key={pl.id} value={pl.id}>{pl.id} - {pl.name}</option>)}</select></div>
        <div><label className="text-[10px] uppercase font-bold text-emerald-300 block mb-1">Pain Point</label><select value={painId} onChange={e=>setPainId(e.target.value)} className="w-full px-3 py-2.5 bg-[#033c32] border border-[#075246] rounded-xl focus:outline-none">{<option value="">-- เลือก --</option>}{(product.pains || []).map(pn=><option key={pn.id} value={pn.id}>{truncate(pn.text, 25)}</option>)}</select></div>
        <div><label className="text-[10px] uppercase font-bold text-emerald-300 block mb-1">Angle เล่า</label><select value={angleId} onChange={e=>setAngleId(e.target.value)} className="w-full px-3 py-2.5 bg-[#033c32] border border-[#075246] rounded-xl focus:outline-none">{<option value="">-- เลือก --</option>}{(product.angles || []).map(an=><option key={an.id} value={an.id}>{truncate(an.text, 25)}</option>)}</select></div>
        <div><label className="text-[10px] uppercase font-bold text-emerald-300 block mb-1">Persona</label><select value={persona} onChange={e=>setPersona(e.target.value)} className="w-full px-3 py-2.5 bg-[#033c32] border border-[#075246] rounded-xl focus:outline-none">{<option value="">-- เลือก --</option>}{SPLITTER_OPTIONS.persona.map(ps=><option key={ps} value={ps}>{ps}</option>)}</select></div>
        <div><label className="text-[10px] uppercase font-bold text-[#bcd924] block mb-1">Situation</label><select value={situation} onChange={e=>setSituation(e.target.value)} className="w-full px-3 py-2.5 bg-[#033c32] border border-[#075246] rounded-xl focus:outline-none">{<option value="">-- เลือก --</option>}{SPLITTER_OPTIONS.situation.map(st=><option key={st} value={st}>{st}</option>)}</select></div>
        <div><label className="text-[10px] uppercase font-bold text-emerald-300 block mb-1">Emotion</label><select value={emotion} onChange={e=>setEmotion(e.target.value)} className="w-full px-3 py-2.5 bg-[#033c32] border border-[#075246] rounded-xl focus:outline-none">{<option value="">-- เลือก --</option>}{SPLITTER_OPTIONS.emotion.map(em=><option key={em} value={em}>{em}</option>)}</select></div>
        <div><label className="text-[10px] uppercase font-bold text-[#bcd924] block mb-1">Format</label><select value={format} onChange={e=>setFormat(e.target.value)} className="w-full px-3 py-2.5 bg-[#033c32] border border-[#075246] rounded-xl focus:outline-none">{<option value="">-- เลือก --</option>}{SPLITTER_OPTIONS.format.map(fm=><option key={fm} value={fm}>{fm}</option>)}</select></div>
        <div><label className="text-[10px] uppercase font-bold text-emerald-300 block mb-1">ความยาวสคริปต์ (วิ)</label><input type="number" value={duration} onChange={e=>setDuration(e.target.value)} className="w-full px-3 py-2.5 bg-[#033c32] border border-[#075246] rounded-xl focus:outline-none font-mono" /></div>
      </div>
      <div><label className="text-[10px] uppercase font-bold text-emerald-300 block mb-1">ประโยค Hook เปิดหัว (Optional)</label><input value={hook} onChange={e=>setHook(e.target.value)} placeholder="ใส่ Hook ที่ระบุชัดเจน..." className="w-full text-xs px-4 py-2.5 bg-[#033c32] border border-[#075246] rounded-xl focus:outline-none placeholder:text-emerald-700 text-white" /></div>
      <button onClick={handleCopy} className={`w-full text-xs font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 ${copied ? 'bg-emerald-500 text-white' : 'bg-[#bcd924] text-[#0d2a23] hover:bg-[#a9c41d] shadow-md'}`}>{copied ? <><CheckCircle2 className="w-4 h-4" /> ปั้นพรอมต์ส่งเข้าระบบเรียบร้อย วางต่อได้เลย!</> : <><Copy className="w-4 h-4" /> เจนเนอเรต AI Copy Prompt สคริปต์</>}</button>
      
      <details className="mt-3 group"><summary className="text-xs text-emerald-400 font-bold cursor-pointer hover:text-emerald-200 transition-all select-none">▸ คลิกดูข้อความ Prompt ดิบก่อนส่งสิทธิ์</summary><pre className="text-[10px] bg-emerald-950/80 p-4 border border-[#05463a] rounded-2xl mt-3 overflow-x-auto whitespace-pre-wrap text-emerald-100 font-mono leading-relaxed">{generatePrompt()}</pre></details>
    </div>
  );
}

function LockListPage({ lockedProducts, products, clips, onSelectProduct, onUnlock, onLockNew }) {
  const monthKey = currentMonth();

  const categorizedLocked = useMemo(() => {
    const result = { HOT: [], STEADY: [], PASSIVE: [] };
    if (!Array.isArray(products) || !Array.isArray(clips)) return result;

    ['A', 'B', 'C', 'D'].forEach(cat => {
      const fullStack = getCategoryStack(products, clips, cat);
      const lockedIds = new Set(lockedProducts.filter(p => p.category === cat).map(p => p.id));
      const filteredStack = fullStack.filter(s => lockedIds.has(s.product.id));
      
      filteredStack.forEach(s => {
        if (s.tier === 'HOT') result.HOT.push(s);
        else if (s.tier === 'STEADY') result.STEADY.push(s);
        else result.PASSIVE.push(s);
      });
    });
    return result;
  }, [products, clips, lockedProducts]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="font-display text-xl text-slate-800">เป้าหมายยุทธศาสตร์ Lock List เดือนนี้</h2><p className="text-xs text-slate-400">ควบคุมสัดส่วน Content Frequency (HOT / STEADY / PASSIVE)</p></div>
        <button onClick={onLockNew} className="bg-[#012b25] text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-sm">+ ล็อกเป้าหมายเพิ่ม</button>
      </div>

      {lockedProducts.length === 0 ? (
        <div className="bg-white border border-[#e9eceb] rounded-3xl p-8 text-center text-slate-400 font-medium shadow-sm">ไม่มีข้อมูลสินค้าที่ตรึงเป้าในเดือนนี้</div>
      ) : (
        <div className="space-y-6">
          {Object.entries(categorizedLocked).map(([tier, list]) => {
            if (list.length === 0) return null;
            const meta = {
              HOT: { label: '🔥 HOT STACK (เป้าหมาย 3-4 คลิป/สัปดาห์)', color: 'text-rose-600', bg: 'bg-rose-50' },
              STEADY: { label: '⚡ STEADY STACK (เป้าหมาย 1-2 คลิป/สัปดาห์)', color: 'text-[#2563eb]', bg: 'bg-blue-50' },
              PASSIVE: { label: '💤 PASSIVE STACK (เป้าหมาย 2-3 คลิป/เดือน)', color: 'text-slate-600', bg: 'bg-slate-50' }
            }[tier];

            return (
              <div key={tier} className="bg-white border border-[#e9eceb] rounded-3xl p-5 shadow-sm space-y-4">
                <div className={`p-3 rounded-2xl flex items-center justify-between font-bold text-xs ${meta.bg} ${meta.color}`}>
                  <span>{meta.label}</span>
                  <span className="font-mono">{list.length} แบรนด์</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {list.map(s => {
                    const made = clips.filter(c => c.productId === s.product.id && c.postedAt?.slice(0, 7) === monthKey).length;
                    const target = s.product.locked?.targetClips || s.targetMonth || 1;
                    const pct = Math.min(100, Math.round((made / target) * 100));
                    const catInfo = getAbcdInfo(s.product.category);

                    return (
                      <div key={s.product.id} className="border border-slate-100 p-4 rounded-2xl flex flex-col justify-between space-y-3 bg-slate-50/50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-md font-bold text-xs flex items-center justify-center ${catInfo.bg} text-white`}>{catInfo.short}</div>
                            <span className="font-display font-bold text-sm text-[#012b25] truncate max-w-[160px]">{s.product.name}</span>
                          </div>
                          <button onClick={() => onUnlock(s.product.id)} className="text-slate-400 hover:text-rose-600 transition-colors">🔓 ปลดล็อก</button>
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-500 mb-1">
                            <span>ยอดทำจริงเทียบกับเป้าหมายความถี่:</span>
                            <span>{made} / {Math.round(target)} คลิป ({pct}%)</span>
                          </div>
                          <div className="w-full h-2 bg-slate-200/60 rounded-full overflow-hidden">
                            <div className="h-full bg-[#bcd924] rounded-full transition-all duration-300" style={{ width: `${pct}%` }}></div>
                          </div>
                        </div>

                        <button onClick={() => onSelectProduct(s.product.id)} className="w-full bg-white text-slate-600 text-xs font-bold py-2.5 rounded-xl text-center border border-slate-200 hover:bg-slate-50 transition-all">เปิดดูสเปก & ปั่นบทสคริปต์ 👉</button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ClipLogPage({ products, clips, onEditClip }) {
  const [search, setSearch] = useState(''); 
  const [period, setPeriod] = useState('30');
  const [sortOrder, setSortOrder] = useState('desc'); 

  const filtered = useMemo(() => {
    if (!Array.isArray(clips)) return [];
    return clips.filter(c => {
      if (search && !c.hook?.toLowerCase().includes(search.toLowerCase())) return false;
      if (period !== 'all') { const cutoff = Date.now() - Number(period) * 86400000; if (new Date(c.postedAt).getTime() < cutoff) return false; }
      return true;
    }).sort((a, b) => {
      const timeA = new Date(a.postedAt).getTime();
      const timeB = new Date(b.postedAt).getTime();
      return sortOrder === 'desc' ? timeB - timeA : timeA - timeB;
    });
  }, [clips, search, period, sortOrder]);

  return (
    <div className="bg-white border border-[#e9eceb] rounded-3xl p-6 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="font-display text-base text-[#012b25]">📋 ประวัติ Logs รายชิ้นงาน</h3>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}
            className="flex items-center gap-1.5 text-xs font-bold bg-[#f3f6f5] hover:bg-slate-200 px-3.5 py-2 rounded-xl text-[#012b25] transition-all"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>เรียง: {sortOrder === 'desc' ? 'ลงหลังสุดขึ้นก่อน' : 'ลงเก่าสุดขึ้นก่อน'}</span>
          </button>
          
          <div className="flex gap-1">
            {['7', '30', 'all'].map(p => (
              <button key={p} onClick={() => setPeriod(p)} className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border ${period === p ? 'bg-[#012b25] text-white border-transparent' : 'bg-slate-50 text-slate-600'}`}>{p === 'all' ? 'ทั้งหมด' : `${p} วันล่าสุด`}</button>
            ))}
          </div>
        </div>
      </div>
      <div className="relative"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search clip hook..." className="w-full pl-10 pr-4 py-2.5 bg-[#f3f6f5] border border-transparent rounded-full text-xs focus:outline-none focus:border-[#012b25]" /><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /></div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse text-slate-600">
          <thead>
            <tr className="bg-slate-50/80 font-bold border-b border-slate-100 text-slate-400 uppercase text-[10px] tracking-wider">
              <th className="p-3 cursor-pointer hover:text-slate-800 transition-colors" onClick={() => setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc')}>
                วันที่ลง {sortOrder === 'desc' ? '▼' : '▲'}
              </th>
              <th className="p-3">สินค้าหลัก</th>
              <th className="p-3">สคริปต์ Hook</th>
              <th className="p-3">การเงิน (Paid/Pending/Failed)</th>
              <th className="p-3">Gencode</th>
              <th className="p-3 text-right">Views 7d</th>
              <th className="p-3 text-right">GMV สรุป</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filtered.map(c => {
              const prod = products.find(p=>p.id === c.productId);
              const payStatus = c.paymentStatus || 'pending';
              const payMeta = {
                paid: { label: 'Paid', bg: 'bg-[#e2f7e4] text-[#1d7c2a]' },
                pending: { label: 'Pending', bg: 'bg-[#fef3c7] text-[#d97706]' },
                failed: { label: 'Failed', bg: 'bg-[#fee2e2] text-[#dc2626]' }
              }[payStatus];

              return (
                <tr key={c.id} onClick={() => onEditClip(c.id)} className="hover:bg-slate-50/50 cursor-pointer transition-colors text-slate-700">
                  <td className="p-3 whitespace-nowrap font-mono">{fmtDate(c.postedAt)}</td>
                  <td className="p-3 font-semibold text-slate-900 truncate max-w-[120px]">{c.isV ? '📚 สาระความรู้ (V)' : (prod?.name || '-')}</td>
                  <td className="p-3 truncate max-w-[180px] text-slate-500 font-medium">{c.hook || '-'}</td>
                  <td className="p-3">
                    <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full ${payMeta.bg}`}>{payMeta.label}</span>
                  </td>
                  <td className="p-3">
                    {c.gencodeVerified ? (
                      <span className="text-[10px] bg-emerald-50 text-[#1d7c2a] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 w-max"><Check className="w-3 h-3" /> Verified</span>
                    ) : (
                      <span className="text-[10px] bg-slate-100 text-slate-400 font-semibold px-2 py-0.5 rounded-md flex items-center gap-1 w-max"><Clock className="w-3 h-3" /> Unverified</span>
                    )}
                  </td>
                  <td className="p-3 text-right font-mono font-medium">{fmtNum(c.views7d)}</td>
                  <td className="p-3 text-right font-mono font-bold text-emerald-700">฿{fmtNum(c.gmv)}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ============================================================================
// [ZONE 4.5] DYNAMIC PORTFOLIO ANALYTICS (บอร์ดสถิติวิเคราะห์กลยุทธ์พอร์ต)
// ============================================================================
function DashboardView({ products, clips, onMakeSimilar, onEditClip, onMarkRepostDone, onPromoteToA }) {
  const [period, setPeriod] = useState('30');
  const days = Number(period);
  const cutoff = Date.now() - days * 86400000;
  const recent = useMemo(() => clips.filter(c => new Date(c.postedAt).getTime() >= cutoff), [clips, cutoff]);

  const totalClips7d = clips.length || 1;

  const statsAOV = useMemo(() => {
    const totalGmv = clips.reduce((sum, c) => sum + (Number(c.gmv) || 0), 0);
    const totalClipsWithSales = clips.filter(c => Number(c.gmv) > 0).length || 1;
    return Math.round(totalGmv / totalClipsWithSales); 
  }, [clips, totalClips7d]);

  const portfolioBalance = useMemo(() => getPortfolioBalance(products, clips, days), [products, clips, days]);

  const recommendations = useMemo(() => {
    if (!Array.isArray(products)) return [];
    return products.map(p => {
      const sales = getProductSales(p, clips, days);
      const tiktok = sales.fromManual;
      const clipCount = sales.clipCount;
      const gmvVal = sales.primary;

      if (sales.hasManual) {
        if (tiktok >= 30000 && clipCount < 3) return { product: p, rec: 'ดันด่วน', reason: `TikTok ฿${fmtNum(tiktok)} แต่ลงแค่ ${clipCount} คลิป — ดันให้ถี่ขึ้นอีก`, color: 'bg-[#dc2626]', icon: Flame };
        if (tiktok >= 30000) return { product: p, rec: 'ดันต่อ', reason: `TikTok ฿${fmtNum(tiktok)} — สินค้าหลักสร้างทราฟิกพอร์ต`, color: 'bg-[#1d7c2a]', icon: TrendingUp };
        if (tiktok >= 10000 && clipCount < 3) return { product: p, rec: 'ลงเพิ่ม', reason: `ขายดีบน TikTok ฿${fmtNum(tiktok)} — ลงคลิปสับรหัสเพิ่ม`, color: 'bg-[#d97706]', icon: Lightbulb };
        if (tiktok >= 10000) return { product: p, rec: 'ทำต่อ', reason: `TikTok ฿${fmtNum(tiktok)}`, color: 'bg-blue-600', icon: Activity };
        if (tiktok >= 1000) return { product: p, rec: 'เปลี่ยนมุม', reason: `TikTok ฿${fmtNum(tiktok)} — เร่งหา Angle และ Pain ชุดใหม่`, color: 'bg-[#7c3aed]', icon: Lightbulb };
        if (clipCount >= 3) return { product: p, rec: 'พักดู', reason: `ลงตั้ง ${clipCount} คลิปแต่ยอด TikTok เกือบ 0`, color: 'bg-slate-500', icon: TrendingDown };
        return null;
      }

      if (clipCount === 0) return null;
      const revPerClip = gmvVal / clipCount;
      if (revPerClip >= 2000 && clipCount >= 2) return { product: p, rec: 'ดันต่อ', reason: `คอมมิชชัน ฿${fmtNum(Math.round(revPerClip))}/คลิป — เอนจินประสิทธิภาพสูง`, color: 'bg-[#1d7c2a]', icon: TrendingUp };
      return null;
    }).filter(Boolean).sort((a, b) => b.product?.scorePct - a.product?.scorePct);
  }, [products, clips, days]);

  const eCandidates = useMemo(() => getECandidates(products, clips), [products, clips]);
  const cutCandidates = useMemo(() => getProductsToCut(products, clips), [products, clips]);

  const roi = useMemo(() => getROIAnalysis(products, clips, MONTHLY_REVENUE_TARGET), [products, clips]);

  const abcdStats = useMemo(() => {
    const stats = { A: { gmv: 0, count: 0 }, B: { gmv: 0, count: 0 }, C: { gmv: 0, count: 0 }, D: { gmv: 0, count: 0 } };
    recent.filter(c => !c.isV).forEach(c => {
      const p = products.find(pp => pp.id === c.productId);
      if (p?.category && stats[p.category]) {
        stats[p.category].gmv += Number(c.gmv) || 0;
        stats[p.category].count += 1;
      }
    });
    return stats;
  }, [products, recent]);

  const maxCategoryGmv = Math.max(...Object.values(abcdStats).map(s => s.gmv), 1);

  const pillarStats = useMemo(() => {
    const stats = {}; DEFAULT_PILLARS.forEach(p => stats[p.id] = 0);
    recent.forEach(c => {
      if (c.pillarId && stats[c.pillarId] !== undefined) stats[c.pillarId] += 1;
    });
    return stats;
  }, [recent]);

  const maxPillarCount = Math.max(...Object.values(pillarStats), 1);

  const typeStats = useMemo(() => {
    const stats = {}; PRODUCT_TYPES.forEach(t => stats[t.id] = { clips: 0, gmv: 0 });
    recent.filter(c => !c.isV).forEach(c => {
      const p = products.find(pp => pp.id === c.productId);
      if (p?.productType && stats[p.productType]) {
        stats[p.productType].clips += 1;
        stats[p.productType].gmv += Number(c.gmv) || 0;
      }
    });
    return stats;
  }, [products, recent]);

  const maxTypeGmv = Math.max(...Object.values(typeStats).map(s => s.gmv), 1);

  const monthlyTrend = useMemo(() => {
    const months = []; const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const ymKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const mclips = clips.filter(c => c.postedAt?.slice(0, 7) === ymKey);
      months.push({ 
        key: ymKey, 
        label: d.toLocaleDateString('th-TH', { month: 'short' }), 
        clipCount: mclips.length, 
        gmv: mclips.reduce((s, c) => s + (Number(c.gmv) || 0), 0) 
      });
    }
    return months;
  }, [clips]);

  const maxMonthlyClips = Math.max(...monthlyTrend.map(m => m.clipCount), 1);
  const maxMonthlyGmv = Math.max(...monthlyTrend.map(m => m.gmv), 1);

  return (
    <div className="space-y-6">
      <div className="bg-[#012b25] text-white rounded-3xl p-6 md:p-8 shadow-xl border border-[#043d34] space-y-6">
        <div>
          <h3 className="font-display text-lg text-lime-400 flex items-center gap-2"><Target className="w-5 h-5" /> Strategic Target Planner (คำนวณจำนวนสินค้าพิชิตเป้าหมาย)</h3>
          <p className="text-xs text-emerald-300">ประมวลผลเป้าค่าคอมมิชชันรายเดือน ฿{fmtNum(MONTHLY_REVENUE_TARGET)} เทียบสัดส่วนราคากับ % คอมมิชชันสะสมจริง</p>
        </div>

        <div className="bg-[#033c32] p-5 rounded-2xl border border-[#065345] grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <span className="text-[10px] text-emerald-300 font-bold block uppercase tracking-wider">ประมาณการค่าคอมมิชชันปัจจุบัน</span>
            <span className="font-display text-xl text-white">฿{fmtNum(Math.round(roi.totalCommRevenue))}</span>
          </div>
          <div>
            <span className="text-[10px] text-emerald-300 font-bold block uppercase tracking-wider">ความคืบหน้าถึงเป้าหมาย</span>
            <span className="font-display text-xl text-[#bcd924]">{roi.pct}%</span>
          </div>
          <div>
            <span className="text-[10px] text-emerald-300 font-bold block uppercase tracking-wider">ยอดเงินที่ยังขาด</span>
            <span className="font-display text-xl text-rose-400">฿{fmtNum(Math.round(roi.gap))}</span>
          </div>
        </div>

        <div className="space-y-2.5">
          <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider block">📊 จำนวนชิ้นที่ต้องการขายคนเดียวแยกรายสินค้าเพื่อบรรลุเป้าหมายช่องหลัก:</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
            {roi.items.map(i => {
              const commPerUnit = (i.price * i.commission) / 100;
              const unitsNeeded = commPerUnit > 0 ? Math.ceil(MONTHLY_REVENUE_TARGET / commPerUnit) : 0;
              return (
                <div key={i.product.id} className="bg-[#04342d]/80 border border-[#064a3f] p-4 rounded-2xl flex flex-col justify-between">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-display text-sm text-white font-bold leading-tight">{i.product.name}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${getAbcdInfo(i.product.category).bg}`}>{i.product.category}</span>
                  </div>
                  <div className="flex justify-between items-baseline pt-4 border-t border-[#064a3f]/60 mt-3 text-xs">
                    <span className="text-emerald-300 font-medium font-mono">฿{fmtNum(commPerUnit)} คอมมิชชัน/ชิ้น</span>
                    <span className="font-display text-sm text-[#bcd924] font-bold font-mono">ต้องขาย {fmtNum(unitsNeeded)} ชิ้น</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-1.5 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm self-end">
        {['7', '30', '90'].map(d => (
          <button key={d} onClick={() => setPeriod(d)} className={`text-xs font-bold px-4 py-2 rounded-xl border transition-all ${period === d ? 'bg-[#012b25] text-white border-transparent' : 'bg-slate-50 text-slate-500'}`}>{d} วันล่าสุด</button>
        ))}
      </div>

      {portfolioBalance && (
        <div className="bg-white border border-[#e9eceb] rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="font-display text-base text-[#012b25] flex items-center gap-1.5"><Target className="w-4 h-4 text-emerald-800" /> ตรวจสอบสมดุลสัดส่วนช่อง (Portfolio Balance Target)</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">เป้าหมายมาตรฐาน: A 60% / B 25% / C 10% / D 5% (คำนวณจากยอด GMV {period} วันล่าสุด)</p>
          
          <div className="space-y-4 pt-1">
            {Object.entries(portfolioBalance).map(([k, b]) => {
              const info = getAbcdInfo(k);
              const statusColors = b.status === 'ok' ? 'bg-[#1d7c2a]' : 'bg-[#d97706]';
              return (
                <div key={k} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded ${info.bg} text-white flex items-center justify-center text-[10px]`}>{k}</div>
                      <span className="text-slate-600">{info.desc}</span>
                    </div>
                    <span className="font-mono text-slate-700">{b.actual}% / {b.target}% <span className="text-slate-400">({b.status === 'ok' ? 'OK' : `สัดส่วนคลาดเคลื่อน ${b.diff > 0 ? '+' : ''}${b.diff}%`})</span></span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${statusColors}`} style={{ width: `${Math.min(100, b.actual)}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[#e9eceb] rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="font-display text-base text-[#012b25] flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-purple-600" /> 💎 ตรวจพบสินค้านางฟ้า (E-Candidates)</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">แบรนด์ระดับดาวรุ่งรอขยับหมวดเป็น A</p>
          <div className="space-y-3">
            {eCandidates.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-8">ยังไม่ตรวจพบแบรนด์ดาวรุ่งที่มีผลงานเทียบเท่านางฟ้า</p>
            ) : (
              eCandidates.map(e => {
                const dec = getDecisionInfo(e.product.decision);
                return (
                  <div key={e.product.id} className="p-4 bg-gradient-to-br from-purple-50/20 to-white border border-purple-100 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-display font-bold text-[#012b25] text-sm">{e.product.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${dec.bg} ${dec.text}`}>{dec.label}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {e.reasons.map((r, idx) => (
                        <span key={idx} className="text-[9px] bg-purple-50 text-purple-700 font-bold px-2 py-0.5 rounded-md">✓ {r}</span>
                      ))}
                    </div>
                    <button onClick={() => onPromoteToA(e.product.id)} className="w-full bg-[#012b25] text-white font-bold text-xs py-2 rounded-xl shadow-sm">โปรโมตขึ้นพอร์ตระดับ A 🔥</button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="bg-white border border-[#e9eceb] rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="font-display text-base text-[#012b25] flex items-center gap-1.5"><AlertTriangle className="w-4 h-4 text-rose-500" /> ⚠️ เกณฑ์พิจารณาถอดออกจากสิทธิ์พอร์ต (Cut Candidates)</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">แบรนด์ที่ควรหยุดทำคลิปเพื่อเซฟงบแอดสเปน</p>
          <div className="space-y-3">
            {cutCandidates.length === 0 ? (
              <p className="text-xs text-slate-400 italic text-center py-8">ยินดีด้วย! ยังไม่พบแบรนด์สินค้าเข้าเกณฑ์ถอดสิทธิ์วิกฤต</p>
            ) : (
              cutCandidates.map(c => (
                <div key={c.product.id} className="p-4 bg-rose-50/30 border border-rose-100 rounded-2xl space-y-2">
                  <div className="font-display font-bold text-rose-950 text-sm">{c.product.name}</div>
                  <div className="flex flex-wrap gap-1">
                    {c.reasons.map((r, idx) => (
                      <span key={idx} className="text-[9px] bg-rose-100/50 text-rose-700 font-bold px-2 py-0.5 rounded-md">{r}</span>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-[#e9eceb] rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="font-display text-base text-[#012b25]">🎯 วิเคราะห์สัดส่วนผลงานรายหมวด ABCD ({period}d)</h3>
          <div className="space-y-4">
            {Object.entries(abcdStats).map(([k, s]) => {
              const info = getAbcdInfo(k);
              const barWidth = Math.round((s.gmv / maxCategoryGmv) * 100);
              return (
                <div key={k} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                    <div className="flex items-center gap-2">
                      <div className={`w-5 h-5 rounded ${info.bg} text-white flex items-center justify-center text-[10px]`}>{k}</div>
                      <span>{info.desc}</span>
                    </div>
                    <span className="font-mono text-slate-800">฿{fmtNum(s.gmv)} <span className="text-slate-400 font-normal">({s.count} คลิป, เฉลี่ย ฿{fmtNum(s.count > 0 ? Math.round(s.gmv / s.count) : 0)})</span></span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${info.bg}`} style={{ width: `${barWidth}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white border border-[#e9eceb] rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="font-display text-base text-[#012b25]">📚 อัตราการคุมสัดส่วน Variety ตามเสา Pillar ({period}d)</h3>
          <div className="space-y-4">
            {DEFAULT_PILLARS.map(p => {
              const count = pillarStats[p.id] || 0;
              const barWidth = Math.round((count / maxPillarCount) * 100);
              return (
                <div key={p.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600">
                    <span>{p.emoji} {p.id} - {p.desc}</span>
                    <span className="font-mono text-slate-800">{count} คลิป</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-[#7c3aed]" style={{ width: `${barWidth}%` }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#e9eceb] rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="font-display text-base text-[#012b25]">📅 เปรียบเทียบปริมาณคลิป และ ยอด GMV ตลอด 6 เดือนย้อนหลัง</h3>
        <div className="grid grid-cols-6 gap-3 pt-4">
          {monthlyTrend.map(m => {
            const clipH = Math.max(2, Math.round((m.clipCount / maxMonthlyClips) * 60));
            const gmvH = Math.max(2, Math.round((m.gmv / maxMonthlyGmv) * 60));
            return (
              <div key={m.key} className="text-center space-y-2">
                <div className="flex items-end justify-center gap-1.5 h-16">
                  <div className="w-3 bg-lime-400 rounded-t-md" style={{ height: `${clipH}px` }} title={`${m.clipCount} คลิป`} />
                  <div className="w-3 bg-rose-400 rounded-t-md" style={{ height: `${gmvH}px` }} title={`฿${fmtNum(m.gmv)}`} />
                </div>
                <div className="text-[10px] font-bold text-slate-400">{m.label}</div>
                <div className="text-[9px] font-mono font-bold text-slate-600">{m.clipCount} ค. / ฿{m.gmv >= 1000 ? Math.round(m.gmv / 1000) + 'k' : m.gmv}</div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-center gap-4 pt-2 text-[10px] font-bold">
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-lime-400 rounded" /> จำนวนคลิปโพสต์</div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-rose-400 rounded" /> ยอด GMV สะสม</div>
        </div>
      </div>

      <div className="bg-white border border-[#e9eceb] rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="font-display text-base text-[#012b25] flex items-center gap-1.5"><Lightbulb className="w-4 h-4 text-amber-500" /> 💡 คำแนะนำประมวลผลพอร์ตอัจฉริยะ (Recommendations)</h3>
        <div className="space-y-3">
          {recommendations.length === 0 ? (
            <p className="text-xs text-slate-400 italic text-center py-8">ป้อนสถิติตัวเลขจริงเพื่อรับข้อเสนอแนะเชิงพาณิชย์ระดับโปร</p>
          ) : (
            recommendations.map(r => {
              const catInfo = getAbcdInfo(r.product.category);
              return (
                <div key={r.product.id} className="p-3.5 bg-slate-50 border border-slate-100 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-md font-bold text-xs flex items-center justify-center ${catInfo.bg} text-white flex-shrink-0`}>{catInfo.short}</div>
                    <div>
                      <div className="font-bold text-slate-800">{r.product.name}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{r.reason}</div>
                    </div>
                  </div>
                  <span className={`text-[10px] font-bold text-white px-3 py-1.5 rounded-xl flex-shrink-0 ${r.color}`}>{r.rec}</span>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

function SettingsPage({ products, clips, migrationLog, onMigrate, onExport, onClearAll }) {
  const [rawJsonInput, setRawJsonInput] = useState('');
  const [appTheme, setAppTheme] = useState(true);
  const [appLanguage, setAppLanguage] = useState(true);
  const [app2FA, setApp2FA] = useState(false);
  const [pushNotif, setPushNotif] = useState(true);

  const notices = [
    {
      title: "📌 แนะนำกลยุทธ์ TikTok SEO ฉบับปี 2026",
      desc: "เจาะวิธีจับหัวอัลกอริทึมให้วิดีโอมีสิทธิ์แสดงหน้าแรก คัดเน้นการพูด Hook 3 วินาทีแรกควบคู่กับการพิมพ์ซับไตเติ้ลคำค้นหาหลักห้ามขัดเลี่ยง",
      date: "21 พ.ค. 2569",
      badge: "SEO Strategy"
    },
    {
      title: "🔥 มาตรการ Variety คุมพอร์ต ABCD ป้องกันช่องปลิว",
      desc: "สรุปขีดจำกัดความเสี่ยงช่องปลิว กรณีลงรหัสสินค้า A ซ้ำต่อเนื่องมากเกินไป แนะนำให้แทรกคลิป Value Content (V) หรือหมวด C ทราฟิกไดรฟเวอร์สลับแบบฟันปลา",
      date: "14 พ.ค. 2569",
      badge: "Variety Rules"
    },
    {
      title: "🛍️ เกณฑ์อัพเกรด Gencode ตะก้าแดงผ่าน TikTok Shop Ads",
      desc: "ตรวจจับและอัพเดทสถานะ Verified รหัสสินค้าของแคมเปญ เพื่อความโปร่งใสของตัวเลขรายได้หลังบ้านและการจัดทำระบบแทร็กเงินยอด Paid สถิติช่อง",
      date: "02 พ.ค. 2569",
      badge: "Advertiser Hub"
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="bg-white border border-[#e9eceb] rounded-3xl p-6 shadow-sm space-y-5 lg:col-span-1">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-display text-base text-[#012b25]">System Configuration</h3>
            <p className="text-xs text-slate-400 font-medium">เปิด-ปิดมาตรการจัดการแผงควบคุมระบบ</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between py-1">
              <div>
                <div className="text-xs font-bold text-[#012b25]">Appearance Mode</div>
                <p className="text-[10px] text-slate-400">สลับสไตล์แสงสว่างหน้าบ้านอัตโนมัติ</p>
              </div>
              <button onClick={() => setAppTheme(!appTheme)}>
                {appTheme ? <ToggleRight className="w-10 h-10 text-[#012b25]" /> : <ToggleLeft className="w-10 h-10 text-slate-300" />}
              </button>
            </div>
            
            <div className="flex items-center justify-between py-1">
              <div>
                <div className="text-xs font-bold text-[#012b25]">Thai Language Pack</div>
                <p className="text-[10px] text-slate-400">แปลเนื้อหาโมดูลและคำแนะนำเป็นภาษาไทย</p>
              </div>
              <button onClick={() => setAppLanguage(!appLanguage)}>
                {appLanguage ? <ToggleRight className="w-10 h-10 text-[#012b25]" /> : <ToggleLeft className="w-10 h-10 text-slate-300" />}
              </button>
            </div>

            <div className="flex items-center justify-between py-1">
              <div>
                <div className="text-xs font-bold text-[#012b25]">Two-Factor Auth (2FA)</div>
                <p className="text-[10px] text-slate-400">เพิ่มความปลอดภัยของสิทธิ์เชื่อมข้อมูลบัญชี</p>
              </div>
              <button onClick={() => setApp2FA(!app2FA)}>
                {app2FA ? <ToggleRight className="w-10 h-10 text-[#012b25]" /> : <ToggleLeft className="w-10 h-10 text-slate-300" />}
              </button>
            </div>

            <div className="flex items-center justify-between py-1">
              <div>
                <div className="text-xs font-bold text-[#012b25]">System Push Alerts</div>
                <p className="text-[10px] text-slate-400">รับสิทธิ์ข้อความเตือนเมื่อคลิปค้างสถิติเกินกำหนด</p>
              </div>
              <button onClick={() => setPushNotif(!pushNotif)}>
                {pushNotif ? <ToggleRight className="w-10 h-10 text-[#012b25]" /> : <ToggleLeft className="w-10 h-10 text-slate-300" />}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#e9eceb] rounded-3xl p-6 shadow-sm space-y-5 lg:col-span-2">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-display text-base text-[#012b25]">Database & Maintenance</h3>
            <p className="text-xs text-slate-400 font-medium">เครื่องมือโอนย้ายสิทธิ์และคุมระบบ Firestore</p>
          </div>

          <div className="space-y-4">
            <button onClick={onExport} className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl text-left hover:bg-slate-100/50 transition-colors shadow-sm flex items-center justify-between">
              <div>
                <div className="font-bold text-sm text-[#012b25]">💾 สร้างจุดสำรองข้อมูลดิจิทัล (Snapshot)</div>
                <p className="text-[11px] text-slate-400 mt-0.5">ดาวน์โหลดสถิติคลิปและสินค้าเข้าคอมพิวเตอร์เป็นไฟล์ .json</p>
              </div>
              <Download className="w-5 h-5 text-slate-400" />
            </button>

            <div className="bg-amber-50/50 border border-amber-200/60 rounded-2xl p-5 space-y-3">
              <h4 className="font-display text-xs text-amber-950 flex items-center gap-1.5">🔄 เครื่องมือโอนย้ายสิทธิ์ข้อมูลแอปเวอร์ชันเก่า (v1 {"->"} v2)</h4>
              <p className="text-[11px] text-amber-900 leading-relaxed font-medium">เทวางรหัสข้อความ JSON ดั้งเดิมที่คุณเซฟจากระบบโมโนลิธตัวเก่าลงช่องด้านล่าง เอนจินย้ายข้อมูลจะทลายขีดจำกัด 1MB ด้วยการสับยิงเซฟแยก Subcollection รายผลิตภัณฑ์ให้ทันทีในคลิกเดียว</p>
              <textarea value={rawJsonInput} onChange={e=>setRawJsonInput(e.target.value)} placeholder="วางรหัสข้อความสำรองของคุณที่นี่..." rows={3} className="w-full p-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-mono focus:outline-none resize-none" />
              <button type="button" onClick={() => { if(rawJsonInput.trim()) onMigrate(rawJsonInput.trim()); }} className="w-full bg-[#012b25] hover:bg-[#033c32] text-white font-bold py-3 rounded-2xl text-xs transition-all shadow-md">⚡ เริ่มต้นตรวจสอบความถูกต้องและโอนย้ายเข้า Subcollection</button>
              {migrationLog && <div className="p-3.5 bg-white border border-amber-200 text-amber-950 font-mono text-[10px] rounded-2xl mt-2 whitespace-pre-wrap leading-normal">{migrationLog}</div>}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">ล้างกระดาน:</span>
              <button onClick={onClearAll} className="p-3 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-2xl font-bold text-xs transition-all border border-rose-100">🗑️ ทำลายล้างคลังฐานข้อมูลจริงทั้งหมดถาวร</button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#e9eceb] rounded-3xl p-6 md:p-8 shadow-sm space-y-5">
        <div>
          <h3 className="font-display text-lg text-[#012b25] flex items-center gap-1.5"><FileText className="w-5 h-5 text-emerald-800" /> บอร์ดแผนงานยุทธศาสตร์ประจำสัปดาห์ (Notices)</h3>
          <p className="text-xs text-slate-400 font-medium">บันทึกระเบียบวิธีเล่นและเทรนด์อัลกอริทึม TikTok สะสมเพื่อดึงประสิทธิภาพช่องสูงสุด</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {notices.map((n, idx) => (
            <div key={idx} className="bg-slate-50 border border-slate-100 rounded-2xl p-5 flex flex-col justify-between hover:scale-[1.01] transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] bg-emerald-50 text-[#0f5144] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">{n.badge}</span>
                  <span className="text-[10px] text-slate-400 font-bold font-mono">{n.date}</span>
                </div>
                <h4 className="font-display text-[#012b25] text-sm leading-snug">{n.title}</h4>
                <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-4">{n.desc}</p>
              </div>
              <button className="text-[10px] font-bold text-[#012b25] flex items-center gap-1 hover:underline mt-4">อ่านสิทธิ์รายละเอียดฉบับเต็ม →</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
