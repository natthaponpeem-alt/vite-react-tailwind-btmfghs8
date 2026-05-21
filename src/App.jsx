import React, { useState, useEffect, useMemo } from 'react';
import { Home, Package, Lock, BarChart3, Settings, Plus, X, Copy, Download, Upload, Trash2, Edit3, ChevronRight, ChevronLeft, AlertCircle, CheckCircle2, Clock, Zap, Target, Wand2, FileText, Sparkles, Trophy, Search, RefreshCw, DollarSign, Activity, LayoutGrid, List, ArrowUpDown, ExternalLink, Database, Flame, TrendingUp, TrendingDown, AlertTriangle, Lightbulb, Repeat, Cloud, CloudOff } from 'lucide-react';

// --- FIREBASE IMPORTS ---
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';

// --- 1. FIREBASE CONFIGURATION (Your Keys) ---
const firebaseConfig = {
  apiKey: "AIzaSyDqum6bGwLqjInO04PCxuDV8pEl5UbwphI",
  authDomain: "peem6pack-command.firebaseapp.com",
  projectId: "peem6pack-command",
  storageBucket: "peem6pack-command.firebasestorage.app",
  messagingSenderId: "843579566868",
  appId: "1:843579566868:web:1daa7700dab2739b757001"
};

// --- INITIALIZE FIREBASE ---
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const APP_ID = 'peem6pack-command-v1';

// --- 2. INITIAL SEED DATA (ใช้แค่ตอนสร้าง Database ครั้งแรก) ---
const INITIAL_DATA = {
  "products": [
    { "id": "mp2m5sov4vvhu", "name": "รองเท้ากีฬาซีรีส์ oxyflow แบรนด์ Steapex", "brand": "Steapex", "category": "A", "pillars": ["P1", "P2", "P4", "P3", "P5"], "scorecard": { "commission": "10", "creatorCount": "591", "anglesCount": "5", "crPct": "23.27", "concentration": "38.7" }, "score": 11, "maxScore": 15, "scorePct": 73, "decision": "WAIT", "pains": [], "angles": [{ "id": "mp3j9zt1bjwc8", "text": "k", "createdAt": "2026-05-13T04:02:26.053Z" }], "lastScoredAt": "2026-05-12T12:35:22.879Z", "createdAt": "2026-05-12T12:35:22.879Z", "locked": { "month": "2026-05", "targetClips": 10, "anglesToTest": [], "lockedAt": "2026-05-12T17:39:26.616Z" }, "productType": "shoes", "tiktokLink": "https://shop.tiktok.com/view/product/1731265375226989557?region=TH&locale=th-TH&source=agency", "kalodataLink": "https://www.kalodata.com/product/detail?id=1731265375226989557&language=th-TH&currency=THB&region=TH&dateRange=%5B%222026-05-11%22%2C%222026-05-11%22%5D&module=%22list%22", "gmvMaxPct": "10" },
    { "id": "mp2mdeiuwv5gj", "name": "เชือกต่อสู้ไร้สาย, อุปกรณ์ออกกำลังกายแบบพกพา", "brand": "Pelpo.TH", "category": "B", "pillars": ["P3", "P2", "P5", "P4", "P1"], "scorecard": { "commission": "13", "creatorCount": "272", "anglesCount": "5", "crPct": "58.97", "concentration": "37.2" }, "score": 12, "maxScore": 15, "scorePct": 80, "decision": "PICK", "pains": [{ "id": "mp2mrm4uytwrg", "text": "อยากเบิร์น / อยากลดพุง แต่ไม่อยากวิ่งเพราะกลัวเจ็บเข่า", "source": "ai", "createdAt": "2026-05-12T12:52:20.814Z" }, { "id": "mp2mt7ov9ow77", "text": "วิ่งแล้วเจ็บเข่า", "source": "tiktok", "createdAt": "2026-05-12T12:53:35.407Z" }, { "id": "mp2mtlryr0zt4", "text": "ไม่มีเวลาไปวิ่ง / ไปยิม", "source": "personal", "createdAt": "2026-05-12T12:53:53.662Z" }, { "id": "mp2mu0p2obqrf", "text": "อยากลดพุงแต่ไม่รู้เริ่มจากท่าอะไร", "source": "tiktok", "createdAt": "2026-05-12T12:54:12.998Z" }, { "id": "mp2mu5eran1yy", "text": "อยากคาร์ดิโอแบบแรงกระแทกน้อยกว่า", "source": "personal", "createdAt": "2026-05-12T12:54:19.107Z" }], "angles": [{ "id": "mp2muje4sy8lb", "text": "Battlerope ไร้สาย = ทางเลือกคาร์ดิโอที่บ้าน สำหรับคนไม่อยากวิ่งหรือกลัวเจ็บเข่า", "createdAt": "2026-05-12T12:54:37.228Z" }], "lastScoredAt": "2026-05-12T12:41:17.766Z", "createdAt": "2026-05-12T12:41:17.766Z", "locked": null, "productType": "equipment", "tiktokLink": "https://shop.tiktok.com/view/product/1733115674372768769?region=TH&locale=th-TH&source=agency", "kalodataLink": "https://www.kalodata.com/product/detail?id=1733115674372768769&language=th-TH&currency=THB&region=TH", "gmvMaxPct": "8" },
    { "id": "mp3gkuo7rkypx", "name": "MakeMoves Creatine 300 g. ครีเอทีน ตราเมคมูฟส์", "brand": " MakeMoves Store", "category": "B", "productType": "supplement", "tiktokLink": "https://shop.tiktok.com/view/product/1731231273253964345?region=TH&locale=th-TH&source=agency", "kalodataLink": "https://www.kalodata.com/product/detail?id=1731231273253964345&language=th-TH&currency=THB&region=TH&dateRange=%5B%222026-04-12%22%2C%222026-05-11%22%5D&module=%22list%22", "gmvMaxPct": "5", "pillars": ["P1", "P3", "P5", "P2", "P4"], "scorecard": { "commission": "20", "gmv7dPct": "-11.96", "gmv30dPct": "73.45", "creatorCount": "242", "anglesCount": "5", "crPct": "52", "concentration": "25" }, "score": 17, "maxScore": 18, "scorePct": 94, "decision": "PICK", "pains": [{ "id": "mp4bqos463iw8", "text": "คนที่ \"กำลังออกกำลังกายแต่ผลไม่เต็มที่\"", "source": "ai", "createdAt": "2026-05-13T17:19:14.164Z" }, { "id": "mp4bqw314myxd", "text": "คนที่ \"เคยพยายามแล้วล้มเหลวเพราะฟื้นช้า\"", "source": "ai", "createdAt": "2026-05-13T17:19:23.629Z" }, { "id": "mp4bv6gsrehwe", "text": "คนที่ \"อยากลองแต่ยังไม่กล้าซื้อ\"", "source": "personal", "createdAt": "2026-05-13T17:22:43.708Z" }], "angles": [], "lastScoredAt": "2026-05-13T02:46:53.767Z", "createdAt": "2026-05-13T02:46:53.767Z", "locked": { "month": "2026-05", "targetClips": 15, "anglesToTest": ["mp3hc6nch7ivv", "mp3hc9w1mw401", "mp3hcdeuq3ucb", "mp3hchif5asvj", "mp3hcmb7ok6tz", "mp3hcrb10elqq", "mp3hcxfjp161o", "mp3hdrass5gi0"], "lockedAt": "2026-05-13T04:01:40.812Z" } },
    { "id": "mp4vp2bdglwmw", "name": "(เน็ตไอดอลแนะนำ)บาร์โหนติดประตู บาร์โหนดึงข้อ", "brand": "สวยมาก/cosplay", "category": "C", "productType": "equipment", "tiktokLink": "https://shop.tiktok.com/view/product/1729553263078771393?region=TH&locale=th-TH&source=agency", "kalodataLink": "https://www.kalodata.com/product/detail?id=1729553263078771393&language=th-TH&currency=THB&region=TH&dateRange=%5B%222026-04-13%22%2C%222026-05-12%22%5D&cateValue=%5B%5D", "gmvMaxPct": "5", "pillars": ["P1", "P3", "P5", "P2", "P4"], "scorecard": { "commission": "6", "gmv7dPct": "13", "gmv30dPct": "9", "creatorCount": "167", "anglesCount": "5", "crPct": "52", "concentration": "49" }, "score": 14, "maxScore": 18, "scorePct": 78, "decision": "WAIT", "pains": [], "angles": [], "lastScoredAt": "2026-05-14T02:37:50.713Z", "createdAt": "2026-05-14T02:37:50.713Z", "locked": null },
    { "id": "mp4wcyuma953o", "name": "ส่งจากไทย ที่จับบาร์เบลล็อค ดัมเบล ปรับขนาด พลาสติกทนทาน ใช้งานง่าย", "brand": " MaiSabai Active Shop", "category": "C", "productType": "equipment", "tiktokLink": "https://shop.tiktok.com/view/product/1732379808514541486?region=TH&locale=th-TH&source=agency", "kalodataLink": "https://www.kalodata.com/product/detail?id=1732379808514541486&language=th-TH&currency=THB&region=TH&dateRange=%5B%222026-04-13%22%2C%222026-05-12%22%5D&cateValue=%5B%5D", "gmvMaxPct": "4", "pillars": ["P4"], "scorecard": { "commission": "8", "gmv7dPct": "-42", "gmv30dPct": "25.8", "creatorCount": "43", "anglesCount": "7", "crPct": "86.05", "concentration": "81" }, "score": 12, "maxScore": 18, "scorePct": 67, "decision": "WAIT", "pains": [], "angles": [], "lastScoredAt": "2026-05-14T02:56:25.966Z", "createdAt": "2026-05-14T02:56:25.966Z", "locked": null },
    { "id": "mp4x0lwk4bkkz", "name": "Omega 3 Triple EPA 540 DHA 360 (CEO Factory x 3C)", "brand": " CEO FACTORYTHAILAND", "category": "B", "productType": "supplement", "tiktokLink": "https://shop.tiktok.com/view/product/1730678737243114180?region=TH&locale=th-TH&source=agency", "kalodataLink": "https://www.kalodata.com/product/detail?id=1730678737243114180&language=th-TH&currency=THB&region=TH&dateRange=%5B%222026-04-13%22%2C%222026-05-12%22%5D&module=%22list%22", "gmvMaxPct": "", "pillars": ["P1", "P3", "P5", "P4", "P2"], "scorecard": { "commission": "10", "gmv7dPct": "-45", "gmv30dPct": "40", "creatorCount": "353", "anglesCount": "5", "crPct": "50.99", "concentration": "53.2" }, "score": 14, "maxScore": 18, "scorePct": 78, "decision": "WAIT", "pains": [{ "id": "mp53egwgrgmbb", "text": "กิน Omega-3 มานาน แต่ไม่รู้สึกต่าง / อาจซื้อผิดสเปก", "source": "personal", "createdAt": "2026-05-14T06:13:33.328Z" }], "angles": [{ "id": "mp53emxsp4rwt", "text": "อย่าดูแค่เลขหน้ากล่อง ให้ดู EPA + DHA หลังกล่อง", "createdAt": "2026-05-14T06:13:41.152Z" }], "lastScoredAt": "2026-05-14T03:14:48.932Z", "createdAt": "2026-05-14T03:14:48.932Z", "locked": { "month": "2026-05", "targetClips": 10, "anglesToTest": [], "lockedAt": "2026-05-16T06:14:34.440Z" } },
    { "id": "mp7yfn0havg96", "name": "GQ Everyday Running & Training - Velo Tank & Votex-T", "brand": " GQ Apparel", "category": "A", "productType": "apparel", "tiktokLink": "https://shop.tiktok.com/view/product/1732770964938065260?region=TH&locale=th-TH&source=agency", "kalodataLink": "https://shop.tiktok.com/view/product/1732770964938065260?region=TH&locale=th-TH&source=agency", "gmvMaxPct": "8", "pillars": ["P5", "P4", "P2", "P3"], "scorecard": { "commission": "8", "gmv7dPct": "-35.84", "gmv30dPct": "57.55", "creatorCount": "194", "anglesCount": "5", "crPct": "68.93", "concentration": "49.4" }, "score": 13, "maxScore": 18, "scorePct": 72, "decision": "WAIT", "pains": [], "angles": [], "lastScoredAt": "2026-05-16T06:17:48.353Z", "createdAt": "2026-05-16T06:17:48.353Z", "locked": { "month": "2026-05", "targetClips": 10, "anglesToTest": [], "lockedAt": "2026-05-16T06:18:10.726Z" } },
    { "id": "mp7yjhj5ch84n", "name": "เสื้อยืด Relaxtee แห้งเร็ว / แห้งทันที / ระบายอากาศได้ดี / ป้องกันรังสียูวี", "brand": " RelaxTee.TH", "category": "A", "productType": "apparel", "tiktokLink": "https://shop.tiktok.com/view/product/1731305940881803030?region=TH&locale=th-TH&source=agency", "kalodataLink": "https://www.kalodata.com/product/detail?id=1731305940881803030&language=th-TH&currency=THB&region=TH&dateRange=%5B%222026-04-16%22%2C%222026-05-15%22%5D&module=%22list%22", "gmvMaxPct": "5", "pillars": ["P1", "P3", "P5", "P4", "P2"], "scorecard": { "commission": "11", "gmv7dPct": "36.77", "gmv30dPct": "0.7", "creatorCount": "224", "anglesCount": "5", "crPct": "47", "concentration": "62" }, "score": 14, "maxScore": 18, "scorePct": 78, "decision": "WAIT", "pains": [], "angles": [], "lastScoredAt": "2026-05-16T06:20:47.873Z", "createdAt": "2026-05-16T06:20:47.873Z", "locked": null },
    { "id": "mp7yopnzeihab", "name": "ALLWELL เครื่องชั่งน้ำหนัก เชื่อมต่อ APP ไทย วัดไขมันและดัชนีมวลกาย", "brand": " ALLWELL", "category": "D", "productType": "other", "tiktokLink": "https://shop.tiktok.com/view/product/1729733388837095691?region=TH&locale=th-TH&source=agency", "kalodataLink": "https://www.kalodata.com/product/detail?id=1729733388837095691&language=th-TH&currency=THB&region=TH&dateRange=%5B%222026-05-09%22%2C%222026-05-15%22%5D", "gmvMaxPct": "10", "pillars": ["P4", "P2", "P3", "P5", "P1"], "scorecard": { "commission": "20", "gmv7dPct": "-24", "gmv30dPct": "56.96", "creatorCount": "76", "anglesCount": "5", "crPct": "30.26", "concentration": "59.7" }, "score": 16, "maxScore": 18, "scorePct": 89, "decision": "PICK", "pains": [], "angles": [], "lastScoredAt": "2026-05-16T06:24:51.695Z", "createdAt": "2026-05-16T06:24:51.695Z", "locked": { "month": "2026-05", "targetClips": 4, "anglesToTest": [], "lockedAt": "2026-05-16T06:25:08.599Z" } },
    { "id": "mp7yw7bx7vemg", "name": "LAB FIBER PREBIOTICS แลบไลบรารี พรีไบโอติก ผัก 5 สี มีไฟโตนิวเทรียนส์ 5 ชนิด", "brand": " Kongnaphat", "category": "A", "productType": "supplement", "tiktokLink": "https://shop.tiktok.com/view/product/1731713186607040249?region=TH&locale=th-TH&source=agency", "kalodataLink": "https://www.kalodata.com/product/detail?id=1731713186607040249&language=th-TH&currency=THB&region=TH&dateRange=%5B%222026-04-16%22%2C%222026-05-15%22%5D&module=%22list%22", "gmvMaxPct": "4", "pillars": [], "scorecard": { "commission": "8", "gmv7dPct": "-0.86", "gmv30dPct": "19.74", "creatorCount": "547", "anglesCount": "5", "crPct": "58.14", "concentration": "42.7" }, "score": 12, "maxScore": 18, "scorePct": 67, "decision": "WAIT", "pains": [], "angles": [], "lastScoredAt": "2026-05-16T06:30:41.181Z", "createdAt": "2026-05-16T06:30:41.181Z", "locked": { "month": "2026-05", "targetClips": 5, "anglesToTest": [], "lockedAt": "2026-05-16T06:30:52.915Z" } },
    { "id": "mp7yzgm35snd0", "name": "[ แพ็คเกจใหม่แบบซอง ] สูตรใหม่ MEDITA ZINC PLUS Vitamin C+ Collagen เมดิต้า ซิงค์ พลัส 30 แคปซูล", "brand": " medita thailand", "category": "B", "productType": "supplement", "tiktokLink": "", "kalodataLink": "", "gmvMaxPct": "", "pillars": [], "scorecard": { "commission": "35", "gmv7dPct": "3.53", "gmv30dPct": "63.28", "creatorCount": "473", "anglesCount": "5", "crPct": "26.55", "concentration": "62.8" }, "score": 16, "maxScore": 18, "scorePct": 89, "decision": "PICK", "pains": [], "angles": [], "lastScoredAt": "2026-05-16T06:33:13.179Z", "createdAt": "2026-05-16T06:33:13.179Z", "locked": { "month": "2026-05", "targetClips": 10, "anglesToTest": [], "lockedAt": "2026-05-16T06:33:56.720Z" } },
    { "id": "mp7z4sa0b16hh", "name": "BAAM MICRONIZED CREATINE MONOHYDRATE MAX ATP 5000 (BOTTLE 300G)", "brand": " ฟิตเวย์", "category": "B", "productType": "supplement", "tiktokLink": "https://shop.tiktok.com/view/product/1730328826469059008?region=TH&locale=th-TH&source=agency", "kalodataLink": "https://www.kalodata.com/product/detail?id=1730328826469059008&language=th-TH&currency=THB&region=TH&dateRange=%5B%222026-04-16%22%2C%222026-05-15%22%5D&module=%22list%22", "gmvMaxPct": "", "pillars": ["P1", "P3", "P5", "P4", "P2"], "scorecard": { "commission": "20", "gmv7dPct": "154.08", "gmv30dPct": "35.66", "creatorCount": "446", "anglesCount": "5", "crPct": "58.17", "concentration": "23.8" }, "score": 18, "maxScore": 18, "scorePct": 100, "decision": "PICK", "pains": [], "angles": [], "lastScoredAt": "2026-05-16T06:37:21.576Z", "createdAt": "2026-05-16T06:37:21.576Z", "locked": { "month": "2026-05", "targetClips": 10, "anglesToTest": [], "lockedAt": "2026-05-16T06:37:31.526Z" } },
    { "id": "mp7zc2fsps63r", "name": "[พร้อมส่ง] 4/5/6KG เคตเทิลเบลล์แบบนุ่ม kettlebell", "brand": " SMOKY กีฬาฟิตเนส", "category": "C", "productType": "equipment", "tiktokLink": "https://shop.tiktok.com/view/product/1730710014427040124?region=TH&locale=th-TH&source=agency", "kalodataLink": "https://www.kalodata.com/product/detail?id=1730710014427040124&language=th-TH&currency=THB&region=TH&dateRange=%5B%222026-04-16%22%2C%222026-05-15%22%5D&module=%22list%22", "gmvMaxPct": "", "pillars": [], "scorecard": { "commission": "10", "gmv7dPct": "-25.7", "gmv30dPct": "32.65", "creatorCount": "474", "anglesCount": "5", "crPct": "26.11", "concentration": "80" }, "score": 13, "maxScore": 18, "scorePct": 72, "decision": "WAIT", "pains": [], "angles": [], "lastScoredAt": "2026-05-16T06:43:01.336Z", "createdAt": "2026-05-16T06:43:01.336Z", "locked": { "month": "2026-05", "targetClips": 5, "anglesToTest": [], "lockedAt": "2026-05-16T06:43:24.419Z" } }
  ],
  "clips": [
    { "id": "mp2mxkqjhuue1", "isV": false, "productId": "mp2mdeiuwv5gj", "pillarId": "P3", "painId": "mp2mrm4uytwrg", "angleId": "mp2muje4sy8lb", "hook": "เชื่อไหมคับว่าหลายๆคน ใช้battlerope แทนการวิ่ง เพราะวิ่งลดพุงได้ก็จริงแต่เจ็บเข่า", "level": "consideration", "postedAt": "2026-05-12T00:00:00.000Z", "createdAt": "2026-05-12T12:56:58.939Z", "gmv": null, "ctr": null, "views7d": null, "videoLink": "https://www.tiktok.com/@peem6pack/video/7638985806463520020?is_from_webapp=1&sender_device=pc&web_id=7584277782457632272", "gencodeSubmitted": true, "views24h": 1125, "orders": null, "note": "" },
    { "id": "mp3jk5sxvqcwv", "isV": false, "productId": "mp2m5sov4vvhu", "pillarId": "P4", "painId": "", "angleId": "", "hook": "มือใหม่เริ่มเดิน-วิ่ง ผมว่าอย่าเลือกแค่รองเท้าสวยครับ เพราะใส่จริงแล้วถ้าเท้าชา ส้นร้อน หรืออับง่าย มันทำให้ไม่อยากวิ่งต่อเลย", "level": "consideration", "postedAt": "2026-05-12T00:00:00.000Z", "videoLink": "https://www.tiktok.com/@peem6pack/video/7638975824581954836?is_from_webapp=1&sender_device=pc&web_id=7584277782457632272", "gencodeSubmitted": true, "createdAt": "2026-05-13T04:10:20.385Z", "views24h": 913, "views7d": null, "orders": null, "gmv": null, "ctr": null, "note": "" },
    { "id": "mp3juevp5ddun", "isV": false, "productId": "mp3gkuo7rkypx", "pillarId": "P4", "painId": "mp3guzq2q1kcm", "angleId": "mp3hc6nch7ivv", "hook": "ถ้าคุณเสิร์ชคำว่า Creatine มาเป็นร้อยครั้งเนี่ย และดูรีวิวทุกคลิป เปรียบเทียบทุกแบรนด์ คุณรู้แน่ๆแหละ ว่ามันเวิร์คแน่ๆแหละ แต่สิ่งที่ต้องสนใจจริงๆเนี่ย มันมีแค่ 3 อย่าง", "level": "conversion", "postedAt": "2026-05-12T00:00:00.000Z", "videoLink": "https://www.tiktok.com/@peem6pack/video/7639014560518769940?is_from_webapp=1&sender_device=pc&web_id=7584277782457632272", "gencodeSubmitted": false, "createdAt": "2026-05-13T04:18:18.709Z", "views24h": 450, "views7d": null, "orders": null, "gmv": null, "ctr": null, "note": "" },
    { "id": "mp4vr6jrvdns7", "isV": false, "productId": "mp4vp2bdglwmw", "pillarId": "P4", "painId": "", "angleId": "", "hook": "บาร์โหนติดประตูคุ้มไหม? ถ้าเลือกผิดก็อาจซื้อมาแล้วไม่ได้ใช้ แต่ตัวนี้มี 4 จุดที่ผมว่าเหมาะกับสายเล่นที่บ้านครับ", "level": "consideration", "postedAt": "2026-05-13T00:00:00.000Z", "videoLink": "https://www.tiktok.com/@peem6pack/video/7638889710395362580?is_from_webapp=1&sender_device=pc&web_id=7584277782457632272", "gencodeSubmitted": false, "createdAt": "2026-05-14T02:39:29.511Z", "views24h": 2621, "views7d": null, "orders": 4, "gmv": 742, "ctr": 2.94, "note": "" },
    { "id": "mp4weztq6xzu8", "isV": false, "productId": "mp4wcyuma953o", "pillarId": "P4", "painId": "", "angleId": "", "hook": "นี่มันเป็นแบบ คลิปล็อคสวมเข้าไปเลย เพิ่งได้มาไหมนะคับ หลังจากถูกป้ายยามาเยอะ", "level": "consideration", "postedAt": "2026-05-09T00:00:00.000Z", "videoLink": "https://www.tiktok.com/@peem6pack/video/7637393939057757456?is_from_webapp=1&sender_device=pc&web_id=7584277782457632272", "gencodeSubmitted": false, "createdAt": "2026-05-14T02:58:00.542Z", "views24h": 4000, "views7d": null, "orders": 9, "gmv": 580, "ctr": 3, "note": "" },
    { "id": "mp4wgoh8b3u85", "isV": false, "productId": "mp4wcyuma953o", "pillarId": "", "painId": "", "angleId": "", "hook": "แน่นขนาดไหนนิ ถือได้เลย โดนป้ายยามาเยอะเเล้ว!", "level": "consideration", "postedAt": "2026-05-12T00:00:00.000Z", "videoLink": "https://www.tiktok.com/@peem6pack/video/7638591616793595137?is_from_webapp=1&sender_device=pc&web_id=7584277782457632272", "gencodeSubmitted": false, "createdAt": "2026-05-14T02:59:19.148Z", "views24h": null, "views7d": 3805, "orders": 13, "gmv": 742, "ctr": 2.6, "note": "" },
    { "id": "mp4x4ikzm5rvq", "isV": false, "productId": "mp4x0lwk4bkkz", "pillarId": "P2", "painId": "", "angleId": "", "hook": "หยุดก่อนคับ ถ้าคุณกินน้ำมันปลามาเป็นปี แต่ยังไม่รู้สึกแตกต่าง ผมว่าปัญหาไม่ได้อยู่ที่คุณครับ ปัญหาอยู่ที่ฉลากหลังกล่อง", "level": "consideration", "postedAt": "2026-05-07T00:00:00.000Z", "videoLink": "https://www.tiktok.com/@peem6pack/video/7637080237779602689?is_from_webapp=1&sender_device=pc", "gencodeSubmitted": false, "createdAt": "2026-05-14T03:17:51.251Z", "views24h": null, "views7d": 8540, "orders": 9, "gmv": 8600, "ctr": 4.45, "note": "", "repostStatus": { "d7": "2026-05-16T04:49:24.231Z" } },
    { "id": "mp4xconpmxdev", "isV": false, "productId": "mp4x0lwk4bkkz", "pillarId": "P2", "painId": "", "angleId": "", "hook": "ืุทุกคนครับ หยิบน้ำมันปลาขึ้นมา ถ้า DHA + EPA ไม่ถึง 500mg กินไปก็ไม่ค่อยคุ้มเท่าไหร่?", "level": "consideration", "postedAt": "2026-05-11T00:00:00.000Z", "videoLink": "https://www.tiktok.com/@peem6pack/video/7638468827252100369?is_from_webapp=1&sender_device=pc", "gencodeSubmitted": false, "createdAt": "2026-05-14T03:24:12.373Z", "views24h": 244, "views7d": null, "orders": null, "gmv": null, "ctr": null, "note": "" },
    { "id": "mp4xjiggjtzfx", "isV": false, "productId": "mp4x0lwk4bkkz", "pillarId": "P1", "painId": "", "angleId": "", "hook": "ช่วงนี้น้ำมันปลาเต็มหน้าFeed ไปหมด ฟังนะถ้าคุณไม่ใช่ 3 กลุ่มนี้ ปัดทิ้งไปได้เลย ไม่ต้องเสียเงินฟรี", "level": "consideration", "postedAt": "2026-05-06T00:00:00.000Z", "videoLink": "https://www.tiktok.com/@peem6pack/video/7636658163990727953?is_from_webapp=1&sender_device=pc", "gencodeSubmitted": false, "createdAt": "2026-05-14T03:29:30.928Z", "views24h": null, "views7d": 1240, "orders": null, "gmv": null, "ctr": null, "note": "" },
    { "id": "mp4xm4474lxj5", "isV": false, "productId": "mp4x0lwk4bkkz", "pillarId": "P2", "painId": "", "angleId": "", "hook": "กิน Omega3 มาครึ่งปี แต่ยังไม่รู้สึกต่าง อาจเพราะเม็ดที่คุณกิน มีEPA แค่ 180 mg", "level": "consideration", "postedAt": "2026-05-07T00:00:00.000Z", "videoLink": "", "gencodeSubmitted": false, "createdAt": "2026-05-14T03:31:32.311Z", "views24h": null, "views7d": 974, "orders": null, "gmv": null, "ctr": 7.46, "note": "" },
    { "id": "mp4xyuwyy7sga", "isV": false, "productId": "mp4x0lwk4bkkz", "pillarId": "P2", "painId": "", "angleId": "", "hook": "รู้มัยว่า Omega3 ที่คุณตั้งใจกินเข้าไปทุกวัน อาจจะเป็นแค่เเคปซูลหรอกตัวเอง ถ้าคุณไม่อ่านบรรทัดนี้!", "level": "consideration", "postedAt": "2026-05-05T00:00:00.000Z", "videoLink": "https://www.tiktok.com/@peem6pack/video/7636026616187063553?is_from_webapp=1&sender_device=pc", "gencodeSubmitted": false, "createdAt": "2026-05-14T03:41:26.914Z", "views24h": null, "views7d": 1506, "orders": 1, "gmv": 493, "ctr": 6.93, "note": "" },
    { "id": "mp53flifqgs5j", "isV": false, "productId": "mp4x0lwk4bkkz", "pillarId": "P2", "painId": "mp53egwgrgmbb", "angleId": "mp53emxsp4rwt", "hook": "“หยุดก่อนครับ ถ้าคุณกินน้ำมันปลามานาน แต่ยังไม่ค่อยรู้สึกต่าง…ผมว่าปัญหาอาจไม่ได้อยู่ที่คุณ แต่อยู่ที่ฉลากหลังกล่องครับ", "level": "conversion", "postedAt": "2026-05-14T00:00:00.000Z", "videoLink": "https://www.tiktok.com/@peem6pack/video/7639624879989411092?is_from_webapp=1&sender_device=pc", "gencodeSubmitted": false, "createdAt": "2026-05-14T06:14:25.959Z" },
    { "id": "mp6q13br780j2", "isV": false, "productId": "mp4x0lwk4bkkz", "pillarId": "P1", "painId": "", "angleId": "", "hook": "\"ผมกินน้ำมันปลามาเป็นปีๆ — แต่สิ่งที่คุณต้องรู้คือ คนส่วนใหญ่กำลังเสียเงินทิ้งฟรีๆ ครับ", "level": "conversion", "postedAt": "2026-05-15T00:00:00.000Z", "videoLink": "", "gencodeSubmitted": false, "createdAt": "2026-05-15T09:34:46.551Z", "views24h": 1300, "views7d": null, "orders": null, "gmv": null, "ctr": null, "note": "" },
    { "id": "mp8fifurx919v", "isV": false, "productId": "mp7zc2fsps63r", "pillarId": "", "painId": "", "angleId": "", "hook": "", "level": "consideration", "postedAt": "2026-05-16T00:00:00.000Z", "videoLink": "https://www.tiktok.com/@peem6pack/video/7640481999433518337?is_from_webapp=1&sender_device=pc", "gencodeSubmitted": false, "createdAt": "2026-05-16T14:15:52.515Z" }
  ]
};

