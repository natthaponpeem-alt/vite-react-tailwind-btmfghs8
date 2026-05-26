import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

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

// ตั้งค่าปุ่ม Google Login
const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account' // บังคับให้ถามบัญชีทุกครั้ง ป้องกันเบราว์เซอร์จำเมลผิด
});

// 🔒 แก้อีเมลตรงนี้: ใส่ Gmail ของคุณ (คนอื่นที่ใช้อีเมลอื่น จะโดนระบบเตะออกทันที!)
export const ADMIN_EMAIL = "natthapon.peem@gmail.com"; 

export { auth, db, googleProvider };
