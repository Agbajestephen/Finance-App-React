import { db, doc, getDoc, setDoc } from "../firebase";
import { collection, getDocs } from "firebase/firestore";

// Settings stored at: users/{uid}/settings/prefs
export async function loadSettings(uid) {
  if (!uid) return null;
  const ref = doc(db, "users", uid, "settings", "prefs");
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function saveSettings(uid, data) {
  if (!uid) throw new Error("No user id provided");
  const ref = doc(db, "users", uid, "settings", "prefs");
  await setDoc(ref, data, { merge: true });
}

// Profile stored at: users/{uid}/profile/meta
export async function loadProfile(uid) {
  if (!uid) return null;
  const ref = doc(db, "users", uid, "profile", "meta");
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
}

export async function saveProfile(uid, data) {
  if (!uid) throw new Error("No user id provided");
  const ref = doc(db, "users", uid, "profile", "meta");
  await setDoc(ref, data, { merge: true });
  // Also write a lightweight top-level user doc so admins can list users
  try {
    const topRef = doc(db, "users", uid);
    const topData = {
      displayName: data.displayName || null,
      email: data.email || null,
      accountType: data.accountType || null,
      joinDate: data.joinDate || null,
    };
    await setDoc(topRef, topData, { merge: true });
  } catch (err) {
    console.error("Failed to write top-level user doc:", err);
  }
}

// Loans stored at: users/{uid}/loans/list (field `loans` is an array)
export async function loadLoans(uid) {
  if (!uid) return [];
  const ref = doc(db, "users", uid, "loans", "list");
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data().loans || [] : [];
}

export async function saveLoans(uid, loans) {
  if (!uid) throw new Error("No user id provided");
  const ref = doc(db, "users", uid, "loans", "list");
  await setDoc(ref, { loans }, { merge: true });
}

// Admin helper: list lightweight user documents under `users` collection
export async function listUsers() {
  const col = collection(db, "users");
  const snaps = await getDocs(col);
  const users = [];
  snaps.forEach((d) => {
    users.push({ id: d.id, ...d.data() });
  });
  return users;
}
