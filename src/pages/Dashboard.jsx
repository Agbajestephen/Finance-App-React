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

// Register chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

// ✅ Define chart data
const weeklyActivityData = {
  labels: ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"],
  datasets: [
    {
      label: "Deposits",
      data: [500, 700, 400, 800, 600, 900, 750],
      backgroundColor: "rgba(54, 162, 235, 0.6)",
    },
    {
      label: "Withdrawals",
      data: [300, 400, 200, 500, 300, 600, 450],
      backgroundColor: "rgba(255, 99, 132, 0.6)",
    },
  ],
};

const expenseData = {
  labels: ["Entertainment", "Bill Expense", "Others", "Investment"],
  datasets: [
    {
      data: [30, 15, 35, 20],
      backgroundColor: [
        "rgba(255, 99, 132, 0.6)",
        "rgba(54, 162, 235, 0.6)",
        "rgba(255, 206, 86, 0.6)",
        "rgba(75, 192, 192, 0.6)",
      ],
    },
  ],
};

const balanceHistoryData = {
  labels: ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan"],
  datasets: [
    {
      label: "Balance",
      data: [4000, 4500, 4800, 5000, 5300, 5600, 5756],
      borderColor: "rgba(75, 192, 192, 1)",
      backgroundColor: "rgba(75, 192, 192, 0.2)",
      fill: true,
    },
  ],
};

function Dashboard() {
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
