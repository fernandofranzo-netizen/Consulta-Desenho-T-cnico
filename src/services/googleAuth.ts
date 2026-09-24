import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  User, 
  signOut 
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

// Ensure singleton app initialization
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const SCOPES = [
  'https://www.googleapis.com/auth/drive.file',
  'https://www.googleapis.com/auth/drive.readonly',
];

const provider = new GoogleAuthProvider();
SCOPES.forEach((scope) => provider.addScope(scope));
provider.setCustomParameters({ prompt: 'select_account' });

// Token storage with sessionStorage persistence across tab reloads
const TOKEN_KEY = 'techview_gdrive_access_token';
const TOKEN_EXP_KEY = 'techview_gdrive_token_exp';

const getStoredToken = (): string | null => {
  try {
    const token = sessionStorage.getItem(TOKEN_KEY);
    const exp = sessionStorage.getItem(TOKEN_EXP_KEY);
    if (token && exp && Date.now() < Number(exp)) {
      return token;
    }
    sessionStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_EXP_KEY);
  } catch (e) {
    // sessionStorage not available
  }
  return null;
};

const storeToken = (token: string | null) => {
  try {
    if (token) {
      sessionStorage.setItem(TOKEN_KEY, token);
      // Valid for 55 minutes
      sessionStorage.setItem(TOKEN_EXP_KEY, String(Date.now() + 55 * 60 * 1000));
    } else {
      sessionStorage.removeItem(TOKEN_KEY);
      sessionStorage.removeItem(TOKEN_EXP_KEY);
    }
  } catch (e) {
    // ignore
  }
};

let cachedAccessToken: string | null = getStoredToken();
let isSigningIn = false;

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
}

type AuthCallback = (state: AuthState) => void;
const listeners: Set<AuthCallback> = new Set();

const notifyListeners = (user: User | null, token: string | null) => {
  const state: AuthState = {
    user,
    accessToken: token,
    isAuthenticated: !!user && !!token,
  };
  listeners.forEach((callback) => callback(state));
};

export const subscribeAuth = (callback: AuthCallback) => {
  listeners.add(callback);
  const activeToken = cachedAccessToken || getStoredToken();
  if (activeToken && !cachedAccessToken) {
    cachedAccessToken = activeToken;
  }
  // Send immediate state
  callback({
    user: auth.currentUser,
    accessToken: cachedAccessToken,
    isAuthenticated: !!auth.currentUser && !!cachedAccessToken,
  });
  return () => {
    listeners.delete(callback);
  };
};

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    const validToken = cachedAccessToken || getStoredToken();
    if (user && validToken) {
      cachedAccessToken = validToken;
      if (onAuthSuccess) onAuthSuccess(user, validToken);
      notifyListeners(user, validToken);
    } else if (!user) {
      cachedAccessToken = null;
      storeToken(null);
      if (onAuthFailure) onAuthFailure();
      notifyListeners(null, null);
    } else {
      // User is logged in to Firebase but needs fresh Google OAuth token
      notifyListeners(user, null);
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string }> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Não foi possível obter o token de acesso do Google Drive.');
    }

    cachedAccessToken = credential.accessToken;
    storeToken(cachedAccessToken);
    notifyListeners(result.user, cachedAccessToken);
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Erro na autenticação com Google:', error);
    cachedAccessToken = null;
    storeToken(null);
    notifyListeners(null, null);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const getAccessToken = async (): Promise<string | null> => {
  if (!cachedAccessToken) {
    cachedAccessToken = getStoredToken();
  }
  return cachedAccessToken;
};

export const googleSignOut = async (): Promise<void> => {
  try {
    await signOut(auth);
    cachedAccessToken = null;
    storeToken(null);
    notifyListeners(null, null);
  } catch (error) {
    console.error('Erro ao desconectar:', error);
    throw error;
  }
};
