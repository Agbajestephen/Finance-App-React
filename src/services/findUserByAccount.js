import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Find user by primary account number
 * Used before external transfers
 */
export const findUserByAccountNumber = async (accountNumber) => {
  if (!accountNumber) return null;

  try {
    // Clean and normalize the input
    const searchNumber = accountNumber.trim().toUpperCase();
    
    console.log("🔍 Searching for:", searchNumber);
    
    // Get ALL users (more reliable than query with "where")
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);
    
    if (snapshot.empty) {
      console.log("❌ No users in database");
      return null;
    }
    
    // Log all account numbers for debugging
    console.log("📋 All users in database:");
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      console.log(`  - "${data.accountNumber}" (${data.email})`);
    });
    
    // Find matching user
    let foundUser = null;
    
    for (const doc of snapshot.docs) {
      const userData = doc.data();
      const dbAccountNumber = userData.accountNumber?.trim().toUpperCase();
      
      console.log(`Comparing: "${searchNumber}" === "${dbAccountNumber}"`);
      
      if (dbAccountNumber === searchNumber) {
        foundUser = {
          uid: doc.id,
          name: userData.fullName || userData.displayName || userData.name || "User",
          email: userData.email,
          accountNumber: userData.accountNumber,
          displayName: userData.displayName || userData.fullName
        };
        console.log("✅ Found match!", foundUser);
        break;
      }
    }
    
    if (!foundUser) {
      console.log("❌ No matching account number found");
    }
    
    return foundUser;
    
  } catch (error) {
    console.error("❌ Error finding user:", error);
    return null;
  }
};