import { doc, getDoc, updateDoc, addDoc, collection } from "firebase/firestore";
import { db } from "../firebase";
import { findUserByAccountNumber } from "./findUserByAccount";

export const transferByAccountNumber = async ({
  senderUid,
  receiverAccountNumber,
  amount,
  note,
}) => {
  if (amount <= 0) throw new Error("Invalid amount");

  // 1️⃣ Sender
  const senderRef = doc(db, "accounts", senderUid);
  const senderSnap = await getDoc(senderRef);
  if (!senderSnap.exists()) throw new Error("Sender not found");

  const senderAccounts = senderSnap.data().accounts;
  const senderMain = senderAccounts.find(a => a.type === "checking");

  if (!senderMain || senderMain.balance < amount)
    throw new Error("Insufficient balance");

  // 2️⃣ Receiver
  const receiverUser = await findUserByAccountNumber(receiverAccountNumber);
  if (!receiverUser) throw new Error("Receiver not found");

  const receiverRef = doc(db, "accounts", receiverUser.uid);
  const receiverSnap = await getDoc(receiverRef);
  if (!receiverSnap.exists()) throw new Error("Receiver account missing");

  const receiverAccounts = receiverSnap.data().accounts;

  // 3️⃣ Update balances (IMMUTABLE)
  const updatedSenderAccounts = senderAccounts.map(acc =>
    acc.type === "checking"
      ? { ...acc, balance: acc.balance - amount }
      : acc
  );

  const updatedReceiverAccounts = receiverAccounts.map(acc =>
    acc.type === "checking"
      ? { ...acc, balance: acc.balance + amount }
      : acc
  );

  // 4️⃣ Save
  await updateDoc(senderRef, { accounts: updatedSenderAccounts });
  await updateDoc(receiverRef, { accounts: updatedReceiverAccounts });

  // 5️⃣ Transactions
  const tx = {
    type: "external_transfer",
    amount,
    note,
    date: new Date().toISOString(),
  };

  await addDoc(collection(db, "transactions", senderUid, "items"), {
    ...tx,
    direction: "debit",
    to: receiverAccountNumber,
  });

  await addDoc(collection(db, "transactions", receiverUser.uid, "items"), {
    ...tx,
    direction: "credit",
    from: senderUid,
  });
};
