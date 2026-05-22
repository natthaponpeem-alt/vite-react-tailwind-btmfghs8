import React, { useState, useEffect, useMemo } from 'react';
import { 
  Home, Package, Lock, BarChart3, Settings, Plus, X, Copy, Download, 
  Upload, Trash2, Edit3, ChevronRight, ChevronLeft, AlertCircle, 
  CheckCircle2, Clock, Zap, Target, Wand2, FileText, Sparkles, 
  Trophy, Search, RefreshCw, DollarSign, Activity, LayoutGrid, 
  List, ArrowUpDown, ExternalLink, Database, Flame, TrendingUp, 
  TrendingDown, AlertTriangle, Lightbulb, Repeat, Cloud, CloudOff, 
  User, Bell, CalendarDays, LogOut
} from 'lucide-react';

// ============================================================================
// [ZONE 1] FIREBASE CONFIGURATION & CONSTANTS
// ============================================================================
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
import { getFirestore, doc, setDoc, updateDoc, deleteDoc, collection, onSnapshot } from 'firebase/firestore';

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
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app);
const APP_ID = 'peem6pack-command-v1';

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
  A: { label: 'A — ขายดี', short: 'A', desc: 'สินค้าขายดี', bg: 'bg-[#0f5144]', text: 'text-[#0f5144]', border: 'border-[#0f5144]/10', lightBg: 'bg-emerald-50/50' },
  B: { label: 'B — มาใหม่', short: 'B', desc: 'สินค้าแนะนำ/กำลังมาแรง', bg: 'bg-[#2563eb]', text: 'text-[#2563eb]', border: 'border-blue-100', lightBg: 'bg-blue-50/50' },
  C: { label: 'C — ประหยัด', short: 'C', desc: 'สินค้าราคาจับต้องง่าย', bg: 'bg-[#d97706]', text: 'text-[#d97706]', border: 'border-amber-100', lightBg: 'bg-amber-50/50' },
  D: { label: 'D — คอมสูง', short: 'D', desc: 'สินค้าไฮเอนด์ค่าคอมหนา', bg: 'bg-[#7c3aed]', text: 'text-[#7c3aed]', border: 'border-purple-100', lightBg: 'bg-purple-50/50' },
  V: { label: 'V — Content', short: 'V', desc: 'คลิปให้คุณค่า/ความรู้', bg: 'bg-slate-500', text: 'text-slate-500', border: 'border-slate-100', lightBg: 'bg-slate-50/50' },
};

const DECISION_INFO = { PICK: { label: 'PICK', bg: 'bg-[#e2f7e4]', text: 'text-[#1d7c2a]' }, WAIT: { label: 'WAIT', bg: 'bg-[#fef3c7]', text: 'text-[#d97706]' }, DROP: { label: 'DROP', bg: 'bg-[#fee2e2]', text: 'text-[#dc2626]' } };
const PRODUCT_TYPES = [{ id: 'supplement', label: 'อาหารเสริม', emoji: '💊' }, { id: 'shoes', label: 'รองเท้ากีฬา', emoji: '👟' }, { id: 'equipment', label: 'อุปกรณ์ฟิตเนส', emoji: '🏋️' }, { id: 'apparel', label: 'ชุดออกกำลังกาย', emoji: '👕' }, { id: 'other', label: 'อื่นๆ', emoji: '📦' }];
const SPLITTER_OPTIONS = { persona: ['คนอ้วน', 'ผู้หญิง', 'มือใหม่', 'พนักงานออฟฟิศ', 'คนแก่/วัยกลางคน', 'คนเดินเยอะ', 'นักวิ่ง', 'คนลดน้ำหนัก', 'คนเล่นเวท'], situation: ['เดินห้าง', 'วิ่งลู่', 'เดินงาน', 'เที่ยว', 'คาร์ดิโอ', 'เข้ายิม', 'เดินสวน', 'ทำงานออฟฟิศ', 'ก่อนนอน', 'หลังตื่นนอน'], emotion: ['กลัวเจ็บ', 'ขี้เกียจเพราะเจ็บ', 'อยากเริ่มใหม่', 'อยากผอม', 'เหนื่อยจากงาน', 'อยากดูดี', 'อยากแข็งแรง', 'หมดหวังกับร่างกาย'], format: ['POV', 'Story', 'Talking Head', 'Review', 'Compare', 'Voice Over', 'How-to', 'Listicle', 'Before/After'] };
const PAIN_SOURCES = [{ id: 'shopee', label: '💬 Shopee/Lazada' }, { id: 'tiktok', label: '🔍 TikTok "แต่..."' }, { id: 'pantip', label: '💭 Pantip/Groups' }, { id: 'ai', label: '🤖 AI Persona Simulation' }, { id: 'personal', label: '👤 ประสบการณ์ตรง' }];
const CLIP_LEVELS = [{ id: 'traffic', label: 'Traffic', color: 'bg-sky-500' }, { id: 'consideration', label: 'Consideration', color: 'bg-[#7c3aed]' }, { id: 'conversion', label: 'Conversion', color: 'bg-[#f43f5e]' }];

// ============================================================================
// [ZONE 2] CORE CALCULATIONS & DATA FORMATTERS
// ============================================================================
const uid = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
const todayStr = () => new Date().toISOString().slice(0, 10);
const currentMonth = () => new Date().toISOString().slice(0, 7);
const daysSince = (iso) => !iso ? 999 : Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
const fmtDate = (iso) => { if (!iso) return '-'; const d = new Date(iso); return `${d.getDate()}/${d.getMonth() + 1}/${(d.getFullYear() + 543).toString().slice(2)}`; };
const fmtNum = (n) => (n ?? 0).toLocaleString('th-TH');
const truncate = (s, n) => !s ? '' : s.length > n ? s.slice(0, n) + '…' : s;
const hoursSince = (iso) => !iso ? 999 : (Date.now() - new Date(iso).getTime()) / 3600000;

const getAbcdInfo = (cat) => ABCD_INFO[cat] || ABCD_INFO['V'] || { label: 'V — Content', short: 'V', desc: 'คลิปให้คุณค่า/ความรู้', bg: 'bg-slate-500', text: 'text-slate-500', border: 'border-slate-100', lightBg: 'bg-slate-50/50' };
const getDecisionInfo = (dec) => DECISION_INFO[dec] || { label: 'WAIT', bg: 'bg-[#fef3c7]', text: 'text-[#d97706]' };
const getProductTypeInfo = (typeId) => PRODUCT_TYPES.find(t => t.id === typeId) || { id: 'other', label: 'อื่นๆ', emoji: '📦' };

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

// ✅ บังคับฐานคะแนนเต็มที่ 18 เสมอ ไม่ว่าช่องจะกรอกครบหรือไม่
function calcScore(sc = {}) { 
  let total = 0, max = 18; 
  const cv = (v) => v === '' || v === null || v === undefined ? null : Number(v); 
  const commission = cv(sc.commission); 
  if (commission !== null && !isNaN(commission)) { total += commission >= 20 ? 3 : commission >= 15 ? 2 : commission >= 10 ? 1 : 0; } 
  const g7 = cv(sc.gmv7dPct), g30 = cv(sc.gmv30dPct); 
  if (g7 !== null && g30 !== null && !isNaN(g7) && !isNaN(g30)) { if (g7 > 0 && g30 > 0) total += 3; else if (g7 < 0 && g30 < 0) total += 1; else total += 2; } 
  else if (g7 !== null && !isNaN(g7)) { total += g7 > 0 ? 2 : 1; } 
  else if (g30 !== null && !isNaN(g30)) { total += g30 > 0 ? 2 : 1; } 
  const creators = cv(sc.creatorCount); 
  if (creators !== null && !isNaN(creators)) { total += creators <= 500 ? 3 : creators <= 1000 ? 2 : 1; } 
  const angles = cv(sc.anglesCount); 
  if (angles !== null && !isNaN(angles)) { total += angles >= 3 ? 3 : angles >= 2 ? 2 : 1; } 
  const cr = cv(sc.crPct); 
  if (cr !== null && !isNaN(cr)) { total += cr >= 20 ? 3 : cr >= 10 ? 2 : 1; } 
  const conc = cv(sc.concentration); 
  if (conc !== null && !isNaN(conc)) { total += conc < 30 ? 3 : conc <= 60 ? 2 : 1; } 
  return { total, max, pct: Math.round((total / max) * 100) }; 
}

function getDecision(pct) { return pct >= PICK_THRESHOLD ? 'PICK' : pct >= WAIT_THRESHOLD ? 'WAIT' : 'DROP'; }

function autoClassify({ gmv30d, commission, tiktokRank, price }) { 
  const g = Number(gmv30d) || 0; const c = Number(commission) || 0; const rank = Number(tiktokRank) || 0; const pr = Number(price) || 0; 
  if (g >= 30000) { if (c >= 15) return { cat: 'A', label: 'A — ideal', reason: 'Mass + คอมดี = A ideal', confidence: 'high' }; return { cat: 'A', label: 'A (proven exception)', reason: 'Mass = ฐานรายได้แม้คอมต่ำ', confidence: 'high' }; } 
  if (g >= 10000) { if (pr > 0 && pr < 500 && c < 20) return { cat: 'C', label: 'C (low-price + mass)', reason: `ราคา ฿${pr} + GMV ฿${fmtNum(g)} = mass low-ticket → C traffic driver`, confidence: 'medium' }; if (c >= 20) return { cat: 'B', label: 'B → A potential', reason: 'กำลังพิสูจน์ตัว ใกล้ E', confidence: 'medium' }; return { cat: 'B', label: 'B', reason: 'Volume ปานกลาง — เทสต่อ', confidence: 'medium' }; } 
  if (g >= 1000) { if (pr >= 800 && c >= 20) return { cat: 'D', label: 'D (premium)', reason: `ราคา ฿${pr} + คอม ${c}% — กินกำไรเป็นรอบ ห้าม auto-promote A`, confidence: 'medium' }; if (pr > 0 && pr < 500) return { cat: 'C', label: 'C (low-price, low-vol)', reason: `ราคา ฿${pr} — traffic driver / repeat buy`, confidence: 'low' }; if (c >= 20) return { cat: 'D', label: 'D', reason: 'คอมสูงแต่ volume ไม่ถึง mass — D ตามนิยาม', confidence: 'medium' }; if (c >= 10) return { cat: 'C', label: 'C', reason: 'Volume น้อย คอมปานกลาง — ดู price/repeat-buy', confidence: 'low' }; return { cat: 'C', label: 'C / Cut', reason: 'Volume + คอมต่ำ — พิจารณาตัด', confidence: 'low' }; } 
  if (rank >= 1 && rank <= 5) return { cat: 'B', label: 'B (Top 1-5 untested)', reason: 'Mass ใน TikTok แต่ยังไม่เทสในช่อง', confidence: 'medium' }; 
  if (rank >= 6 && rank <= 20) return { cat: 'B', label: 'B (Top 10-20)', reason: 'Demand ปานกลาง — testing zone', confidence: 'medium' }; 
  if (rank > 20) return { cat: 'B', label: 'B (weak signal)', reason: 'อันดับต่ำ — เทสด่วน หรือ skip', confidence: 'low' }; 
  return { cat: 'B', label: 'B (ใหม่)', reason: 'ยังไม่มี data — เริ่มเทส', confidence: 'low' }; 
}

function getPortfolioBalance(products, clips, timeframe = 30) { const byCat = { A: 0, B: 0, C: 0, D: 0 }; let total = 0; if (!Array.isArray(products)) return null; products.forEach(p => { if (!['A', 'B', 'C', 'D'].includes(p.category)) return; const sales = getProductSales(p, clips, timeframe); byCat[p.category] += sales.primary; total += sales.primary; }); if (total === 0) return null; return Object.fromEntries(Object.entries(byCat).map(([k, v]) => { const actual = Math.round((v / total) * 100); const target = PORTFOLIO_TARGET[k]; const diff = actual - target; return [k, { actual, target, diff, gmv: v, status: Math.abs(diff) <= 5 ? 'ok' : diff > 0 ? 'over' : 'under' }]; })); }
function getBlendedCommission(products, clips, timeframe = 30) { let weightedSum = 0, totalGMV = 0; const breakdown = []; if (!Array.isArray(products)) return null; products.forEach(p => { const sales = getProductSales(p, clips, timeframe); const c = Number(p.scorecard?.commission) || 0; if (sales.primary > 0 && c > 0) { weightedSum += sales.primary * c; totalGMV += sales.primary; breakdown.push({ product: p, gmv: sales.primary, commission: c, contribution: sales.primary * c }); } }); if (totalGMV === 0) return null; return { blended: Math.round((weightedSum / totalGMV) * 100) / 100, target: BLENDED_COMMISSION_TARGET, totalGMV, breakdown }; }
function getCategoryStack(products, clips, category) { if (!Array.isArray(products)) return []; const catProducts = products.filter(p => p.category === category); const withData = catProducts.map(p => { const sales30d = getProductSales(p, clips, 30).primary; const sales7d = getProductSales(p, clips, 7).primary; const momentum = (sales30d / 30) > 0 ? (sales7d / 7) / (sales30d / 30) : 1; const clipsThisMonth = clips.filter(c => c.productId === p.id && c.postedAt?.slice(0, 7) === currentMonth()).length; return { product: p, sales30d, sales7d, momentum, clipsThisMonth }; }).sort((a, b) => b.sales30d - a.sales30d); return withData.map((s, i) => { let tier, frequency, targetMonth; if (i < 2) { tier = 'HOT'; frequency = '3-4 คลิป/wk'; targetMonth = 14; } else if (i < 4) { tier = 'STEADY'; frequency = '1-2 คลิป/wk'; targetMonth = 6; } else { tier = 'PASSIVE'; frequency = '2-3 คลิป/เดือน'; targetMonth = 2.5; } const atRisk = s.momentum > 0 && s.momentum < 0.8; return { ...s, rank: i + 1, tier, frequency, targetMonth, atRisk }; }); }
function getECandidates(products, clips, timeframe = 30) { if (!Array.isArray(products)) return []; return products.map(p => { if (p.category === 'A') return null; if (daysSince(p.createdAt) < 14) return null; const sales30d = getProductSales(p, clips, timeframe).primary; const winnerCount = clips.filter(c => c.productId === p.id && (Number(c.gmv) || 0) >= WINNER_GMV).length; const rank = Number(p.tiktokRank) || 0; const commission = Number(p.scorecard?.commission || 0); let eScore = 0; const reasons = []; if (sales30d >= 30000) { eScore += 2; reasons.push(`GMV ฿${fmtNum(sales30d)} (mass)`); } else if (sales30d >= 10000) { eScore += 1; reasons.push(`GMV ฿${fmtNum(sales30d)}`); } if (winnerCount >= 2) { eScore += 2; reasons.push(`${winnerCount} winner clips`); } else if (winnerCount === 1) { eScore += 1; reasons.push('1 winner clip'); } if (rank > 0 && rank <= 10) { eScore += 1; reasons.push(`Top #${rank} ตลาด`); } if (commission >= 15) { eScore += 1; reasons.push(`คอม ${commission}% ดี`); } if (p.isShopAds) { eScore += 1; reasons.push('Shop Ads 🛒'); } if (eScore < 2) return null; let confidence, advice; if (eScore >= 5) { confidence = 'high'; advice = 'ย้ายเป็น A เพื่อขยี้คอนเทนต์'; } else if (eScore >= 3) { confidence = 'medium'; advice = 'พิจารณาย้าย / เทสต่อ 1-2 wk'; } else { confidence = 'low'; advice = 'มี signal เริ่มต้น — เทสต่อ'; } return { product: p, eScore, confidence, reasons, sales30d, winnerCount, advice }; }).filter(Boolean).sort((a, b) => b.eScore - a.eScore); }
function getROIAnalysis(products, clips, monthlyTargetGMV, timeframe = 30) { if (!Array.isArray(products)) return { items: [], totalCommRevenue: 0, gap: monthlyTargetGMV, pct: 0 }; const items = products.map(p => { const sales = getProductSales(p, clips, timeframe); const sales30d = sales.primary; const commission = Number(p.scorecard?.commission || 0); const price = Number(p.price) || 0; const commPerOrder = (price > 0 && commission > 0) ? (price * commission / 100) : 0; const currentCommRevenue = sales30d * commission / 100; const ordersNeededAlone = commPerOrder > 0 ? Math.ceil(monthlyTargetGMV / commPerOrder) : null; return { product: p, sales30d, commission, price, commPerOrder, currentCommRevenue, ordersNeededAlone }; }).filter(i => i.sales30d > 0 || i.commPerOrder > 0).sort((a, b) => b.currentCommRevenue - a.currentCommRevenue); const totalCommRevenue = items.reduce((s, i) => s + i.currentCommRevenue, 0); return { items, totalCommRevenue, gap: Math.max(0, monthlyTargetGMV - totalCommRevenue), pct: monthlyTargetGMV > 0 ? Math.round((totalCommRevenue / monthlyTargetGMV) * 100) : 0 }; }
function getProductsToCut(products, clips, timeframe = 30) { if (!Array.isArray(products)) return []; return products.map(p => { const reasons = []; const commission = Number(p.scorecard?.commission || 0); const sales = getProductSales(p, clips, timeframe); if (commission > 0 && commission <= 5 && sales.primary < 30000) reasons.push(`คอม ${commission}% ≤5%`); if (p.scorePct && p.maxScore >= 12 && p.scorePct < WAIT_THRESHOLD) reasons.push(`Argoon ${p.score}/${p.maxScore} = CUT`); const g7 = Number(p.scorecard?.gmv7dPct); const g30 = Number(p.scorecard?.gmv30dPct); if (!isNaN(g7) && !isNaN(g30) && g7 < -20 && g30 < -20) reasons.push(`GMV ตกหนัก ${g7}% / ${g30}%`); if (daysSince(p.createdAt) >= 14 && sales.primary === 0 && sales.clipCount === 0) reasons.push('ไม่มีกิจกรรม 30d'); if (reasons.length === 0) return null; return { product: p, reasons, severity: reasons.length }; }).filter(Boolean).sort((a, b) => b.severity - a.severity); }

function getProductSales(product, clips, timeframe) { 
  if (!product) return { fromClips: 0, fromManual: 0, hasManual: false, clipCount: 0, primary: 0 }; 
  let fromClips = 0, clipCount = 0, fromManual = 0; 
  if (typeof timeframe === 'string' && timeframe.includes('-')) { 
    const pclips = Array.isArray(clips) ? clips.filter(c => c.productId === product.id && c.postedAt?.slice(0, 7) === timeframe) : []; 
    fromClips = pclips.reduce((s, c) => s + (Number(c.gmv) || 0), 0); 
    clipCount = pclips.length; 
    fromManual = Number(product.salesData?.monthly?.[timeframe]) || 0; 
  } else { 
    const days = Number(timeframe) || 30; 
    const cutoff = Date.now() - days * 86400000; 
    const pclips = Array.isArray(clips) ? clips.filter(c => c.productId === product.id && new Date(c.postedAt).getTime() >= cutoff) : []; 
    fromClips = pclips.reduce((s, c) => s + (Number(c.gmv) || 0), 0); 
    clipCount = pclips.length; 
    fromManual = days <= 7 ? (Number(product.salesData?.last7d) || 0) : (Number(product.salesData?.last30d) || 0); 
  } 
  return { fromClips, fromManual, hasManual: fromManual > 0, clipCount, primary: Math.max(fromManual, fromClips) }; 
}

function getBestAngle(product, clips) { if (!product?.angles?.length || !Array.isArray(clips)) return null; const stats = product.angles.map(angle => { const aclips = clips.filter(c => c.angleId === angle.id); const totalGMV = aclips.reduce((s, c) => s + (Number(c.gmv) || 0), 0); return { angle, count: aclips.length, totalGMV, avg: aclips.length > 0 ? totalGMV / aclips.length : 0 }; }).filter(s => s.count >= 1).sort((a, b) => b.avg - a.avg); return stats[0] || null; }
function getWinners(clips, products) { if (!Array.isArray(clips)) return []; return clips.filter(c => (Number(c.gmv) || 0) >= WINNER_GMV).map(c => ({ clip: c, product: Array.isArray(products) ? products.find(p => p.id === c.productId) : null, daysOld: daysSince(c.postedAt) })).sort((a, b) => (Number(b.clip.gmv) || 0) - (Number(a.clip.gmv) || 0)); }
function getRepostCandidates(clips, products) { return getWinners(clips, products).map(w => { const rs = w.clip.repostStatus || {}; let bucket = null; if (w.daysOld >= 30 && !rs.d30) bucket = 30; else if (w.daysOld >= 14 && !rs.d14) bucket = 14; else if (w.daysOld >= 7 && !rs.d7) bucket = 7; return bucket ? { ...w, repostBucket: bucket } : null; }).filter(Boolean).sort((a, b) => b.repostBucket - a.repostBucket); }
function getConcentration(clips, products, timeframe = 30) { const byProduct = {}; if (!Array.isArray(products)) return null; products.forEach(p => { const s = getProductSales(p, clips, timeframe); if (s.primary > 0) byProduct[p.id] = s.primary; }); const totalGMV = Object.values(byProduct).reduce((s, v) => s + v, 0); if (totalGMV === 0) return null; const sorted = Object.entries(byProduct).sort((a, b) => b[1] - a[1]); if (!sorted || sorted.length === 0) return null; return { pct: Math.round((sorted[0][1] / totalGMV) * 100), product: products.find(p => p.id === sorted[0][0]), totalGMV }; }

function getMonthlyGMV(products, clips, ymKey) {
  let manualTotal = 0;
  if (Array.isArray(products)) products.forEach(p => { manualTotal += (Number(p.salesData?.monthly?.[ymKey]) || 0); });
  const mclips = Array.isArray(clips) ? clips.filter(c => c.postedAt?.startsWith(ymKey)) : [];
  const vClipGmv = mclips.filter(c => c.isV).reduce((s, c) => s + (Number(c.gmv) || 0), 0);
  const clipGmv = mclips.reduce((s, c) => s + (Number(c.gmv) || 0), 0);
  return manualTotal > 0 ? manualTotal + vClipGmv : clipGmv;
}

function getAllTimeProductGMV(p, clips) { 
  let total = 0; 
  const ledger = p.salesData?.monthly || {}; 
  const clipMonthly = {}; 
  if (Array.isArray(clips)) { 
    clips.filter(c => c.productId === p.id).forEach(c => { 
      const ym = c.postedAt?.slice(0, 7); 
      if (ym) clipMonthly[ym] = (clipMonthly[ym] || 0) + (Number(c.gmv) || 0); 
    }); 
  } 
  const allMonths = new Set([...Object.keys(ledger), ...Object.keys(clipMonthly)]); 
  allMonths.forEach(ym => { 
    const mVal = Number(ledger[ym]) || 0; 
    const cVal = Number(clipMonthly[ym]) || 0; 
    total += Math.max(mVal, cVal); 
  }); 
  const active30d = Number(p.salesData?.last30d) || 0; 
  return Math.max(total, active30d); 
}

function migrateProduct(p) { if (!p) return p; const sc = p.scorecard || {}; if (sc.gmv7d !== undefined && sc.gmv7dPct === undefined) { const { gmv7d, gmv30d, ...rest } = sc; p.scorecard = rest; const s = calcScore(p.scorecard); p.score = s.total; p.maxScore = s.max; p.scorePct = s.pct; p.decision = getDecision(s.pct); } return p; }
function migrateClip(c) { if (!c) return c; if (c.views !== undefined && c.views7d === undefined) { c.views7d = c.views; delete c.views; } if (c.link !== undefined && c.videoLink === undefined) { c.videoLink = c.link; delete c.link; } return c; }

// ============================================================================
// [ZONE 2.5] SECURE LOGIN SCREEN
// ============================================================================
function LoginScreen({ onLogin, isLoading, errorMsg }) {
  return (
    <div className="min-h-screen bg-[#012b25] flex flex-col items-center justify-center p-6 relative overflow-hidden" style={{ fontFamily: "'Inter', 'Noto Sans Thai', sans-serif" }}>
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#d9eb54]/10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-[3rem] w-full max-w-md text-center shadow-2xl relative z-10">
        <div className="w-20 h-20 bg-[#d9eb54] text-[#012b25] rounded-3xl flex items-center justify-center font-extrabold text-4xl shadow-[0_0_40px_rgba(217,235,84,0.3)] mx-auto mb-6 transform -rotate-6">P6</div>
        <h1 className="font-bold text-3xl text-white mb-2 tracking-tight">Command Center</h1>
        <p className="text-emerald-100/60 text-sm mb-8">ระบบบริหารจัดการพอร์ต Affiliate ส่วนบุคคล</p>
        
        {errorMsg && (
          <div className="bg-rose-500/20 border border-rose-500/50 text-rose-200 text-xs px-4 py-3 rounded-xl mb-6 flex items-center gap-2 text-left">
            <AlertCircle className="w-4 h-4 flex-shrink-0" /> {errorMsg}
          </div>
        )}

        <button 
          onClick={onLogin} 
          disabled={isLoading}
          className="w-full bg-white hover:bg-slate-50 text-slate-800 font-bold py-4 rounded-2xl shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-70 group"
        >
          {isLoading ? (
            <RefreshCw className="w-5 h-5 animate-spin text-slate-400" />
          ) : (
            <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          )}
          {isLoading ? 'กำลังเชื่อมต่อ...' : 'เข้าสู่ระบบด้วย Google'}
        </button>
        <div className="mt-8 flex items-center justify-center gap-2 text-[10px] text-emerald-100/40"><Lock className="w-3 h-3" /><span>Secured by Firebase Auth</span></div>
      </div>
    </div>
  );
}

