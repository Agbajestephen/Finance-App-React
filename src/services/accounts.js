import {
  collection,
  getDocs,
  query,
  where
} from "firebase/firestore";
import { db } from "./index";

// Generates UNIQUE SoftBank account number
export async function generateAccountNumber() {
  let exists = true;
  let accountNumber = "";

  while (exists) {
    accountNumber = "SB" + Math.floor(10000000 + Math.random() * 90000000);

    const q = query(
      collection(db, "users"),
      where("mainAccount.accountNumber", "==", accountNumber)
    );

    const snapshot = await getDocs(q);
    exists = !snapshot.empty;
  }

  return accountNumber;
}
