import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

const addBalanceToAccounts = async () => {
  try {
    const accountsSnapshot = await getDocs(collection(db, "accounts"));
    
    console.log(`Found ${accountsSnapshot.docs.length} accounts`);
    
    for (const accountDoc of accountsSnapshot.docs) {
      const accountData = accountDoc.data();
      
      // Only add balance if it doesn't exist
      if (accountData.balance === undefined) {
        await updateDoc(doc(db, "accounts", accountDoc.id), {
          balance: 0, // Starting balance
        });
        console.log(`✅ Added balance to account: ${accountData.accountNumber}`);
      }
    }
    
    console.log("🎉 All accounts updated!");
  } catch (error) {
    console.error("❌ Error:", error);
  }
};

// Run this once
addBalanceToAccounts();