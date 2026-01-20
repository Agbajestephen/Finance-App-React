export const generateAccountNumber = () => {
  const random = Math.floor(100000000 + Math.random() * 900000000);
  return `SB-${random}`;
};
