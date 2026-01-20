import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export const findUserByAccountNumber = async (accountNumber) => {
  if (!accountNumber) return null;

  try {
    const searchNumber = accountNumber.trim().toUpperCase();
    
    console.log("🔍 Searching for:", searchNumber);
    
    const usersRef = collection(db, "users");
    const snapshot = await getDocs(usersRef);
    
    if (snapshot.empty) {
      console.log("❌ No users in database");
      return null;
    }
    
    console.log("📋 All users in database:");
    snapshot.docs.forEach(doc => {
      const data = doc.data();
      console.log(`  - "${data.accountNumber}" (${data.email})`);
    });
    
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