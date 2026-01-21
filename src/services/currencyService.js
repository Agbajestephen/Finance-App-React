// Currency service for exchange rate functionality
const API_KEY = "fca_live_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"; // Replace with actual API key
const BASE_URL = "https://api.freecurrencyapi.com/v1";

// Supported currencies with their symbols and names
export const getSupportedCurrencies = () => [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "NGN", symbol: "₦", name: "Nigerian Naira" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
];

// Get exchange rates for a base currency
export const getExchangeRates = async (baseCurrency = "USD") => {
  try {
    const response = await fetch(
      `${BASE_URL}/latest?apikey=${API_KEY}&base_currency=${baseCurrency}`,
    );

    if (!response.ok) {
      throw new Error("Failed to fetch exchange rates");
    }

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message || "API error occurred");
    }

    return data.data;
  } catch (error) {
    console.error("Exchange rate fetch error:", error);
    // Fallback to mock data if API fails
    return getMockExchangeRates(baseCurrency);
  }
};

// Mock exchange rates for fallback
const getMockExchangeRates = (baseCurrency) => {
  const mockRates = {
    USD: {
      EUR: 0.85,
      GBP: 0.73,
      NGN: 410,
      CAD: 1.25,
      AUD: 1.35,
      JPY: 110,
      CHF: 0.92,
      CNY: 6.45,
      INR: 74.5,
    },
    EUR: {
      USD: 1.18,
      GBP: 0.86,
      NGN: 482,
      CAD: 1.47,
      AUD: 1.59,
      JPY: 129,
      CHF: 1.08,
      CNY: 7.58,
      INR: 87.6,
    },
    GBP: {
      USD: 1.37,
      EUR: 1.16,
      NGN: 560,
      CAD: 1.71,
      AUD: 1.85,
      JPY: 150,
      CHF: 1.26,
      CNY: 8.82,
      INR: 101.8,
    },
    NGN: {
      USD: 0.0024,
      EUR: 0.0021,
      GBP: 0.0018,
      CAD: 0.003,
      AUD: 0.0033,
      JPY: 0.27,
      CHF: 0.0022,
      CNY: 0.0157,
      INR: 0.18,
    },
  };

  return mockRates[baseCurrency] || mockRates.USD;
};

// Format currency amount with proper locale
export const formatCurrency = (amount, currencyCode) => {
  try {
    const currency = getSupportedCurrencies().find(
      (c) => c.code === currencyCode,
    );
    if (!currency) return `${amount.toFixed(2)} ${currencyCode}`;

    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    // Fallback formatting
    const currency = getSupportedCurrencies().find(
      (c) => c.code === currencyCode,
    );
    const symbol = currency ? currency.symbol : currencyCode;
    return `${symbol}${amount.toFixed(2)}`;
  }
};

// Convert amount from one currency to another
export const convertCurrency = async (amount, fromCurrency, toCurrency) => {
  try {
    const rates = await getExchangeRates(fromCurrency);
    const rate = rates[toCurrency];

    if (!rate) {
      throw new Error(
        `Exchange rate not available for ${fromCurrency} to ${toCurrency}`,
      );
    }

    return amount * rate;
  } catch (error) {
    console.error("Currency conversion error:", error);
    throw error;
  }
};
