import {
  collection,
  query,
  where,
  getDocs,
  doc,
  runTransaction,
} from "firebase/firestore";
import { db } from "../firebase";

export const transferByAccountNumber = async ({
  senderUid,
  receiverAccountNumber,
  amount,
  note = "",
}) => {
  if (amount <= 0) throw new Error("Invalid amount");

  // 🔍 Find receiver
  const q = query(
    collection(db, "users"),
    where("accountNumber", "==", receiverAccountNumber)
  );

  const snap = await getDocs(q);
  if (snap.empty) throw new Error("Receiver account not found");

  const receiverUid = snap.docs[0].id;

  const senderAccountsRef = doc(db, "users", senderUid, "accounts", "data");
  const receiverAccountsRef = doc(
    db,
    "users",
    receiverUid,
    "accounts",
    "data"
  );

  await runTransaction(db, async (tx) => {
    const senderSnap = await tx.get(senderAccountsRef);
    const receiverSnap = await tx.get(receiverAccountsRef);

    if (!senderSnap.exists() || !receiverSnap.exists()) {
      throw new Error("Account data missing");
    }

    const senderAccounts = senderSnap.data().accounts;
    const receiverAccounts = receiverSnap.data().accounts;

    const senderMain = senderAccounts.find(a => a.id === "main");
    const receiverMain = receiverAccounts.find(a => a.id === "main");

    if (!senderMain || !receiverMain) {
      throw new Error("Main account not found");
    }

    if (senderMain.balance < amount) {
      throw new Error("Insufficient balance");
    }

    // ✅ Update balances
    senderMain.balance -= amount;
    receiverMain.balance += amount;

    tx.update(senderAccountsRef, { accounts: senderAccounts });
    tx.update(receiverAccountsRef, { accounts: receiverAccounts });
  });

  return true;
};
