import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  getDoc,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";

// Submit a new loan application
export const submitLoanApplication = async (loanData) => {
  try {
    const docRef = await addDoc(collection(db, "loans"), {
      ...loanData,
      status: "pending",
      appliedDate: new Date(),
    });
    return docRef.id;
  } catch (error) {
    console.error("Error submitting loan application:", error);
    throw error;
  }
};

// Get all loan applications (for admin)
export const getAllLoanApplications = async () => {
  try {
    const q = query(collection(db, "loans"), orderBy("appliedDate", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching loan applications:", error);
    throw error;
  }
};

// Get loan applications for a specific user
export const getUserLoanApplications = async (userId) => {
  try {
    const q = query(
      collection(db, "loans"),
      where("userId", "==", userId),
      orderBy("appliedDate", "desc"),
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching user loan applications:", error);
    throw error;
  }
};

// Approve a loan application
export const approveLoanApplication = async (loanId, adminId) => {
  try {
    const loanRef = doc(db, "loans", loanId);
    const loanSnap = await getDoc(loanRef);

    if (!loanSnap.exists()) {
      throw new Error("Loan application not found");
    }

    const loanData = loanSnap.data();

    // Update loan status
    await updateDoc(loanRef, {
      status: "approved",
      approvedDate: new Date(),
      approvedBy: adminId,
    });

    // Credit the loan amount to user's account
    const { loadAccounts, saveAccounts, loadTransactions, saveTransactions } =
      await import("./bankingService");

    const userAccounts = await loadAccounts(loanData.userId);
    const userTransactions = await loadTransactions(loanData.userId);

    // Find the account to credit
    const accountToCredit = userAccounts.find(
      (acc) => acc.id === loanData.accountId,
    );
    if (!accountToCredit) {
      throw new Error("User account not found");
    }

    // Update account balance
    const updatedAccounts = userAccounts.map((acc) =>
      acc.id === loanData.accountId
        ? { ...acc, balance: acc.balance + loanData.amount }
        : acc,
    );

    // Log the transaction
    const loanTransaction = {
      id: crypto.randomUUID(),
      type: "loan_credit",
      amount: loanData.amount,
      description: `Loan approved: ${loanData.loanType}`,
      accountId: loanData.accountId,
      date: new Date().toISOString(),
      status: "completed",
    };

    const updatedTransactions = [loanTransaction, ...userTransactions];

    // Save updated accounts and transactions
    await saveAccounts(loanData.userId, updatedAccounts);
    await saveTransactions(loanData.userId, updatedTransactions);

    return true;
  } catch (error) {
    console.error("Error approving loan:", error);
    throw error;
  }
};

// Reject a loan application
export const rejectLoanApplication = async (loanId, adminId, reason = "") => {
  try {
    const loanRef = doc(db, "loans", loanId);
    await updateDoc(loanRef, {
      status: "rejected",
      rejectedDate: new Date(),
      rejectedBy: adminId,
      rejectionReason: reason,
    });
    return true;
  } catch (error) {
    console.error("Error rejecting loan:", error);
    throw error;
  }
};

// Listen to loan applications (real-time updates)
export const subscribeToLoanApplications = (callback) => {
  const q = query(collection(db, "loans"), orderBy("appliedDate", "desc"));
  return onSnapshot(q, (querySnapshot) => {
    const loans = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(loans);
  });
};

// Listen to user's loan applications (real-time updates)
export const subscribeToUserLoans = (userId, callback) => {
  const q = query(
    collection(db, "loans"),
    where("userId", "==", userId),
    orderBy("appliedDate", "desc"),
  );
  return onSnapshot(q, (querySnapshot) => {
    const loans = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(loans);
  });
};