// ============================================================================
// [ZONE 3] MAIN APPLICATION & CLOUD LIFECYCLE
// ============================================================================
export default function App() {
  const [user, setUser] = useState(null);
  const [authChecking, setAuthChecking] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState(null);
  
  const [dbInitialized, setDbInitialized] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [page, setPage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState(null);
  
  const [products, setProducts] = useState([]);
  const [clips, setClips] = useState([]);
  const [appSettings, setAppSettings] = useState({ monthlyTarget: DEFAULT_MONTHLY_CLIP_TARGET, noticeBoard: '', monthlyRevenueTarget: 300000 });
  const [showImportSuccess, setShowImportSuccess] = useState(false);
  const [importStats, setImportStats] = useState({ products: 0, clips: 0 });
  
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
  
  const [showRadarModal, setShowRadarModal] = useState(false);

  const [confirmDeleteProdId, setConfirmDeleteProdId] = useState(null);
  const [confirmDeleteClipId, setConfirmDeleteClipId] = useState(null);
  const [confirmClearDb, setConfirmClearDb] = useState(false);
  const [makeSimilarClip, setMakeSimilarClip] = useState(null);
  const [showGateWarning, setShowGateWarning] = useState(null); 
  const [showBackup, setShowBackup] = useState(false);

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 2500); };

  // ✅ ฟังสถานะการ Login ของ Google
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthChecking(false);
      if (!currentUser) setDbInitialized(false);
    });
    return unsubscribe;
  }, []);

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    setLoginError(null);
    try {
      await signInWithPopup(auth, googleProvider);
      showToast("เข้าสู่ระบบสำเร็จ!", "success");
    } catch (error) {
      setLoginError(error.message);
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("คุณต้องการออกจากระบบและล็อกบัญชีใช่หรือไม่?")) {
      signOut(auth).then(() => {
        setProducts([]); setClips([]); setPage('home');
      });
    }
  };

  useEffect(() => {
    if (!user) return; // ถ้ายังไม่ล็อกอิน ให้รอไปก่อน
    setIsSyncing(true);

    const settingsRef = doc(db, 'artifacts', APP_ID, 'users', user.uid, 'appData', 'settings');
    const unsubSettings = onSnapshot(settingsRef, (snap) => {
      if (snap.exists()) {
        setAppSettings({
          monthlyTarget: snap.data().monthlyTarget || DEFAULT_MONTHLY_CLIP_TARGET,
          noticeBoard: snap.data().noticeBoard || '',
          monthlyRevenueTarget: snap.data().monthlyRevenueTarget || MONTHLY_REVENUE_TARGET
        });
      }
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

  const sanitizeForFirestore = (obj) => {
    if (obj === undefined) return null;
    if (obj === null) return null;
    if (Array.isArray(obj)) return obj.map(sanitizeForFirestore);
    if (typeof obj === 'object') {
      const cleaned = {};
      for (const [k, v] of Object.entries(obj)) {
        if (v !== undefined) cleaned[k] = sanitizeForFirestore(v);
      }
      return cleaned;
    }
    return obj;
  };

  const updateSettingsInCloud = async (patch) => {
    setAppSettings(prev => ({ ...prev, ...patch }));
    await setDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'appData', 'settings'), patch, { merge: true });
  };

  const updateProductInCloud = async (id, data) => {
    if (!user) return;
    await setDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'products', id), sanitizeForFirestore(data), { merge: true });
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
    const relatedClips = clips.filter(c => c.productId === id);
    for (const c of relatedClips) {
      await deleteDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'clips', c.id));
    }
    setPage('products'); 
    setConfirmDeleteProdId(null);
    showToast(`ลบสินค้าและคลิป (${relatedClips.length}) ถาวรเรียบร้อย`);
  };

  const executeDeleteClip = async (id) => {
    await deleteDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'clips', id));
    setConfirmDeleteClipId(null);
    showToast('ลบคลิปถาวรแล้ว');
  };

  const executeClearDatabase = async () => {
    for (const p of products) await deleteDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'products', p.id));
    for (const c of clips) await deleteDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'clips', c.id));
    setConfirmClearDb(false);
    setShowSettings(false); 
    showToast('เคลียร์คลาวด์หมดจดแล้ว');
  };

  const addClip = async (data) => {
    if (!user) return; const id = uid();
    await setDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'clips', id), sanitizeForFirestore({ id, ...data, postedAt: data.postedAt || new Date().toISOString(), createdAt: new Date().toISOString() }));
    showToast('บันทึกคลิปลงคลังสำเร็จ!');
  };

  const updateClip = async (id, patch) => {
    if (!user) return;
    await updateDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'clips', id), sanitizeForFirestore(patch));
    showToast('อัพเดทคลิปแล้ว!');
  };

  const markRepostDone = async (clipId, bucket) => {
    const clip = clips.find(c => c.id === clipId); if (!clip) return;
    const rs = { ...(clip.repostStatus || {}) }; const key = `d${bucket}`;
    rs[key] = rs[key] ? null : new Date().toISOString();
    await updateClip(clipId, { repostStatus: rs });
  };

  const importData = (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.products && data.clips) {
           showToast('กำลังซิงค์ไฟล์ข้อมูลขึ้น Cloud...', 'success');
           const newP = data.products.map(migrateProduct);
           const newC = data.clips.map(migrateClip);
           for (const p of newP) await setDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'products', p.id), sanitizeForFirestore(p));
           for (const c of newC) await setDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'clips', c.id), sanitizeForFirestore(c));
           
           setImportStats({ products: newP.length, clips: newC.length });
           setShowImportSuccess(true);
           if (showSettings) setShowSettings(false); 
        }
      } catch { showToast('ไฟล์ JSON ผิดพลาด', 'error'); }
    };
    reader.readAsText(file);
    e.target.value = null; 
  };

  const selectedProduct = selectedProductId ? products.find(p => p.id === selectedProductId) : null;
  const lockedProducts = useMemo(() => products.filter(p => p.locked && p.locked.month === currentMonth()), [products]);
  
  // ✅ ตรวจจับสินค้าขาดการประเมิน (Stale)
  const productsNeedingRescore = useMemo(() => products.filter(p => !p.lastScoredAt || daysSince(p.lastScoredAt) >= RESCORE_DAYS), [products]);
  
  const last7DaysClips = useMemo(() => {
    const cutoff = Date.now() - 7 * 86400000;
    return clips.filter(c => new Date(c.postedAt).getTime() >= cutoff).sort((a, b) => new Date(a.postedAt) - new Date(b.postedAt));
  }, [clips]);

  // ✅ ประตูป้องกันหน้าแรก ถ้ายังไม่ล็อกอินให้หยุด
  if (authChecking) {
    return <div className="min-h-screen bg-[#012b25] flex flex-col items-center justify-center space-y-4"><div className="w-14 h-14 border-4 border-[#034c40] border-t-[#d9eb54] rounded-full animate-spin"></div><div className="font-mono text-emerald-500 tracking-wider text-xs animate-pulse">CHECKING SECURE ACCESS...</div></div>;
  }
  if (!user) {
    return <LoginScreen onLogin={handleGoogleLogin} isLoading={isLoggingIn} errorMsg={loginError} />;
  }
  if (!dbInitialized) {
    return <div className="min-h-screen bg-[#012b25] flex flex-col items-center justify-center space-y-4"><div className="w-14 h-14 border-4 border-[#034c40] border-t-[#d9eb54] rounded-full animate-spin"></div><div className="font-mono text-emerald-500 tracking-wider text-xs animate-pulse">SYNCING CLOUD DATABASE...</div></div>;
  }

  return (
    <div className="min-h-screen bg-[#f3f6f5] text-[#0d2a23] flex flex-col lg:flex-row" style={{ fontFamily: "'Inter', 'Noto Sans Thai', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Noto+Sans+Thai:wght@400;500;600;700&display=swap');
        .font-display { font-family: 'Inter', 'Noto Sans Thai', sans-serif; font-weight: 700; }
        .striped-bar { background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent); background-size: 1rem 1rem; }
      `}</style>

      {/* SIDEBAR */}
      <aside className="w-full lg:w-72 bg-[#012b25] text-white flex flex-col justify-between flex-shrink-0 shadow-2xl relative z-20">
        <div>
          <div className="p-7 flex items-center justify-between border-b border-[#053d34]">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-[#d9eb54] text-[#012b25] rounded-xl flex items-center justify-center font-extrabold text-xl shadow-lg">P6</div>
              <div><h2 className="font-display text-lg leading-none tracking-tight">Pharmly</h2><span className="text-[11px] text-emerald-400/80 font-medium tracking-wide">Affiliate Platform</span></div>
            </div>
            {isSyncing ? <CloudOff className="w-4 h-4 text-amber-400 animate-pulse" /> : <Cloud className="w-4 h-4 text-emerald-400" />}
          </div>
          <nav className="p-5 space-y-1.5">
            {[
              { id: 'home', label: 'Overview', icon: Home },
              { id: 'products', label: 'Products', icon: Package },
              { id: 'lock', label: 'Lock Focus', icon: Lock },
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'log', label: 'Clip Logs', icon: Database }
            ].map(item => {
              const Icon = item.icon; const active = page === item.id;
              return (
                <button key={item.id} onClick={() => setPage(item.id)} className={`w-full flex items-center gap-3.5 px-5 py-4 rounded-2xl text-sm font-medium transition-all duration-350 relative ${active ? 'bg-[#d9eb54] text-[#012b25] font-bold shadow-md shadow-emerald-950/30' : 'text-emerald-100/70 hover:bg-[#043c34]/50 hover:text-white'}`}>
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
            <p className="text-[10px] text-emerald-300/70 mt-1 leading-relaxed">ปลดล็อค AI ปั่นสคริปต์ไม่จำกัด</p>
            <button className="w-full bg-[#d9eb54] text-[#012b25] text-xs font-bold py-2.5 rounded-xl transition-all shadow-md mt-4 hover:bg-[#eaf96c]">Upgrade Now</button>
          </div>
          <div className="flex gap-2 text-xs">
            <button onClick={() => { setClipForVOnly(true); setShowAddClip(true); }} className="flex-1 bg-[#d9eb54] hover:bg-[#eaf96c] text-[#012b25] font-bold py-3 rounded-2xl transition-all shadow-md flex items-center justify-center gap-1">+ บันทึกคลิป</button>
            <label className="p-3 bg-[#033c32] text-emerald-100 rounded-2xl hover:text-white hover:bg-[#044c40] transition-all cursor-pointer shadow-md flex items-center justify-center" title="อัปโหลดไฟล์แบคอัป JSON (Import)">
              <Upload className="w-4 h-4" />
              <input type="file" accept="application/json" onChange={importData} className="hidden" />
            </label>
            <button onClick={() => setShowSettings(true)} className="p-3 bg-[#033c32] text-emerald-100 rounded-2xl hover:text-white hover:bg-[#044c40] transition-all shadow-md" title="การตั้งค่าระบบ"><Settings className="w-4 h-4" /></button>
          </div>
        </div>
      </aside>

      {/* CONTENT */}
      <main className="flex-1 overflow-y-auto pb-24 lg:pb-10">
        <header className="bg-white border-b border-[#e9eceb] px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-10">
          <div>
            <div className="text-[11px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1"><span>PEEM6PACK</span><ChevronRight className="w-3 h-3 text-slate-300" /><span className="text-emerald-800">{page.toUpperCase()}</span></div>
            <h1 className="font-display text-2xl text-[#012b25] mt-1 leading-none">Command Center</h1>
          </div>
          <div className="flex items-center gap-4 self-end sm:self-auto">
            <div className="relative">
              <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2.5 bg-[#f3f6f5] border border-transparent rounded-full text-xs w-48 md:w-60 focus:outline-none focus:border-emerald-700 focus:bg-white transition-all shadow-inner" />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
            <button className="p-2.5 bg-[#f3f6f5] hover:bg-slate-200/60 rounded-full transition-all text-slate-600 relative"><Bell className="w-4 h-4" /><span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full border border-white" /></button>
            <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
              {user?.photoURL ? (
                <img src={user.photoURL} alt="Profile" className="w-9 h-9 rounded-full shadow-sm border border-slate-200 object-cover" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-emerald-950 text-[#d9eb54] flex items-center justify-center font-bold shadow-md uppercase">{user?.email ? user.email.charAt(0) : <User className="w-4 h-4" />}</div>
              )}
              <div className="text-left hidden md:block">
                <div className="text-xs font-bold text-[#012b25] truncate max-w-[120px]">{user?.displayName || 'Commander'}</div>
                <div className="text-[10px] text-slate-400 font-medium font-mono truncate max-w-[120px]">{user?.email || 'Logged In'}</div>
              </div>
              <button onClick={handleLogout} className="ml-1 p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all" title="ออกจากระบบ">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
      

        <div className="p-6 md:p-8 space-y-8">
          {page === 'home' && (<HomePage products={products} clips={clips} lockedProducts={lockedProducts} productsNeedingRescore={productsNeedingRescore} last7DaysClips={last7DaysClips} appSettings={appSettings} onGoTo={setPage} onSelectProduct={(id) => { setSelectedProductId(id); setPage('detail'); }} onEditClip={(id) => setEditClipId(id)} onMakeSimilar={(clip) => setMakeSimilarClip(clip)} onMarkRepostDone={markRepostDone} />)}
          {page === 'products' && (<ProductHubPage products={products} clips={clips} onAdd={() => setShowAddProduct(true)} onSelect={(id) => { setSelectedProductId(id); setPage('detail'); }} onOpenRadar={() => setShowRadarModal(true)} />)}
          {page === 'detail' && selectedProduct && (<ProductDetailPage product={selectedProduct} clips={clips.filter(c => c.productId === selectedProduct.id)} allClips={clips} onBack={() => setPage('products')} onTogglePillar={async (pid) => { const next = selectedProduct.pillars.includes(pid) ? selectedProduct.pillars.filter(x => x !== pid) : [...selectedProduct.pillars, pid]; await updateProductInCloud(selectedProduct.id, { pillars: next }); }} onSetCategory={async (cat) => await updateProductInCloud(selectedProduct.id, { category: cat })} onAddPain={() => setShowAddPain(true)} onRemovePain={async (painId) => await updateProductInCloud(selectedProduct.id, { pains: (selectedProduct.pains || []).filter(x => x.id !== painId) })} onAddAngle={() => setShowAddAngle(true)} onRemoveAngle={async (angleId) => await updateProductInCloud(selectedProduct.id, { angles: (selectedProduct.angles || []).filter(x => x.id !== angleId) })} onEditScore={(() => setEditScoreProductId(selectedProduct.id))} onEditInfo={(() => setEditProductInfoId(selectedProduct.id))} onLock={(() => setShowLockProduct(true))} onUnlock={async () => await updateProductInCloud(selectedProduct.id, { locked: null })} onDelete={(() => setConfirmDeleteProdId(selectedProduct.id))} onAddClip={(() => { setClipForVOnly(false); setShowAddClip(true); })} onEditClip={(id) => setEditClipId(id)} />)}
          {page === 'lock' && (<LockListPage lockedProducts={lockedProducts} products={products} clips={clips} onSelectProduct={(id) => { setSelectedProductId(id); setPage('detail'); }} onUnlock={async (id) => await updateProductInCloud(id, { locked: null })} onLockNew={() => setPage('products')} />)}
          {page === 'analytics' && (<DashboardView products={products} clips={clips} appSettings={appSettings} onUpdateSettings={updateSettingsInCloud} onMakeSimilar={(clip) => setMakeSimilarClip(clip)} onEditClip={(id) => setEditClipId(id)} onMarkRepostDone={markRepostDone} onPromoteToA={async (id) => await updateProductInCloud(id, { category: 'A' })} />)}
          {page === 'log' && (<ClipLogPage products={products} clips={clips} onEditClip={(id) => setEditClipId(id)} />)}
        </div>
      </main>

      {/* MODALS */}
      {showAddProduct && <AddProductModal onClose={() => setShowAddProduct(false)} onSave={addProduct} showGateWarning={(data) => setShowGateWarning(data)} showToast={showToast} />}
      {editScoreProductId && <EditScoreModal product={products.find(p => p.id === editScoreProductId)} onClose={() => setEditScoreProductId(null)} onSave={async (sc) => { await updateProductScore(editScoreProductId, sc); setEditScoreProductId(null); }} />}
      {editProductInfoId && <EditProductInfoModal product={products.find(p => p.id === editProductInfoId)} onClose={() => setEditProductInfoId(null)} onSave={async (patch) => { await updateProductInCloud(editProductInfoId, patch); setEditProductInfoId(null); showToast('อัปเดตสเปกสินค้าแล้ว'); }} />}
      {showAddPain && selectedProduct && <AddPainModal onClose={() => setShowAddPain(false)} onSave={async (text, source) => { await updateProductInCloud(selectedProduct.id, { pains: [...(selectedProduct.pains || []), { id: uid(), text, source, createdAt: new Date().toISOString() }] }); setShowAddPain(false); showToast('เพิ่ม Pain Point สำเร็จ'); }} />}
      {showAddAngle && selectedProduct && <AddAngleModal onClose={() => setShowAddAngle(false)} onSave={async (text) => { await updateProductInCloud(selectedProduct.id, { angles: [...(selectedProduct.angles || []), { id: uid(), text, createdAt: new Date().toISOString() }] }); setShowAddAngle(false); showToast('เพิ่ม Angle สำเร็จ'); }} />}
      {showLockProduct && selectedProduct && <LockProductModal product={selectedProduct} onClose={() => setShowLockProduct(false)} onSave={async (target, angles) => { await updateProductInCloud(selectedProduct.id, { locked: { month: currentMonth(), targetClips: target, anglesToTest: angles, lockedAt: new Date().toISOString() } }); setShowLockProduct(false); showToast('ตรึงเป้าหมาย Lock List สำเร็จ'); }} />}
      {showAddClip && <AddClipModal products={products} defaultProductId={!clipForVOnly && selectedProduct ? selectedProduct.id : null} onClose={() => setShowAddClip(false)} onSave={async (data) => { await addClip(data); setShowAddClip(false); }} showToast={showToast} />}
      {editClipId && <EditClipModal clip={clips.find(c => c.id === editClipId)} products={products} onClose={() => setEditClipId(null)} onSave={async (patch) => { await updateClip(editClipId, patch); setEditClipId(null); }} onDelete={() => setConfirmDeleteClipId(editClipId)} />}
      {makeSimilarClip && <MakeSimilarModal clip={makeSimilarClip} products={products} onClose={() => setMakeSimilarClip(null)} />}
      {showBackup && <BackupModal products={products} clips={clips} onClose={() => setShowBackup(false)} showToast={showToast} />}
      {showSettings && <SettingsModal appSettings={appSettings} onUpdateSettings={updateSettingsInCloud} onClose={() => setShowSettings(false)} onExport={() => { setShowSettings(false); setShowBackup(true); }} onClearAll={() => setConfirmClearDb(true)} />}

      {showRadarModal && <TikTokRadarModal products={products} onClose={() => setShowRadarModal(false)} onUpdateProduct={updateProductInCloud} onQuickAdd={async (data) => { const id = uid(); await updateProductInCloud(id, { ...data, id, createdAt: new Date().toISOString() }); showToast('ดึงสินค้าผีเข้าพอร์ตสำเร็จ!'); }} showToast={showToast} />}
      {/* OVERLAYS */}
      {confirmDeleteProdId && (
        <div className="fixed inset-0 bg-[#012b25]/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full text-center space-y-4 border border-slate-100 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto"><Trash2 className="w-8 h-8" /></div>
            <h3 className="font-display text-xl text-[#012b25]">ลบสินค้าและคลิปถาวร?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">คุณกำลังจะลบสินค้านี้ พร้อมกับคลิปประวัติการขายที่ผูกไว้อีก {clips.filter(c => c.productId === confirmDeleteProdId).length} คลิป ข้อมูลนี้จะไม่สามารถกู้คืนได้</p>
            <div className="flex gap-3 pt-4">
              <button onClick={() => setConfirmDeleteProdId(null)} className="flex-1 bg-slate-100 text-slate-700 py-3.5 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all">ยกเลิก</button>
              <button onClick={() => executeDeleteProduct(confirmDeleteProdId)} className="flex-1 bg-rose-600 text-white py-3.5 rounded-xl font-bold text-sm shadow-md hover:bg-rose-700 transition-all">ยืนยันลบทิ้ง</button>
            </div>
          </div>
        </div>
      )}

      {confirmDeleteClipId && (
        <div className="fixed inset-0 bg-[#012b25]/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full text-center space-y-4 border border-slate-100 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto"><Trash2 className="w-8 h-8" /></div>
            <h3 className="font-display text-xl text-[#012b25]">ยืนยันการลบคลิปถาวร?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">ข้อมูลยอดวิว ผลลัพธ์รายได้ และประวัติของคลิปชิ้นนี้จะถูกล้างทิ้งทั้งหมด</p>
            <div className="flex gap-3 pt-4">
              <button onClick={() => setConfirmDeleteClipId(null)} className="flex-1 bg-slate-100 text-slate-700 py-3.5 rounded-xl font-bold text-sm transition-all hover:bg-slate-200">ยกเลิก</button>
              <button onClick={() => { executeDeleteClip(confirmDeleteClipId); setEditClipId(null); }} className="flex-1 bg-rose-600 text-white py-3.5 rounded-xl font-bold text-sm shadow-md transition-all hover:bg-rose-700">ยืนยันลบ</button>
            </div>
          </div>
        </div>
      )}

      {showImportSuccess && (
        <div className="fixed inset-0 bg-[#012b25]/90 backdrop-blur-sm z-[80] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full text-center space-y-4 shadow-2xl border border-emerald-100">
            <div className="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2 border-4 border-emerald-100">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="font-display text-2xl text-[#012b25]">โหลดข้อมูลสำเร็จ!</h3>
            <p className="text-sm text-slate-500 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">กู้คืนสินค้า <strong className="text-emerald-700">{importStats.products}</strong> รายการ <br/>และคลิปประวัติ <strong className="text-emerald-700">{importStats.clips}</strong> คลิป <br/>เข้าสู่ระบบ Cloud สมบูรณ์แล้ว</p>
            <div className="pt-4">
              <button onClick={() => setShowImportSuccess(false)} className="w-full bg-[#012b25] text-[#d9eb54] hover:bg-[#033c32] py-4 rounded-2xl font-bold text-sm shadow-lg transition-all">รับทราบ พร้อมทำงาน!</button>
            </div>
          </div>
        </div>
      )}
      
      {confirmClearDb && (
        <div className="fixed inset-0 bg-rose-950/90 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto"><AlertTriangle className="w-8 h-8" /></div>
            <h3 className="font-display text-xl text-rose-700">ล้างฐานข้อมูลจริงทั้งหมด?</h3>
            <p className="text-xs text-slate-500 leading-relaxed">คำเตือนวิกฤต: การกระทำนี้จะล้างทำลายข้อมูลสินค้าและสคริปต์คลิปทั้งหมดบนเซิร์ฟเวอร์คลาวด์ของคุณอย่างถาวร! (อย่าลืมกด Backup ก่อน)</p>
            <div className="flex gap-3 pt-4">
              <button onClick={() => setConfirmClearDb(false)} className="flex-1 bg-slate-100 text-slate-700 py-3.5 rounded-xl font-bold text-sm hover:bg-slate-200">ยกเลิก</button>
              <button onClick={executeClearDatabase} className="flex-1 bg-rose-600 text-white py-3.5 rounded-xl font-bold text-sm shadow-md hover:bg-rose-700">ล้างทั้งหมด</button>
            </div>
          </div>
        </div>
      )}

      {showGateWarning && (
        <div className="fixed inset-0 bg-[#012b25]/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] p-8 max-w-md w-full text-center space-y-4 border border-slate-100 shadow-2xl">
            <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto"><AlertTriangle className="w-8 h-8" /></div>
            <h3 className="font-display text-xl text-[#012b25]">คำเตือน 2-Rules Gate</h3>
            <p className="text-xs text-slate-500 leading-relaxed">คุณยังไม่ได้ติ๊กสิทธิ์การใช้จริงภายนอก หรือ ขอบข่ายคอนเทนต์ (Scope) ให้ตรงเกณฑ์ช่องหลัก คุณยืนยันที่จะข้ามมาตรการนี้เพื่อบรรจุสินค้าลงคลังหรือไม่?</p>
            <div className="flex gap-3 pt-4">
              <button onClick={() => setShowGateWarning(null)} className="flex-1 bg-slate-100 text-slate-700 py-3.5 rounded-xl font-bold text-sm hover:bg-slate-200">ย้อนกลับแก้ไข</button>
              <button onClick={() => { addProduct(showGateWarning); setShowGateWarning(null); setShowAddProduct(false); }} className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-3.5 rounded-xl font-bold text-sm shadow-md">ข้ามและบันทึก</button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 z-[70] animate-fade-in-up">
          <div className={`px-6 py-4 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.2)] text-xs font-bold border flex items-center gap-3 ${toast.type === 'error' ? 'bg-rose-600 text-white border-rose-700' : 'bg-[#012b25] text-[#d9eb54] border-[#053d34]'}`}>
            {toast.type === 'error' ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
            {toast.msg}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// [ZONE 4] UI COMPONENTS & PAGES
// ============================================================================

function OverviewKPI({ icon: Icon, label, value, sub, isPrimary = false }) {
  return (
    <div className={`rounded-3xl p-6 shadow-sm flex flex-col justify-between min-h-[140px] transition-all duration-300 hover:scale-[1.01] ${isPrimary ? 'bg-[#012b25] text-white border border-[#033c32]' : 'bg-white text-[#0d2a23] border border-slate-200/60'}`}>
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

function CapsuleChart({ data }) {
  const maxValue = Math.max(...data.map(d => d.value), 100);
  return (
    <div className="flex justify-between items-end h-56 pt-6 px-2">
      {data.map((item, idx) => {
        const heightPct = Math.round((item.value / maxValue) * 100);
        const isHighlight = item.label === '07'; 
        return (
          <div key={idx} className="flex flex-col items-center flex-1 group relative">
            <div className={`absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-[#012b25] text-white text-[9px] font-mono font-bold px-2 py-1 rounded-md shadow-md z-10 ${isHighlight ? 'opacity-100 -top-8' : ''}`}>
              ฿{fmtNum(item.value)}
            </div>
            <div className="w-6 md:w-8 bg-[#f3f6f5] rounded-full h-40 flex items-end overflow-hidden border border-slate-100">
              <div className={`w-full rounded-full transition-all duration-700 ${isHighlight ? 'bg-[#0a4d40] striped-bar h-[85%]' : 'bg-[#0a4d40]'}`} style={{ height: `${heightPct}%` }} />
            </div>
            <span className="text-[10px] text-slate-400 font-mono font-bold mt-2">{item.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function VBar({ label, value, target, sub, suffix = "" }) {
  const pct = Math.min(100, Math.round((value / target) * 100));
  const isGood = value >= target;
  return (
    <div className="space-y-1 bg-slate-50 border border-slate-100 p-3.5 rounded-2xl">
      <div className="flex items-center justify-between text-[11px] font-bold text-slate-400 uppercase tracking-wider">
        <span>{label}</span>
        {isGood ? <CheckCircle2 className="w-3.5 h-3.5 text-[#1d7c2a]" /> : <Clock className="w-3.5 h-3.5 text-slate-400" />}
      </div>
      <div className="font-display text-xl text-[#012b25] mt-0.5">{sub}</div>
      <div className="w-full h-1.5 bg-slate-200/60 rounded-full overflow-hidden mt-1">
        <div className={`h-full ${isGood ? 'bg-[#1d7c2a]' : 'bg-[#bcd924]'} transition-all`} style={{ width: `${pct}%` }}></div>
      </div>
      <span className="text-[10px] text-slate-400 mt-1 block">เป้าหมาย: {target}{suffix}</span>
    </div>
  );
}

function HomePage({ products, clips, lockedProducts, productsNeedingRescore, last7DaysClips, appSettings, onGoTo, onSelectProduct, onEditClip, onMakeSimilar, onMarkRepostDone }) {
  const today = todayStr();
  const currentMonthKey = currentMonth();
  
  // ✅ 1. คำนวณกำไรสุทธิเดือนนี้ จากสมุดบัญชี (Monthly Ledger) แม่นยำ 100%
  const totalProfitMonth = useMemo(() => {
    let total = 0; 
    products.forEach(p => {
      const manualGmv = Number(p.salesData?.monthly?.[currentMonthKey]) || Number(p.salesData?.last30d) || 0;
      const clipGmv = clips.filter(c => c.productId === p.id && c.postedAt?.slice(0, 7) === currentMonthKey).reduce((s, c) => s + (Number(c.gmv) || 0), 0);
      const bestGmv = Math.max(manualGmv, clipGmv);
      const comm = Number(p.scorecard?.commission) || 0;
      total += (bestGmv * comm) / 100;
    });
    return total;
  }, [products, clips, currentMonthKey]);

  const tiktokTotal30d = useMemo(() => products.reduce((s, p) => s + (Number(p.salesData?.last30d) || Number(p.salesData?.last7d) || 0), 0), [products]);

  const pattern = last7DaysClips.map(c => { if (c.isV) return 'V'; const p = products.find(pp => pp.id === c.productId); return p?.category || '?'; });
  const repeats = []; for (let i = 0; i < pattern.length - 2; i++) { if (pattern[i] && pattern[i] === pattern[i + 1] && pattern[i] === pattern[i + 2]) repeats.push(pattern[i]); }
  const hasRepeatIssue = repeats.length > 0;

  const vCount = last7DaysClips.filter(c => c.isV).length;
  const totalClips7d = last7DaysClips.length;
  const vRatio = totalClips7d > 0 ? Math.round((vCount / totalClips7d) * 100) : 0;
  const uniqueProducts7d = new Set(last7DaysClips.filter(c => !c.isV).map(c => c.productId)).size;
  const avgPerDay = (totalClips7d / 7).toFixed(1);

  // ✅ 2. Top Selling Products ดึงยอดขาย "ตลอดกาล" จากสมุดบัญชีรวมกับยอดวิวคลิป
  const topSellingProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    return products.map(p => {
      return { product: p, gmv: getAllTimeProductGMV(p, clips), commission: Number(p.scorecard?.commission || 0) };
    }).filter(p => p.gmv > 0).sort((a, b) => b.gmv - a.gmv).slice(0, 3);
  }, [products, clips]);

  // ✅ 3. กราฟ Capsule 12 เดือน ดึงยอดจาก Monthly Ledger ไม่ให้เดือนซ้อนทับกัน!
  const salesAnalyticsData = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 12 }, (_, i) => {
      const mStr = String(i + 1).padStart(2, '0');
      return { label: mStr, value: getMonthlyGMV(products, clips, `${currentYear}-${mStr}`) };
    });
  }, [products, clips]);

  const statsPending = useMemo(() => getStatsPending(clips), [clips]);
  const concentration = useMemo(() => getConcentration(clips, products, 30), [clips, products]);
  const winners = useMemo(() => getWinners(clips, products).slice(0, 5), [clips, products]);
  const repostCandidates = useMemo(() => getRepostCandidates(clips, products).slice(0, 3), [clips, products]);

  return (
    <div className="space-y-8">
      {/* Notice Board (ดึงจากหน้า Settings) */}
      {appSettings?.noticeBoard && (
        <div className="bg-gradient-to-r from-[#012b25] to-[#034c40] rounded-3xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.12)] text-white flex items-start gap-4">
          <div className="p-3 bg-[#d9eb54] text-[#012b25] rounded-2xl flex-shrink-0 shadow-inner"><Lightbulb className="w-6 h-6" /></div>
          <div>
            <h3 className="font-display text-lg text-[#d9eb54] mb-1.5 flex items-center gap-2">Weekly Strategy Notice</h3>
            <p className="text-sm text-emerald-50/90 whitespace-pre-wrap leading-relaxed">{appSettings.noticeBoard}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
       <OverviewKPI icon={DollarSign} label={`Est. Profit (เดือน ${currentMonthKey.split('-')[1]})`} value={`฿${fmtNum(Math.round(totalProfitMonth))}`} sub="ประเมินกำไรเดือนปัจจุบัน" isPrimary={true} />
        <OverviewKPI icon={User} label="Total Products (Port)" value={products.length} sub="รายการสินค้าในคลัง" />
        <OverviewKPI icon={Activity} label="Total Clips" value={clips.length} sub="คลิปสะสมทั้งหมดในระบบ" />
      </div>

      {/* ⚠️ สินค้าครบกำหนดคัดกรองคะแนน (Rescore Alert) */}
      {productsNeedingRescore && productsNeedingRescore.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 shadow-sm space-y-3 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-1.5 h-full bg-amber-400"></div>
          <div className="flex items-center justify-between ml-2">
            <div className="flex items-center gap-2 text-amber-900 font-bold">
              <Clock className="w-5 h-5 text-amber-600" />
              <h3 className="font-display text-base">รายการสินค้าที่ต้องประเมินคะแนน (NEW & Stale)</h3>
              <span className="bg-amber-200 text-amber-800 text-[10px] px-2 py-0.5 rounded-full">{productsNeedingRescore.length} รายการ</span>
            </div>
            <button onClick={() => onGoTo('products')} className="text-xs bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-xl font-bold transition-all shadow-sm hidden sm:block">ไปจัดการ</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 ml-2">
            {productsNeedingRescore.slice(0, 8).map(p => (
              <div key={p.id} onClick={() => onSelectProduct(p.id)} className="bg-white border border-amber-100 p-3 rounded-2xl cursor-pointer hover:shadow-md hover:border-amber-300 transition-all flex items-center justify-between group">
                <div className="truncate text-sm font-semibold text-slate-800 pr-2 group-hover:text-amber-700 transition-colors">{p.name}</div>
                <div className={`text-[10px] px-2 py-1 rounded-lg font-bold whitespace-nowrap flex-shrink-0 ${!p.lastScoredAt ? 'bg-sky-100 text-sky-700' : 'bg-amber-100 text-amber-800'}`}>{!p.lastScoredAt ? 'NEW' : `${daysSince(p.lastScoredAt)} วัน`}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="bg-white border border-[#e9eceb] rounded-3xl p-6 shadow-sm xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between"><div><h3 className="font-display text-lg text-[#012b25]">Sales Analytics</h3><p className="text-xs text-slate-400">ประเมินสถิติแรงกระตุ้นยอดขายคลิป</p></div></div>
          <CapsuleChart data={salesAnalyticsData} />
        </div>
        <div className="bg-white border border-[#e9eceb] rounded-3xl p-6 shadow-sm space-y-5">
          <h3 className="font-display text-base text-[#012b25] flex items-center justify-between"><span>Top Selling Products</span><span className="text-[10px] bg-emerald-50 text-emerald-800 font-bold px-2 py-1 rounded-md">All Time</span></h3>
          <div className="flex justify-around items-end h-48 pt-4">
            {topSellingProducts.length === 0 ? (<div className="text-center py-12 text-xs text-slate-400 italic w-full">ยังไม่มีสถิติ GMV</div>) : (
              topSellingProducts.map((pData, idx) => {
                const colors = ['bg-[#f26522]', 'bg-[#0d2a23]', 'bg-[#bcd924]'];
                const scaleHeights = ['h-[85%]', 'h-[65%]', 'h-[45%]'];
                return (
                  <div key={pData.product.id} className="flex flex-col items-center flex-1">
                    <div className="w-6 bg-slate-100 rounded-full h-32 flex items-end overflow-hidden"><div className={`w-full ${colors[idx]} rounded-full ${scaleHeights[idx]} flex items-center justify-center`}><span className="text-[8px] font-bold text-white rotate-90 whitespace-nowrap">{truncate(pData.product.name, 12)}</span></div></div>
                    <span className="text-[10px] font-bold text-slate-800 font-mono mt-2">฿{fmtNum(pData.gmv)}</span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#e9eceb] rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between"><h3 className="font-display text-base text-[#012b25] flex items-center gap-1.5"><Target className="w-4 h-4 text-emerald-800" /> ตรวจสอบเป้าหมายคุณภาพ หลัก 3V (7 วันล่าสุด)</h3></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <VBar label="Volume (จำนวนคลิป)" value={totalClips7d} target={21} sub={`${avgPerDay} คลิป/วัน`} />
          <VBar label="Value (คลิปให้ความรู้)" value={vRatio} target={30} suffix="%" sub={`${vRatio}% V-Clips`} />
          <VBar label="Variety (ความหลากหลาย)" value={uniqueProducts7d} target={4} sub={`${uniqueProducts7d} แบรนด์`} />
        </div>
      </div>

      {concentration && concentration.pct >= CONCENTRATION_LIMIT && (
        <div className="bg-amber-50 border border-amber-200 text-amber-900 rounded-3xl p-5 flex items-start gap-3 shadow-sm">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div><h4 className="font-display text-sm">แจ้งเตือนความเสี่ยง: พึ่งพิงยอดขายสินค้าตัวเดียวเกินไป ({concentration.pct}%)</h4><p className="text-xs text-slate-500 mt-1">สินค้า "{concentration.product?.name}" ครองสัดส่วนพอร์ตเกินเซฟโซนที่ {CONCENTRATION_LIMIT}% กระจายความเสี่ยงด่วน</p></div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm lg:col-span-2 space-y-4">
          <h3 className="font-display text-base flex items-center gap-2"><Flame className="w-4 h-4 text-rose-500" /> 🔥 อันดับสินค้าทำเงินสูงสุด</h3>
          <div className="divide-y divide-slate-100">
            {topSellingProducts.map((t, i) => {
              const catInfo = getAbcdInfo(t.product?.category);
              return (
                <button key={t.product.id} onClick={() => onSelectProduct(t.product.id)} className="w-full py-3.5 flex items-center justify-between text-left hover:bg-slate-50 px-2 rounded-xl transition-all">
                  <div className="flex items-center gap-3 min-w-0"><span className="font-display text-slate-400 w-4">#{i+1}</span><div className={`w-7 h-7 rounded-lg font-bold text-xs flex items-center justify-center ${catInfo.bg} text-white`}>{catInfo.short}</div><div className="min-w-0"><div className="font-semibold text-sm text-slate-800 truncate">{t.product.name}</div><div className="text-[11px] text-slate-400 font-mono">คอม {t.commission}%</div></div></div>
                  <div className="text-right flex-shrink-0 font-mono text-xs font-bold text-slate-800">฿{fmtNum(t.gmv)}</div>
                </button>
              );
            })}
          </div>
        </div>
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm space-y-3">
          <h3 className="font-display text-base flex items-center gap-2"><Zap className="w-4 h-4 text-lime-500" /> Variety โพสต์ (7 วัน)</h3>
          <div className="flex flex-wrap gap-1.5 py-2">
            {pattern.length === 0 ? (<div className="text-xs text-slate-400 italic">ยังไม่มีประวัติคลิป</div>) : (pattern.map((cat, idx) => { const catInfo = getAbcdInfo(cat); return (<div key={idx} className={`w-8 h-8 rounded-lg ${catInfo.bg} text-white font-display flex items-center justify-center text-xs shadow-sm`}>{catInfo.short}</div>); }))}
          </div>
          {hasRepeatIssue && (<div className="bg-rose-50 text-rose-700 text-[11px] p-2.5 rounded-xl border border-rose-100 flex items-start gap-1.5"><AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" /><div>ลงรหัสซ้ำติดต่อกันเกินไป เสี่ยงผู้ติดตามเบื่อ ควรจัดระเบียบแบบฟันปลา</div></div>)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[#e9eceb] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between"><h3 className="font-display text-base text-[#012b25] flex items-center gap-2"><Repeat className="w-4 h-4 text-[#7c3aed]" /> ⏱️ ระบบแจ้งเตือนคิวทำซ้ำ (Repost)</h3></div>
          <div className="space-y-3">
            {repostCandidates.length === 0 ? (<p className="text-xs text-slate-400 italic text-center py-6">ไม่มีประวัติคลิป Winner เข้าเกณฑ์</p>) : (
              repostCandidates.map(r => (
                <div key={r.clip.id} className="p-4 bg-slate-50 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border border-slate-100/50">
                  <div className="min-w-0 flex-1"><div className="font-bold text-slate-800 truncate">{r.clip.hook || 'ไม่มีคำเปิดหัว'}</div><div className="text-[10px] text-slate-400 font-mono mt-0.5">ยอดเดิม ฿{fmtNum(r.clip.gmv)} ({r.daysOld} วันที่แล้ว)</div></div>
                  <div className="flex gap-1.5 flex-shrink-0"><button onClick={() => onMakeSimilar(r.clip)} className="bg-[#d9eb54] text-[#012b25] font-bold px-3 py-1.5 rounded-lg">ปั่นสคริปต์ใหม่</button><button onClick={() => onMarkRepostDone(r.clip.id, r.repostBucket)} className="bg-[#e2f7e4] text-[#1d7c2a] font-bold px-3 py-1.5 rounded-lg flex items-center gap-1">✓ โพสต์แล้ว</button></div>
                </div>
              ))
            )}
          </div>
        </div>
        <div className="bg-white border border-[#e9eceb] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between"><h3 className="font-display text-base text-[#012b25] flex items-center gap-2"><Trophy className="w-4 h-4 text-amber-500" /> 🏆 คลังเก็บประวัติผู้ชนะ (Winner)</h3></div>
          <div className="space-y-3">
            {winners.length === 0 ? (<p className="text-xs text-slate-400 italic text-center py-6">ยังไม่มีคลิปยอดเกิน ฿1,000</p>) : (
              winners.map(w => (
                <div key={w.clip.id} className="p-3.5 bg-amber-50/50 border border-amber-100 rounded-2xl flex items-center justify-between gap-3 text-xs">
                  <div className="min-w-0 flex-1"><div className="font-bold text-slate-800 truncate">{w.clip.hook || 'ไม่มีคำเปิดหัว'}</div><div className="text-[10px] text-slate-400 font-mono mt-0.5 font-semibold">สินค้า: {w.product?.name || 'V-Content'}</div></div>
                  <span className="font-mono font-bold text-amber-700 text-sm flex-shrink-0">฿{fmtNum(w.clip.gmv)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[#e9eceb] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between"><h3 className="font-display text-base text-[#012b25]">Latest Clips (ค้างตรวจสถิติ)</h3><button onClick={() => onGoTo('log')} className="text-xs font-bold text-[#012b25] hover:underline">View All</button></div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead><tr className="bg-slate-50 font-bold border-b border-slate-100 text-slate-400"><th className="p-3">Clip Hook</th><th className="p-3">ประเภท</th><th className="p-3">สถานะ</th><th className="p-3 text-right">ดำเนินการ</th></tr></thead>
              <tbody className="divide-y divide-slate-50">
                {statsPending.pending24h.concat(statsPending.pending7d).length === 0 ? (
                  <tr><td colSpan="4" className="p-6 text-center text-slate-400 italic">🎉 ดำเนินการอัปเดตสถิติครบหมดทุกคลิปแล้ว</td></tr>
                ) : (
                  statsPending.pending24h.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50/50"><td className="p-3 truncate max-w-[150px] font-medium text-slate-800">{c.hook || 'ไม่มี Hook'}</td><td className="p-3"><span className="text-[10px] bg-sky-50 text-sky-800 px-2 py-0.5 rounded-md font-semibold">24 Hours</span></td><td className="p-3"><span className="w-2.5 h-2.5 bg-amber-400 rounded-full inline-block animate-pulse" /></td><td className="p-3 text-right"><button onClick={() => onEditClip(c.id)} className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg font-bold">อัปเดตวิว</button></td></tr>
                  )).concat(statsPending.pending7d.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50/50"><td className="p-3 truncate max-w-[150px] font-medium text-slate-800">{c.hook || 'ไม่มี Hook'}</td><td className="p-3"><span className="text-[10px] bg-purple-50 text-[#7c3aed] px-2 py-0.5 rounded-md font-semibold">7 Days</span></td><td className="p-3"><span className="w-2.5 h-2.5 bg-purple-400 rounded-full inline-block animate-pulse" /></td><td className="p-3 text-right"><button onClick={() => onEditClip(c.id)} className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg font-bold">อัปเดตวิว</button></td></tr>
                  )))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <div className="bg-white border border-[#e9eceb] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between"><h3 className="font-display text-base text-[#012b25]">Focused Products</h3><button onClick={() => onGoTo('lock')} className="text-xs font-bold text-[#012b25] hover:underline">Manage</button></div>
          <div className="space-y-3">
            {lockedProducts.length === 0 ? <div className="text-center py-6 text-xs text-slate-400">ยังไม่ล็อกเป้าหมาย</div> : lockedProducts.slice(0, 4).map(p => {
              const made = clips.filter(c => c.productId === p.id && c.postedAt?.slice(0, 7) === currentMonth()).length;
              const target = p.locked?.targetClips || 1;
              const catInfo = getAbcdInfo(p.category);
              return (
                <div key={p.id} onClick={() => onSelectProduct(p.id)} className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-100/50 transition-all">
                  <div className="flex items-center gap-3"><div className={`w-8 h-8 rounded-lg font-bold text-xs flex items-center justify-center ${catInfo.bg} text-white`}>{catInfo.short}</div><span className="font-display font-bold text-sm text-slate-800 truncate max-w-[160px]">{p.name || 'ไม่ระบุชื่อ'}</span></div>
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

function ProductHubPage({ products, clips, onAdd, onSelect, onOpenRadar }) {
  const [search, setSearch] = useState(''); const [filter, setFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all'); const [sortBy, setSortBy] = useState('score');
  
  const [viewMode, setViewMode] = useState(() => { try { return localStorage.getItem('peem6pack_viewMode') || 'box'; } catch { return 'box'; } });
  useEffect(() => { try { localStorage.setItem('peem6pack_viewMode', viewMode); } catch {} }, [viewMode]);

  const filtered = useMemo(() => {
    let list = products.filter(p => {
      const isStale = !p.lastScoredAt || daysSince(p.lastScoredAt) >= RESCORE_DAYS;
      if (search && !p.name?.toLowerCase().includes(search.toLowerCase())) return false;
      if (filter === 'stale' && !isStale) return false;
      if (['PICK', 'WAIT', 'DROP'].includes(filter.toUpperCase()) && p.decision?.toUpperCase() !== filter.toUpperCase()) return false;
      if (filter === 'locked' && !p.locked) return false;
      if (['A', 'B', 'C', 'D'].includes(filter) && p.category !== filter) return false;
      if (typeFilter !== 'all' && p.productType !== typeFilter) return false;
      return true;
    });
    
    if (sortBy === 'score') list.sort((a, b) => (b.scorePct || 0) - (a.scorePct || 0));
    else if (sortBy === 'rescore') list.sort((a, b) => daysSince(b.lastScoredAt || 0) - daysSince(a.lastScoredAt || 0));
    else if (sortBy === 'name') list.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'th'));
    else if (sortBy === 'created') list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return list;
  }, [products, search, filter, typeFilter, sortBy]);

  const staleProducts = products.filter(p => !p.lastScoredAt || daysSince(p.lastScoredAt) >= RESCORE_DAYS);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-[#e9eceb] rounded-3xl p-5 shadow-sm flex items-center justify-between"><div><span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Total Products</span><div className="font-display text-2xl text-[#012b25] mt-1">{products.length}</div></div><div className="p-3 bg-slate-50 text-slate-400 rounded-2xl"><Package className="w-5 h-5" /></div></div>
        <div className="bg-amber-50 border border-amber-200 rounded-3xl p-5 shadow-sm flex items-center justify-between cursor-pointer hover:bg-amber-100 transition-colors" onClick={() => setFilter('stale')}><div><span className="text-[10px] text-amber-700 font-bold uppercase tracking-wider block">Low Stock / Stale</span><div className="font-display text-2xl text-amber-600 mt-1">{staleProducts.length} <span className="text-xs font-sans text-amber-500">ชิ้น</span></div></div><div className="p-3 bg-white/50 text-amber-500 rounded-2xl"><AlertTriangle className="w-5 h-5" /></div></div>
        <div className="bg-white border border-[#e9eceb] rounded-3xl p-5 shadow-sm flex items-center justify-between"><div><span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Drop Items</span><div className="font-display text-2xl text-[#dc2626] mt-1">{products.filter(p=>p.decision === 'DROP').length}</div></div><div className="p-3 bg-rose-50 text-rose-500 rounded-2xl"><X className="w-5 h-5" /></div></div>
      </div>

      <div className="bg-white border border-[#e9eceb] rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search for items..." className="w-full pl-10 pr-4 py-2.5 bg-[#f3f6f5] border border-transparent rounded-full text-xs focus:outline-none focus:border-emerald-700 focus:bg-white transition-all shadow-inner" /><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /></div>
          <div className="flex flex-wrap gap-2">
            <button onClick={onOpenRadar} className="bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs px-5 py-2.5 rounded-full transition-all shadow-sm flex items-center gap-1.5"><Sparkles className="w-4 h-4" /> สแกนเรดาร์ TikTok</button>
            <button onClick={onAdd} className="bg-[#bcd924] hover:bg-[#a9c41d] text-[#0d2a23] font-bold text-xs px-5 py-2.5 rounded-full transition-all shadow-sm flex items-center gap-1.5"><Plus className="w-4 h-4" /> Add Product</button>
            <select value={filter} onChange={e=>setFilter(e.target.value)} className="bg-[#f3f6f5] border-none text-xs font-bold px-4 py-2.5 rounded-full"><option value="all">ทุกพอร์ต</option><option value="pick">🟢 PICK</option><option value="wait">🟡 WAIT</option><option value="drop">🔴 DROP</option><option value="locked">🔒 Locked Focus</option><option value="stale">⏱️ Stale</option><option value="A">หมวด A</option><option value="B">หมวด B</option><option value="C">หมวด C</option><option value="D">หมวด D</option></select>
            <select value={typeFilter} onChange={e=>setTypeFilter(e.target.value)} className="bg-[#f3f6f5] border-none text-xs font-bold px-4 py-2.5 rounded-full"><option value="all">ทุกหมวดหมู่</option>{PRODUCT_TYPES.map(t => <option key={t.id} value={t.id}>{t.emoji} {t.label}</option>)}</select>
          </div>
        </div>
        <div className="flex items-center justify-between pt-1 border-t border-slate-50 text-slate-500">
          <div className="flex items-center gap-1 text-xs font-bold"><ArrowUpDown className="w-3.5 h-3.5 text-slate-400" /><select value={sortBy} onChange={e=>setSortBy(e.target.value)} className="bg-transparent border-none text-xs focus:ring-0 p-0 text-slate-600 font-bold"><option value="score">คะแนน (สูง-ต่ำ)</option><option value="rescore">Stale (เก่า-ใหม่)</option><option value="name">ชื่อ A-Z</option><option value="created">เพิ่มล่าสุด</option></select><span className="text-[10px] text-slate-400 ml-1">พบ {filtered.length} รายการ</span></div>
          <div className="flex bg-slate-100 rounded-lg p-1 border border-slate-200/50"><button onClick={() => setViewMode('box')} className={`p-1 rounded-md transition-all ${viewMode === 'box' ? 'bg-white text-[#012b25] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}><LayoutGrid className="w-3.5 h-3.5" /></button><button onClick={() => setViewMode('list')} className={`p-1 rounded-md transition-all ${viewMode === 'list' ? 'bg-white text-[#012b25] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}><List className="w-3.5 h-3.5" /></button></div>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12"><Package className="w-12 h-12 text-slate-300 mx-auto mb-2" /><p className="text-sm text-slate-400 italic">ไม่พบสินค้า</p></div>
        ) : viewMode === 'box' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 pt-2">
            {filtered.map(p => {
              const dec = getDecisionInfo(p.decision); const catInfo = getAbcdInfo(p.category); 
              const isStale = !p.lastScoredAt || daysSince(p.lastScoredAt) >= RESCORE_DAYS;
              const comm = p.scorecard?.commission || 0;
              const rawTrend = p.scorecard?.gmv30dPct;
              const hasTrend = rawTrend !== undefined && rawTrend !== null && rawTrend !== ''; 
              const trendIsUp = Number(rawTrend) > 0;

              return (
                <div key={p.id} onClick={() => onSelect(p.id)} className={`bg-white border ${isStale ? 'border-amber-400 shadow-sm shadow-amber-100' : 'border-slate-100'} rounded-3xl p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between relative group`}>
                  {isStale && <div className="absolute -top-3 -right-2 bg-amber-500 text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg border-2 border-white flex items-center gap-1.5 z-10"><Clock className="w-3.5 h-3.5 animate-pulse"/> ประเมิน!</div>}
                  {p.locked && <div className="absolute top-4 right-4 text-[#012b25] bg-lime-400/20 p-1.5 rounded-full border border-lime-400/20"><Lock className="w-3.5 h-3.5" /></div>}
                  <div>
                    <div className="flex items-center gap-1.5 mb-3 flex-wrap">
                      <div className={`w-6 h-6 rounded-md font-bold text-xs flex items-center justify-center ${catInfo.bg} text-white flex-shrink-0`}>{catInfo.short}</div>
                      {p.isShopAds && <span className="text-[9px] bg-rose-50 text-rose-700 font-bold px-1.5 py-0.5 rounded-md border border-rose-100">🛒 Ads</span>}
                      {p.price > 0 && <span className="text-[9px] bg-slate-100 text-slate-600 font-semibold font-mono px-1.5 py-0.5 rounded-md">฿{fmtNum(p.price)}</span>}
                    </div>
                    <h3 className="font-display text-base text-slate-800 line-clamp-2 group-hover:text-emerald-950 transition-colors leading-tight">{p.name || 'ไม่ระบุชื่อ'}</h3>
                    <p className="text-xs text-slate-400 mt-1 truncate">{p.brand || 'No brand'}</p>
                  </div>
                  
                  <div className="mt-4 flex items-center gap-4 text-xs font-mono bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                    <div className="flex flex-col"><span className="text-slate-400 text-[9px] uppercase font-bold tracking-wider">Comm.</span><span className="font-bold text-violet-700">{comm > 0 ? `${comm}%` : '-'}</span></div>
                    <div className="flex flex-col"><span className="text-slate-400 text-[9px] uppercase font-bold tracking-wider">Trend 30d</span><span className={`font-bold ${hasTrend ? (trendIsUp ? 'text-emerald-600' : 'text-rose-600') : 'text-slate-600'}`}>{hasTrend ? `${trendIsUp ? '+' : ''}${rawTrend}%` : '-'}</span></div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-50 flex items-end justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">Argoon Score</div>
                      <div className={`font-mono font-bold text-sm mt-0.5 ${!p.lastScoredAt ? 'text-amber-500' : 'text-slate-800'}`}>
                        {!p.lastScoredAt ? 'PENDING' : `${p.score}/${p.maxScore || 18}`} <span className="text-xs text-slate-400 font-normal">{!p.lastScoredAt ? '' : `(${p.scorePct}%)`}</span>
                      </div>
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
              <thead><tr className="bg-slate-50/80 font-bold text-slate-400 border-b border-slate-100 uppercase text-[10px] tracking-wider"><th className="p-4">Name</th><th className="p-4">Clips</th><th className="p-4">Price</th><th className="p-4 text-center">Comm %</th><th className="p-4 text-center">Trend 30d</th><th className="p-4 text-center">Score</th><th className="p-4">Decision</th><th className="p-4 text-right">Actions</th></tr></thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map(p => {
                  const clipCount = clips.filter(c => c.productId === p.id).length; const dec = getDecisionInfo(p.decision); const catInfo = getAbcdInfo(p.category);
                  const isStale = !p.lastScoredAt || daysSince(p.lastScoredAt) >= RESCORE_DAYS;
                  const comm = Number(p.scorecard?.commission) || 0;
                  const rawTrend = p.scorecard?.gmv30dPct;
                  const hasTrend = rawTrend !== undefined && rawTrend !== null && rawTrend !== '';
                  const trendIsUp = Number(rawTrend) > 0;

                  return (
                    <tr key={p.id} className={`hover:bg-slate-50/50 group transition-colors ${isStale ? 'bg-amber-50/30' : ''}`}>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className={`w-6 h-6 rounded-md font-bold text-xs flex items-center justify-center ${catInfo.bg} text-white flex-shrink-0`}>{catInfo.short}</div>
                            {isStale && <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-white animate-pulse"></div>}
                          </div>
                          <div className="truncate max-w-[200px] xl:max-w-[300px]">
                            <span className={`font-display font-bold text-sm group-hover:text-emerald-950 block truncate ${isStale ? 'text-amber-900' : 'text-slate-800'}`}>{p.name || '-'}</span>
                            <span className="text-[10px] text-slate-500 flex items-center gap-1 mt-0.5">{p.brand || '-'} {p.isShopAds && <span className="text-rose-500 font-bold ml-1">· 🛒 Ads</span>}</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-mono font-bold text-slate-700">{clipCount}</td>
                      <td className="p-4 font-mono font-bold text-emerald-800">฿{fmtNum(p.price)}</td>
                      <td className="p-4 text-center font-mono font-bold text-violet-700 bg-violet-50/30 rounded-lg">{comm > 0 ? `${comm}%` : '-'}</td>
                      <td className="p-4 text-center font-mono font-bold">
                        {hasTrend ? (
                          <span className={`flex items-center justify-center gap-1 ${trendIsUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {trendIsUp ? <TrendingUp className="w-3 h-3"/> : <TrendingDown className="w-3 h-3"/>} {rawTrend}%
                          </span>
                        ) : '-'}
                      </td>
                      <td className="p-4 text-center">
                        <div className={`font-mono font-bold text-xs ${!p.lastScoredAt ? 'text-amber-500' : 'text-slate-800'}`}>{!p.lastScoredAt ? 'PENDING' : `${p.score}/${p.maxScore || 18}`}</div>
                        {p.lastScoredAt && <div className="text-[9px] text-slate-400 font-medium">{p.scorePct}%</div>}
                      </td>
                      <td className="p-4"><span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-full ${dec.bg} ${dec.text}`}>{dec.label}</span></td>
                      <td className="p-4 text-right"><button onClick={() => onSelect(p.id)} className="text-xs bg-white border border-slate-200 hover:border-[#012b25] hover:text-[#012b25] px-4 py-2 rounded-full font-bold transition-all shadow-sm">แก้ไข</button></td>
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
  const decision = DECISION_INFO[product.decision]; const angleProgress = (product.angles?.length || 0); const anglePct = Math.min(100, Math.round((angleProgress / TARGET_ANGLES) * 100)); const productType = PRODUCT_TYPES.find(t => t.id === product.productType); const bestAngle = useMemo(() => getBestAngle(product, clips), [product, clips]); const commission = product.scorecard?.commission; const sales7d = useMemo(() => getProductSales(product, allClips, 7), [product, allClips]); const sales30d = useMemo(() => getProductSales(product, allClips, 30), [product, allClips]);
  return (
    <div className="space-y-6">
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-slate-800 transition"><ChevronLeft className="w-4 h-4" /> Back to Products</button>
      <div className="bg-[#012b25] text-white rounded-3xl p-6 md:p-8 shadow-sm flex flex-col md:flex-row justify-between items-start gap-6 relative overflow-hidden border border-[#043d34]">
        <div className="space-y-3 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] bg-emerald-900 border border-emerald-800 font-bold px-3 py-1 rounded-md text-emerald-300 uppercase tracking-wider">{productType?.emoji} {productType?.label}</span>
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
          <div><div className="text-[10px] font-bold text-emerald-300/80 uppercase tracking-wider">Argoon Score</div><div className="font-mono font-bold text-2xl mt-1">{product.score}/{product.maxScore} <span className="text-xs text-emerald-400 font-normal">({product.scorePct}%)</span></div></div>
          <div className="mt-4 pt-3 border-t border-[#095c4f] flex gap-2"><button onClick={onEditScore} className="flex-1 bg-[#d9eb54] text-[#012b25] text-xs font-bold py-2 rounded-xl text-center">Score Recalculate</button><button onClick={onEditInfo} className="p-2.5 bg-[#095c4f] text-emerald-100 rounded-xl hover:text-white transition-all"><Edit3 className="w-4 h-4" /></button></div>
        </div>
      </div>

      <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4"><span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Switch Strategy Category:</span><div className="flex gap-1">{['A', 'B', 'C', 'D'].map(cat => { const catInfo = getAbcdInfo(cat); return (<button key={cat} onClick={() => onSetCategory(cat)} className={`text-xs font-bold px-4 py-2 rounded-xl transition-all ${product.category === cat ? `${catInfo.bg} text-white` : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>หมวด {cat}</button>); })}</div></div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-2 bg-gradient-to-br from-[#0f5144]/5 to-white">
          <div className="text-[10px] font-bold text-[#0f5144] uppercase tracking-wider block">📊 อัตรายอดขายจริงจาก TikTok Shop</div>
          {sales30d.hasManual ? (<div className="space-y-1 pt-1"><div className="flex justify-between text-xs font-bold text-slate-700"><span>ยอดสะสม 7 วัน:</span><span className="font-mono">฿{fmtNum(sales7d.fromManual)}</span></div><div className="flex justify-between text-xs font-bold text-slate-700"><span>ยอดสะสม 30 วัน:</span><span className="font-mono">฿{fmtNum(sales30d.fromManual)}</span></div></div>) : (<p className="text-xs text-slate-400 italic py-2">ยังไม่มีประวัติยอดขายป้อนสดแมนนวล กดแก้ไขสิทธิ์ Info เพื่อระบุตัวเลข</p>)}
        </div>
        <div className="bg-white border border-slate-100 rounded-3xl p-5 shadow-sm space-y-2 bg-gradient-to-br from-blue-50/20 to-white">
          <div className="text-[10px] font-bold text-blue-800 uppercase tracking-wider block">🎬 ยอดรวมที่แทร็กจากคลิป (Attribution)</div>
          <div className="space-y-1 pt-1"><div className="flex justify-between text-xs font-bold text-slate-700"><span>ยอดคลิปสะสม 7 วัน:</span><span className="font-mono">฿{fmtNum(sales7d.fromClips)}</span></div><div className="flex justify-between text-xs font-bold text-slate-700"><span>ยอดคลิปสะสม 30 วัน:</span><span className="font-mono">฿{fmtNum(sales30d.fromClips)}</span></div></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-[#e9eceb] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between"><h3 className="font-display text-base text-[#012b25]">😣 Pain Point Bank ({product.pains?.length || 0})</h3><button onClick={onAddPain} className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs px-3 py-2 rounded-xl transition-all">+ Add Pain</button></div>
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {(!product.pains || product.pains.length === 0) ? (<p className="text-xs text-slate-400 italic text-center py-6">ยังไม่มียอดคลัง Pain เพื่อไปรันระบบ Splitter</p>) : (
              product.pains.map(p => (<div key={p.id} className="p-3 bg-slate-50 border border-slate-100 rounded-2xl flex items-start justify-between gap-2 text-xs"><div className="space-y-1"><p className="text-slate-700 leading-normal font-medium">{p.text}</p><span className="text-[9px] text-slate-400 uppercase font-bold tracking-wide">{PAIN_SOURCES.find(s=>s.id===p.source)?.label}</span></div><button onClick={() => onRemovePain(p.id)} className="text-slate-300 hover:text-rose-500 p-1"><Trash2 className="w-3.5 h-3.5" /></button></div>))
            )}
          </div>
        </div>
        <div className="bg-white border border-[#e9eceb] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between"><h3 className="font-display text-base text-[#012b25]">🎯 Angle Bank มุมคอนเทนต์ ({product.angles?.length || 0})</h3><button onClick={onAddAngle} className="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold text-xs px-3 py-2 rounded-xl transition-all">+ Add Angle</button></div>
          <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
            {bestAngle && bestAngle.count > 0 && (<div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3 relative shadow-inner"><div className="p-2.5 bg-[#bcd924] text-[#012b25] rounded-xl flex-shrink-0 shadow-sm"><Trophy className="w-5 h-5" /></div><div className="space-y-0.5"><span className="text-[10px] font-bold text-amber-800 uppercase tracking-wide block">🏆 Angle ที่ดีที่สุด (Best Angle)</span><p className="text-sm font-bold text-[#012b25]">{bestAngle.angle.text}</p><p className="text-[11px] text-slate-500 font-mono mt-1 font-semibold">เฉลี่ย ฿{fmtNum(Math.round(bestAngle.avg))}/คลิป · ปั่นยอดสะสม ฿{fmtNum(bestAngle.totalGMV)} จาก {bestAngle.count} คลิป</p></div></div>)}
            {(!product.angles || product.angles.length === 0) ? (<p className="text-xs text-slate-400 italic text-center py-6">ยังไม่มียอดคลังปัญญา Angle นำสายตา</p>) : (
              product.angles.map(a => { const isBest = bestAngle && bestAngle.angle.id === a.id; return (<div key={a.id} className={`p-3 rounded-2xl flex items-center justify-between gap-2 text-xs border ${isBest ? 'bg-amber-50/30 border-amber-200/50' : 'bg-slate-50 border-slate-100'}`}><p className="text-slate-700 font-medium">{isBest && '🏆 '}{a.text}</p><button onClick={() => onRemoveAngle(a.id)} className="text-slate-300 hover:text-rose-500 p-1"><Trash2 className="w-3.5 h-3.5" /></button></div>); })
            )}
          </div>
        </div>
      </div>

      <SplitterSection product={product} />

      <div className="bg-white border border-[#e9eceb] rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between"><h3 className="font-display text-base text-[#012b25]">🎬 คลิปสะสมที่ผูกกับสินค้านี้ ({clips.length})</h3><button onClick={onAddClip} className="bg-[#bcd924] text-[#0d2a23] font-bold text-xs px-4 py-2.5 rounded-full shadow-sm hover:bg-[#a9c41d] transition-all">+ Add Clip</button></div>
        <div className="space-y-2">
          {clips.length === 0 ? (<p className="text-xs text-slate-400 italic text-center py-8">ยังไม่มีคลิปที่บันทึกข้อมูลไว้</p>) : (
            [...clips].reverse().map(c => (
              <div key={c.id} onClick={() => onEditClip(c.id)} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between hover:bg-slate-100/50 transition-all cursor-pointer text-xs">
                <div className="min-w-0 flex-1 pr-4"><div className="font-display font-bold text-slate-800 text-sm truncate">{c.hook || '(ไม่มีประโยค Hook เปิดหัว)'}</div><div className="text-[10px] text-slate-400 font-mono mt-1 font-bold">DATE: {fmtDate(c.postedAt)} · VIEWS 7D: {fmtNum(c.views7d || 0)} views</div></div>
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
    const p = product; const selectedPillar = DEFAULT_PILLARS.find(x => x.id === pillarId); const selectedPain = (p.pains || []).find(x => x.id === painId); const selectedAngle = (p.angles || []).find(x => x.id === angleId); const catInfo = getAbcdInfo(p.category);
    return `เขียนสคริปต์ TikTok Shop สำหรับช่อง PEEM6PACK (Fitness Affiliate Creator)\n\n[สินค้าหลัก]\nชื่อ: ${p.name || 'ไม่ระบุ'} ${p.brand ? `แบรนด์ ${p.brand}` : ''}\nหมวดสินค้า: ${catInfo.label}\n\n[เกณฑ์วิเคราะห์คำสั่งคอนเทนต์]\nPillar ช่อง: ${selectedPillar ? `${selectedPillar.id} - ${selectedPillar.name}` : 'ตามความเหมาะสม'}\nPain Point ลูกค้า: ${selectedPain ? selectedPain.text : 'ปัญหาทั่วไปที่คนรักสุขภาพเจอ'}\nAngle คอนเทนต์: ${selectedAngle ? selectedAngle.text : 'มุมเล่าเน้นประโยชน์ใช้งานจริง'}\n\n[สูตรผสมสับแถวคลิป (Splitter Combo)]\nกลุ่มเป้าหมาย (Persona): ${persona || 'คนรักสุขภาพทั่วไป'}\nสถานการณ์จริง (Situation): ${situation || 'ชีวิตประจำวัน'}\nอารมณ์นำสายตา (Emotion): ${emotion || 'ต้องการความคุ้มค่าและผลลัพธ์'}\nรูปแบบสคริปต์ (Format): ${format || 'รีวิวการใช้งานสไตล์เพื่อนแนะนำ'}\n${hook ? `\nHook เปิดคลิปบังคับใช้: "${hook}"` : ''}\nระยะเวลาความยาวคลิป: ${duration} วินาที\n\n[เงื่อนไขการเขียนและสไตล์ช่อง]\n- พูดคุยสไตล์เพื่อนแนะนำเพื่อน ตบมุกด้วยความเป็นกันเอง ไม่วิชาการจ๋าเกินไป\n- ตัวตนของ ภีม: ชายอายุ 31 ปี ฟิตเนสอินฟลูเอนเซอร์ในไทย หุ่นดี ออกกำลังกายจริง ใช้จริง\n- โครงสร้าง: Hook 3 วินาทีแรก -> เปิดประเด็นความเจ็บปวด -> นำเสนอผลลัพธ์ของสินค้า -> CTA (Soft Sell ตะกร้าเหลือง)\n- ไม่ฮาร์ดเซลล์ ไม่เคลมสรรพคุณเกินจริง เน้น Value ก่อนขายเสมอ\n\n[กรอบผลลัพธ์ที่ต้องการ (Output)]\n1. Hook ทางเลือกเพิ่มเติม 3 แบบ\n2. บทสคริปต์เต็มแบบตารางแบ่งช่องเวลา: วินาทีที่ / ฉากที่เห็นในกล้อง (Visual) / คำพูดที่ต้องอัดเสียง (Voiceover)\n3. ข้อความตัวหนังสือซับไตเติ้ลหลัก (Text Overlay) ปักหมุด 3 จุดสำคัญ\n4. แคปชั่นแคปโพสต์ + แฮชแท็กช่องหลัก (#PEEM6PACK)`;
  };

  const handleCopy = async () => { try { await navigator.clipboard.writeText(generatePrompt()); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch (e) {} };

  return (
    <div className="bg-[#012b25] text-white rounded-3xl p-6 md:p-8 shadow-sm border border-[#043d34] space-y-4">
      <div><h3 className="font-display text-lg flex items-center gap-2 text-[#bcd924]"><Wand2 className="w-5 h-5" /> ระบบเครื่องปั่นสคริปต์ Splitter Engine v2</h3><p className="text-xs text-emerald-300">กดจับคู่ตัวแปรกวนพอร์ตรหัสคอนเทนต์เพื่อดีด Prompt ป้อนคุยกับ Claude/ChatGPT ได้ทันที</p></div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
        <div><label className="text-[10px] uppercase font-bold text-emerald-300 block mb-1">Pillar หลัก</label><select value={pillarId} onChange={e=>setPillarId(e.target.value)} className="w-full px-3 py-2.5 bg-[#033c32] border border-[#075246] rounded-xl focus:outline-none"><option value="">-- เลือก --</option>{DEFAULT_PILLARS.map(pl=><option key={pl.id} value={pl.id}>{pl.id} - {pl.name}</option>)}</select></div>
        <div><label className="text-[10px] uppercase font-bold text-emerald-300 block mb-1">Pain Point</label><select value={painId} onChange={e=>setPainId(e.target.value)} className="w-full px-3 py-2.5 bg-[#033c32] border border-[#075246] rounded-xl focus:outline-none"><option value="">-- เลือก --</option>{(product.pains || []).map(pn=><option key={pn.id} value={pn.id}>{truncate(pn.text, 25)}</option>)}</select></div>
        <div><label className="text-[10px] uppercase font-bold text-emerald-300 block mb-1">Angle เล่า</label><select value={angleId} onChange={e=>setAngleId(e.target.value)} className="w-full px-3 py-2.5 bg-[#033c32] border border-[#075246] rounded-xl focus:outline-none"><option value="">-- เลือก --</option>{(product.angles || []).map(an=><option key={an.id} value={an.id}>{truncate(an.text, 25)}</option>)}</select></div>
        <div><label className="text-[10px] uppercase font-bold text-emerald-300 block mb-1">Persona</label><select value={persona} onChange={e=>setPersona(e.target.value)} className="w-full px-3 py-2.5 bg-[#033c32] border border-[#075246] rounded-xl focus:outline-none"><option value="">-- เลือก --</option>{SPLITTER_OPTIONS.persona.map(ps=><option key={ps} value={ps}>{ps}</option>)}</select></div>
        <div><label className="text-[10px] uppercase font-bold text-[#bcd924] block mb-1">Situation</label><select value={situation} onChange={e=>setSituation(e.target.value)} className="w-full px-3 py-2.5 bg-[#033c32] border border-[#075246] rounded-xl focus:outline-none"><option value="">-- เลือก --</option>{SPLITTER_OPTIONS.situation.map(st=><option key={st} value={st}>{st}</option>)}</select></div>
        <div><label className="text-[10px] uppercase font-bold text-emerald-300 block mb-1">Emotion</label><select value={emotion} onChange={e=>setEmotion(e.target.value)} className="w-full px-3 py-2.5 bg-[#033c32] border border-[#075246] rounded-xl focus:outline-none"><option value="">-- เลือก --</option>{SPLITTER_OPTIONS.emotion.map(em=><option key={em} value={em}>{em}</option>)}</select></div>
        <div><label className="text-[10px] uppercase font-bold text-[#bcd924] block mb-1">Format</label><select value={format} onChange={e=>setFormat(e.target.value)} className="w-full px-3 py-2.5 bg-[#033c32] border border-[#075246] rounded-xl focus:outline-none"><option value="">-- เลือก --</option>{SPLITTER_OPTIONS.format.map(fm=><option key={fm} value={fm}>{fm}</option>)}</select></div>
        <div><label className="text-[10px] uppercase font-bold text-emerald-300 block mb-1">ความยาวสคริปต์ (วิ)</label><input type="number" value={duration} onChange={e=>setDuration(e.target.value)} className="w-full px-3 py-2.5 bg-[#033c32] border border-[#075246] rounded-xl focus:outline-none font-mono" /></div>
      </div>
      <div><label className="text-[10px] uppercase font-bold text-emerald-300 block mb-1">ประโยค Hook เปิดหัว (Optional)</label><input value={hook} onChange={e=>setHook(e.target.value)} placeholder="เช่น อย่าพึ่งซื้อน้ำมันปลาถ้ายังไม่ได้อ่านหลังกล่อง..." className="w-full text-xs px-4 py-2.5 bg-[#033c32] border border-[#075246] rounded-xl focus:outline-none placeholder:text-emerald-700 text-white" /></div>
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
      <div className="flex items-center justify-between"><div><h2 className="font-display text-xl text-slate-800">เป้าหมายยุทธศาสตร์ Lock List เดือนนี้</h2><p className="text-xs text-slate-400">ควบคุมสัดส่วน Content Frequency</p></div><button onClick={onLockNew} className="bg-[#012b25] text-white text-xs font-bold px-4 py-2.5 rounded-full shadow-sm">+ ล็อกเป้าหมายเพิ่ม</button></div>
      {lockedProducts.length === 0 ? (
        <div className="bg-white border border-[#e9eceb] rounded-3xl p-8 text-center text-slate-400 font-medium shadow-sm">ไม่มีข้อมูลสินค้าที่ตรึงเป้าในเดือนนี้</div>
      ) : (
        <div className="space-y-6">
          {Object.entries(categorizedLocked).map(([tier, list]) => {
            if (list.length === 0) return null;
            const meta = { HOT: { label: '🔥 HOT STACK (เป้า 3-4 คลิป/สัปดาห์)', color: 'text-rose-600', bg: 'bg-rose-50' }, STEADY: { label: '⚡ STEADY STACK (เป้า 1-2 คลิป/สัปดาห์)', color: 'text-[#2563eb]', bg: 'bg-blue-50' }, PASSIVE: { label: '💤 PASSIVE STACK (เป้า 2-3 คลิป/เดือน)', color: 'text-slate-600', bg: 'bg-slate-50' } }[tier];
            return (
              <div key={tier} className="bg-white border border-[#e9eceb] rounded-3xl p-5 shadow-sm space-y-4">
                <div className={`p-3 rounded-2xl flex items-center justify-between font-bold text-xs ${meta.bg} ${meta.color}`}><span>{meta.label}</span><span className="font-mono">{list.length} แบรนด์</span></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {list.map(s => {
                    const made = clips.filter(c => c.productId === s.product.id && c.postedAt?.slice(0, 7) === monthKey).length;
                    const target = s.product.locked?.targetClips || s.targetMonth || 1;
                    const pct = Math.min(100, Math.round((made / target) * 100));
                    const catInfo = getAbcdInfo(s.product.category);
                    return (
                      <div key={s.product.id} className="border border-slate-100 p-4 rounded-2xl flex flex-col justify-between space-y-3 bg-slate-50/50">
                        <div className="flex items-center justify-between"><div className="flex items-center gap-2"><div className={`w-6 h-6 rounded-md font-bold text-xs flex items-center justify-center ${catInfo.bg} text-white`}>{catInfo.short}</div><span className="font-display font-bold text-sm text-[#012b25] truncate max-w-[160px]">{s.product.name}</span></div><button onClick={() => onUnlock(s.product.id)} className="text-slate-400 hover:text-rose-600 transition-colors">🔓 ปลดล็อก</button></div>
                        <div>
                          <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-500 mb-1"><span>ยอดทำจริงเทียบกับเป้าหมายความถี่:</span><span>{made} / {Math.round(target)} คลิป ({pct}%)</span></div>
                          <div className="w-full h-2 bg-slate-200/60 rounded-full overflow-hidden"><div className="h-full bg-[#bcd924] rounded-full transition-all duration-300" style={{ width: `${pct}%` }}></div></div>
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
  const [sortOrder, setSortOrder] = useState('date_desc');
  const [filterProduct, setFilterProduct] = useState('');
  const [filterABCD, setFilterABCD] = useState('');
  const [filterPillar, setFilterPillar] = useState('');
  const [filterType, setFilterType] = useState('');

  const filtered = useMemo(() => {
    if (!Array.isArray(clips)) return [];
    let list = clips.filter(c => {
      if (search && !c.hook?.toLowerCase().includes(search.toLowerCase())) return false;
      if (period !== 'all') { const cutoff = Date.now() - Number(period) * 86400000; if (new Date(c.postedAt).getTime() < cutoff) return false; }
      if (filterProduct === 'V') { if (!c.isV) return false; } else if (filterProduct && c.productId !== filterProduct) return false;
      if (filterABCD) { if (c.isV) { if (filterABCD !== 'V') return false; } else { const p = products.find(pp => pp.id === c.productId); if (p?.category !== filterABCD) return false; } }
      if (filterPillar && c.pillarId !== filterPillar) return false;
      if (filterType) { if (c.isV) return false; const p = products.find(pp => pp.id === c.productId); if (p?.productType !== filterType) return false; }
      return true;
    });

    list.sort((a, b) => {
      if (sortOrder === 'date_desc') return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
      if (sortOrder === 'date_asc') return new Date(a.postedAt).getTime() - new Date(b.postedAt).getTime();
      if (sortOrder === 'gmv_desc') return (Number(b.gmv) || 0) - (Number(a.gmv) || 0);
      if (sortOrder === 'views7d_desc') return (Number(b.views7d) || 0) - (Number(a.views7d) || 0);
      return 0;
    });
    return list;
  }, [clips, products, search, period, filterProduct, filterABCD, filterPillar, filterType, sortOrder]);

  const totalGMV = filtered.reduce((s, c) => s + (Number(c.gmv) || 0), 0);
  const winners = filtered.filter(c => (Number(c.gmv) || 0) >= WINNER_GMV).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <OverviewKPI icon={Activity} label="คลิปที่กรองได้" value={filtered.length} sub="รายการวิดีโอ" />
        <OverviewKPI icon={DollarSign} label="GMV รวม" value={`฿${fmtNum(totalGMV)}`} sub="จากคลิปเหล่านี้" />
        <OverviewKPI icon={Trophy} label="Winners" value={winners} sub="คลิปทำเงิน ≥฿1k" />
        <OverviewKPI icon={Database} label="สัดส่วน V-Content" value={`${filtered.length > 0 ? Math.round((filtered.filter(c=>c.isV).length / filtered.length)*100) : 0}%`} sub="จากรายการที่กรอง" />
      </div>

      <div className="bg-white border border-[#e9eceb] rounded-3xl p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <h3 className="font-display text-lg text-[#012b25]">📋 ประวัติ Logs & แผงตัวกรอง</h3>
          <div className="flex gap-1 bg-[#f3f6f5] p-1 rounded-xl">
            {['7', '30', '90', 'all'].map(p => (
              <button key={p} onClick={() => setPeriod(p)} className={`text-[11px] font-bold px-4 py-2 rounded-lg transition-all ${period === p ? 'bg-[#012b25] text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>{p === 'all' ? 'ทั้งหมด' : `${p} วัน`}</button>
            ))}
          </div>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
          <div className="col-span-2 lg:col-span-5 relative"><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="ค้นหาจากประโยค Hook..." className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-emerald-700 transition-all shadow-sm" /><Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /></div>
          <div><label className="text-[10px] uppercase font-bold text-slate-500 block mb-1.5 ml-1">สินค้า</label><select value={filterProduct} onChange={e=>setFilterProduct(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none"><option value="">-- ทั้งหมด --</option><option value="V">📚 V — Value Content</option>{products.map(p => <option key={p.id} value={p.id}>{truncate(p.name, 20)}</option>)}</select></div>
          <div><label className="text-[10px] uppercase font-bold text-slate-500 block mb-1.5 ml-1">หมวด ABCD</label><select value={filterABCD} onChange={e=>setFilterABCD(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none"><option value="">-- ทั้งหมด --</option>{Object.entries(ABCD_INFO).map(([k, info]) => <option key={k} value={k}>{info.short} - {info.desc}</option>)}</select></div>
          <div><label className="text-[10px] uppercase font-bold text-slate-500 block mb-1.5 ml-1">Pillar หลัก</label><select value={filterPillar} onChange={e=>setFilterPillar(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none"><option value="">-- ทั้งหมด --</option>{DEFAULT_PILLARS.map(p => <option key={p.id} value={p.id}>{p.id} - {p.name}</option>)}</select></div>
          <div><label className="text-[10px] uppercase font-bold text-slate-500 block mb-1.5 ml-1">ประเภท</label><select value={filterType} onChange={e=>setFilterType(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none"><option value="">-- ทั้งหมด --</option>{PRODUCT_TYPES.map(t => <option key={t.id} value={t.id}>{t.emoji} {t.label}</option>)}</select></div>
          <div><label className="text-[10px] uppercase font-bold text-slate-500 block mb-1.5 ml-1">การเรียงลำดับ</label><select value={sortOrder} onChange={e=>setSortOrder(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none font-bold text-[#012b25]"><option value="date_desc">📅 ล่าสุดขึ้นก่อน</option><option value="date_asc">📅 เก่าสุดขึ้นก่อน</option><option value="gmv_desc">🔥 GMV สูงสุด</option><option value="views7d_desc">👀 ยอดวิว 7d สูงสุด</option></select></div>
        </div>

        <div className="overflow-x-auto pt-2">
          <table className="w-full text-left text-xs border-collapse text-slate-600">
            <thead>
              <tr className="bg-slate-50/80 font-bold border-y border-slate-100 text-slate-400 uppercase text-[10px] tracking-wider">
                <th className="p-3 w-24">วันที่ลง</th>
                <th className="p-3 w-40">สินค้าหลัก</th>
                <th className="p-3">สคริปต์ Hook</th>
                <th className="p-3 w-24 text-center">สถานะเงิน</th>
                <th className="p-3 w-20 text-right">Views 7d</th>
                <th className="p-3 w-24 text-right">GMV สรุป</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr><td colSpan="6" className="p-8 text-center text-slate-400 italic">ไม่พบประวัติคลิปที่ตรงกับตัวกรอง</td></tr>
              ) : (
                filtered.map(c => {
                  const prod = products.find(p=>p.id === c.productId);
                  const isWinner = (Number(c.gmv) || 0) >= WINNER_GMV;
                  const catInfo = getAbcdInfo(c.isV ? 'V' : prod?.category);
                  const commStatus = c.commStatus || 'pending';
                  const statusColors = { paid: 'bg-emerald-100 text-emerald-700', pending: 'bg-amber-100 text-amber-700', failed: 'bg-rose-100 text-rose-700' }[commStatus];
                  const statusLabels = { paid: 'จ่ายแล้ว', pending: 'รอโอน', failed: 'ยกเลิก' }[commStatus];
                  return (
                    <tr key={c.id} onClick={() => onEditClip(c.id)} className="hover:bg-slate-50/80 cursor-pointer transition-colors text-slate-700 group">
                      <td className="p-3 whitespace-nowrap font-mono">{fmtDate(c.postedAt)}</td>
                      <td className="p-3"><div className="flex items-center gap-2"><div className={`w-5 h-5 rounded flex items-center justify-center text-[9px] font-bold text-white flex-shrink-0 ${catInfo.bg}`}>{catInfo.short}</div><span className="font-semibold text-slate-900 truncate max-w-[140px] block">{c.isV ? '📚 สาระความรู้ (V)' : (prod?.name || '-')}</span></div></td>
                      <td className="p-3 text-slate-500 font-medium group-hover:text-emerald-800 transition-colors"><div className="line-clamp-2 leading-relaxed" title={c.hook}>{c.hook || '-'}</div></td>
                      <td className="p-3 text-center"><span className={`px-2 py-1 rounded-md text-[10px] font-bold ${statusColors}`}>{statusLabels}</span></td>
                      <td className="p-3 text-right font-mono font-medium">{fmtNum(c.views7d)}</td>
                      <td className={`p-3 text-right font-mono font-bold ${isWinner ? 'text-[#f26522] text-sm' : 'text-emerald-700'}`}>฿{fmtNum(c.gmv)}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function DashboardView({ products, clips, appSettings, onUpdateSettings, onMakeSimilar, onEditClip, onMarkRepostDone, onPromoteToA }) {
  // ✅ ระบบเลือกแกนเวลา (Time Machine) - ค่าเริ่มต้นคือ 30 วันปัจจุบัน
  const [period, setPeriod] = useState('30'); 
  
  const recent = useMemo(() => {
    if (period.includes('-')) return clips.filter(c => c.postedAt?.slice(0, 7) === period);
    const days = Number(period) || 30; const cutoff = Date.now() - days * 86400000;
    return clips.filter(c => new Date(c.postedAt).getTime() >= cutoff);
  }, [clips, period]);

  // ตัวเลือกเดือนย้อนหลัง
  const monthOptions = useMemo(() => {
    const opts = []; const now = new Date();
    for (let i = 0; i < 6; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      opts.push({ value: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`, label: d.toLocaleDateString('th-TH', { month: 'long', year: 'numeric' }) });
    }
    return opts;
  }, []);
  
  const revenueTarget = appSettings?.monthlyRevenueTarget || MONTHLY_REVENUE_TARGET;
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [goalDraft, setGoalDraft] = useState(revenueTarget);
  useEffect(() => { setGoalDraft(revenueTarget); }, [revenueTarget]);

  // ดึงข้อมูลทั้งหมดผ่านแว่นขยายของ "แกนเวลา (period)" ที่เราเลือกไว้!
  const portfolioBalance = useMemo(() => getPortfolioBalance(products, clips, period), [products, clips, period]);
  const eCandidates = useMemo(() => getECandidates(products, clips, period), [products, clips, period]);
  const cutCandidates = useMemo(() => getProductsToCut(products, clips, period), [products, clips, period]);
  const roi = useMemo(() => getROIAnalysis(products, clips, revenueTarget, period), [products, clips, revenueTarget, period]);

  // 🧠 1. ฝังสมองกล AI Recommendations (วิเคราะห์แยกเวลาไม่ซ้อนทับอดีต)
  const recommendations = useMemo(() => {
    return products.map(p => {
      const sales = getProductSales(p, clips, period);
      const tiktok = sales.fromManual;
      const clipCount = sales.clipCount;
      const clipGMV = sales.fromClips;
      
      const commissionPct = Number(p.scorecard?.commission) || 0;
      const commRev = (tiktok * commissionPct) / 100;
      const clipCommRev = (clipGMV * commissionPct) / 100;

      if (sales.hasManual) {
        if (clipCount === 0 && commRev >= 500) return { product: p, rec: '💎 ขุดสมบัติ (Passive)', reason: `กินคอมฟรี ฿${fmtNum(Math.round(commRev))} จากคลิปเก่า/หน้าร้าน — รีบทำคลิปมุมใหม่เติมเชื้อไฟด่วน!`, color: 'bg-purple-600', icon: Sparkles, sortKey: 7 };
        if (commRev >= 1000 && clipCount < 3) return { product: p, rec: 'ดันด่วน', reason: `ฟันค่าคอม ฿${fmtNum(Math.round(commRev))} แต่ลงแค่ ${clipCount} คลิป — สับสคริปต์เพิ่มด่วน`, color: 'bg-rose-600', icon: Flame, sortKey: 6 };
        if (commRev >= 1000) return { product: p, rec: 'ดันต่อ', reason: `ตัวทำเงินหลัก (คอม ฿${fmtNum(Math.round(commRev))}) — เลี้ยงความถี่ไว้`, color: 'bg-emerald-500', icon: TrendingUp, sortKey: 5 };
        if (commRev >= 300 && clipCount < 3) return { product: p, rec: 'ลงเพิ่ม', reason: `ได้ค่าคอม ฿${fmtNum(Math.round(commRev))} กำลังมา — ขยี้คลิปเพิ่ม`, color: 'bg-amber-500', icon: Lightbulb, sortKey: 4 };
        if (commRev >= 300 || tiktok >= 5000) return { product: p, rec: 'ทำต่อ', reason: `ยอด GMV ฿${fmtNum(tiktok)} (คอม ฿${fmtNum(Math.round(commRev))})`, color: 'bg-sky-500', icon: Activity, sortKey: 3 };
        if (tiktok >= 1000) return { product: p, rec: 'ลองมุมใหม่', reason: `มียอด ฿${fmtNum(tiktok)} แต่คอมยังน้อย — หา Pain Point ใหม่`, color: 'bg-[#d97706]', icon: Wand2, sortKey: 2 };
        if (clipCount >= 4 && tiktok < 1000) return { product: p, rec: 'พักดูอาการ', reason: `ลงไป ${clipCount} คลิปยอดไม่เดิน — เซฟเวลาไปทำตัวอื่น`, color: 'bg-slate-500', icon: TrendingDown, sortKey: 1 };
        
        return null;
      }

      if (clipCount === 0) return null;
      const revPerClip = clipCount > 0 ? clipCommRev / clipCount : 0;
      
      if (revPerClip >= 300 && clipCount >= 2) return { product: p, rec: 'ดันต่อ', reason: `ได้ค่าคอมเฉลี่ย ฿${fmtNum(Math.round(revPerClip))}/คลิป — เอนจินทำงานดี`, color: 'bg-emerald-500', icon: TrendingUp, sortKey: 3 };
      if (revPerClip >= 100) return { product: p, rec: 'ทำต่อ', reason: `ได้ค่าคอมเฉลี่ย ฿${fmtNum(Math.round(revPerClip))}/คลิป`, color: 'bg-sky-500', icon: Activity, sortKey: 2 };
      if (clipCount >= 5) return { product: p, rec: 'ลองมุมใหม่', reason: `ลงไป ${clipCount} คลิป — รายได้คอม/คลิปยังต่ำ`, color: 'bg-amber-500', icon: Lightbulb, sortKey: 1 };
      
      return { product: p, rec: 'เทสต่อ', reason: 'ยังต้องเก็บสถิติเพิ่ม', color: 'bg-slate-400', icon: Activity, sortKey: 0 };
    }).filter(Boolean).sort((a, b) => b.sortKey - a.sortKey);
  }, [products, clips, period]);

  // ✅ 2. อัปเกรดสถิติ ABCD ให้ดึงยอดขายจาก Filter วันที่ถูกต้อง
  const abcdStats = useMemo(() => {
    const stats = { A: { gmv: 0, count: 0 }, B: { gmv: 0, count: 0 }, C: { gmv: 0, count: 0 }, D: { gmv: 0, count: 0 } };
    if (period.includes('-')) {
      products.forEach(p => {
        if (p.category && stats[p.category]) {
           const mGmv = Number(p.salesData?.monthly?.[period]) || 0;
           if (mGmv > 0) {
             stats[p.category].gmv += mGmv;
             stats[p.category].count += clips.filter(c => c.productId === p.id && c.postedAt?.slice(0,7) === period).length;
           }
        }
      });
    } else {
      recent.filter(c => !c.isV).forEach(c => { const p = products.find(pp => pp.id === c.productId); if (p?.category && stats[p.category]) { stats[p.category].gmv += Number(c.gmv) || 0; stats[p.category].count += 1; } });
    }
    return stats;
  }, [products, clips, recent, period]);

  const maxCategoryGmv = Math.max(...Object.values(abcdStats).map(s => s.gmv), 1);

  const pillarStats = useMemo(() => {
    const stats = {}; DEFAULT_PILLARS.forEach(p => stats[p.id] = 0);
    recent.forEach(c => { if (c.pillarId && stats[c.pillarId] !== undefined) stats[c.pillarId] += 1; });
    return stats;
  }, [recent]);
  const maxPillarCount = Math.max(...Object.values(pillarStats), 1);

  // ✅ 3. อัปเกรดกราฟ 6 เดือนย้อนหลัง ดึง GMV จริงๆ จากสมุดบัญชี (Monthly Ledger)
  const monthlyTrend = useMemo(() => {
    const months = []; const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1); 
      const ymKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`; 
      const mclips = clips.filter(c => c.postedAt?.slice(0, 7) === ymKey);
      months.push({ key: ymKey, label: d.toLocaleDateString('th-TH', { month: 'short' }), clipCount: mclips.length, gmv: getMonthlyGMV(products, clips, ymKey) });
    }
    return months;
  }, [clips, products]);

  const maxMonthlyClips = Math.max(...monthlyTrend.map(m => m.clipCount), 1); const maxMonthlyGmv = Math.max(...monthlyTrend.map(m => m.gmv), 1);

  return (
    <div className="space-y-6">
      
      {/* 🚀 แผงเลือกไทม์แมชชีน (Time Filter) */}
      <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-3 rounded-3xl border border-slate-100 shadow-sm gap-3 relative z-20">
        <div className="flex items-center gap-2 pl-2">
          <CalendarDays className="w-5 h-5 text-emerald-600" />
          <span className="text-sm font-bold text-[#012b25]">เลือกข้อมูลประจำช่วงเวลา:</span>
        </div>
        <select value={period} onChange={e => setPeriod(e.target.value)} className="bg-[#f3f6f5] border border-slate-200 text-sm font-bold px-5 py-3 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer text-[#012b25] appearance-none shadow-sm min-w-[200px]">
          <optgroup label="ยอดปัจจุบัน (Rolling Window)">
            <option value="30">30 วันล่าสุด (Current)</option>
            <option value="7">7 วันล่าสุด (Current)</option>
            <option value="90">90 วันล่าสุด (Current)</option>
          </optgroup>
          <optgroup label="สมุดบัญชีรายเดือน (Ledger)">
            {monthOptions.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
          </optgroup>
        </select>
      </div>

      <div className="bg-[#012b25] text-white rounded-3xl p-6 md:p-8 shadow-xl border border-[#043d34] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div><h3 className="font-display text-lg text-lime-400 flex items-center gap-2"><Target className="w-5 h-5" /> Strategic Target Planner</h3><p className="text-xs text-emerald-300 mt-1">คำนวณจำนวนสินค้าที่ต้องขายคนเดียวเพื่อพิชิตเป้าหมายรายเดือน</p></div>
          <div className="bg-[#033c32] p-2 rounded-2xl border border-[#065345] flex items-center gap-3">
            <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider pl-2">เป้ารายเดือน:</span>
            {isEditingGoal ? (
              <div className="flex items-center gap-1">
                <input type="number" value={goalDraft} onChange={e => setGoalDraft(Number(e.target.value))} className="w-24 px-2 py-1 bg-white text-[#012b25] font-mono font-bold text-sm rounded-lg focus:outline-none" autoFocus />
                <button onClick={() => { onUpdateSettings({ monthlyRevenueTarget: goalDraft }); setIsEditingGoal(false); }} className="bg-[#bcd924] text-[#012b25] p-1.5 rounded-lg"><CheckCircle2 className="w-4 h-4" /></button>
                <button onClick={() => { setGoalDraft(revenueTarget); setIsEditingGoal(false); }} className="bg-rose-500/20 text-rose-300 p-1.5 rounded-lg"><X className="w-4 h-4" /></button>
              </div>
            ) : (
              <div className="flex items-center gap-1 cursor-pointer group pr-2" onClick={() => setIsEditingGoal(true)}>
                <span className="font-display text-lg text-white">฿{fmtNum(revenueTarget)}</span>
                <Edit3 className="w-3.5 h-3.5 text-emerald-500 group-hover:text-white transition-colors ml-1" />
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#033c32] p-5 rounded-2xl border border-[#065345] grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div><span className="text-[10px] text-emerald-300 font-bold block uppercase tracking-wider">ประมาณการคอมมิชชันที่เลือก</span><span className="font-display text-xl text-white">฿{fmtNum(Math.round(roi.totalCommRevenue))}</span></div>
          <div><span className="text-[10px] text-emerald-300 font-bold block uppercase tracking-wider">ความคืบหน้า</span><span className="font-display text-xl text-[#bcd924]">{roi.pct}%</span></div>
          <div><span className="text-[10px] text-emerald-300 font-bold block uppercase tracking-wider">ยอดเงินที่ยังขาด</span><span className="font-display text-xl text-rose-400">฿{fmtNum(Math.round(roi.gap))}</span></div>
        </div>
        <div className="space-y-2.5">
          <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider block">📊 จำนวนชิ้นที่ต้องการขายแยกรายสินค้าเพื่อบรรลุเป้าหมาย:</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
            {roi.items.map(i => {
              const unitsNeeded = i.commPerOrder > 0 ? Math.ceil(revenueTarget / i.commPerOrder) : 0;
              return (
                <div key={i.product.id} className="bg-[#04342d]/80 border border-[#064a3f] p-4 rounded-2xl flex flex-col justify-between hover:bg-[#05443a] transition-colors">
                  <div className="flex items-start justify-between gap-2"><span className="font-display text-sm text-white font-bold leading-tight line-clamp-1">{i.product.name}</span><span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${getAbcdInfo(i.product.category).bg}`}>{i.product.category}</span></div>
                  <div className="flex justify-between items-baseline pt-4 border-t border-[#064239]/60 mt-3 text-xs"><span className="text-emerald-300 font-medium font-mono">฿{fmtNum(i.commPerOrder)} คอม/ชิ้น</span><span className="font-display text-sm text-[#bcd924] font-bold font-mono">ต้องขาย {fmtNum(unitsNeeded)} ชิ้น</span></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ✅ แผง Recommendations พร้อมทำงาน! */}
      {recommendations && recommendations.length > 0 && (
        <div className="bg-white border border-[#e9eceb] rounded-3xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base text-[#012b25] flex items-center gap-1.5"><Wand2 className="w-5 h-5 text-purple-600" /> AI Action Plan (เข็มทิศสั่งการประจำวัน)</h3>
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">วิเคราะห์ความคุ้มค่าจาก กำไรค่าคอมมิชชัน VS ความถี่การลงคลิป {period.includes('-') ? `(ข้อมูลบัญชีเดือน ${period})` : `(${period} วันล่าสุด)`}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {recommendations.map((rec) => {
              const Icon = rec.icon;
              return (
                <div key={rec.product.id} className="p-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-start gap-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                  <div className={`absolute top-0 left-0 w-1.5 h-full ${rec.color}`}></div>
                  <div className={`p-2.5 rounded-xl text-white shadow-sm flex-shrink-0 mt-0.5 ${rec.color}`}><Icon className="w-4 h-4" /></div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="font-display font-bold text-sm text-[#012b25] truncate pr-2">{rec.product.name}</span>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md text-white whitespace-nowrap shadow-sm ${rec.color}`}>{rec.rec}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed font-medium">{rec.reason}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {portfolioBalance && (
        <div className="bg-white border border-[#e9eceb] rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="font-display text-base text-[#012b25] flex items-center gap-1.5"><Target className="w-4 h-4 text-emerald-800" /> ตรวจสอบสมดุลสัดส่วนช่อง (Portfolio Balance Target)</h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">เป้าหมายมาตรฐาน: A {PORTFOLIO_TARGET.A}% / B {PORTFOLIO_TARGET.B}% / C {PORTFOLIO_TARGET.C}% / D {PORTFOLIO_TARGET.D}%</p>
          <div className="space-y-4 pt-1">
            {Object.entries(portfolioBalance).map(([k, b]) => {
              const info = getAbcdInfo(k); const statusColors = b.status === 'ok' ? 'bg-[#1d7c2a]' : 'bg-[#d97706]';
              return (
                <div key={k} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold"><div className="flex items-center gap-2"><div className={`w-5 h-5 rounded ${info.bg} text-white flex items-center justify-center text-[10px]`}>{k}</div><span className="text-slate-600">{info.desc}</span></div><span className="font-mono text-slate-700">{b.actual}% / {b.target}% <span className="text-slate-400">({b.status === 'ok' ? 'OK' : `สัดส่วนคลาดเคลื่อน ${b.diff > 0 ? '+' : ''}${b.diff}%`})</span></span></div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full rounded-full ${statusColors}`} style={{ width: `${Math.min(100, b.actual)}%` }}></div></div>
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
            {eCandidates.length === 0 ? (<p className="text-xs text-slate-400 italic text-center py-8">ยังไม่ตรวจพบแบรนด์ดาวรุ่งที่มีผลงานเทียบเท่านางฟ้า</p>) : (
              eCandidates.map(e => {
                const dec = getDecisionInfo(e.product.decision);
                return (
                  <div key={e.product.id} className="p-4 bg-gradient-to-br from-purple-50/20 to-white border border-purple-100 rounded-2xl space-y-3">
                    <div className="flex items-center justify-between"><span className="font-display font-bold text-[#012b25] text-sm">{e.product.name}</span><span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${dec.bg} ${dec.text}`}>{dec.label}</span></div>
                    <div className="flex flex-wrap gap-1">{e.reasons.map((r, idx) => (<span key={idx} className="text-[9px] bg-purple-50 text-purple-700 font-bold px-2 py-0.5 rounded-md">✓ {r}</span>))}</div>
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
            {cutCandidates.length === 0 ? (<p className="text-xs text-slate-400 italic text-center py-8">ยินดีด้วย! ยังไม่พบแบรนด์สินค้าเข้าเกณฑ์ถอดสิทธิ์วิกฤต</p>) : (
              cutCandidates.map(c => (
                <div key={c.product.id} className="p-4 bg-rose-50/30 border border-rose-100 rounded-2xl space-y-2"><div className="font-display font-bold text-rose-950 text-sm">{c.product.name}</div><div className="flex flex-wrap gap-1">{c.reasons.map((r, idx) => (<span key={idx} className="text-[9px] bg-rose-100/50 text-rose-700 font-bold px-2 py-0.5 rounded-md">{r}</span>))}</div></div>
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
              const info = getAbcdInfo(k); const barWidth = Math.round((s.gmv / maxCategoryGmv) * 100);
              return (
                <div key={k} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600"><div className="flex items-center gap-2"><div className={`w-5 h-5 rounded ${info.bg} text-white flex items-center justify-center text-[10px]`}>{k}</div><span>{info.desc}</span></div><span className="font-mono text-slate-800">฿{fmtNum(s.gmv)} <span className="text-slate-400 font-normal">({s.count} คลิป)</span></span></div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden"><div className={`h-full rounded-full ${info.bg}`} style={{ width: `${barWidth}%` }}></div></div>
                </div>
              );
            })}
          </div>
        </div>
        <div className="bg-white border border-[#e9eceb] rounded-3xl p-6 shadow-sm space-y-4">
          <h3 className="font-display text-base text-[#012b25]">📚 อัตราการคุมสัดส่วน Variety ตามเสา Pillar ({period}d)</h3>
          <div className="space-y-4">
            {DEFAULT_PILLARS.map(p => {
              const count = pillarStats[p.id] || 0; const barWidth = Math.round((count / maxPillarCount) * 100);
              return (
                <div key={p.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-600"><span>{p.emoji} {p.id} - {p.desc}</span><span className="font-mono text-slate-800">{count} คลิป</span></div>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden"><div className="h-full rounded-full bg-[#7c3aed]" style={{ width: `${barWidth}%` }}></div></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white border border-[#e9eceb] rounded-3xl p-6 shadow-sm space-y-4">
        <h3 className="font-display text-base text-[#012b25]">📅 เปรียบเทียบปริมาณคลิป และ ยอด GMV (จากสมุดบัญชี 6 เดือนย้อนหลัง)</h3>
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
                <div className="text-[10px] font-bold text-slate-400">{m.label}</div><div className="text-[9px] font-mono font-bold text-slate-600">{m.clipCount} ค. / ฿{m.gmv >= 1000 ? Math.round(m.gmv / 1000) + 'k' : m.gmv}</div>
              </div>
            );
          })}
        </div>
        <div className="flex justify-center gap-4 pt-2 text-[10px] font-bold"><div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-lime-400 rounded" /> จำนวนคลิปโพสต์</div><div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 bg-rose-400 rounded" /> ยอด GMV สะสม</div></div>
      </div>
    </div>
  );
}

// ============================================================================
// [ZONE 5] PHARMLY AESTHETIC MODALS & FORMS
// ============================================================================

function Modal({ title, onClose, children, size = 'md', footer }) {
  const maxW = size === 'lg' ? 'max-w-2xl' : size === 'xl' ? 'max-w-4xl' : 'max-w-md';
  return (
    <div className="fixed inset-0 bg-[#012b25]/80 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className={`bg-[#f3f6f5] w-full ${maxW} rounded-t-[2rem] sm:rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] flex flex-col relative overflow-hidden`} style={{ maxHeight: '90vh' }}>
        <div className="px-6 py-5 bg-white border-b border-slate-100 flex items-center justify-between z-10">
          <h2 className="font-display text-xl text-[#012b25] font-bold">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-rose-50 rounded-full transition-colors text-slate-400 hover:text-rose-500"><X className="w-5 h-5" /></button>
        </div>
        <div className="overflow-y-auto p-6 flex-1 bg-white/50">{children}</div>
        {footer && <div className="border-t border-slate-100 px-6 py-4 bg-white flex-shrink-0">{footer}</div>}
      </div>
    </div>
  );
}

function FormField({ label, hint, children }) {
  return (
    <div className="mb-4">
      {label && <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-1.5 ml-1">{label}</label>}
      {children}
      {hint && <div className="text-[10px] text-slate-400 mt-1.5 ml-1 leading-relaxed">{hint}</div>}
    </div>
  );
}

const inputStyles = "w-full px-4 py-3 bg-[#f3f6f5] border border-transparent rounded-2xl text-sm focus:outline-none focus:bg-white focus:border-[#012b25]/20 focus:ring-2 focus:ring-[#012b25]/10 transition-all";

function AddProductModal({ onClose, onSave, showToast }) {
  const [name, setName] = useState(''); const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('A'); const [productType, setProductType] = useState('supplement');
  const [tiktokProductId, setTiktokProductId] = useState('');
  const [tiktokLink, setTiktokLink] = useState(''); const [kalodataLink, setKalodataLink] = useState('');
  
  // ✅ ตัวแปร GMV Max %
  const [gmvMaxPct, setGmvMaxPct] = useState(''); 
  
  const [pillars, setPillars] = useState([]);
  const [tiktokRank, setTiktokRank] = useState(''); const [price, setPrice] = useState('');
  const [sales7d, setSales7d] = useState(''); const [sales30d, setSales30d] = useState('');
  const [sc, setSc] = useState({ commission: '', gmv7dPct: '', gmv30dPct: '', creatorCount: '', anglesCount: '', crPct: '', concentration: '' });
  const [usedReal, setUsedReal] = useState(false); const [scopeOK, setScopeOK] = useState(false); const [isShopAds, setIsShopAds] = useState(false);
  
  const score = calcScore(sc); const dec = DECISION_INFO[getDecision(score.pct)];
  const suggestion = useMemo(() => autoClassify({ gmv30d: sales30d, commission: sc.commission, tiktokRank, price }), [sales30d, sc.commission, tiktokRank, price]);

  const handleSave = () => {
    if (!name) return showToast('กรุณาระบุชื่อสินค้าก่อน', 'error');
    if (!usedReal || !scopeOK) { if (!window.confirm('⚠️ ข้ามมาตรการ 2-Rules Gate ยืนยันบันทึกต่อหรือไม่?')) return; }
    const salesData = (sales7d || sales30d) ? { last7d: Number(sales7d) || 0, last30d: Number(sales30d) || 0, updatedAt: new Date().toISOString() } : null;
    
    onSave({ name, brand, category, productType, tiktokLink, kalodataLink, gmvMaxPct: isShopAds ? String(gmvMaxPct) : '', pillars, scorecard: sc, tiktokRank: tiktokRank ? Number(tiktokRank) : null, price: price ? Number(price) : null, salesData, isShopAds, usedReal, scopeOK, tiktokProductId });
    onClose();
  };

  const footer = (<div className="flex items-center justify-between gap-4"><div className="flex-1 min-w-0"><div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-0.5">Argoon Score</div><div className="font-mono text-base font-bold text-[#012b25] leading-none">{score.total}/{score.max} <span className="text-xs font-normal text-slate-400">({score.pct}%)</span> {dec && <span className={`ml-2 text-[10px] font-sans font-bold px-2 py-0.5 rounded ${dec.bg} text-white`}>{dec.label}</span>}</div></div><button onClick={handleSave} className="bg-[#012b25] text-[#d9eb54] hover:bg-[#033c32] font-bold px-8 py-3 rounded-2xl shadow-md transition-all">บันทึกลงคลัง</button></div>);

  return (
    <Modal title="📦 เพิ่มสินค้าใหม่เข้าพอร์ต" onClose={onClose} size="lg" footer={footer}>
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 mb-4 shadow-sm"><div className="text-xs font-bold text-amber-900 mb-2 flex items-center gap-1.5"><AlertTriangle className="w-4 h-4" /> 2-Rules Gate เช็คความเสี่ยง</div><label className="flex items-start gap-2 text-xs cursor-pointer mb-2"><input type="checkbox" checked={usedReal} onChange={e => setUsedReal(e.target.checked)} className="mt-0.5 w-4 h-4 accent-[#012b25] rounded" /><span><strong>ใช้จริงแล้ว</strong> หรือ First Impression</span></label><label className="flex items-start gap-2 text-xs cursor-pointer"><input type="checkbox" checked={scopeOK} onChange={e => setScopeOK(e.target.checked)} className="mt-0.5 w-4 h-4 accent-[#012b25] rounded" /><span><strong>อยู่ใน Scope</strong> ของช่อง</span></label></div>
      <FormField label="ชื่อสินค้า *"><input value={name} onChange={e => setName(e.target.value)} autoFocus className={inputStyles} placeholder="เช่น Oxyflow รองเท้า" /></FormField>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
        <FormField label="แบรนด์ / ร้านค้า"><input value={brand} onChange={e => setBrand(e.target.value)} className={inputStyles} placeholder="ชื่อแบรนด์" /></FormField>
        <FormField label="🔗 รหัสสินค้า TikTok (Product ID) 🔑" hint="ตัวเลข 19 หลัก จากแอป (เว้นว่างไว้สแกนหาทีหลังได้)">
          <input value={tiktokProductId} onChange={e => setTiktokProductId(e.target.value.replace(/\D/g, ''))} className={`${inputStyles} font-mono font-bold text-sky-700 bg-sky-50 focus:bg-white border-sky-100`} placeholder="เช่น 173126537522..." />
        </FormField>
      </div>

      <FormField label="ประเภทผลิตภัณฑ์"><div className="grid grid-cols-2 md:grid-cols-4 gap-2">{PRODUCT_TYPES.slice(0, 4).map(t => (<button key={t.id} onClick={() => setProductType(t.id)} className={`text-[11px] font-bold p-3 rounded-xl border transition-all text-left truncate ${productType === t.id ? 'bg-[#012b25] text-white border-[#012b25] shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>{t.emoji} {t.label}</button>))}</div></FormField>
      
      {/* ✅ เพิ่มช่อง GMV Max % ควบคู่กับตะกร้าแดง */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start mb-4">
        <FormField>
          <label className="flex items-center gap-3 cursor-pointer p-4 bg-rose-50/50 border border-rose-100 rounded-2xl hover:bg-rose-50 transition-all h-full">
            <input type="checkbox" checked={isShopAds} onChange={e => setIsShopAds(e.target.checked)} className="w-5 h-5 text-rose-600 rounded accent-rose-600 bg-white" />
            <span className="text-sm font-semibold text-rose-900">🛒 <strong>ตะกร้าแดง (Shop Ads)</strong></span>
          </label>
        </FormField>
        <FormField label="⚡ GMV MAX % (โฆษณาร้านค้า)">
          <input type="number" step="0.1" value={gmvMaxPct} onChange={e => setGmvMaxPct(e.target.value)} className={`${inputStyles} font-mono font-bold text-amber-600`} placeholder="เช่น 15.5" disabled={!isShopAds} />
        </FormField>
      </div>

      <FormField label="จัดหมวด ABCD">
        {(sales30d || sc.commission || tiktokRank) && (<div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 mb-4 text-xs shadow-sm"><div className="font-bold text-purple-900 mb-1 flex items-center gap-1.5"><Sparkles className="w-4 h-4" /> AI แนะนำหมวด: <span className="text-base ml-1">{suggestion.label}</span></div><div className="text-purple-700/80 mb-3">{suggestion.reason}</div>{category !== suggestion.cat && <button onClick={() => setCategory(suggestion.cat)} className="text-[10px] font-bold bg-purple-600 text-white px-3 py-1.5 rounded-lg shadow-sm hover:bg-purple-700">ประทับตราหมวด {suggestion.cat}</button>}</div>)}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">{Object.entries(ABCD_INFO).filter(([k]) => k !== 'V').map(([k, info]) => (<button key={k} onClick={() => setCategory(k)} className={`p-4 text-left rounded-2xl border transition-all ${category === k ? `${info.bg} text-white shadow-md border-transparent` : 'bg-white border-slate-200 hover:bg-slate-50'}`}><div className="font-bold text-sm">{info.label}</div><div className={`text-[10px] mt-1 ${category === k ? 'text-white/80' : 'text-slate-400'}`}>{info.desc}</div></button>))}</div>
      </FormField>
      <div className="grid grid-cols-2 gap-3"><FormField label="💰 ราคาขาย (฿)"><input type="number" min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)} className={inputStyles} placeholder="299" /></FormField><FormField label="🏆 TikTok Rank"><input type="number" min="1" value={tiktokRank} onChange={e => setTiktokRank(e.target.value)} className={inputStyles} placeholder="1" /></FormField></div>
      <div className="border-t border-slate-100 pt-5 mt-4 bg-emerald-50/50 -mx-6 px-6 py-5"><h3 className="font-display text-sm text-[#012b25] mb-3 flex items-center gap-1.5"><Activity className="w-5 h-5 text-emerald-600"/> ยอดขายแมนนวล (จาก TikTok)</h3><div className="grid grid-cols-2 gap-3"><FormField label="GMV 7 วัน ฿"><input type="number" value={sales7d} onChange={e => setSales7d(e.target.value)} className={`${inputStyles} bg-white shadow-sm font-mono`} placeholder="0" /></FormField><FormField label="GMV 30 วัน ฿ (แนะนำ)"><input type="number" value={sales30d} onChange={e => setSales30d(e.target.value)} className={`${inputStyles} bg-white shadow-sm border-emerald-100 font-mono`} placeholder="0" /></FormField></div></div>
      <div className="border-t border-slate-100 pt-5 mt-4"><h3 className="font-display text-sm text-[#012b25] mb-4 flex items-center gap-1.5"><Target className="w-5 h-5 text-[#012b25]"/> ข้อมูลประเมิน (Argoon Scorecard)</h3><div className="grid grid-cols-2 gap-3 mb-2"><FormField label="Commission % (มาตรฐาน)"><input type="number" value={sc.commission} onChange={e => setSc({ ...sc, commission: e.target.value })} className={inputStyles} placeholder="ค่าคอม Organic" /></FormField><FormField label="Creator Count"><input type="number" value={sc.creatorCount} onChange={e => setSc({ ...sc, creatorCount: e.target.value })} className={inputStyles} /></FormField></div><div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 mb-2"><div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">GMV Momentum Trend</div><div className="grid grid-cols-2 gap-3"><FormField label="% Growth 7d"><input type="number" step="0.1" value={sc.gmv7dPct} onChange={e => setSc({ ...sc, gmv7dPct: e.target.value })} className={`${inputStyles} bg-white font-mono`} /></FormField><FormField label="% Growth 30d"><input type="number" step="0.1" value={sc.gmv30dPct} onChange={e => setSc({ ...sc, gmv30dPct: e.target.value })} className={`${inputStyles} bg-white font-mono`} /></FormField></div></div><div className="grid grid-cols-3 gap-2"><FormField label="Angles"><input type="number" value={sc.anglesCount} onChange={e => setSc({ ...sc, anglesCount: e.target.value })} className={inputStyles} /></FormField><FormField label="CR %"><input type="number" value={sc.crPct} onChange={e => setSc({ ...sc, crPct: e.target.value })} className={inputStyles} /></FormField><FormField label="Concentration"><input type="number" value={sc.concentration} onChange={e => setSc({ ...sc, concentration: e.target.value })} className={inputStyles} /></FormField></div></div>
    </Modal>
  );
}

function EditProductInfoModal({ product, onClose, onSave }) {
  const [name, setName] = useState(product?.name || ''); const [brand, setBrand] = useState(product?.brand || '');
  const [productType, setProductType] = useState(product?.productType || 'supplement');
  const [tiktokProductId, setTiktokProductId] = useState(product?.tiktokProductId || ''); 
  const [tiktokLink, setTiktokLink] = useState(product?.tiktokLink || ''); const [kalodataLink, setKalodataLink] = useState(product?.kalodataLink || '');
  const [tiktokRank, setTiktokRank] = useState(product?.tiktokRank || ''); const [price, setPrice] = useState(product?.price || '');
  const [isShopAds, setIsShopAds] = useState(!!product?.isShopAds);
  
  // ✅ โหลดค่า gmvMaxPct เดิม
  const [gmvMaxPct, setGmvMaxPct] = useState(product?.gmvMaxPct || '');
  
  const [sales7d, setSales7d] = useState(product?.salesData?.last7d || ''); const [sales30d, setSales30d] = useState(product?.salesData?.last30d || '');
  if (!product) return null;
  const suggestion = useMemo(() => autoClassify({ gmv30d: sales30d, commission: product.scorecard?.commission, tiktokRank, price }), [sales30d, product.scorecard?.commission, tiktokRank, price]);
  
  const handleSave = () => {
    const salesData = (sales7d || sales30d) ? { last7d: Number(sales7d) || 0, last30d: Number(sales30d) || 0, updatedAt: new Date().toISOString() } : product.salesData;
    // ✅ ส่ง gmvMaxPct อัปเดต
    onSave({ name, brand, productType, tiktokProductId, tiktokLink, kalodataLink, gmvMaxPct: isShopAds ? String(gmvMaxPct) : '', tiktokRank: tiktokRank ? Number(tiktokRank) : null, price: price ? Number(price) : null, isShopAds, salesData });
  };
  
  const footer = (<button onClick={handleSave} className="w-full bg-[#012b25] text-white hover:bg-[#033c32] font-bold py-4 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"><Edit3 className="w-4 h-4"/> อัปเดตข้อมูลสเปกสินค้า</button>);
  
  return (
    <Modal title="⚙️ แก้ไขข้อมูล (Info)" onClose={onClose} size="lg" footer={footer}>
      <FormField label="ชื่อสินค้า"><input value={name} onChange={e => setName(e.target.value)} className={inputStyles} /></FormField>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-2">
        <FormField label="แบรนด์"><input value={brand} onChange={e => setBrand(e.target.value)} className={inputStyles} /></FormField>
        <FormField label="🔗 รหัสสินค้า TikTok (Product ID) 🔑" hint="รหัสสินค้า 19 หลักสำหรับเชื่อม Auto-Sync GMV">
          <input value={tiktokProductId} onChange={e => setTiktokProductId(e.target.value.replace(/\D/g, ''))} className={`${inputStyles} font-mono font-bold text-sky-700 bg-sky-50 border-sky-100 focus:bg-white`} placeholder="เช่น 1732082829043..." />
        </FormField>
      </div>

      <FormField label="ประเภทผลิตภัณฑ์"><div className="grid grid-cols-2 md:grid-cols-4 gap-2">{PRODUCT_TYPES.slice(0,4).map(t => (<button key={t.id} onClick={() => setProductType(t.id)} className={`text-[11px] p-3.5 rounded-2xl border transition-all text-left font-bold ${productType === t.id ? 'bg-[#012b25] text-white border-[#012b25] shadow-md' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50'}`}>{t.emoji} {t.label}</button>))}</div></FormField>
      
      {/* ✅ เพิ่มช่อง GMV Max คู่กับตะกร้าแดง */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start mb-4">
        <FormField>
          <label className="flex items-center gap-3 cursor-pointer p-4 bg-rose-50/50 border border-rose-100 rounded-2xl hover:bg-rose-50 transition-all h-full">
            <input type="checkbox" checked={isShopAds} onChange={e => setIsShopAds(e.target.checked)} className="w-5 h-5 accent-rose-600 rounded bg-white" />
            <span className="text-sm font-semibold text-rose-900">🛒 <strong>ตะกร้าแดง (Shop Ads)</strong></span>
          </label>
        </FormField>
        <FormField label="⚡ GMV MAX % (โฆษณาร้านค้า)">
          <input type="number" step="0.1" min="0" value={gmvMaxPct} onChange={e => setGmvMaxPct(e.target.value)} className={`${inputStyles} font-mono font-bold text-rose-600 bg-rose-50/30 focus:bg-white border-rose-100 disabled:opacity-50 disabled:bg-slate-100`} placeholder="เช่น 15.5" disabled={!isShopAds} />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-3"><FormField label="💰 ราคาขาย (฿)"><input type="number" step="0.01" min="0" value={price} onChange={e => setPrice(e.target.value)} className={`${inputStyles} font-mono font-bold text-emerald-700`} /></FormField><FormField label="🏆 TikTok Rank"><input type="number" min="1" value={tiktokRank} onChange={e => setTiktokRank(e.target.value)} className={`${inputStyles} font-mono font-bold text-rose-600`} /></FormField></div>
      <div className="border-t border-slate-100 pt-5 mt-4 bg-emerald-50/50 -mx-6 px-6 py-5"><h3 className="font-display text-sm text-[#012b25] mb-3 flex items-center gap-2"><Activity className="w-5 h-5 text-emerald-600" /> อัปเดตยอดขายแมนนวล (จาก TikTok)</h3><div className="grid grid-cols-2 gap-3"><FormField label="ยอด 7 วัน (฿)"><input type="number" value={sales7d} onChange={e => setSales7d(e.target.value)} className={`${inputStyles} bg-white shadow-sm font-mono`} /></FormField><FormField label="ยอด 30 วัน (฿)"><input type="number" value={sales30d} onChange={e => setSales30d(e.target.value)} className={`${inputStyles} bg-white shadow-sm border-emerald-100 font-mono`} /></FormField></div>{product.salesData?.updatedAt && <div className="text-[10px] font-bold text-emerald-700 bg-emerald-100/50 px-3 py-2 rounded-xl inline-block mt-1 border border-emerald-100">อัปเดตล่าสุดเมื่อ: {fmtDate(product.salesData.updatedAt)} ({daysSince(product.salesData.updatedAt)} วันก่อน)</div>}</div>
      {(sales30d || tiktokRank) && product.category !== suggestion.cat && (<div className="bg-purple-50 border border-purple-100 rounded-2xl p-4 mt-4 shadow-sm"><div className="font-bold text-purple-900 mb-2 flex items-center gap-2"><Sparkles className="w-4 h-4"/> ระบบวิเคราะห์พอร์ต AI ตรวจพบการเปลี่ยนแปลง!</div><div className="text-xs font-medium text-purple-800 leading-relaxed mb-3">ปัจจุบันจัดอยู่ในหมวด <strong>{product.category}</strong> แต่ข้อมูลใหม่สอดคล้องกับ <strong>หมวด {suggestion.cat} ({suggestion.label})</strong> เนื่องจาก {suggestion.reason}</div><div className="text-[10px] font-bold text-slate-500 bg-white border border-slate-100 px-3 py-1.5 rounded-lg inline-block shadow-sm">💡 เปลี่ยนหมวดได้ที่หน้า Product Detail (กดที่ป้าย ABCD)</div></div>)}
    </Modal>
  );
}

function EditScoreModal({ product, onClose, onSave }) {
  const [sc, setSc] = useState(product?.scorecard || {});
  if (!product) return null;
  const score = calcScore(sc); const dec = DECISION_INFO[getDecision(score.pct)];
  const footer = (<div className="flex items-center justify-between gap-4"><div className="flex-1 min-w-0 bg-slate-50 border border-slate-100 p-3 rounded-2xl flex items-center justify-between"><div className="flex flex-col"><span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold mb-0.5">Argoon Score</span><span className="font-mono text-xl font-bold text-[#012b25] leading-none">{score.total}/{score.max} <span className="font-sans text-xs text-slate-400 font-normal">({score.pct}%)</span></span></div>{dec && <span className={`text-[10px] font-sans font-bold px-3 py-1.5 rounded-xl text-white shadow-sm ${dec.bg}`}>{dec.label}</span>}</div><button onClick={() => onSave(sc)} className="bg-[#bcd924] hover:bg-[#a9c41d] text-[#012b25] font-bold px-6 py-4 rounded-2xl shadow-md transition-all flex items-center gap-2"><RefreshCw className="w-4 h-4"/> ประเมินคะแนน</button></div>);
  return (
    <Modal title={`🎯 คัดกรองคะแนน: ${truncate(product.name, 20)}`} onClose={onClose} footer={footer} size="lg">
      <div className="flex items-center gap-2 text-xs font-bold text-amber-800 bg-amber-100/60 border border-amber-200 px-4 py-3 rounded-xl mb-6 w-fit shadow-sm"><Clock className="w-4 h-4" /> รอบคัดกรองครั้งล่าสุด: {daysSince(product.lastScoredAt)} วันที่แล้ว</div>
      <div className="grid grid-cols-2 gap-4 mb-4"><FormField label="Commission %"><input type="number" value={sc.commission || ''} onChange={e => setSc({ ...sc, commission: e.target.value })} className={inputStyles} /></FormField><FormField label="Creator Count"><input type="number" value={sc.creatorCount || ''} onChange={e => setSc({ ...sc, creatorCount: e.target.value })} className={inputStyles} /></FormField></div>
      <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 mb-4 shadow-sm"><div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-1.5"><TrendingUp className="w-4 h-4"/> GMV Momentum Trend</div><div className="grid grid-cols-2 gap-4"><FormField label="% Growth 7d"><input type="number" step="0.1" value={sc.gmv7dPct || ''} onChange={e => setSc({ ...sc, gmv7dPct: e.target.value })} className={`${inputStyles} bg-white font-mono`} placeholder="+12.5" /></FormField><FormField label="% Growth 30d"><input type="number" step="0.1" value={sc.gmv30dPct || ''} onChange={e => setSc({ ...sc, gmv30dPct: e.target.value })} className={`${inputStyles} bg-white font-mono`} placeholder="-3.2" /></FormField></div></div>
      <div className="grid grid-cols-3 gap-3 mt-4"><FormField label="Angles"><input type="number" value={sc.anglesCount || ''} onChange={e => setSc({ ...sc, anglesCount: e.target.value })} className={inputStyles} /></FormField><FormField label="CR %"><input type="number" value={sc.crPct || ''} onChange={e => setSc({ ...sc, crPct: e.target.value })} className={inputStyles} /></FormField><FormField label="Concentration %"><input type="number" value={sc.concentration || ''} onChange={e => setSc({ ...sc, concentration: e.target.value })} className={inputStyles} /></FormField></div>
    </Modal>
  );
}

function AddPainModal({ onClose, onSave }) {
  const [text, setText] = useState(''); const [source, setSource] = useState('personal');
  const footer = <button onClick={() => { if (text.trim()) onSave(text.trim(), source); }} className="w-full bg-[#012b25] text-[#bcd924] hover:bg-[#033c32] font-bold py-4 rounded-2xl shadow-md transition-all">บันทึกลง Pain Bank</button>;
  return (
    <Modal title="😣 เพิ่ม Pain Point ลูกค้า" onClose={onClose} footer={footer}>
      <FormField label="ระบุความเจ็บปวด (Pain Point) *"><textarea value={text} onChange={e => setText(e.target.value)} autoFocus rows={3} className={`${inputStyles} resize-none bg-white border-slate-200`} placeholder="เช่น อยากผอมแต่ไม่มีเวลาไปยิม เลิกงานก็เหนื่อยแล้ว..." /></FormField>
      <FormField label="แหล่งที่มาของข้อมูล (Data Source)"><div className="grid grid-cols-1 gap-2">{PAIN_SOURCES.map(s => (<button key={s.id} onClick={() => setSource(s.id)} className={`text-left text-xs font-bold p-3.5 rounded-xl border transition-all flex items-center gap-3 ${source === s.id ? 'bg-[#012b25] text-white border-[#012b25] shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}><div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${source === s.id ? 'border-[#bcd924]' : 'border-slate-300'}`}>{source === s.id && <div className="w-2 h-2 bg-[#bcd924] rounded-full"></div>}</div>{s.label}</button>))}</div></FormField>
    </Modal>
  );
}

function AddAngleModal({ onClose, onSave }) {
  const [text, setText] = useState('');
  const footer = <button onClick={() => { if (text.trim()) onSave(text.trim()); }} className="w-full bg-[#012b25] text-[#bcd924] hover:bg-[#033c32] font-bold py-4 rounded-2xl shadow-md transition-all">บันทึกลง Angle Bank</button>;
  return (
    <Modal title="🎯 เพิ่มมุมคอนเทนต์ (Angle)" onClose={onClose} footer={footer}>
      <FormField label="Angle / แกนเรื่องที่จะใช้เล่า *"><textarea value={text} onChange={e => setText(e.target.value)} autoFocus rows={4} className={`${inputStyles} resize-none bg-white border-slate-200`} placeholder="เช่น อย่าพึ่งซื้อของถูก ถ้าคุณยังไม่รู้สิ่งนี้..." /></FormField>
    </Modal>
  );
}

function LockProductModal({ product, onClose, onSave }) {
  const [target, setTarget] = useState(10); const [anglesToTest, setAnglesToTest] = useState([]);
  const footer = <button onClick={() => onSave(target, anglesToTest)} className="w-full bg-[#bcd924] text-[#012b25] hover:bg-[#a9c41d] font-bold py-4 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"><Lock className="w-4 h-4"/> ยืนยันการตรึงเป้าหมาย</button>;
  return (
    <Modal title={`🔒 Lock เป้าหมาย: ${truncate(product.name, 25)}`} onClose={onClose} footer={footer}>
      <p className="text-xs font-medium text-slate-500 leading-relaxed mb-5 bg-slate-50 p-4 rounded-2xl border border-slate-100 shadow-sm">ตรึงสินค้านี้ไว้ใน Focus Board ประจำเดือน เพื่อคุมสัดส่วนความถี่และทิศทางการทำคลิปให้เข้าเป้าหมาย</p>
      <FormField label="เป้าหมายจำนวนคลิปที่ต้องทำ (รายเดือน) *"><input type="number" value={target} onChange={e => setTarget(Number(e.target.value))} min={1} className={`${inputStyles} bg-white border-slate-200 font-mono text-xl text-center`} /></FormField>
      {product.angles?.length > 0 && (
        <FormField label="Angles ล็อคเป้าที่จะ Test ในเดือนนี้" hint="(เลือกคลิกได้หลายมุมพร้อมกัน)">
          <div className="space-y-2 mt-2">
            {product.angles.map(a => { const on = anglesToTest.includes(a.id); return (<button key={a.id} onClick={() => setAnglesToTest(on ? anglesToTest.filter(x => x !== a.id) : [...anglesToTest, a.id])} className={`w-full text-left text-xs font-bold p-4 rounded-2xl border transition-all flex items-start gap-3 shadow-sm ${on ? 'bg-[#012b25] text-white border-[#012b25]' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}><div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 mt-0.5 ${on ? 'bg-[#bcd924] border-[#bcd924] text-[#012b25]' : 'border-slate-300'}`}>{on && <CheckCircle2 className="w-3 h-3" />}</div><span className="leading-relaxed">{a.text}</span></button>); })}
          </div>
        </FormField>
      )}
    </Modal>
  );
}

function AddClipModal({ products, defaultProductId, onClose, onSave, showToast }) {
  const [isV, setIsV] = useState(!defaultProductId); const [productId, setProductId] = useState(defaultProductId || '');
  const [pillarId, setPillarId] = useState(''); const [painId, setPainId] = useState(''); const [angleId, setAngleId] = useState('');
  const [hook, setHook] = useState(''); const [level, setLevel] = useState('consideration');
  const [postedAt, setPostedAt] = useState(todayStr()); const [videoLink, setVideoLink] = useState(''); const [gencodeSubmitted, setGencodeSubmitted] = useState(false);
  const [commStatus, setCommStatus] = useState('pending');
  const selectedProduct = products.find(p => p.id === productId);

  const handleSave = () => { 
    if (!isV && !productId) return showToast('กรุณาเลือกสินค้าที่เชื่อมโยง', 'error'); 
    onSave({ isV, productId: isV ? null : productId, pillarId, painId, angleId, hook, level, postedAt: new Date(postedAt).toISOString(), videoLink, gencodeSubmitted, commStatus }); 
    onClose();
  };
  return (<Modal title="🎬 เพิ่มประวัติการลงคลิป" onClose={onClose} size="lg" footer={<button onClick={handleSave} className="w-full bg-[#012b25] text-[#d9eb54] hover:bg-[#033c32] font-bold py-4 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"><Plus className="w-4 h-4"/> บันทึกข้อมูลคลิปลงระบบ</button>}>
    <div className="flex bg-[#f3f6f5] rounded-2xl p-1 mb-5"><button onClick={() => setIsV(false)} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${!isV ? 'bg-white text-[#012b25] shadow-sm' : 'text-slate-500'}`}>📦 คลิปขายสินค้า</button><button onClick={() => setIsV(true)} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${isV ? 'bg-[#012b25] text-white shadow-sm' : 'text-slate-500'}`}>📚 V — Content (สาระ)</button></div>
    {!isV && (<FormField label="เลือกสินค้าจากพอร์ต *"><select value={productId} onChange={e => setProductId(e.target.value)} className={`${inputStyles} bg-white shadow-sm cursor-pointer border-slate-200`}><option value="">-- เลือกรายการสินค้า --</option>{products.map(p => <option key={p.id} value={p.id}>{ABCD_INFO[p.category]?.short || '?'} — {p.name}</option>)}</select></FormField>)}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4"><FormField label="Pillar (เสาหลัก)"><select value={pillarId} onChange={e => setPillarId(e.target.value)} className={`${inputStyles} bg-white shadow-sm border-slate-200`}><option value="">- เลือก -</option>{DEFAULT_PILLARS.map(p => <option key={p.id} value={p.id}>{p.emoji} {p.id} — {p.name}</option>)}</select></FormField><FormField label="วันที่เริ่มโพสต์"><input type="date" value={postedAt} onChange={e => setPostedAt(e.target.value)} className={`${inputStyles} bg-white shadow-sm border-slate-200 font-mono`} /></FormField></div>
    {selectedProduct && !isV && (<div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-100 pt-4 mt-1"><FormField label="เลือก Pain Point ที่ใช้"><select value={painId} onChange={e => setPainId(e.target.value)} className={`${inputStyles} bg-white border-slate-200`}><option value="">- ไม่ระบุ -</option>{selectedProduct.pains?.map(p => <option key={p.id} value={p.id}>{truncate(p.text, 50)}</option>)}</select></FormField><FormField label="เลือก Angle ที่เล่า"><select value={angleId} onChange={e => setAngleId(e.target.value)} className={`${inputStyles} bg-white border-slate-200`}><option value="">- ไม่ระบุ -</option>{selectedProduct.angles?.map(a => <option key={a.id} value={a.id}>{truncate(a.text, 50)}</option>)}</select></FormField></div>)}
    <FormField label="คำเปิดคลิป (Hook)"><textarea value={hook} onChange={e => setHook(e.target.value)} className={`${inputStyles} resize-none bg-white shadow-sm border-slate-200`} rows={2}></textarea></FormField>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
      <FormField label="ระดับเป้าหมายของคลิปนี้"><div className="grid grid-cols-3 gap-2">{CLIP_LEVELS.map(l => (<button key={l.id} onClick={() => setLevel(l.id)} className={`text-[10px] font-bold uppercase tracking-wider py-3 rounded-xl transition-all shadow-sm ${level === l.id ? l.color + ' text-white' : 'bg-white border border-slate-200 text-slate-500 hover:bg-slate-50'}`}>{l.label}</button>))}</div></FormField>
      <FormField label="สถานะเงิน (Financial Tracker)"><select value={commStatus} onChange={e => setCommStatus(e.target.value)} className={`${inputStyles} bg-white shadow-sm border-slate-200 font-bold ${commStatus === 'paid' ? 'text-emerald-700' : commStatus === 'failed' ? 'text-rose-700' : 'text-amber-600'}`}><option value="pending">⏳ รอโอน (Pending)</option><option value="paid">✅ เงินเข้าแล้ว (Paid)</option><option value="failed">❌ ยกเลิก/คืนเงิน (Failed)</option></select></FormField>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2"><FormField label="Video URL Link"><input value={videoLink} onChange={e => setVideoLink(e.target.value)} className={`${inputStyles} bg-white shadow-sm border-slate-200`} placeholder="https://tiktok.com/..." /></FormField><FormField label="Gencode Status"><label className="flex items-center gap-3 cursor-pointer p-3.5 bg-emerald-50 border border-emerald-100 rounded-2xl hover:bg-emerald-100/50 transition-all mt-6"><input type="checkbox" checked={gencodeSubmitted} onChange={e => setGencodeSubmitted(e.target.checked)} className="w-5 h-5 accent-emerald-600 rounded" /><span className="text-sm font-bold text-emerald-900">✅ อัปโค้ดเข้าคลังแล้ว</span></label></FormField></div>
  </Modal>);
}

function EditClipModal({ clip, products, onClose, onSave, onDelete }) {
  const [productId, setProductId] = useState(clip?.productId || ''); const [pillarId, setPillarId] = useState(clip?.pillarId || '');
  const [painId, setPainId] = useState(clip?.painId || ''); const [angleId, setAngleId] = useState(clip?.angleId || '');
  const [hook, setHook] = useState(clip?.hook || ''); const [level, setLevel] = useState(clip?.level || 'consideration');
  const [postedAt, setPostedAt] = useState(clip?.postedAt?.slice(0, 10) || todayStr());
  const [videoLink, setVideoLink] = useState(clip?.videoLink || ''); const [gencodeSubmitted, setGencodeSubmitted] = useState(!!clip?.gencodeSubmitted);
  const [views24h, setViews24h] = useState(clip?.views24h || ''); const [views7d, setViews7d] = useState(clip?.views7d || '');
  const [orders, setOrders] = useState(clip?.orders || ''); const [gmv, setGmv] = useState(clip?.gmv || ''); const [ctr, setCtr] = useState(clip?.ctr || ''); const [note, setNote] = useState(clip?.note || '');
  const [commStatus, setCommStatus] = useState(clip?.commStatus || 'pending');
  
  if (!clip) return null; const selectedProduct = products.find(p => p.id === productId);
  const handleSave = () => { onSave({ productId: clip.isV ? null : productId, pillarId, painId, angleId, hook, level, postedAt: new Date(postedAt).toISOString(), videoLink, gencodeSubmitted, views24h: views24h === '' ? null : Number(views24h), views7d: views7d === '' ? null : Number(views7d), orders: orders === '' ? null : Number(orders), gmv: gmv === '' ? null : Number(gmv), ctr: ctr === '' ? null : Number(ctr), note, commStatus }); onClose(); };
  
  return (<Modal title="✏️ แก้ไขข้อมูล & อัปเดตสถิติคลิป" onClose={onClose} size="xl" footer={<div className="flex gap-3"><button onClick={() => { onDelete(); onClose(); }} className="px-5 text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 hover:bg-rose-100 rounded-2xl py-4 transition-colors">🗑️ ลบถาวร</button><button onClick={handleSave} className="flex-1 bg-[#012b25] text-white hover:bg-[#033c32] font-bold py-4 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2"><Edit3 className="w-4 h-4"/> อัปเดตสถิติคลิป</button></div>}>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8"><div className="space-y-4"><h3 className="font-display text-sm text-[#012b25] border-b border-slate-100 pb-2 flex items-center gap-2"><FileText className="w-4 h-4"/> ข้อมูลตั้งต้น</h3>{!clip.isV && (<FormField label="ผูกสินค้า"><select value={productId} onChange={e => setProductId(e.target.value)} className={`${inputStyles} bg-white shadow-sm border-slate-200`}><option value="">-- เลือก --</option>{products.map(p => <option key={p.id} value={p.id}>{ABCD_INFO[p.category]?.short || '?'} — {p.name}</option>)}</select></FormField>)}<div className="grid grid-cols-2 gap-3"><FormField label="Pillar"><select value={pillarId} onChange={e => setPillarId(e.target.value)} className={`${inputStyles} bg-white border-slate-200`}><option value="">-</option>{DEFAULT_PILLARS.map(p => <option key={p.id} value={p.id}>{p.id}</option>)}</select></FormField><FormField label="วันที่ลง"><input type="date" value={postedAt} onChange={e => setPostedAt(e.target.value)} className={`${inputStyles} bg-white border-slate-200 font-mono`} /></FormField></div>{selectedProduct && !clip.isV && (<div className="grid grid-cols-2 gap-3"><FormField label="Pain"><select value={painId} onChange={e => setPainId(e.target.value)} className={`${inputStyles} bg-white border-slate-200`}><option value="">-</option>{selectedProduct.pains?.map(p => <option key={p.id} value={p.id}>{p.text.slice(0, 30)}</option>)}</select></FormField><FormField label="Angle"><select value={angleId} onChange={e => setAngleId(e.target.value)} className={`${inputStyles} bg-white border-slate-200`}><option value="">-</option>{selectedProduct.angles?.map(a => <option key={a.id} value={a.id}>{a.text.slice(0, 30)}</option>)}</select></FormField></div>)}<FormField label="Hook"><input value={hook} onChange={e => setHook(e.target.value)} className={`${inputStyles} bg-white border-slate-200 font-medium`} /></FormField><FormField label="ระดับเป้าหมายคลิป"><div className="grid grid-cols-3 gap-2">{CLIP_LEVELS.map(l => (<button key={l.id} onClick={() => setLevel(l.id)} className={`text-[10px] font-bold uppercase tracking-wider py-2.5 rounded-xl transition-all ${level === l.id ? l.color + ' text-white shadow-md' : 'bg-white border border-slate-200 text-slate-500'}`}>{l.label}</button>))}</div></FormField><div className="grid grid-cols-3 gap-3 items-end"><div className="col-span-2"><FormField label="Video Link"><input value={videoLink} onChange={e => setVideoLink(e.target.value)} className={`${inputStyles} bg-white border-slate-200`} /></FormField></div><div className="mb-4"><label className={`flex items-center justify-center gap-2 cursor-pointer py-3.5 px-2 rounded-xl transition-all border ${gencodeSubmitted ? 'bg-emerald-50 border-emerald-200' : 'bg-slate-50 border-slate-200'}`}><input type="checkbox" checked={gencodeSubmitted} onChange={e => setGencodeSubmitted(e.target.checked)} className="w-4 h-4 accent-emerald-600 rounded" /><span className={`text-[11px] font-bold ${gencodeSubmitted ? 'text-emerald-800' : 'text-slate-500'}`}>GC ✓</span></label></div></div></div><div className="space-y-4"><h3 className="font-display text-sm text-[#012b25] border-b border-slate-100 pb-2 flex items-center gap-2"><BarChart3 className="w-4 h-4"/> สถิติผลลัพธ์ (Performance)</h3><div className="bg-gradient-to-br from-blue-50/50 to-white p-5 rounded-3xl border border-blue-100 space-y-4 shadow-sm"><div className="grid grid-cols-2 gap-4"><FormField label="Views 24 ชม."><input type="number" value={views24h} onChange={e => setViews24h(e.target.value)} className={`${inputStyles} bg-white border-blue-50 font-mono`} /></FormField><FormField label="Views 7 วัน"><input type="number" value={views7d} onChange={e => setViews7d(e.target.value)} className={`${inputStyles} bg-white border-blue-50 font-mono font-bold`} /></FormField></div><div className="grid grid-cols-2 gap-4 border-t border-blue-50 pt-4"><FormField label="จำนวนออเดอร์"><input type="number" value={orders} onChange={e => setOrders(e.target.value)} className={`${inputStyles} bg-white border-emerald-50 font-mono text-emerald-700`} /></FormField><FormField label="GMV ฿ (ยอดขาย)"><input type="number" value={gmv} onChange={e => setGmv(e.target.value)} className={`${inputStyles} bg-white border-emerald-100 font-mono font-bold text-xl text-emerald-700`} /></FormField></div><div className="grid grid-cols-2 gap-4"><FormField label="CTR % (อัตราคลิก)"><input type="number" step="0.1" value={ctr} onChange={e => setCtr(e.target.value)} className={`${inputStyles} bg-white border-blue-50 font-mono`} /></FormField><FormField label="สถานะเงิน (Financial)"><select value={commStatus} onChange={e => setCommStatus(e.target.value)} className={`${inputStyles} bg-white shadow-sm border-slate-200 font-bold ${commStatus === 'paid' ? 'text-emerald-700' : commStatus === 'failed' ? 'text-rose-700' : 'text-amber-600'}`}><option value="pending">⏳ รอโอน (Pending)</option><option value="paid">✅ เงินเข้าแล้ว (Paid)</option><option value="failed">❌ ยกเลิก/คืนเงิน</option></select></FormField></div></div><FormField label="Note บันทึกความจำ"><textarea value={note} onChange={e => setNote(e.target.value)} rows={3} className={`${inputStyles} resize-none bg-white border-slate-200`} placeholder="เช่น 'คลิปนี้ปังมากเพราะใช้เสียง AI แนวสืบสวน...'" /></FormField></div></div>
  </Modal>);
}

function MakeSimilarModal({ clip, products, onClose }) {
  const product = products.find(p => p.id === clip.productId); const [copied, setCopied] = useState(false);
  const generatePrompt = () => {
    if (!product && !clip.isV) return 'ไม่พบสินค้า';
    const pillar = DEFAULT_PILLARS.find(p => p.id === clip.pillarId); const pain = product?.pains?.find(p => p.id === clip.painId); const angle = product?.angles?.find(a => a.id === clip.angleId);
    return [ `เขียน 3 สคริปต์ใหม่ "แตกมุมเล่า" จากต้นฉบับคลิป Winner สำหรับช่อง PEEM6PACK`, ``, `[ผลงานคลิปเดิม]`, `Hook เปิด: ${clip.hook || '-'}`, `ยอดเงิน GMV: ฿${fmtNum(clip.gmv)}`, ``, `[ข้อมูลสินค้าหลัก]`, product ? `ชื่อผลิตภัณฑ์: ${product.name}${product.brand ? ` (${product.brand})` : ''}` : 'หมวด Value Content', product ? `เกรดพอร์ต: หมวด ${ABCD_INFO[product.category]?.label || '-'}` : '', pillar ? `Pillar: ${pillar.id} — ${pillar.name}` : '', pain ? `ความเจ็บปวด (Pain): ${pain.text}` : '', angle ? `มุมนำเสนอ (Angle): ${angle.text}` : '', ``, `[คำสั่ง (Task)]`, `เขียนสคริปต์ใหม่ 3 แนวทาง โดยคง Pain/Angle เดิม แต่ "บิดกรอบการเล่าเรื่องใหม่":`, `1. สลับกลุ่มเป้าหมาย (Persona) ตัวอย่างเช่น โฟกัสคนอ้วน / คนเพิ่งเริ่มวิ่ง / พนักงานออฟฟิศปวดหลัง`, `2. สลับสถานการณ์ (Situation) ตัวอย่างเช่น เล่าตอนไปยิม / เดินสวนสาธารณะ / นั่งทำงานหน้าคอม`, `3. สลับรูปแบบ (Format) ตัวอย่างเช่น ถ่ายแบบ POV / เล่า Story เล่าอดีต / พูดตรงๆ หน้ากล้อง`, ``, `[เงื่อนไขสำคัญ]`, `- โทนเสียงเพื่อนคุยกับเพื่อน สนุก เป็นกันเอง ไม่สั่งสอน`, `- ห้ามก็อปปี้ประโยค Hook เดิมเด็ดขาด! ต้องคิดประโยคหยุดนิ้วใหม่ทั้งหมด`, ``, `[รูปแบบผลลัพธ์ (Output)]`, `ให้แสดงผลเป็น 3 ตาราง โดยแต่ละตารางต้องระบุ: โทน/Persona, ประโยค Hook ใหม่, บทสคริปต์แบบแบ่งช่อง วินาที/ภาพที่เห็น/คำพูด, และประโยคปิดคลิป (Call to action)` ].filter(Boolean).join('\n');
  };
  const handleCopy = async () => { try { await navigator.clipboard.writeText(generatePrompt()); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch (e) { console.error(e); } };
  
  return (<Modal title="🏆 ปั่น Prompt ทำซ้ำจาก Winner" onClose={onClose} size="lg" footer={<button onClick={handleCopy} className={`w-full font-bold py-4 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 ${copied ? 'bg-emerald-500 text-white' : 'bg-[#bcd924] text-[#0d2a23] hover:bg-[#a9c41d]'}`}>{copied ? <><CheckCircle2 className="w-5 h-5" /> คัดลอก Prompt สำเร็จ!</> : <><Copy className="w-5 h-5" /> Copy AI Prompt ไปวางได้เลย</>}</button>}><div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-5 mb-5 shadow-sm"><div className="text-[11px] font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5"><Trophy className="w-4 h-4"/> ข้อมูลต้นฉบับ Winner Clip</div><div className="text-base font-bold text-[#012b25] leading-snug">{clip.hook}</div><div className="text-xs text-amber-800 mt-2 font-mono font-bold bg-amber-100/50 w-fit px-2 py-1 rounded-lg">{product?.name || 'V Content'} · สร้างรายได้ ฿{fmtNum(clip.gmv)} · โพสต์เมื่อ {daysSince(clip.postedAt)} วันก่อน</div></div><p className="text-xs font-medium text-slate-500 mb-3 bg-slate-50 p-3 rounded-xl border border-slate-100">💡 ชุดคำสั่งนี้จะสั่งให้ AI นำแกนความสำเร็จเดิม ไปบิดเป็น <strong>3 สคริปต์ใหม่</strong> (เปลี่ยนกลุ่มคน/สถานการณ์) กด Copy แล้วนำไปวางใน Claude หรือ ChatGPT ได้เลย</p><pre className="text-[10px] bg-[#012b25] border border-[#043d34] text-emerald-100 p-5 rounded-2xl overflow-x-auto whitespace-pre-wrap font-mono leading-relaxed shadow-inner">{generatePrompt()}</pre></Modal>);
}

function BackupModal({ products, clips, onClose, showToast }) {
  const data = { products, clips, exportedAt: new Date().toISOString(), version: 2.5 };
  const json = JSON.stringify(data, null, 2); const filename = `peem6pack-backup-${todayStr()}.json`;
  const [copied, setCopied] = useState(false); const [downloaded, setDownloaded] = useState(false);
  const tryDownload = () => { try { const blob = new Blob([json], { type: 'application/json' }); const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = filename; document.body.appendChild(a); a.click(); document.body.removeChild(a); setTimeout(() => URL.revokeObjectURL(url), 100); setDownloaded(true); setTimeout(() => setDownloaded(false), 2000); showToast?.('เริ่มดาวน์โหลดไฟล์แล้ว', 'success'); } catch (e) { showToast?.('ผิดพลาด กรุณาใช้ปุ่ม Copy', 'error'); } };
  const copyAll = async () => { try { await navigator.clipboard.writeText(json); setCopied(true); setTimeout(() => setCopied(false), 2000); showToast?.('คัดลอกข้อมูลสำเร็จ!', 'success'); } catch (e) { showToast?.('คัดลอกผิดพลาด', 'error'); } };
  const sizeKB = (new Blob([json]).size / 1024).toFixed(1);
  return (<Modal title="💾 ระบบสำรองข้อมูล (Backup)" onClose={onClose} size="lg" footer={<div className="grid grid-cols-2 gap-3"><button onClick={tryDownload} className={`font-bold py-4 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 ${downloaded ? 'bg-emerald-500 text-white' : 'bg-white border border-slate-200 text-[#012b25] hover:bg-slate-50'}`}>{downloaded ? <><CheckCircle2 className="w-5 h-5" /> เสร็จสิ้น</> : <><Download className="w-5 h-5" /> Download (.json)</>}</button><button onClick={copyAll} className={`font-bold py-4 rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 ${copied ? 'bg-emerald-500 text-white' : 'bg-[#012b25] text-[#bcd924] hover:bg-[#033c32]'}`}>{copied ? <><CheckCircle2 className="w-5 h-5" /> คัดลอกแล้ว</> : <><Copy className="w-5 h-5" /> Copy Code</>}</button></div>}><div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 mb-5 grid grid-cols-3 gap-4 text-center divide-x divide-slate-200"><div><div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">📦 สินค้าในพอร์ต</div><div className="font-display text-2xl text-[#012b25]">{products.length}</div></div><div><div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">🎬 คลิปประวัติ</div><div className="font-display text-2xl text-[#012b25]">{clips.length}</div></div><div><div className="text-slate-400 text-[10px] font-bold uppercase tracking-wider mb-1">💾 ขนาดไฟล์</div><div className="font-display text-2xl text-[#012b25]">{sizeKB} <span className="text-sm text-stone-400 font-sans">KB</span></div></div></div><div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 mb-4 text-xs shadow-sm"><div className="font-bold text-emerald-900 mb-1.5 flex items-center gap-1.5"><Cloud className="w-4 h-4"/> ข้อมูลของคุณปลอดภัยบน Cloud แล้ว!</div><div className="text-emerald-800/80 font-medium leading-relaxed space-y-1.5"><p>ปัจจุบันระบบใช้สถาปัตยกรรม <strong className="text-emerald-900">Subcollections</strong> ทำให้มีการเซฟอัตโนมัติ (Auto-Sync) แบบ Real-time</p><p>คุณสามารถกด Download เก็บไฟล์ <code className="bg-white px-2 py-0.5 rounded-md border border-emerald-200 shadow-sm font-mono font-bold">{filename}</code> นี้ไว้ทุกสิ้นเดือน เพื่อเป็น Snapshot ประวัติสำรองของช่องตัวเองได้ครับ</p></div></div><details className="group"><summary className="text-xs font-bold text-[#012b25] cursor-pointer hover:text-emerald-700 transition-colors">▸ กดเพื่อดูตัวอย่างข้อมูลดิบ (JSON Preview)</summary><textarea readOnly value={json} className="w-full h-48 px-3 py-3 text-[10px] font-mono bg-slate-900 text-emerald-300 rounded-2xl mt-3 resize-none shadow-inner focus:outline-none" onClick={e => e.target.select()} /></details></Modal>);
}
// ============================================================================
// [ZONE 6] TIKTOK CSV RADAR & GHOST DETECTOR
// ============================================================================
// ============================================================================
// [ZONE 6] TIKTOK CSV RADAR & GHOST DETECTOR
// ============================================================================
function TikTokRadarModal({ products, onClose, onUpdateProduct, onQuickAdd, showToast }) {
  const [rawData, setRawData] = useState('');
  const [parsedData, setParsedData] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const [selectedMonth, setSelectedMonth] = useState(currentMonth()); 

  const monthOptions = useMemo(() => {
    const opts = []; const now = new Date();
    for (let i = 0; i < 6; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = d.toLocaleDateString('th-TH', { month: 'long', year: 'numeric' });
      opts.push({ value: val, label: i === 0 ? `${label} (เดือนปัจจุบัน)` : label });
    }
    return opts;
  }, []);

  const detectProductType = (name) => {
    const n = name.toLowerCase();
    if (/รองเท้า|shoes|sneaker/i.test(n)) return 'shoes';
    if (/เสื้อ|กางเกง|ชุด|ผ้า|กั๊ก|tank|shirt|shorts|apparel|แขนกุด/i.test(n)) return 'apparel';
    if (/โปรตีน|วิตามิน|ซิงค์|อาหารเสริม|creatine|prebiotic|เวย์|whey|gainer|d3|k2|fiber|collagen|gummies/i.test(n)) return 'supplement';
    if (/บาร์|ดัมเบล|ลูกกลิ้ง|เสื่อ|เครื่องชั่ง|กระดาน|kettlebell|roller|push up|ลู่วิ่ง|สเต็ป/i.test(n)) return 'equipment';
    return 'other';
  };

  const processData = () => {
    setIsProcessing(true);
    setTimeout(() => {
      try {
        const rows = rawData.trim().split('\n');
        if (rows.length < 2) { showToast('ข้อมูลไม่ถูกต้อง หรือมีแค่หัวตาราง', 'error'); setIsProcessing(false); return; }
        
        const delimiter = rows[0].includes('\t') ? '\t' : ',';
        const parseRow = (line) => {
          if (delimiter === '\t') return line.split('\t');
          const result = []; let current = ''; let inQuotes = false;
          for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') inQuotes = !inQuotes;
            else if (char === ',' && !inQuotes) { result.push(current); current = ''; } 
            else current += char;
          }
          result.push(current); return result;
        };

        const headers = parseRow(rows[0]).map(h => h.trim().replace(/^"|"$/g, ''));
        const idIdx = headers.indexOf('รหัสสินค้า'); const nameIdx = headers.indexOf('ชื่อสินค้า');
        const priceIdx = headers.indexOf('ราคา'); const brandIdx = headers.indexOf('ชื่อร้านค้า');
        const gmvIdx = headers.indexOf('GMV'); 
        
        // ✅ 1. ดึงคอลัมน์ ค่าคอมฯ และ โฆษณาร้านค้า อย่างแม่นยำ
        const commIdx = headers.indexOf('มาตรฐาน');
        const orderTypeIdx = headers.indexOf('ประเภทคำสั่งซื้อ');
        const shopAdsIdx = headers.indexOf('โฆษณาร้านค้า');

        if (idIdx === -1 || gmvIdx === -1) { showToast('หาคอลัมน์ "รหัสสินค้า" หรือ "GMV" ไม่เจอ', 'error'); setIsProcessing(false); return; }

        const aggregated = {};
        for (let i = 1; i < rows.length; i++) {
          if (!rows[i].trim()) continue;
          const cols = parseRow(rows[i]).map(c => c.trim().replace(/^"|"$/g, ''));
          const pId = cols[idIdx]; if (!pId) continue;
          
          let gmvVal = Number((cols[gmvIdx] || '0').replace(/,/g, '')); if (isNaN(gmvVal)) gmvVal = 0;
          let priceVal = Number((cols[priceIdx] || '0').replace(/,/g, ''));
          
          // ✅ 2. สกัดตัวเลขคอมมิชชันและโฆษณา (เช่นดึง 13 ออกจาก "12%/13%")
          const commNumbers = cols[commIdx]?.match(/\d+(\.\d+)?/g);
          const commVal = commNumbers ? Math.max(...commNumbers.map(Number)) : 0;
          
          const isAdsOrder = cols[orderTypeIdx]?.includes('โฆษณาร้านค้า');
          const adsNumbers = cols[shopAdsIdx]?.match(/\d+(\.\d+)?/g);
          const maxAdsPct = adsNumbers ? Math.max(...adsNumbers.map(Number)) : 0;

          if (!aggregated[pId]) {
            aggregated[pId] = {
              tiktokProductId: pId, name: cols[nameIdx] || 'ไม่ระบุชื่อ', brand: cols[brandIdx] || '',
              price: isNaN(priceVal) ? 0 : priceVal, commission: commVal, totalGmv: 0, orderCount: 0,
              isShopAds: false, gmvMaxPct: 0
            };
          }
          aggregated[pId].totalGmv += gmvVal;
          aggregated[pId].orderCount += 1;
          
          // ✅ 3. อัปเดตสถานะตะกร้าแดง ถ้าเจอบรรทัดไหนเคยยิงแอด ให้จำไว้ว่าคือตะกร้าแดงเสมอ
          if (isAdsOrder) aggregated[pId].isShopAds = true;
          if (maxAdsPct > aggregated[pId].gmvMaxPct) aggregated[pId].gmvMaxPct = maxAdsPct;
          if (commVal > aggregated[pId].commission) aggregated[pId].commission = commVal; // เก็บค่าคอมสูงสุดไว้
        }

        const matched = []; const ghosts = [];
        Object.values(aggregated).forEach(item => {
          const existing = products.find(p => p.tiktokProductId === item.tiktokProductId || p.id === item.tiktokProductId);
          if (existing) matched.push({ ...item, product: existing });
          else ghosts.push(item);
        });
        
        matched.sort((a,b) => b.totalGmv - a.totalGmv); ghosts.sort((a,b) => b.totalGmv - a.totalGmv);
        setParsedData({ matched, ghosts });
      } catch (e) { showToast('เกิดข้อผิดพลาดในการอ่านข้อมูล', 'error'); }
      setIsProcessing(false);
    }, 500);
  };

  const handleSyncMatched = () => {
    parsedData.matched.forEach(item => {
      const p = item.product;
      const salesData = p.salesData || {};
      
      const monthlyRecord = salesData.monthly || {};
      monthlyRecord[selectedMonth] = (monthlyRecord[selectedMonth] || 0) + item.totalGmv;
      const isCurrentMonth = selectedMonth === currentMonth();
      const new30d = isCurrentMonth ? (Number(salesData.last30d) || 0) + item.totalGmv : salesData.last30d;

      const newIsShopAds = p.isShopAds || item.isShopAds;
      const newGmvMax = Math.max(Number(p.gmvMaxPct) || 0, item.gmvMaxPct);
      const newComm = Math.max(Number(p.scorecard?.commission) || 0, item.commission);
      
      const newScorecard = { ...p.scorecard, commission: newComm > 0 ? String(newComm) : (p.scorecard?.commission || '') };
      const s = calcScore(newScorecard);

      onUpdateProduct(p.id, { 
        isShopAds: newIsShopAds,
        gmvMaxPct: newGmvMax > 0 ? String(newGmvMax) : (p.gmvMaxPct || ''),
        scorecard: newScorecard,
        score: s.total, maxScore: s.max, scorePct: s.pct, decision: getDecision(s.pct),
        salesData: { ...salesData, last30d: new30d, monthly: monthlyRecord, updatedAt: new Date().toISOString() }
        // ❌ ลบอัปเดตเวลา lastScoredAt ออก เพื่อให้สินค้ารักษาสถานะ PENDING/Stale เอาไว้
      });
    });
    showToast(`ซิงก์ยอดขายและอัปเดตค่าคอม ${parsedData.matched.length} รายการ เรียบร้อย!`, 'success');
    onClose();
  };

  const handleQuickAdd = (ghost) => {
    const autoType = detectProductType(ghost.name); 
    const monthlyRecord = { [selectedMonth]: ghost.totalGmv };
    const isCurrentMonth = selectedMonth === currentMonth();

    onQuickAdd({
      name: ghost.name, brand: ghost.brand, tiktokProductId: ghost.tiktokProductId, price: ghost.price,
      isShopAds: ghost.isShopAds, 
      gmvMaxPct: ghost.gmvMaxPct > 0 ? String(ghost.gmvMaxPct) : '', 
      productType: autoType, 
      scorecard: { commission: ghost.commission > 0 ? String(ghost.commission) : '' },
      score: 0, maxScore: 18, scorePct: 0, decision: 'WAIT', // 👈 ให้คะแนนเป็นศูนย์เพื่อรอประเมิน
      salesData: { last30d: isCurrentMonth ? ghost.totalGmv : 0, monthly: monthlyRecord, last7d: 0, updatedAt: new Date().toISOString() },
      category: ghost.totalGmv >= 10000 ? 'B' : 'C',
      lastScoredAt: null // 👈 ตั้งเป็น null เพื่อให้เด้งเข้ากล่องสีส้ม PENDING ทันที!
    });
    setParsedData(prev => ({ ...prev, ghosts: prev.ghosts.filter(g => g.tiktokProductId !== ghost.tiktokProductId) }));
  };

  const footer = parsedData ? (
    <div className="flex gap-3">
      <button onClick={() => setParsedData(null)} className="px-5 py-3.5 bg-slate-100 text-slate-700 font-bold rounded-2xl transition-all hover:bg-slate-200">สแกนไฟล์ใหม่</button>
      <button onClick={handleSyncMatched} disabled={parsedData.matched.length === 0} className="flex-1 bg-[#012b25] text-[#d9eb54] hover:bg-[#033c32] font-bold py-3.5 rounded-2xl shadow-md disabled:opacity-50 flex items-center justify-center gap-2 transition-all"><RefreshCw className="w-5 h-5"/> อัปเดตสมุดบัญชี + ค่าคอมเข้าคลัง ({parsedData.matched.length} รายการ)</button>
    </div>
  ) : (
    <button onClick={processData} disabled={!rawData} className="w-full bg-[#012b25] text-[#d9eb54] hover:bg-[#033c32] font-bold py-4 rounded-2xl shadow-md flex items-center justify-center gap-2 disabled:opacity-50 transition-all">{isProcessing ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5"/>} วิเคราะห์และสแกนข้อมูล</button>
  );

  return (
    <Modal title="📡 สแกนเรดาร์ยอดขาย TikTok (CSV/Excel)" onClose={onClose} size="xl" footer={footer}>
      {!parsedData ? (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-emerald-50 border border-emerald-100 p-4 rounded-2xl shadow-sm">
            <div>
              <div className="text-sm font-bold text-[#012b25] mb-1">เลือกเดือนของข้อมูล (Time Bucket)</div>
              <div className="text-[10px] text-emerald-700">เพื่อป้องกันยอดตีกัน ระบบจะแยกเก็บประวัติยอดขายตามเดือนที่คุณเลือก</div>
            </div>
            <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} className="font-bold text-[#012b25] bg-white border border-emerald-200 px-4 py-2 rounded-xl focus:outline-none cursor-pointer">
              {monthOptions.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>
          <div className="bg-sky-50 border border-sky-100 p-4 rounded-2xl text-xs text-sky-800 leading-relaxed shadow-sm">
            <strong>วิธีใช้งาน:</strong> เปิดหน้าคำสั่งซื้อในแอป TikTok Affiliate &gt; กด Export ข้อมูล &gt; เปิดไฟล์ Excel แล้ว <strong>Copy ข้อมูลตารางมาวาง (Paste) ในช่องด้านล่างนี้ได้เลย</strong> (ระบบจะดูดค่าคอม และ %โฆษณาร้านค้า ให้อัตโนมัติ)
          </div>
          <textarea value={rawData} onChange={(e) => setRawData(e.target.value)} className="w-full h-56 bg-slate-50 border border-slate-200 rounded-2xl p-4 text-[10px] font-mono whitespace-pre focus:outline-none focus:border-[#012b25]/30 focus:ring-2 focus:ring-[#012b25]/10 resize-none shadow-inner" placeholder="คลิกขวา -> Paste ข้อมูลดิบจาก Excel ตรงนี้..."></textarea>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl flex items-center justify-between">
            <div className="text-xs font-bold text-slate-700">กำลังอัปเดตสมุดบัญชียอดขายของเดือน: <span className="text-[#012b25] bg-[#d9eb54] px-2 py-0.5 rounded-md ml-1">{selectedMonth}</span></div>
            {selectedMonth !== currentMonth() && <div className="text-[10px] font-bold text-amber-700 bg-amber-100 border border-amber-200 px-2 py-0.5 rounded-md">⚠️ บันทึกย้อนหลัง (ไม่กระทบยอด 30 วันปัจจุบัน)</div>}
          </div>
          <div>
            <h3 className="font-display text-base text-[#012b25] mb-3 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-emerald-500" /> 🟢 ตรงกันกับในคลัง (Auto-Sync) - {parsedData.matched.length} รายการ</h3>
            <div className="bg-emerald-50/50 border border-emerald-100 rounded-2xl overflow-hidden shadow-sm">
              <div className="max-h-[200px] overflow-y-auto">
                <table className="w-full text-left text-xs"><thead className="bg-emerald-100/50 sticky top-0"><tr className="font-bold text-emerald-800"><th className="p-3">สินค้าในคลังของเรา</th><th className="p-3 text-right">จำนวนออเดอร์</th><th className="p-3 text-right">+ GMV ({selectedMonth})</th></tr></thead><tbody className="divide-y divide-emerald-50">
                  {parsedData.matched.length === 0 ? <tr><td colSpan="3" className="p-6 text-center text-slate-400 font-medium">ไม่มีข้อมูลยอดขายที่ตรงกับสินค้าในระบบ</td></tr> : parsedData.matched.map((m, i) => (
                    <tr key={i} className="hover:bg-emerald-50/80"><td className="p-3"><div className="font-semibold text-[#012b25] line-clamp-1">{m.product.name}</div><div className="text-[10px] text-slate-500 font-mono mt-1 flex items-center gap-2"><span>ID: {m.tiktokProductId}</span>{m.commission > 0 && <span className="bg-violet-100 text-violet-700 px-1.5 rounded font-bold font-sans">คอม {m.commission}%</span>}{m.isShopAds && <span className="bg-rose-100 text-rose-700 px-1.5 rounded font-bold font-sans">🛒 Ads {m.gmvMaxPct ? `${m.gmvMaxPct}%` : ''}</span>}</div></td><td className="p-3 text-right font-mono text-slate-600">{m.orderCount}</td><td className="p-3 text-right font-mono font-bold text-emerald-700">+฿{fmtNum(m.totalGmv)}</td></tr>
                  ))}
                </tbody></table>
              </div>
            </div>
            <p className="text-[10px] font-bold text-emerald-700 mt-2 ml-2 flex items-center gap-1"><Sparkles className="w-3 h-3 text-emerald-500"/> ระบบจะทำการอัปเดต "ค่าคอมมิชชัน %" และ "คะแนน Argoon Score" ให้ใหม่โดยอัตโนมัติ!</p>
          </div>
          <div>
            <h3 className="font-display text-base text-rose-800 mb-3 flex items-center gap-2"><AlertTriangle className="w-5 h-5 text-rose-500" /> 👻 สินค้าตกสำรวจ (Ghost Items) - {parsedData.ghosts.length} รายการ</h3>
            <div className="bg-rose-50/50 border border-rose-100 rounded-2xl overflow-hidden shadow-sm">
              <div className="max-h-[220px] overflow-y-auto">
                <table className="w-full text-left text-xs"><thead className="bg-rose-100/50 sticky top-0"><tr className="font-bold text-rose-800"><th className="p-3">สินค้าที่ AI เจอในไฟล์</th><th className="p-3 text-right">ออเดอร์</th><th className="p-3 text-right">GMV รวม</th><th className="p-3 text-right">ดำเนินการ</th></tr></thead><tbody className="divide-y divide-rose-50">
                  {parsedData.ghosts.length === 0 ? <tr><td colSpan="4" className="p-6 text-center text-slate-400 font-medium">สุดยอด! ไม่มีสินค้าไหนรอดสายตาคุณไปได้เลย</td></tr> : parsedData.ghosts.map((g, i) => (
                    <tr key={i} className="hover:bg-rose-50/80"><td className="p-3"><div className="font-semibold text-rose-900 line-clamp-1">{g.name}</div><div className="text-[10px] text-rose-600/70 mt-1 flex items-center gap-1.5 flex-wrap"><span className="bg-white px-1.5 py-0.5 border border-rose-200 rounded-md font-bold">{detectProductType(g.name).toUpperCase()}</span><span>{g.brand}</span><span className="font-mono font-bold text-[#012b25] bg-emerald-100 px-1 border border-emerald-200 rounded">คอม {g.commission}%</span>{g.isShopAds && <span className="bg-rose-100 text-rose-700 px-1.5 rounded font-bold font-sans">🛒 Ads {g.gmvMaxPct ? `${g.gmvMaxPct}%` : ''}</span>}</div></td><td className="p-3 text-right font-mono text-rose-800">{g.orderCount}</td><td className="p-3 text-right font-mono font-bold text-rose-700">฿{fmtNum(g.totalGmv)}</td><td className="p-3 text-right"><button onClick={() => handleQuickAdd(g)} className="bg-[#012b25] text-[#d9eb54] px-4 py-2 rounded-xl font-bold hover:bg-[#033c32] shadow-sm transition-all">+ ดึงเข้าพอร์ต</button></td></tr>
                  ))}
                </tbody></table>
              </div>
            </div>
            <p className="text-[10px] font-bold text-slate-500 mt-3 ml-2 flex items-center gap-1"><Sparkles className="w-3 h-3 text-amber-500"/> ถ้าระบุว่าเป็นข้อมูลของเดือนอดีต ยอดขายจะไปบันทึกไว้ในสมุดบัญชี (History) แต่จะไม่นำมาแสดงหลอกตาในช่อง 30 วันปัจจุบันครับ</p>
          </div>
        </div>
      )}
    </Modal>
  );
}
function SettingsModal({ appSettings, onUpdateSettings, onClose, onExport, onClearAll }) {
  const [notice, setNotice] = useState(appSettings.noticeBoard || '');
  return (<Modal title="⚙️ แผงควบคุมระบบ (Settings)" onClose={onClose}><div className="space-y-4"><div className="bg-slate-50 border border-slate-100 p-5 rounded-3xl mb-4"><FormField label="กระดานกลยุทธ์ประจำสัปดาห์ (Notice Board)"><textarea value={notice} onChange={e=>setNotice(e.target.value)} rows={3} className={`${inputStyles} bg-white border-slate-200 resize-none`} placeholder="ประกาศเป้าหมายให้ตัวเอง หรือปักหมุดข่าวสารของช่อง..." /></FormField><button onClick={() => { onUpdateSettings({ noticeBoard: notice }); onClose(); }} className="w-full bg-[#012b25] hover:bg-[#033c32] text-[#d9eb54] transition-all font-bold py-3.5 rounded-xl shadow-md flex justify-center items-center gap-2"><Lightbulb className="w-4 h-4" /> ปักหมุดกลยุทธ์ลงบอร์ด</button></div><button onClick={onExport} className="w-full p-4 bg-white border border-slate-100 hover:border-[#012b25]/30 hover:shadow-md rounded-2xl text-left transition-all group flex items-center gap-4"><div className="p-3 bg-slate-50 group-hover:bg-[#bcd924] rounded-xl transition-colors"><Download className="w-5 h-5 text-stone-400 group-hover:text-[#012b25]" /></div><div><div className="font-bold text-[#012b25] text-sm mb-0.5">ระบบสำรองข้อมูล (Export JSON)</div><div className="text-[10px] text-stone-500 font-medium">โหลดไฟล์ Snapshot ดิบไว้เก็บสำรองในคอมพิวเตอร์</div></div></button><div className="border-t border-slate-100 pt-4"><button onClick={onClearAll} className="w-full p-4 bg-rose-50 hover:bg-rose-100 border border-rose-100 text-rose-700 rounded-2xl text-left transition-all"><div className="font-bold text-sm flex items-center gap-2"><Trash2 className="w-4 h-4"/> ล้างทำลายฐานข้อมูลทั้งหมด (Factory Reset)</div><div className="text-xs mt-1 text-rose-600/80">⚠️ ลบข้อมูลทิ้งทั้งบนเครื่องและบน Cloud แบบกู้คืนไม่ได้</div></button></div><div className="bg-slate-50 rounded-2xl p-4 mt-4 text-[11px] text-slate-500 space-y-2 leading-relaxed border border-slate-100"><div className="font-bold text-slate-700 uppercase tracking-wider mb-2">System Parameters</div><div className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#bcd924] mt-1.5 flex-shrink-0"></div><p><strong>Version:</strong> PEEM6PACK Command Center v2.6 (Cloud Firestore Subcollections)</p></div><div className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#bcd924] mt-1.5 flex-shrink-0"></div><p><strong>Argoon Gate:</strong> เต็ม {ARGOON_MAX} คะแนน | ผ่านเกณฑ์ (PASS) ที่ ≥{ARGOON_PASS} | เฝ้าระวัง (WAIT) ที่ {ARGOON_WATCH}-{ARGOON_PASS - 1} | ตัดทิ้ง (CUT) หากต่ำกว่า {ARGOON_WATCH}</p></div><div className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#bcd924] mt-1.5 flex-shrink-0"></div><p><strong>Decision AI:</strong> ประทับตรา PICK เมื่อ ≥{PICK_THRESHOLD}% | ตรา WAIT เมื่อ ≥{WAIT_THRESHOLD}% | ตรา DROP ตัดทิ้งเมื่อต่ำกว่า {WAIT_THRESHOLD}%</p></div><div className="flex items-start gap-2"><div className="w-1.5 h-1.5 rounded-full bg-[#bcd924] mt-1.5 flex-shrink-0"></div><p><strong>SaaS Portfolio:</strong> A (Hero) {PORTFOLIO_TARGET.A}% / B (Test) {PORTFOLIO_TARGET.B}% / C (Volume) {PORTFOLIO_TARGET.C}% / D (Premium) {PORTFOLIO_TARGET.D}%</p></div></div></div></Modal>);
}
