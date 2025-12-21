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
      <h2 className="text-2xl font-bold mb-4">My Cards</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map(card => (
          <div key={card.id} className="card bg-base-100 shadow">
            <div className="card-body">
              <h3 className="card-title text-primary">${card.balance}</h3>
              <p>Card Holder: {card.holder}</p>
              <p>Valid Thru: {card.validThru}</p>
              <p>Card Number: {card.number}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Dashboard;