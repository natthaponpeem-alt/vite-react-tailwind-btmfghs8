import React, { useState, useEffect, useMemo } from 'react';
import { 
  Home, Package, Lock, BarChart3, Settings, Plus, X, Copy, Download, 
  Upload, Trash2, Edit3, ChevronRight, ChevronLeft, AlertCircle, 
  CheckCircle2, Clock, Zap, Target, Wand2, FileText, Sparkles, 
  Trophy, Search, RefreshCw, DollarSign, Activity, LayoutGrid, 
  List, ArrowUpDown, ExternalLink, Database, Flame, TrendingUp, 
  TrendingDown, AlertTriangle, Lightbulb, Repeat, Cloud, CloudOff, 
  User, Check, Eye, HelpCircle, Bell, ArrowUpRight
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
  apiKey: "AIzaSyDqum6bGwLqjInO04PCxuDV8pEl5UbwphI",
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
const TARGET_ANGLES = 7; 
const RESCORE_DAYS = 7; 
const PICK_THRESHOLD = 83; 
const WAIT_THRESHOLD = 55; 
const ARGOON_MAX = 18; 
const ARGOON_PASS = 15; 
const ARGOON_WATCH = 10; 
const WINNER_GMV = 1000; 
const CONCENTRATION_LIMIT = 60; 
const REPOST_INTERVALS = [7, 14, 30]; 
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
  A: { label: 'A — ขายดี', short: 'A', desc: 'สินค้าขายดี', bg: 'bg-[#0f5144]', text: 'text-[#0f5144]', border: 'border-emerald-100', lightBg: 'bg-emerald-50' },
  B: { label: 'B — มาใหม่', short: 'B', desc: 'สินค้าแนะนำ/กำลังมาแรง', bg: 'bg-blue-600', text: 'text-blue-600', border: 'border-blue-100', lightBg: 'bg-blue-50' },
  C: { label: 'C — ประหยัด', short: 'C', desc: 'สินค้าราคาจับต้องง่าย', bg: 'bg-amber-600', text: 'text-amber-600', border: 'border-amber-100', lightBg: 'bg-amber-50' },
  D: { label: 'D — คอมสูง', short: 'D', desc: 'สินค้าไฮเอนด์ค่าคอมหนา', bg: 'bg-purple-600', text: 'text-purple-600', border: 'border-purple-100', lightBg: 'bg-purple-50' },
  V: { label: 'V — Content', short: 'V', desc: 'คลิปให้คุณค่า/ความรู้', bg: 'bg-slate-500', text: 'text-slate-500', border: 'border-slate-100', lightBg: 'bg-slate-50' },
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

const CLIP_LEVELS = [
  { id: 'traffic', label: 'Traffic', color: 'bg-sky-500' }, 
  { id: 'consideration', label: 'Consideration', color: 'bg-purple-500' }, 
  { id: 'conversion', label: 'Conversion', color: 'bg-rose-500' }
];

// ============================================================================
// [ZONE 2] CORE CALCULATIONS & DATA FORMATTERS (ระบบประมวลผลข้อมูลหลังบ้าน)
// ============================================================================
const uid = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
const todayStr = () => new Date().toISOString().slice(0, 10);
const currentMonth = () => new Date().toISOString().slice(0, 7);
const daysSince = (iso) => !iso ? 999 : Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
const daysUntilRescore = (iso) => RESCORE_DAYS - daysSince(iso);
const fmtDate = (iso) => { if (!iso) return '-'; const d = new Date(iso); return `${d.getDate()}/${d.getMonth() + 1}/${(d.getFullYear() + 543).toString().slice(2)}`; };
const fmtNum = (n) => (n ?? 0).toLocaleString('th-TH');
const truncate = (s, n) => !s ? '' : s.length > n ? s.slice(0, n) + '…' : s;
const hoursSince = (iso) => !iso ? 999 : (Date.now() - new Date(iso).getTime()) / 3600000;

function getStatsPending(clips) { 
  const pending24h = [], pending7d = []; 
  clips.forEach(c => { 
    const hrs = hoursSince(c.postedAt); 
    if (hrs >= 22 && hrs <= 30 && !c.views24h) pending24h.push(c); 
    if (hrs >= 156 && hrs <= 204 && !c.views7d) pending7d.push(c); 
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
  else if (g7 !== null && !isNaN(g7)) { total += g7 > 0 ? 2 : 1; max += 3; } 
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

function autoClassify({ gmv30d, commission, tiktokRank, price }) { 
  const g = Number(gmv30d) || 0; const c = Number(commission) || 0; const rank = Number(tiktokRank) || 0; const pr = Number(price) || 0; 
  if (g >= 30000) { if (c >= 15) return { cat: 'A', label: 'A — ideal', reason: 'Mass + คอมดี = A ideal', confidence: 'high' }; return { cat: 'A', label: 'A (proven exception)', reason: 'Mass = ฐานรายได้แม้คอมต่ำ', confidence: 'high' }; } 
  if (g >= 10000) { if (pr > 0 && pr < 500 && c < 20) return { cat: 'C', label: 'C (low-price + mass)', reason: `ราคา ฿${pr} + GMV ฿${fmtNum(g)} = mass low-ticket → C traffic driver`, confidence: 'medium' }; if (c >= 20) return { cat: 'B', label: 'B → A potential', reason: 'กำลังพิสูจน์ตัว ใกล้ E', confidence: 'medium' }; return { cat: 'B', label: 'B', reason: 'Volume ปานกลาง — เทสต่อ', confidence: 'medium' }; } 
  if (g >= 1000) { if (pr >= 800 && c >= 20) return { cat: 'D', label: 'D (premium)', reason: `ราคา ฿${pr} + คอม ${c}% — กินกำไรเป็นรอบ ห้าม auto-promote A`, confidence: 'medium' }; if (pr > 0 && pr < 500) return { cat: 'C', label: 'C (low-price, low-vol)', reason: `ราคา ฿${pr} — traffic driver / repeat buy`, confidence: 'low' }; if (c >= 20) return { cat: 'D', label: 'D', reason: 'คอมสูงแต่ volume ไม่ถึง mass — D ตามนิยาม', confidence: 'medium' }; if (c >= 10) return { cat: 'C', label: 'C', reason: 'Volume น้อย คอมปานกลาง — ดู price/repeat-buy', confidence: 'low' }; return { cat: 'C', label: 'C / Cut', reason: 'Volume + คอมต่ำ — พิจารณาตัด', confidence: 'low' }; } 
  if (rank >= 1 && rank <= 5) return { cat: 'B', label: 'B (Top 1-5 untested)', reason: 'Mass ใน TikTok แต่ยังไม่เทสในช่อง', confidence: 'medium' }; 
  if (rank >= 6 && rank <= 20) return { cat: 'B', label: 'B (Top 10-20)', reason: 'Demand ปานกลาง — testing zone', confidence: 'medium' }; 
  return { cat: 'B', label: 'B (ใหม่)', reason: 'ยังไม่มี data — เริ่มเทส', confidence: 'low' }; 
}

function getPortfolioBalance(products, clips, days = 30) { 
  const byCat = { A: 0, B: 0, C: 0, D: 0 }; let total = 0; 
  products.forEach(p => { if (!['A', 'B', 'C', 'D'].includes(p.category)) return; const sales = getProductSales(p, clips, days); byCat[p.category] += sales.primary; total += sales.primary; }); 
  if (total === 0) return null; 
  return Object.fromEntries(Object.entries(byCat).map(([k, v]) => { const actual = Math.round((v / total) * 100); const target = PORTFOLIO_TARGET[k]; const diff = actual - target; return [k, { actual, target, diff, gmv: v, status: Math.abs(diff) <= 5 ? 'ok' : diff > 0 ? 'over' : 'under' }]; })); 
}

function getBlendedCommission(products, clips, days = 30) { 
  let weightedSum = 0, totalGMV = 0; const breakdown = []; 
  products.forEach(p => { const sales = getProductSales(p, clips, days); const c = Number(p.scorecard?.commission) || 0; if (sales.primary > 0 && c > 0) { weightedSum += sales.primary * c; totalGMV += sales.primary; breakdown.push({ product: p, gmv: sales.primary, commission: c, contribution: sales.primary * c }); } }); 
  if (totalGMV === 0) return null; 
  return { blended: Math.round((weightedSum / totalGMV) * 100) / 100, target: BLENDED_COMMISSION_TARGET, totalGMV, breakdown }; 
}

function getCategoryStack(products, clips, category) {
  const catProducts = products.filter(p => p.category === category);
  const withData = catProducts.map(p => {
    const sales30d = getProductSales(p, clips, 30).primary;
    const sales7d = getProductSales(p, clips, 7).primary;
    const momentum = (sales30d / 30) > 0 ? (sales7d / 7) / (sales30d / 30) : 1;
    const clipsThisMonth = clips.filter(c => c.productId === p.id && c.postedAt?.slice(0, 7) === currentMonth()).length;
    return { product: p, sales30d, sales7d, momentum, clipsThisMonth };
  }).sort((a, b) => b.sales30d - a.sales30d);

  return withData.map((s, i) => {
    let tier, frequency, targetMonth;
    if (i < 2) { tier = 'HOT'; frequency = '3-4 คลิป/wk'; targetMonth = 14; }
    else if (i < 4) { tier = 'STEADY'; frequency = '1-2 คลิป/wk'; targetMonth = 6; }
    else { tier = 'PASSIVE'; frequency = '2-3 คลิป/เดือน'; targetMonth = 2.5; }
    const atRisk = s.momentum > 0 && s.momentum < 0.8;
    return { ...s, rank: i + 1, tier, frequency, targetMonth, atRisk };
  });
}

function getECandidates(products, clips) {
  return products.map(p => {
    if (p.category === 'A') return null;
    if (daysSince(p.createdAt) < 14) return null;
    const sales30d = getProductSales(p, clips, 30).primary;
    const winnerCount = clips.filter(c => c.productId === p.id && (Number(c.gmv) || 0) >= WINNER_GMV).length;
    const rank = Number(p.tiktokRank) || 0;
    const commission = Number(p.scorecard?.commission) || 0;

    let eScore = 0; const reasons = [];
    if (sales30d >= 30000) { eScore += 2; reasons.push(`GMV ฿${fmtNum(sales30d)} (mass)`); }
    else if (sales30d >= 10000) { eScore += 1; reasons.push(`GMV ฿${fmtNum(sales30d)}`); }
    if (winnerCount >= 2) { eScore += 2; reasons.push(`${winnerCount} winner clips`); }
    else if (winnerCount === 1) { eScore += 1; reasons.push('1 winner clip'); }
    if (rank > 0 && rank <= 10) { eScore += 1; reasons.push(`Top #${rank} ตลาด`); }
    if (commission >= 15) { eScore += 1; reasons.push(`คอม ${commission}% ดี`); }
    if (p.isShopAds) { eScore += 1; reasons.push('Shop Ads 🛒'); }
    if (eScore < 2) return null;

    let confidence, advice;
    if (eScore >= 5) { confidence = 'high'; advice = 'ย้ายเป็น A เพื่อขยี้คอนเทนต์'; }
    else if (eScore >= 3) { confidence = 'medium'; advice = 'พิจารณาย้าย / เทสต่อ 1-2 wk'; }
    else { confidence = 'low'; advice = 'มี signal เริ่มต้น — เทสต่อ'; }

    return { product: p, eScore, confidence, reasons, sales30d, winnerCount, advice };
  }).filter(Boolean).sort((a, b) => b.eScore - a.eScore);
}

function getROIAnalysis(products, clips, monthlyTargetGMV) {
  const items = products.map(p => {
    const sales30d = getProductSales(p, clips, 30).primary;
    const commission = Number(p.scorecard?.commission) || 0;
    const price = Number(p.price) || 0;
    const commPerOrder = (price > 0 && commission > 0) ? (price * commission / 100) : 0;
    const currentCommRevenue = sales30d * commission / 100;
    const ordersNeededAlone = commPerOrder > 0 ? Math.ceil(monthlyTargetGMV / commPerOrder) : null;
    return { product: p, sales30d, commission, price, commPerOrder, currentCommRevenue, ordersNeededAlone };
  }).filter(i => i.sales30d > 0 || i.commPerOrder > 0).sort((a, b) => b.currentCommRevenue - a.currentCommRevenue);

  const totalCommRevenue = items.reduce((s, i) => s + i.currentCommRevenue, 0);
  return { items, totalCommRevenue, gap: Math.max(0, monthlyTargetGMV - totalCommRevenue), pct: monthlyTargetGMV > 0 ? Math.round((totalCommRevenue / monthlyTargetGMV) * 100) : 0 };
}

function getProductsToCut(products, clips) {
  return products.map(p => {
    const reasons = []; const commission = Number(p.scorecard?.commission) || 0;
    const sales = getProductSales(p, clips, 30);
    if (commission > 0 && commission <= 5 && sales.primary < 30000) reasons.push(`คอม ${commission}% ≤5%`);
    if (p.scorePct && p.maxScore >= 12 && p.scorePct < WAIT_THRESHOLD) reasons.push(`Argoon ${p.score}/${p.maxScore} = CUT`);
    const g7 = Number(p.scorecard?.gmv7dPct); const g30 = Number(p.scorecard?.gmv30dPct);
    if (!isNaN(g7) && !isNaN(g30) && g7 < -20 && g30 < -20) reasons.push(`GMV ตกหนัก ${g7}% / ${g30}%`);
    if (daysSince(p.createdAt) >= 14 && sales.primary === 0 && sales.clipCount === 0) reasons.push('ไม่มีกิจกรรม 30d');
    if (reasons.length === 0) return null;
    return { product: p, reasons, severity: reasons.length };
  }).filter(Boolean).sort((a, b) => b.severity - a.severity);
}

function getRevenuePerClip(productId, clips, days = 7) {
  const cutoff = Date.now() - days * 86400000;
  const pclips = clips.filter(c => c.productId === productId && new Date(c.postedAt).getTime() >= cutoff);
  if (pclips.length === 0) return { revPerClip: 0, totalGMV: 0, clipCount: 0 };
  const totalGMV = pclips.reduce((s, c) => s + (Number(c.gmv) || 0), 0);
  return { revPerClip: totalGMV / pclips.length, totalGMV, clipCount: pclips.length };
}

function getProductSales(product, clips, days) {
  const cutoff = Date.now() - days * 86400000;
  const fromClips = clips.filter(c => c.productId === product.id && new Date(c.postedAt).getTime() >= cutoff).reduce((s, c) => s + (Number(c.gmv) || 0), 0);
  const clipCount = clips.filter(c => c.productId === product.id && new Date(c.postedAt).getTime() >= cutoff).length;
  const fromManual = days <= 7 ? (Number(product.salesData?.last7d) || 0) : (Number(product.salesData?.last30d) || 0);
  return { fromClips, fromManual, hasManual: fromManual > 0, clipCount, primary: fromManual || fromClips };
}

function getBestAngle(product, clips) {
  if (!product?.angles?.length) return null;
  const stats = product.angles.map(angle => {
    const aclips = clips.filter(c => c.angleId === angle.id);
    const totalGMV = aclips.reduce((s, c) => s + (Number(c.gmv) || 0), 0);
    return { angle, count: aclips.length, totalGMV, avg: aclips.length > 0 ? totalGMV / aclips.length : 0 };
  }).filter(s => s.count >= 1).sort((a, b) => b.avg - a.avg);
  return stats[0] || null;
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

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 2500); };

  // 1. Firebase Authentication
  useEffect(() => {
    signInAnonymously(auth).catch(err => showToast("เชื่อมคลาวด์ล้มเหลว", "error"));
    return onAuthStateChanged(auth, setUser);
  }, []);

  // 2. Real-time Syncing จากแยกแฟ้ม Subcollections (แก้ปัญหา 1MB)
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

  // ระบบย้ายข้อมูลสไตล์ Monolith -> Subcollection
  const handleLegacyMigration = async (jsonData) => {
    if (!user) return;
    setMigrationLog("กำลังเริ่มต้นรื้อถอนและย้ายสิทธิ์ข้อมูล...");
    try {
      const parsed = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      if (!parsed.products && !parsed.clips) {
        showToast("รูปแบบไฟล์สำรองไม่ถูกต้อง", "error");
        return;
      }
      if (parsed.monthlyTarget) {
        await setDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'appData', 'settings'), { monthlyTarget: parsed.monthlyTarget });
      }
      let pCount = 0;
      for (const p of parsed.products) {
        await setDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'products', p.id), p);
        pCount++;
      }
      let cCount = 0;
      for (const c of parsed.clips) {
        await setDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'clips', c.id), c);
        cCount++;
      }
      setMigrationLog(`🎉 สำเร็จ! ย้ายฐานข้อมูลเข้ากล่องใหม่เรียบร้อย: สินค้า ${pCount} รายการ, คลิป ${cCount} คลิป ปลอดภัยจากขีดจำกัด 1MB 100%`);
      showToast("ระบบอัพเกรดเป็น v2.0 สำเร็จ!");
    } catch (e) {
      setMigrationLog(`❌ พัง: ${e.message}`);
      showToast("ย้ายข้อมูลขัดข้อง", "error");
    }
  };

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

  const deleteProduct = async (id) => {
    if (!confirm('ลบสินค้านี้ถาวร? (คลิปที่ผูกกับสินค้านี้จะยังอยู่ในคลัง Log)')) return;
    await deleteDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'products', id));
    setPage('products'); showToast('ลบแฟ้มสินค้าเรียบร้อย');
  };

  const addClip = async (data) => {
    if (!user) return; const id = uid();
    await setDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'clips', id), { id, ...data, postedAt: data.postedAt || new Date().toISOString(), createdAt: new Date().toISOString() });
    showToast('บันทึกคลิปลงคลังสำเร็จ!');
  };

  const updateClip = async (id, patch) => {
    if (!user) return;
    await updateDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'clips', id), patch);
    showToast('อัพเดทคลิปแล้ว!');
  };

  const deleteClip = async (id) => {
    if (!confirm('ลบคลิปนี้ทิ้งถาวร?')) return;
    await deleteDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'clips', id));
    showToast('ลบคลิปแล้ว');
  };

  const markRepostDone = async (clipId, bucket) => {
    const clip = clips.find(c => c.id === clipId); if (!clip) return;
    const rs = { ...(clip.repostStatus || {}) }; const key = `d${bucket}`;
    rs[key] = rs[key] ? null : new Date().toISOString();
    await updateClip(clipId, { repostStatus: rs });
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

      {/* PREMIUM DEEP EMERALD SIDEBAR (Pharmly 1.jpg Inspired) */}
      <aside className="w-full lg:w-72 bg-[#012b25] text-white flex flex-col justify-between flex-shrink-0 shadow-2xl relative z-20">
        <div>
          {/* Logo Brand Header */}
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

          {/* Nav Lists */}
          <nav className="p-5 space-y-1.5">
            {[
              { id: 'home', label: 'Overview', icon: Home },
              { id: 'products', label: 'Products', icon: Package },
              { id: 'lock', label: 'Orders (Locked)', icon: Lock },
              { id: 'log', label: 'Sales & Logs', icon: BarChart3 }
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
        
        {/* Upgrade / Account Box */}
        <div className="p-5 border-t border-[#053d34]">
          <div className="bg-[#033c32] rounded-3xl p-5 mb-5 border border-[#095246] relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-24 h-24 bg-[#d9eb54]/5 rounded-full" />
            <div className="w-8 h-8 rounded-full bg-[#d9eb54]/10 border border-[#d9eb54]/20 flex items-center justify-center mb-3"><Trophy className="w-4 h-4 text-[#d9eb54]" /></div>
            <h4 className="font-display text-sm font-bold text-white leading-tight">Upgrade Pro</h4>
            <p className="text-[10px] text-emerald-300/70 mt-1 leading-relaxed">ปลดล็อคโมดูลคำนวณและสถิติกราฟ AI ปั่นสคริปต์ได้ไม่จำกัด</p>
            <button className="w-full bg-[#d9eb54] text-[#012b25] text-xs font-bold py-2.5 rounded-xl transition-all shadow-md mt-4 hover:bg-[#eaf96c]">Upgrade Now</button>
          </div>
          <div className="flex gap-2 text-xs">
            <button onClick={() => { setClipForVOnly(true); setShowAddClip(true); }} className="flex-1 bg-[#d9eb54] hover:bg-[#eaf96c] text-[#012b25] font-bold py-3 rounded-2xl transition-all shadow-md flex items-center justify-center gap-1">+ บันทึกคลิป</button>
            <button onClick={() => setShowSettings(true)} className="p-3 bg-[#033c32] text-emerald-100 rounded-2xl hover:text-white transition-all"><Settings className="w-4 h-4" /></button>
          </div>
        </div>
      </aside>

      {/* CONTENT AREA (Pharmly Layout Style) */}
      <main className="flex-1 overflow-y-auto pb-24 lg:pb-10">
        {/* Premium Breadcrumb Header */}
        <header className="bg-white border-b border-[#e9eceb] px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-10">
          <div>
            <div className="text-[11px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
              <span>Overview</span>
              <ChevronRight className="w-3 h-3 text-slate-300" />
              <span className="text-emerald-800">List data</span>
            </div>
            <h1 className="font-display text-2xl text-[#012b25] mt-1 leading-none">Order Details</h1>
          </div>

          {/* User Section (Right Panel) */}
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

        {/* PAGE SCREEN NAVIGATION WRAPPER */}
        <div className="p-6 md:p-8 space-y-8">
          {page === 'home' && (
            <HomePage 
              products={products} clips={clips} lockedProducts={lockedProducts} 
              productsNeedingRescore={productsNeedingRescore} last7DaysClips={last7DaysClips} 
              monthlyTarget={monthlyTarget} onSetMonthlyTarget={(val) => setDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'appData', 'settings'), { monthlyTarget: val }, { merge: true })} 
              onGoTo={setPage} onSelectProduct={(id) => { setSelectedProductId(id); setPage('detail'); }} 
              onEditClip={(id) => setEditClipId(id)} 
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
              onRemovePain={async (painId) => await updateProductInCloud(selectedProduct.id, { pains: selectedProduct.pains.filter(x => x.id !== painId) })} 
              onAddAngle={() => setShowAddAngle(true)} 
              onRemoveAngle={async (angleId) => await updateProductInCloud(selectedProduct.id, { angles: selectedProduct.angles.filter(x => x.id !== angleId) })} 
              onEditScore={() => setEditScoreProductId(selectedProduct.id)} 
              onEditInfo={() => setEditProductInfoId(selectedProduct.id)} 
              onLock={() => setShowLockProduct(true)} 
              onUnlock={async () => await updateProductInCloud(selectedProduct.id, { locked: null })} 
              onDelete={() => deleteProduct(selectedProduct.id)} 
              onAddClip={() => { setClipForVOnly(false); setShowAddClip(true); }} 
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
          {page === 'log' && (
            <ClipLogPage products={products} clips={clips} onEditClip={(id) => setEditClipId(id)} onMarkRepostDone={markRepostDone} onPromoteToA={async (id) => await updateProductInCloud(id, { category: 'A' })} />
          )}
        </div>
      </main>

      {/* MODALS ENGINE */}
      {showAddProduct && <AddProductModal onClose={() => setShowAddProduct(false)} onSave={addProduct} showToast={showToast} />}
      {editScoreProductId && <EditScoreModal product={products.find(p => p.id === editScoreProductId)} onClose={() => setEditScoreProductId(null)} onSave={updateProductScore} />}
      {editProductInfoId && <EditProductInfoModal product={products.find(p => p.id === editProductInfoId)} onClose={() => setEditProductInfoId(null)} onSave={async (patch) => { await updateProductInCloud(editProductInfoId, patch); setEditProductInfoId(null); }} />}
      {showAddPain && selectedProduct && <AddPainModal onClose={() => setShowAddPain(false)} onSave={async (text, source) => { await updateProductInCloud(selectedProduct.id, { pains: [...(selectedProduct.pains || []), { id: uid(), text, source, createdAt: new Date().toISOString() }] }); setShowAddPain(false); }} />}
      {showAddAngle && selectedProduct && <AddAngleModal onClose={() => setShowAddAngle(false)} onSave={async (text) => { await updateProductInCloud(selectedProduct.id, { angles: [...(selectedProduct.angles || []), { id: uid(), text, createdAt: new Date().toISOString() }] }); setShowAddAngle(false); }} />}
      {showLockProduct && selectedProduct && <LockProductModal product={selectedProduct} onClose={() => setShowLockProduct(false)} onSave={async (target, angles) => { await updateProductInCloud(selectedProduct.id, { locked: { month: currentMonth(), targetClips: target, anglesToTest: angles, lockedAt: new Date().toISOString() } }); setShowLockProduct(false); }} />}
      {showAddClip && <AddClipModal products={products} defaultProductId={!clipForVOnly && selectedProduct ? selectedProduct.id : null} onClose={() => setShowAddClip(false)} onSave={addClip} showToast={showToast} />}
      {editClipId && <EditClipModal clip={clips.find(c => c.id === editClipId)} products={products} onClose={() => setEditClipId(null)} onSave={async (patch) => { await updateClip(editClipId, patch); setEditClipId(null); }} onDelete={() => { deleteClip(editClipId); setEditClipId(null); }} />}
      
      {showSettings && (
        <SettingsModal 
          onClose={() => setShowSettings(false)} 
          onExport={() => showToast("Backup ฟังก์ชันพัฒนาต่อในเฟสถัดไป", "error")} 
          migrationLog={migrationLog}
          onMigrate={handleLegacyMigration}
          onClearAll={async () => {
            if (!confirm('⚠️ ลบพอร์ตประวัติข้อมูลออกทั้งหมดถาวร?')) return;
            for (const p of products) await deleteDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'products', p.id));
            for (const c of clips) await deleteDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'clips', c.id));
            setShowSettings(false); showToast('เคลียร์คลาวด์หมดจดแล้ว');
          }} 
        />
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
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
// [ZONE 4] MOCK GRAPHICS & VISUAL CARDS (วิดเจ็ตกราฟแคปซูลมนเลียนแบบภาพ 1.jpg)
// ============================================================================
function OverviewKPI({ icon: Icon, label, value, sub, isPrimary = false }) {
  return (
    <div className={`rounded-3xl p-6 shadow-sm flex flex-col justify-between min-h-[140px] transition-all duration-300 hover:scale-[1.01] ${
      isPrimary ? 'bg-[#012b25] text-white border border-[#033c32]' : 'bg-white text-[#0d2a23] border border-slate-200/60'
    }`}>
      <div className="flex justify-between items-start">
        <span className={`text-[11px] font-bold uppercase tracking-wider ${isPrimary ? 'text-emerald-400/80' : 'text-slate-400'}`}>{label}</span>
        <div className={`p-2.5 rounded-xl ${isPrimary ? 'bg-[#093c33] text-[#d9eb54]' : 'bg-slate-50 text-slate-400'}`}><Icon className="w-4 h-4" /></div>
      </div>
      <div>
        <div className="font-display text-2xl md:text-3xl tracking-tight leading-none">{value}</div>
        <div className={`text-[10px] mt-1.5 font-medium ${isPrimary ? 'text-emerald-300/70' : 'text-slate-400'}`}>{sub}</div>
      </div>
    </div>
  );
}

// Custom Capsule Graph Component (เลียนแบบกราฟสไตล์ Pharmly 1.jpg)
function CapsuleChart({ data }) {
  const maxValue = Math.max(...data.map(d => d.value), 100);
  return (
    <div className="flex justify-between items-end h-56 pt-6 px-2">
      {data.map((item, idx) => {
        const heightPct = Math.round((item.value / maxValue) * 100);
        const isHighlight = item.label === '07'; // ตะขอปักแบบภาพ 1.jpg
        return (
          <div key={idx} className="flex flex-col items-center flex-1 group relative">
            {/* Value Tooltip */}
            <div className={`absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-[#012b25] text-white text-[9px] font-mono font-bold px-2 py-1 rounded-md shadow-md z-10 ${
              isHighlight ? 'opacity-100 -top-8' : ''
            }`}>
              ฿{fmtNum(item.value)}
            </div>
            
            {/* Capsule Bar */}
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

// Heatmap Time Matrix (ช่วงเวลากลยุทธ์ลงคลิปจากภาพที่ 4)
function HeatmapGrid() {
  const days = ['Sat', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const hours = ['9 am', '10 am', '11 am', '12 pm', '1 pm', '2 pm', '3 pm'];
  
  // จำลองความเข้มยอดวิวยอดขาย
  const getIntensity = (day, hr) => {
    if (day === 'Tue' || day === 'Wed' || day === 'Thu') {
      if (hr === '12 pm' || hr === '1 pm' || hr === '2 pm') return 'bg-[#0a4d40]';
      if (hr === '11 am' || hr === '3 pm') return 'bg-[#186a5a]/60';
    }
    if (hr === '12 pm') return 'bg-[#186a5a]/30';
    return 'bg-slate-100';
  };

  return (
    <div className="grid grid-cols-8 gap-1.5 text-[9px] text-slate-400 font-bold font-mono">
      <div />
      {days.map(d => <div key={d} className="text-center">{d}</div>)}
      {hours.map(h => (
        <React.Fragment key={h}>
          <div className="text-right pr-2 self-center">{h}</div>
          {days.map(d => (
            <div key={`${d}-${h}`} className={`h-4 rounded-[4px] transition-all duration-300 ${getIntensity(d, h)} hover:scale-105`} title={`ประสิทธิภาพช่วง ${d} ${h}`} />
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}

function HomePage({ products, clips, lockedProducts, productsNeedingRescore, last7DaysClips, monthlyTarget, onSetMonthlyTarget, onGoTo, onSelectProduct, onEditClip }) {
  const today = todayStr();
  const clipsToday = clips.filter(c => c.postedAt?.slice(0, 10) === today);
  const totalGMVMonth = clips.filter(c => c.postedAt?.slice(0, 7) === currentMonth()).reduce((s, c) => s + (Number(c.gmv) || 0), 0);
  const tiktokTotal30d = useMemo(() => products.reduce((s, p) => s + (Number(p.salesData?.last30d) || Number(p.salesData?.last7d) || 0), 0), [products]);

  // จำลองชุดข้อมูลกราฟ 12 เดือน/ช่วง
  const chartData = [
    { label: '01', value: 8000 }, { label: '02', value: 12500 }, { label: '03', value: 10000 },
    { label: '04', value: 7000 }, { label: '05', value: 9500 }, { label: '06', value: 11000 },
    { label: '07', value: 18657 }, { label: '08', value: 14000 }, { label: '09', value: 11500 },
    { label: '10', value: 10500 }, { label: '11', value: 13000 }, { label: '12', value: 9000 },
  ];

  return (
    <div className="space-y-8">
      {/* 3 CARD METRICS (Pharmly 1.jpg Exact Layout) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <OverviewKPI icon={DollarSign} label="Total Profit (Commission)" value={`฿${fmtNum(totalGMVMonth)}`} sub="สะสมภายในสัปดาห์นี้" isPrimary={true} />
        <OverviewKPI icon={User} label="Total Customers (Pains)" value={products.length} sub="รายการสินค้าตรึงโฟกัสหลัก" />
        <OverviewKPI icon={Activity} label="Total Orders (Clips)" value={clips.length} sub="คลิปสะสมทั้งหมดในระบบ" />
      </div>

      {/* SALES CHART AREA & TOP MEDICINE GAUGES */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Sales Chart Block (Left) */}
        <div className="bg-white border border-[#e9eceb] rounded-3xl p-6 shadow-sm xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg text-[#012b25]">Sales Analytics</h3>
              <p className="text-xs text-slate-400">ประเมินสถิติแรงกระตุ้นยอดขายคลิป</p>
            </div>
            <select className="bg-[#f3f6f5] border-none text-xs font-bold px-3 py-2 rounded-xl focus:ring-1 focus:ring-emerald-700">
              <option>This Month</option>
              <option>Last 30 Days</option>
            </select>
          </div>
          <CapsuleChart data={chartData} />
        </div>

        {/* Right Gauge Pillars (Top Selling Medicine) */}
        <div className="bg-white border border-[#e9eceb] rounded-3xl p-6 shadow-sm space-y-5">
          <h3 className="font-display text-base text-[#012b25] flex items-center justify-between">
            <span>Top Selling Products</span>
            <span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-1 rounded-md">This Month</span>
          </h3>
          <div className="flex justify-around items-end h-48 pt-4">
            {/* Gauge 1 */}
            <div className="flex flex-col items-center flex-1">
              <div className="w-6 bg-slate-100 rounded-full h-32 flex items-end overflow-hidden">
                <div className="w-full bg-[#f26522] rounded-full h-[85%] flex items-center justify-center"><span className="text-[8px] font-bold text-white rotate-90 whitespace-nowrap">Keytruda</span></div>
              </div>
              <span className="text-[10px] font-bold text-slate-800 font-mono mt-2">฿5,000</span>
            </div>
            {/* Gauge 2 */}
            <div className="flex flex-col items-center flex-1">
              <div className="w-6 bg-slate-100 rounded-full h-32 flex items-end overflow-hidden">
                <div className="w-full bg-[#0d2a23] rounded-full h-[65%] flex items-center justify-center"><span className="text-[8px] font-bold text-white rotate-90 whitespace-nowrap">Ozempic</span></div>
              </div>
              <span className="text-[10px] font-bold text-slate-800 font-mono mt-2">฿3,000</span>
            </div>
            {/* Gauge 3 */}
            <div className="flex flex-col items-center flex-1">
              <div className="w-6 bg-slate-100 rounded-full h-32 flex items-end overflow-hidden">
                <div className="w-full bg-[#bcd924] rounded-full h-[45%] flex items-center justify-center"><span className="text-[8px] font-bold text-[#0d2a23] rotate-90 whitespace-nowrap font-semibold">Dupixent</span></div>
              </div>
              <span className="text-[10px] font-bold text-slate-800 font-mono mt-2">฿1,500</span>
            </div>
          </div>
        </div>
      </div>

      {/* REPOST & STALE NOTIFICATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Order List (Clips awaiting view updates) */}
        <div className="bg-white border border-[#e9eceb] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between"><h3 className="font-display text-base text-[#012b25]">Latest Clips (ค้างตรวจสถิติ)</h3><button onClick={() => onGoTo('log')} className="text-xs font-bold text-[#012b25] hover:underline">View All</button></div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead><tr className="bg-slate-50 font-bold border-b border-slate-100 text-slate-400"><th className="p-3">Clip Hook</th><th className="p-3">ประเภท</th><th className="p-3">สถานะ</th><th className="p-3 text-right">ดำเนินการ</th></tr></thead>
              <tbody className="divide-y divide-slate-50">
                {statsPending.pending24h.slice(0, 3).map(c => (
                  <tr key={c.id} className="hover:bg-slate-50/50">
                    <td className="p-3 truncate max-w-[150px] font-medium text-slate-800">{c.hook || 'ไม่มี Hook'}</td>
                    <td className="p-3"><span className="text-[10px] bg-sky-50 text-sky-800 px-2 py-0.5 rounded-md font-semibold">24 Hours</span></td>
                    <td className="p-3"><span className="w-2.5 h-2.5 bg-amber-400 rounded-full inline-block" /></td>
                    <td className="p-3 text-right"><button onClick={() => onEditClip(c.id)} className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg font-bold">อัปเดตวิว</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lock Focus Status List */}
        <div className="bg-white border border-[#e9eceb] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between"><h3 className="font-display text-base text-[#012b25]">Focused Products</h3><button onClick={() => onGoTo('lock')} className="text-xs font-bold text-[#012b25] hover:underline">Manage</button></div>
          <div className="space-y-3">
            {lockedProducts.slice(0, 3).map(p => {
              const made = clips.filter(c => c.productId === p.id && c.postedAt?.slice(0, 7) === currentMonth()).length;
              const target = p.locked?.targetClips || 1;
              return (
                <div key={p.id} onClick={() => onSelectProduct(p.id)} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-100/50 transition-all">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center ${ABCD_INFO[p.category].bg} text-white`}>{p.category}</div>
                    <span className="font-display font-bold text-sm text-slate-800 truncate max-w-[160px]">{p.name}</span>
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
  const [search, setSearch] = useState(''); const [filter, setFilter] = useState('all');

  const filtered = useMemo(() => {
    return products.filter(p => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (filter !== 'all' && p.category !== filter) return false;
      return true;
    }).sort((a,b) => b.scorePct - a.scorePct);
  }, [products, search, filter]);

  return (
    <div className="space-y-6">
      {/* Product List Overview Header (Pharmly 2.jpg) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#e9eceb] rounded-3xl p-5 shadow-sm flex items-center justify-between">
          <div><span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Products</span><div className="font-display text-2xl text-[#012b25] mt-1">{products.length}</div></div>
          <div className="p-3 bg-slate-50 text-slate-400 rounded-2xl"><Package className="w-5 h-5" /></div>
        </div>
        <div className="bg-white border border-[#e9eceb] rounded-3xl p-5 shadow-sm flex items-center justify-between">
          <div><span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Low Stock / Stale</span><div className="font-display text-2xl text-amber-600 mt-1">{products.filter(p=>daysSince(p.lastScoredAt) >= RESCORE_DAYS).length}</div></div>
          <div className="p-3 bg-amber-50 text-amber-500 rounded-2xl"><AlertTriangle className="w-5 h-5" /></div>
        </div>
        <div className="bg-white border border-[#e9eceb] rounded-3xl p-5 shadow-sm flex items-center justify-between">
          <div><span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Drop Items</span><div className="font-display text-2xl text-rose-600 mt-1">{products.filter(p=>p.decision === 'DROP').length}</div></div>
          <div className="p-3 bg-rose-50 text-rose-500 rounded-2xl"><X className="w-5 h-5" /></div>
        </div>
      </div>

      {/* Advanced Filter Box (Pharmly 2.jpg Table Search Area) */}
      <div className="bg-white border border-[#e9eceb] rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search for items..." className="w-full pl-10 pr-4 py-2.5 bg-[#f3f6f5] border border-transparent rounded-full text-xs focus:outline-none focus:border-emerald-700 focus:bg-white transition-all shadow-inner" />
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          </div>
          <div className="flex flex-wrap gap-2">
            <button onClick={onAdd} className="bg-[#bcd924] hover:bg-[#a9c41d] text-[#0d2a23] font-bold text-xs px-5 py-2.5 rounded-full transition-all shadow-sm flex items-center gap-1"><Plus className="w-4 h-4" /> Add New Product</button>
            <select value={filter} onChange={e=>setFilter(e.target.value)} className="bg-[#f3f6f5] border-none text-xs font-bold px-4 py-2.5 rounded-full">
              <option value="all">ทุกพอร์ตสินค้า</option>
              <option value="A">หมวด A (Proven)</option>
              <option value="B">หมวด B (Testing)</option>
              <option value="C">หมวด C (Volume)</option>
              <option value="D">หมวด D (Premium)</option>
            </select>
          </div>
        </div>

        {/* Premium Data Table (Pharmly 2.jpg) */}
        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs text-slate-600 border-collapse">
            <thead>
              <tr className="bg-slate-50/80 font-bold text-slate-400 border-b border-slate-100 uppercase text-[10px] tracking-wider">
                <th className="p-4">Product ID</th>
                <th className="p-4">Product Name</th>
                <th className="p-4">Quantity (Clips)</th>
                <th className="p-4">Price</th>
                <th className="p-4">Decision</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map(p => {
                const clipCount = clips.filter(c => c.productId === p.id).length;
                const dec = DECISION_INFO[p.decision];
                return (
                  <tr key={p.id} className="hover:bg-slate-50/50 group">
                    <td className="p-4 font-mono font-bold text-slate-400">#{p.id.slice(0, 6)}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-md font-bold text-xs flex items-center justify-center ${ABCD_INFO[p.category].bg} text-white flex-shrink-0`}>{p.category}</div>
                        <div className="truncate max-w-[200px]"><span className="font-display font-bold text-slate-800 text-sm group-hover:text-emerald-950 block">{p.name}</span><span className="text-[10px] text-slate-400">{p.brand || 'No brand'}</span></div>
                      </div>
                    </td>
                    <td className="p-4 font-mono font-bold text-slate-700">{clipCount} Clips</td>
                    <td className="p-4 font-mono font-bold text-emerald-800">฿{fmtNum(p.price)}</td>
                    <td className="p-4"><span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-full ${dec?.bg} ${dec?.text}`}>{dec?.label}</span></td>
                    <td className="p-4 text-right"><button onClick={() => onSelect(p.id)} className="text-xs bg-[#f3f6f5] hover:bg-[#012b25] hover:text-white px-4 py-2 rounded-full font-bold transition-all">แก้ไขสเปก</button></td>
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

function ProductDetailPage({ product, clips, allClips, onBack, onTogglePillar, onSetCategory, onAddPain, onRemovePain, onAddAngle, onRemoveAngle, onEditScore, onEditInfo, onLock, onUnlock, onDelete, onAddClip, onEditClip }) {
  const sales30d = useMemo(() => getProductSales(product, allClips, 30), [product, allClips]);
  const bestAngle = useMemo(() => getBestAngle(product, allClips), [product, allClips]);
  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-800 transition"><ChevronLeft className="w-4 h-4" /> Back to Products</button>
      
      {/* Premium Dark Glass Frame */}
      <div className="bg-[#012b25] text-white rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start gap-6 relative overflow-hidden border border-[#043d34]">
        <div className="space-y-3 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] bg-emerald-900 border border-emerald-800 font-bold px-3 py-1 rounded-md text-emerald-300 uppercase tracking-wider">{PRODUCT_TYPES.find(t=>t.id===product.productType)?.label}</span>
            {product.isShopAds && <span className="text-[10px] bg-rose-500 text-white font-bold px-3 py-1 rounded-md">🛒 Shop Ads</span>}
            {product.price > 0 && <span className="text-[10px] bg-[#d9eb54] text-[#012b25] font-bold px-3 py-1 rounded-md font-mono">฿{fmtNum(product.price)}</span>}
          </div>
          <h2 className="font-display text-2xl md:text-3xl tracking-tight leading-tight">{product.name}</h2>
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

      {/* Switch Categories & Fast Control Pills */}
      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Switch Strategy Category:</span>
        <div className="flex gap-1">
          {['A', 'B', 'C', 'D'].map(cat => (
            <button key={cat} onClick={() => onSetCategory(cat)} className={`text-xs font-bold px-4 py-2 rounded-xl transition-all ${product.category === cat ? `${ABCD_INFO[cat].bg} text-white` : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>หมวด {cat}</button>
          ))}
        </div>
      </div>

      {/* Pain Bank & Angle Database Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pain Bank */}
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

        {/* Angle Database */}
        <div className="bg-white border border-[#e9eceb] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between"><h3 className="font-display text-base text-[#012b25]">🎯 Angle Bank มุมคอนเทนต์ ({product.angles?.length || 0})</h3><button onClick={onAddAngle} className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs px-3 py-2 rounded-xl transition-all">+ Add Angle</button></div>
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {(!product.angles || product.angles.length === 0) ? (
              <p className="text-xs text-slate-400 italic text-center py-6">ยังไม่มียอดคลังปัญญา Angle นำสายตา</p>
            ) : (
              product.angles.map(a => (
                <div key={a.id} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between gap-2 text-xs"><p className="text-slate-700 font-medium">{a.text}</p><button onClick={() => onRemoveAngle(a.id)} className="text-slate-300 hover:text-rose-500 p-1"><Trash2 className="w-3.5 h-3.5" /></button></div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Interactive Generator Tool (Splitter Block) */}
      <SplitterSection product={product} />

      {/* CLIPS UNDER THIS SPECIFIC PRODUCT */}
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
    const selectedPain = p.pains?.find(x => x.id === painId);
    const selectedAngle = p.angles?.find(x => x.id === angleId);

    return `เขียนสคริปต์ TikTok Shop สำหรับช่อง PEEM6PACK (Fitness Affiliate Creator)

[สินค้าหลัก]
ชื่อ: ${p.name} ${p.brand ? `แบรนด์ ${p.brand}` : ''}
หมวดสินค้า: ${ABCD_INFO[p.category]?.label}

[เกณฑ์วิเคราะห์คำสั่งคอนเทนต์]
Pillar ช่อง: ${selectedPillar ? `${selectedPillar.id} - ${selectedPillar.name} (${selectedPillar.desc})` : 'ตามความเหมาะสม'}
Pain Point ลูกค้า: ${selectedPain ? selectedPain.text : 'ปัญหาทั่วไปที่คนรักสุขภาพเจอ'}
Angle คอนเทนต์: ${selectedAngle ? selectedAngle.text : 'มุมเล่าเน้นประโยชน์ใช้งานจริง'}

[สูตรผสมสับแถวคลิป (Splitter Combo)]
กลุ่มเป้าหมาย (Persona): ${persona || 'คนรักสุขภาพทั่วไป'}
สถานการณ์จริง (Situation): ${situation || 'ชีวิตประจำวัน'}
อารมณ์นำสายตา (Emotion): ${emotion || 'ต้องการความคุ้มค่าและผลลัพธ์'}
รูปแบบสคริปต์ (Format): ${format || 'รีวิวการใช้งานสไตล์เพื่อนแนะนำ'}
${hook ? `\nHook เปิดคลิปบังคับใช้: "${hook}"` : ''}
ระยะเวลาความยาวคลิป: ${duration} วินาที

[เงื่อนไขการเขียนและสไตล์ช่อง]
- พูดคุยสไตล์เพื่อนแนะนำเพื่อน ตบมุกด้วยความเป็นกันเอง ไม่วิชาการจ๋าเกินไป
- ตัวตนของภีม: ชายอายุ 31 ปี ฟิตเนสอินฟลูเอนเซอร์ในไทย หุ่นดี ออกกำลังกายจริง ใช้จริง
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
        <div><label className="text-[10px] uppercase font-bold text-emerald-300 block mb-1">Pain Point</label><select value={painId} onChange={e=>setPainId(e.target.value)} className="w-full px-3 py-2.5 bg-[#033c32] border border-[#075246] rounded-xl focus:outline-none">{<option value="">-- เลือก --</option>}{product.pains?.map(pn=><option key={pn.id} value={pn.id}>{truncate(pn.text, 25)}</option>)}</select></div>
        <div><label className="text-[10px] uppercase font-bold text-emerald-300 block mb-1">Angle เล่า</label><select value={angleId} onChange={e=>setAngleId(e.target.value)} className="w-full px-3 py-2.5 bg-[#033c32] border border-[#075246] rounded-xl focus:outline-none">{<option value="">-- เลือก --</option>}{product.angles?.map(an=><option key={an.id} value={an.id}>{truncate(an.text, 25)}</option>)}</select></div>
        <div><label className="text-[10px] uppercase font-bold text-emerald-300 block mb-1">Persona</label><select value={persona} onChange={e=>setPersona(e.target.value)} className="w-full px-3 py-2.5 bg-[#033c32] border border-[#075246] rounded-xl focus:outline-none">{<option value="">-- เลือก --</option>}{SPLITTER_OPTIONS.persona.map(ps=><option key={ps} value={ps}>{ps}</option>)}</select></div>
        <div><label className="text-[10px] uppercase font-bold text-emerald-300 block mb-1">Situation</label><select value={situation} onChange={e=>setSituation(e.target.value)} className="w-full px-3 py-2.5 bg-[#033c32] border border-[#075246] rounded-xl focus:outline-none">{<option value="">-- เลือก --</option>}{SPLITTER_OPTIONS.situation.map(st=><option key={st} value={st}>{st}</option>)}</select></div>
        <div><label className="text-[10px] uppercase font-bold text-emerald-300 block mb-1">Emotion</label><select value={emotion} onChange={e=>setEmotion(e.target.value)} className="w-full px-3 py-2.5 bg-[#033c32] border border-[#075246] rounded-xl focus:outline-none">{<option value="">-- เลือก --</option>}{SPLITTER_OPTIONS.emotion.map(em=><option key={em} value={em}>{em}</option>)}</select></div>
        <div><label className="text-[10px] uppercase font-bold text-emerald-300 block mb-1">Format</label><select value={format} onChange={e=>setFormat(e.target.value)} className="w-full px-3 py-2.5 bg-[#033c32] border border-[#075246] rounded-xl focus:outline-none">{<option value="">-- เลือก --</option>}{SPLITTER_OPTIONS.format.map(fm=><option key={fm} value={fm}>{fm}</option>)}</select></div>
        <div><label className="text-[10px] uppercase font-bold text-emerald-300 block mb-1">ความยาวสคริปต์ (วิ)</label><input type="number" value={duration} onChange={e=>setDuration(e.target.value)} className="w-full px-3 py-2.5 bg-[#033c32] border border-[#075246] rounded-xl focus:outline-none font-mono" /></div>
      </div>
      <div><label className="text-[10px] uppercase font-bold text-emerald-300 block mb-1">ประโยค Hook เปิดหัว (Optional)</label><input value={hook} onChange={e=>setHook(e.target.value)} placeholder="เช่น อย่าพึ่งซื้อน้ำมันปลาถ้ายังไม่ได้อ่านหลังกล่อง..." className="w-full text-xs px-4 py-2.5 bg-[#033c32] border border-[#075246] rounded-xl focus:outline-none placeholder:text-emerald-700 text-white" /></div>
      <button onClick={handleCopy} className={`w-full text-xs font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 ${copied ? 'bg-emerald-500 text-white' : 'bg-[#bcd924] text-[#0d2a23] hover:bg-[#a9c41d] shadow-md'}`}>{copied ? <><CheckCircle2 className="w-4 h-4" /> ปั้นพรอมต์ส่งเข้าระบบเรียบร้อย วางต่อได้เลย!</> : <><Copy className="w-4 h-4" /> เจนเนอเรต AI Copy Prompt สคริปต์</>}</button>
    </div>
  );
}

function LockListPage({ lockedProducts, products, clips, onSelectProduct, onUnlock, onLockNew }) {
  const monthKey = currentMonth();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="font-display text-xl text-slate-800">เป้าหมายยุทธศาสตร์ Lock List เดือนนี้</h2><p className="text-xs text-slate-400">ควบคุมปริมาณ Content Variety ตามกรอบ HOT / STEADY / PASSIVE</p></div>
        <button onClick={onLockNew} className="bg-[#012b25] text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-sm">+ ล็อกเป้าหมายเพิ่ม</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {lockedProducts.length === 0 ? (
          <div className="bg-white border border-[#e9eceb] rounded-3xl p-8 text-center text-slate-400 font-medium md:col-span-2 shadow-sm">ไม่มีข้อมูลสินค้าที่ตรึงเป้าในเดือนนี้</div>
        ) : (
          lockedProducts.map(p => {
            const made = clips.filter(c => c.productId === p.id && c.postedAt?.slice(0, 7) === monthKey).length;
            const target = p.locked?.targetClips || 1;
            const pct = Math.min(100, Math.round((made / target) * 100));
            return (
              <div key={p.id} className="bg-white border border-[#e9eceb] rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center ${ABCD_INFO[p.category].bg} text-white`}>{p.category}</div>
                      <span className="font-display font-bold text-sm text-[#012b25] truncate max-w-[200px]">{p.name}</span>
                    </div>
                    <button onClick={() => onUnlock(p.id)} className="text-slate-300 hover:text-rose-500 p-1">🔓 ปลดล็อก</button>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-500 mb-1"><span>ความคืบหน้าการลงคลิป:</span><span>{made} / {target} คลิป</span></div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/40"><div className="h-full bg-[#bcd924] rounded-full transition-all duration-300" style={{ width: `${pct}%` }}></div></div>
                </div>
                <button onClick={() => onSelectProduct(p.id)} className="w-full bg-slate-50 text-slate-700 text-xs font-bold py-2.5 rounded-xl border border-slate-100 hover:bg-slate-100 transition-colors">เปิดดูคลังข้อมูลและสคริปต์ Splitter →</button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function ClipLogPage({ products, clips, onEditClip, onMarkRepostDone, onPromoteToA }) {
  const [search, setSearch] = useState(''); const [period, setPeriod] = useState('30');
  const filtered = useMemo(() => {
    return clips.filter(c => {
      if (search && !c.hook?.toLowerCase().includes(search.toLowerCase())) return false;
      if (period !== 'all') { const cutoff = Date.now() - Number(period) * 86400000; if (new Date(c.postedAt).getTime() < cutoff) return false; }
      return true;
    }).sort((a,b) => new Date(b.postedAt) - new Date(a.postedAt));
  }, [clips, search, period]);

  const roi = useMemo(() => getROIAnalysis(products, clips, MONTHLY_REVENUE_TARGET), [products, clips]);

  return (
    <div className="space-y-6">
      {/* Sales Overview Stat (Pharmly 4.jpg Table Style) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <OverviewKPI icon={DollarSign} label="Total Revenue" value={`฿${fmtNum(totalGMVMonth * 7)}`} sub="รวมจากที่เซฟสิทธิ์" />
        <OverviewKPI icon={Trophy} label="Total Profit" value={`฿${fmtNum(totalGMVMonth)}`} sub="คำนวณจากค่าคอมเฉลี่ย" />
        <OverviewKPI icon={Flame} label="Total Cost" value={`฿${fmtNum(totalGMVMonth * 0.1)}`} sub="งบค่าใช้จ่ายเทสผลิตภัณฑ์" />
        <OverviewKPI icon={Activity} label="Average Order Value" value="฿245.50" sub="เฉลี่ยจากข้อมูลการสับรหัส" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Table Logs */}
        <div className="bg-white border border-[#e9eceb] rounded-3xl p-6 shadow-sm xl:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div><h3 className="font-display text-base text-[#012b25]">📋 คลังบันทึกประวัติวิดีโอคลิป (Clip Logs)</h3><p className="text-xs text-slate-400">กดรายแถวตารางเพื่ออัปเดต Views ครบกำหนด 24h / 7d</p></div>
            <div className="flex gap-1">
              {['7', '30', 'all'].map(p => (
                <button key={p} onClick={() => setPeriod(p)} className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border ${period === p ? 'bg-[#012b25] text-white border-transparent' : 'bg-slate-50 text-slate-600'}`}>{p === 'all' ? 'ทั้งหมด' : `${p} วันล่าสุด`}</button>
              ))}
            </div>
          </div>
          <div className="relative"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search clip hook..." className="w-full pl-10 pr-4 py-2 bg-[#f3f6f5] border border-transparent rounded-full text-xs focus:outline-none focus:border-emerald-700 focus:bg-white transition-all shadow-inner" /><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /></div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse text-slate-600">
              <thead><tr className="bg-slate-50/80 font-bold border-b border-slate-100 text-slate-400 uppercase text-[10px] tracking-wider"><th className="p-3">วันที่ลง</th><th className="p-3">สินค้าหลัก</th><th className="p-3">สคริปต์ Hook</th><th className="p-3 text-right">Views 7d</th><th className="p-3 text-right">GMV สรุป</th></tr></thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(c => {
                  const prod = products.find(p=>p.id === c.productId);
                  return (
                    <tr key={c.id} onClick={() => onEditClip(c.id)} className="hover:bg-slate-50/50 cursor-pointer transition-colors text-slate-700">
                      <td className="p-3 whitespace-nowrap font-mono">{fmtDate(c.postedAt)}</td>
                      <td className="p-3 font-semibold text-slate-900 truncate max-w-[120px]">{c.isV ? '📚 สาระความรู้ (V)' : (prod?.name || '-')}</td>
                      <td className="p-3 truncate max-w-[180px] text-slate-500 font-medium">{c.hook || '-'}</td>
                      <td className="p-3 text-right font-mono font-medium">{fmtNum(c.views7d)}</td>
                      <td className="p-3 text-right font-mono font-bold text-emerald-700">฿{fmtNum(c.gmv)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Heatmap & Financial Dashboard Path */}
        <div className="space-y-6">
          {/* Orders By Time (Pharmly 4.jpg Heatmap Grid) */}
          <div className="bg-white border border-[#e9eceb] rounded-3xl p-6 shadow-sm space-y-4">
            <div>
              <h3 className="font-display text-base text-[#012b25]">Orders By Time</h3>
              <p className="text-[10px] text-slate-400">ช่วงเวลาอัปโพสต์คลิปที่ปังที่สุด</p>
            </div>
            <HeatmapGrid />
          </div>

          <div className="bg-white border border-[#e9eceb] rounded-3xl p-6 shadow-sm space-y-4">
            <div className="border-b border-slate-50 pb-3"><h3 className="font-display text-base text-[#012b25]">Path to target</h3><p className="text-xs text-slate-400 font-medium">สูตรคำนวณสะสม: ยอดขายจริง $\times$ ค่าคอม %</p></div>
            <div className="p-4 bg-gradient-to-br from-[#012b25] to-[#043c34] text-white rounded-2xl space-y-1.5 shadow-inner">
              <div className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">ประมาณการค่าคอมปัจจุบัน</div>
              <div className="font-display text-2xl font-bold tracking-tight">฿{fmtNum(Math.round(roi.totalCommRevenue))}</div>
              <div className="w-full h-1.5 bg-[#034c40] rounded-full overflow-hidden"><div className="h-full bg-[#bcd924] rounded-full" style={{ width: `${Math.min(100, roi.pct)}%` }}></div></div>
              <div className="flex items-center justify-between text-[10px] text-emerald-200 mt-1 font-mono"><span>{roi.pct}% ถึงเป้า</span><span>ยังขาดอีก: ฿{fmtNum(Math.round(roi.gap))}</span></div>
            </div>

            <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">สัดส่วนพอร์ตสินค้าปัจจุบัน:</div>
              {roi.items.slice(0, 5).map(i => (
                <div key={i.product.id} className="p-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-2 text-xs">
                  <span className="font-semibold text-slate-700 truncate max-w-[150px]">{i.product.name}</span>
                  <span className="font-mono font-bold text-slate-900">฿{fmtNum(Math.round(i.currentCommRevenue))}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// [ZONE 5] SYSTEM MODALS ENGINE COMPONENTS (กล่องป๊อปอัพฟอร์มป้อนข้อมูลทั้งหมด)
// ============================================================================
function ModalWrapper({ title, onClose, children, footer }) {
  return (
    <div className="fixed inset-0 bg-[#012b25]/60 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col relative max-h-[85vh] overflow-hidden border border-[#e9eceb]">
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-full transition-colors z-10"><X className="w-4 h-4" /></button>
        <div className="px-6 py-5 border-b border-slate-100 bg-white"><h3 className="font-display text-base text-[#012b25]">{title}</h3></div>
        <div className="p-6 overflow-y-auto flex-1 space-y-4 bg-slate-50/50 text-xs">{children}</div>
        {footer && <div className="p-4 border-t border-slate-100 bg-white">{footer}</div>}
      </div>
    </div>
  );
}

function InputField({ label, hint, children }) {
  return (
    <div className="space-y-1">
      <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wide block">{label}</label>
      {children}
      {hint && <span className="text-[10px] text-slate-400 font-medium block mt-0.5">{hint}</span>}
    </div>
  );
}

function AddProductModal({ onClose, onSave, showToast }) {
  const [name, setName] = useState(''); const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('A'); const [productType, setProductType] = useState('supplement');
  const [price, setPrice] = useState(''); const [commission, setCommission] = useState('10'); const [isShopAds, setIsShopAds] = useState(false);

  const handleSave = () => {
    if (!name) { showToast("กรุณาระบุชื่อสินค้า", "error"); return; }
    onSave({ name, brand, category, productType, price: Number(price)||0, isShopAds, scorecard: { commission: Number(commission)||0 } });
    onClose();
  };

  return (
    <ModalWrapper title="เพิ่มประวัติข้อมูลสินค้าใหม่" onClose={onClose} footer={<button onClick={handleSave} className="w-full bg-[#012b25] text-white font-bold py-3.5 rounded-2xl hover:bg-[#033c32] transition-all text-xs shadow-md shadow-emerald-950/20">เซฟลงฐานข้อมูลหลัก</button>}>
      <InputField label="ชื่อเรียกรายการสินค้า *"><input value={name} onChange={e=>setName(e.target.value)} placeholder="เช่น Baam Creatine 300g" className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none" /></InputField>
      <InputField label="ชื่อแบรนด์"><input value={brand} onChange={e=>setBrand(e.target.value)} placeholder="เช่น Fitway" className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none" /></InputField>
      <InputField label="ประเภทสินค้าหลัก"><select value={productType} onChange={e=>setProductType(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none">{PRODUCT_TYPES.map(t=><option key={t.id} value={t.id}>{t.emoji} {t.label}</option>)}</select></InputField>
      <div className="grid grid-cols-2 gap-3">
        <InputField label="ราคาขายหน้าร้าน ฿"><input type="number" value={price} onChange={e=>setPrice(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none font-mono" /></InputField>
        <InputField label="เปอร์เซ็นต์ค่าคอม %"><input type="number" value={commission} onChange={e=>setCommission(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none font-mono" /></InputField>
      </div>
      <InputField label="หมวดหมู่ยุทธศาสตร์พอร์ต"><select value={category} onChange={e=>setCategory(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none">{['A','B','C','D'].map(c=><option key={c} value={c}>หมวด {c} - {ABCD_INFO[c].desc}</option>)}</select></InputField>
      <label className="flex items-center gap-2 bg-white p-3 border border-slate-100 rounded-xl cursor-pointer"><input type="checkbox" checked={isShopAds} onChange={e=>setIsShopAds(e.target.checked)} className="w-4 h-4 rounded text-emerald-950 focus:ring-0" /><span className="text-xs font-semibold text-slate-700">🛒 สินค้านี้เข้าร่วมตะกร้าแดง (Shop Ads)</span></label>
    </ModalWrapper>
  );
}

function EditProductInfoModal({ product, onClose, onSave }) {
  const [name, setName] = useState(product.name || ''); const [brand, setBrand] = useState(product.brand || '');
  const [price, setPrice] = useState(product.price || ''); const [isShopAds, setIsShopAds] = useState(!!product.isShopAds);
  const [last7d, setLast7d] = useState(product.salesData?.last7d || ''); const [last30d, setLast30d] = useState(product.salesData?.last30d || '');

  return (
    <ModalWrapper title="แก้ไขรายละเอียดเชิงลึกของแฟ้มสินค้า" onClose={onClose} footer={<button onClick={() => { onSave({ name, brand, price: Number(price), isShopAds, salesData: { last7d: Number(last7d), last30d: Number(last30d), updatedAt: new Date().toISOString() } }); }} className="w-full bg-[#012b25] text-white font-bold py-3.5 rounded-2xl hover:bg-[#033c32] transition-all text-xs">อัปเดตสิทธิ์ข้อมูล</button>}>
      <InputField label="ชื่อเรียกสินค้าทางการ"><input value={name} onChange={e=>setName(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none" /></InputField>
      <InputField label="ชื่อแบรนด์ผู้จัดจำหน่าย"><input value={brand} onChange={e=>setBrand(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none" /></InputField>
      <InputField label="ราคาหน้าร้านสุทธิ ฿"><input type="number" value={price} onChange={e=>setPrice(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none font-mono" /></InputField>
      <label className="flex items-center gap-2 bg-white p-3 border border-slate-100 rounded-xl cursor-pointer"><input type="checkbox" checked={isShopAds} onChange={e=>setIsShopAds(e.target.checked)} className="w-4 h-4 text-emerald-950" /><span>🛒 เข้าร่วมแคมเปญสิทธิ์ตะกร้าแดง</span></label>
      
      <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl space-y-3">
        <h4 className="font-display text-xs text-emerald-950 flex items-center gap-1">📊 ยอดขายจริงป้อนตรงแมนนวล (จากหลังบ้าน TikTok Shop)</h4>
        <div className="grid grid-cols-2 gap-2">
          <InputField label="ยอดขาย 7 วันสะสม ฿"><input type="number" value={last7d} onChange={e=>setLast7d(e.target.value)} className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl focus:outline-none font-mono" /></InputField>
          <InputField label="ยอดขาย 30 วันสะสม ฿"><input type="number" value={last30d} onChange={e=>setLast30d(e.target.value)} className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl focus:outline-none font-mono" /></InputField>
        </div>
      </div>
    </ModalWrapper>
  );
}

function EditScoreModal({ product, onClose, onSave }) {
  const [comm, setComm] = useState(product.scorecard?.commission || '');
  const [cr, setCr] = useState(product.scorecard?.crPct || '');
  const [conc, setConc] = useState(product.scorecard?.concentration || '');

  return (
    <ModalWrapper title="ประเมินทบทวนน้ำหนักคะแนน Argoon Score" onClose={onClose} footer={<button onClick={() => onSave(product.id, { ...product.scorecard, commission: Number(comm), crPct: Number(cr), concentration: Number(conc) })} className="w-full bg-[#012b25] text-white font-bold py-3.5 rounded-2xl hover:bg-[#033c32] transition-all text-xs">ประมวลผลเซฟสิทธิ์เกณฑ์คะแนนใหม่</button>}>
      <div className="space-y-3">
        <InputField label="อัตราเปอร์เซ็นต์ค่าคอมมิชชั่นล่าสุด %"><input type="number" value={comm} onChange={e=>setComm(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none font-mono" /></InputField>
        <InputField label="อัตราการซื้อสำเร็จร้านค้า (CR %)"><input type="number" value={cr} onChange={e=>setCr(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none font-mono" /></InputField>
        <InputField label="ค่าเปอร์เซ็นต์ความเข้มข้นตลาด (Concentration %)"><input type="number" value={conc} onChange={e=>setConc(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none font-mono" /></InputField>
      </div>
    </ModalWrapper>
  );
}

function AddPainModal({ onClose, onSave }) {
  const [text, setText] = useState(''); const [source, setSource] = useState('personal');
  return (
    <ModalWrapper title="📥 เพิ่ม Pain Point ถังความเจ็บปวดผู้ซื้อ" onClose={onClose} footer={<button onClick={() => { if(text.trim()) onSave(text.trim(), source); }} className="w-full bg-[#012b25] text-white font-bold py-3.5 rounded-2xl hover:bg-[#033c32] transition-all text-xs">เซฟบรรจุลงคลัง Pain</button>}>
      <InputField label="ประโยคปัญหา / คำบ่นลูกค้าในคอมเมนต์"><textarea value={text} onChange={e=>setText(e.target.value)} rows={3} placeholder="เช่น ทานแล้วละลายยาก มีก้อนนอนก้นหนืดคอ..." className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none" /></InputField>
      <InputField label="ที่มาแหล่งที่มาข้อมูลปัญหา"><select value={source} onChange={e=>setSource(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none">{PAIN_SOURCES.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}</select></InputField>
    </ModalWrapper>
  );
}

function AddAngleModal({ onClose, onSave }) {
  const [text, setText] = useState('');
  return (
    <ModalWrapper title="🎯 เพิ่มมุมมองนำสายตาคอนเทนต์ (Angle Bank)" onClose={onClose} footer={<button onClick={() => { if(text.trim()) onSave(text.trim()); }} className="w-full bg-[#012b25] text-white font-bold py-3.5 rounded-2xl">บรรจุเข้ากระดาน</button>}>
      <InputField label="ไอเดียมุมเล่าปักหัวสคริปต์"><textarea value={text} onChange={e=>setText(e.target.value)} rows={3} placeholder="เช่น แบไต๋พิสูจน์ตักสเปกดู EPA หลังกล่องแทนฉลากหน้าแบรนด์..." className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none" /></InputField>
    </ModalWrapper>
  );
}

function LockProductModal({ product, onClose, onSave }) {
  const [target, setTarget] = useState(10);
  return (
    <ModalWrapper title={`🔒 ตรึงโฟกัสสินค้าเป้าหมายเดือนนี้`} onClose={onClose} footer={<button onClick={() => onSave(target, [])} className="w-full bg-[#012b25] text-white font-bold py-3.5 rounded-2xl">ล็อกตำแหน่งยุทธศาสตร์หลัก</button>}>
      <InputField label="จำนวนคลิปเป้าหมายย่อยที่ต้องส่งมอบในเดือนนี้"><input type="number" value={target} onChange={e=>setTarget(Number(e.target.value))} className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl font-mono focus:outline-none" /></InputField>
    </ModalWrapper>
  );
}

function AddClipModal({ products, defaultProductId, onClose, onSave, showToast }) {
  const [isV, setIsV] = useState(false); const [productId, setProductId] = useState(defaultProductId || '');
  const [pillarId, setPillarId] = useState(''); const [hook, setHook] = useState('');
  const [gmv, setGmv] = useState(''); const [views7d, setViews7d] = useState('');
  const [postedAt, setPostedAt] = useState(todayStr());

  const handleSave = () => {
    if (!isV && !productId) { showToast("กรุณาเลือกรายการสินค้าคู่สัญญา", "error"); return; }
    onSave({ isV, productId: isV ? null : productId, pillarId, hook, gmv: Number(gmv)||0, views7d: Number(views7d)||0, postedAt: new Date(postedAt).toISOString() });
    onClose();
  };

  return (
    <ModalWrapper title="🎬 บันทึกวิดีโอคลิปลงคลังประวัติ Log" onClose={onClose} footer={<button onClick={handleSave} className="w-full bg-[#012b25] text-white font-bold py-3.5 rounded-2xl text-xs shadow-md">กด Commit บันทึกลงคลัง</button>}>
      <InputField label="รูปแบบคัตคลาสชนิดคลิป"><div className="grid grid-cols-2 gap-2"><button type="button" onClick={() => setIsV(false)} className={`py-2 text-center border font-bold rounded-xl ${!isV ? 'bg-[#012b25] text-white border-transparent' : 'bg-white text-slate-600'}`}>📦 คลิปตะกร้าสินค้า</button><button type="button" onClick={() => setIsV(true)} className={`py-2 text-center border font-bold rounded-xl ${isV ? 'bg-[#012b25] text-white border-transparent' : 'bg-white text-slate-600'}`}>📚 คลิปความรู้ (V)</button></div></InputField>
      {!isV && (<InputField label="จับคู่ชิ้นสินค้าหลัก"><select value={productId} onChange={e=>setProductId(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none"><option value="">-- กรุณาเลือกรายการ --</option>{products.map(p=><option key={p.id} value={p.id}>[{p.category}] - {p.name}</option>)}</select></InputField>)}
      <InputField label="สเปก Pillar ประจำคลิป"><select value={pillarId} onChange={e=>setPillarId(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none font-semibold"><option value="">-</option>{DEFAULT_PILLARS.map(pl=><option key={pl.id} value={pl.id}>{pl.id} - {pl.name}</option>)}</select></InputField>
      <InputField label="ข้อความประโยคคำเปิดหัว Hook"><input value={hook} onChange={e=>setHook(e.target.value)} placeholder="พิมพ์คำแรก 3 วินาทีแรกของคลิป..." className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none" /></InputField>
      <div className="grid grid-cols-2 gap-2">
        <InputField label="ยอดวิวสะสมครบ 7 วันล่าสุด"><input type="number" value={views7d} onChange={e=>setViews7d(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl font-mono focus:outline-none" /></InputField>
        <InputField label="ยอดรวมค่า GMV คลิป ฿"><input type="number" value={gmv} onChange={e=>setGmv(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl font-mono focus:outline-none" /></InputField>
      </div>
      <InputField label="วันที่และเวลาโพสต์อัปโหลดคลิปจริง"><input type="date" value={postedAt} onChange={e=>setPostedAt(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl font-mono focus:outline-none" /></InputField>
    </ModalWrapper>
  );
}

function EditClipModal({ clip, products, onClose, onSave, onDelete }) {
  const [hook, setHook] = useState(clip?.hook || ''); const [views7d, setViews7d] = useState(clip?.views7d || '');
  const [gmv, setGmv] = useState(clip?.gmv || '');

  return (
    <ModalWrapper title="✏️ แก้ไขแก้ไขผลลัพธ์และตัวเลขคลิป" onClose={onClose} footer={<div className="flex gap-2"><button onClick={onDelete} className="bg-slate-100 text-rose-600 font-bold px-3 py-3 rounded-xl hover:bg-rose-50 transition text-xs">🗑️ ลบชิ้นนี้</button><button onClick={() => onSave({ hook, views7d: Number(views7d), gmv: Number(gmv) })} className="flex-1 bg-[#012b25] text-white font-bold py-3.5 rounded-2xl text-xs hover:bg-[#033c32] transition shadow-md">บันทึกข้อมูลใหม่</button></div>}>
      <InputField label="คำพูดสคริปต์ Hook ล่าสุด"><input value={hook} onChange={e=>setHook(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl focus:outline-none" /></InputField>
      <InputField label="ยอดวิวสะสมรอบ 7 วันสุดท้าย"><input type="number" value={views7d} onChange={e=>setViews7d(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl font-mono focus:outline-none" /></InputField>
      <InputField label="ยอดขายรวม GMV คลิป ณ ปัจจุบัน ฿"><input type="number" value={gmv} onChange={e=>setGmv(e.target.value)} className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl font-mono focus:outline-none" /></InputField>
    </ModalWrapper>
  );
}

function SettingsModal({ onClose, onExport, onClearAll, migrationLog, onMigrate }) {
  const [rawJsonInput, setRawJsonInput] = useState('');
  return (
    <ModalWrapper title="⚙️ แผงตั้งค่าวิศวกรรมระบบบำรุงรักษา" onClose={onClose}>
      <button onClick={onExport} className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-left hover:bg-slate-50 transition-colors shadow-sm"><div className="font-semibold text-sm text-slate-800">💾 สร้างจุด Backup สำรองข้อมูลดิบ</div><p className="text-[11px] text-slate-400 mt-0.5">ดาวน์โหลดไฟล์เก็บเป็นข้อมูล Snapshot ส่วนตัว</p></button>
      
      {/* MIGRATION MACHINE AREA (กล่องจุดแปลงสิทธิ์อัพเกรดระบบเพื่อหนีพ้น 1MB) */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-3">
        <h4 className="font-display text-xs text-amber-950 flex items-center gap-1">🔄 เครื่องมือย้ายรากฐานข้อมูลระบบเก่า (v1 {"->"} v2 คลาวด์แยกแฟ้ม)</h4>
        <p className="text-[11px] text-amber-800 leading-normal">นำข้อความรหัสไฟล์ JSON ทั้งหมดที่คุณกดดึงดาวน์โหลดมาจากแอปตัวเก่า มาเปิดก๊อปปี้เทวางลงช่องกล่องด้านล่างนี้ ระบบตัวใหม่จะทำการสับแยกยิงเก็บเข้าพอร์ต Subcollection ให้ทันที ข้อมูลพอร์ตเดิมไม่สูญหายแน่นอนครับ</p>
        <textarea value={rawJsonInput} onChange={e=>setRawJsonInput(e.target.value)} placeholder="เทวางข้อความโค้ด JSON จากไฟล์สำรองที่นี่..." rows={3} className="w-full p-3 bg-white border border-slate-200 rounded-2xl text-[10px] font-mono focus:outline-none resize-none" />
        <button type="button" onClick={() => { if(rawJsonInput.trim()) onMigrate(rawJsonInput.trim()); }} className="w-full bg-[#012b25] hover:bg-[#033c32] text-white font-bold py-3.5 rounded-2xl text-[11px] transition-all shadow-md">⚡ เริ่มกระบวนการย้ายข้อมูลพอร์ตเข้า Subcollection ในคลิกเดียว</button>
        {migrationLog && <div className="p-3 bg-white border border-amber-200 text-amber-900 font-mono text-[10px] rounded-xl mt-2 whitespace-pre-wrap leading-normal">{migrationLog}</div>}
      </div>

      <div className="border-t border-slate-200/60 pt-4 mt-2"><button onClick={onClearAll} className="w-full p-3.5 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-2xl text-left font-bold text-xs">🗑️ ล้างทำลายล้างสระพอร์ตข้อมูลคลาวด์ทั้งหมดถาวร</button></div>
    </ModalWrapper>
  );
}
