import { createContext, useContext, useState } from 'react';

type AppStateType = {
  profile: any | null;
  setProfile: (profile: any) => void;
  loading: boolean;
  setLoading: (value: boolean) => void;
  postState: CreatePostStateType;
  setPostState: React.Dispatch<
    React.SetStateAction<CreatePostStateType>
  >;
};

export type PostMedia =
  | { type: 'image'; value: string }
  | { type: 'background'; value: string }
  | null;

export type CreatePostStateType = {
  description: string;
  mood: string;
  media: PostMedia;
  song: string | null;
};

const AppStateContext = createContext<AppStateType | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const [postState, setPostState] = useState<CreatePostStateType>({
    mood: 'creative',
    description: '',
    media: null,
    song: null,
  });

  return (
    <AppStateContext.Provider
      value={{
        profile,
        setProfile,
        loading,
        setLoading,
        postState,
        setPostState
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
