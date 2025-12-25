import React, { ReactNode, createContext, useContext, useState } from 'react';

export interface SignupData {
  // Basic Info
  profilePhoto: string | null;
  firstName: string;
  lastName: string;

  // Account Details
  email: string;
  username: string;
  password: string;

  // Birthday
  birthday: {
    day: number;
    month: number;
    year: number;
  } | null;
}

interface SignupContextType {
  signupData: SignupData;
  updateSignupData: (data: Partial<SignupData>) => void;
  resetSignupData: () => void;
}

const initialSignupData: SignupData = {
  profilePhoto: null,
  firstName: '',
  lastName: '',
  email: '',
  username: '',
  password: '',
  birthday: null,
};

const SignupContext = createContext<SignupContextType | undefined>(undefined);

export function SignupProvider({ children }: { children: ReactNode }) {
  const [signupData, setSignupData] = useState<SignupData>(initialSignupData);

  const updateSignupData = (data: Partial<SignupData>) => {
    setSignupData((prev) => ({
      ...prev,
      ...data,
    }));
  };

  const resetSignupData = () => {
    setSignupData(initialSignupData);
  };

  return (
    <SignupContext.Provider
      value={{
        signupData,
        updateSignupData,
        resetSignupData,
      }}
    >
      {children}
    </SignupContext.Provider>
  );
}

export function useSignup() {
  const context = useContext(SignupContext);
  if (context === undefined) {
    throw new Error('useSignup must be used within a SignupProvider');
  }
  return context;
}

