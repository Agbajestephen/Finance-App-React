import { collection, query, where, getDocs } from "firebase/firestore"
import { db } from "../firebase"

export async function findUserByAccountNumber(accountNumber) {
  const q = query(
    collection(db, "users"),
    where("primaryAccountNumber", "==", accountNumber)
  )

  const snap = await getDocs(q)

  if (snap.empty) return null

  const docSnap = snap.docs[0]
  return {
    uid: docSnap.id,
    name: docSnap.data().displayName
  }
}