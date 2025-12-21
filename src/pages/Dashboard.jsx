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
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
      {/* My Cards */}
      <div className="lg:col-span-1 space-y-4">
        <div className="card bg-primary text-white p-4 shadow-md">
          <div className="text-lg font-semibold">Balance: $5,756</div>
          <div className="text-sm">Card Holder: Eddy Cusuma</div>
          <div className="text-sm">Valid Thru: 12/22</div>
          <div className="text-sm">Card Number: 3778 **** **** 1234</div>
        </div>
        <div className="card bg-primary text-white p-4 shadow-md">
          <div className="text-lg font-semibold">Balance: $5,756</div>
          <div className="text-sm">Card Holder: Eddy Cusuma</div>
          <div className="text-sm">Valid Thru: 12/22</div>
          <div className="text-sm">Card Number: 3778 **** **** 1234</div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="lg:col-span-2 card bg-base-100 p-4 shadow-md">
        <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
        <ul className="space-y-3">
          <li className="flex justify-between">
            <span>Deposit from my Card</span>
            <span className="text-red-500">- $850</span>
          </li>
          <li className="flex justify-between">
            <span>Deposit Paypal</span>
            <span className="text-green-500">+ $2,500</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
