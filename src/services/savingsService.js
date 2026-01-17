import {
  collection,
  addDoc,
  doc,
  updateDoc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore"
import { db } from "../firebase"

export const createSavingsAccount = async (uid, name) => {
  if (!uid || !name) throw new Error("Invalid data")

  const ref = collection(db, "users", uid, "savingsAccounts")

  await addDoc(ref, {
    name,
    balance: 0,
    createdAt: serverTimestamp(),
  })
}
