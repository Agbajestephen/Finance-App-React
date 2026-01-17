export function generateAccountNumber() {
  const prefix = "SB";
  const random = Math.floor(100000000 + Math.random() * 900000000);
  return `${prefix}${random}`;
}
