import { useState, useEffect } from "react";
import { FaExchangeAlt, FaSync, FaCalculator } from "react-icons/fa";
import toast from "react-hot-toast";
import {
  getExchangeRates,
  getSupportedCurrencies,
  formatCurrency,
} from "../services/currencyService";

export default function CurrencyConverter() {
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("NGN");
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [rates, setRates] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const currencies = getSupportedCurrencies();

  // Load initial exchange rates
  useEffect(() => {
    const loadExchangeRates = async () => {
      try {
        setLoading(true);
        const exchangeRates = await getExchangeRates(fromCurrency);
        setRates(exchangeRates);
        setLastUpdated(new Date());
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadExchangeRates();
  }, [fromCurrency]);

  // Convert when inputs change
  useEffect(() => {
    if (rates && amount > 0) {
      const performConversion = () => {
        let result;
        if (fromCurrency === toCurrency) {
          result = amount;
        } else {
          result = amount * (rates[toCurrency] || 1);
        }
        setConvertedAmount(result);
      };

      performConversion();
    }
  }, [amount, fromCurrency, toCurrency, rates]);

  const loadExchangeRates = async () => {
    try {
      setLoading(true);
      const exchangeRates = await getExchangeRates(fromCurrency);
      setRates(exchangeRates);
      setLastUpdated(new Date());
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const refreshRates = () => {
    loadExchangeRates();
    toast.success("Exchange rates updated!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold flex items-center justify-center gap-3 mb-2">
          <FaCalculator className="text-primary" />
          Currency Converter
        </h1>
        <p className="text-gray-600">
          Convert between different currencies with live exchange rates
        </p>
      </div>

      {/* Converter Card */}
      <div className="card bg-base-100 shadow-xl max-w-2xl mx-auto">
        <div className="card-body">
          <div className="flex items-center justify-between mb-6">
            <h2 className="card-title">Currency Exchange</h2>
            <button
              onClick={refreshRates}
              disabled={loading}
              className="btn btn-ghost btn-sm gap-2"
            >
              <FaSync className={loading ? "animate-spin" : ""} />
              Refresh Rates
            </button>
          </div>

          {/* Amount Input */}
          <div className="form-control mb-6">
            <label className="label">
              <span className="label-text font-semibold">Amount</span>
            </label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
              className="input input-bordered input-lg text-center font-mono text-xl"
              placeholder="Enter amount"
            />
          </div>

          {/* Currency Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-6">
            {/* From Currency */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">From</span>
              </label>
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="select select-bordered select-lg"
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Swap Button */}
            <div className="flex justify-center">
              <button
                onClick={swapCurrencies}
                className="btn btn-circle btn-primary"
                title="Swap currencies"
              >
                <FaExchangeAlt />
              </button>
            </div>

            {/* To Currency */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">To</span>
              </label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="select select-bordered select-lg"
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.symbol} {currency.code} - {currency.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Result */}
          <div className="bg-base-200 rounded-lg p-6 text-center">
            <div className="text-sm text-gray-600 mb-2">Converted Amount</div>
            <div className="text-3xl font-bold text-primary font-mono">
              {loading ? (
                <span className="loading loading-spinner loading-lg"></span>
              ) : (
                formatCurrency(convertedAmount, toCurrency)
              )}
            </div>
            <div className="text-sm text-gray-500 mt-2">
              1 {fromCurrency} ={" "}
              {rates ? (rates[toCurrency] || 1).toFixed(4) : "---"} {toCurrency}
            </div>
          </div>

          {/* Exchange Rate Info */}
          {lastUpdated && (
            <div className="text-center text-xs text-gray-500 mt-4">
              Last updated: {lastUpdated.toLocaleString()}
            </div>
          )}
        </div>
      </div>

      {/* Popular Conversions */}
      <div className="card bg-base-100 shadow-xl max-w-4xl mx-auto">
        <div className="card-body">
          <h3 className="card-title mb-4">Popular Conversions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { from: "USD", to: "NGN", amount: 1 },
              { from: "EUR", to: "USD", amount: 1 },
              { from: "GBP", to: "USD", amount: 1 },
              { from: "USD", to: "EUR", amount: 100 },
              { from: "USD", to: "GBP", amount: 100 },
              { from: "NGN", to: "USD", amount: 1000 },
            ].map((conversion, index) => (
              <div
                key={index}
                className="bg-base-200 rounded-lg p-4 text-center"
              >
                <div className="text-sm text-gray-600 mb-1">
                  {conversion.amount} {conversion.from} to {conversion.to}
                </div>
                <div className="font-semibold">
                  {rates
                    ? formatCurrency(
                        conversion.amount * (rates[conversion.to] || 1),
                        conversion.to,
                      )
                    : "---"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
