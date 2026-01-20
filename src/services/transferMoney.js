import { loadTransactions, saveTransactions } from "./bankingService";

// ────────────────────────────────────────────────────────────────
// After successful runTransaction block, add this:
const newTransaction = {
  id: crypto.randomUUID?.() || Date.now().toString() + Math.random(),
  type: "transfer",
  amount,
  direction: "sent",                  // or "received" for receiver side
  fromUid: senderUid,
  toUid: recipient.uid,
  fromAccount: senderSnap.data().accountNumber,
  toAccount: recipient.accountNumber,
  note: "", // you can add later
  status: "success",
  createdAt: new Date().toISOString(), // or serverTimestamp() if preferred
};

try {
  // Sender's history
  const senderTxs = await loadTransactions(senderUid);
  await saveTransactions(senderUid, [...senderTxs, { ...newTransaction, direction: "sent" }]);

  // Optional: Receiver's history (recommended for full UX)
  const receiverTxs = await loadTransactions(recipient.uid);
  await saveTransactions(recipient.uid, [...receiverTxs, { ...newTransaction, direction: "received" }]);

  console.log("Transaction history saved for both users");
} catch (err) {
  console.error("Failed to record transaction:", err);
  // You might want to rollback balance here in production
}


