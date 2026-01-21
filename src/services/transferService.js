import { doc, getDoc, runTransaction } from "firebase/firestore";
import { db } from "../firebase";
import { findUserByAccountNumber } from "./findUserByAccount";
import { performFraudCheck } from "./fraudDetection";
import { addFraudLog } from "./adminService";

const getUserRole = async (userId) => {
  try {
    const userRef = doc(db, "users", userId);
    const userSnap = await getDoc(userRef);
    if (userSnap.exists()) {
      return userSnap.data().role || "user";
    }
    return "user";
  } catch (error) {
    console.error("Error getting user role:", error);
    return "user";
  }
};

export const transferByAccountNumber = async ({
  senderUid,
  receiverAccountNumber,
  amount,
  note,
}) => {
  const transferAmount = parseFloat(amount);
  if (isNaN(transferAmount) || transferAmount <= 0) {
    throw new Error("Invalid amount");
  }

  try {
    console.log("Searching for account:", receiverAccountNumber);
    const receiverUser = await findUserByAccountNumber(receiverAccountNumber);
    console.log("Found receiver:", receiverUser);

    if (!receiverUser || !receiverUser.uid) {
      throw new Error("Account not found");
    }

    if (receiverUser.uid === senderUid) {
      throw new Error("Cannot transfer to yourself");
    }

    // Check user role for fraud detection (only apply to regular users)
    const senderRole = await getUserRole(senderUid);
    let isFraudulent = false;

    if (senderRole === "user") {
      // Get sender transactions for fraud check
      const senderTxRef = doc(db, "users", senderUid, "transactions", "data");
      const senderTxSnap = await getDoc(senderTxRef);
      const senderTransactions = senderTxSnap.exists()
        ? senderTxSnap.data().transactions || []
        : [];

      // Perform fraud check
      isFraudulent = await performFraudCheck(
        senderUid,
        {
          amount: transferAmount,
          type: "transfer",
          to: receiverAccountNumber,
        },
        senderTransactions,
      );

      if (isFraudulent) {
        // Log fraud but don't block the transaction for now
        await addFraudLog({
          userId: senderUid,
          type: "fraud_detected",
          amount: transferAmount,
          status: "flagged",
          details: `Suspicious transfer of ₦${transferAmount} to ${receiverAccountNumber}`,
        });
      }
    }

    await runTransaction(db, async (transaction) => {
      console.log("🔄 Transaction started");

      // ✅ PHASE 1: ALL READS FIRST
      const senderAccountsRef = doc(db, "users", senderUid, "accounts", "data");
      const senderAccountsSnap = await transaction.get(senderAccountsRef);
      console.log("📖 Read sender accounts");

      const receiverAccountsRef = doc(
        db,
        "users",
        receiverUser.uid,
        "accounts",
        "data",
      );
      const receiverAccountsSnap = await transaction.get(receiverAccountsRef);
      console.log("📖 Read receiver accounts");

      const senderTxRef = doc(db, "users", senderUid, "transactions", "data");
      const senderTxSnap = await transaction.get(senderTxRef);
      console.log("📖 Read sender transactions");

      const receiverTxRef = doc(
        db,
        "users",
        receiverUser.uid,
        "transactions",
        "data",
      );
      const receiverTxSnap = await transaction.get(receiverTxRef);
      console.log("📖 Read receiver transactions");

      // ✅ PHASE 2: VALIDATE
      if (!senderAccountsSnap.exists()) {
        throw new Error("Sender account not found");
      }

      const senderAccounts = senderAccountsSnap.data().accounts || [];
      const senderMain = senderAccounts.find((a) => a.type === "checking");

      console.log("💰 Sender balance before:", senderMain?.balance);

      if (!senderMain) {
        throw new Error("No checking account found");
      }

      if (senderMain.balance < transferAmount) {
        throw new Error("Insufficient balance");
      }

      if (!receiverAccountsSnap.exists()) {
        throw new Error("Receiver account not found");
      }

      const receiverAccounts = receiverAccountsSnap.data().accounts || [];
      const receiverMain = receiverAccounts.find((a) => a.type === "checking");

      console.log("💰 Receiver balance before:", receiverMain?.balance);

      if (!receiverMain) {
        throw new Error("Receiver has no checking account");
      }

      const senderTransactions = senderTxSnap.exists()
        ? senderTxSnap.data().transactions || []
        : [];
      const receiverTransactions = receiverTxSnap.exists()
        ? receiverTxSnap.data().transactions || []
        : [];

      // ✅ PHASE 3: PREPARE UPDATES
      const updatedSenderAccounts = senderAccounts.map((acc) =>
        acc.type === "checking"
          ? { ...acc, balance: acc.balance - transferAmount }
          : acc,
      );

      const updatedReceiverAccounts = receiverAccounts.map((acc) =>
        acc.type === "checking"
          ? { ...acc, balance: acc.balance + transferAmount }
          : acc,
      );

      console.log(
        "💰 Sender balance after:",
        updatedSenderAccounts.find((a) => a.type === "checking")?.balance,
      );
      console.log(
        "💰 Receiver balance after:",
        updatedReceiverAccounts.find((a) => a.type === "checking")?.balance,
      );

      const timestamp = new Date().toISOString();

      const senderTransaction = {
        id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: "withdrawal",
        amount: transferAmount,
        description: note || "Transfer sent",
        to: receiverAccountNumber,
        toName: receiverUser.displayName || receiverUser.email || "Unknown",
        date: timestamp,
        status: "completed",
      };

      const receiverTransaction = {
        id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type: "deposit",
        amount: transferAmount,
        description: note || "Transfer received",
        from: senderMain.accountNumber || senderUid,
        fromName: "External Transfer",
        date: timestamp,
        status: "completed",
      };

      // ✅ PHASE 4: ALL WRITES AT THE END
      console.log("✍️ Writing sender accounts update");
      transaction.update(senderAccountsRef, {
        accounts: updatedSenderAccounts,
      });

      console.log("✍️ Writing receiver accounts update");
      transaction.update(receiverAccountsRef, {
        accounts: updatedReceiverAccounts,
      });

      console.log("✍️ Writing sender transactions");
      transaction.set(senderTxRef, {
        transactions: [...senderTransactions, senderTransaction],
      });

      console.log("✍️ Writing receiver transactions");
      transaction.set(receiverTxRef, {
        transactions: [...receiverTransactions, receiverTransaction],
      });

      console.log("✅ All writes queued");
    });

    console.log("🎉 Transaction committed successfully");
    return { success: true, message: "Transfer successful" };
  } catch (error) {
    console.error("Transfer error:", error);
    throw new Error(error.message || "Transfer failed. Please try again.");
  }
};
