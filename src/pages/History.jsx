import React from "react";

function History() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Investment</h1>
      <p className="mb-4">Your investment portfolio management.</p>

      <div className="stats shadow">
        <div className="stat">
          <div className="stat-title">Total Portfolio</div>
          <div className="stat-value">$89,123.45</div>
          <div className="stat-desc">↗︎ 12.5% this month</div>
        </div>

        <div className="stat">
          <div className="stat-title">Stocks</div>
          <div className="stat-value">$45,000</div>
          <div className="stat-desc">↗︎ 8% this month</div>
        </div>

        <div className="stat">
          <div className="stat-title">Bonds</div>
          <div className="stat-value">$25,000</div>
          <div className="stat-desc">↘︎ 2% this month</div>
        </div>

        <div className="stat">
          <div className="stat-title">Crypto</div>
          <div className="stat-value">$19,123.45</div>
          <div className="stat-desc">↗︎ 20% this month</div>
        </div>
      </div>
    </div>
  );
}

export default History;