const DEFAULT_PILLARS = [
  { id: 'P1', name: 'Supplement Education', emoji: '📚', desc: 'สอนเลือกอาหารเสริม' },
  { id: 'P2', name: 'Mistake / Buyer Beware', emoji: '⚠️', desc: 'ซื้อผิด กินผิด' },
  { id: 'P3', name: 'Routine / Use Case', emoji: '☀️', desc: 'กินยังไงในชีวิตจริง' },
  { id: 'P4', name: 'Product Review / Comparison', emoji: '🔍', desc: 'รีวิวและเทียบสินค้า' },
  { id: 'P5', name: 'Fitness Lifestyle', emoji: '💪', desc: 'หุ่นดีจริง ใช้จริง' },
];

const ABCD_INFO = {
  A: { label: 'A — ขายดี', short: 'A', desc: 'สินค้าขายดี', bg: 'bg-rose-500' },
  B: { label: 'B — มาใหม่', short: 'B', desc: 'สินค้ามาใหม่/แนะนำ', bg: 'bg-blue-500' },
  C: { label: 'C — ราคาประหยัด', short: 'C', desc: 'สินค้าราคาประหยัด', bg: 'bg-emerald-500' },
  D: { label: 'D — ค่าคอมสูง', short: 'D', desc: 'สินค้าคอมสูง/แพง', bg: 'bg-violet-500' },
  V: { label: 'V — Value Content', short: 'V', desc: 'คลิปให้ความรู้', bg: 'bg-slate-400' },
};

const DECISION_INFO = { PICK: { label: 'PICK', bg: 'bg-emerald-500' }, WAIT: { label: 'WAIT', bg: 'bg-amber-500' }, DROP: { label: 'DROP', bg: 'bg-rose-500' } };
const PRODUCT_TYPES = [{ id: 'supplement', label: 'อาหารเสริม', emoji: '💊' }, { id: 'shoes', label: 'รองเท้ากีฬา', emoji: '👟' }, { id: 'equipment', label: 'อุปกรณ์ออกกำลังกาย', emoji: '🏋️' }, { id: 'apparel', label: 'เสื้อผ้าออกกำลังกาย', emoji: '👕' }, { id: 'other', label: 'อื่นๆ', emoji: '📦' }];
const SPLITTER_OPTIONS = { persona: ['คนอ้วน', 'ผู้หญิง', 'มือใหม่', 'พนักงานออฟฟิศ', 'คนแก่/วัยกลางคน', 'คนเดินเยอะ', 'นักวิ่ง', 'คนลดน้ำหนัก', 'คนเล่นเวท'], situation: ['เดินห้าง', 'วิ่งลู่', 'เดินงาน', 'เที่ยว', 'คาร์ดิโอ', 'เข้ายิม', 'เดินสวน', 'ทำงานออฟฟิศ', 'ก่อนนอน', 'หลังตื่นนอน'], emotion: ['กลัวเจ็บ', 'ขี้เกียจเพราะเจ็บ', 'อยากเริ่มใหม่', 'อยากผอม', 'เหนื่อยจากงาน', 'อยากดูดี', 'อยากแข็งแรง', 'หมดหวังกับร่างกาย'], format: ['POV', 'Story', 'Talking Head', 'Review', 'Compare', 'Voice Over', 'How-to', 'Listicle', 'Before/After'] };
const PAIN_SOURCES = [{ id: 'shopee', label: '💬 Shopee/Lazada (1-3 ดาว)' }, { id: 'tiktok', label: '🔍 TikTok + "แต่..."' }, { id: 'pantip', label: '💭 Pantip / FB Groups' }, { id: 'ai', label: '🤖 AI Persona Simulation' }, { id: 'personal', label: '👤 ประสบการณ์ตรง' }];
const CLIP_LEVELS = [{ id: 'traffic', label: 'Traffic', color: 'bg-sky-500' }, { id: 'consideration', label: 'Consideration', color: 'bg-violet-500' }, { id: 'conversion', label: 'Conversion', color: 'bg-rose-500' }];

const TARGET_ANGLES = 7; const RESCORE_DAYS = 7; const PICK_THRESHOLD = 83; const WAIT_THRESHOLD = 55; const ARGOON_PASS = 15; const ARGOON_WATCH = 10; const ARGOON_MAX = 18; const WINNER_GMV = 1000; const CONCENTRATION_LIMIT = 60; const REPOST_INTERVALS = [7, 14, 30]; const STATS_24H_WINDOW = [22, 30]; const STATS_7D_WINDOW = [156, 204]; const PORTFOLIO_TARGET = { A: 60, B: 25, C: 10, D: 5 }; const BLENDED_COMMISSION_TARGET = 15; const DEFAULT_MONTHLY_CLIP_TARGET = 150;
const MONTHLY_REVENUE_TARGET = 300000; // ฿ — goal for commission revenue/month
const uid = () => Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
const todayStr = () => new Date().toISOString().slice(0, 10);
const currentMonth = () => new Date().toISOString().slice(0, 7);
const daysSince = (iso) => !iso ? 999 : Math.floor((Date.now() - new Date(iso).getTime()) / 86400000);
const daysUntilRescore = (iso) => RESCORE_DAYS - daysSince(iso);
const fmtDate = (iso) => { if (!iso) return '-'; const d = new Date(iso); return `${d.getDate()}/${d.getMonth() + 1}/${(d.getFullYear() + 543).toString().slice(2)}`; };
const fmtNum = (n) => (n ?? 0).toLocaleString('th-TH');
const truncate = (s, n) => !s ? '' : s.length > n ? s.slice(0, n) + '…' : s;
const hoursSince = (iso) => !iso ? 999 : (Date.now() - new Date(iso).getTime()) / 3600000;

function getStatsPending(clips) { const pending24h = [], pending7d = []; clips.forEach(c => { const hrs = hoursSince(c.postedAt); if (hrs >= STATS_24H_WINDOW[0] && hrs <= STATS_24H_WINDOW[1] && !c.views24h) pending24h.push(c); if (hrs >= STATS_7D_WINDOW[0] && hrs <= STATS_7D_WINDOW[1] && !c.views7d) pending7d.push(c); }); return { pending24h, pending7d }; }
function calcScore(sc = {}) { let total = 0, max = 0; const cv = (v) => v === '' || v === null || v === undefined ? null : Number(v); const commission = cv(sc.commission); if (commission !== null && !isNaN(commission)) { total += commission >= 20 ? 3 : commission >= 15 ? 2 : commission >= 10 ? 1 : 0; max += 3; } const g7 = cv(sc.gmv7dPct), g30 = cv(sc.gmv30dPct); if (g7 !== null && g30 !== null && !isNaN(g7) && !isNaN(g30)) { if (g7 > 0 && g30 > 0) total += 3; else if (g7 < 0 && g30 < 0) total += 1; else total += 2; max += 3; } else if (g7 !== null && !isNaN(g7)) { total += g7 > 0 ? 2 : 1; max += 3; } const creators = cv(sc.creatorCount); if (creators !== null && !isNaN(creators)) { total += creators <= 500 ? 3 : creators <= 1000 ? 2 : 1; max += 3; } const angles = cv(sc.anglesCount); if (angles !== null && !isNaN(angles)) { total += angles >= 3 ? 3 : angles >= 2 ? 2 : 1; max += 3; } const cr = cv(sc.crPct); if (cr !== null && !isNaN(cr)) { total += cr >= 20 ? 3 : cr >= 10 ? 2 : 1; max += 3; } const conc = cv(sc.concentration); if (conc !== null && !isNaN(conc)) { total += conc < 30 ? 3 : conc <= 60 ? 2 : 1; max += 3; } return { total, max, pct: max > 0 ? Math.round((total / max) * 100) : 0 }; }
function getDecision(pct) { return pct >= PICK_THRESHOLD ? 'PICK' : pct >= WAIT_THRESHOLD ? 'WAIT' : 'DROP'; }
function autoClassify({ gmv30d, commission, tiktokRank, price }) { const g = Number(gmv30d) || 0; const c = Number(commission) || 0; const rank = Number(tiktokRank) || 0; const pr = Number(price) || 0; if (g >= 30000) { if (c >= 15) return { cat: 'A', label: 'A — ideal', reason: 'Mass + คอมดี = A ideal', confidence: 'high' }; return { cat: 'A', label: 'A (proven exception)', reason: 'Mass = ฐานรายได้แม้คอมต่ำ', confidence: 'high' }; } if (g >= 10000) { if (pr > 0 && pr < 500 && c < 20) return { cat: 'C', label: 'C (low-price + mass)', reason: `ราคา ฿${pr} + GMV ฿${fmtNum(g)} = mass low-ticket → C traffic driver`, confidence: 'medium' }; if (c >= 20) return { cat: 'B', label: 'B → A potential', reason: 'กำลังพิสูจน์ตัว ใกล้ E', confidence: 'medium' }; return { cat: 'B', label: 'B', reason: 'Volume ปานกลาง — เทสต่อ', confidence: 'medium' }; } if (g >= 1000) { if (pr >= 800 && c >= 20) return { cat: 'D', label: 'D (premium)', reason: `ราคา ฿${pr} + คอม ${c}% — กินกำไรเป็นรอบ ห้าม auto-promote A`, confidence: 'medium' }; if (pr > 0 && pr < 500) return { cat: 'C', label: 'C (low-price, low-vol)', reason: `ราคา ฿${pr} — traffic driver / repeat buy`, confidence: 'low' }; if (c >= 20) return { cat: 'D', label: 'D', reason: 'คอมสูงแต่ volume ไม่ถึง mass — D ตามนิยาม', confidence: 'medium' }; if (c >= 10) return { cat: 'C', label: 'C', reason: 'Volume น้อย คอมปานกลาง — ดู price/repeat-buy', confidence: 'low' }; return { cat: 'C', label: 'C / Cut', reason: 'Volume + คอมต่ำ — พิจารณาตัด', confidence: 'low' }; } if (rank >= 1 && rank <= 5) return { cat: 'B', label: 'B (Top 1-5 untested)', reason: 'Mass ใน TikTok แต่ยังไม่เทสในช่อง', confidence: 'medium' }; if (rank >= 6 && rank <= 20) return { cat: 'B', label: 'B (Top 10-20)', reason: 'Demand ปานกลาง — testing zone', confidence: 'medium' }; if (rank > 20) return { cat: 'B', label: 'B (weak signal)', reason: 'อันดับต่ำ — เทสด่วน หรือ skip', confidence: 'low' }; return { cat: 'B', label: 'B (ใหม่)', reason: 'ยังไม่มี data — เริ่มเทส', confidence: 'low' }; }
function getPortfolioBalance(products, clips, days = 30) { const byCat = { A: 0, B: 0, C: 0, D: 0 }; let total = 0; products.forEach(p => { if (!['A', 'B', 'C', 'D'].includes(p.category)) return; const sales = getProductSales(p, clips, days); byCat[p.category] += sales.primary; total += sales.primary; }); if (total === 0) return null; return Object.fromEntries(Object.entries(byCat).map(([k, v]) => { const actual = Math.round((v / total) * 100); const target = PORTFOLIO_TARGET[k]; const diff = actual - target; return [k, { actual, target, diff, gmv: v, status: Math.abs(diff) <= 5 ? 'ok' : diff > 0 ? 'over' : 'under' }]; })); }
function getBlendedCommission(products, clips, days = 30) { let weightedSum = 0, totalGMV = 0; const breakdown = []; products.forEach(p => { const sales = getProductSales(p, clips, days); const c = Number(p.scorecard?.commission) || 0; if (sales.primary > 0 && c > 0) { weightedSum += sales.primary * c; totalGMV += sales.primary; breakdown.push({ product: p, gmv: sales.primary, commission: c, contribution: sales.primary * c }); } }); if (totalGMV === 0) return null; const blended = weightedSum / totalGMV; breakdown.sort((a, b) => b.contribution - a.contribution); return { blended: Math.round(blended * 10) / 10, target: BLENDED_COMMISSION_TARGET, totalGMV, breakdown }; }

