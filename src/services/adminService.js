import { db, auth } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  query,
  orderBy,
  where,
  serverTimestamp,
  doc,
  setDoc,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

// =======================
// USER ACTIVITY LOGGING
// =======================

export async function logUserActivity(userId, action, email = null) {
  try {
    console.log("Logging user activity:", { userId, action, email });
    await addDoc(collection(db, "userLogs"), {
      userId,
      action, // "login", "logout", or "failed_login"
      email: email || null, // For failed logins, store the email attempted
      timestamp: serverTimestamp(),
    });
    console.log("User activity logged successfully");
  } catch (error) {
    console.error("Error logging user activity:", error);
  }
}

// =======================
// GET ALL USER TRANSACTIONS
// =======================

export async function getAllUserTransactions() {
  try {
    // First, get all users
    const usersRef = collection(db, "users");
    const usersSnapshot = await getDocs(usersRef);

    const allTransactions = [];

    // For each user, fetch their transactions subcollection
    for (const userDoc of usersSnapshot.docs) {
      const userId = userDoc.id;
      const transactionsRef = doc(db, "users", userId, "transactions", "data");
      const transactionsSnap = await getDoc(transactionsRef);

      if (transactionsSnap.exists()) {
        const userTransactions = transactionsSnap.data().transactions || [];
        // Add userId to each transaction for admin dashboard display
        const transactionsWithUserId = userTransactions.map((txn) => ({
          ...txn,
          userId: userId,
        }));
        allTransactions.push(...transactionsWithUserId);
      }
    }

    // Sort all transactions by date descending
    allTransactions.sort((a, b) => new Date(b.date) - new Date(a.date));

    return allTransactions;
  } catch (error) {
    console.error("Error getting all transactions:", error);
    return [];
  }
}

// =======================
// FRAUD DETECTION LOGS
// =======================

export async function getFraudLogs() {
  try {
    console.log("Fetching fraud logs...");
    const fraudRef = collection(db, "fraudLogs");
    const q = query(fraudRef, orderBy("timestamp", "desc"));
    const querySnapshot = await getDocs(q);

    const fraudLogs = [];
    querySnapshot.forEach((doc) => {
      fraudLogs.push({ id: doc.id, ...doc.data() });
    });

    console.log("Fetched fraud logs:", fraudLogs);
    return fraudLogs;
  } catch (error) {
    console.error("Error getting fraud logs:", error);
    return [];
  }
}

export async function addFraudLog(logData) {
  try {
    await addDoc(collection(db, "fraudLogs"), {
      ...logData,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error adding fraud log:", error);
  }
}

// =======================
// GET ALL USERS
// =======================

export async function getAllUsers() {
  try {
    const usersRef = collection(db, "users");
    const querySnapshot = await getDocs(usersRef);

    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });

    return users;
  } catch (error) {
    console.error("Error getting all users:", error);
    return [];
  }
}

// =======================
// GET USER LOGIN LOGS
// =======================

export async function getUserLoginLogs(userId = null) {
  try {
    // Ensure user is authenticated
    if (!auth.currentUser) {
      throw new Error("User not authenticated");
    }
    const logsRef = collection(db, "userLogs");
    let q;

    if (userId) {
      q = query(
        logsRef,
        where("userId", "==", userId),
        orderBy("timestamp", "desc"),
      );
    } else {
      q = query(logsRef, orderBy("timestamp", "desc"));
    }

    const querySnapshot = await getDocs(q);

    const logs = [];
    querySnapshot.forEach((doc) => {
      logs.push({ id: doc.id, ...doc.data() });
    });

    return logs;
  } catch (error) {
    console.error("Error getting user login logs:", error);
    return [];
  }
}

// =======================
// CHECK FAILED LOGIN FRAUD
// =======================

export async function checkFailedLoginFraud(email) {
  try {
    const logsRef = collection(db, "userLogs");

    const q = query(
      logsRef,
      where("action", "==", "failed_login"),
      where("email", "==", email),
      orderBy("timestamp", "desc"),
    );

    const querySnapshot = await getDocs(q);
    const failedLogins = querySnapshot.docs.map((doc) => doc.data());

    // Filter for last hour
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    const recentFailedLogins = failedLogins.filter((log) => {
      if (log.timestamp && log.timestamp.seconds) {
        return log.timestamp.seconds * 1000 >= oneHourAgo;
      }
      return false;
    });

    if (recentFailedLogins.length >= 3) {
      // Flag as potential fraud
      await addFraudLog({
        type: "multiple_failed_logins",
        email,
        count: recentFailedLogins.length,
        status: "flagged",
        details: `Multiple failed login attempts (${recentFailedLogins.length}) for email ${email} within the last hour`,
      });
    }
  } catch (error) {
    console.error("Error checking failed login fraud:", error);
  }
}

// =======================
// CREATE ADMIN USER
// =======================

export async function createAdminUser() {
  try {
    const email = "admin@financeapp.com";
    const password = "Admin123!";

    let user;

    try {
      // Try to create the user
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      user = userCredential.user;
      console.log("Admin user created successfully:", user.email);
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        // User already exists, sign in to get the user
        console.log("Admin user already exists, signing in...");
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password,
        );
        user = userCredential.user;
      } else {
        throw error;
      }
    }

    // Ensure the user document exists with admin role
    const userRef = doc(db, "users", user.uid);
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
      await setDoc(userRef, {
        email: user.email,
        role: "admin",
        createdAt: new Date(),
      });
      console.log("Admin role set for user:", user.email);
    } else {
      console.log("Admin user document already exists.");
    }

    return {
      success: true,
      message: "Admin user created/verified successfully.",
    };
  } catch (error) {
    console.error("Error creating admin user:", error);
    return { success: false, message: error.message };
  }
}
