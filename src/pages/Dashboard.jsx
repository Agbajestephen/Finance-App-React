import React, { useState } from 'react';
import { FaArrowUp, FaArrowDown, FaPlus, FaEye, FaFilter } from 'react-icons/fa';
import { Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const [timeFilter, setTimeFilter] = useState('month');

  // Stats Cards Data
  const stats = [
    {
      title: 'Total Balance',
      value: '$12,750',
      change: '+25%',
      trend: 'up',
      icon: <FaEye className="text-primary" />,
      color: 'from-primary to-primary/70',
      detail: 'From last month'
    },
    {
      title: 'Total Income',
      value: '$5,600',
      change: '+12.5%',
      trend: 'up',
      icon: <FaArrowUp className="text-success" />,
      color: 'from-success to-success/70',
      detail: 'From last month'
    },
    {
      title: 'Total Expense',
      value: '$3,460',
      change: '+3.3%',
      trend: 'up',
      icon: <FaArrowDown className="text-error" />,
      color: 'from-error to-error/70',
      detail: 'From last month'
    },
    {
      title: 'Total Savings',
      value: '$7,920',
      change: '+4.2%',
      trend: 'up',
      icon: <FaPlus className="text-warning" />,
      color: 'from-warning to-warning/70',
      detail: 'From last month'
    }
  ];

  // Account Types Data
  const accountTypes = [
    {
      type: 'Checking',
      amount: '$8,450.00',
      count: 3,
      color: 'bg-primary',
      icon: '🏦'
    },
    {
      type: 'Saving',
      amount: '$15,280.50',
      count: 2,
      color: 'bg-secondary',
      icon: '💰'
    },
    {
      type: 'Investment',
      amount: '$32,450.00',
      count: 1,
      color: 'bg-accent',
      icon: '📈'
    },
    {
      type: 'Credit',
      amount: '$4,250.00',
      count: 2,
      color: 'bg-warning',
      icon: '💳'
    }
  ];

  // Recent Transactions
  const transactions = [
    {
      id: 1,
      name: 'Spotify Subscription',
      type: 'Entertainment',
      date: '23 Jan 2021',
      amount: '-$150',
      account: 'Primary Checking',
      status: 'completed'
    },
    {
      id: 2,
      name: 'Salary Deposit',
      type: 'Income',
      date: '20 Jan 2021',
      amount: '+$2,500',
      account: 'Main Savings',
      status: 'completed'
    },
    {
      id: 3,
      name: 'Grocery Shopping',
      type: 'Food',
      date: '18 Jan 2021',
      amount: '-$85.50',
      account: 'Everyday Checking',
      status: 'completed'
    },
    {
      id: 4,
      name: 'Amazon Purchase',
      type: 'Shopping',
      date: '15 Jan 2021',
      amount: '-$245.99',
      account: 'Credit Card',
      status: 'pending'
    }
  ];

  // Chart Data - Weekly Activity
  const weeklyData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Spending',
        data: [350, 300, 450, 500, 150, 100, 200],
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  // Expense Distribution
  const expenseData = {
    labels: ['Entertainment', 'Food', 'Shopping', 'Bills', 'Others'],
    datasets: [
      {
        data: [15, 25, 20, 30, 10],
        backgroundColor: [
          'rgb(59, 130, 246)',  // blue
          'rgb(34, 197, 94)',   // green
          'rgb(168, 85, 247)',  // purple
          'rgb(245, 158, 11)',  // yellow
          'rgb(107, 114, 128)'  // gray
        ],
        borderWidth: 0
      }
    ]
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold">Account Overview</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage all your financial accounts in one place</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-outline gap-2">
              <FaFilter /> Filter
            </label>
            <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
              <li><button onClick={() => setTimeFilter('week')}>This Week</button></li>
              <li><button onClick={() => setTimeFilter('month')}>This Month</button></li>
              <li><button onClick={() => setTimeFilter('quarter')}>This Quarter</button></li>
              <li><button onClick={() => setTimeFilter('year')}>This Year</button></li>
            </ul>
          </div>
          
          <button className="btn btn-primary gap-2">
            <FaPlus /> Add Account
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="card bg-base-100 shadow-lg hover:shadow-xl transition-shadow">
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{stat.title}</p>
                  <h3 className="text-2xl font-bold mt-2">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-full bg-gradient-to-r ${stat.color} bg-opacity-20`}>
                  {stat.icon}
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <span className={`badge ${stat.trend === 'up' ? 'badge-success' : 'badge-error'}`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{stat.detail}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Account Types */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Activity Chart */}
        <div className="lg:col-span-2">
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <div className="flex justify-between items-center mb-4">
                <h3 className="card-title">Weekly Activity</h3>
                <span className="text-sm text-primary font-semibold">View Details →</span>
              </div>
              <div className="h-64">
                <Line 
                  data={weeklyData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false }
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          callback: value => '$' + value
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Account Types Overview */}
        <div>
          <div className="card bg-base-100 shadow-lg">
            <div className="card-body">
              <h3 className="card-title mb-4">Account Types Overview</h3>
              <div className="space-y-4">
                {accountTypes.map((account, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg hover:bg-base-200 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg ${account.color} flex items-center justify-center`}>
                        <span className="text-lg">{account.icon}</span>
                      </div>
                      <div>
                        <p className="font-semibold">{account.type}</p>
                        <p className="text-sm text-gray-500">{account.count} Accounts</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{account.amount}</p>
                    </div>
                  </div>
                ))}
                
                <div className="divider my-2"></div>
                
                <div className="flex justify-between items-center p-3 bg-base-200 rounded-lg">
                  <div>
                    <p className="font-semibold">Total Accounts</p>
                    <p className="text-sm text-gray-500">Combined Balance</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">SALE 1THU</p>
                    <p className="text-xl font-bold">17.92</p>
                  </div>
                </div>
                <div className="mt-6">
                  <p className="text-lg font-semibold">3779 **** **** 1234</p>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-white/80">VALID THRU 07/24</p>
                    <div className="flex space-x-2">
                      <div className="w-8 h-5 bg-white/30 rounded"></div>
                      <div className="w-8 h-5 bg-white/30 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

      {/* Recent Transactions & Expense Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <div className="card bg-base-100 shadow-lg">
          <div className="card-body">
            <div className="flex justify-between items-center mb-4">
              <h3 className="card-title">Recent Transactions</h3>
              <button className="btn btn-ghost btn-sm">See All →</button>
            </div>
            
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-base-200 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      transaction.amount.startsWith('+') 
                        ? 'bg-success/20 text-success' 
                        : 'bg-error/20 text-error'
                    }`}>
                      {transaction.amount.startsWith('+') ? '+' : '-'}
                    </div>
                    <span className="font-bold text-green-600">$2,500</span>
                  </div>
                  
                  {/* Transaction 3 */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center mr-3">
                        <i className="fas fa-user-friends text-red-500"></i>
                      </div>
                      <div>
                        <p className="font-medium">Jenni Wilson</p>
                        <p className="text-gray-500 text-sm">21 January 2021</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${
                      transaction.amount.startsWith('+') 
                        ? 'text-success' 
                        : 'text-error'
                    }`}>
                      {transaction.amount}
                    </p>
                    <span className={`badge badge-sm ${
                      transaction.status === 'completed' 
                        ? 'badge-success' 
                        : 'badge-warning'
                    }`}>
                      {transaction.status}
                    </span>
                    <span className="font-medium">50%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Balance History Chart */}
        <div className="card bg-base-100 shadow-xl mb-6">
          <div className="card-body">
            <h2 className="card-title text-xl font-bold mb-4">Balance History</h2>
            <div className="h-64">
              <Bar data={balanceHistoryData} options={balanceHistoryOptions} />
            </div>
            <div className="flex justify-between mt-4 text-sm">
              <span>Jul</span>
              <span>Aug</span>
              <span>Sep</span>
              <span>Oct</span>
              <span>Nov</span>
              <span>Dec</span>
              <span>Jan</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;