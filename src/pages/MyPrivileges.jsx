

function MyPrivileges() {
   const privileges = [
    'Priority Customer Support',
    'Zero Account Fees',
    'Higher Withdrawal Limits',
    'Exclusive Investment Opportunities',
    'Airport Lounge Access',
  ];
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Privileges</h1>
      <div className="card bg-gradient-to-r from-primary to-secondary text-primary-content">
        <div className="card-body">
          <h2 className="card-title">VIP Status: Gold Member</h2>
          <p>Enjoy exclusive benefits as a SoftBank Gold Member</p>
        </div>
      </div>
      <div className="mt-6">
        <ul className="space-y-2">
          {privileges.map((privilege, index) => (
            <li key={index} className="flex items-center gap-2">
              <div className="badge badge-primary">✓</div>
              {privilege}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default MyPrivileges;