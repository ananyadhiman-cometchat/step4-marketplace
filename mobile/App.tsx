import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { CometChatThemeProvider, CometChatI18nProvider } from '@cometchat/chat-uikit-react-native';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';
import { CometChatProvider } from './src/context/CometChatContext';
import { RootNavigator } from './src/navigation/RootNavigator';

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <CometChatThemeProvider>
          <CometChatI18nProvider>
            <ThemeProvider>
              <AuthProvider>
                <CometChatProvider>
                  <RootNavigator />
                  <StatusBar style="auto" />
                </CometChatProvider>
              </AuthProvider>
            </ThemeProvider>
          </CometChatI18nProvider>
        </CometChatThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});
