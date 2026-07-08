import React, { createContext, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import { CometChatUIKit } from '@cometchat/chat-uikit-react-native';
import { CometChat } from '@cometchat/chat-sdk-react-native';
import { useAuth } from './AuthContext';

const APP_ID = process.env.EXPO_PUBLIC_COMETCHAT_APP_ID ?? '';
const REGION = process.env.EXPO_PUBLIC_COMETCHAT_REGION ?? 'us';

interface CometChatContextValue {
  isReady: boolean;
}

const CometChatContext = createContext<CometChatContextValue>({ isReady: false });

export const useCometChatReady = () => useContext(CometChatContext);

// Module-level guards — survive React strict-mode double-mounts
let initialized = false;
let loginInFlight: Promise<unknown> | null = null;

async function ensureLoggedIn(authToken: string): Promise<void> {
  let existing;
  try {
    existing = await CometChatUIKit.getLoggedInUser();
  } catch (e: any) {
    // getLoggedInUser() throws { code: "NOT_FOUND" } on first run — not an error
    if (e?.code !== 'NOT_FOUND') throw e;
  }
  if (existing) return;
  if (loginInFlight) {
    await loginInFlight;
    return;
  }
  loginInFlight = CometChatUIKit.login({ authToken });
  try {
    await loginInFlight;
  } finally {
    loginInFlight = null;
  }
}

export function CometChatProvider({ children }: { children: ReactNode }) {
  const { cometchatAuthToken, user } = useAuth();
  const [isReady, setIsReady] = useState(false);
  const prevUser = useRef<string | null>(null);

  useEffect(() => {
    if (!cometchatAuthToken || !user) {
      setIsReady(false);
      return;
    }

    // Re-login when the logged-in app user changes
    if (prevUser.current && prevUser.current !== user.uid) {
      CometChatUIKit.logout().catch(() => {});
    }
    prevUser.current = user.uid;

    let cancelled = false;
    async function setup() {
      if (!APP_ID) {
        console.warn('[CometChat] EXPO_PUBLIC_COMETCHAT_APP_ID is not set');
        return;
      }
      try {
        if (!initialized) {
          initialized = true;
          await CometChatUIKit.init({
            appId: APP_ID,
            region: REGION,
            subscriptionType: 'ALL_USERS',
          });
        }
        await ensureLoggedIn(cometchatAuthToken!);
        if (!cancelled) setIsReady(true);
      } catch (e) {
        console.error('[CometChat] setup error:', e);
      }
    }
    setup();
    return () => { cancelled = true; };
  }, [cometchatAuthToken, user]);

  // CometChat logout when the app user logs out
  useEffect(() => {
    if (!user && isReady) {
      CometChatUIKit.logout().catch(() => {});
      setIsReady(false);
    }
  }, [user, isReady]);

  return (
    <CometChatContext.Provider value={{ isReady }}>
      {children}
    </CometChatContext.Provider>
  );
}
