# TODO: Add Convert Button for Currency Conversion

## Tasks

- [ ] Update BankingContext to add `currency` field to accounts (default "NGN")
- [ ] Add `convertAllBalancesToCurrency(targetCurrency)` function in BankingContext
- [ ] Update CurrencyConverter.jsx to add Convert button and set NGN as default fromCurrency
- [ ] Test the conversion functionality

## Notes

- Default currency changed to NGN as per user request
- Conversion will convert all account balances to the selected target currency
- Button disabled when fromCurrency === toCurrency or loading
- Currency settings added to Settings page for user control over default currency and balance conversion
