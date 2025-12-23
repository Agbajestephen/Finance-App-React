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
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  // Weekly Activity Data
  const weeklyActivityData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        label: 'Activity',
        data: [0, 100, 90, 200, 110, 50, 0],
        borderColor: 'rgb(102, 126, 234)',
        backgroundColor: 'rgba(102, 126, 234, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointBackgroundColor: 'rgb(102, 126, 234)',
        pointRadius: 5
      }
    ]
  };

  const weeklyActivityOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 250,
        ticks: {
          callback: function(value) {
            return '$' + value;
          }
        }
      }
    }
  };

  // Expense Statistics Data
  const expenseData = {
    labels: ['Entertainment', 'Investment', 'Others'],
    datasets: [
      {
        data: [15, 35, 50],
        backgroundColor: [
          'rgb(59, 130, 246)', // blue
          'rgb(34, 197, 94)', // green
          'rgb(168, 85, 247)' // purple
        ],
        borderWidth: 0,
        hoverOffset: 10
      }
    ]
  };

  const expenseOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    cutout: '70%'
  };

  // Balance History Data
  const balanceHistoryData = {
    labels: ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'],
    datasets: [
      {
        label: 'Balance',
        data: [65000, 59000, 72000, 81000, 86000, 92500, 100000],
        backgroundColor: 'rgba(102, 126, 234, 0.7)',
        borderColor: 'rgb(102, 126, 234)',
        borderWidth: 1,
        borderRadius: 6
      }
    ]
  };

  const balanceHistoryOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          callback: function(value) {
            return '$' + (value/1000).toFixed(0) + 'k';
          }
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Cards</h1>
          <div className="flex items-center space-x-4">
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full bg-primary text-white flex items-center justify-center">
                  <span className="font-semibold">JD</span>
                </div>
              </label>
              <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                <li><a>Profile</a></li>
                <li><a>Settings</a></li>
                <li><a>Logout</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Left Column - Main Card and Activity */}
          <div className="lg:col-span-2 space-y-6">
            {/* Card Display */}
            <div className="card bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-xl">
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="card-title text-3xl font-bold mb-2">$5,796</h2>
                    <p className="text-white/80">CASH USCLIER</p>
                    <p className="text-white/80">Entry Columns</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">SALE 1THU</p>
                    <p className="text-2xl font-bold">57.22</p>
                  </div>
                </div>
                <div className="mt-8">
                  <p className="text-xl font-semibold">3778 **** **** 1234</p>
                  <div className="flex justify-between items-center mt-4">
                    <p className="text-white/80">VALID THRU 08/25</p>
                    <div className="flex space-x-2">
                      <div className="w-10 h-7 bg-white/30 rounded"></div>
                      <div className="w-10 h-7 bg-white/30 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Weekly Activity Chart */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-xl font-bold mb-4">Weekly Activity</h2>
                <div className="h-64">
                  <Line data={weeklyActivityData} options={weeklyActivityOptions} />
                </div>
                <div className="flex justify-between mt-4 text-sm">
                  <span>$0</span>
                  <span>$100</span>
                  <span>$90</span>
                  <span>$200</span>
                  <span>$110</span>
                  <span>$0</span>
                </div>
              </div>
            </div>

            {/* Quick Transfer Section */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-xl font-bold mb-4">Quick Transfer</h2>
                <div className="flex flex-wrap gap-6 mb-6">
                  {/* Contact 1 */}
                  <div className="flex flex-col items-center">
                    <div className="avatar">
                      <div className="w-16 rounded-full bg-primary text-white flex items-center justify-center">
                        <span className="text-xl font-semibold">LB</span>
                      </div>
                    </div>
                    <p className="mt-2 font-medium">Livia Bear</p>
                    <p className="text-gray-500 text-sm">CEO</p>
                  </div>
                  
                  {/* Contact 2 */}
                  <div className="flex flex-col items-center">
                    <div className="avatar">
                      <div className="w-16 rounded-full bg-secondary text-white flex items-center justify-center">
                        <span className="text-xl font-semibold">RP</span>
                      </div>
                    </div>
                    <p className="mt-2 font-medium">Randy Press</p>
                    <p className="text-gray-500 text-sm">Director</p>
                  </div>
                  
                  {/* Contact 3 */}
                  <div className="flex flex-col items-center">
                    <div className="avatar">
                      <div className="w-16 rounded-full bg-accent text-white flex items-center justify-center">
                        <span className="text-xl font-semibold">WD</span>
                      </div>
                    </div>
                    <p className="mt-2 font-medium">Workman</p>
                    <p className="text-gray-500 text-sm">Designer</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <input 
                    type="text" 
                    placeholder="Write Amount" 
                    className="input input-bordered w-full max-w-xs mr-4" 
                    defaultValue="$23.50" 
                  />
                  <button className="btn btn-primary">Send</button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Secondary Card and Stats */}
          <div className="space-y-6">
            {/* Secondary Card */}
            <div className="card bg-gradient-to-br from-pink-400 to-red-500 text-white shadow-xl">
              <div className="card-body">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="card-title text-2xl font-bold mb-2">$5,756</h2>
                    <p className="text-white/80">CASH USCLIER</p>
                    <p className="text-white/80">Entry Columns</p>
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

            {/* Recent Transactions */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-xl font-bold mb-4">Recent Transactions</h2>
                <div className="space-y-4">
                  {/* Transaction 1 */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                        <i className="fas fa-credit-card text-blue-500"></i>
                      </div>
                      <div>
                        <p className="font-medium">Deposit from my Card</p>
                        <p className="text-gray-500 text-sm">28 January 2021</p>
                      </div>
                    </div>
                    <span className="font-bold text-green-600">$850</span>
                  </div>
                  
                  {/* Transaction 2 */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                        <i className="fab fa-paypal text-purple-500"></i>
                      </div>
                      <div>
                        <p className="font-medium">Deposit Paypal</p>
                        <p className="text-gray-500 text-sm">25 January 2021</p>
                      </div>
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
                    <span className="font-bold text-red-600">-$5,400</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Expense Statistics */}
            <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title text-xl font-bold mb-4">Expense Statistics</h2>
                <div className="h-48">
                  <Doughnut data={expenseData} options={expenseOptions} />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div> 
                      Entertainment
                    </span>
                    <span className="font-medium">15%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div> 
                      Investment
                    </span>
                    <span className="font-medium">35%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center">
                      <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div> 
                      Others
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