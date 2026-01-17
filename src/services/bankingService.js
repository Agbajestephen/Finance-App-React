import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

/* ACCOUNTS */
export async function loadAccounts(uid) {
  const ref = doc(db, "users", uid, "accounts", "data");
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data().accounts : [];
}

export async function saveAccounts(uid, accounts) {
  const ref = doc(db, "users", uid, "accounts", "data");
  await setDoc(ref, { accounts }, { merge: true });
}

/* TRANSACTIONS */
export async function loadTransactions(uid) {
  const ref = doc(db, "users", uid, "transactions", "data");
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data().transactions : [];
}

export async function saveTransactions(uid, transactions) {
  const ref = doc(db, "users", uid, "transactions", "data");
  await setDoc(ref, { transactions }, { merge: true });
}
