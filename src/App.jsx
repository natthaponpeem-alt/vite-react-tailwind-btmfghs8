import React, { useState, useEffect, useMemo } from 'react';
import { 
  Home, Package, Lock, BarChart3, Settings, Plus, X, Copy, Download, 
  Upload, Trash2, Edit3, ChevronRight, ChevronLeft, AlertCircle, 
  CheckCircle2, Clock, Zap, Target, Wand2, FileText, Sparkles, 
  Trophy, Search, RefreshCw, DollarSign, Activity, LayoutGrid, 
  List, ArrowUpDown, ExternalLink, Database, Flame, TrendingUp, 
  TrendingDown, AlertTriangle, Lightbulb, Repeat, Cloud, CloudOff, User
} from 'lucide-react';

// ============================================================================
// [ZONE 1] FIREBASE CONFIGURATION & CORE ENGINE (ระบบหลังบ้านและการเชื่อมต่อคลาวด์)
// ============================================================================
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { 
  getFirestore, doc, setDoc, updateDoc, deleteDoc, collection, onSnapshot, writeBatch 
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

// ค่าคงที่ของระบบการตลาด (Business Rule Constraints)
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
const STATS_24H_WINDOW = [22, 30]; 
const STATS_7D_WINDOW = [156, 204]; 
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
  A: { label: 'A — ขายดี', short: 'A', desc: 'สินค้าขายดี', bg: 'bg-emerald-600', text: 'text-emerald-700', border: 'border-emerald-100', lightBg: 'bg-emerald-50' },
  B: { label: 'B — มาใหม่', short: 'B', desc: 'สินค้ามาใหม่/แนะนำ', bg: 'bg-blue-600', text: 'text-blue-700', border: 'border-blue-100', lightBg: 'bg-blue-50' },
  C: { label: 'C — ราคาประหยัด', short: 'C', desc: 'สินค้าราคาประหยัด', bg: 'bg-amber-600', text: 'text-amber-700', border: 'border-amber-100', lightBg: 'bg-amber-50' },
  D: { label: 'D — ค่าคอมสูง', short: 'D', desc: 'สินค้าคอมสูง/แพง', bg: 'bg-purple-600', text: 'text-purple-700', border: 'border-purple-100', lightBg: 'bg-purple-50' },
  V: { label: 'V — Value Content', short: 'V', desc: 'คลิปให้ความรู้', bg: 'bg-slate-500', text: 'text-slate-700', border: 'border-slate-100', lightBg: 'bg-slate-50' },
};

const DECISION_INFO = { 
  PICK: { label: 'PICK', bg: 'bg-emerald-500', text: 'text-emerald-700' }, 
  WAIT: { label: 'WAIT', bg: 'bg-amber-500', text: 'text-amber-700' }, 
  DROP: { label: 'DROP', bg: 'bg-rose-500', text: 'text-rose-700' } 
};

const PRODUCT_TYPES = [
  { id: 'supplement', label: 'อาหารเสริม', emoji: '💊' }, 
  { id: 'shoes', label: 'รองเท้ากีฬา', emoji: '👟' }, 
  { id: 'equipment', label: 'อุปกรณ์ออกกำลังกาย', emoji: '🏋️' }, 
  { id: 'apparel', label: 'เสื้อผ้าออกกำลังกาย', emoji: '👕' }, 
  { id: 'other', label: 'อื่นๆ', emoji: '📦' }
];

const SPLITTER_OPTIONS = { 
  persona: ['คนอ้วน', 'ผู้หญิง', 'มือใหม่', 'พนักงานออฟฟิศ', 'คนแก่/วัยกลางคน', 'คนเดินเยอะ', 'นักวิ่ง', 'คนลดน้ำหนัก', 'คนเล่นเวท'], 
  situation: ['เดินห้าง', 'วิ่งลู่', 'เดินงาน', 'เที่ยว', 'คาร์ดิโอ', 'เข้ายิม', 'เดินสวน', 'ทำงานออฟฟิศ', 'ก่อนนอน', 'หลังตื่นนอน'], 
  emotion: ['กลัวเจ็บ', 'ขี้เกียจเพราะเจ็บ', 'อยากเริ่มใหม่', 'อยากผอม', 'เหนื่อยจากงาน', 'อยากดูดี', 'อยากแข็งแรง', 'หมดหวังกับร่างกาย'], 
  format: ['POV', 'Story', 'Talking Head', 'Review', 'Compare', 'Voice Over', 'How-to', 'Listicle', 'Before/After'] 
};

const PAIN_SOURCES = [
  { id: 'shopee', label: '💬 Shopee/Lazada (1-3 ดาว)' }, 
  { id: 'tiktok', label: '🔍 TikTok + "แต่..."' }, 
  { id: 'pantip', label: '💭 Pantip / FB Groups' }, 
  { id: 'ai', label: '🤖 AI Persona Simulation' }, 
  { id: 'personal', label: '👤 ประสบการณ์ตรง' }
];

const CLIP_LEVELS = [
  { id: 'traffic', label: 'Traffic', color: 'bg-sky-500' }, 
  { id: 'consideration', label: 'Consideration', color: 'bg-purple-500' }, 
  { id: 'conversion', label: 'Conversion', color: 'bg-rose-500' }
];

// ============================================================================
// [ZONE 2] BUSINESS LOGIC FUNCTIONS (ระบบคำนวณและวิเคราะห์ข้อมูลการตลาด)
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
    if (hrs >= STATS_24H_WINDOW[0] && hrs <= STATS_24H_WINDOW[1] && !c.views24h) pending24h.push(c); 
    if (hrs >= STATS_7D_WINDOW[0] && hrs <= STATS_7D_WINDOW[1] && !c.views7d) pending7d.push(c); 
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

function getWinners(clips, products) {
  return clips.filter(c => (Number(c.gmv) || 0) >= WINNER_GMV).map(c => ({ clip: c, product: products.find(p => p.id === c.productId), daysOld: daysSince(c.postedAt) })).sort((a, b) => (Number(b.clip.gmv) || 0) - (Number(a.clip.gmv) || 0));
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
  products.forEach(p => { const s = getProductSales(p, clips, days); if (s.primary > 0) byProduct[p.id] = s.primary; });
  const totalGMV = Object.values(byProduct).reduce((s, v) => s + v, 0);
  if (totalGMV === 0) return null;
  const sorted = Object.entries(byProduct).sort((a, b) => b[1] - a[1]);
  return { pct: Math.round((sorted[0][1] / totalGMV) * 100), product: products.find(p => p.id === sorted[0][0]), totalGMV };
}

