import { createContext, useContext, useState } from 'react';

type AppStateType = {
  profile: any | null;
  setProfile: (profile: any) => void;
  loading: boolean;
  setLoading: (value: boolean) => void;
};

const AppStateContext = createContext<AppStateType | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  return (
    <AppStateContext.Provider
      value={{
        profile,
        setProfile,
        loading,
        setLoading,
      }}
    >
      {children}
    </AppStateContext.Provider>
  );
}

export const useAppContext = () => {
  const ctx = useContext(AppStateContext);
  if (!ctx) {
    throw new Error('useAppState must be used inside AppStateProvider');
  }
  return ctx;
};
