import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

// 10-digit Nigerian-style account number
export async function generateAccountNumber() {
  let exists = true;
  let accountNumber;

  while (exists) {
    accountNumber = Math.floor(
      1000000000 + Math.random() * 9000000000
    ).toString();

    const ref = doc(db, "accounts", accountNumber);
    const snap = await getDoc(ref);
    exists = snap.exists();
  }

  return accountNumber;
}
