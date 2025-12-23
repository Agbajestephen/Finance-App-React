import React from "react";

function Profile() {
  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Credit Cards</h1>
      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th>Card Name</th>
              <th>Number</th>
              <th>Balance</th>
              <th>Due Date</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>SoftBank Platinum</td>
              <td>•••• 4321</td>
              <td>$1,234.56</td>
              <td>Jan 30, 2024</td>
            </tr>
            <tr>
              <td>SoftBank Gold</td>
              <td>•••• 8765</td>
              <td>$567.89</td>
              <td>Feb 15, 2024</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Profile;
