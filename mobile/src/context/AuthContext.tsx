import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthUser } from '../types';
import { login as apiLogin } from '../api/auth';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  cometchatAuthToken: string | null;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    cometchatAuthToken: null,
    isLoading: true,
  });

  useEffect(() => {
    (async () => {
      try {
        const [token, userJson, ccToken] = await AsyncStorage.multiGet([
          'auth_token',
          'auth_user',
          'cometchat_auth_token',
        ]);
        if (token[1] && userJson[1]) {
          setState({
            token: token[1],
            user: JSON.parse(userJson[1]),
            cometchatAuthToken: ccToken[1],
            isLoading: false,
          });
        } else {
          setState((s) => ({ ...s, isLoading: false }));
        }
      } catch {
        setState((s) => ({ ...s, isLoading: false }));
      }
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const data = await apiLogin(email, password);
    await AsyncStorage.multiSet([
      ['auth_token', data.token],
      ['auth_user', JSON.stringify(data.user)],
      ['cometchat_auth_token', data.cometchat_auth_token],
    ]);
    setState({
      token: data.token,
      user: data.user,
      cometchatAuthToken: data.cometchat_auth_token,
      isLoading: false,
    });
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(['auth_token', 'auth_user', 'cometchat_auth_token']);
    setState({ user: null, token: null, cometchatAuthToken: null, isLoading: false });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
