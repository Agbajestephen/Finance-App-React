import { db } from "../firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";

/* =========================
   ACCOUNTS
========================= */

export async function loadAccounts(uid) {
  if (!uid) return [];

  const ref = doc(db, "users", uid, "accounts", "data");
  const snap = await getDoc(ref);

  return snap.exists() ? snap.data().accounts || [] : [];
}

export async function saveAccounts(uid, accounts) {
  if (!uid) throw new Error("No user id");

  const ref = doc(db, "users", uid, "accounts", "data");
  await setDoc(ref, { accounts }, { merge: true });
}

/* =========================
   TRANSACTIONS
========================= */

export async function loadTransactions(uid) {
  if (!uid) return [];

  const ref = doc(db, "users", uid, "transactions", "data");
  const snap = await getDoc(ref);

  return snap.exists() ? snap.data().transactions || [] : [];
}

export async function saveTransactions(uid, transactions) {
  if (!uid) throw new Error("No user id");

  const ref = doc(db, "users", uid, "transactions", "data");
  await setDoc(ref, { transactions }, { merge: true });
}
