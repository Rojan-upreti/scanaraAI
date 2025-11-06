import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  getIdToken,
  updateProfile
} from 'firebase/auth';
import { auth } from '../config/firebase';
import api from '../config/api';

export interface UserProfile {
  firstName: string;
  lastName: string;
  companyName?: string;
  phoneNumber: string;
  email: string;
  uid: string;
}

interface User {
  name: string;
  email: string;
  picture: string;
  uid: string;
  idToken?: string;
  profile?: UserProfile;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loginWithGoogle: () => Promise<void>;
  signUpWithEmail: (email: string, password: string, firstName: string, lastName: string, companyName?: string, phoneNumber: string) => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  updateUserProfile: (profile: Partial<UserProfile>) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        try {
          // Get ID token for backend verification
          const idToken = await getIdToken(firebaseUser);
          localStorage.setItem('idToken', idToken);
          
          // Load user profile from backend
          let userProfile: UserProfile | null = null;
          try {
            userProfile = await api.get<UserProfile>('/users/profile');
          } catch (error: any) {
            // If profile doesn't exist (404), that's okay - user will need to complete it
            // This is expected for new users who haven't completed their profile yet
            if (error.status === 404 || error.message?.includes('404') || error.message?.includes('not found') || error.message?.includes('Profile not found') || error.message?.includes('PROFILE_NOT_FOUND')) {
              userProfile = null;
              // Silently handle 404 - not an error, just means profile needs to be created
            } else {
              // Log other errors (network issues, server errors, etc.)
              console.error('Error loading profile:', error);
            }
          }
          
          // If no profile exists and user signed in with Google, extract name from displayName
          if (!userProfile && firebaseUser.displayName) {
            const nameParts = firebaseUser.displayName.split(' ');
            if (nameParts.length >= 2) {
              // Create temporary profile object (not saved yet)
              userProfile = {
                firstName: nameParts[0],
                lastName: nameParts.slice(1).join(' '),
                email: firebaseUser.email || '',
                phoneNumber: '',
                uid: firebaseUser.uid,
              };
            }
          }
          
          // Get picture from Firebase user (for Google SSO) or generate fallback
          const userPicture = firebaseUser.photoURL || 
            (userProfile?.firstName ? 
              `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile.firstName + ' ' + (userProfile.lastName || ''))}&background=007AFF&color=fff` :
              `https://ui-avatars.com/api/?name=${encodeURIComponent(firebaseUser.displayName || 'User')}&background=007AFF&color=fff`);
          
          const userData: User = {
            name: firebaseUser.displayName || (userProfile ? `${userProfile.firstName} ${userProfile.lastName}` : 'User'),
            email: firebaseUser.email || '',
            picture: userPicture,
            uid: firebaseUser.uid,
            idToken,
            profile: userProfile || undefined,
          };
          
          setUser(userData);
          setProfile(userProfile);
        } catch (error) {
          console.error('Error getting user token:', error);
          setUser(null);
          setProfile(null);
        }
      } else {
        setUser(null);
        setProfile(null);
        localStorage.removeItem('idToken');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
    
    const userCredential = await signInWithPopup(auth, provider);
    // Get ID token for backend
    const idToken = await getIdToken(userCredential.user);
    localStorage.setItem('idToken', idToken);
    // Auth state listener will handle the rest
  };

  const signUpWithEmail = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    companyName: string | undefined,
    phoneNumber: string
  ) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update display name
    await updateProfile(userCredential.user, {
      displayName: `${firstName} ${lastName}`
    });

    // Get ID token for backend
    const idToken = await getIdToken(userCredential.user);
    localStorage.setItem('idToken', idToken);
    
    // Create profile on backend
    const savedProfile = await api.post<UserProfile>('/users/profile', {
      firstName,
      lastName,
      companyName,
      phoneNumber,
      email,
    });
    
    setProfile(savedProfile);
    
    // Refresh user data
    await userCredential.user.reload();
  };

  const signInWithEmail = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // Get ID token for backend
    const idToken = await getIdToken(userCredential.user);
    localStorage.setItem('idToken', idToken);
    // Auth state listener will handle the rest
  };

  const updateUserProfile = async (profileData: Partial<UserProfile>) => {
    if (!user) throw new Error('No user logged in');

    // If no profile exists, we need to create it (POST), otherwise update it (PUT)
    const profileExists = !!profile;
    
    // Prepare profile data
    const profileToSave: any = {
      firstName: profileData.firstName || profile?.firstName || '',
      lastName: profileData.lastName || profile?.lastName || '',
      companyName: profileData.companyName !== undefined ? profileData.companyName : profile?.companyName,
      phoneNumber: profileData.phoneNumber || profile?.phoneNumber || '',
      email: user.email || '',
    };

    // Save to backend - use POST if profile doesn't exist, PUT if it does
    let savedProfile: UserProfile;
    if (profileExists) {
      savedProfile = await api.put<UserProfile>('/users/profile', {
        firstName: profileToSave.firstName,
        lastName: profileToSave.lastName,
        companyName: profileToSave.companyName,
        phoneNumber: profileToSave.phoneNumber,
      });
    } else {
      savedProfile = await api.post<UserProfile>('/users/profile', {
        firstName: profileToSave.firstName,
        lastName: profileToSave.lastName,
        companyName: profileToSave.companyName,
        phoneNumber: profileToSave.phoneNumber,
        email: profileToSave.email,
      });
    }
    
    setProfile(savedProfile);
    
    // Update user object - preserve picture from original user
    setUser({
      ...user,
      profile: savedProfile,
      name: `${savedProfile.firstName} ${savedProfile.lastName}`,
      // Keep the original picture (photoURL from Google)
    });
  };

  const logout = async () => {
    await firebaseSignOut(auth);
    localStorage.removeItem('idToken');
    // Auth state listener will handle the rest
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      profile,
      loginWithGoogle, 
      signUpWithEmail,
      signInWithEmail,
      updateUserProfile,
      logout, 
      isAuthenticated: !!user,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
