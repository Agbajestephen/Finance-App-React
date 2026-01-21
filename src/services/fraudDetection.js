import { db } from "../firebase";
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

// Fraud detection thresholds
const FRAUD_THRESHOLDS = {
  DAILY_TRANSACTION_LIMIT: 500000, // ₦500,000 per day
  SINGLE_TRANSACTION_LIMIT: 100000, // ₦100,000 per transaction
  HOURLY_TRANSACTION_LIMIT: 200000, // ₦200,000 per hour
  SUSPICIOUS_AMOUNT_MULTIPLIER: 5, // 5x average transaction amount
};

// Perform fraud check for a transaction
export const performFraudCheck = async (
  userId,
  transactionData,
  userTransactions = [],
) => {
  try {
    const { amount } = transactionData;

    // Check single transaction limit
    if (amount > FRAUD_THRESHOLDS.SINGLE_TRANSACTION_LIMIT) {
      await logFraudAlert(userId, "HIGH_AMOUNT", {
        amount,
        limit: FRAUD_THRESHOLDS.SINGLE_TRANSACTION_LIMIT,
        transactionData,
      });
      return true; // Suspicious
    }

    // Check daily transaction limit
    const dailyTotal = await getDailyTransactionTotal(userId);
    if (dailyTotal + amount > FRAUD_THRESHOLDS.DAILY_TRANSACTION_LIMIT) {
      await logFraudAlert(userId, "DAILY_LIMIT_EXCEEDED", {
        dailyTotal,
        amount,
        limit: FRAUD_THRESHOLDS.DAILY_TRANSACTION_LIMIT,
        transactionData,
      });
      return true; // Suspicious
    }

    // Check hourly transaction limit
    const hourlyTotal = await getHourlyTransactionTotal(userId);
    if (hourlyTotal + amount > FRAUD_THRESHOLDS.HOURLY_TRANSACTION_LIMIT) {
      await logFraudAlert(userId, "HOURLY_LIMIT_EXCEEDED", {
        hourlyTotal,
        amount,
        limit: FRAUD_THRESHOLDS.HOURLY_TRANSACTION_LIMIT,
        transactionData,
      });
      return true; // Suspicious
    }

    // Check for unusual amount patterns
    const averageAmount = getAverageTransactionAmount(userTransactions);
    if (
      amount > averageAmount * FRAUD_THRESHOLDS.SUSPICIOUS_AMOUNT_MULTIPLIER &&
      averageAmount > 0
    ) {
      await logFraudAlert(userId, "UNUSUAL_AMOUNT", {
        amount,
        averageAmount,
        multiplier: FRAUD_THRESHOLDS.SUSPICIOUS_AMOUNT_MULTIPLIER,
        transactionData,
      });
      return true; // Suspicious
    }

    // Check for rapid successive transactions
    const recentTransactions = getRecentTransactions(userTransactions, 5); // Last 5 transactions
    if (recentTransactions.length >= 3) {
      const timeDiffs = [];
      for (let i = 1; i < recentTransactions.length; i++) {
        const diff =
          new Date(recentTransactions[i].date) -
          new Date(recentTransactions[i - 1].date);
        timeDiffs.push(diff);
      }

      const avgTimeDiff =
        timeDiffs.reduce((sum, diff) => sum + diff, 0) / timeDiffs.length;
      if (avgTimeDiff < 60000) {
        // Less than 1 minute between transactions
        await logFraudAlert(userId, "RAPID_TRANSACTIONS", {
          avgTimeDiff,
          transactionCount: recentTransactions.length,
          transactionData,
        });
        return true; // Suspicious
      }
    }

    return false; // Not suspicious
  } catch (error) {
    console.error("Fraud check error:", error);
    // In case of error, err on the side of caution
    await logFraudAlert(userId, "CHECK_ERROR", {
      error: error.message,
      transactionData,
    });
    return true;
  }
};

// Get daily transaction total for user
const getDailyTransactionTotal = async (userId) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const transactionsRef = collection(db, "transactions");
    const q = query(
      transactionsRef,
      where("userId", "==", userId),
      where("date", ">=", today),
      where("date", "<", tomorrow),
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.reduce(
      (total, doc) => total + (doc.data().amount || 0),
      0,
    );
  } catch (error) {
    console.error("Error getting daily total:", error);
    return 0;
  }
};

// Get hourly transaction total for user
const getHourlyTransactionTotal = async (userId) => {
  try {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    const transactionsRef = collection(db, "transactions");
    const q = query(
      transactionsRef,
      where("userId", "==", userId),
      where("date", ">=", oneHourAgo),
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.reduce(
      (total, doc) => total + (doc.data().amount || 0),
      0,
    );
  } catch (error) {
    console.error("Error getting hourly total:", error);
    return 0;
  }
};

// Get average transaction amount
const getAverageTransactionAmount = (transactions) => {
  if (transactions.length === 0) return 0;
  const total = transactions.reduce((sum, txn) => sum + (txn.amount || 0), 0);
  return total / transactions.length;
};

// Get recent transactions
const getRecentTransactions = (transactions, count) => {
  return transactions
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, count);
};

// Log fraud alert
const logFraudAlert = async (userId, alertType, details) => {
  try {
    await addDoc(collection(db, "fraudLogs"), {
      userId,
      type: alertType,
      amount: details.amount || 0,
      status: "flagged",
      details: JSON.stringify(details),
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Error logging fraud alert:", error);
  }
};

// Check if user has pending fraud alerts
export const hasPendingFraudAlerts = async (userId) => {
  try {
    const alertsRef = collection(db, "fraudAlerts");
    const q = query(
      alertsRef,
      where("userId", "==", userId),
      where("status", "==", "pending"),
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.length > 0;
  } catch (error) {
    console.error("Error checking fraud alerts:", error);
    return false;
  }
};

// Resolve fraud alert
export const resolveFraudAlert = async (alertId, resolution) => {
  try {
    const alertRef = doc(db, "fraudAlerts", alertId);
    await updateDoc(alertRef, {
      status: resolution,
      resolvedAt: new Date(),
    });
  } catch (error) {
    console.error("Error resolving fraud alert:", error);
    throw error;
  }
};
