import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

// Simple, unique account number generator
const generateAccountNumber = () => {
  const random = Math.floor(1000000000 + Math.random() * 9000000000);
  return `SB-${random}`;
};

export const createMainAccount = async (user) => {
  if (!user?.uid) return;

  const userRef = doc(db, "users", user.uid);
  const accountRef = doc(db, "accounts", user.uid);
  const savingsRef = doc(db, "savings", user.uid);

  // 1️⃣ Check if user document already exists
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    // Account already created, do nothing
    return;
  }

  // 2️⃣ Generate account number
  const accountNumber = generateAccountNumber();

  // 3️⃣ Create user profile (identity + account number)
  await setDoc(userRef, {
    uid: user.uid,
    name: user.displayName || "User",
    email: user.email,
    accountNumber,
    role: "user",
    createdAt: serverTimestamp(),
  });

  // 4️⃣ Create main account with ₦20,000
  await setDoc(accountRef, {
    balance: 20000,
    currency: "NGN",
    updatedAt: serverTimestamp(),
  });

  // 5️⃣ Create savings account with ₦0
  await setDoc(savingsRef, {
    balance: 0,
    createdAt: serverTimestamp(),
  });
};
