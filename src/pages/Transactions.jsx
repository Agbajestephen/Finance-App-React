import React from 'react';
import { FaSpotify, FaUserFriends, FaShieldAlt, FaEye, FaPlus, FaEllipsisV } from 'react-icons/fa';

const Dashboard = () => {
  // Transactions data
  const transactions = [
    {
      id: 1,
      description: 'Spotify',
      details: 'Auto renew',
      transactionId: '#12548796',
      type: 'Shopping',
      card: '1234 ****',
      date: '25 Jan, 12:20 AM',
      amount: '-$2,500',
      status: 'previous',
      icon: <FaSpotify className="text-green-500" />
    },
    {
      id: 2,
      description: 'People',
      details: 'Sales',
      transactionId: '#13546795',
      type: 'Transfer',
      card: '1234 ****',
      date: '25 Jan, 10:40 PM',
      amount: '+$970',
      status: 'previous',
      icon: <FaUserFriends className="text-blue-500" />
    },
    {
      id: 3,
      description: 'Service',
      details: 'Service',
      transactionId: '#13546795',
      type: 'Service',
      card: '1234 ****',
      date: '20 Jan, 10:40 PM',
      amount: '+$580',
      status: 'previous',
      icon: <FaShieldAlt className="text-purple-500" />
    },
    {
      id: 4,
      description: 'Vision',
      details: '',
      transactionId: '#15546196',
      type: 'Transfer',
      card: '1234 ****',
      date: '15 Jan, 03:28 PM',
      amount: '+$808',
      status: 'previous',
      icon: <FaEye className="text-yellow-500" />
    },
    {
      id: 5,
      description: 'Entity',
      details: '',
      transactionId: '#125456795',
      type: 'Transfer',
      card: '1234 ****',
      date: '14 Jan, 10:40 PM',
      amount: '+$584',
      status: 'previous',
      icon: <FaEllipsisV className="text-gray-500" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 font-sans">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Cards</h1>
            <div className="flex space-x-4 mt-2">
              <button className="text-blue-600 font-medium flex items-center">
                <FaPlus className="mr-2" /> Add Card
              </button>
              <button className="text-gray-600 font-medium">My Expense</button>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="dropdown dropdown-end">
              <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                <div className="w-10 rounded-full bg-primary text-white flex items-center justify-center">
                  <span className="font-semibold">JD</span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Cards Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Card 1 */}
          <div className="card bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center mb-2">
                    <div className="badge badge-sm bg-white/30 text-white border-0 mr-2">DATA</div>
                    <span className="text-sm">9/2020</span>
                  </div>
                  <h2 className="card-title text-3xl font-bold mb-1">$5,796</h2>
                  <p className="text-white/80 text-sm">DATA Location</p>
                  <p className="text-white/80 text-sm">MADE BY 01 12/23</p>
                </div>
                <div className="text-right">
                  <div className="badge badge-sm bg-white/30 text-white border-0 mb-2">$5.7%</div>
                  <div className="flex space-x-2">
                    <div className="w-10 h-7 bg-white/30 rounded"></div>
                    <div className="w-10 h-7 bg-white/30 rounded"></div>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <p className="text-xl font-semibold">3778 **** **** 1234</p>
                <div className="flex justify-between items-center mt-4">
                  <p className="text-white/80 text-sm">VALID THRU 08/25</p>
                  <div className="flex items-center">
                    <div className="w-8 h-5 bg-white/30 rounded mr-2"></div>
                    <span className="text-sm">VISA</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 */}
          <div className="card bg-gradient-to-br from-green-500 to-teal-600 text-white shadow-xl">
            <div className="card-body">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center mb-2">
                    <div className="badge badge-sm bg-white/30 text-white border-0 mr-2">SOCIALIZATION</div>
                    <span className="text-sm">BANK</span>
                  </div>
                  <h2 className="card-title text-3xl font-bold mb-1">$5,756</h2>
                  <p className="text-white/80 text-sm">CIGARETTES</p>
                  <p className="text-white/80 text-sm">VALUE IN 4G 17/22</p>
                </div>
                <div className="text-right">
                  <div className="badge badge-sm bg-white/30 text-white border-0 mb-2">17.92%</div>
                  <div className="flex space-x-2">
                    <div className="w-10 h-7 bg-white/30 rounded"></div>
                    <div className="w-10 h-7 bg-white/30 rounded"></div>
                  </div>
                </div>
              </div>
              <div className="mt-8">
                <p className="text-xl font-semibold">3779 **** **** 1234</p>
                <div className="flex justify-between items-center mt-4">
                  <p className="text-white/80 text-sm">VALID THRU 07/24</p>
                  <div className="flex items-center">
                    <div className="w-8 h-5 bg-white/30 rounded mr-2"></div>
                    <span className="text-sm">MASTER</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="card bg-base-100 shadow-xl">
          <div className="card-body">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h2 className="card-title text-2xl font-bold">Recent Transactions</h2>
              <div className="flex space-x-2">
                <button className="btn btn-sm btn-active">All Transactions</button>
                <div className="tabs tabs-boxed">
                  <a className="tab tab-active">Income</a>
                  <a className="tab">Expense</a>
                </div>
              </div>
            </div>

            {/* Desktop Table */}
            <div className="overflow-x-auto">
              <table className="table table-zebra w-full hidden md:table">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="font-semibold text-gray-700">Description</th>
                    <th className="font-semibold text-gray-700">Transaction ID</th>
                    <th className="font-semibold text-gray-700">Type</th>
                    <th className="font-semibold text-gray-700">Card</th>
                    <th className="font-semibold text-gray-700">Date</th>
                    <th className="font-semibold text-gray-700">Amount</th>
                    <th className="font-semibold text-gray-700">Receipt</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover">
                      <td>
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                            {transaction.icon}
                          </div>
                          <div>
                            <p className="font-medium">{transaction.description}</p>
                            {transaction.details && (
                              <p className="text-gray-500 text-sm">{transaction.details}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="text-gray-600">{transaction.transactionId}</span>
                      </td>
                      <td>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          transaction.type === 'Shopping' ? 'bg-red-100 text-red-800' :
                          transaction.type === 'Transfer' ? 'bg-blue-100 text-blue-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {transaction.type}
                        </span>
                      </td>
                      <td className="text-gray-600">{transaction.card}</td>
                      <td className="text-gray-600">{transaction.date}</td>
                      <td className={`font-semibold ${
                        transaction.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {transaction.amount}
                      </td>
                      <td>
                        <button className="btn btn-xs btn-outline">{transaction.status}</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Mobile Cards View */}
              <div className="space-y-4 md:hidden">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="card card-compact bg-base-100 shadow">
                    <div className="card-body">
                      <div className="flex justify-between items-start">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                            {transaction.icon}
                          </div>
                          <div>
                            <h3 className="font-bold">{transaction.description}</h3>
                            {transaction.details && (
                              <p className="text-gray-500 text-sm">{transaction.details}</p>
                            )}
                            <p className="text-gray-600 text-sm">{transaction.transactionId}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-bold ${
                            transaction.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'
                          }`}>
                            {transaction.amount}
                          </p>
                          <p className="text-gray-500 text-sm">{transaction.date}</p>
                        </div>
                      </div>
                      <div className="flex justify-between items-center mt-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          transaction.type === 'Shopping' ? 'bg-red-100 text-red-800' :
                          transaction.type === 'Transfer' ? 'bg-blue-100 text-blue-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {transaction.type}
                        </span>
                        <span className="text-gray-600 text-sm">{transaction.card}</span>
                        <button className="btn btn-xs btn-outline">{transaction.status}</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-500">
                Showing 5 of 25 transactions
              </div>
              <div className="join">
                <button className="join-item btn btn-sm">Previous</button>
                <button className="join-item btn btn-sm btn-active">1</button>
                <button className="join-item btn btn-sm">2</button>
                <button className="join-item btn btn-sm">3</button>
                <button className="join-item btn btn-sm">4</button>
                <button className="join-item btn btn-sm">Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;