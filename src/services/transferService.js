import {
  collection,
  query,
  where,
  getDocs,
  doc,
  runTransaction,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";

/**
 * Transfer money using account number
 */
export const transferByAccountNumber = async ({
  senderUid,
  receiverAccountNumber,
  amount,
  note = "",
}) => {
  if (amount <= 0) throw new Error("Invalid amount");

  // Find receiver by account number
  const usersRef = collection(db, "users");
  const q = query(
    usersRef,
    where("mainAccount.accountNumber", "==", receiverAccountNumber)
  );

  const snap = await getDocs(q);

  if (snap.empty) {
    throw new Error("Receiver account not found");
  }

  const receiverDoc = snap.docs[0];
  const receiverRef = receiverDoc.ref;
  const senderRef = doc(db, "users", senderUid);

  await runTransaction(db, async (tx) => {
    const senderSnap = await tx.get(senderRef);
    const receiverSnap = await tx.get(receiverRef);

    if (!senderSnap.exists()) throw new Error("Sender not found");

    const senderBalance = senderSnap.data().mainAccount.balance;
    if (senderBalance < amount) throw new Error("Insufficient balance");

    // Update balances
    tx.update(senderRef, {
      "mainAccount.balance": senderBalance - amount,
    });

    tx.update(receiverRef, {
      "mainAccount.balance":
        receiverSnap.data().mainAccount.balance + amount,
    });

    // Log transaction
    const txnRef = doc(collection(db, "transactions"));
    tx.set(txnRef, {
      from: senderSnap.data().mainAccount.accountNumber,
      to: receiverAccountNumber,
      amount,
      note,
      type: "transfer",
      status: "completed",
      createdAt: serverTimestamp(),
    });
  });

  return true;
};
