import { auth } from '@/firebase/firebaseConfig';
import { getPosts, postType } from '@/lib/getPosts';
import { getUserProfile } from '@/lib/getUserProfile';
import { createContext, useContext, useEffect, useState } from 'react';

type AppStateType = {
  profile: any | null;
  setProfile: (profile: any) => void;
  loading: boolean;
  setLoading: (value: boolean) => void;
  postState: CreatePostStateType;
  setPostState: React.Dispatch<
    React.SetStateAction<CreatePostStateType>
  >;
  posts: any | null;
  setPosts: (post: any) => void;
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
  const [posts, setPosts] = useState<postType[]>([]);

  const [postState, setPostState] = useState<CreatePostStateType>({
    mood: 'creative',
    description: '',
    media: null,
    song: null,
  });

    useEffect(() => {
      const loadProfile = async () => {
        if (profile) return;
        try {
  
          setLoading(true)
          const user = auth.currentUser;
          if (!user) return;
  
          const data = await getUserProfile(user.uid);
          setProfile(data);
        } catch (e) {
          console.error('PROFILE FETCH ERROR:', e);
        } finally {
          setLoading(false);
        }
      };
  
      loadProfile();
    }, []);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        const data = await getPosts();
        console.log("dataaaaa: ", data);
        setPosts(data);
      } catch (error) {
        console.error("POST FETCH ERROR: ", error);
      } finally {
        setLoading(false);
      }
    }
    loadPosts();
  }, []);

  return (
    <AppStateContext.Provider
      value={{
        profile,
        setProfile,
        loading,
        setLoading,
        postState,
        setPostState,
        posts,
        setPosts
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
