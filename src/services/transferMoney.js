import {
  doc,
  runTransaction,
  serverTimestamp,
  collection,
} from "firebase/firestore";
import { db } from "../firebase";
import { findUserByAccountNumber } from "./findUserByAccount";

export const transferMoney = async ({
  senderUid,
  recipientAccountNumber,
  amount,
}) => {
  if (amount <= 0) throw new Error("Invalid amount");

  const recipient = await findUserByAccountNumber(recipientAccountNumber);
  if (!recipient) throw new Error("Account not found");

  if (recipient.uid === senderUid)
    throw new Error("Cannot transfer to yourself");

  const senderRef = doc(db, "accounts", senderUid);
  const receiverRef = doc(db, "accounts", recipient.uid);

  await runTransaction(db, async (transaction) => {
    const senderSnap = await transaction.get(senderRef);
    const receiverSnap = await transaction.get(receiverRef);

    if (!senderSnap.exists() || !receiverSnap.exists())
      throw new Error("Account missing");

    const senderBalance = senderSnap.data().balance;

    if (senderBalance < amount)
      throw new Error("Insufficient balance");

    transaction.update(senderRef, {
      balance: senderBalance - amount,
      updatedAt: serverTimestamp(),
    });

    transaction.update(receiverRef, {
      balance: receiverSnap.data().balance + amount,
      updatedAt: serverTimestamp(),
    });

    const txRef = doc(collection(db, "transactions"));

    transaction.set(txRef, {
      fromUid: senderUid,
      toUid: recipient.uid,
      fromAccount: senderSnap.data().accountNumber,
      toAccount: recipient.accountNumber,
      amount,
      type: "transfer",
      status: "success",
      createdAt: serverTimestamp(),
    });
  });

  return {
    success: true,
    recipientName: recipient.name,
  };
};
