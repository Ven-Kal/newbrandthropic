
/**
 * Custom hook to validate password requirements
 */
export const usePasswordValidation = () => {
  const validatePassword = (pass: string) => {
    if (pass.length < 6) {
      return "Password must be at least 6 characters";
    }
    
    // Check if password is either all numeric or all alphabetic
    const isNumeric = /^\d+$/.test(pass);
    const isAlphabetic = /^[a-zA-Z]+$/.test(pass);
    
    if (!isNumeric && !isAlphabetic) {
      return "Password must be either all numeric or all alphabetic";
    }
    
    return null;
  };

  return { validatePassword };
};
