import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Find user by primary account number
 * Used before external transfers
 */
export const findUserByAccountNumber = async (accountNumber) => {
  if (!accountNumber) return null;

  const q = query(
    collection(db, "users"),
    where("accountNumber", "==", accountNumber)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const docSnap = snapshot.docs[0];

  return {
    uid: docSnap.id,
    name: docSnap.data().fullName || docSnap.data().displayName || "User",
    accountNumber: docSnap.data().accountNumber,
  };
};