// Cut Decision Helper (Round 1) — find products meeting "ตัด" criteria
// Category Stack Priority (Round 2 / Lock 2.0) — rank products in any category by GMV + frequency tier
function getCategoryStack(products, clips, category) {
  const catProducts = products.filter(p => p.category === category);
  const withData = catProducts.map(p => {
    const sales30d = getProductSales(p, clips, 30).primary;
    const sales7d = getProductSales(p, clips, 7).primary;
    const daily7d = sales7d / 7;
    const daily30d = sales30d / 30;
    const momentum = daily30d > 0 ? daily7d / daily30d : 1;
    const monthKey = currentMonth();
    const clipsThisMonth = clips.filter(c => c.productId === p.id && c.postedAt?.slice(0, 7) === monthKey).length;
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

// Legacy alias for Dashboard (unchanged)
function getAStack(products, clips) { return getCategoryStack(products, clips, 'A'); }

// E Detection (Round 2) — find Winning Product candidates in B/C/D
function getECandidates(products, clips) {
  return products.map(p => {
    if (p.category === 'A') return null; // Already in A
    const ageDays = daysSince(p.createdAt);
    if (ageDays < 14) return null; // Too new — let it prove first
    const sales = getProductSales(p, clips, 30);
    const sales30d = sales.primary;
    const pclips = clips.filter(c => c.productId === p.id);
    const winnerCount = pclips.filter(c => (Number(c.gmv) || 0) >= WINNER_GMV).length;
    const rank = Number(p.tiktokRank) || 0;
    const commission = Number(p.scorecard?.commission) || 0;

    let eScore = 0;
    const reasons = [];
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

// ROI Calculator (v2.6) — calculate revenue commission per product + path to monthly target
function getROIAnalysis(products, clips, monthlyTargetGMV) {
  const items = products.map(p => {
    const sales30d = getProductSales(p, clips, 30).primary;
    const commission = Number(p.scorecard?.commission) || 0;
    const price = Number(p.price) || 0;
    const commPerOrder = (price > 0 && commission > 0) ? (price * commission / 100) : 0;
    const orders30d = price > 0 ? Math.round(sales30d / price) : 0;
    const currentCommRevenue = sales30d * commission / 100;
    const ordersNeededAlone = (commPerOrder > 0 && monthlyTargetGMV > 0) ? Math.ceil(monthlyTargetGMV / commPerOrder) : null;
    return { product: p, sales30d, commission, price, commPerOrder, orders30d, currentCommRevenue, ordersNeededAlone };
  }).filter(i => i.sales30d > 0 || i.commPerOrder > 0).sort((a, b) => b.currentCommRevenue - a.currentCommRevenue);

  const totalCommRevenue = items.reduce((s, i) => s + i.currentCommRevenue, 0);
  const gap = Math.max(0, monthlyTargetGMV - totalCommRevenue);
  const pct = monthlyTargetGMV > 0 ? Math.round((totalCommRevenue / monthlyTargetGMV) * 100) : 0;
  return { items, totalCommRevenue, gap, pct };
}

function getProductsToCut(products, clips) {  return products.map(p => {
    const reasons = [];
    const commission = Number(p.scorecard?.commission) || 0;
    const sales = getProductSales(p, clips, 30);
    const ageDays = daysSince(p.createdAt);

    // 1. Commission ≤5% (no exceptions for proven sellers)
    if (commission > 0 && commission <= 5 && sales.primary < 30000) reasons.push(`คอม ${commission}% ≤5%`);

    // 2. Argoon CUT (score < WAIT_THRESHOLD = 55%)
    if (p.scorePct && p.maxScore >= 12 && p.scorePct < WAIT_THRESHOLD) reasons.push(`Argoon ${p.score}/${p.maxScore} = CUT`);

    // 3. GMV growth crashing both 7d and 30d
    const g7 = Number(p.scorecard?.gmv7dPct);
    const g30 = Number(p.scorecard?.gmv30dPct);
    if (!isNaN(g7) && !isNaN(g30) && g7 < -20 && g30 < -20) reasons.push(`GMV ตกหนัก ${g7}% / ${g30}%`);

    // 4. No sales 30d AND in system > 14 days
    if (ageDays >= 14 && sales.primary === 0 && sales.clipCount === 0) reasons.push('ไม่มีกิจกรรม 30d');

    if (reasons.length === 0) return null;
    return { product: p, reasons, severity: reasons.length };
  }).filter(Boolean).sort((a, b) => b.severity - a.severity);
}
function migrateProduct(p) { if (!p) return p; const sc = p.scorecard || {}; if (sc.gmv7d !== undefined && sc.gmv7dPct === undefined) { const { gmv7d, gmv30d, ...rest } = sc; p.scorecard = rest; const s = calcScore(p.scorecard); p.score = s.total; p.maxScore = s.max; p.scorePct = s.pct; p.decision = getDecision(s.pct); } return p; }
function migrateClip(c) { if (!c) return c; if (c.views !== undefined && c.views7d === undefined) { c.views7d = c.views; delete c.views; } if (c.link !== undefined && c.videoLink === undefined) { c.videoLink = c.link; delete c.link; } return c; }
function getRevenuePerClip(productId, clips, days = 7) { const cutoff = Date.now() - days * 86400000; const pclips = clips.filter(c => c.productId === productId && new Date(c.postedAt).getTime() >= cutoff); if (pclips.length === 0) return { revPerClip: 0, totalGMV: 0, clipCount: 0 }; const totalGMV = pclips.reduce((s, c) => s + (Number(c.gmv) || 0), 0); return { revPerClip: totalGMV / pclips.length, totalGMV, clipCount: pclips.length }; }
function getProductSales(product, clips, days) { const cutoff = Date.now() - days * 86400000; const fromClips = clips.filter(c => c.productId === product.id && new Date(c.postedAt).getTime() >= cutoff).reduce((s, c) => s + (Number(c.gmv) || 0), 0); const clipCount = clips.filter(c => c.productId === product.id && new Date(c.postedAt).getTime() >= cutoff).length; let fromManual = 0; if (days <= 7) { fromManual = Number(product.salesData?.last7d) || Number(product.salesData?.last30d) || 0; } else { fromManual = Number(product.salesData?.last30d) || Number(product.salesData?.last7d) || 0; } const hasManual = fromManual > 0; const attributionPct = hasManual ? Math.min(100, Math.round((fromClips / fromManual) * 100)) : null; return { fromClips, fromManual, hasManual, clipCount, attributionPct, primary: fromManual || fromClips }; }
function getBestAngle(product, clips) { if (!product?.angles?.length) return null; const angleStats = product.angles.map(angle => { const aclips = clips.filter(c => c.angleId === angle.id); const totalGMV = aclips.reduce((s, c) => s + (Number(c.gmv) || 0), 0); const avg = aclips.length > 0 ? totalGMV / aclips.length : 0; return { angle, count: aclips.length, totalGMV, avg }; }).filter(s => s.count >= 1).sort((a, b) => b.avg - a.avg); return angleStats[0] || null; }
function getWinners(clips, products) { return clips.filter(c => (Number(c.gmv) || 0) >= WINNER_GMV).map(c => ({ clip: c, product: products.find(p => p.id === c.productId), daysOld: daysSince(c.postedAt), })).sort((a, b) => (Number(b.clip.gmv) || 0) - (Number(a.clip.gmv) || 0)); }
function getRepostCandidates(clips, products) { return getWinners(clips, products).map(w => { const rs = w.clip.repostStatus || {}; let bucket = null; if (w.daysOld >= 30 && !rs.d30) bucket = 30; else if (w.daysOld >= 14 && !rs.d14) bucket = 14; else if (w.daysOld >= 7 && !rs.d7) bucket = 7; return bucket ? { ...w, repostBucket: bucket } : null; }).filter(Boolean).sort((a, b) => b.repostBucket - a.repostBucket); }
function getConcentration(clips, products, days = 30) { const byProduct = {}; products.forEach(p => { const s = getProductSales(p, clips, days); if (s.primary > 0) byProduct[p.id] = s.primary; }); const totalGMV = Object.values(byProduct).reduce((s, v) => s + v, 0); if (totalGMV === 0) return null; const sorted = Object.entries(byProduct).sort((a, b) => b[1] - a[1]); if (sorted.length === 0) return null; const [topId, topGMV] = sorted[0]; const pct = Math.round((topGMV / totalGMV) * 100); const topProduct = products.find(p => p.id === topId); return { pct, product: topProduct, totalGMV, topGMV }; }

export default function App() {
  const [user, setUser] = useState(null);
  const [dbInitialized, setDbInitialized] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const [page, setPage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState(null);
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

  const showToast = (msg, type = 'success') => { setToast({ msg, type }); setTimeout(() => setToast(null), 2500); };

  // --- 1. FIREBASE AUTHENTICATION ---
  useEffect(() => {
    const initAuth = async () => {
      try {
        await signInAnonymously(auth);
      } catch (e) {
        console.error("Firebase Auth Error:", e);
        showToast("ระบบยืนยันตัวตนขัดข้อง", "error");
      }
    };
    initAuth();
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return () => unsubscribe();
  }, []);

  // --- 2. FIREBASE REALTIME SYNC (Firestore) ---
  useEffect(() => {
    if (!user) return;
    
    // ชี้เป้าไปที่กล่องข้อมูลส่วนตัวของคุณ
    const docRef = doc(db, 'artifacts', APP_ID, 'users', user.uid, 'appData', 'main');
    
    const unsubscribe = onSnapshot(docRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setProducts(data.products?.map(migrateProduct) || []);
        setClips(data.clips?.map(migrateClip) || []);
        if (data.monthlyTarget) setMonthlyTarget(data.monthlyTarget);
        setDbInitialized(true);
        setIsSyncing(false);
      } else {
        setIsSyncing(true);
        // ถ้ายืมครั้งแรก ให้ยัดข้อมูล INITIAL_DATA ลงไป
        setDoc(docRef, {
          products: INITIAL_DATA.products.map(migrateProduct),
          clips: INITIAL_DATA.clips.map(migrateClip),
          monthlyTarget: DEFAULT_MONTHLY_CLIP_TARGET
        }).then(() => {
          setDbInitialized(true);
          setIsSyncing(false);
          showToast('☁️ โหลดข้อมูลขึ้น Cloud สำเร็จ!');
        });
      }
    }, (error) => {
      console.error("Firestore Sync Error:", error);
      showToast("ขาดการเชื่อมต่อ Cloud", "error");
    });

    return () => unsubscribe();
  }, [user]);

  // --- DATA MUTATION HELPERS (ดันข้อมูลขึ้น Cloud อัตโนมัติ) ---
  // Sanitize: Firestore reject undefined → convert to null or remove
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

  const syncToCloud = async (patch) => {
    if (!user) return;
    setIsSyncing(true);
    try {
      const clean = sanitizeForFirestore(patch);
      await setDoc(doc(db, 'artifacts', APP_ID, 'users', user.uid, 'appData', 'main'), clean, { merge: true });
    } catch (e) {
      console.error(e);
      showToast('Sync ล้มเหลว', 'error');
    } finally {
      setIsSyncing(false);
    }
  };

  const persistMonthlyTarget = async (val) => { setMonthlyTarget(val); await syncToCloud({ monthlyTarget: val }); };
  const persistProducts = async (next) => { setProducts(next); await syncToCloud({ products: next }); };
  const persistClips = async (next) => { setClips(next); await syncToCloud({ clips: next }); };

  const addProduct = async (data) => {
    const s = calcScore(data.scorecard);
    await persistProducts([...products, { id: uid(), ...data, score: s.total, maxScore: s.max, scorePct: s.pct, decision: getDecision(s.pct), pillars: data.pillars || [], pains: [], angles: [], lastScoredAt: new Date().toISOString(), createdAt: new Date().toISOString(), locked: null }]);
    showToast('เพิ่มสินค้าใหม่แล้ว!');
  };
  const updateProductScore = async (id, sc) => {
    const s = calcScore(sc);
    await persistProducts(products.map(p => p.id === id ? { ...p, scorecard: sc, score: s.total, maxScore: s.max, scorePct: s.pct, decision: getDecision(s.pct), lastScoredAt: new Date().toISOString() } : p));
    showToast('อัพเดทคะแนนแล้ว!');
  };
  const updateProduct = async (id, patch) => { await persistProducts(products.map(p => p.id === id ? { ...p, ...patch } : p)); };
  const deleteProduct = async (id) => {
    if (!confirm('ลบสินค้านี้? คลิปที่ผูกอยู่จะถูกลบด้วย')) return;
    await persistProducts(products.filter(p => p.id !== id));
    await persistClips(clips.filter(c => c.productId !== id));
    setPage('products'); showToast('ลบแล้ว');
  };
  const addPain = async (productId, text, source) => {
    const product = products.find(p => p.id === productId); if (!product) return;
    await updateProduct(productId, { pains: [...(product.pains || []), { id: uid(), text, source, createdAt: new Date().toISOString() }] });
    showToast('เพิ่ม Pain แล้ว');
  };
  const removePain = async (productId, painId) => {
    const product = products.find(p => p.id === productId); if (!product) return;
    await updateProduct(productId, { pains: product.pains.filter(p => p.id !== painId) });
  };
  const addAngle = async (productId, text) => {
    const product = products.find(p => p.id === productId); if (!product) return;
    await updateProduct(productId, { angles: [...(product.angles || []), { id: uid(), text, createdAt: new Date().toISOString() }] });
    showToast('เพิ่ม Angle แล้ว');
  };
  const removeAngle = async (productId, angleId) => {
    const product = products.find(p => p.id === productId); if (!product) return;
    await updateProduct(productId, { angles: product.angles.filter(a => a.id !== angleId) });
  };
  const lockProduct = async (productId, targetClips, anglesToTest) => {
    await updateProduct(productId, { locked: { month: currentMonth(), targetClips, anglesToTest, lockedAt: new Date().toISOString() } });
    showToast('🔒 Lock สินค้าแล้ว!');
  };
  const unlockProduct = async (productId) => { await updateProduct(productId, { locked: null }); showToast('🔓 ปลด Lock แล้ว'); };
  const addClip = async (data) => {
    await persistClips([...clips, { id: uid(), ...data, postedAt: data.postedAt || new Date().toISOString(), createdAt: new Date().toISOString() }]);
    showToast('บันทึกคลิปแล้ว!');
  };
  const updateClip = async (id, patch) => { await persistClips(clips.map(c => c.id === id ? { ...c, ...patch } : c)); showToast('อัพเดทคลิปแล้ว!'); };
  const markRepostDone = async (clipId, bucket) => {
    const clip = clips.find(c => c.id === clipId);
    if (!clip) return;
    const rs = { ...(clip.repostStatus || {}) };
    const key = `d${bucket}`;
    rs[key] = rs[key] ? null : new Date().toISOString();
    await persistClips(clips.map(c => c.id === clipId ? { ...c, repostStatus: rs } : c));
    showToast(rs[key] ? `✓ Repost ${bucket}d ทำแล้ว` : `Repost ${bucket}d ยกเลิก`);
  };
  const deleteClip = async (id) => { if (!confirm('ลบคลิปนี้?')) return; await persistClips(clips.filter(c => c.id !== id)); showToast('ลบคลิปแล้ว'); };

  const selectedProduct = selectedProductId ? products.find(p => p.id === selectedProductId) : null;
  const editClip = editClipId ? clips.find(c => c.id === editClipId) : null;
  const lockedProducts = useMemo(() => products.filter(p => p.locked && p.locked.month === currentMonth()), [products]);
  const productsNeedingRescore = useMemo(() => products.filter(p => daysSince(p.lastScoredAt) >= RESCORE_DAYS), [products]);
  const last7DaysClips = useMemo(() => { const cutoff = Date.now() - 7 * 86400000; return clips.filter(c => new Date(c.postedAt).getTime() >= cutoff).sort((a, b) => new Date(a.postedAt) - new Date(b.postedAt)); }, [clips]);

  const importData = (e) => {
    const file = e.target.files?.[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.products && data.clips) {
           const newP = data.products.map(migrateProduct);
           const newC = data.clips.map(migrateClip);
           setProducts(newP); setClips(newC);
           await syncToCloud({ products: newP, clips: newC });
           showToast('Import & Sync ขึ้น Cloud สำเร็จ!');
        }
      } catch { showToast('ไฟล์ผิดพลาด', 'error'); }
    };
    reader.readAsText(file);
  };

  if (!dbInitialized) {
    return (
      <div className="min-h-screen bg-[#F5F1E8] flex flex-col items-center justify-center space-y-4">
        <Cloud className="w-12 h-12 text-lime-500 animate-pulse" />
        <div className="font-display text-stone-600">กำลังเชื่อมต่อฐานข้อมูล Cloud...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F5F1E8] text-stone-900 pb-24" style={{ fontFamily: "'Inter', 'Noto Sans Thai', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Noto+Sans+Thai:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700&display=swap');
        .font-display { font-family: 'Inter', 'Noto Sans Thai', system-ui; font-weight: 800; letter-spacing: -0.02em; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        .scrollbar-thin::-webkit-scrollbar { height: 4px; width: 4px; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background: #d4d4d8; border-radius: 4px; }
        .line-clamp-1 { display: -webkit-box; -webkit-line-clamp: 1; -webkit-box-orient: vertical; overflow: hidden; }
        .line-clamp-2 { display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
        .btn-primary { background: linear-gradient(180deg, #D9E830 0%, #C4D429 100%); color: #1F3F2F; }
        .btn-primary:hover { background: linear-gradient(180deg, #C4D429 0%, #B1C124 100%); }
      `}</style>
      <header className="sticky top-0 z-20 bg-emerald-950 text-stone-50 border-b-2 border-lime-400/70 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-lime-400 text-stone-900 rounded-md flex items-center justify-center font-display text-lg">P6</div>
            <div>
              <div className="font-display text-lg leading-none flex items-center gap-1.5">
                PEEM6PACK 
                {isSyncing ? <CloudOff className="w-3.5 h-3.5 text-amber-400 animate-pulse" title="กำลังซิงค์" /> : <Cloud className="w-3.5 h-3.5 text-emerald-400" title="ซิงค์ข้อมูลกับ Cloud แล้ว" />}
              </div>
              <div className="text-xs text-stone-400 leading-tight">Command Center v2.7</div>
            </div>
          </div>
          <div className="flex gap-1">
            <button onClick={() => setShowBackup(true)} className="text-xs font-semibold bg-emerald-900 hover:bg-emerald-800 px-2.5 py-1.5 rounded transition flex items-center gap-1" title="Backup ข้อมูล"><Download className="w-3.5 h-3.5" /> Backup</button>
            <label className="p-2 hover:bg-emerald-900 rounded transition cursor-pointer" title="Import"><Upload className="w-4 h-4" /><input type="file" accept="application/json" onChange={importData} className="hidden" /></label>
            <button onClick={() => setShowSettings(true)} className="p-2 hover:bg-emerald-900 rounded transition" title="Settings"><Settings className="w-4 h-4" /></button>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-5 md:py-6">
        {page === 'home' && (<HomePage products={products} clips={clips} lockedProducts={lockedProducts} productsNeedingRescore={productsNeedingRescore} last7DaysClips={last7DaysClips} monthlyTarget={monthlyTarget} onSetMonthlyTarget={persistMonthlyTarget} onGoTo={setPage} onSelectProduct={(id) => { setSelectedProductId(id); setPage('detail'); }} onEditClip={(id) => setEditClipId(id)} onMakeSimilar={(clip) => setMakeSimilarClip(clip)} onMarkRepostDone={markRepostDone} />)}
        {page === 'products' && (<ProductHubPage products={products} clips={clips} onAdd={() => setShowAddProduct(true)} onSelect={(id) => { setSelectedProductId(id); setPage('detail'); }} />)}
        {page === 'detail' && selectedProduct && (<ProductDetailPage product={selectedProduct} clips={clips.filter(c => c.productId === selectedProduct.id)} allClips={clips} onBack={() => setPage('products')} onTogglePillar={(pid) => { const next = selectedProduct.pillars.includes(pid) ? selectedProduct.pillars.filter(p => p !== pid) : [...selectedProduct.pillars, pid]; updateProduct(selectedProduct.id, { pillars: next }); }} onSetCategory={(cat) => updateProduct(selectedProduct.id, { category: cat })} onAddPain={() => setShowAddPain(true)} onRemovePain={(painId) => removePain(selectedProduct.id, painId)} onAddAngle={() => setShowAddAngle(true)} onRemoveAngle={(angleId) => removeAngle(selectedProduct.id, angleId)} onEditScore={() => setEditScoreProductId(selectedProduct.id)} onEditInfo={() => setEditProductInfoId(selectedProduct.id)} onLock={() => setShowLockProduct(true)} onUnlock={() => unlockProduct(selectedProduct.id)} onDelete={() => deleteProduct(selectedProduct.id)} onAddClip={() => { setClipForVOnly(false); setShowAddClip(true); }} onEditClip={(id) => setEditClipId(id)} showToast={showToast} />)}
        {page === 'lock' && (<LockListPage lockedProducts={lockedProducts} products={products} clips={clips} onSelectProduct={(id) => { setSelectedProductId(id); setPage('detail'); }} onUnlock={unlockProduct} onLockNew={() => setPage('products')} />)}
        {page === 'log' && (<ClipLogPage products={products} clips={clips} onEditClip={(id) => setEditClipId(id)} onMakeSimilar={(clip) => setMakeSimilarClip(clip)} onMarkRepostDone={markRepostDone} onPromoteToA={(id) => updateProduct(id, { category: 'A' })} />)}
      </main>
      <nav className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur border-t border-stone-200/70 z-30 shadow-[0_-2px_10px_rgba(0,0,0,0.04)]">
        <div className="max-w-6xl mx-auto grid grid-cols-5 gap-1 px-2 py-2">
          {[{ id: 'home', icon: Home, label: 'Home' }, { id: 'products', icon: Package, label: 'Products' }, { id: 'lock', icon: Lock, label: 'Lock' }, { id: 'log', icon: Database, label: 'Log' }, { id: 'addclip', icon: Plus, label: 'Clip', isAction: true }].map(item => {
            const Icon = item.icon; const active = page === item.id;
            if (item.isAction) return (<button key={item.id} onClick={() => { setClipForVOnly(true); setShowAddClip(true); }} className="flex flex-col items-center justify-center py-1 transition"><div className="bg-lime-400 text-stone-900 rounded-full p-2 -mt-4 shadow-lg"><Icon className="w-5 h-5" /></div><span className="text-[10px] mt-1 font-semibold">+ คลิป</span></button>);
            return (<button key={item.id} onClick={() => setPage(item.id)} className={`flex flex-col items-center justify-center py-2 rounded-md transition ${active ? 'text-stone-900' : 'text-stone-400 hover:text-stone-700'}`}><Icon className={`w-5 h-5 ${active ? 'stroke-[2.5]' : ''}`} /><span className={`text-[10px] mt-0.5 ${active ? 'font-bold' : 'font-medium'}`}>{item.label}</span></button>);
          })}
        </div>
      </nav>
      {showAddProduct && (<AddProductModal onClose={() => setShowAddProduct(false)} onSave={async (data) => { await addProduct(data); setShowAddProduct(false); }} showToast={showToast} />)}
      {editScoreProductId && (<EditScoreModal product={products.find(p => p.id === editScoreProductId)} onClose={() => setEditScoreProductId(null)} onSave={async (sc) => { await updateProductScore(editScoreProductId, sc); setEditScoreProductId(null); }} />)}
      {editProductInfoId && (<EditProductInfoModal product={products.find(p => p.id === editProductInfoId)} onClose={() => setEditProductInfoId(null)} onSave={async (patch) => { await updateProduct(editProductInfoId, patch); setEditProductInfoId(null); }} />)}
      {showAddPain && selectedProduct && (<AddPainModal onClose={() => setShowAddPain(false)} onSave={async (text, source) => { await addPain(selectedProduct.id, text, source); setShowAddPain(false); }} />)}
      {showAddAngle && selectedProduct && (<AddAngleModal onClose={() => setShowAddAngle(false)} onSave={async (text) => { await addAngle(selectedProduct.id, text); setShowAddAngle(false); }} />)}
      {showLockProduct && selectedProduct && (<LockProductModal product={selectedProduct} onClose={() => setShowLockProduct(false)} onSave={async (target, angles) => { await lockProduct(selectedProduct.id, target, angles); setShowLockProduct(false); }} />)}
      {showAddClip && (<AddClipModal products={products} defaultProductId={!clipForVOnly && selectedProduct ? selectedProduct.id : null} onClose={() => setShowAddClip(false)} onSave={async (data) => { await addClip(data); setShowAddClip(false); }} showToast={showToast} />)}
      {editClip && (<EditClipModal clip={editClip} products={products} onClose={() => setEditClipId(null)} onSave={async (patch) => { await updateClip(editClip.id, patch); setEditClipId(null); }} onDelete={async () => { await deleteClip(editClip.id); setEditClipId(null); }} />)}
      {makeSimilarClip && (<MakeSimilarModal clip={makeSimilarClip} products={products} onClose={() => setMakeSimilarClip(null)} />)}
      {showBackup && (<BackupModal products={products} clips={clips} onClose={() => setShowBackup(false)} showToast={showToast} />)}
      {showSettings && (<SettingsModal onClose={() => setShowSettings(false)} onExport={() => { setShowSettings(false); setShowBackup(true); }} onClearAll={async () => { if (!confirm('ลบข้อมูลทั้งหมด? (แน่ใจนะว่า Export แล้ว)')) return; await persistProducts([]); await persistClips([]); setShowSettings(false); showToast('ล้างข้อมูลและ Sync ขึ้น Cloud แล้ว'); }} />)}
      
      {toast && (<div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-bounce"><div className={`px-4 py-2 rounded-md shadow-lg text-sm font-semibold ${toast.type === 'error' ? 'bg-rose-600 text-white' : 'bg-stone-900 text-lime-300'}`}>{toast.msg}</div></div>)}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, sub }) { return (<div className="bg-white border border-stone-200/70 rounded-xl p-3 md:p-4 shadow-sm"><Icon className="w-4 h-4 text-stone-400 mb-2" /><div className="font-display text-xl md:text-2xl leading-none">{value}</div><div className="text-[10px] text-stone-500 mt-1 font-semibold uppercase tracking-wide">{label}</div><div className="text-[10px] text-stone-400 mt-0.5">{sub}</div></div>); }
function VBar({ label, value, target, sub, suffix }) { const pct = Math.min(100, Math.round((value / target) * 100)); const isGood = value >= target; return (<div><div className="flex items-baseline justify-between mb-1"><span className="text-xs font-semibold uppercase tracking-wide text-stone-600">{label}</span>{isGood ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <Clock className="w-3 h-3 text-stone-400" />}</div><div className="font-display text-2xl leading-none mb-1">{sub}</div><div className="w-full h-1.5 bg-stone-200 rounded-full overflow-hidden"><div className={`h-full ${isGood ? 'bg-emerald-500' : 'bg-amber-400'} transition-all`} style={{ width: `${pct}%` }}></div></div><div className="text-[10px] text-stone-400 mt-1">เป้า: {target}{suffix || ''}</div></div>); }
function RescoreText({ lastScoredAt }) { const days = daysUntilRescore(lastScoredAt); if (days <= 0) return <span className="text-amber-700">🟡 ค้างคัดกรอง {Math.abs(days)} วัน</span>; if (days <= 2) return <span className="text-orange-600">⏱ คัดใหม่ในอีก {days} วัน</span>; return <span className="text-stone-500">⏱ คัดใหม่ในอีก {days} วัน</span>; }
function CategoryBadge({ cat }) { const info = ABCD_INFO[cat]; if (!info) return <span className="inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold bg-stone-200 text-stone-500 flex-shrink-0">?</span>; return <span className={`inline-flex items-center justify-center w-6 h-6 rounded text-xs font-bold text-white flex-shrink-0 ${info.bg}`}>{info.short}</span>; }
function Card({ children, className = '' }) { return <div className={`bg-white border border-stone-200/70 rounded-xl p-4 shadow-sm ${className}`}>{children}</div>; }

function HomePage({ products, clips, lockedProducts, productsNeedingRescore, last7DaysClips, monthlyTarget, onSetMonthlyTarget, onGoTo, onSelectProduct, onEditClip, onMakeSimilar, onMarkRepostDone }) {
  const today = todayStr();
  const clipsToday = clips.filter(c => c.postedAt?.slice(0, 10) === today);
  const totalGMVMonth = clips.filter(c => c.postedAt?.slice(0, 7) === currentMonth()).reduce((s, c) => s + (Number(c.gmv) || 0), 0);

  const tiktokTotal30d = useMemo(() => products.reduce((s, p) => s + (Number(p.salesData?.last30d) || Number(p.salesData?.last7d) || 0), 0), [products]);

  const pattern = last7DaysClips.map(c => { if (c.isV) return 'V'; const p = products.find(pp => pp.id === c.productId); return p?.category || '?'; });
  const repeats = []; for (let i = 0; i < pattern.length - 2; i++) { if (pattern[i] && pattern[i] === pattern[i + 1] && pattern[i] === pattern[i + 2]) repeats.push(pattern[i]); }
  const hasRepeatIssue = repeats.length > 0;
  const last3 = pattern.slice(-3); const recentLetters = new Set(last3.filter(Boolean));
  const missingLetters = ['A', 'B', 'C', 'D', 'V'].filter(l => !recentLetters.has(l));
  const recommendation = missingLetters.length > 0 && pattern.length > 0 ? missingLetters.slice(0, 2) : null;

  const vCount = last7DaysClips.filter(c => c.isV).length;
  const totalClips = last7DaysClips.length;
  const vRatio = totalClips > 0 ? Math.round((vCount / totalClips) * 100) : 0;
  const uniqueProducts = new Set(last7DaysClips.filter(c => !c.isV).map(c => c.productId)).size;
  const avgPerDay = (totalClips / 7).toFixed(1);

  const trendingProducts = useMemo(() => {
    return products.map(p => {
      const sales = getProductSales(p, clips, 7);
      const stats = getRevenuePerClip(p.id, clips, 7);
      return { product: p, ...stats, manual7d: sales.fromManual, hasManual: sales.hasManual, primary: sales.primary, isShopAds: !!p.isShopAds };
    }).filter(s => s.primary > 0).sort((a, b) => {
      // Shop Ads first within same revenue tier
      if (a.isShopAds !== b.isShopAds) return a.isShopAds ? -1 : 1;
      return b.primary - a.primary;
    }).slice(0, 3);
  }, [products, clips]);

  const statsPending = useMemo(() => getStatsPending(clips), [clips]);
  const totalPending = statsPending.pending24h.length + statsPending.pending7d.length;

  const repostCandidates = useMemo(() => getRepostCandidates(clips, products).slice(0, 5), [clips, products]);
  const concentration = useMemo(() => getConcentration(clips, products, 30), [clips, products]);
  const concentrationAlert = concentration && concentration.pct >= CONCENTRATION_LIMIT;
  const blended = useMemo(() => getBlendedCommission(products, clips, 30), [products, clips]);

  const clipsThisMonth = useMemo(() => clips.filter(c => c.postedAt?.slice(0, 7) === currentMonth()).length, [clips]);
  const targetProgress = monthlyTarget > 0 ? Math.min(100, Math.round((clipsThisMonth / monthlyTarget) * 100)) : 0;
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const dayOfMonth = new Date().getDate();
  const expectedProgress = Math.round((dayOfMonth / daysInMonth) * 100);
  const onTrack = targetProgress >= expectedProgress - 5;
  const [editingTarget, setEditingTarget] = useState(false);
  const [targetDraft, setTargetDraft] = useState(monthlyTarget);
  useEffect(() => setTargetDraft(monthlyTarget), [monthlyTarget]);

  return (
    <div className="space-y-5">
      <div className="flex items-baseline justify-between">
        <div><h1 className="font-display text-2xl md:text-3xl lg:text-4xl">สวัสดี, ภีม</h1><p className="text-stone-500 text-sm mt-1">{new Date().toLocaleDateString('th-TH', { weekday: 'long', day: 'numeric', month: 'long' })}</p></div>
        <div className="text-right"><div className="font-mono font-bold text-2xl">{clipsToday.length}</div><div className="text-xs text-stone-500">คลิปวันนี้</div></div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        <StatCard icon={Package} label="สินค้า" value={products.length} sub={`Lock ${lockedProducts.length}`} />
        <StatCard icon={Activity} label="คลิป 7 วัน" value={totalClips} sub={`${avgPerDay}/วัน`} />
        <StatCard icon={DollarSign} label="GMV คลิป (เดือนนี้)" value={fmtNum(totalGMVMonth)} sub="จากที่บันทึก" />
        <StatCard icon={Flame} label="GMV จริง 30d" value={fmtNum(tiktokTotal30d)} sub={tiktokTotal30d > 0 ? "จาก TikTok manual" : "ยังไม่ได้กรอก"} />
      </div>

      <Card>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase tracking-wider font-bold text-stone-600">🎯 เป้าเดือนนี้</span>
              {!editingTarget ? (<button onClick={() => setEditingTarget(true)} className="text-[10px] text-stone-400 hover:text-stone-700"><Edit3 className="w-3 h-3" /></button>) : null}
            </div>
            {editingTarget ? (
              <div className="flex gap-1 items-center">
                <input type="number" value={targetDraft} onChange={e => setTargetDraft(Number(e.target.value) || 0)} className="w-16 text-sm px-2 py-1 border border-stone-200 rounded font-mono" autoFocus />
                <button onClick={async () => { await onSetMonthlyTarget(targetDraft); setEditingTarget(false); }} className="text-xs bg-emerald-500 text-white px-2 py-1 rounded">✓</button>
                <button onClick={() => { setTargetDraft(monthlyTarget); setEditingTarget(false); }} className="text-xs bg-stone-200 px-2 py-1 rounded">✕</button>
              </div>
            ) : (
              <div className="font-display text-2xl leading-none">{clipsThisMonth}<span className="text-stone-400 text-base">/{monthlyTarget}</span></div>
            )}
            <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden mt-2">
              <div className={`h-full transition-all ${onTrack ? 'bg-emerald-500' : 'bg-amber-400'}`} style={{ width: `${targetProgress}%` }}></div>
            </div>
            <div className="text-[10px] text-stone-500 mt-1">{targetProgress}% · คาดว่าจะอยู่ที่ {expectedProgress}% {onTrack ? '✓' : '⚠️ ช้า'}</div>
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-wider font-bold text-stone-600 mb-1">💰 Blended Commission</div>
            {blended ? (<>
              <div className="font-display text-2xl leading-none">{blended.blended}<span className="text-stone-400 text-base">%</span></div>
              <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden mt-2">
                <div className={`h-full transition-all ${blended.blended >= BLENDED_COMMISSION_TARGET ? 'bg-emerald-500' : 'bg-amber-400'}`} style={{ width: `${Math.min(100, (blended.blended / BLENDED_COMMISSION_TARGET) * 100)}%` }}></div>
              </div>
              <div className="text-[10px] text-stone-500 mt-1">เป้า {BLENDED_COMMISSION_TARGET}% {blended.blended >= BLENDED_COMMISSION_TARGET ? '✓ ถึงเป้า' : `⚠️ ต่ำกว่า ${(BLENDED_COMMISSION_TARGET - blended.blended).toFixed(1)}%`}</div>
            </>) : (<div className="text-xs text-stone-400 mt-2">ยังไม่มียอด TikTok ในระบบ — กรอกใน Edit Info</div>)}
          </div>
        </div>
      </Card>

      {concentrationAlert && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-md p-3 flex items-start gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <div className="font-display text-sm text-amber-900">⚠️ พึ่งพิงสินค้าตัวเดียว {concentration.pct}%</div>
            <div className="text-xs text-amber-800 mt-1">{concentration.product?.name} กิน {concentration.pct}% ของ GMV 30 วัน — ควรเริ่มดันตัวสำรองด้วย</div>
          </div>
        </div>
      )}

      {trendingProducts.length > 0 && (
        <Card>
          <h3 className="font-display text-lg flex items-center gap-2 mb-1"><Flame className="w-5 h-5 text-rose-500" /> 🔥 Trending Now (7d)</h3>
          <p className="text-xs text-stone-500 mb-3">สินค้าที่ยอดขายดี — ดันต่อด่วน!</p>
          <div className="space-y-2">{trendingProducts.map((t, i) => (
            <button key={t.product.id} onClick={() => onSelectProduct(t.product.id)} className="w-full p-3 bg-gradient-to-r from-rose-50 to-amber-50 border border-rose-200 rounded-md hover:from-rose-100 transition text-left">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 min-w-0"><span className="text-amber-500 font-display">#{i + 1}</span><CategoryBadge cat={t.product.category} />{t.isShopAds && <span className="text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded font-bold flex-shrink-0">🛒</span>}<span className="font-semibold truncate">{truncate(t.product.name, 25)}</span></div>
                <ChevronRight className="w-4 h-4 text-stone-400 flex-shrink-0" />
              </div>
              <div className="ml-8 space-y-0.5">
                {t.hasManual && <div className="text-xs"><span className="text-emerald-700 font-bold">📈 TikTok 7d: ฿{fmtNum(t.manual7d)}</span></div>}
                <div className="text-xs text-stone-600"><span className="font-mono">🎬 คลิป: ฿{fmtNum(t.totalGMV)} ({t.clipCount} คลิป, ฿{fmtNum(Math.round(t.revPerClip))}/คลิป)</span></div>
              </div>
            </button>
          ))}</div>
        </Card>
      )}

      {totalPending > 0 && (
        <Card>
          <h3 className="font-display text-lg flex items-center gap-2 mb-2"><Clock className="w-5 h-5 text-sky-500" /> 📊 ต้องอัพเดท Views</h3>
          <p className="text-xs text-stone-500 mb-3">คลิปที่ครบเวลาแล้ว — เปิดดู TikTok แล้วใส่ตัวเลขเลย</p>
          <div className="space-y-1.5">
            {statsPending.pending24h.slice(0, 3).map(c => { const p = products.find(pp => pp.id === c.productId); const hrs = Math.round(hoursSince(c.postedAt)); return (<button key={c.id} onClick={() => onEditClip(c.id)} className="w-full flex items-center gap-2 p-2 bg-sky-50 border border-sky-200 rounded text-left hover:bg-sky-100"><span className="text-[10px] font-bold bg-sky-600 text-white px-1.5 py-0.5 rounded flex-shrink-0">24h</span><div className="flex-1 min-w-0"><div className="text-sm font-semibold line-clamp-1">{truncate(c.hook, 35) || '(ไม่มี hook)'}</div><div className="text-[10px] text-stone-600">{c.isV ? 'V' : truncate(p?.name, 20)} · ลงไป {hrs}h ที่แล้ว</div></div><ChevronRight className="w-4 h-4 text-stone-400 flex-shrink-0" /></button>); })}
            {statsPending.pending7d.slice(0, 3).map(c => { const p = products.find(pp => pp.id === c.productId); const days = Math.round(hoursSince(c.postedAt) / 24); return (<button key={c.id} onClick={() => onEditClip(c.id)} className="w-full flex items-center gap-2 p-2 bg-violet-50 border border-violet-200 rounded text-left hover:bg-violet-100"><span className="text-[10px] font-bold bg-violet-600 text-white px-1.5 py-0.5 rounded flex-shrink-0">7d</span><div className="flex-1 min-w-0"><div className="text-sm font-semibold line-clamp-1">{truncate(c.hook, 35) || '(ไม่มี hook)'}</div><div className="text-[10px] text-stone-600">{c.isV ? 'V' : truncate(p?.name, 20)} · ลงไป {days}d ที่แล้ว</div></div><ChevronRight className="w-4 h-4 text-stone-400 flex-shrink-0" /></button>); })}
          </div>
        </Card>
      )}

      {repostCandidates.length > 0 && (
        <Card>
          <h3 className="font-display text-lg flex items-center gap-2 mb-3"><Repeat className="w-5 h-5 text-violet-500" /> 📅 ต้อง Repost</h3>
          <p className="text-xs text-stone-500 mb-3">Winner clips ที่ผ่านมา 7d/14d/30d แล้ว — ทำซ้ำตอนนี้!</p>
          <div className="space-y-2">{repostCandidates.map(r => (
            <div key={r.clip.id} className="flex flex-col gap-2 p-2.5 bg-violet-50 border border-violet-200 rounded-md">
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-semibold truncate">{truncate(r.clip.hook, 35) || '(ไม่มี hook)'}</div>
                  <div className="text-[10px] text-stone-600">{r.product?.name ? truncate(r.product.name, 20) : 'V'} · ฿{fmtNum(r.clip.gmv)} · {r.daysOld}d ที่แล้ว</div>
                </div>
                <span className="text-[10px] font-bold bg-violet-600 text-white px-1.5 py-0.5 rounded flex-shrink-0">{r.repostBucket}d</span>
              </div>
              <div className="flex gap-1">
                <button onClick={() => onMakeSimilar(r.clip)} className="flex-1 text-xs bg-lime-400 text-stone-900 font-semibold px-2 py-1.5 rounded">ทำซ้ำ →</button>
                <button onClick={() => onMarkRepostDone(r.clip.id, r.repostBucket)} className="flex-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-2 py-1.5 rounded flex items-center justify-center gap-1"><CheckCircle2 className="w-3 h-3" /> ทำแล้ว</button>
              </div>
            </div>
          ))}</div>
        </Card>
      )}

      <Card>
        <div className="flex items-center justify-between mb-3"><h3 className="font-display text-lg flex items-center gap-2"><Zap className="w-5 h-5 text-lime-500" /> ABCD Posting Pattern</h3><span className="text-xs text-stone-500">7 วันล่าสุด</span></div>
        {pattern.length === 0 ? (<div className="text-center py-6 text-stone-400 text-sm">ยังไม่มีคลิป — เริ่มบันทึกได้เลย</div>) : (<>
          <div className="flex flex-wrap gap-1.5 mb-3">{pattern.map((cat, i) => { const info = ABCD_INFO[cat] || { bg: 'bg-stone-300', short: '?' }; return (<div key={i} className={`w-8 h-8 rounded-md ${info.bg} text-white font-display flex items-center justify-center text-sm shadow-sm`}>{info.short}</div>); })}</div>
          {hasRepeatIssue && (<div className="flex items-start gap-2 bg-rose-50 border border-rose-200 rounded-md p-2 text-xs text-rose-800 mb-2"><AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" /><div>เจอ <strong>{[...new Set(repeats)].join(', ')}</strong> ติด 3 ครั้งขึ้นไป — สลับ ABCD ฟันปลา</div></div>)}
          {recommendation && (<div className="flex items-start gap-2 bg-emerald-50 border border-emerald-200 rounded-md p-2 text-xs text-emerald-800"><Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" /><div>คลิปต่อไปลอง <strong>{recommendation.join(' หรือ ')}</strong> เพื่อให้ครบ Variety</div></div>)}
          <div className="grid grid-cols-5 gap-1 mt-3 text-[10px]">{Object.entries(ABCD_INFO).map(([k, info]) => { const count = pattern.filter(p => p === k).length; return (<div key={k} className="text-center"><div className={`w-full h-1 ${info.bg} rounded-full mb-1`}></div><span className="font-semibold">{info.short}</span> <span className="text-stone-500">{count}</span></div>); })}</div>
        </>)}
      </Card>

      <Card>
        <h3 className="font-display text-lg flex items-center gap-2 mb-3"><Target className="w-5 h-5 text-violet-500" /> หลัก 3V (7 วัน)</h3>
        <div className="grid grid-cols-3 gap-3"><VBar label="Volume" value={totalClips} target={21} sub={`${avgPerDay}/วัน`} /><VBar label="Value" value={vRatio} target={30} sub={`${vRatio}%`} suffix="%" /><VBar label="Variety" value={uniqueProducts} target={4} sub={`${uniqueProducts} สินค้า`} /></div>
      </Card>

      {productsNeedingRescore.length > 0 && (<Card>
        <h3 className="font-display text-lg flex items-center gap-2 mb-3"><RefreshCw className="w-5 h-5 text-amber-500" /> ต้องคัดกรองใหม่</h3>
        <div className="space-y-2">{productsNeedingRescore.slice(0, 5).map(p => (<button key={p.id} onClick={() => onSelectProduct(p.id)} className="w-full flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-md hover:bg-amber-100 transition text-left"><div className="flex items-center gap-3"><CategoryBadge cat={p.category} /><div><div className="font-semibold truncate max-w-[200px]">{truncate(p.name, 30)}</div><div className="text-xs text-stone-500">คัดล่าสุด {daysSince(p.lastScoredAt)} วันที่แล้ว</div></div></div><ChevronRight className="w-4 h-4 text-stone-400" /></button>))}</div>
      </Card>)}

      {lockedProducts.length > 0 && (<Card>
        <div className="flex items-center justify-between mb-3"><h3 className="font-display text-lg flex items-center gap-2"><Lock className="w-5 h-5 text-stone-700" /> Lock เดือนนี้</h3><button onClick={() => onGoTo('lock')} className="text-xs text-stone-500 hover:text-stone-900">ดูทั้งหมด →</button></div>
        <div className="space-y-2">{lockedProducts.map(p => { const made = clips.filter(c => c.productId === p.id && c.postedAt?.slice(0, 7) === currentMonth()).length; const target = p.locked?.targetClips || 1; const pct = Math.min(100, Math.round((made / target) * 100)); return (<button key={p.id} onClick={() => onSelectProduct(p.id)} className="w-full p-3 bg-stone-50 hover:bg-stone-100 rounded-md transition text-left"><div className="flex items-center justify-between mb-2"><div className="flex items-center gap-2 min-w-0"><CategoryBadge cat={p.category} /><span className="font-semibold truncate">{truncate(p.name, 25)}</span></div><span className="font-mono text-sm flex-shrink-0">{made}/{target}</span></div><div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden"><div className={`h-full ${pct >= 100 ? 'bg-emerald-500' : 'bg-lime-400'} transition-all`} style={{ width: `${pct}%` }}></div></div></button>); })}</div>
      </Card>)}
    </div>
  );
}

function ProductHubPage({ products, clips, onAdd, onSelect }) {
  const [filter, setFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState(() => { try { return localStorage.getItem('peem6pack_viewMode') || 'box'; } catch { return 'box'; } });
  useEffect(() => { try { localStorage.setItem('peem6pack_viewMode', viewMode); } catch {} }, [viewMode]);
  const [sortBy, setSortBy] = useState('score');

  const filtered = useMemo(() => {
    let list = products.filter(p => {
      if (['A', 'B', 'C', 'D'].includes(filter)) { if (p.category !== filter) return false; }
      else if (filter === 'locked' && !p.locked) return false;
      else if (filter === 'pick' && p.decision !== 'PICK') return false;
      else if (filter === 'wait' && p.decision !== 'WAIT') return false;
      else if (filter === 'drop' && p.decision !== 'DROP') return false;
      if (typeFilter !== 'all' && p.productType !== typeFilter) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
    if (sortBy === 'score') list.sort((a, b) => (b.scorePct || 0) - (a.scorePct || 0));
    else if (sortBy === 'rescore') list.sort((a, b) => daysSince(b.lastScoredAt) - daysSince(a.lastScoredAt));
    else if (sortBy === 'name') list.sort((a, b) => (a.name || '').localeCompare(b.name || '', 'th'));
    else if (sortBy === 'created') list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return list;
  }, [products, filter, typeFilter, search, sortBy]);

  return (<div className="space-y-4">
    <div className="flex items-center justify-between"><h1 className="font-display text-2xl md:text-3xl lg:text-4xl">สินค้า ({products.length})</h1><button onClick={onAdd} className="bg-lime-400 text-stone-900 font-semibold text-sm px-4 py-2 rounded-md hover:bg-lime-300 shadow-sm flex items-center gap-1"><Plus className="w-4 h-4" /> เพิ่ม</button></div>
    <div className="space-y-2">
      <div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="ค้นหาสินค้า..." className="w-full pl-10 pr-3 py-2 bg-white border border-stone-200 rounded-md text-sm" /></div>
      <div className="flex gap-1 overflow-x-auto scrollbar-thin pb-1">{[{ id: 'all', label: 'ทั้งหมด' }, { id: 'pick', label: '🟢 PICK' }, { id: 'wait', label: '🟡 WAIT' }, { id: 'drop', label: '🔴 DROP' }, { id: 'locked', label: '🔒 Lock' }, { id: 'A', label: 'A — ขายดี' }, { id: 'B', label: 'B — มาใหม่' }, { id: 'C', label: 'C — ประหยัด' }, { id: 'D', label: 'D — คอมสูง' }].map(f => (<button key={f.id} onClick={() => setFilter(f.id)} className={`whitespace-nowrap text-xs px-3 py-1.5 rounded-full transition ${filter === f.id ? 'bg-lime-400 text-stone-900 font-semibold' : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-400'}`}>{f.label}</button>))}</div>
      <div className="flex gap-1 overflow-x-auto scrollbar-thin pb-1">
        <button onClick={() => setTypeFilter('all')} className={`whitespace-nowrap text-xs px-3 py-1 rounded-full transition ${typeFilter === 'all' ? 'bg-violet-600 text-white font-semibold' : 'bg-white border border-stone-200 text-stone-600'}`}>📦 ทุกหมวด</button>
        {PRODUCT_TYPES.map(t => (<button key={t.id} onClick={() => setTypeFilter(t.id)} className={`whitespace-nowrap text-xs px-3 py-1 rounded-full transition ${typeFilter === t.id ? 'bg-violet-600 text-white font-semibold' : 'bg-white border border-stone-200 text-stone-600'}`}>{t.emoji} {t.label}</button>))}
      </div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 text-xs"><ArrowUpDown className="w-3 h-3 text-stone-400" /><select value={sortBy} onChange={e => setSortBy(e.target.value)} className="text-xs bg-white border border-stone-200 rounded px-2 py-1"><option value="score">คะแนน (สูง→ต่ำ)</option><option value="rescore">วันคัดล่าสุด (เก่า→ใหม่)</option><option value="name">ชื่อ A-Z</option><option value="created">เพิ่มล่าสุด</option></select><span className="text-stone-400 ml-1">{filtered.length} ตัว</span></div>
        <div className="flex bg-white border border-stone-200 rounded-md p-0.5"><button onClick={() => setViewMode('box')} className={`p-1.5 rounded transition ${viewMode === 'box' ? 'bg-lime-400 text-stone-900' : 'text-stone-500'}`}><LayoutGrid className="w-3.5 h-3.5" /></button><button onClick={() => setViewMode('list')} className={`p-1.5 rounded transition ${viewMode === 'list' ? 'bg-lime-400 text-stone-900' : 'text-stone-500'}`}><List className="w-3.5 h-3.5" /></button></div>
      </div>
    </div>
    {filtered.length === 0 ? (<Card><div className="text-center py-8"><Package className="w-12 h-12 text-stone-300 mx-auto mb-3" /><p className="text-stone-500 text-sm">{products.length === 0 ? 'ยังไม่มีสินค้า' : 'ไม่พบสินค้าที่ตรงกับตัวกรอง'}</p></div></Card>) : viewMode === 'box' ? (<div className="grid sm:grid-cols-2 gap-3">{filtered.map(p => (<ProductCard key={p.id} product={p} clipCount={clips.filter(c => c.productId === p.id).length} onClick={() => onSelect(p.id)} />))}</div>) : (<div className="bg-white border border-stone-200 rounded-md overflow-hidden">{filtered.map((p, i) => (<ProductListRow key={p.id} product={p} clipCount={clips.filter(c => c.productId === p.id).length} onClick={() => onSelect(p.id)} isLast={i === filtered.length - 1} />))}</div>)}
  </div>);
}

function ProductCard({ product, clipCount, onClick }) {
  const decision = DECISION_INFO[product.decision];
  const isStale = daysSince(product.lastScoredAt) >= RESCORE_DAYS;
  const productType = PRODUCT_TYPES.find(t => t.id === product.productType);
  const commission = product.scorecard?.commission;
  return (<button onClick={onClick} className="text-left bg-white border border-stone-200 rounded-md p-4 hover:border-stone-400 transition relative">
    {product.locked && <div className="absolute top-3 right-3"><Lock className="w-4 h-4 text-stone-700" /></div>}
    <div className="flex items-center gap-1 mb-2 flex-wrap"><CategoryBadge cat={product.category} />{productType && <span className="text-[10px] bg-stone-100 text-stone-600 px-1.5 py-0.5 rounded">{productType.emoji} {productType.label}</span>}{product.tiktokRank && <span className="text-[10px] bg-rose-100 text-rose-700 px-1.5 py-0.5 rounded font-bold">🏆 #{product.tiktokRank}</span>}{product.isShopAds && <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded font-bold">🛒 ตะกร้าแดง</span>}{product.price > 0 && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded font-mono">฿{fmtNum(product.price)}</span>}{commission && <span className="text-[10px] bg-violet-100 text-violet-700 px-1.5 py-0.5 rounded font-mono">คอม {commission}%</span>}{product.gmvMaxPct && <span className="text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded font-mono">⚡{product.gmvMaxPct}%</span>}{isStale && <span className="text-[10px] bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded font-semibold">ค้างคัดกรอง</span>}</div>
    <h3 className="font-display text-lg leading-tight mb-1 line-clamp-2">{product.name}</h3>
    {product.brand && <p className="text-xs text-stone-500 mb-1 line-clamp-1">{product.brand}</p>}
    <div className="text-[10px]"><RescoreText lastScoredAt={product.lastScoredAt} /></div>
    <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-100"><div><div className="font-mono text-sm">{product.score}/{product.maxScore} <span className="text-stone-400">({product.scorePct}%)</span></div><div className="text-[10px] text-stone-500 mt-0.5">{product.maxScore === ARGOON_MAX ? (product.score >= ARGOON_PASS ? '✓ Argoon PASS' : product.score >= ARGOON_WATCH ? '⏳ WATCH' : '✕ CUT') : `${clipCount} คลิป`}</div></div>{decision && <div className={`text-xs font-bold px-2 py-1 rounded ${decision.bg} text-white`}>{decision.label}</div>}</div>
  </button>);
}

function ProductListRow({ product, clipCount, onClick, isLast }) {
  const decision = DECISION_INFO[product.decision];
  const productType = PRODUCT_TYPES.find(t => t.id === product.productType);
  const commission = product.scorecard?.commission;
  return (<button onClick={onClick} className={`w-full flex items-center gap-3 p-3 hover:bg-stone-50 transition text-left ${!isLast ? 'border-b border-stone-100' : ''}`}>
    <CategoryBadge cat={product.category} />
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2"><h3 className="font-display text-sm truncate">{product.name}</h3>{product.locked && <Lock className="w-3 h-3 text-stone-500 flex-shrink-0" />}</div>
      <div className="text-[10px] text-stone-500 flex items-center gap-1.5 flex-wrap">{productType && <span>{productType.emoji}</span>}{product.tiktokRank && <span className="font-bold text-rose-700">🏆 #{product.tiktokRank}</span>}{product.isShopAds && <span className="font-bold text-red-700">🛒</span>}{product.price > 0 && <span className="font-mono text-emerald-700">฿{fmtNum(product.price)}</span>}{commission && <span className="font-mono">คอม {commission}%</span>}{product.gmvMaxPct && <span className="font-mono text-amber-700">⚡{product.gmvMaxPct}%</span>}<span>· {clipCount} คลิป</span><RescoreText lastScoredAt={product.lastScoredAt} /></div>
    </div>
    <div className="text-right flex-shrink-0"><div className="font-mono text-xs font-bold">{product.scorePct}%</div>{decision && <div className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded ${decision.bg} text-white mt-0.5`}>{decision.label}</div>}</div>
    <ChevronRight className="w-4 h-4 text-stone-400 flex-shrink-0" />
  </button>);
}

function ProductDetailPage({ product, clips, allClips, onBack, onTogglePillar, onSetCategory, onAddPain, onRemovePain, onAddAngle, onRemoveAngle, onEditScore, onEditInfo, onLock, onUnlock, onDelete, onAddClip, onEditClip, showToast }) {
  const decision = DECISION_INFO[product.decision];
  const angleProgress = (product.angles?.length || 0);
  const anglePct = Math.min(100, Math.round((angleProgress / TARGET_ANGLES) * 100));
  const productType = PRODUCT_TYPES.find(t => t.id === product.productType);
  const bestAngle = useMemo(() => getBestAngle(product, clips), [product, clips]);
  const commission = product.scorecard?.commission;
  const sales7d = useMemo(() => getProductSales(product, clips, 7), [product, clips]);
  const sales30d = useMemo(() => getProductSales(product, clips, 30), [product, clips]);
  return (<div className="space-y-4">
    <button onClick={onBack} className="flex items-center gap-1 text-sm text-stone-500 hover:text-stone-900"><ChevronLeft className="w-4 h-4" /> กลับ</button>
    <div className="bg-stone-900 text-stone-50 rounded-md p-5">
      <div className="flex items-start justify-between mb-3"><div className="flex-1 min-w-0">
        <div className="flex items-center gap-1 mb-2 flex-wrap">{productType && <span className="text-xs bg-stone-700 px-2 py-0.5 rounded">{productType.emoji} {productType.label}</span>}{product.tiktokRank && <span className="text-xs bg-rose-600 text-rose-50 px-2 py-0.5 rounded font-bold">🏆 Top #{product.tiktokRank}</span>}{product.isShopAds && <span className="text-xs bg-red-600 text-red-50 px-2 py-0.5 rounded font-bold">🛒 ตะกร้าแดง</span>}{product.price > 0 && <span className="text-xs bg-emerald-700 text-emerald-50 px-2 py-0.5 rounded font-mono">💰 ฿{fmtNum(product.price)}</span>}{commission && <span className="text-xs bg-violet-700 text-violet-100 px-2 py-0.5 rounded font-mono">คอม {commission}%</span>}{product.gmvMaxPct && <span className="text-xs bg-amber-600 text-amber-50 px-2 py-0.5 rounded font-mono">⚡ MAX {product.gmvMaxPct}%</span>}</div>
        <h1 className="font-display text-2xl mb-1 leading-tight">{product.name}</h1>{product.brand && <p className="text-stone-400 text-sm">{product.brand}</p>}
        <div className="flex gap-2 mt-2 flex-wrap">{product.tiktokLink && (<a href={product.tiktokLink} target="_blank" rel="noopener noreferrer" className="text-xs bg-emerald-900 hover:bg-emerald-800 text-stone-100 px-2 py-1 rounded inline-flex items-center gap-1"><ExternalLink className="w-3 h-3" /> TikTok</a>)}{product.kalodataLink && (<a href={product.kalodataLink} target="_blank" rel="noopener noreferrer" className="text-xs bg-emerald-900 hover:bg-emerald-800 text-stone-100 px-2 py-1 rounded inline-flex items-center gap-1"><ExternalLink className="w-3 h-3" /> Kalodata</a>)}</div>
      </div><div className="flex flex-col gap-1 flex-shrink-0">{product.locked ? (<button onClick={onUnlock} className="bg-amber-400 text-stone-900 text-xs font-bold px-3 py-1.5 rounded flex items-center gap-1"><Lock className="w-3 h-3" /> Locked</button>) : (<button onClick={onLock} className="bg-stone-700 text-stone-100 text-xs font-semibold px-3 py-1.5 rounded hover:bg-stone-600">🔒 Lock เดือนนี้</button>)}<button onClick={onEditInfo} className="bg-stone-800 text-stone-200 text-xs px-3 py-1.5 rounded hover:bg-stone-700 flex items-center gap-1"><Edit3 className="w-3 h-3" /> แก้ไข Info</button></div></div>
      <div className="flex items-center gap-2 flex-wrap mb-3"><span className="text-xs text-stone-400 uppercase tracking-wider mr-1">หมวด ABCD:</span>{Object.entries(ABCD_INFO).filter(([k]) => k !== 'V').map(([k, info]) => (<button key={k} onClick={() => onSetCategory(k)} className={`text-xs font-bold px-2 py-1 rounded transition ${product.category === k ? `${info.bg} text-white` : 'bg-stone-800 text-stone-400 hover:bg-stone-700'}`}>{info.short}</button>))}</div>
      <div className="flex items-center gap-4 pt-3 border-t border-stone-800">
        <div><div className="text-[10px] text-stone-400 uppercase tracking-wider">Score</div><div className="font-mono text-2xl">{product.score}/{product.maxScore}</div><div className="text-xs text-stone-400">{product.scorePct}%</div></div>
        <div><div className="text-[10px] text-stone-400 uppercase tracking-wider">Decision</div>{decision && <div className={`inline-block font-bold px-2 py-1 rounded text-sm ${decision.bg} text-white mt-1`}>{decision.label}</div>}<div className="text-xs text-stone-400 mt-1"><RescoreText lastScoredAt={product.lastScoredAt} /></div></div>
        <button onClick={onEditScore} className="ml-auto bg-lime-400 text-stone-900 text-xs font-bold px-3 py-2 rounded flex items-center gap-1 hover:bg-lime-300"><RefreshCw className="w-3 h-3" /> คัดใหม่</button>
      </div>
    </div>
    <div className="grid grid-cols-2 gap-3">
      <Card className="bg-gradient-to-br from-emerald-50 to-white border-emerald-200">
        <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider mb-1">📈 จาก TikTok (จริง)</div>
        {sales7d.hasManual || sales30d.hasManual ? (<>
          <div className="space-y-1">
            <div className="flex items-baseline justify-between"><span className="text-xs text-stone-600">7 วัน</span><span className="font-mono font-bold">฿{fmtNum(sales7d.fromManual)}</span></div>
            <div className="flex items-baseline justify-between"><span className="text-xs text-stone-600">30 วัน</span><span className="font-mono font-bold">฿{fmtNum(sales30d.fromManual)}</span></div>
          </div>
          {product.price > 0 && sales30d.fromManual > 0 && (() => { const orders30d = Math.round(sales30d.fromManual / product.price); const ordersPerDay = (orders30d / 30).toFixed(1); const comm = Number(product.scorecard?.commission) || 0; const commPerOrder = comm > 0 ? Math.round(product.price * comm / 100) : 0; return (<div className="mt-2 pt-2 border-t border-emerald-200 text-[10px] space-y-0.5">
            <div className="flex justify-between"><span className="text-stone-600">≈ Orders 30d</span><span className="font-mono font-bold text-emerald-700">{orders30d} <span className="text-stone-500 font-normal">({ordersPerDay}/วัน)</span></span></div>
            {commPerOrder > 0 && <div className="flex justify-between"><span className="text-stone-600">คอม/order</span><span className="font-mono font-bold text-emerald-700">฿{fmtNum(commPerOrder)}</span></div>}
          </div>); })()}
          {product.salesData?.updatedAt && <div className="text-[9px] text-stone-500 mt-2">อัพเดท {daysSince(product.salesData.updatedAt)}d ก่อน</div>}
        </>) : (<><div className="text-xs text-stone-500 mb-1">ยังไม่ได้กรอก</div><button onClick={onEditInfo} className="text-[10px] text-emerald-700 underline">+ กรอกยอดจาก TikTok</button></>)}
      </Card>
      <Card className="bg-gradient-to-br from-violet-50 to-white border-violet-200">
        <div className="text-[10px] font-bold text-violet-700 uppercase tracking-wider mb-1">🎬 จากคลิป (Attribution)</div>
        <div className="space-y-1">
          <div className="flex items-baseline justify-between"><span className="text-xs text-stone-600">7 วัน</span><span className="font-mono font-bold">฿{fmtNum(sales7d.fromClips)}</span></div>
          <div className="flex items-baseline justify-between"><span className="text-xs text-stone-600">30 วัน</span><span className="font-mono font-bold">฿{fmtNum(sales30d.fromClips)}</span></div>
        </div>
        {sales7d.attributionPct !== null && (<div className="text-[9px] text-stone-500 mt-2">Attribution 7d: <strong>{sales7d.attributionPct}%</strong>{sales7d.attributionPct < 30 && ' — ต่ำ ลองบันทึกคลิปเพิ่ม'}</div>)}
      </Card>
    </div>
    <Card><h3 className="font-display text-base mb-2">📌 Pillars ที่ใช้ได้</h3>
      <div className="grid grid-cols-2 gap-2">{DEFAULT_PILLARS.map(p => { const on = product.pillars?.includes(p.id); return (<button key={p.id} onClick={() => onTogglePillar(p.id)} className={`text-left p-2.5 rounded-md border transition ${on ? 'bg-stone-900 text-white border-stone-900' : 'bg-white border-stone-200 hover:border-stone-400'}`}><div className="flex items-center gap-1 mb-0.5"><span>{p.emoji}</span><span className="font-bold text-xs">{p.id}</span></div><div className={`text-xs ${on ? 'text-stone-300' : 'text-stone-600'}`}>{p.desc}</div></button>); })}</div>
    </Card>
    <Card><div className="flex items-center justify-between mb-2"><h3 className="font-display text-base">😣 Pain Bank ({product.pains?.length || 0})</h3><button onClick={onAddPain} className="text-xs bg-lime-400 text-stone-900 font-semibold px-3 py-1 rounded">+ เพิ่ม Pain</button></div>
      {(!product.pains || product.pains.length === 0) ? (<p className="text-stone-400 text-sm text-center py-3">ยังไม่มี Pain — เพิ่ม Pain ก่อนเพื่อใช้ใน Splitter</p>) : (<div className="space-y-1.5">{product.pains.map(p => { const src = PAIN_SOURCES.find(s => s.id === p.source); return (<div key={p.id} className="flex items-start justify-between gap-2 p-2 bg-stone-50 rounded"><div className="flex-1 min-w-0"><div className="text-sm">{p.text}</div>{src && <div className="text-[10px] text-stone-500 mt-0.5">{src.label}</div>}</div><button onClick={() => onRemovePain(p.id)} className="p-1 text-stone-300 hover:text-rose-500"><Trash2 className="w-3.5 h-3.5" /></button></div>); })}</div>)}
    </Card>
    <Card><div className="flex items-center justify-between mb-2"><h3 className="font-display text-base">🎯 Angle Bank ({angleProgress}/{TARGET_ANGLES})</h3><button onClick={onAddAngle} className="text-xs bg-lime-400 text-stone-900 font-semibold px-3 py-1 rounded">+ เพิ่ม Angle</button></div>
      <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden mb-3"><div className={`h-full ${anglePct >= 100 ? 'bg-emerald-500' : anglePct >= 70 ? 'bg-lime-400' : 'bg-amber-400'} transition-all`} style={{ width: `${anglePct}%` }}></div></div>
      {anglePct < 100 && <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2 mb-3">เป้าหมาย 5-7 มุม/สินค้า — ขาดอีก {TARGET_ANGLES - angleProgress} มุม</div>}
      {bestAngle && bestAngle.count > 0 && (<div className="bg-gradient-to-r from-amber-50 to-lime-50 border border-amber-300 rounded p-2.5 mb-3"><div className="flex items-center gap-1 text-xs font-bold text-amber-900 mb-1"><Trophy className="w-3.5 h-3.5" /> 🏆 Best Angle</div><div className="text-sm font-semibold">{bestAngle.angle.text}</div><div className="text-xs text-stone-600 mt-1 font-mono">฿{fmtNum(Math.round(bestAngle.avg))}/คลิป · {bestAngle.count} คลิป · ฿{fmtNum(bestAngle.totalGMV)} รวม</div></div>)}
      {(!product.angles || product.angles.length === 0) ? (<p className="text-stone-400 text-sm text-center py-3">ยังไม่มี Angle</p>) : (<div className="space-y-1.5">{product.angles.map(a => { const isBest = bestAngle && bestAngle.angle.id === a.id; return (<div key={a.id} className={`flex items-start justify-between gap-2 p-2 rounded ${isBest ? 'bg-amber-50 border border-amber-200' : 'bg-stone-50'}`}><div className="text-sm flex-1 min-w-0">{isBest && '🏆 '}{a.text}</div><button onClick={() => onRemoveAngle(a.id)} className="p-1 text-stone-300 hover:text-rose-500"><Trash2 className="w-3.5 h-3.5" /></button></div>); })}</div>)}
    </Card>
    <SplitterSection product={product} />
    <Card><div className="flex items-center justify-between mb-3"><h3 className="font-display text-base">🎬 Clips ของสินค้านี้ ({clips.length})</h3><button onClick={onAddClip} className="text-xs bg-lime-400 text-stone-900 font-semibold px-3 py-1 rounded">+ บันทึกคลิป</button></div>
      {clips.length === 0 ? (<p className="text-stone-400 text-sm text-center py-4">ยังไม่มีคลิป</p>) : (<div className="space-y-2">{[...clips].reverse().map(c => (<ClipRow key={c.id} clip={c} onEdit={() => onEditClip(c.id)} />))}</div>)}
    </Card>
    <button onClick={onDelete} className="w-full text-xs text-rose-600 hover:bg-rose-50 py-2 rounded">🗑️ ลบสินค้านี้</button>
  </div>);
}

function SplitterSection({ product, initialValues }) {
  const [persona, setPersona] = useState(initialValues?.persona || ''); const [situation, setSituation] = useState(initialValues?.situation || '');
  const [emotion, setEmotion] = useState(initialValues?.emotion || ''); const [format, setFormat] = useState(initialValues?.format || '');
  const [pillarId, setPillarId] = useState(initialValues?.pillarId || ''); const [painId, setPainId] = useState(initialValues?.painId || '');
  const [angleId, setAngleId] = useState(initialValues?.angleId || ''); const [hook, setHook] = useState(initialValues?.hook || '');
  const [duration, setDuration] = useState('45'); const [copied, setCopied] = useState(false);
  const selectedPain = product.pains?.find(p => p.id === painId);
  const selectedAngle = product.angles?.find(a => a.id === angleId);
  const selectedPillar = DEFAULT_PILLARS.find(p => p.id === pillarId);
  const generatePrompt = () => {
    const lines = [`เขียนสคริปต์ TikTok Shop สำหรับช่อง PEEM6PACK (Fitness Affiliate Creator)`, ``, `[สินค้า]`, `ชื่อ: ${product.name}${product.brand ? ` (${product.brand})` : ''}`, `หมวด (ABCD): ${product.category ? ABCD_INFO[product.category]?.label : '-'}`, product.productType ? `ประเภท: ${PRODUCT_TYPES.find(t => t.id === product.productType)?.label}` : '', ``, `[Pillar / Pain / Angle]`, selectedPillar ? `Pillar: ${selectedPillar.id} — ${selectedPillar.name} (${selectedPillar.desc})` : 'Pillar: -', selectedPain ? `Pain: ${selectedPain.text}` : 'Pain: -', selectedAngle ? `Angle: ${selectedAngle.text}` : 'Angle: -', ``, `[Splitter]`, `Persona: ${persona || '-'}`, `Situation: ${situation || '-'}`, `Emotion: ${emotion || '-'}`, `Format: ${format || '-'}`, ``, hook ? `[Hook ที่อยากใช้]\n${hook}\n` : '', `[โครงสร้าง]`, `Hook → Problem → Value/Demo → Soft CTA`, ``, `[เงื่อนไข]`, `- พูดแบบเพื่อนแนะนำเพื่อน (ไม่สั่งสอน, ไม่เวอร์)`, `- ใช้จริง เทสจริง — ภีมเป็นผู้ชายวัย 31 ที่ดูแลตัวเองจริง`, `- 1 คลิป = 1 ประเด็น = 1 CTA`, `- ไม่ขายตรงเกินไป, ให้คุณค่าก่อนขาย`, ``, `[Output ที่ต้องการ]`, `1. Hook 3 แบบ`, `2. สคริปต์เต็มในรูปแบบตาราง: เวลา / Visual / Voiceover`, `3. Text Overlay หลัก 3-5 จุด`, `4. CTA แบบ Soft Sell`, `5. Caption + Hashtag`, ``, `ระยะเวลา: ${duration} วินาที`].filter(Boolean).join('\n');
    return lines;
  };
  const handleCopy = async () => { try { await navigator.clipboard.writeText(generatePrompt()); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch (e) { console.error(e); } };
  const Sel = ({ value, onChange, options, placeholder }) => (<select value={value} onChange={e => onChange(e.target.value)} className="w-full text-sm px-2 py-1.5 bg-stone-700 border border-stone-600 text-stone-50 rounded"><option value="">{placeholder || '-'}</option>{options.map(o => typeof o === 'string' ? <option key={o} value={o}>{o}</option> : <option key={o.value} value={o.value}>{o.label}</option>)}</select>);
  return (<div className="bg-gradient-to-br from-stone-900 to-stone-800 text-stone-50 rounded-md p-5">
    <h3 className="font-display text-xl mb-1 flex items-center gap-2"><Wand2 className="w-5 h-5 text-lime-400" /> Splitter</h3>
    <p className="text-xs text-stone-400 mb-4">1 Pain → 30+ คลิป — เลือกมุมแล้วสร้าง Prompt</p>
    <div className="grid grid-cols-2 gap-2 mb-3">
      <div><label className="text-[10px] uppercase tracking-wider text-stone-400 block mb-1">Pillar</label><Sel value={pillarId} onChange={setPillarId} options={DEFAULT_PILLARS.filter(p => product.pillars?.includes(p.id)).map(p => ({ value: p.id, label: `${p.id} — ${p.name}` }))} /></div>
      <div><label className="text-[10px] uppercase tracking-wider text-stone-400 block mb-1">Pain</label><Sel value={painId} onChange={setPainId} options={(product.pains || []).map(p => ({ value: p.id, label: p.text.slice(0, 40) }))} /></div>
      <div><label className="text-[10px] uppercase tracking-wider text-stone-400 block mb-1">Angle</label><Sel value={angleId} onChange={setAngleId} options={(product.angles || []).map(a => ({ value: a.id, label: a.text.slice(0, 40) }))} /></div>
      <div><label className="text-[10px] uppercase tracking-wider text-stone-400 block mb-1">Persona</label><Sel value={persona} onChange={setPersona} options={SPLITTER_OPTIONS.persona} /></div>
      <div><label className="text-[10px] uppercase tracking-wider text-stone-400 block mb-1">Situation</label><Sel value={situation} onChange={setSituation} options={SPLITTER_OPTIONS.situation} /></div>
      <div><label className="text-[10px] uppercase tracking-wider text-stone-400 block mb-1">Emotion</label><Sel value={emotion} onChange={setEmotion} options={SPLITTER_OPTIONS.emotion} /></div>
      <div><label className="text-[10px] uppercase tracking-wider text-stone-400 block mb-1">Format</label><Sel value={format} onChange={setFormat} options={SPLITTER_OPTIONS.format} /></div>
      <div><label className="text-[10px] uppercase tracking-wider text-stone-400 block mb-1">ความยาว (วิ)</label><input type="number" value={duration} onChange={e => setDuration(e.target.value)} className="w-full text-sm px-2 py-1.5 bg-stone-700 border border-stone-600 text-stone-50 rounded" /></div>
    </div>
    <div className="mb-3"><label className="text-[10px] uppercase tracking-wider text-stone-400 block mb-1">Hook (optional)</label><input value={hook} onChange={e => setHook(e.target.value)} placeholder="ใส่ Hook ที่อยากใช้..." className="w-full text-sm px-2 py-1.5 bg-stone-700 border border-stone-600 text-stone-50 rounded placeholder:text-stone-500" /></div>
    <button onClick={handleCopy} className={`w-full font-bold py-3 rounded transition flex items-center justify-center gap-2 ${copied ? 'bg-emerald-400 text-stone-900' : 'bg-lime-400 text-stone-900 hover:bg-lime-300'}`}>{copied ? <><CheckCircle2 className="w-4 h-4" /> Copied! ไปวางใน Claude/ChatGPT ได้เลย</> : <><Copy className="w-4 h-4" /> Generate & Copy Prompt</>}</button>
    <details className="mt-3"><summary className="text-xs text-stone-400 cursor-pointer hover:text-stone-200">▸ ดู Prompt ก่อน Copy</summary><pre className="text-[10px] bg-stone-950 p-3 rounded mt-2 overflow-x-auto whitespace-pre-wrap text-stone-300 font-mono">{generatePrompt()}</pre></details>
  </div>);
}

function ClipRow({ clip, onEdit }) {
  const isWinner = (Number(clip.gmv) || 0) >= WINNER_GMV;
  const level = CLIP_LEVELS.find(l => l.id === clip.level);
  return (<button onClick={onEdit} className="w-full bg-stone-50 rounded-md p-2.5 flex items-center justify-between hover:bg-stone-100 transition text-left">
    <div className="flex items-center gap-2 flex-1 min-w-0">{isWinner && <Trophy className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />}{level && <span className={`w-1.5 h-1.5 rounded-full ${level.color} flex-shrink-0`}></span>}{clip.gencodeSubmitted && <span className="text-[10px] bg-emerald-100 text-emerald-700 px-1 rounded flex-shrink-0">GC</span>}<div className="flex-1 min-w-0"><div className="text-sm font-medium line-clamp-1">{truncate(clip.hook, 40) || '(ไม่มี hook)'}</div><div className="text-[10px] text-stone-500">{fmtDate(clip.postedAt)} · 24h {fmtNum(clip.views24h || 0)} · 7d {fmtNum(clip.views7d || 0)} · ฿{fmtNum(clip.gmv || 0)}</div></div></div>
    <Edit3 className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
  </button>);
}

function LockListPage({ lockedProducts, products, clips, onSelectProduct, onUnlock, onLockNew }) {
  const monthKey = currentMonth();
  const monthLabel = new Date().toLocaleDateString('th-TH', { month: 'long', year: 'numeric' });
  const dayOfMonth = new Date().getDate();
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const daysLeft = daysInMonth - dayOfMonth;
  const expectedPct = Math.round((dayOfMonth / daysInMonth) * 100);

  const totalTarget = lockedProducts.reduce((s, p) => s + (p.locked?.targetClips || 0), 0);
  const totalMade = lockedProducts.reduce((s, p) => s + clips.filter(c => c.productId === p.id && c.postedAt?.slice(0, 7) === monthKey).length, 0);
  const overallPct = totalTarget > 0 ? Math.round((totalMade / totalTarget) * 100) : 0;
  const onTrack = overallPct >= expectedPct - 5;

  // Build stacks for each category (use ALL products for ranking, then filter locked)
  const stacks = useMemo(() => {
    const result = {};
    ['A', 'B', 'C', 'D'].forEach(cat => {
      const fullStack = getCategoryStack(products, clips, cat);
      const lockedIds = new Set(lockedProducts.filter(p => p.category === cat).map(p => p.id));
      result[cat] = fullStack.filter(s => lockedIds.has(s.product.id));
    });
    return result;
  }, [products, clips, lockedProducts]);

  // Per-category stats (locked products only)
  const catStats = useMemo(() => {
    const result = {};
    ['A', 'B', 'C', 'D'].forEach(cat => {
      const catLocked = lockedProducts.filter(p => p.category === cat);
      const target = catLocked.reduce((s, p) => s + (p.locked?.targetClips || 0), 0);
      const made = catLocked.reduce((s, p) => s + clips.filter(c => c.productId === p.id && c.postedAt?.slice(0, 7) === monthKey).length, 0);
      result[cat] = { count: catLocked.length, target, made, pct: target > 0 ? Math.round((made / target) * 100) : 0 };
    });
    return result;
  }, [lockedProducts, clips, monthKey]);

  return (<div className="space-y-4">
    {/* HEADER */}
    <div>
      <h1 className="font-display text-2xl md:text-3xl lg:text-4xl">Lock List</h1>
      <p className="text-stone-500 text-sm">{monthLabel} · เหลือ {daysLeft} วัน</p>
    </div>

    {/* TOP STATS CARD */}
    <Card>
      <div className="grid grid-cols-4 gap-2 mb-3">
        <div className="text-center"><div className="font-display text-2xl leading-none">{totalTarget}</div><div className="text-[10px] uppercase tracking-wider text-stone-500 mt-0.5">เป้า</div></div>
        <div className="text-center"><div className="font-display text-2xl leading-none">{totalMade}</div><div className="text-[10px] uppercase tracking-wider text-stone-500 mt-0.5">ทำได้</div></div>
        <div className="text-center"><div className="font-display text-2xl leading-none">{lockedProducts.length}</div><div className="text-[10px] uppercase tracking-wider text-stone-500 mt-0.5">Lock</div></div>
        <div className="text-center"><div className={`font-display text-2xl leading-none ${onTrack ? 'text-emerald-600' : 'text-amber-600'}`}>{overallPct}%</div><div className="text-[10px] uppercase tracking-wider text-stone-500 mt-0.5">Progress</div></div>
      </div>
      <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden relative">
        <div className={`absolute h-full transition-all ${onTrack ? 'bg-emerald-500' : 'bg-amber-400'}`} style={{ width: `${overallPct}%` }}></div>
        <div className="absolute top-0 h-full w-px bg-stone-700" style={{ left: `${expectedPct}%` }} title={`ควรอยู่ที่ ${expectedPct}%`}></div>
      </div>
      <div className="text-[10px] text-stone-500 mt-1">{onTrack ? '✓ on track' : `⚠️ ช้ากว่าเป้า (วันที่ ${dayOfMonth} ควรอยู่ ${expectedPct}%)`}</div>
      <button onClick={onLockNew} className="w-full mt-3 bg-lime-400 text-stone-900 font-bold text-sm py-2.5 rounded-md">+ Lock สินค้าใหม่</button>
    </Card>

    {lockedProducts.length === 0 ? (<Card><div className="text-center py-8"><Lock className="w-12 h-12 text-stone-300 mx-auto mb-3" /><p className="text-stone-500 text-sm mb-1">ยังไม่มีสินค้า Lock เดือนนี้</p><p className="text-xs text-stone-400">ไปที่หน้าสินค้า แล้วกด Lock</p></div></Card>) : (
      <>{['A', 'B', 'C', 'D'].map(cat => {
        const info = ABCD_INFO[cat];
        const stack = stacks[cat] || [];
        const stats = catStats[cat];
        const target = PORTFOLIO_TARGET[cat];

        if (stack.length === 0) {
          return (<div key={cat}>
            <div className="flex items-center justify-between mb-1.5 px-1">
              <div className="flex items-center gap-2"><div className={`w-5 h-5 rounded ${info.bg} text-white text-[10px] font-bold flex items-center justify-center`}>{cat}</div><span className="font-display text-base">{info.desc}</span></div>
              <span className="text-[10px] text-stone-400">เป้า {target}%</span>
            </div>
            <Card><div className="text-center py-4 border-2 border-dashed border-stone-200 -m-4 rounded-lg"><div className="text-stone-400 text-3xl mb-1">{cat === 'D' ? '🎯' : cat === 'C' ? '💰' : cat === 'B' ? '🆕' : '🔥'}</div><p className="text-xs text-stone-500 mb-2">ยังไม่ Lock สินค้าหมวด {cat}</p><button onClick={onLockNew} className="text-[10px] bg-lime-400 text-stone-900 font-semibold px-3 py-1.5 rounded">+ Lock {cat}</button></div></Card>
          </div>);
        }

        // Group stack by tier
        const tiers = { HOT: stack.filter(s => s.tier === 'HOT'), STEADY: stack.filter(s => s.tier === 'STEADY'), PASSIVE: stack.filter(s => s.tier === 'PASSIVE') };

        return (<div key={cat}>
          {/* Section header */}
          <div className="flex items-center justify-between mb-1.5 px-1">
            <div className="flex items-center gap-2"><div className={`w-5 h-5 rounded ${info.bg} text-white text-[10px] font-bold flex items-center justify-center`}>{cat}</div><span className="font-display text-base">{info.desc}</span></div>
            <div className="text-right"><span className="text-xs font-mono font-bold">{stats.made}/{stats.target}</span><span className="text-[10px] text-stone-400 ml-1">({stats.pct}%)</span></div>
          </div>
          <Card>
            {/* A: rich cards. B/C/D: compact rows */}
            {cat === 'A' ? (
              <div className="space-y-3">{['HOT', 'STEADY', 'PASSIVE'].map(tierName => { const items = tiers[tierName]; if (items.length === 0) return null; const meta = TIER_META[tierName]; return (<div key={tierName}>
                <div className="text-[10px] font-bold text-stone-600 uppercase tracking-wider mb-1.5">{meta.emoji} {meta.label}</div>
                <div className="space-y-1.5">{items.map(s => <LockedProductCard key={s.product.id} stack={s} clips={clips} monthKey={monthKey} onSelect={onSelectProduct} onUnlock={onUnlock} rich />)}</div>
              </div>); })}</div>
            ) : (
              <div className="space-y-2">{['HOT', 'STEADY', 'PASSIVE'].map(tierName => { const items = tiers[tierName]; if (items.length === 0) return null; const meta = TIER_META[tierName]; return (<div key={tierName}>
                <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-1 px-0.5">{meta.emoji} {meta.label} <span className="text-stone-400 normal-case">({items.length})</span></div>
                <div className="space-y-1">{items.map(s => <LockedProductRow key={s.product.id} stack={s} clips={clips} monthKey={monthKey} onSelect={onSelectProduct} onUnlock={onUnlock} />)}</div>
              </div>); })}</div>
            )}
          </Card>
        </div>);
      })}</>
    )}
  </div>);
}

// Tier metadata for display
const TIER_META = {
  HOT: { emoji: '🔥', label: 'HOT' },
  STEADY: { emoji: '⚡', label: 'STEADY' },
  PASSIVE: { emoji: '💤', label: 'PASSIVE' }
};

// Rich card for A products
function LockedProductCard({ stack, clips, monthKey, onSelect, onUnlock, rich }) {
  const s = stack;
  const p = s.product;
  const target = p.locked?.targetClips || s.targetMonth || 1;
  const made = clips.filter(c => c.productId === p.id && c.postedAt?.slice(0, 7) === monthKey).length;
  const pct = Math.min(100, Math.round((made / target) * 100));
  const dayOfMonth = new Date().getDate();
  const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
  const expectedPct = Math.round((dayOfMonth / daysInMonth) * 100);
  const wayBehind = pct < expectedPct - 25;
  const barColor = wayBehind ? 'bg-rose-500' : pct >= 100 ? 'bg-emerald-500' : pct >= expectedPct - 5 ? 'bg-lime-400' : 'bg-amber-400';

  return (<div className={`p-2.5 bg-gradient-to-r from-stone-50 to-white border ${s.atRisk ? 'border-rose-300 ring-1 ring-rose-200' : 'border-stone-200'} rounded-lg active:bg-stone-100`}>
    <div className="flex items-start justify-between gap-2 mb-1.5">
      <button onClick={() => onSelect(p.id)} className="flex items-center gap-2 min-w-0 text-left flex-1">
        <span className="text-stone-400 font-display text-sm flex-shrink-0">#{s.rank}</span>
        <span className="font-semibold text-sm truncate">{truncate(p.name, 22)}</span>
        {p.tiktokRank && <span className="text-[9px] bg-rose-100 text-rose-700 px-1 rounded font-bold flex-shrink-0">🏆#{p.tiktokRank}</span>}
        {p.isShopAds && <span className="text-[9px] bg-red-600 text-white px-1 rounded flex-shrink-0">🛒</span>}
        {s.atRisk && <span className="text-[9px] bg-rose-600 text-white px-1 rounded font-bold flex-shrink-0">⚠️</span>}
      </button>
      <button onClick={() => onUnlock(p.id)} className="text-[10px] text-stone-400 hover:text-rose-600 flex-shrink-0">🔓</button>
    </div>
    <div className="flex items-center gap-2 mb-1">
      <div className="flex-1 h-1.5 bg-white rounded-full overflow-hidden border border-stone-200">
        <div className={`h-full transition-all ${barColor}`} style={{ width: `${pct}%` }}></div>
      </div>
      <span className="text-[10px] font-mono text-stone-600 flex-shrink-0 tabular-nums">{made}/{target} ({pct}%)</span>
    </div>
    <div className="text-[10px] text-stone-500 flex flex-wrap gap-x-2">
      <span className="font-mono">฿{fmtNum(s.sales30d)}/30d</span>
      {p.price > 0 && s.sales30d > 0 && <span className="font-mono text-emerald-700">≈ {Math.round(s.sales30d / p.price)} orders</span>}
      {p.price > 0 && Number(p.scorecard?.commission) > 0 && <span className="font-mono text-violet-700">฿{Math.round(p.price * Number(p.scorecard.commission) / 100)}/order</span>}
      <span>· {s.frequency}</span>
      {s.momentum > 0 && s.momentum !== 1 && <span className={`font-mono ${s.momentum > 1.1 ? 'text-emerald-600' : s.momentum < 0.8 ? 'text-rose-600' : 'text-stone-400'}`}>{s.momentum > 1 ? '↗' : '↘'} {Math.round((s.momentum - 1) * 100)}%</span>}
    </div>
  </div>);
}

// Compact row for B/C/D
function LockedProductRow({ stack, clips, monthKey, onSelect, onUnlock }) {
  const s = stack;
  const p = s.product;
  const target = p.locked?.targetClips || 1;
  const made = clips.filter(c => c.productId === p.id && c.postedAt?.slice(0, 7) === monthKey).length;
  const pct = Math.min(100, Math.round((made / target) * 100));
  const barColor = pct >= 100 ? 'bg-emerald-500' : pct >= 50 ? 'bg-lime-400' : 'bg-amber-400';

  return (<div className={`flex items-center gap-2 py-1.5 px-2 rounded ${s.atRisk ? 'bg-rose-50' : 'hover:bg-stone-50'} active:bg-stone-100`}>
    <button onClick={() => onSelect(p.id)} className="flex-1 flex items-center gap-1.5 min-w-0 text-left">
      <span className="font-medium text-xs truncate flex-1">{truncate(p.name, 24)}</span>
      {p.isShopAds && <span className="text-[9px] flex-shrink-0">🛒</span>}
      {s.atRisk && <span className="text-[9px] text-rose-600 flex-shrink-0">⚠️</span>}
    </button>
    <div className="w-14 h-1.5 bg-stone-200 rounded-full overflow-hidden flex-shrink-0">
      <div className={`h-full ${barColor}`} style={{ width: `${pct}%` }}></div>
    </div>
    <span className="text-[10px] font-mono text-stone-500 tabular-nums flex-shrink-0 w-12 text-right">{made}/{target}</span>
    <button onClick={() => onUnlock(p.id)} className="text-[10px] text-stone-300 hover:text-rose-600 flex-shrink-0">🔓</button>
  </div>);
}

function ClipLogPage({ products, clips, onEditClip, onMakeSimilar, onMarkRepostDone, onPromoteToA }) {
  const [view, setView] = useState('log');
  return (<div className="space-y-4">
    <div className="flex items-center justify-between"><h1 className="font-display text-2xl md:text-3xl lg:text-4xl">{view === 'log' ? 'Clip Log' : 'Dashboard'}</h1>
      <div className="flex bg-white border border-stone-200 rounded-md p-0.5">
        <button onClick={() => setView('log')} className={`text-xs px-3 py-1.5 rounded transition ${view === 'log' ? 'bg-lime-400 text-stone-900 font-semibold' : 'text-stone-500'}`}>📋 Log</button>
        <button onClick={() => setView('dashboard')} className={`text-xs px-3 py-1.5 rounded transition ${view === 'dashboard' ? 'bg-lime-400 text-stone-900 font-semibold' : 'text-stone-500'}`}>📊 Dashboard</button>
      </div>
    </div>
    {view === 'log' ? <LogView products={products} clips={clips} onEditClip={onEditClip} /> : <DashboardView products={products} clips={clips} onMakeSimilar={onMakeSimilar} onEditClip={onEditClip} onMarkRepostDone={onMarkRepostDone} onPromoteToA={onPromoteToA} />}
  </div>);
}

function LogView({ products, clips, onEditClip }) {
  const [period, setPeriod] = useState('30');
  const [filterProduct, setFilterProduct] = useState('');
  const [filterABCD, setFilterABCD] = useState('');
  const [filterPillar, setFilterPillar] = useState('');
  const [filterType, setFilterType] = useState('');
  const [sortBy, setSortBy] = useState('date_desc');

  const filtered = useMemo(() => {
    let list = [...clips];
    if (period !== 'all') { const cutoff = Date.now() - Number(period) * 86400000; list = list.filter(c => new Date(c.postedAt).getTime() >= cutoff); }
    if (filterProduct === 'V') list = list.filter(c => c.isV);
    else if (filterProduct) list = list.filter(c => c.productId === filterProduct);
    if (filterABCD) { list = list.filter(c => { if (c.isV) return filterABCD === 'V'; const p = products.find(pp => pp.id === c.productId); return p?.category === filterABCD; }); }
    if (filterPillar) list = list.filter(c => c.pillarId === filterPillar);
    if (filterType) { list = list.filter(c => { if (c.isV) return false; const p = products.find(pp => pp.id === c.productId); return p?.productType === filterType; }); }
    list.sort((a, b) => {
      if (sortBy === 'date_desc') return new Date(b.postedAt) - new Date(a.postedAt);
      if (sortBy === 'date_asc') return new Date(a.postedAt) - new Date(b.postedAt);
      if (sortBy === 'gmv_desc') return (Number(b.gmv) || 0) - (Number(a.gmv) || 0);
      if (sortBy === 'views7d_desc') return (Number(b.views7d) || 0) - (Number(a.views7d) || 0);
      return 0;
    });
    return list;
  }, [clips, products, period, filterProduct, filterABCD, filterPillar, filterType, sortBy]);

  const totalGMV = filtered.reduce((s, c) => s + (Number(c.gmv) || 0), 0);
  const totalOrders = filtered.reduce((s, c) => s + (Number(c.orders) || 0), 0);
  const winners = filtered.filter(c => (Number(c.gmv) || 0) >= WINNER_GMV).length;

  return (<div className="space-y-4">
    <div className="flex gap-1 justify-end">{['7', '30', '90', 'all'].map(d => (<button key={d} onClick={() => setPeriod(d)} className={`text-xs px-3 py-1.5 rounded ${period === d ? 'bg-lime-400 text-stone-900 font-bold' : 'bg-white border border-stone-200'}`}>{d === 'all' ? 'ทั้งหมด' : `${d}d`}</button>))}</div>
    <div className="grid grid-cols-4 gap-2"><StatCard icon={Activity} label="คลิป" value={filtered.length} sub="" /><StatCard icon={DollarSign} label="GMV ฿" value={fmtNum(totalGMV)} sub="" /><StatCard icon={Package} label="Orders" value={fmtNum(totalOrders)} sub="" /><StatCard icon={Trophy} label="Winners" value={winners} sub="≥฿1k" /></div>
    <Card><div className="grid grid-cols-2 gap-2">
      <div><label className="text-[10px] uppercase tracking-wider text-stone-500 block mb-1">สินค้า</label><select value={filterProduct} onChange={e => setFilterProduct(e.target.value)} className="w-full text-sm px-2 py-1.5 bg-white border border-stone-200 rounded"><option value="">ทั้งหมด</option><option value="V">V — Value Content</option>{products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}</select></div>
      <div><label className="text-[10px] uppercase tracking-wider text-stone-500 block mb-1">หมวด ABCD</label><select value={filterABCD} onChange={e => setFilterABCD(e.target.value)} className="w-full text-sm px-2 py-1.5 bg-white border border-stone-200 rounded"><option value="">ทั้งหมด</option>{Object.entries(ABCD_INFO).map(([k, info]) => <option key={k} value={k}>{info.label}</option>)}</select></div>
      <div><label className="text-[10px] uppercase tracking-wider text-stone-500 block mb-1">ประเภทสินค้า</label><select value={filterType} onChange={e => setFilterType(e.target.value)} className="w-full text-sm px-2 py-1.5 bg-white border border-stone-200 rounded"><option value="">ทั้งหมด</option>{PRODUCT_TYPES.map(t => <option key={t.id} value={t.id}>{t.emoji} {t.label}</option>)}</select></div>
      <div><label className="text-[10px] uppercase tracking-wider text-stone-500 block mb-1">Pillar</label><select value={filterPillar} onChange={e => setFilterPillar(e.target.value)} className="w-full text-sm px-2 py-1.5 bg-white border border-stone-200 rounded"><option value="">ทั้งหมด</option>{DEFAULT_PILLARS.map(p => <option key={p.id} value={p.id}>{p.id} — {p.name}</option>)}</select></div>
      <div className="col-span-2"><label className="text-[10px] uppercase tracking-wider text-stone-500 block mb-1">Sort</label><select value={sortBy} onChange={e => setSortBy(e.target.value)} className="w-full text-sm px-2 py-1.5 bg-white border border-stone-200 rounded"><option value="date_desc">วันที่ (ใหม่→เก่า)</option><option value="date_asc">วันที่ (เก่า→ใหม่)</option><option value="gmv_desc">GMV (สูงสุด)</option><option value="views7d_desc">Views 7d (สูงสุด)</option></select></div>
    </div></Card>
    {filtered.length === 0 ? (<Card><div className="text-center py-8"><FileText className="w-12 h-12 text-stone-300 mx-auto mb-3" /><p className="text-stone-500 text-sm">ยังไม่มีคลิปในช่วงนี้</p></div></Card>) : (
      <div className="bg-white border border-stone-200 rounded-md overflow-hidden">
        <div className="hidden md:block overflow-x-auto"><table className="w-full text-xs"><thead className="bg-stone-100"><tr><th className="text-left p-2 font-semibold text-stone-600">วันที่</th><th className="text-left p-2 font-semibold text-stone-600">สินค้า</th><th className="text-center p-2 font-semibold text-stone-600">ABCD</th><th className="text-left p-2 font-semibold text-stone-600">Pillar</th><th className="text-left p-2 font-semibold text-stone-600">Hook</th><th className="text-center p-2 font-semibold text-stone-600">GC</th><th className="text-right p-2 font-semibold text-stone-600">V 24h</th><th className="text-right p-2 font-semibold text-stone-600">V 7d</th><th className="text-right p-2 font-semibold text-stone-600">Orders</th><th className="text-right p-2 font-semibold text-stone-600">GMV ฿</th><th className="text-left p-2 font-semibold text-stone-600">Note</th></tr></thead><tbody>
          {filtered.map(c => { const p = products.find(pp => pp.id === c.productId); const isWinner = (Number(c.gmv) || 0) >= WINNER_GMV; const cat = c.isV ? 'V' : p?.category; return (<tr key={c.id} onClick={() => onEditClip(c.id)} className="border-t border-stone-100 hover:bg-stone-50 cursor-pointer"><td className="p-2 whitespace-nowrap">{fmtDate(c.postedAt)}</td><td className="p-2 max-w-[140px]"><div className="line-clamp-1" title={c.isV ? 'V Content' : (p?.name || '')}>{c.isV ? '📚 V' : (truncate(p?.name, 22) || '-')}</div></td><td className="p-2 text-center"><CategoryBadge cat={cat} /></td><td className="p-2">{c.pillarId || '-'}</td><td className="p-2 max-w-[160px]"><div className="line-clamp-1" title={c.hook}>{truncate(c.hook, 30) || '-'}</div></td><td className="p-2 text-center">{c.gencodeSubmitted ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 inline" /> : '-'}</td><td className="p-2 text-right font-mono">{fmtNum(c.views24h)}</td><td className="p-2 text-right font-mono">{fmtNum(c.views7d)}</td><td className="p-2 text-right font-mono">{fmtNum(c.orders)}</td><td className={`p-2 text-right font-mono ${isWinner ? 'font-bold text-amber-700' : ''}`}>{fmtNum(c.gmv)}</td><td className="p-2 max-w-[140px] text-stone-600"><div className="line-clamp-1" title={c.note}>{truncate(c.note, 20) || '-'}</div></td></tr>); })}
        </tbody></table></div>
        <div className="md:hidden divide-y divide-stone-100">
          {filtered.map(c => { const p = products.find(pp => pp.id === c.productId); const isWinner = (Number(c.gmv) || 0) >= WINNER_GMV; const cat = c.isV ? 'V' : p?.category; const pillar = DEFAULT_PILLARS.find(pp => pp.id === c.pillarId); return (<button key={c.id} onClick={() => onEditClip(c.id)} className="w-full text-left p-3 hover:bg-stone-50 transition">
            <div className="flex items-start justify-between gap-2 mb-1"><div className="flex items-center gap-2 min-w-0"><CategoryBadge cat={cat} /><div className="min-w-0"><div className="font-semibold text-sm line-clamp-1">{c.isV ? '📚 V Content' : (truncate(p?.name, 25) || '-')}</div><div className="text-[10px] text-stone-500">{fmtDate(c.postedAt)}{pillar ? ` · ${pillar.id}` : ''}{c.gencodeSubmitted ? ' · GC ✓' : ''}</div></div></div>{isWinner && <Trophy className="w-4 h-4 text-amber-500 flex-shrink-0" />}</div>
            {c.hook && <div className="text-xs text-stone-700 mb-2 line-clamp-1">{c.hook}</div>}
            <div className="grid grid-cols-4 gap-1 text-[10px]"><Stat label="24h" value={fmtNum(c.views24h)} /><Stat label="7d" value={fmtNum(c.views7d)} /><Stat label="Ord" value={fmtNum(c.orders)} /><Stat label="GMV" value={fmtNum(c.gmv)} highlight={isWinner} /></div>
            {c.note && <div className="text-[10px] text-stone-500 mt-2 italic line-clamp-1">📝 {c.note}</div>}
          </button>); })}
        </div>
      </div>
    )}
  </div>);
}

function Stat({ label, value, highlight }) { return (<div className={`rounded p-1 ${highlight ? 'bg-amber-100' : 'bg-stone-100'}`}><div className="text-[9px] text-stone-500 uppercase">{label}</div><div className={`font-mono ${highlight ? 'font-bold text-amber-700' : ''}`}>{value}</div></div>); }

function DashboardView({ products, clips, onMakeSimilar, onEditClip, onMarkRepostDone, onPromoteToA }) {
  const [period, setPeriod] = useState('30');
  const days = Number(period);
  const cutoff = Date.now() - days * 86400000;
  const recent = clips.filter(c => new Date(c.postedAt).getTime() >= cutoff);

  const winners = useMemo(() => getWinners(clips, products).slice(0, 10), [clips, products]);

  const productStats = useMemo(() => {
    return products.map(p => {
      const pclips = recent.filter(c => c.productId === p.id);
      const totalGMV = pclips.reduce((s, c) => s + (Number(c.gmv) || 0), 0);
      const clipCount = pclips.length;
      return { product: p, totalGMV, clipCount, revPerClip: clipCount > 0 ? totalGMV / clipCount : 0 };
    }).filter(s => s.clipCount > 0).sort((a, b) => b.totalGMV - a.totalGMV);
  }, [products, recent]);
  const maxGMV = Math.max(...productStats.map(s => s.totalGMV), 1);

  const abcdStats = useMemo(() => {
    const stats = { A: { gmv: 0, count: 0 }, B: { gmv: 0, count: 0 }, C: { gmv: 0, count: 0 }, D: { gmv: 0, count: 0 } };
    recent.filter(c => !c.isV).forEach(c => { const p = products.find(pp => pp.id === c.productId); if (p?.category && stats[p.category]) { stats[p.category].gmv += Number(c.gmv) || 0; stats[p.category].count += 1; } });
    return stats;
  }, [products, recent]);
  const maxABCDGmv = Math.max(...Object.values(abcdStats).map(s => s.gmv), 1);

  const pillarStats = useMemo(() => {
    const stats = {}; DEFAULT_PILLARS.forEach(p => stats[p.id] = 0);
    recent.forEach(c => { if (c.pillarId && stats[c.pillarId] !== undefined) stats[c.pillarId] += 1; });
    return stats;
  }, [recent]);
  const maxPillar = Math.max(...Object.values(pillarStats), 1);

  const portfolioBalance = useMemo(() => getPortfolioBalance(products, clips, days), [products, clips, days]);

  const typeStats = useMemo(() => {
    const stats = {}; PRODUCT_TYPES.forEach(t => stats[t.id] = { clips: 0, gmv: 0 });
    recent.filter(c => !c.isV).forEach(c => { const p = products.find(pp => pp.id === c.productId); if (p?.productType && stats[p.productType]) { stats[p.productType].clips += 1; stats[p.productType].gmv += Number(c.gmv) || 0; } });
    return stats;
  }, [products, recent]);
  const maxTypeGmv = Math.max(...Object.values(typeStats).map(s => s.gmv), 1);

  const monthlyTrend = useMemo(() => {
    const months = []; const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const ymKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const mclips = clips.filter(c => c.postedAt?.slice(0, 7) === ymKey);
      months.push({ key: ymKey, label: d.toLocaleDateString('th-TH', { month: 'short' }), clipCount: mclips.length, gmv: mclips.reduce((s, c) => s + (Number(c.gmv) || 0), 0) });
    }
    return months;
  }, [clips]);
  const maxMonthlyClips = Math.max(...monthlyTrend.map(m => m.clipCount), 1);
  const maxMonthlyGmv = Math.max(...monthlyTrend.map(m => m.gmv), 1);

  const recommendations = useMemo(() => {
    return products.map(p => {
      const sales = getProductSales(p, clips, days);
      const tiktok = sales.fromManual;
      const clipCount = sales.clipCount;
      const clipGMV = sales.fromClips;

      if (sales.hasManual) {
        if (tiktok >= 30000 && clipCount < 3) return { product: p, rec: 'ดันด่วน', reason: `TikTok ฿${fmtNum(tiktok)} แต่ลง ${clipCount} คลิป — ดันให้ถี่`, color: 'bg-rose-600', icon: Flame, sortKey: 5 };
        if (tiktok >= 30000) return { product: p, rec: 'ดันต่อ', reason: `TikTok ฿${fmtNum(tiktok)} — สินค้าหลัก`, color: 'bg-emerald-500', icon: TrendingUp, sortKey: 4 };
        if (tiktok >= 10000 && clipCount < 3) return { product: p, rec: 'ลงเพิ่ม', reason: `ขายดี TikTok ฿${fmtNum(tiktok)} — ลงคลิปได้อีก`, color: 'bg-amber-500', icon: Lightbulb, sortKey: 4 };
        if (tiktok >= 10000) return { product: p, rec: 'ทำต่อ', reason: `TikTok ฿${fmtNum(tiktok)}`, color: 'bg-sky-500', icon: Activity, sortKey: 3 };
        if (tiktok >= 1000) return { product: p, rec: 'ลองมุมใหม่', reason: `TikTok ฿${fmtNum(tiktok)} — เร่งเทสใหม่`, color: 'bg-amber-500', icon: Lightbulb, sortKey: 2 };
        if (clipCount >= 3) return { product: p, rec: 'พักดู', reason: `ลง ${clipCount} คลิป แต่ TikTok เกือบ 0`, color: 'bg-rose-500', icon: TrendingDown, sortKey: 1 };
        return null;
      }

      if (clipCount === 0) return null;
      const revPerClip = clipGMV / clipCount;
      if (revPerClip >= 2000 && clipCount >= 2) return { product: p, rec: 'ดันต่อ', reason: `Rev/clip ฿${fmtNum(Math.round(revPerClip))} (จากคลิป)`, color: 'bg-emerald-500', icon: TrendingUp, sortKey: 3 };
      if (revPerClip >= 500) return { product: p, rec: 'ทำต่อ', reason: `Rev/clip ฿${fmtNum(Math.round(revPerClip))} — ยังไม่มียอด TikTok`, color: 'bg-sky-500', icon: Activity, sortKey: 2 };
      if (clipCount >= 5) return { product: p, rec: 'ลองมุมใหม่', reason: `ลง ${clipCount} คลิป — ยอด clip ต่ำ`, color: 'bg-amber-500', icon: Lightbulb, sortKey: 1 };
      return { product: p, rec: 'เทสต่อ', reason: 'ยังไม่มี data พอ', color: 'bg-stone-400', icon: Activity, sortKey: 0 };
    }).filter(Boolean).sort((a, b) => b.sortKey - a.sortKey);
  }, [products, clips, days]);

  // Cut Decision Helper (Round 1)
  const cutCandidates = useMemo(() => getProductsToCut(products, clips), [products, clips]);

  // A Stack + E Detection (Round 2)
  const aStack = useMemo(() => getAStack(products, clips), [products, clips]);
  const eCandidates = useMemo(() => getECandidates(products, clips), [products, clips]);
  // ROI (v2.6)
  const roi = useMemo(() => getROIAnalysis(products, clips, MONTHLY_REVENUE_TARGET), [products, clips]);

  return (<div className="space-y-4">
    <div className="flex gap-1 justify-end">{[{ id: '7', label: '7 วันล่าสุด' }, { id: '30', label: '30 วันล่าสุด' }, { id: '90', label: '90 วันล่าสุด' }].map(d => (<button key={d.id} onClick={() => setPeriod(d.id)} className={`text-xs px-3 py-1.5 rounded ${period === d.id ? 'bg-lime-400 text-stone-900 font-bold' : 'bg-white border border-stone-200'}`}>{d.label}</button>))}</div>

    {portfolioBalance && (<Card><h3 className="font-display text-base mb-1 flex items-center gap-2">⚖️ Portfolio Balance</h3>
      <p className="text-[10px] text-stone-500 mb-3">เป้าหมาย: A {PORTFOLIO_TARGET.A}% / B {PORTFOLIO_TARGET.B}% / C {PORTFOLIO_TARGET.C}% / D {PORTFOLIO_TARGET.D}% (วัดจาก GMV {period}d)</p>
      <div className="space-y-2">{Object.entries(portfolioBalance).map(([k, b]) => { const info = ABCD_INFO[k]; const statusIcon = b.status === 'ok' ? '✅' : b.status === 'over' ? '⚠️' : '⚠️'; const statusText = b.status === 'ok' ? 'OK' : b.status === 'over' ? `Over ${b.diff > 0 ? '+' : ''}${b.diff}%` : `Under ${b.diff}%`; const statusColor = b.status === 'ok' ? 'text-emerald-700' : 'text-amber-700'; return (<div key={k}>
        <div className="flex items-center justify-between text-xs mb-1">
          <div className="flex items-center gap-2"><div className={`w-5 h-5 rounded ${info.bg} text-white font-bold text-[10px] flex items-center justify-center`}>{k}</div><span className="font-semibold">{info.desc}</span></div>
          <div className="flex items-center gap-2"><span className="font-mono font-bold">{b.actual}%</span><span className={`text-[10px] ${statusColor}`}>{statusIcon} {statusText}</span></div>
        </div>
        <div className="relative w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
          <div className="absolute h-full bg-stone-300 opacity-50" style={{ width: `${b.target}%` }} title={`เป้า ${b.target}%`}></div>
          <div className={`absolute h-full ${b.status === 'ok' ? 'bg-emerald-500' : 'bg-amber-400'}`} style={{ width: `${Math.min(100, b.actual)}%` }}></div>
          <div className="absolute top-0 h-full w-px bg-stone-700" style={{ left: `${b.target}%` }} title={`Target ${b.target}%`}></div>
        </div>
        <div className="text-[10px] text-stone-500 mt-0.5">GMV: ฿{fmtNum(b.gmv)}</div>
      </div>); })}</div>
    </Card>)}

    {/* A STACK PRIORITY — Preview (full view in Lock List) */}
    {aStack.length > 0 && (<Card>
      <div className="flex items-center justify-between mb-1">
        <h3 className="font-display text-base flex items-center gap-2"><Flame className="w-4 h-4 text-rose-500" /> 🔥 A Stack — Top {Math.min(3, aStack.length)}</h3>
        <span className="text-[10px] text-stone-400">ดูครบที่ Lock List →</span>
      </div>
      <p className="text-[10px] text-stone-500 mb-3">A ที่มาแรงสุด — ลงคลิปถี่สุด</p>
      <div className="space-y-1.5">{aStack.slice(0, 3).map(s => { const monthKey = currentMonth(); const target = s.product.locked?.targetClips || s.targetMonth || 1; const made = clips.filter(c => c.productId === s.product.id && c.postedAt?.slice(0, 7) === monthKey).length; const pct = Math.min(100, Math.round((made / target) * 100)); return (<div key={s.product.id} className={`p-2 bg-gradient-to-r ${s.tier === 'HOT' ? 'from-rose-50 to-orange-50 border-rose-200' : s.tier === 'STEADY' ? 'from-sky-50 to-blue-50 border-sky-200' : 'from-stone-50 to-slate-50 border-stone-200'} border rounded`}>
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-[10px] font-bold text-stone-600">{s.tier === 'HOT' ? '🔥' : s.tier === 'STEADY' ? '⚡' : '💤'}</span>
            <span className="text-stone-500 font-display text-sm">#{s.rank}</span>
            <span className="font-semibold text-sm truncate">{truncate(s.product.name, 20)}</span>
            {s.atRisk && <span className="text-[9px] bg-rose-600 text-white px-1 rounded font-bold flex-shrink-0">⚠️</span>}
            {s.product.isShopAds && <span className="text-[9px] bg-red-600 text-white px-1 rounded flex-shrink-0">🛒</span>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex-1 h-1.5 bg-white rounded-full overflow-hidden">
            <div className={`h-full ${pct >= 100 ? 'bg-emerald-500' : pct >= 50 ? 'bg-lime-400' : 'bg-amber-400'}`} style={{ width: `${pct}%` }}></div>
          </div>
          <span className="text-[10px] font-mono text-stone-600 flex-shrink-0 tabular-nums">{made}/{Math.round(target)} · ฿{fmtNum(s.sales30d)}</span>
        </div>
      </div>); })}</div>
      {aStack.length > 3 && <div className="text-center mt-2 text-[10px] text-stone-400">+{aStack.length - 3} ตัวอื่น · ดูที่หน้า Lock List</div>}
    </Card>)}

    {/* E DETECTION — Round 2 */}
    {eCandidates.length > 0 && (<Card>
      <h3 className="font-display text-base mb-1 flex items-center gap-2">💎 E Detection — สินค้าที่อาจเป็น "นางฟ้า"</h3>
      <p className="text-[10px] text-stone-500 mb-3">B/C/D ที่ Performance เหมือน A — พิจารณาย้ายเป็น A</p>
      <div className="space-y-2">{eCandidates.map(e => { const conf = e.confidence; const confBg = conf === 'high' ? 'bg-emerald-500' : conf === 'medium' ? 'bg-amber-500' : 'bg-stone-400'; const confLabel = conf === 'high' ? '🟢 HIGH' : conf === 'medium' ? '🟡 MEDIUM' : '🟠 LOW'; return (<div key={e.product.id} className="p-3 bg-gradient-to-br from-violet-50 to-white border border-violet-200 rounded">
        <div className="flex items-center gap-2 mb-1.5">
          <CategoryBadge cat={e.product.category} />
          <div className="flex-1 min-w-0">
            <div className="text-sm font-semibold truncate">{truncate(e.product.name, 28)} <span className="text-stone-400 text-xs">[{e.product.category} → A?]</span></div>
            <div className="text-[10px] text-stone-500">Score {e.eScore}/7 · {confLabel}</div>
          </div>
          <span className={`text-[9px] font-bold text-white px-1.5 py-0.5 rounded flex-shrink-0 ${confBg}`}>{e.eScore}/7</span>
        </div>
        <div className="flex flex-wrap gap-1 mb-2">{e.reasons.map((r, i) => (<span key={i} className="text-[10px] bg-violet-100 text-violet-800 px-1.5 py-0.5 rounded">✓ {r}</span>))}</div>
        <div className="text-[10px] text-stone-600 mb-2 italic">💡 {e.advice}</div>
        {conf !== 'low' && (<button onClick={() => { if (confirm(`ย้าย "${e.product.name}" จาก ${e.product.category} → A?\n\n*ใน A Stack จะถูกจัดตามอันดับ GMV — ถ้า GMV ต่ำสุดใน A อาจเข้า PASSIVE`)) onPromoteToA(e.product.id); }} className="w-full text-xs bg-lime-400 text-stone-900 font-semibold py-1.5 rounded">ย้ายเป็น A →</button>)}
      </div>); })}</div>
    </Card>)}

    {/* ROI CALCULATOR — v2.6 */}
    {roi.items.length > 0 && (<Card className="bg-gradient-to-br from-amber-50 to-white border-amber-200">
      <h3 className="font-display text-base mb-1 flex items-center gap-2">🎯 Path to ฿{fmtNum(MONTHLY_REVENUE_TARGET)}/เดือน</h3>
      <p className="text-[10px] text-stone-500 mb-3">คอมมิชชั่นจากสินค้าที่ขายจริง (GMV × Commission%)</p>

      {/* Top progress */}
      <div className="mb-4 p-3 bg-white border border-amber-200 rounded-lg">
        <div className="flex items-baseline justify-between mb-1.5">
          <div><div className="text-[10px] uppercase tracking-wider text-stone-500">ตอนนี้</div><div className="font-display text-xl">฿{fmtNum(Math.round(roi.totalCommRevenue))}</div></div>
          <div className="text-right"><div className="text-[10px] uppercase tracking-wider text-stone-500">เป้า</div><div className="font-display text-xl text-stone-400">฿{fmtNum(MONTHLY_REVENUE_TARGET)}</div></div>
        </div>
        <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden mb-1">
          <div className={`h-full ${roi.pct >= 100 ? 'bg-emerald-500' : roi.pct >= 50 ? 'bg-lime-400' : 'bg-amber-400'}`} style={{ width: `${Math.min(100, roi.pct)}%` }}></div>
        </div>
        <div className="flex justify-between text-[10px] text-stone-600"><span>{roi.pct}% ถึงเป้า</span><span>ขาด ฿{fmtNum(Math.round(roi.gap))}</span></div>
      </div>

      {/* Per-product breakdown */}
      <div className="text-[10px] uppercase tracking-wider font-bold text-stone-500 mb-2">📊 Contribution per product</div>
      <div className="space-y-1.5">{roi.items.slice(0, 6).map(i => { const sharePct = roi.totalCommRevenue > 0 ? Math.round((i.currentCommRevenue / roi.totalCommRevenue) * 100) : 0; return (<div key={i.product.id} className="p-2 bg-white border border-stone-200 rounded">
        <div className="flex items-center gap-2 mb-1">
          <CategoryBadge cat={i.product.category} />
          <span className="font-semibold text-sm truncate flex-1">{truncate(i.product.name, 22)}</span>
          <span className="text-[10px] font-mono text-stone-500 flex-shrink-0">{sharePct}%</span>
        </div>
        <div className="text-[10px] text-stone-600 flex flex-wrap gap-x-2">
          <span>GMV ฿{fmtNum(i.sales30d)}</span>
          {i.price > 0 && <span>× ฿{fmtNum(i.price)}</span>}
          <span className="font-mono">× {i.commission}%</span>
          <span className="font-mono font-bold text-amber-700">= ฿{fmtNum(Math.round(i.currentCommRevenue))}</span>
        </div>
        {i.commPerOrder > 0 && i.ordersNeededAlone && (<div className="text-[9px] text-stone-500 mt-1">ถ้าโฟกัสตัวนี้คนเดียว ต้อง <strong className="font-mono">{fmtNum(i.ordersNeededAlone)}</strong> orders/เดือน ({Math.round(i.ordersNeededAlone / 30)}/วัน)</div>)}
      </div>); })}</div>
      {roi.items.length > 6 && <div className="text-center mt-2 text-[10px] text-stone-400">+{roi.items.length - 6} ตัวอื่น</div>}

      <div className="mt-3 pt-3 border-t border-amber-200 text-[10px] text-stone-700">💡 <strong>วิธีปิด gap:</strong> เพิ่มสินค้าใหม่ที่มี commission/order สูง หรือดัน A ตัว HOT ให้ GMV เพิ่ม — ลองคำนวณดู กี่ orders/เดือนถึงปิด ฿{fmtNum(Math.round(roi.gap))}</div>
    </Card>)}

    <Card><h3 className="font-display text-base mb-3 flex items-center gap-2"><Trophy className="w-4 h-4 text-amber-500" /> 🏆 Winner Vault ({winners.length})</h3>
      {winners.length === 0 ? (<p className="text-stone-400 text-sm text-center py-4">ยังไม่มี Winner clips — winner = GMV ≥ ฿{fmtNum(WINNER_GMV)}</p>) : (<div className="space-y-2">{winners.map(w => { const rs = w.clip.repostStatus || {}; return (<div key={w.clip.id} className="flex flex-col gap-1.5 p-2.5 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 rounded-md">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-500 flex-shrink-0" />
          <div className="flex-1 min-w-0"><div className="text-sm font-semibold line-clamp-1">{truncate(w.clip.hook, 40) || '(ไม่มี hook)'}</div><div className="text-[10px] text-stone-600">{w.clip.isV ? '📚 V' : (truncate(w.product?.name, 22) || '-')} · ฿{fmtNum(w.clip.gmv)} · {w.daysOld}d</div></div>
          <button onClick={() => onEditClip(w.clip.id)} className="text-xs text-stone-600 hover:text-stone-900 px-2 py-1 flex-shrink-0"><Edit3 className="w-3 h-3" /></button>
          <button onClick={() => onMakeSimilar(w.clip)} className="text-xs bg-lime-400 text-stone-900 font-semibold px-2 py-1 rounded flex-shrink-0">ทำซ้ำ</button>
        </div>
        <div className="flex items-center gap-1 pl-6">
          <span className="text-[10px] text-stone-500 mr-1">Repost:</span>
          {REPOST_INTERVALS.map(d => { const done = !!rs[`d${d}`]; const triggered = w.daysOld >= d; return (<button key={d} onClick={() => onMarkRepostDone(w.clip.id, d)} className={`text-[10px] px-1.5 py-0.5 rounded transition ${done ? 'bg-emerald-500 text-white' : triggered ? 'bg-amber-100 text-amber-800 border border-amber-300' : 'bg-stone-100 text-stone-400'}`} title={done ? `ทำแล้ว — กดเพื่อยกเลิก` : triggered ? `กดเพื่อ mark ว่าทำแล้ว` : `ยังไม่ถึงเวลา (${d}d)`}>{done ? '✓' : '○'} {d}d</button>); })}
        </div>
      </div>); })}</div>)}
    </Card>

    <Card><h3 className="font-display text-base mb-3">💰 GMV by Product</h3>
      {productStats.length === 0 ? (<p className="text-stone-400 text-sm text-center py-4">ยังไม่มีข้อมูล</p>) : (<div className="space-y-2">{productStats.slice(0, 10).map(s => (<div key={s.product.id}><div className="flex items-center justify-between text-xs mb-1"><div className="flex items-center gap-1.5 min-w-0"><CategoryBadge cat={s.product.category} /><span className="truncate font-semibold">{truncate(s.product.name, 25)}</span></div><span className="font-mono font-bold flex-shrink-0">฿{fmtNum(s.totalGMV)}</span></div><div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden"><div className="h-full bg-lime-400" style={{ width: `${(s.totalGMV / maxGMV) * 100}%` }}></div></div></div>))}</div>)}
    </Card>

    <Card><h3 className="font-display text-base mb-3">🎯 ABCD Performance</h3>
      <div className="space-y-2">{Object.entries(abcdStats).map(([k, s]) => { const info = ABCD_INFO[k]; const avg = s.count > 0 ? s.gmv / s.count : 0; return (<div key={k}><div className="flex items-center justify-between text-xs mb-1"><div className="flex items-center gap-2"><div className={`w-5 h-5 rounded ${info.bg} text-white font-bold text-[10px] flex items-center justify-center`}>{k}</div><span className="font-semibold">{info.desc}</span></div><div className="text-right font-mono"><span className="font-bold">฿{fmtNum(s.gmv)}</span><span className="text-stone-400 ml-1">({s.count} คลิป)</span></div></div><div className="flex items-center gap-2"><div className="flex-1 h-2 bg-stone-200 rounded-full overflow-hidden"><div className={`h-full ${info.bg}`} style={{ width: `${(s.gmv / maxABCDGmv) * 100}%` }}></div></div><span className="text-[10px] font-mono text-stone-500 w-16 text-right">฿{fmtNum(Math.round(avg))}/clip</span></div></div>); })}</div>
    </Card>

    <Card><h3 className="font-display text-base mb-3">📚 Pillar Distribution ({period}d)</h3>
      <div className="space-y-2">{DEFAULT_PILLARS.map(p => { const count = pillarStats[p.id] || 0; return (<div key={p.id}><div className="flex items-center justify-between text-xs mb-1"><span><span className="font-bold mr-1">{p.id}</span><span className="text-stone-600">{p.desc}</span></span><span className="font-mono font-bold">{count}</span></div><div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden"><div className="h-full bg-violet-500" style={{ width: `${(count / maxPillar) * 100}%` }}></div></div></div>); })}</div>
    </Card>

    <Card><h3 className="font-display text-base mb-3">📦 Product Type Distribution ({period}d)</h3>
      <div className="space-y-2">{PRODUCT_TYPES.map(t => { const s = typeStats[t.id]; if (!s) return null; return (<div key={t.id}><div className="flex items-center justify-between text-xs mb-1"><span><span className="mr-1">{t.emoji}</span><span className="text-stone-700 font-semibold">{t.label}</span></span><div className="text-right font-mono"><span className="font-bold">฿{fmtNum(s.gmv)}</span><span className="text-stone-400 ml-1">({s.clips})</span></div></div><div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden"><div className="h-full bg-orange-500" style={{ width: `${(s.gmv / maxTypeGmv) * 100}%` }}></div></div></div>); })}</div>
    </Card>

    <Card><h3 className="font-display text-base mb-3">📅 Monthly Trend (6 เดือนล่าสุด)</h3>
      <div className="grid grid-cols-6 gap-2">{monthlyTrend.map(m => { const clipH = (m.clipCount / maxMonthlyClips) * 60; const gmvH = (m.gmv / maxMonthlyGmv) * 60; return (<div key={m.key} className="text-center">
        <div className="flex items-end justify-center gap-0.5 h-16 mb-1">
          <div className="w-3 bg-lime-400 rounded-t" style={{ height: `${Math.max(clipH, 2)}px` }} title={`${m.clipCount} คลิป`}></div>
          <div className="w-3 bg-rose-400 rounded-t" style={{ height: `${Math.max(gmvH, 2)}px` }} title={`฿${fmtNum(m.gmv)}`}></div>
        </div>
        <div className="text-[10px] font-semibold">{m.label}</div>
        <div className="text-[9px] text-stone-500 font-mono">{m.clipCount}c</div>
        <div className="text-[9px] text-stone-500 font-mono">฿{m.gmv >= 1000 ? Math.round(m.gmv / 1000) + 'k' : m.gmv}</div>
      </div>); })}</div>
      <div className="flex justify-center gap-3 mt-2 text-[10px]"><span className="flex items-center gap-1"><div className="w-2 h-2 bg-lime-400 rounded"></div>คลิป</span><span className="flex items-center gap-1"><div className="w-2 h-2 bg-rose-400 rounded"></div>GMV</span></div>
    </Card>

    <Card><h3 className="font-display text-base mb-3 flex items-center gap-2"><Lightbulb className="w-4 h-4 text-amber-500" /> 💡 คำแนะนำ ({period}d)</h3>
      <p className="text-[10px] text-stone-500 mb-3">ใช้ TikTok GMV จริง + จำนวนคลิป เป็นเกณฑ์</p>
      {recommendations.length === 0 ? (<p className="text-stone-400 text-sm text-center py-4">ยังไม่มีข้อมูลพอวิเคราะห์</p>) : (<div className="space-y-2">{recommendations.map(r => { const Icon = r.icon; return (<div key={r.product.id} className="flex items-center gap-2 p-2.5 bg-stone-50 rounded"><CategoryBadge cat={r.product.category} /><div className="flex-1 min-w-0"><div className="text-sm font-semibold truncate">{truncate(r.product.name, 25)}</div><div className="text-[10px] text-stone-500 line-clamp-1">{r.reason}</div></div><span className={`text-xs font-bold text-white px-2 py-1 rounded ${r.color} flex items-center gap-1 flex-shrink-0`}><Icon className="w-3 h-3" />{r.rec}</span></div>); })}</div>)}
    </Card>

    {cutCandidates.length > 0 && (<Card className="border-rose-200 bg-gradient-to-br from-rose-50 to-white">
      <h3 className="font-display text-base mb-1 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-rose-600" /> ⚠️ พิจารณาตัด ({cutCandidates.length})</h3>
      <p className="text-[10px] text-stone-600 mb-3">สินค้าที่อาจควรเลิก เพื่อโฟกัสตัวที่ขายได้จริง</p>
      <div className="space-y-2">{cutCandidates.map(c => (<div key={c.product.id} className="p-2.5 bg-white border border-rose-200 rounded">
        <div className="flex items-center gap-2 mb-1.5">
          <CategoryBadge cat={c.product.category} />
          <div className="flex-1 min-w-0"><div className="text-sm font-semibold truncate">{truncate(c.product.name, 30)}</div></div>
          <span className="text-[10px] font-bold text-white bg-rose-600 px-1.5 py-0.5 rounded flex-shrink-0">{c.severity} เกณฑ์</span>
        </div>
        <div className="flex flex-wrap gap-1 ml-8">{c.reasons.map((r, i) => (<span key={i} className="text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.5 rounded">{r}</span>))}</div>
      </div>))}</div>
      <div className="mt-3 pt-3 border-t border-rose-100 text-[10px] text-stone-600">💡 <strong>ก่อนตัด:</strong> ตรวจว่ามีคลิปเก่าที่ยังขายได้ไหม? ดูใน TikTok Shop dashboard ก่อนปุ่ม delete</div>
    </Card>)}
  </div>);
}

function Modal({ title, onClose, children, size = 'md', footer }) {
  const maxW = size === 'lg' ? 'max-w-2xl' : 'max-w-md';
  return (<div className="fixed inset-0 bg-stone-900/60 z-40 flex items-end sm:items-center justify-center p-0 sm:p-4">
    <div className={`bg-white w-full ${maxW} rounded-t-xl sm:rounded-md shadow-2xl flex flex-col relative`} style={{ maxHeight: '88vh' }}>
      <button onClick={onClose} className="absolute top-2.5 right-2.5 z-20 p-1.5 bg-white shadow-md hover:bg-stone-100 rounded-full border border-stone-200" aria-label="ปิด"><X className="w-4 h-4" /></button>
      <div className="px-5 py-3 border-b border-stone-200 flex-shrink-0 pr-12 bg-white rounded-t-xl sm:rounded-t-md"><h2 className="font-display text-lg">{title}</h2></div>
      <div className="overflow-y-auto p-5 flex-1">{children}</div>
      {footer && <div className="border-t border-stone-200 px-5 py-3 bg-white flex-shrink-0 rounded-b-md">{footer}</div>}
    </div>
  </div>);
}

function FormField({ label, hint, children }) { return (<div className="mb-3">{label && <label className="text-xs font-semibold uppercase tracking-wider text-stone-600 block mb-1">{label}</label>}{children}{hint && <div className="text-[10px] text-stone-400 mt-1">{hint}</div>}</div>); }

function AddProductModal({ onClose, onSave, showToast }) {
  const [name, setName] = useState(''); const [brand, setBrand] = useState('');
  const [category, setCategory] = useState('A'); const [productType, setProductType] = useState('supplement');
  const [tiktokLink, setTiktokLink] = useState(''); const [kalodataLink, setKalodataLink] = useState('');
  const [gmvMaxPct, setGmvMaxPct] = useState(''); const [pillars, setPillars] = useState([]);
  const [tiktokRank, setTiktokRank] = useState('');
  const [price, setPrice] = useState('');
  const [sales7d, setSales7d] = useState(''); const [sales30d, setSales30d] = useState('');
  const [sc, setSc] = useState({ commission: '', gmv7dPct: '', gmv30dPct: '', creatorCount: '', anglesCount: '', crPct: '', concentration: '' });
  // Round 1: 2-Rules Gate + Shop Ads flag
  const [usedReal, setUsedReal] = useState(false);
  const [scopeOK, setScopeOK] = useState(false);
  const [isShopAds, setIsShopAds] = useState(false);
  const score = calcScore(sc); const dec = DECISION_INFO[getDecision(score.pct)];

  const suggestion = useMemo(() => autoClassify({ gmv30d: sales30d, commission: sc.commission, tiktokRank, price }), [sales30d, sc.commission, tiktokRank, price]);

  const handleSave = async () => {
    if (!name) return showToast('กรุณาใส่ชื่อสินค้าก่อน', 'error');
    if (!usedReal || !scopeOK) {
      const proceed = confirm('⚠️ ยังไม่ได้ติ๊ก 2-Rules Gate ครบ:\n' + (!usedReal ? '• ยังไม่ใช้จริง\n' : '') + (!scopeOK ? '• Scope ไม่ตรง\n' : '') + '\nบันทึกต่อใช่ไหม?');
      if (!proceed) return;
    }
    const salesData = (sales7d || sales30d) ? { last7d: Number(sales7d) || 0, last30d: Number(sales30d) || 0, updatedAt: new Date().toISOString() } : null;
    await onSave({ name, brand, category, productType, tiktokLink, kalodataLink, gmvMaxPct, pillars, scorecard: sc, tiktokRank: tiktokRank ? Number(tiktokRank) : null, price: price ? Number(price) : null, salesData, isShopAds, usedReal, scopeOK });
  };

  const footer = (<div className="flex items-center justify-between gap-3"><div className="flex-1 min-w-0"><div className="text-[10px] uppercase tracking-wider text-stone-400">Score</div><div className="font-mono text-base">{score.total}/{score.max} ({score.pct}%) {dec && <span className={`ml-1 text-[10px] font-bold px-2 py-0.5 rounded ${dec.bg} text-white`}>{dec.label}</span>}</div></div><button onClick={handleSave} className="bg-lime-400 text-stone-900 font-bold px-5 py-2 rounded-md hover:bg-lime-300 shadow-sm flex-shrink-0">บันทึก</button></div>);

  return (<Modal title="เพิ่มสินค้าใหม่" onClose={onClose} size="lg" footer={footer}>
    {/* 2-Rules Gate */}
    <div className="bg-amber-50 border border-amber-200 rounded p-2.5 mb-3">
      <div className="text-xs font-bold text-amber-900 mb-2">🚦 2-Rules Gate ก่อนเพิ่มสินค้า</div>
      <label className="flex items-start gap-2 text-xs cursor-pointer mb-1.5"><input type="checkbox" checked={usedReal} onChange={e => setUsedReal(e.target.checked)} className="mt-0.5 w-4 h-4 flex-shrink-0" /><span><strong>ใช้จริงแล้ว</strong> หรือ <span className="text-stone-500">First Impression Only (ระบุชัดในคลิป)</span></span></label>
      <label className="flex items-start gap-2 text-xs cursor-pointer"><input type="checkbox" checked={scopeOK} onChange={e => setScopeOK(e.target.checked)} className="mt-0.5 w-4 h-4 flex-shrink-0" /><span><strong>อยู่ใน Scope</strong> Fitness / Selfcare ของช่อง</span></label>
      {(!usedReal || !scopeOK) && <div className="text-[10px] text-amber-700 mt-1.5">⚠️ ติ๊กไม่ครบ — ระบบจะถาม confirm ก่อนบันทึก</div>}
    </div>
    <FormField label="ชื่อสินค้า *"><input value={name} onChange={e => setName(e.target.value)} autoFocus className="w-full px-3 py-2 border border-stone-200 rounded text-sm" placeholder="เช่น Oxyflow รองเท้า" /></FormField>
    <FormField label="แบรนด์ / ร้านค้า"><input value={brand} onChange={e => setBrand(e.target.value)} className="w-full px-3 py-2 border border-stone-200 rounded text-sm" /></FormField>
    <FormField label="ประเภทสินค้า"><div className="grid grid-cols-2 gap-1.5">{PRODUCT_TYPES.map(t => (<button key={t.id} onClick={() => setProductType(t.id)} className={`text-xs p-2 rounded border text-left ${productType === t.id ? 'bg-stone-900 text-white border-stone-900' : 'bg-white border-stone-200'}`}>{t.emoji} {t.label}</button>))}</div></FormField>
    <FormField><label className="flex items-center gap-2 cursor-pointer p-2 bg-rose-50 border border-rose-200 rounded"><input type="checkbox" checked={isShopAds} onChange={e => setIsShopAds(e.target.checked)} className="w-4 h-4" /><span className="text-sm">🛒 <strong>ตะกร้าแดง / Shop Ads</strong> — สินค้านี้มี GMV Max ที่ TikTok ปล่อย ad</span></label></FormField>
    <FormField label="หมวด ABCD *">
      {(sales30d || sc.commission || tiktokRank) && (
        <div className="bg-violet-50 border border-violet-200 rounded p-2 mb-2 text-xs">
          <div className="font-bold text-violet-900 mb-1">🤖 แนะนำ: <span className="text-base">{suggestion.label}</span> <span className={`ml-2 text-[10px] ${suggestion.confidence === 'high' ? 'text-emerald-700' : suggestion.confidence === 'medium' ? 'text-amber-700' : 'text-stone-500'}`}>({suggestion.confidence})</span></div>
          <div className="text-stone-700">{suggestion.reason}</div>
          {category !== suggestion.cat && <button onClick={() => setCategory(suggestion.cat)} className="mt-2 text-[10px] bg-violet-600 text-white px-2 py-1 rounded">ใช้คำแนะนำ → {suggestion.cat}</button>}
        </div>
      )}
      <div className="grid grid-cols-2 gap-2">{Object.entries(ABCD_INFO).filter(([k]) => k !== 'V').map(([k, info]) => (<button key={k} onClick={() => setCategory(k)} className={`p-2.5 text-left rounded border transition ${category === k ? `${info.bg} text-white border-transparent` : 'bg-white border-stone-200 hover:border-stone-400'}`}><div className="font-bold text-sm">{info.label}</div><div className={`text-[10px] ${category === k ? 'text-white/80' : 'text-stone-500'}`}>{info.desc}</div></button>))}</div>
    </FormField>
    <FormField label="Pillars ที่ใช้ได้"><div className="grid grid-cols-2 gap-1.5">{DEFAULT_PILLARS.map(p => { const on = pillars.includes(p.id); return (<button key={p.id} onClick={() => setPillars(on ? pillars.filter(x => x !== p.id) : [...pillars, p.id])} className={`text-xs p-2 rounded border text-left ${on ? 'bg-stone-900 text-white border-stone-900' : 'bg-white border-stone-200'}`}>{p.emoji} {p.id} — <span className={on ? 'text-stone-300' : 'text-stone-600'}>{p.desc}</span></button>); })}</div></FormField>
    <div className="grid grid-cols-2 gap-2">
      <FormField label="💰 ราคาขาย ฿" hint="ใช้คำนวณ orders + classifier"><input type="number" min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)} className="w-full px-3 py-2 border border-stone-200 rounded text-sm" placeholder="299" /></FormField>
      <FormField label="🏆 TikTok Rank" hint="อันดับ Top — ใส่เลข"><input type="number" min="1" value={tiktokRank} onChange={e => setTiktokRank(e.target.value)} className="w-full px-3 py-2 border border-stone-200 rounded text-sm" placeholder="5" /></FormField>
    </div>
    <div className="border-t border-stone-200 pt-4 mt-4 bg-emerald-50 -mx-5 px-5 py-3">
      <h3 className="font-display text-base mb-1">📈 ยอดขายจริง (จาก TikTok)</h3>
      <div className="grid grid-cols-2 gap-2">
        <FormField label="GMV 7 วัน ฿ (optional)"><input type="number" value={sales7d} onChange={e => setSales7d(e.target.value)} className="w-full px-2 py-1.5 border border-stone-200 rounded text-sm bg-white" placeholder="0" /></FormField>
        <FormField label="GMV 30 วัน ฿ (แนะนำ)"><input type="number" value={sales30d} onChange={e => setSales30d(e.target.value)} className="w-full px-2 py-1.5 border border-stone-200 rounded text-sm bg-white" placeholder="0" /></FormField>
      </div>
    </div>
    <div className="border-t border-stone-200 pt-4 mt-4"><h3 className="font-display text-base mb-2">📊 Scorecard</h3><p className="text-[10px] text-stone-500 mb-3">กรอกข้อมูลที่มี — ที่ไม่ระบุจะถูกข้าม</p>
      <div className="grid grid-cols-2 gap-2"><FormField label="Commission %" hint="≥20=3, ≥15=2, ≥10=1"><input type="number" value={sc.commission} onChange={e => setSc({ ...sc, commission: e.target.value })} className="w-full px-2 py-1.5 border border-stone-200 rounded text-sm" /></FormField><FormField label="Creator Count" hint="≤500=3, ≤1000=2, >1000=1"><input type="number" value={sc.creatorCount} onChange={e => setSc({ ...sc, creatorCount: e.target.value })} className="w-full px-2 py-1.5 border border-stone-200 rounded text-sm" /></FormField></div>
      <div className="bg-stone-100 rounded p-2 my-2"><div className="text-xs font-semibold text-stone-700 mb-2">GMV Trend</div><div className="grid grid-cols-2 gap-2"><FormField label="%GMV 7d"><input type="number" step="0.1" value={sc.gmv7dPct} onChange={e => setSc({ ...sc, gmv7dPct: e.target.value })} className="w-full px-2 py-1.5 border border-stone-200 rounded text-sm" placeholder="+15.2" /></FormField><FormField label="%GMV 30d"><input type="number" step="0.1" value={sc.gmv30dPct} onChange={e => setSc({ ...sc, gmv30dPct: e.target.value })} className="w-full px-2 py-1.5 border border-stone-200 rounded text-sm" placeholder="-8.5" /></FormField></div><div className="text-[10px] text-stone-500 mt-1">ทั้งคู่ + = 3 / Mixed = 2 / ทั้งคู่ - = 1</div></div>
      <div className="grid grid-cols-2 gap-2"><FormField label="Angles"><input type="number" value={sc.anglesCount} onChange={e => setSc({ ...sc, anglesCount: e.target.value })} className="w-full px-2 py-1.5 border border-stone-200 rounded text-sm" /></FormField><FormField label="CR %"><input type="number" value={sc.crPct} onChange={e => setSc({ ...sc, crPct: e.target.value })} className="w-full px-2 py-1.5 border border-stone-200 rounded text-sm" /></FormField><FormField label="Concentration %"><input type="number" value={sc.concentration} onChange={e => setSc({ ...sc, concentration: e.target.value })} className="w-full px-2 py-1.5 border border-stone-200 rounded text-sm" /></FormField></div>
    </div>
  </Modal>);
}

function EditProductInfoModal({ product, onClose, onSave }) {
  const [name, setName] = useState(product?.name || ''); const [brand, setBrand] = useState(product?.brand || '');
  const [productType, setProductType] = useState(product?.productType || 'supplement');
  const [tiktokLink, setTiktokLink] = useState(product?.tiktokLink || ''); const [kalodataLink, setKalodataLink] = useState(product?.kalodataLink || '');
  const [gmvMaxPct, setGmvMaxPct] = useState(product?.gmvMaxPct || '');
  const [tiktokRank, setTiktokRank] = useState(product?.tiktokRank || '');
  const [price, setPrice] = useState(product?.price || '');
  const [isShopAds, setIsShopAds] = useState(!!product?.isShopAds);
  const [sales7d, setSales7d] = useState(product?.salesData?.last7d || '');
  const [sales30d, setSales30d] = useState(product?.salesData?.last30d || '');
  if (!product) return null;
  const suggestion = useMemo(() => autoClassify({ gmv30d: sales30d, commission: product.scorecard?.commission, tiktokRank, price }), [sales30d, product.scorecard?.commission, tiktokRank, price]);
  const handleSave = () => {
    const salesData = (sales7d || sales30d) ? { last7d: Number(sales7d) || 0, last30d: Number(sales30d) || 0, updatedAt: new Date().toISOString() } : product.salesData;
    onSave({ name, brand, productType, tiktokLink, kalodataLink, gmvMaxPct, tiktokRank: tiktokRank ? Number(tiktokRank) : null, price: price ? Number(price) : null, isShopAds, salesData });
  };
  const footer = (<button onClick={handleSave} className="w-full bg-lime-400 text-stone-900 font-bold py-2.5 rounded">บันทึก</button>);
  return (<Modal title="แก้ไขข้อมูลสินค้า" onClose={onClose} footer={footer}>
    <FormField label="ชื่อสินค้า"><input value={name} onChange={e => setName(e.target.value)} className="w-full px-3 py-2 border border-stone-200 rounded text-sm" /></FormField>
    <FormField label="แบรนด์"><input value={brand} onChange={e => setBrand(e.target.value)} className="w-full px-3 py-2 border border-stone-200 rounded text-sm" /></FormField>
    <FormField label="ประเภทสินค้า"><div className="grid grid-cols-2 gap-1.5">{PRODUCT_TYPES.map(t => (<button key={t.id} onClick={() => setProductType(t.id)} className={`text-xs p-2 rounded border text-left ${productType === t.id ? 'bg-stone-900 text-white border-stone-900' : 'bg-white border-stone-200'}`}>{t.emoji} {t.label}</button>))}</div></FormField>
    <FormField><label className="flex items-center gap-2 cursor-pointer p-2 bg-rose-50 border border-rose-200 rounded"><input type="checkbox" checked={isShopAds} onChange={e => setIsShopAds(e.target.checked)} className="w-4 h-4" /><span className="text-sm">🛒 <strong>ตะกร้าแดง / Shop Ads</strong></span></label></FormField>
    <FormField label="TikTok Link"><input value={tiktokLink} onChange={e => setTiktokLink(e.target.value)} className="w-full px-3 py-2 border border-stone-200 rounded text-sm" /></FormField>
    <FormField label="Kalodata Link"><input value={kalodataLink} onChange={e => setKalodataLink(e.target.value)} className="w-full px-3 py-2 border border-stone-200 rounded text-sm" /></FormField>
    <FormField label="GMV MAX %"><input type="number" step="0.1" value={gmvMaxPct} onChange={e => setGmvMaxPct(e.target.value)} className="w-full px-3 py-2 border border-stone-200 rounded text-sm" /></FormField>
    <FormField label="🏆 TikTok Rank" hint="อันดับขายดีใน TikTok Shop เช่น 5 = Top 5"><input type="number" min="1" value={tiktokRank} onChange={e => setTiktokRank(e.target.value)} className="w-full px-3 py-2 border border-stone-200 rounded text-sm" placeholder="เช่น 5" /></FormField>
    <FormField label="💰 ราคาขาย ฿" hint="ใช้คำนวณ orders + commission/order + ปรับ Auto-Classifier"><input type="number" min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)} className="w-full px-3 py-2 border border-stone-200 rounded text-sm" placeholder="เช่น 299" /></FormField>
    <div className="border-t border-stone-200 pt-3 mt-3 bg-emerald-50 -mx-5 px-5 py-3"><h3 className="font-display text-base mb-1 flex items-center gap-1">📈 ยอดขายจริง (จาก TikTok)</h3>
      <div className="grid grid-cols-2 gap-2">
        <FormField label="ยอด 7 วัน ฿ (optional)"><input type="number" value={sales7d} onChange={e => setSales7d(e.target.value)} className="w-full px-2 py-1.5 border border-stone-200 rounded text-sm bg-white" placeholder="0" /></FormField>
        <FormField label="ยอด 30 วัน ฿ (แนะนำ)"><input type="number" value={sales30d} onChange={e => setSales30d(e.target.value)} className="w-full px-2 py-1.5 border border-stone-200 rounded text-sm bg-white" placeholder="0" /></FormField>
      </div>
      {product.salesData?.updatedAt && <div className="text-[10px] text-stone-500">อัพเดทล่าสุด: {fmtDate(product.salesData.updatedAt)} ({daysSince(product.salesData.updatedAt)}d ก่อน)</div>}
    </div>
    {(sales30d || tiktokRank) && product.category !== suggestion.cat && (
      <div className="bg-violet-50 border border-violet-200 rounded p-2 mt-3 text-xs">
        <div className="font-bold text-violet-900 mb-1">🤖 ตรวจสอบหมวด</div>
        <div className="text-stone-700">ระบบแนะนำ <strong>{suggestion.label}</strong> — {suggestion.reason}</div>
        <div className="text-[10px] text-stone-500 mt-1">ปัจจุบันอยู่หมวด {product.category} — เปลี่ยนได้ที่ Product Detail (กดที่ปุ่ม ABCD)</div>
      </div>
    )}
  </Modal>);
}

function EditScoreModal({ product, onClose, onSave }) {
  const [sc, setSc] = useState(product?.scorecard || {});
  if (!product) return null;
  const score = calcScore(sc); const dec = DECISION_INFO[getDecision(score.pct)];
  const footer = (<div className="flex items-center justify-between gap-3"><div className="flex-1 min-w-0"><div className="text-[10px] uppercase tracking-wider text-stone-400">Score</div><div className="font-mono text-base">{score.total}/{score.max} ({score.pct}%) {dec && <span className={`ml-1 text-[10px] font-bold px-2 py-0.5 rounded ${dec.bg} text-white`}>{dec.label}</span>}</div></div><button onClick={() => onSave(sc)} className="bg-lime-400 text-stone-900 font-bold px-5 py-2 rounded flex-shrink-0">บันทึก</button></div>);
  return (<Modal title={`คัดกรองใหม่: ${truncate(product.name, 20)}`} onClose={onClose} footer={footer}>
    <p className="text-xs text-stone-500 mb-3">คัดล่าสุด {daysSince(product.lastScoredAt)} วันที่แล้ว</p>
    <div className="grid grid-cols-2 gap-2"><FormField label="Commission %"><input type="number" value={sc.commission || ''} onChange={e => setSc({ ...sc, commission: e.target.value })} className="w-full px-2 py-1.5 border border-stone-200 rounded text-sm" /></FormField><FormField label="Creator Count"><input type="number" value={sc.creatorCount || ''} onChange={e => setSc({ ...sc, creatorCount: e.target.value })} className="w-full px-2 py-1.5 border border-stone-200 rounded text-sm" /></FormField></div>
    <div className="bg-stone-100 rounded p-2 my-2"><div className="text-xs font-semibold text-stone-700 mb-2">GMV Trend</div><div className="grid grid-cols-2 gap-2"><FormField label="%GMV 7d"><input type="number" step="0.1" value={sc.gmv7dPct || ''} onChange={e => setSc({ ...sc, gmv7dPct: e.target.value })} className="w-full px-2 py-1.5 border border-stone-200 rounded text-sm" /></FormField><FormField label="%GMV 30d"><input type="number" step="0.1" value={sc.gmv30dPct || ''} onChange={e => setSc({ ...sc, gmv30dPct: e.target.value })} className="w-full px-2 py-1.5 border border-stone-200 rounded text-sm" /></FormField></div></div>
    <div className="grid grid-cols-2 gap-2"><FormField label="Angles"><input type="number" value={sc.anglesCount || ''} onChange={e => setSc({ ...sc, anglesCount: e.target.value })} className="w-full px-2 py-1.5 border border-stone-200 rounded text-sm" /></FormField><FormField label="CR %"><input type="number" value={sc.crPct || ''} onChange={e => setSc({ ...sc, crPct: e.target.value })} className="w-full px-2 py-1.5 border border-stone-200 rounded text-sm" /></FormField><FormField label="Concentration %"><input type="number" value={sc.concentration || ''} onChange={e => setSc({ ...sc, concentration: e.target.value })} className="w-full px-2 py-1.5 border border-stone-200 rounded text-sm" /></FormField></div>
  </Modal>);
}

function AddPainModal({ onClose, onSave }) {
  const [text, setText] = useState(''); const [source, setSource] = useState('personal');
  const footer = (<button onClick={() => { if (text.trim()) onSave(text.trim(), source); }} className="w-full bg-lime-400 text-stone-900 font-bold py-2.5 rounded">บันทึก</button>);
  return (<Modal title="+ เพิ่ม Pain" onClose={onClose} footer={footer}>
    <FormField label="Pain Point *"><textarea value={text} onChange={e => setText(e.target.value)} autoFocus rows={3} className="w-full px-3 py-2 border border-stone-200 rounded text-sm" /></FormField>
    <FormField label="ที่มาของ Pain"><div className="grid grid-cols-1 gap-1">{PAIN_SOURCES.map(s => (<button key={s.id} onClick={() => setSource(s.id)} className={`text-left text-xs p-2 rounded border ${source === s.id ? 'bg-stone-900 text-white border-stone-900' : 'bg-white border-stone-200'}`}>{s.label}</button>))}</div></FormField>
  </Modal>);
}

function AddAngleModal({ onClose, onSave }) {
  const [text, setText] = useState('');
  const footer = (<button onClick={() => { if (text.trim()) onSave(text.trim()); }} className="w-full bg-lime-400 text-stone-900 font-bold py-2.5 rounded">บันทึก</button>);
  return (<Modal title="+ เพิ่ม Angle" onClose={onClose} footer={footer}>
    <FormField label="Angle / มุมเล่า *"><textarea value={text} onChange={e => setText(e.target.value)} autoFocus rows={3} className="w-full px-3 py-2 border border-stone-200 rounded text-sm" /></FormField>
  </Modal>);
}

function LockProductModal({ product, onClose, onSave }) {
  const [target, setTarget] = useState(10); const [anglesToTest, setAnglesToTest] = useState([]);
  const footer = (<button onClick={() => onSave(target, anglesToTest)} className="w-full bg-lime-400 text-stone-900 font-bold py-2.5 rounded">🔒 Lock</button>);
  return (<Modal title={`🔒 Lock: ${truncate(product.name, 25)}`} onClose={onClose} footer={footer}>
    <p className="text-xs text-stone-500 mb-3">Lock ไว้ใน Focus เดือนนี้</p>
    <FormField label="จำนวนคลิปเป้าหมาย *"><input type="number" value={target} onChange={e => setTarget(Number(e.target.value))} min={1} className="w-full px-3 py-2 border border-stone-200 rounded text-sm" /></FormField>
    {product.angles?.length > 0 && (<FormField label="Angles ที่จะ test เดือนนี้" hint="(เลือกหลายมุมได้)"><div className="space-y-1">{product.angles.map(a => { const on = anglesToTest.includes(a.id); return (<button key={a.id} onClick={() => setAnglesToTest(on ? anglesToTest.filter(x => x !== a.id) : [...anglesToTest, a.id])} className={`w-full text-left text-xs p-2 rounded border ${on ? 'bg-stone-900 text-white border-stone-900' : 'bg-white border-stone-200'}`}>{on ? '☑' : '☐'} {a.text}</button>); })}</div></FormField>)}
  </Modal>);
}

function AddClipModal({ products, defaultProductId, onClose, onSave, showToast }) {
  const [isV, setIsV] = useState(false); const [productId, setProductId] = useState(defaultProductId || '');
  const [pillarId, setPillarId] = useState(''); const [painId, setPainId] = useState(''); const [angleId, setAngleId] = useState('');
  const [hook, setHook] = useState(''); const [level, setLevel] = useState('consideration');
  const [postedAt, setPostedAt] = useState(todayStr()); const [videoLink, setVideoLink] = useState('');
  const [gencodeSubmitted, setGencodeSubmitted] = useState(false);
  const selectedProduct = products.find(p => p.id === productId);
  const handleSave = () => { 
    if (!isV && !productId) return showToast('กรุณาเลือกสินค้าก่อน', 'error'); 
    onSave({ isV, productId: isV ? null : productId, pillarId, painId, angleId, hook, level, postedAt: new Date(postedAt).toISOString(), videoLink, gencodeSubmitted }); 
  };
  const footer = (<button onClick={handleSave} className="w-full bg-lime-400 text-stone-900 font-bold py-2.5 rounded">บันทึก</button>);
  return (<Modal title="+ บันทึกคลิป" onClose={onClose} footer={footer}>
    <FormField label="ประเภทคลิป"><div className="grid grid-cols-2 gap-2"><button onClick={() => setIsV(false)} className={`p-2 rounded border text-sm ${!isV ? 'bg-stone-900 text-white border-stone-900' : 'bg-white border-stone-200'}`}>📦 คลิปสินค้า</button><button onClick={() => setIsV(true)} className={`p-2 rounded border text-sm ${isV ? 'bg-stone-900 text-white border-stone-900' : 'bg-white border-stone-200'}`}>📚 V — Value</button></div></FormField>
    {!isV && (<FormField label="สินค้า *"><select value={productId} onChange={e => setProductId(e.target.value)} className="w-full px-3 py-2 border border-stone-200 rounded text-sm"><option value="">-- เลือก --</option>{products.map(p => <option key={p.id} value={p.id}>{ABCD_INFO[p.category]?.short || '?'} — {p.name}</option>)}</select></FormField>)}
    <FormField label="Pillar"><select value={pillarId} onChange={e => setPillarId(e.target.value)} className="w-full px-3 py-2 border border-stone-200 rounded text-sm"><option value="">-</option>{DEFAULT_PILLARS.map(p => <option key={p.id} value={p.id}>{p.id} — {p.name}</option>)}</select></FormField>
    {selectedProduct && !isV && (<><FormField label="Pain"><select value={painId} onChange={e => setPainId(e.target.value)} className="w-full px-3 py-2 border border-stone-200 rounded text-sm"><option value="">-</option>{selectedProduct.pains?.map(p => <option key={p.id} value={p.id}>{p.text.slice(0, 50)}</option>)}</select></FormField><FormField label="Angle"><select value={angleId} onChange={e => setAngleId(e.target.value)} className="w-full px-3 py-2 border border-stone-200 rounded text-sm"><option value="">-</option>{selectedProduct.angles?.map(a => <option key={a.id} value={a.id}>{a.text.slice(0, 50)}</option>)}</select></FormField></>)}
    <FormField label="Hook ที่ใช้"><input value={hook} onChange={e => setHook(e.target.value)} className="w-full px-3 py-2 border border-stone-200 rounded text-sm" /></FormField>
    <FormField label="ระดับคลิป"><div className="grid grid-cols-3 gap-1">{CLIP_LEVELS.map(l => (<button key={l.id} onClick={() => setLevel(l.id)} className={`text-xs p-2 rounded ${level === l.id ? l.color + ' text-white' : 'bg-white border border-stone-200'}`}>{l.label}</button>))}</div></FormField>
    <FormField label="วันที่ลง"><input type="date" value={postedAt} onChange={e => setPostedAt(e.target.value)} className="w-full px-3 py-2 border border-stone-200 rounded text-sm" /></FormField>
    <FormField label="Video Link"><input value={videoLink} onChange={e => setVideoLink(e.target.value)} className="w-full px-3 py-2 border border-stone-200 rounded text-sm" placeholder="https://tiktok.com/..." /></FormField>
    <FormField><label className="flex items-center gap-2 cursor-pointer p-2 bg-stone-50 rounded"><input type="checkbox" checked={gencodeSubmitted} onChange={e => setGencodeSubmitted(e.target.checked)} className="w-4 h-4" /><span className="text-sm">✅ ส่ง Gencode แล้ว</span></label></FormField>
  </Modal>);
}

function EditClipModal({ clip, products, onClose, onSave, onDelete }) {
  const [productId, setProductId] = useState(clip.productId || '');
  const [pillarId, setPillarId] = useState(clip.pillarId || '');
  const [painId, setPainId] = useState(clip.painId || '');
  const [angleId, setAngleId] = useState(clip.angleId || '');
  const [hook, setHook] = useState(clip.hook || ''); const [level, setLevel] = useState(clip.level || 'consideration');
  const [postedAt, setPostedAt] = useState(clip.postedAt?.slice(0, 10) || todayStr());
  const [videoLink, setVideoLink] = useState(clip.videoLink || '');
  const [gencodeSubmitted, setGencodeSubmitted] = useState(!!clip.gencodeSubmitted);
  const [views24h, setViews24h] = useState(clip.views24h || ''); const [views7d, setViews7d] = useState(clip.views7d || '');
  const [orders, setOrders] = useState(clip.orders || ''); const [gmv, setGmv] = useState(clip.gmv || '');
  const [ctr, setCtr] = useState(clip.ctr || ''); const [note, setNote] = useState(clip.note || '');
  const selectedProduct = products.find(p => p.id === productId);
  const handleSave = () => onSave({ productId: clip.isV ? null : productId, pillarId, painId, angleId, hook, level, postedAt: new Date(postedAt).toISOString(), videoLink, gencodeSubmitted, views24h: Number(views24h) || null, views7d: Number(views7d) || null, orders: Number(orders) || null, gmv: Number(gmv) || null, ctr: Number(ctr) || null, note });
  const footer = (<div className="flex gap-2"><button onClick={onDelete} className="px-3 text-xs text-rose-600 hover:bg-rose-50 rounded py-2.5">🗑️ ลบ</button><button onClick={handleSave} className="flex-1 bg-lime-400 text-stone-900 font-bold py-2.5 rounded">บันทึก</button></div>);
  return (<Modal title="✏️ แก้ไขคลิป" onClose={onClose} size="lg" footer={footer}>
    {!clip.isV && (<FormField label="สินค้า"><select value={productId} onChange={e => setProductId(e.target.value)} className="w-full px-3 py-2 border border-stone-200 rounded text-sm"><option value="">-- เลือก --</option>{products.map(p => <option key={p.id} value={p.id}>{ABCD_INFO[p.category]?.short || '?'} — {p.name}</option>)}</select></FormField>)}
    <div className="grid grid-cols-2 gap-2"><FormField label="Pillar"><select value={pillarId} onChange={e => setPillarId(e.target.value)} className="w-full px-2 py-1.5 border border-stone-200 rounded text-sm"><option value="">-</option>{DEFAULT_PILLARS.map(p => <option key={p.id} value={p.id}>{p.id}</option>)}</select></FormField><FormField label="วันที่ลง"><input type="date" value={postedAt} onChange={e => setPostedAt(e.target.value)} className="w-full px-2 py-1.5 border border-stone-200 rounded text-sm" /></FormField></div>
    {selectedProduct && !clip.isV && (<div className="grid grid-cols-2 gap-2"><FormField label="Pain"><select value={painId} onChange={e => setPainId(e.target.value)} className="w-full px-2 py-1.5 border border-stone-200 rounded text-sm"><option value="">-</option>{selectedProduct.pains?.map(p => <option key={p.id} value={p.id}>{p.text.slice(0, 30)}</option>)}</select></FormField><FormField label="Angle"><select value={angleId} onChange={e => setAngleId(e.target.value)} className="w-full px-2 py-1.5 border border-stone-200 rounded text-sm"><option value="">-</option>{selectedProduct.angles?.map(a => <option key={a.id} value={a.id}>{a.text.slice(0, 30)}</option>)}</select></FormField></div>)}
    <FormField label="Hook"><input value={hook} onChange={e => setHook(e.target.value)} className="w-full px-3 py-2 border border-stone-200 rounded text-sm" /></FormField>
    <FormField label="ระดับคลิป"><div className="grid grid-cols-3 gap-1">{CLIP_LEVELS.map(l => (<button key={l.id} onClick={() => setLevel(l.id)} className={`text-xs p-2 rounded ${level === l.id ? l.color + ' text-white' : 'bg-white border border-stone-200'}`}>{l.label}</button>))}</div></FormField>
    <FormField label="Video Link"><input value={videoLink} onChange={e => setVideoLink(e.target.value)} className="w-full px-3 py-2 border border-stone-200 rounded text-sm" /></FormField>
    <FormField><label className="flex items-center gap-2 cursor-pointer p-2 bg-stone-50 rounded"><input type="checkbox" checked={gencodeSubmitted} onChange={e => setGencodeSubmitted(e.target.checked)} className="w-4 h-4" /><span className="text-sm">✅ ส่ง Gencode แล้ว</span></label></FormField>
    <div className="border-t border-stone-200 pt-3 mt-3"><h3 className="font-display text-base mb-2">📊 Performance</h3>
      <div className="grid grid-cols-2 gap-2"><FormField label="Views 24h"><input type="number" value={views24h} onChange={e => setViews24h(e.target.value)} className="w-full px-2 py-1.5 border border-stone-200 rounded text-sm" /></FormField><FormField label="Views 7d"><input type="number" value={views7d} onChange={e => setViews7d(e.target.value)} className="w-full px-2 py-1.5 border border-stone-200 rounded text-sm" /></FormField><FormField label="Orders"><input type="number" value={orders} onChange={e => setOrders(e.target.value)} className="w-full px-2 py-1.5 border border-stone-200 rounded text-sm" /></FormField><FormField label="GMV ฿"><input type="number" value={gmv} onChange={e => setGmv(e.target.value)} className="w-full px-2 py-1.5 border border-stone-200 rounded text-sm" /></FormField><FormField label="CTR %"><input type="number" step="0.1" value={ctr} onChange={e => setCtr(e.target.value)} className="w-full px-2 py-1.5 border border-stone-200 rounded text-sm" /></FormField></div>
      <FormField label="Note"><textarea value={note} onChange={e => setNote(e.target.value)} rows={2} className="w-full px-3 py-2 border border-stone-200 rounded text-sm" placeholder="เช่น 'ปังกว่าที่คาด'" /></FormField>
    </div>
  </Modal>);
}

function MakeSimilarModal({ clip, products, onClose }) {
  const product = products.find(p => p.id === clip.productId);
  const [copied, setCopied] = useState(false);
  const generatePrompt = () => {
    if (!product && !clip.isV) return 'ไม่พบสินค้า';
    const pillar = DEFAULT_PILLARS.find(p => p.id === clip.pillarId);
    const pain = product?.pains?.find(p => p.id === clip.painId);
    const angle = product?.angles?.find(a => a.id === clip.angleId);
    const lines = [
      `เขียน 3 สคริปต์ใหม่ "แตกมุม" จากคลิป Winner เดิม สำหรับช่อง PEEM6PACK`, ``,
      `[คลิปเดิม — ขายดี]`, `Hook: ${clip.hook || '-'}`, `GMV ที่ได้: ฿${fmtNum(clip.gmv)}`, ``,
      `[สินค้า]`, product ? `ชื่อ: ${product.name}${product.brand ? ` (${product.brand})` : ''}` : 'V Content', product ? `หมวด: ${ABCD_INFO[product.category]?.label || '-'}` : '',
      pillar ? `Pillar: ${pillar.id} — ${pillar.name}` : '', pain ? `Pain: ${pain.text}` : '', angle ? `Angle: ${angle.text}` : '', ``,
      `[ภารกิจ]`, `เขียนสคริปต์ใหม่ 3 ตัว ที่ใช้ Pain/Angle เดิม แต่ "เปลี่ยนมุมเล่า":`,
      `1. เปลี่ยน Persona (กลุ่มเป้าหมาย) เช่น คนอ้วน/นักวิ่ง/คนทำงาน`,
      `2. เปลี่ยน Situation (สถานการณ์) เช่น ที่ยิม/วิ่งสวน/ก่อนนอน`,
      `3. เปลี่ยน Format (รูปแบบ) เช่น POV / Compare / Story`, ``,
      `[โครงสร้างทุกตัว]`, `Hook → Problem → Value/Demo → Soft CTA`, ``,
      `[เงื่อนไข]`, `- พูดแบบเพื่อนแนะนำเพื่อน`, `- 1 คลิป = 1 ประเด็น`, `- ห้ามใช้ Hook เดิม — ต้องคิดใหม่ 3 แบบ`, ``,
      `[Output]`, `สำหรับแต่ละสคริปต์: Persona / Situation / Format / Hook ใหม่ / Script (ตาราง เวลา-Visual-Voiceover) / CTA / Caption`, ``,
      `ระยะเวลา: 45-60 วินาที/คลิป`
    ].filter(Boolean).join('\n');
    return lines;
  };
  const handleCopy = async () => { try { await navigator.clipboard.writeText(generatePrompt()); setCopied(true); setTimeout(() => setCopied(false), 2000); } catch (e) { console.error(e); } };
  const footer = (<button onClick={handleCopy} className={`w-full font-bold py-2.5 rounded flex items-center justify-center gap-2 ${copied ? 'bg-emerald-400 text-stone-900' : 'bg-lime-400 text-stone-900 hover:bg-lime-300'}`}>{copied ? <><CheckCircle2 className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy Prompt</>}</button>);
  return (<Modal title="🏆 ทำซ้ำ Winner" onClose={onClose} size="lg" footer={footer}>
    <div className="bg-amber-50 border border-amber-200 rounded p-3 mb-3"><div className="text-xs font-bold text-amber-900 mb-1">📌 Winner Clip เดิม</div><div className="text-sm font-semibold">{clip.hook}</div><div className="text-xs text-stone-600 mt-1">{product?.name || 'V Content'} · ฿{fmtNum(clip.gmv)} · {daysSince(clip.postedAt)}d ที่แล้ว</div></div>
    <p className="text-xs text-stone-600 mb-2">Prompt นี้จะให้ AI สร้าง <strong>3 สคริปต์ใหม่</strong> แตกมุมจาก Winner เดิม → Copy ไปวาง Claude/ChatGPT</p>
    <pre className="text-[10px] bg-stone-950 text-stone-300 p-3 rounded overflow-x-auto whitespace-pre-wrap font-mono">{generatePrompt()}</pre>
  </Modal>);
}

function BackupModal({ products, clips, onClose, showToast }) {
  const data = { products, clips, exportedAt: new Date().toISOString(), version: 2.2 };
  const json = JSON.stringify(data, null, 2);
  const filename = `peem6pack-backup-${todayStr()}.json`;
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const tryDownload = () => {
    try {
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url; a.download = filename;
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 100);
      setDownloaded(true); setTimeout(() => setDownloaded(false), 2000);
      showToast?.('Download เริ่มแล้ว — เช็คโฟลเดอร์ Downloads');
    } catch (e) { console.error(e); showToast?.('Download ผิดพลาด — ใช้ Copy แทน', 'error'); }
  };

  const copyAll = async () => {
    try { await navigator.clipboard.writeText(json); setCopied(true); setTimeout(() => setCopied(false), 2000); showToast?.('Copy แล้ว!'); }
    catch (e) { console.error(e); showToast?.('Copy ผิดพลาด', 'error'); }
  };

  const sizeKB = (new Blob([json]).size / 1024).toFixed(1);
  const footer = (<div className="grid grid-cols-2 gap-2">
    <button onClick={tryDownload} className={`font-bold py-2.5 rounded flex items-center justify-center gap-1.5 transition ${downloaded ? 'bg-emerald-500 text-white' : 'bg-lime-400 text-stone-900 hover:bg-lime-300'}`}>{downloaded ? <><CheckCircle2 className="w-4 h-4" /> สำเร็จ</> : <><Download className="w-4 h-4" /> Download</>}</button>
    <button onClick={copyAll} className={`font-bold py-2.5 rounded flex items-center justify-center gap-1.5 transition ${copied ? 'bg-emerald-500 text-white' : 'bg-violet-600 text-white hover:bg-violet-700'}`}>{copied ? <><CheckCircle2 className="w-4 h-4" /> Copied!</> : <><Copy className="w-4 h-4" /> Copy ทั้งหมด</>}</button>
  </div>);

  return (<Modal title="💾 Backup ข้อมูล" onClose={onClose} size="lg" footer={footer}>
    <div className="bg-stone-100 rounded p-3 mb-3 grid grid-cols-3 gap-2 text-xs"><div><div className="text-stone-500 text-[10px] uppercase">📦 สินค้า</div><div className="font-mono font-bold">{products.length}</div></div><div><div className="text-stone-500 text-[10px] uppercase">🎬 คลิป</div><div className="font-mono font-bold">{clips.length}</div></div><div><div className="text-stone-500 text-[10px] uppercase">💾 ขนาด</div><div className="font-mono font-bold">{sizeKB} KB</div></div></div>
    <div className="bg-amber-50 border border-amber-200 rounded p-2.5 mb-3 text-xs"><div className="font-bold text-amber-900 mb-1">📌 วิธีใช้ (อัพเกรดเป็น Cloud แล้ว)</div><div className="text-amber-800 space-y-0.5"><div><strong>ปัจจุบันระบบซิงค์อัตโนมัติแล้ว</strong> คุณไม่จำเป็นต้อง Backup เพื่อย้ายเครื่องอีกต่อไป</div><div>แต่แนะนำให้กด Download เก็บไฟล์ <code className="bg-amber-100 px-1 rounded text-[10px]">{filename}</code> ไว้ทุกสิ้นเดือน เพื่อเป็น Snapshot สำรองข้อมูลของตัวเองครับ</div></div></div>
    <details><summary className="text-xs text-stone-500 cursor-pointer mb-2">▸ ดูข้อมูลก่อน (JSON)</summary><textarea readOnly value={json} className="w-full h-48 px-2 py-1.5 text-[10px] font-mono bg-stone-950 text-stone-300 rounded resize-none" onClick={e => e.target.select()} /></details>
  </Modal>);
}

function SettingsModal({ onClose, onExport, onClearAll }) {
  return (<Modal title="⚙️ Settings" onClose={onClose}><div className="space-y-3">
    <button onClick={onExport} className="w-full p-3 bg-stone-100 hover:bg-stone-200 rounded text-left"><div className="font-semibold text-sm">💾 Backup ข้อมูล (Download / Copy)</div><div className="text-xs text-stone-500">Backup เป็นไฟล์ JSON เก็บไว้เป็นรอบๆ</div></button>
    <div className="border-t border-stone-200 pt-3"><button onClick={onClearAll} className="w-full p-3 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded text-left"><div className="font-semibold text-sm">🗑️ ล้างข้อมูลทั้งหมด</div><div className="text-xs">⚠️ ลบข้อมูลทิ้งทั้งบนเครื่องและบน Cloud ถาวร</div></button></div>
    <div className="border-t border-stone-200 pt-3 text-xs text-stone-500 space-y-1">
      <div><strong>Version:</strong> v2.5 (Cloud Firestore)</div>
      <div><strong>Argoon:</strong> ≥{ARGOON_PASS}/{ARGOON_MAX} PASS · {ARGOON_WATCH}-{ARGOON_PASS - 1} WATCH · &lt;{ARGOON_WATCH} CUT</div>
      <div><strong>Decision %:</strong> ≥{PICK_THRESHOLD}% PICK · ≥{WAIT_THRESHOLD}% WAIT · &lt;{WAIT_THRESHOLD}% DROP</div>
      <div><strong>Rescore:</strong> ทุก {RESCORE_DAYS} วัน · <strong>Winner:</strong> GMV ≥ ฿{fmtNum(WINNER_GMV)}</div>
      <div><strong>Portfolio Target:</strong> A {PORTFOLIO_TARGET.A}% / B {PORTFOLIO_TARGET.B}% / C {PORTFOLIO_TARGET.C}% / D {PORTFOLIO_TARGET.D}%</div>
      <div><strong>Blended Commission Target:</strong> ≥{BLENDED_COMMISSION_TARGET}%</div>
    </div>
  </div></Modal>);
}
