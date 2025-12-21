import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase"; // ✅ this works now

function Dashboard() {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const transactionsRef = ref(db, "transactions");
    onValue(transactionsRef, (snapshot) => {
      const data = snapshot.val();
      console.log("Fetched data:", data); // 👀 check what comes back
      if (data) {
        const list = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setTransactions(list);
      }
    });
  }, []);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
      <ul>
        {transactions.map((t) => (
          <li key={t.id}>
            {t.description} — ${t.amount}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;