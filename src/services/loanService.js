import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
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
    await updateDoc(loanRef, {
      status: "approved",
      approvedDate: new Date(),
      approvedBy: adminId,
    });
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
