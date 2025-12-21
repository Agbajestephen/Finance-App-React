import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

function Dashboard() {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const fetchCards = async () => {
      const querySnapshot = await getDocs(collection(db, "cards"));
      const cardData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setCards(cardData);
    };

    fetchCards();
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