// ============================================================================
// [ZONE 3] MAIN APPLICATION & STATE SYSTEM (จุดควบคุมหลักและระบบย้ายข้อมูล)
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
  const [makeSimilarClip, setMakeSimilarClip] = useState(null);
  const [showBackup, setShowBackup] = useState(false);
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

    // Sync Settings / Target Document
    const settingsRef = doc(db, 'artifacts', APP_ID, 'users', user.uid, 'appData', 'settings');
    const unsubSettings = onSnapshot(settingsRef, (snap) => {
      if (snap.exists()) setMonthlyTarget(snap.data().monthlyTarget || DEFAULT_MONTHLY_CLIP_TARGET);
    });

    // Sync Products Subcollection
    const prodColRef = collection(db, 'artifacts', APP_ID, 'users', user.uid, 'products');
    const unsubProducts = onSnapshot(prodColRef, (snap) => {
      const prodList = []; snap.forEach(d => prodList.push({ id: d.id, ...d.data() }));
      setProducts(prodList);
      setDbInitialized(true);
      setIsSyncing(false);
    });

    // Sync Clips Subcollection
    const clipColRef = collection(db, 'artifacts', APP_ID, 'users', user.uid, 'clips');
    const unsubClips = onSnapshot(clipColRef, (snap) => {
      const clipList = []; snap.forEach(d => clipList.push({ id: d.id, ...d.data() }));
      setClips(clipList);
    });

    return () => { unsubSettings(); unsubProducts(); unsubClips(); };
  }, [user]);

  // ระบบสับหมูย้ายข้อมูลเก่า (Monolith -> Subcollection Migration Tool)
  const handleLegacyMigration = async (jsonData) => {
    if (!user) return;
    setMigrationLog("กำลังเริ่มต้นรื้อถอนและย้ายสิทธิ์ข้อมูล...");
    try {
      const parsed = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
      if (!parsed.products && !parsed.clips) {
        showToast("รูปแบบไฟล์สำรองไม่ถูกต้อง", "error");
        return;
      }

      // 1. ย้ายค่าเป้าหมายรายเดือน
      if (parsed.monthlyTarget) {
        await setDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'appData', 'settings'), { monthlyTarget: parsed.monthlyTarget });
      }

      // 2. แตกแถวสินค้าเซฟแยกทีละแฟ้ม
      let pCount = 0;
      for (const p of parsed.products) {
        await setDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'products', p.id), p);
        pCount++;
      }

      // 3. แตกแถวคลิปเซฟแยกทีละแฟ้ม
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

  // C.U.D. Operations ชี้ตรงรายแฟ้มเอกสาร
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
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-emerald-950 border-t-lime-400 rounded-full animate-spin"></div>
        <div className="font-semibold text-emerald-950 tracking-wide text-sm animate-pulse">PEEM6PACK COMMAND CENTER ENGINE STARTING...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col lg:flex-row" style={{ fontFamily: "'Inter', 'Noto Sans Thai', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+Thai:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Inter', 'Noto Sans Thai', sans-serif; font-weight: 700; }
      `}</style>

      {/* SIDEBAR NAVIGATION (Pharmly Layout Style) */}
      <aside className="w-full lg:w-64 bg-emerald-950 text-white flex flex-col justify-between border-r border-emerald-900 flex-shrink-0">
        <div>
          <div className="p-6 flex items-center justify-between border-b border-emerald-900">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-lime-400 text-emerald-950 rounded-xl flex items-center justify-center font-bold text-xl shadow-md">P6</div>
              <div>
                <h2 className="font-display text-base leading-none tracking-tight">Pharmly V2</h2>
                <span className="text-[10px] text-emerald-300 font-medium">Affiliate Hub</span>
              </div>
            </div>
            {isSyncing ? <CloudOff className="w-4 h-4 text-amber-400 animate-pulse" /> : <Cloud className="w-4 h-4 text-lime-400" />}
          </div>
          <nav className="p-4 space-y-1">
            {[
              { id: 'home', label: 'Overview แดชบอร์ด', icon: Home },
              { id: 'products', label: 'Products คลังสินค้า', icon: Package },
              { id: 'lock', label: 'Lock Focus รายเดือน', icon: Lock },
              { id: 'log', label: 'Clip Log & สถิติ', icon: BarChart3 }
            ].map(item => {
              const Icon = item.icon; const active = page === item.id;
              return (
                <button key={item.id} onClick={() => setPage(item.id)} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${active ? 'bg-lime-400 text-emerald-950 font-semibold shadow-sm' : 'text-emerald-100 hover:bg-emerald-900/50 hover:text-white'}`}>
                  <Icon className={`w-4 h-4 ${active ? 'stroke-[2.5]' : ''}`} /> {item.label}
                </button>
              );
            })}
          </nav>
        </div>
        
        <div className="p-4 border-t border-emerald-900 bg-emerald-950/40">
          <div className="bg-emerald-900/40 border border-emerald-800 rounded-xl p-3 mb-3 text-center">
            <div className="text-xs text-emerald-200 mb-1">สถานะระบบการเซฟคลาวด์</div>
            <div className="text-[11px] font-mono text-lime-400 font-bold">REAL-TIME SUBCOLLECTION</div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { setClipForVOnly(true); setShowAddClip(true); }} className="flex-1 bg-lime-400 hover:bg-lime-300 text-emerald-950 text-xs font-bold py-2.5 rounded-xl transition shadow-sm flex items-center justify-center gap-1">+ บันทึกคลิป</button>
            <button onClick={() => setShowSettings(true)} className="p-2.5 bg-emerald-900 text-emerald-100 rounded-xl hover:text-white transition"><Settings className="w-4 h-4" /></button>
          </div>
        </div>
      </aside>

      {/* MAIN LAYOUT WRAPPER */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 pb-24 lg:pb-10 bg-slate-50">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b border-slate-200 pb-5">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Command Center v2.0</span>
            <h1 className="font-display text-2xl md:text-3xl text-slate-900 mt-0.5">ยินดีต้อนรับกลับ, คุณภีม</h1>
          </div>
          <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-100 shadow-sm self-start md:self-auto">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center"><User className="w-4 h-4" /></div>
            <div className="text-xs"><div className="font-semibold text-slate-800">PEEM6PACK ช่องหลัก</div><div className="text-slate-400 font-medium font-mono text-[10px]">{user?.uid ? `ID: ${user.uid.slice(0,6)}...` : 'Connecting...'}</div></div>
          </div>
        </header>

        {page === 'home' && (
          <HomePage 
            products={products} clips={clips} lockedProducts={lockedProducts} 
            productsNeedingRescore={productsNeedingRescore} last7DaysClips={last7DaysClips} 
            monthlyTarget={monthlyTarget} onSetMonthlyTarget={(val) => setDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'appData', 'settings'), { monthlyTarget: val }, { merge: true })} 
            onGoTo={setPage} onSelectProduct={(id) => { setSelectedProductId(id); setPage('detail'); }} 
            onEditClip={(id) => setEditClipId(id)} onMakeSimilar={(clip) => setMakeSimilarClip(clip)} 
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
          <ClipLogPage products={products} clips={clips} onEditClip={(id) => setEditClipId(id)} onMakeSimilar={(clip) => setMakeSimilarClip(clip)} onMarkRepostDone={markRepostDone} onPromoteToA={async (id) => await updateProductInCloud(id, { category: 'A' })} />
        )}
      </main>

      {/* SYSTEM MODALS WRAPPERS */}
      {showAddProduct && <AddProductModal onClose={() => setShowAddProduct(false)} onSave={addProduct} showToast={showToast} />}
      {editScoreProductId && <EditScoreModal product={products.find(p => p.id === editScoreProductId)} onClose={() => setEditScoreProductId(null)} onSave={updateProductScore} />}
      {editProductInfoId && <EditProductInfoModal product={products.find(p => p.id === editProductInfoId)} onClose={() => setEditProductInfoId(null)} onSave={async (patch) => { await updateProductInCloud(editProductInfoId, patch); setEditProductInfoId(null); }} />}
      {showAddPain && selectedProduct && <AddPainModal onClose={() => setShowAddPain(false)} onSave={async (text, source) => { await updateProductInCloud(selectedProduct.id, { pains: [...(selectedProduct.pains || []), { id: uid(), text, source, createdAt: new Date().toISOString() }] }); setShowAddPain(false); }} />}
      {showAddAngle && selectedProduct && <AddAngleModal onClose={() => setShowAddAngle(false)} onSave={async (text) => { await updateProductInCloud(selectedProduct.id, { angles: [...(selectedProduct.angles || []), { id: uid(), text, createdAt: new Date().toISOString() }] }); setShowAddAngle(false); }} />}
      {showLockProduct && selectedProduct && <LockProductModal product={selectedProduct} onClose={() => setShowLockProduct(false)} onSave={async (target, angles) => { await updateProductInCloud(selectedProduct.id, { locked: { month: currentMonth(), targetClips: target, anglesToTest: angles, lockedAt: new Date().toISOString() } }); setShowLockProduct(false); }} />}
      {showAddClip && <AddClipModal products={products} defaultProductId={!clipForVOnly && selectedProduct ? selectedProduct.id : null} onClose={() => setShowAddClip(false)} onSave={addClip} showToast={showToast} />}
      {editClipId && <EditClipModal clip={clips.find(c => c.id === editClipId)} products={products} onClose={() => setEditClipId(null)} onSave={async (patch) => { await updateClip(editClipId, patch); setEditClipId(null); }} onDelete={() => { deleteClip(editClipId); setEditClipId(null); }} />}
      {makeSimilarClip && <MakeSimilarModal clip={makeSimilarClip} products={products} onClose={() => setMakeSimilarClip(null)} />}
      {showBackup && <BackupModal products={products} clips={clips} onClose={() => setShowBackup(false)} showToast={showToast} />}
      
      {showSettings && (
        <SettingsModal 
          onClose={() => setShowSettings(false)} 
          onExport={() => { setShowSettings(false); setShowBackup(true); }} 
          migrationLog={migrationLog}
          onMigrate={handleLegacyMigration}
          onClearAll={async () => {
            if (!confirm('⚠️ คำเตือนวิกฤต: ลบข้อมูลถาวรทั้งหมดออกจากสระ Subcollection?')) return;
            for (const p of products) await deleteDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'products', p.id));
            for (const c of clips) await deleteDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'clips', c.id));
            setShowSettings(false); showToast('เคลียร์ฐานข้อมูลคลาวด์เกลี้ยงแล้ว');
          }} 
        />
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
          <div className={`px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold tracking-wide flex items-center gap-2 ${toast.type === 'error' ? 'bg-rose-600 text-white' : 'bg-emerald-950 text-lime-300 border border-emerald-900'}`}>
            {toast.type === 'error' ? <AlertCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
            {toast.msg}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// [ZONE 4] UI COMPONENTS (หน้ากากแสดงผล แดชบอร์ดสไตล์ PHARMLY)
// ============================================================================
function InfoCard({ icon: Icon, label, value, sub, colorClass = "text-emerald-950" }) { 
  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex items-start justify-between">
      <div className="space-y-1">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">{label}</span>
        <div className={`font-display text-2xl md:text-3xl ${colorClass} tracking-tight`}>{value}</div>
        <div className="text-xs text-slate-500 font-medium mt-1">{sub}</div>
      </div>
      <div className="p-3 rounded-xl bg-slate-50 text-slate-400"><Icon className="w-5 h-5" /></div>
    </div>
  ); 
}

