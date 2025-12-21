import React from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

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
