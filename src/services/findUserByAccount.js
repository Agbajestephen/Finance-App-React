import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export const findUserByAccountNumber = async (accountNumber) => {
  const q = query(
    collection(db, "users"),
    where("accountNumber", "==", accountNumber)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) return null;

  const docSnap = snapshot.docs[0];
  return {
    uid: docSnap.id,
    ...docSnap.data(),
  };
};
