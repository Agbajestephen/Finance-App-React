import zxcvbn from "zxcvbn";

// =======================
// UTILITY FUNCTIONS
// =======================
export const isStrongPassword = (password) => {
  const result = zxcvbn(password);
  return result.score >= 3; // At least "Strong" level
};