function ProgressIndicator({ label, value, target, suffix = "", sub }) {
  const pct = target > 0 ? Math.min(100, Math.round((value / target) * 100)) : 0;
  const isComplete = value >= target;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs"><span className="font-bold text-slate-500 uppercase tracking-wide">{label}</span><span className="font-mono font-bold text-slate-700">{value}/{target}{suffix}</span></div>
      <div className="font-display text-xl text-slate-900">{sub}</div>
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200/40">
        <div className={`h-full rounded-full transition-all duration-500 ${isComplete ? 'bg-emerald-500' : 'bg-lime-400'}`} style={{ width: `${pct}%` }}></div>
      </div>
    </div>
  );
}

function HomePage({ products, clips, lockedProducts, productsNeedingRescore, last7DaysClips, monthlyTarget, onSetMonthlyTarget, onGoTo, onSelectProduct, onEditClip }) {
  const today = todayStr();
  const clipsToday = clips.filter(c => c.postedAt?.slice(0, 10) === today);
  const totalGMVMonth = clips.filter(c => c.postedAt?.slice(0, 7) === currentMonth()).reduce((s, c) => s + (Number(c.gmv) || 0), 0);
  const tiktokTotal30d = useMemo(() => products.reduce((s, p) => s + (Number(p.salesData?.last30d) || Number(p.salesData?.last7d) || 0), 0), [products]);
  
  const pattern = last7DaysClips.map(c => { if (c.isV) return 'V'; const p = products.find(pp => pp.id === c.productId); return p?.category || '?'; });
  const repeats = []; for (let i = 0; i < pattern.length - 2; i++) { if (pattern[i] && pattern[i] === pattern[i + 1] && pattern[i] === pattern[i + 2]) repeats.push(pattern[i]); }
  const hasRepeatIssue = repeats.length > 0;

  const trendingProducts = useMemo(() => {
    return products.map(p => {
      const sales = getProductSales(p, clips, 7); const stats = getRevenuePerClip(p.id, clips, 7);
      return { product: p, ...stats, manual7d: sales.fromManual, hasManual: sales.hasManual, primary: sales.primary, isShopAds: !!p.isShopAds };
    }).filter(s => s.primary > 0).sort((a, b) => b.primary - a.primary).slice(0, 3);
  }, [products, clips]);

  const statsPending = useMemo(() => getStatsPending(clips), [clips]);
  const concentration = useMemo(() => getConcentration(clips, products, 30), [clips, products]);
  const blended = useMemo(() => getBlendedCommission(products, clips, 30), [products, clips]);
  const clipsThisMonth = clips.filter(c => c.postedAt?.slice(0, 7) === currentMonth()).length;

  return (
    <div className="space-y-6">
      {/* 4 CARD METRICS GRID (Pharmly Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <InfoCard icon={Package} label="Focused สินค้าหลัก" value={products.length} sub={`Lock ประจำเดือน: ${lockedProducts.length} ตัว`} />
        <InfoCard icon={Activity} label="ความถี่คลิป 7 วัน" value={last7DaysClips.length} sub={`เฉลี่ย ${(last7DaysClips.length / 7).toFixed(1)} คลิป/วัน`} colorClass="text-blue-900" />
        <InfoCard icon={DollarSign} label="GMV รวมจากคลิป" value={`฿${fmtNum(totalGMVMonth)}`} sub="สะสมภายในเดือนนี้" colorClass="text-emerald-700 font-bold" />
        <InfoCard icon={Flame} label="ยอดจริงฝั่ง TikTok Shop" value={`฿${fmtNum(tiktokTotal30d)}`} sub="ยอดขายแมนนวล 30 วันล่าสุด" colorClass="text-purple-700" />
      </div>

      {/* TWO COLUMN PERFORMANCE TARGETS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between"><h3 className="font-display text-base text-slate-800">🎯 ความคืบหน้าเป้าหมายการลงคลิป</h3><span className="text-xs text-slate-400 font-mono">เป้าหมายใหญ่</span></div>
          <ProgressIndicator label="Monthly Clips Volume" value={clipsThisMonth} target={monthlyTarget} sub={`${clipsThisMonth} คลิปเดือนนี้`} />
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between"><h3 className="font-display text-base text-slate-800">💰 Blended Commission % ช่อง</h3><span className="text-xs text-slate-400 font-mono">เป้าหมายพอร์ต</span></div>
          {blended ? (
            <ProgressIndicator label="Weighted Commission" value={Math.round(blended.blended)} target={BLENDED_COMMISSION_TARGET} suffix="%" sub={`${blended.blended}% ค่าคอมเฉลี่ย`} />
          ) : (
            <div className="text-xs text-slate-400 py-4 italic">ยังไม่มียอดขาย TikTok ในระบบสำหรับนำมาถ่วงน้ำหนักสัดส่วนคอมมิชชั่น</div>
          )}
        </div>
      </div>

      {/* DANGER CONCENTRATION ALERT */}
      {concentration && concentration.pct >= CONCENTRATION_LIMIT && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-2xl p-5 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div><h4 className="font-display text-sm">แจ้งเตือนความเสี่ยง: พึ่งพิงยอดขายสินค้าตัวเดียวเกินไป ({concentration.pct}%)</h4><p className="text-xs text-amber-800 mt-1">สินค้า "{concentration.product?.name}" ครองสัดส่วนพอร์ตส่วนใหญ่เกินเซฟโซนขีดจำกัดสูงสุดที่ ${CONCENTRATION_LIMIT}% แนะนำให้เร่งสร้างคลิปปั้นสินค้าหมวด B ตัวสำรองเพื่อกระจายความเสี่ยงช่องปลิว</p></div>
        </div>
      )}

      {/* TRENDING NOW & VISUAL LAYOUTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Trending Box */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm lg:col-span-2 space-y-4">
          <h3 className="font-display text-base flex items-center gap-2"><Flame className="w-4 h-4 text-rose-500" /> 🔥 อันดับสินค้าทำเงินสูงสุดในช่อง (7d)</h3>
          <div className="divide-y divide-slate-100">
            {trendingProducts.map((t, i) => (
              <button key={t.product.id} onClick={() => onSelectProduct(t.product.id)} className="w-full py-3.5 flex items-center justify-between text-left hover:bg-slate-50 px-2 rounded-xl transition-all">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="font-display text-slate-400 w-4">#{i+1}</span>
                  <div className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center ${ABCD_INFO[t.product.category].bg} text-white`}>{t.product.category}</div>
                  <div className="min-w-0"><div className="font-semibold text-sm text-slate-800 truncate">{t.product.name}</div><div className="text-[11px] text-slate-400 font-mono">คลิปสะสมสัปดาห์นี้: {t.clipCount} คลิป</div></div>
                </div>
                <div className="text-right flex-shrink-0 font-mono text-xs font-bold text-slate-800">฿{fmtNum(t.primary)}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: ABCD Pattern Indicator */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-3">
          <h3 className="font-display text-base flex items-center gap-2"><Zap className="w-4 h-4 text-lime-500" /> Variety ลำดับคำสั่งโพสต์</h3>
          <div className="flex flex-wrap gap-1.5 py-2">
            {pattern.length === 0 ? (
              <div className="text-xs text-slate-400 italic">ยังไม่มีการบันทึกประวัติคลิปสัปดาห์นี้</div>
            ) : (
              pattern.map((cat, idx) => (
                <div key={idx} className={`w-8 h-8 rounded-lg ${ABCD_INFO[cat]?.bg || 'bg-slate-300'} text-white font-display flex items-center justify-center text-xs shadow-sm`}>{ABCD_INFO[cat]?.short || '?'}</div>
              ))
            )}
          </div>
          {hasRepeatIssue && (
            <div className="bg-rose-50 text-rose-700 text-[11px] p-2.5 rounded-xl border border-rose-100 flex items-start gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              <div>ลงรหัสซ้ำติดต่อกันเกินไป เสี่ยงผู้ติดตามเบื่ออัลกอริทึมจับได้ ควรจัดระเบียบสลับลงแบบฟันปลา</div>
            </div>
          )}
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
      <div className="flex items-center justify-between">
        <div><h2 className="font-display text-xl text-slate-800">คลังสินค้าคัดกรองทั้งหมด ({products.length})</h2><p className="text-xs text-slate-400">ควบคุมเกณฑ์คะแนนพอร์ตโฟลิโอและนางฟ้าช่อง</p></div>
        <button onClick={onAdd} className="bg-emerald-950 text-white font-bold text-xs px-4 py-2.5 rounded-xl hover:bg-emerald-900 transition flex items-center gap-1 shadow-sm"><Plus className="w-4 h-4" /> เพิ่มสินค้าคัดกรอง</button>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="พิมพ์ค้นชื่อแบรนด์หรือชื่อสินค้าหลัก..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm shadow-sm focus:outline-none focus:border-emerald-900" /></div>
        <div className="flex gap-1 overflow-x-auto pb-1">
          {['all', 'A', 'B', 'C', 'D'].map(cat => (
            <button key={cat} onClick={() => setFilter(cat)} className={`text-xs font-semibold px-4 py-2.5 rounded-xl border transition-all ${filter === cat ? 'bg-emerald-950 text-white border-transparent' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}>{cat === 'all' ? 'ทุกหมวด' : `หมวด ${cat}`}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(p => {
          const clipCount = clips.filter(c => c.productId === p.id).length;
          const isStale = daysSince(p.lastScoredAt) >= RESCORE_DAYS;
          return (
            <div key={p.id} onClick={() => onSelect(p.id)} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between relative group">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-6 h-6 rounded-md font-bold text-xs flex items-center justify-center ${ABCD_INFO[p.category].bg} text-white`}>{p.category}</div>
                    {p.isShopAds && <span className="text-[9px] bg-rose-100 text-rose-700 font-bold px-1.5 py-0.5 rounded-md">🛒 Ads</span>}
                    {p.price > 0 && <span className="text-[10px] bg-slate-100 text-slate-600 font-semibold font-mono px-1.5 py-0.5 rounded-md">฿{p.price}</span>}
                  </div>
                  <div className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${DECISION_INFO[p.decision]?.bg} text-white`}>{p.decision}</div>
                </div>
                <h3 className="font-display text-base text-slate-800 line-clamp-1 group-hover:text-emerald-950 transition-colors">{p.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">{p.brand || 'ไม่ระบุแบรนด์'}</p>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-50 flex items-end justify-between">
                <div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Argoon Score</div>
                  <div className="font-mono font-bold text-sm text-slate-800 mt-0.5">{p.score}/{p.maxScore} <span className="text-xs text-slate-400 font-normal">({p.scorePct}%)</span></div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block font-medium">บันทึกสะสม</span>
                  <span className="text-xs font-semibold text-slate-700 font-mono">{clipCount} คลิป</span>
                </div>
              </div>
              {isStale && <div className="absolute top-0 right-1/2 translate-x-1/2 -mt-1 bg-amber-500 text-white font-bold text-[9px] px-2 py-0.5 rounded-full shadow-sm">ค้างคัดกรองใหม่</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProductDetailPage({ product, clips, allClips, onBack, onTogglePillar, onSetCategory, onAddPain, onRemovePain, onAddAngle, onRemoveAngle, onEditScore, onEditInfo, onLock, onUnlock, onDelete, onAddClip, onEditClip }) {
  const sales30d = useMemo(() => getProductSales(product, allClips, 30), [product, allClips]);
  const bestAngle = useMemo(() => getBestAngle(product, allClips), [product, allClips]);
  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-1 text-xs font-bold text-slate-400 hover:text-slate-800 transition"><ChevronLeft className="w-4 h-4" /> ย้อนกลับหน้าคลังสินค้า</button>
      
      {/* RICH PRODUCT HEADER BOX */}
      <div className="bg-emerald-950 text-white rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="space-y-3 flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] bg-emerald-900 border border-emerald-800 font-bold px-2 py-0.5 rounded-md text-emerald-300">{PRODUCT_TYPES.find(t=>t.id===product.productType)?.label}</span>
            {product.isShopAds && <span className="text-[11px] bg-rose-500 text-white font-bold px-2 py-0.5 rounded-md">🛒 ตะกร้าแดง / Shop Ads</span>}
            {product.price > 0 && <span className="text-[11px] bg-lime-400 text-emerald-950 font-bold px-2 py-0.5 rounded-md font-mono">฿{fmtNum(product.price)}</span>}
          </div>
          <h2 className="font-display text-xl md:text-2xl tracking-tight leading-tight">{product.name}</h2>
          <p className="text-emerald-300 text-xs font-medium">แบรนด์: {product.brand || '-'}</p>
          <div className="flex gap-2 pt-1">
            {product.tiktokLink && <a href={product.tiktokLink} target="_blank" rel="noreferrer" className="text-[11px] bg-emerald-900 border border-emerald-800 px-2.5 py-1 rounded-md text-emerald-100 flex items-center gap-1 hover:bg-emerald-850"><ExternalLink className="w-3 h-3" /> TikTok Link</a>}
            {product.kalodataLink && <a href={product.kalodataLink} target="_blank" rel="noreferrer" className="text-[11px] bg-emerald-900 border border-emerald-800 px-2.5 py-1 rounded-md text-emerald-100 flex items-center gap-1 hover:bg-emerald-850"><ExternalLink className="w-3 h-3" /> Kalodata</a>}
          </div>
        </div>

        <div className="flex flex-col gap-2 flex-shrink-0 bg-emerald-900/40 p-4 border border-emerald-900 rounded-xl min-w-[160px]">
          <div className="text-[10px] uppercase font-bold text-emerald-300 tracking-wider">Argoon Pass</div>
          <div className="font-mono font-bold text-2xl">{product.score}/{product.maxScore}</div>
          <div className="text-xs text-emerald-200">สัดส่วนพอร์ต: {product.scorePct}%</div>
          <div className="pt-2 flex gap-1.5 border-t border-emerald-800/60 mt-1">
            <button onClick={onEditScore} className="flex-1 bg-lime-400 text-emerald-950 text-[11px] font-bold py-1.5 rounded-md text-center">คัดเกณฑ์คะแนนใหม่</button>
            <button onClick={onEditInfo} className="p-1.5 bg-emerald-800 text-emerald-100 rounded-md hover:text-white"><Edit3 className="w-3.5 h-3.5" /></button>
          </div>
        </div>
      </div>

      {/* QUICK ABCD CATEGORY MANAGEMENT PILLS */}
      <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">สลับย้ายหมวดสินค้าด่วน:</div>
        <div className="flex flex-wrap gap-1">
          {['A', 'B', 'C', 'D'].map(cat => (
            <button key={cat} onClick={() => onSetCategory(cat)} className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-all ${product.category === cat ? `${ABCD_INFO[cat].bg} text-white` : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>หมวด {cat}</button>
          ))}
        </div>
      </div>

      {/* PAIN & ANGLE BANKS DOUBLE COLUMN */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pain Bank */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between"><h3 className="font-display text-base text-slate-800">😣 Pain Bank ถังความเจ็บปวด ({product.pains?.length || 0})</h3><button onClick={onAddPain} className="bg-slate-100 text-slate-700 font-bold text-[11px] px-2.5 py-1.5 rounded-lg hover:bg-slate-200 transition">+ เพิ่ม Pain</button></div>
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {(!product.pains || product.pains.length === 0) ? (
              <p className="text-xs text-slate-400 italic text-center py-4">ยังไม่มียอดคลัง Pain เพื่อไปรันระบบ Splitter</p>
            ) : (
              product.pains.map(p => (
                <div key={p.id} className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl flex items-start justify-between gap-2 text-xs"><div className="space-y-0.5"><p className="text-slate-700 leading-normal">{p.text}</p><span className="text-[9px] text-slate-400 uppercase font-medium">{PAIN_SOURCES.find(s=>s.id===p.source)?.label}</span></div><button onClick={() => onRemovePain(p.id)} className="text-slate-300 hover:text-rose-500 transition-colors p-1"><Trash2 className="w-3.5 h-3.5" /></button></div>
              ))
            )}
          </div>
        </div>

        {/* Angle Bank */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between"><h3 className="font-display text-base text-slate-800">🎯 Angle Bank มุมการเล่นคอนเทนต์ ({product.angles?.length || 0})</h3><button onClick={onAddAngle} className="bg-slate-100 text-slate-700 font-bold text-[11px] px-2.5 py-1.5 rounded-lg hover:bg-slate-200 transition">+ เพิ่ม Angle</button></div>
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {(!product.angles || product.angles.length === 0) ? (
              <p className="text-xs text-slate-400 italic text-center py-4">ยังไม่มียอดมุมมอง Angle นำสายตา</p>
            ) : (
              product.angles.map(a => (
                <div key={a.id} className="p-2.5 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between gap-2 text-xs"><p className="text-slate-700">{a.text}</p><button onClick={() => onRemoveAngle(a.id)} className="text-slate-300 hover:text-rose-500 transition-colors p-1"><Trash2 className="w-3.5 h-3.5" /></button></div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* CORE PROMPT GENERATOR ENGINE (SPLITTER CONTAINER) */}
      <SplitterSection product={product} />

      {/* CLIPS UNDER THIS SPECIFIC PRODUCT */}
      <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between"><h3 className="font-display text-base text-slate-800">🎬 ประวัติคลิปที่ผูกสิทธิ์กับสินค้านี้ ({clips.length})</h3><button onClick={onAddClip} className="bg-lime-400 text-emerald-950 font-bold text-[11px] px-3 py-1.5 rounded-lg hover:bg-lime-300 transition shadow-sm">+ บันทึกคลิปใหม่</button></div>
        <div className="space-y-2">
          {clips.length === 0 ? (
            <p className="text-xs text-slate-400 italic text-center py-6">ยังไม่มีคลิปบันทึกเฉพาะสินค้าชิ้นนี้ในสระข้อมูล</p>
          ) : (
            [...clips].reverse().map(c => (
              <div key={c.id} onClick={() => onEditClip(c.id)} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between hover:bg-slate-100 transition-all cursor-pointer text-xs">
                <div className="min-w-0 flex-1 pr-4">
                  <div className="font-semibold text-slate-800 truncate">{c.hook || '(ไม่มี Hook นำสายตา)'}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">ลงเมื่อ: {fmtDate(c.postedAt)} · ยอดวิว 7 วัน: {fmtNum(c.views7d || 0)} วิว</div>
                </div>
                <div className="text-right flex-shrink-0 font-mono font-bold text-emerald-700">฿{fmtNum(c.gmv || 0)}</div>
              </div>
            ))
          )}
        </div>
      </div>

      <button onClick={onDelete} className="w-full bg-slate-100 text-slate-400 hover:bg-rose-50 hover:text-rose-600 text-xs font-semibold py-3 rounded-xl border border-slate-200/40 transition-all">⚙️ ลบรายการสินค้าชิ้นนี้ออกจากระบบสารระบบถาวร</button>
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
    <div className="bg-emerald-950 text-white rounded-2xl p-5 md:p-6 shadow-sm border border-emerald-900 space-y-4">
      <div><h3 className="font-display text-lg flex items-center gap-2 text-lime-400"><Wand2 className="w-5 h-5" /> ระบบเครื่องผสมคอนเทนต์ Splitter Engine v2</h3><p className="text-xs text-emerald-300">กดจับคู่ตัวแปรกวนพอร์ตรหัสคอนเทนต์เพื่อดีด Prompt ป้อนคุยกับ Claude/ChatGPT ได้ทันที</p></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
        <div><label className="text-[10px] uppercase font-bold text-emerald-300 block mb-1">Pillar หลัก</label><select value={pillarId} onChange={e=>setPillarId(e.target.value)} className="w-full px-2.5 py-2 bg-emerald-900/60 border border-emerald-800 rounded-xl focus:outline-none">{<option value="">-- เลือก --</option>}{DEFAULT_PILLARS.map(pl=><option key={pl.id} value={pl.id}>{pl.id} - {pl.name}</option>)}</select></div>
        <div><label className="text-[10px] uppercase font-bold text-emerald-300 block mb-1">Pain Point</label><select value={painId} onChange={e=>setPainId(e.target.value)} className="w-full px-2.5 py-2 bg-emerald-900/60 border border-emerald-800 rounded-xl focus:outline-none">{<option value="">-- เลือก --</option>}{product.pains?.map(pn=><option key={pn.id} value={pn.id}>{truncate(pn.text, 25)}</option>)}</select></div>
        <div><label className="text-[10px] uppercase font-bold text-emerald-300 block mb-1">Angle เล่า</label><select value={angleId} onChange={e=>setAngleId(e.target.value)} className="w-full px-2.5 py-2 bg-emerald-900/60 border border-emerald-800 rounded-xl focus:outline-none">{<option value="">-- เลือก --</option>}{product.angles?.map(an=><option key={an.id} value={an.id}>{truncate(an.text, 25)}</option>)}</select></div>
        <div><label className="text-[10px] uppercase font-bold text-emerald-300 block mb-1">Persona</label><select value={persona} onChange={e=>setPersona(e.target.value)} className="w-full px-2.5 py-2 bg-emerald-900/60 border border-emerald-800 rounded-xl focus:outline-none">{<option value="">-- เลือก --</option>}{SPLITTER_OPTIONS.persona.map(ps=><option key={ps} value={ps}>{ps}</option>)}</select></div>
        <div><label className="text-[10px] uppercase font-bold text-emerald-300 block mb-1">Situation</label><select value={situation} onChange={e=>setSituation(e.target.value)} className="w-full px-2.5 py-2 bg-emerald-900/60 border border-emerald-800 rounded-xl focus:outline-none">{<option value="">-- เลือก --</option>}{SPLITTER_OPTIONS.situation.map(st=><option key={st} value={st}>{st}</option>)}</select></div>
        <div><label className="text-[10px] uppercase font-bold text-emerald-300 block mb-1">Emotion</label><select value={emotion} onChange={e=>setEmotion(e.target.value)} className="w-full px-2.5 py-2 bg-emerald-900/60 border border-emerald-800 rounded-xl focus:outline-none">{<option value="">-- เลือก --</option>}{SPLITTER_OPTIONS.emotion.map(em=><option key={em} value={em}>{em}</option>)}</select></div>
        <div><label className="text-[10px] uppercase font-bold text-emerald-300 block mb-1">Format</label><select value={format} onChange={e=>setFormat(e.target.value)} className="w-full px-2.5 py-2 bg-emerald-900/60 border border-emerald-800 rounded-xl focus:outline-none">{<option value="">-- เลือก --</option>}{SPLITTER_OPTIONS.format.map(fm=><option key={fm} value={fm}>{fm}</option>)}</select></div>
        <div><label className="text-[10px] uppercase font-bold text-emerald-300 block mb-1">ความยาวสคริปต์ (วิ)</label><input type="number" value={duration} onChange={e=>setDuration(e.target.value)} className="w-full px-2.5 py-2 bg-emerald-900/60 border border-emerald-800 rounded-xl focus:outline-none font-mono" /></div>
      </div>
      <div><label className="text-[10px] uppercase font-bold text-emerald-300 block mb-1">ประโยค Hook เปิดหัว (Optional)</label><input value={hook} onChange={e=>setHook(e.target.value)} placeholder="เช่น อย่าพึ่งซื้อน้ำมันปลาถ้ายังไม่ได้อ่านหลังกล่อง..." className="w-full text-xs px-3 py-2 bg-emerald-900/60 border border-emerald-800 rounded-xl focus:outline-none placeholder:text-emerald-700 text-white" /></div>
      <button onClick={handleCopy} className={`w-full text-sm font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 ${copied ? 'bg-emerald-500 text-white' : 'bg-lime-400 text-emerald-950 hover:bg-lime-300 shadow-md'}`}>{copied ? <><CheckCircle2 className="w-4 h-4" /> เจนเนอเรตและ Copy พรอมต์เรียบร้อย ไปวางคุยต่อได้เลย!</> : <><Copy className="w-4 h-4" /> ดึงสูตรสคริปต์คอมโบสำเร็จรูป (Copy AI Prompt)</>}</button>
    </div>
  );
}

function LockListPage({ lockedProducts, products, clips, onSelectProduct, onUnlock, onLockNew }) {
  const monthKey = currentMonth();
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h2 className="font-display text-xl text-slate-800">รายการเป้าหมายยุทธศาสตร์ Lock List เดือนนี้</h2><p className="text-xs text-slate-400">คุมปริมาณสัดส่วน Content Variety ตามกรอบ HOT / STEADY / PASSIVE</p></div>
        <button onClick={onLockNew} className="bg-emerald-950 text-white text-xs font-bold px-4 py-2.5 rounded-xl hover:bg-emerald-900 transition shadow-sm">+ จัดสรรโฟกัสรายการใหม่</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {lockedProducts.length === 0 ? (
          <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center text-slate-400 font-medium md:col-span-2 shadow-sm">ไม่มีข้อมูลสินค้าที่ถูกตรึงเป้าในระบบสารระบบโฟกัสสัปดาห์นี้</div>
        ) : (
          lockedProducts.map(p => {
            const made = clips.filter(c => c.productId === p.id && c.postedAt?.slice(0, 7) === monthKey).length;
            const target = p.locked?.targetClips || 1;
            const pct = Math.min(100, Math.round((made / target) * 100));
            return (
              <div key={p.id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-md font-bold text-xs flex items-center justify-center ${ABCD_INFO[p.category].bg} text-white`}>{p.category}</div>
                      <span className="font-display font-bold text-base text-slate-800 truncate max-w-[180px]">{p.name}</span>
                    </div>
                    <button onClick={() => onUnlock(p.id)} className="text-slate-300 hover:text-rose-500 transition-colors p-1" title="ปลดล็อคโฟกัส">🔓 ปลดล็อก</button>
                  </div>
                  <div className="flex items-center justify-between text-xs font-mono font-bold text-slate-600 mb-1"><span>ความคืบหน้าการปั๊มยอดคลิป:</span><span>{made} / {target} คลิป</span></div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200/40"><div className="h-full bg-lime-400 rounded-full transition-all duration-300" style={{ width: `${pct}%` }}></div></div>
                </div>
                <button onClick={() => onSelectProduct(p.id)} className="w-full bg-slate-50 text-slate-700 text-xs font-bold py-2 rounded-xl text-center border border-slate-100 hover:bg-slate-100 transition-colors mt-2">เปิดดูคลังข้อมูลและสคริปต์ Splitter →</button>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

function ClipLogPage({ products, clips, onEditClip, onMakeSimilar, onMarkRepostDone, onPromoteToA }) {
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
      {/* 2-COLUMN LOG VIEW PANEL */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
        {/* Left Core Table Log */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm xl:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div><h3 className="font-display text-base text-slate-800">📋 คลังบันทึกประวัติวิดีโอคลิป (Clip Logs)</h3><p className="text-xs text-slate-400">กดรายแถวตารางเพื่ออัปเดต Views ครบกำหนด 24h / 7d</p></div>
            <div className="flex gap-1">
              {['7', '30', 'all'].map(p => (
                <button key={p} onClick={() => setPeriod(p)} className={`text-[11px] font-bold px-3 py-1.5 rounded-lg border ${period === p ? 'bg-emerald-950 text-white border-transparent' : 'bg-slate-50 text-slate-600'}`}>{p === 'all' ? 'ทั้งหมด' : `${p} วันล่าสุด`}</button>
              ))}
            </div>
          </div>
          <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="ค้นหาตามข้อความ Hook..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs focus:outline-none focus:border-emerald-950" /></div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead><tr className="bg-slate-50 text-slate-400 uppercase font-bold tracking-wider border-b border-slate-100"><th className="p-3">วันที่ลง</th><th className="p-3">สินค้าหลัก</th><th className="p-3">ประโยคสคริปต์ Hook</th><th className="p-3 text-right">Views 7d</th><th className="p-3 text-right">GMV สรุป</th></tr></thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(c => {
                  const prod = products.find(p=>p.id === c.productId);
                  return (
                    <tr key={c.id} onClick={() => onEditClip(c.id)} className="hover:bg-slate-50/80 cursor-pointer transition-colors text-slate-700">
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

        {/* Right Financial ROI Dashboard Path (Pharmly Metric Style) */}
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="border-b border-slate-50 pb-3"><h3 className="font-display text-base text-slate-800">💰 เส้นทางรายได้สุทธิประจำเดือน</h3><p className="text-xs text-slate-400 font-medium">สูตรคำนวณสะสม: ยอดขายจริง $\times$ ค่าคอม %</p></div>
          <div className="p-4 bg-gradient-to-br from-slate-900 to-emerald-950 text-white rounded-xl space-y-1.5 shadow-inner">
            <div className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">ประมาณการค่าคอมปัจจุบัน</div>
            <div className="font-display text-2xl font-bold tracking-tight">฿{fmtNum(Math.round(roi.totalCommRevenue))}</div>
            <div className="w-full h-1.5 bg-emerald-900 rounded-full overflow-hidden"><div className="h-full bg-lime-400 rounded-full" style={{ width: `${Math.min(100, roi.pct)}%` }}></div></div>
            <div className="flex items-center justify-between text-[10px] text-emerald-200 mt-1 font-mono"><span>{roi.pct}% ถึงเป้า</span><span>ยังขาดอีก: ฿{fmtNum(Math.round(roi.gap))}</span></div>
          </div>

          <div className="space-y-2 max-h-[250px] overflow-y-auto pr-1">
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">สัดส่วนรายได้เรียงรายสินค้า:</div>
            {roi.items.map(i => (
              <div key={i.product.id} className="p-2 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-2 text-xs">
                <span className="font-semibold text-slate-700 truncate max-w-[150px]">{i.product.name}</span>
                <span className="font-mono font-bold text-slate-900">฿{fmtNum(Math.round(i.currentCommRevenue))}</span>
              </div>
            ))}
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
    <div className="fixed inset-0 bg-emerald-950/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col relative max-h-[85vh] overflow-hidden border border-slate-100">
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 bg-slate-50 hover:bg-slate-100 text-slate-400 rounded-full transition-colors z-10"><X className="w-4 h-4" /></button>
        <div className="px-6 py-4 border-b border-slate-100 bg-white"><h3 className="font-display text-base text-slate-800">{title}</h3></div>
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
  const [price, setPrice] = useState(''); const [tiktokRank, setTiktokRank] = useState('');
  const [commission, setCommission] = useState('10'); const [isShopAds, setIsShopAds] = useState(false);

  const handleSave = () => {
    if (!name) { showToast("กรุณาระบุชื่อสินค้า", "error"); return; }
    onSave({ name, brand, category, productType, price: Number(price)||0, tiktokRank: Number(tiktokRank)||null, isShopAds, scorecard: { commission: Number(commission)||0 } });
    onClose();
  };

  return (
    <ModalWrapper title="เพิ่มประวัติข้อมูลสินค้าใหม่" onClose={onClose} footer={<button onClick={handleSave} className="w-full bg-emerald-950 text-white font-bold py-3 rounded-xl hover:bg-emerald-900 transition text-xs shadow-sm">เซฟลงฐานข้อมูลหลัก</button>}>
      <InputField label="ชื่อเรียกรายการสินค้า *"><input value={name} onChange={e=>setName(e.target.value)} placeholder="เช่น Baam Creatine 300g" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none" /></InputField>
      <InputField label="ชื่อแบรนด์"><input value={brand} onChange={e=>setBrand(e.target.value)} placeholder="เช่น Fitway" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none" /></InputField>
      <InputField label="ประเภทสินค้าหลัก"><select value={productType} onChange={e=>setProductType(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none">{PRODUCT_TYPES.map(t=><option key={t.id} value={t.id}>{t.emoji} {t.label}</option>)}</select></InputField>
      <div className="grid grid-cols-2 gap-3">
        <InputField label="ราคาขายหน้าร้าน ฿"><input type="number" value={price} onChange={e=>setPrice(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none font-mono" /></InputField>
        <InputField label="เปอร์เซ็นต์ค่าคอม %"><input type="number" value={commission} onChange={e=>setCommission(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none font-mono" /></InputField>
      </div>
      <InputField label="หมวดหมู่ยุทธศาสตร์พอร์ต"><select value={category} onChange={e=>setCategory(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none">{['A','B','C','D'].map(c=><option key={c} value={c}>หมวด {c} - {ABCD_INFO[c].desc}</option>)}</select></InputField>
      <label className="flex items-center gap-2 bg-white p-3 border border-slate-100 rounded-xl cursor-pointer"><input type="checkbox" checked={isShopAds} onChange={e=>setIsShopAds(e.target.checked)} className="w-4 h-4 rounded text-emerald-950 focus:ring-0" /><span className="text-xs font-semibold text-slate-700">🛒 สินค้านี้เข้าร่วมแคมเปญสิทธิ์ตะกร้าแดง (Shop Ads)</span></label>
    </ModalWrapper>
  );
}

function EditProductInfoModal({ product, onClose, onSave }) {
  const [name, setName] = useState(product.name || ''); const [brand, setBrand] = useState(product.brand || '');
  const [price, setPrice] = useState(product.price || ''); const [isShopAds, setIsShopAds] = useState(!!product.isShopAds);
  const [last7d, setLast7d] = useState(product.salesData?.last7d || ''); const [last30d, setLast30d] = useState(product.salesData?.last30d || '');

  return (
    <ModalWrapper title="แก้ไขรายละเอียดเชิงลึกของแฟ้มสินค้า" onClose={onClose} footer={<button onClick={() => { onSave({ name, brand, price: Number(price), isShopAds, salesData: { last7d: Number(last7d), last30d: Number(last30d), updatedAt: new Date().toISOString() } }); }} className="w-full bg-emerald-950 text-white font-bold py-3 rounded-xl hover:bg-emerald-900 transition text-xs shadow-sm">อัปเดตสิทธิ์ข้อมูล</button>}>
      <InputField label="ชื่อเรียกสินค้าทางการ"><input value={name} onChange={e=>setName(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none" /></InputField>
      <InputField label="ชื่อแบรนด์ผู้จัดจำหน่าย"><input value={brand} onChange={e=>setBrand(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none" /></InputField>
      <InputField label="ราคาหน้าร้านสุทธิ ฿"><input type="number" value={price} onChange={e=>setPrice(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none font-mono" /></InputField>
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
    <ModalWrapper title="ประเมินทบทวนน้ำหนักคะแนน Argoon Score" onClose={onClose} footer={<button onClick={() => onSave(product.id, { ...product.scorecard, commission: Number(comm), crPct: Number(cr), concentration: Number(conc) })} className="w-full bg-emerald-950 text-white font-bold py-3 rounded-xl hover:bg-emerald-900 transition text-xs shadow-sm">ประมวลผลเซฟสิทธิ์เกณฑ์คะแนนใหม่</button>}>
      <div className="space-y-3">
        <InputField label="อัตราเปอร์เซ็นต์ค่าคอมมิชชั่นล่าสุด %"><input type="number" value={comm} onChange={e=>setComm(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none font-mono" /></InputField>
        <InputField label="อัตราการซื้อสำเร็จร้านค้า (CR %)"><input type="number" value={cr} onChange={e=>setCr(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none font-mono" /></InputField>
        <InputField label="ค่าเปอร์เซ็นต์ความเข้มข้นตลาด (Concentration %)"><input type="number" value={conc} onChange={e=>setConc(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none font-mono" /></InputField>
      </div>
    </ModalWrapper>
  );
}

function AddPainModal({ onClose, onSave }) {
  const [text, setText] = useState(''); const [source, setSource] = useState('personal');
  return (
    <ModalWrapper title="📥 เพิ่ม Pain Point ถังความเจ็บปวดผู้ซื้อ" onClose={onClose} footer={<button onClick={() => { if(text.trim()) onSave(text.trim(), source); }} className="w-full bg-emerald-950 text-white font-bold py-3 rounded-xl hover:bg-emerald-900 transition text-xs">เซฟบรรจุลงคลัง Pain</button>}>
      <InputField label="ประโยคปัญหา / คำบ่นลูกค้าในคอมเมนต์"><textarea value={text} onChange={e=>setText(e.target.value)} rows={3} placeholder="เช่น ทานแล้วละลายยาก มีก้อนนอนก้นหนืดคอ..." className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none" /></InputField>
      <InputField label="ที่มาแหล่งที่มาข้อมูลปัญหา"><select value={source} onChange={e=>setSource(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none">{PAIN_SOURCES.map(s=><option key={s.id} value={s.id}>{s.label}</option>)}</select></InputField>
    </ModalWrapper>
  );
}

/* รวบฟังก์ชันโมดัลแฝดชิ้นสั้นเพื่อรักษารูปแบบ Single-File คลีน */
function AddAngleModal({ onClose, onSave }) {
  const [text, setText] = useState('');
  return (
    <ModalWrapper title="🎯 เพิ่มมุมมองนำสายตาคอนเทนต์ (Angle Bank)" onClose={onClose} footer={<button onClick={() => { if(text.trim()) onSave(text.trim()); }} className="w-full bg-emerald-950 text-white font-bold py-3 rounded-xl">บรรจุเข้ากระดาน</button>}>
      <InputField label="ไอเดียมุมเล่าปักหัวสคริปต์"><textarea value={text} onChange={e=>setText(e.target.value)} rows={3} placeholder="เช่น แบไต๋พิสูจน์ตักสเปกดู EPA หลังกล่องแทนฉลากหน้าแบรนด์..." className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none" /></InputField>
    </ModalWrapper>
  );
}

function LockProductModal({ product, onClose, onSave }) {
  const [target, setTarget] = useState(10);
  return (
    <ModalWrapper title={`🔒 ตรึงโฟกัสสินค้าเป้าหมายเดือนนี้`} onClose={onClose} footer={<button onClick={() => onSave(target, [])} className="w-full bg-emerald-950 text-white font-bold py-3 rounded-xl">ล็อกตำแหน่งยุทธศาสตร์หลัก</button>}>
      <InputField label="จำนวนคลิปเป้าหมายย่อยที่ต้องส่งมอบในเดือนนี้"><input type="number" value={target} onChange={e=>setTarget(Number(e.target.value))} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono focus:outline-none" /></InputField>
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
    <ModalWrapper title="🎬 บันทึกวิดีโอคลิปลงคลังประวัติ Log" onClose={onClose} footer={<button onClick={handleSave} className="w-full bg-emerald-950 text-white font-bold py-3 rounded-xl text-xs shadow-sm">กด Commit บันทึกลง Subcollection</button>}>
      <InputField label="รูปแบบคัตคลาสชนิดคลิป"><div className="grid grid-cols-2 gap-2"><button type="button" onClick={() => setIsV(false)} className={`py-2 text-center border font-bold rounded-xl ${!isV ? 'bg-emerald-950 text-white border-transparent' : 'bg-white text-slate-600'}`}>📦 คลิปตะกร้าขายสินค้า</button><button type="button" onClick={() => setIsV(true)} className={`py-2 text-center border font-bold rounded-xl ${isV ? 'bg-emerald-950 text-white border-transparent' : 'bg-white text-slate-600'}`}>📚 คลิปความรู้สาย (V)</button></div></InputField>
      {!isV && (<InputField label="จับคู่ชิ้นสินค้าหลัก"><select value={productId} onChange={e=>setProductId(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none"><option value="">-- กรุณาเลือกรายการ --</option>{products.map(p=><option key={p.id} value={p.id}>[{p.category}] - {p.name}</option>)}</select></InputField>)}
      <InputField label="สเปก Pillar ประจำคลิป"><select value={pillarId} onChange={e=>setPillarId(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none font-semibold"><option value="">-</option>{DEFAULT_PILLARS.map(pl=><option key={pl.id} value={pl.id}>{pl.id} - {pl.name}</option>)}</select></InputField>
      <InputField label="ข้อความประโยคคำเปิดหัว Hook (สแกนตรวจจับ Winnerง่าย)"><input value={hook} onChange={e=>setHook(e.target.value)} placeholder="พิมพ์คำแรก 3 วินาทีแรกของคลิป..." className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none" /></InputField>
      <div className="grid grid-cols-2 gap-2">
        <InputField label="ยอดวิวสะสมครบ 7 วันล่าสุด"><input type="number" value={views7d} onChange={e=>setViews7d(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono focus:outline-none" /></InputField>
        <InputField label="ยอดรวมค่า GMV คลิป ฿"><input type="number" value={gmv} onChange={e=>setGmv(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono focus:outline-none" /></InputField>
      </div>
      <InputField label="วันที่และเวลาโพสต์อัปโหลดคลิปจริง"><input type="date" value={postedAt} onChange={e=>setPostedAt(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono focus:outline-none" /></InputField>
    </ModalWrapper>
  );
}

function EditClipModal({ clip, products, onClose, onSave, onDelete }) {
  const [hook, setHook] = useState(clip?.hook || ''); const [views7d, setViews7d] = useState(clip?.views7d || '');
  const [gmv, setGmv] = useState(clip?.gmv || '');

  return (
    <ModalWrapper title="✏️ แก้ไขแก้ไขผลลัพธ์และตัวเลขคลิป" onClose={onClose} footer={<div className="flex gap-2"><button onClick={onDelete} className="bg-slate-100 text-rose-600 font-bold px-3 py-3 rounded-xl hover:bg-rose-50 transition text-xs">🗑️ ลบชิ้นนี้</button><button onClick={() => onSave({ hook, views7d: Number(views7d), gmv: Number(gmv) })} className="flex-1 bg-emerald-950 text-white font-bold py-3 rounded-xl text-xs hover:bg-emerald-900 transition shadow-sm">บันทึกข้อมูลใหม่</button></div>}>
      <InputField label="คำพูดสคริปต์ Hook ล่าสุด"><input value={hook} onChange={e=>setHook(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none" /></InputField>
      <InputField label="ยอดวิวสะสมรอบ 7 วันสุดท้าย"><input type="number" value={views7d} onChange={e=>setViews7d(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono focus:outline-none" /></InputField>
      <InputField label="ยอดขายรวม GMV คลิป ณ ปัจจุบัน ฿"><input type="number" value={gmv} onChange={e=>setGmv(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl font-mono focus:outline-none" /></InputField>
    </ModalWrapper>
  );
}

function MakeSimilarModal({ clip, products, onClose }) { return null; }
function BackupModal({ products, clips, onClose, showToast }) { return null; }

function SettingsModal({ onClose, onExport, onClearAll, migrationLog, onMigrate }) {
  const [rawJsonInput, setRawJsonInput] = useState('');
  return (
    <ModalWrapper title="⚙️ แผงตั้งค่าวิศวกรรมระบบบำรุงรักษา" onClose={onClose}>
      <button onClick={onExport} className="w-full p-4 bg-white border border-slate-200 rounded-xl text-left hover:bg-slate-50 transition-colors shadow-sm"><div className="font-semibold text-sm text-slate-800">💾 สร้างจุด Backup สำรองข้อมูลดิบ</div><p className="text-[11px] text-slate-400 mt-0.5">ดาวน์โหลดไฟล์เก็บเป็นข้อมูล Snapshot ส่วนตัว</p></button>
      
      {/* MIGRATION MACHINE AREA (กล่องจุดแปลงสิทธิ์อัพเกรดระบบเพื่อหนีพ้น 1MB) */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-3">
        <h4 className="font-display text-xs text-amber-950 flex items-center gap-1">🔄 เครื่องมือย้ายรากฐานข้อมูลระบบเก่า (v1 -> v2 คลาวด์แยกแฟ้ม)</h4>
        <p className="text-[11px] text-amber-800 leading-normal">นำข้อความรหัสไฟล์ JSON ทั้งหมดที่คุณกดดึงดาวน์โหลดมาจากแอปตัวเก่า มาเปิดก๊อปปี้เทวางลงช่องกล่องด้านล่างนี้ ระบบตัวใหม่จะทำการสับแยกยิงเก็บเข้าพอร์ต Subcollection ให้ทันที ข้อมูลพอร์ตเดิมไม่สูญหายแน่นอนครับ</p>
        <textarea value={rawJsonInput} onChange={e=>setRawJsonInput(e.target.value)} placeholder="เทวางข้อความโค้ด JSON จากไฟล์สำรองที่นี่..." rows={3} className="w-full p-2 bg-white border border-slate-200 rounded-xl text-[10px] font-mono focus:outline-none resize-none" />
        <button type="button" onClick={() => { if(rawJsonInput.trim()) onMigrate(rawJsonInput.trim()); }} className="w-full bg-emerald-950 hover:bg-emerald-900 text-white font-bold py-2 rounded-xl text-[11px] transition-all shadow-sm">⚡ เริ่มกระบวนการตรวจสอบและย้ายข้อมูลเข้าพอร์ตใหม่ใน 1 คลิก</button>
        {migrationLog && <div className="p-2 bg-white border border-amber-200 text-amber-900 font-mono text-[10px] rounded-lg mt-2 whitespace-pre-wrap leading-normal">{migrationLog}</div>}
      </div>

      <div className="border-t border-slate-200/60 pt-4 mt-2"><button onClick={onClearAll} className="w-full p-3 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-left font-bold text-xs">🗑️ ล้างทำลายล้างสระพอร์ตข้อมูลคลาวด์ทั้งหมดถาวร</button></div>
    </ModalWrapper>
  );
}
