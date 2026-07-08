import React, { useEffect, useState } from 'react';
import { View, Platform, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CometChat } from '@cometchat/chat-sdk-react-native';
import { CometChatCalls } from '@cometchat/calls-sdk-react-native';
import {
  CometChatMessageHeader,
  CometChatMessageList,
  CometChatMessageComposer,
  CometChatOngoingCall,
} from '@cometchat/chat-uikit-react-native';
import { Ionicons } from '@expo/vector-icons';
import { MessagesStackParamList } from '../navigation/types';
import { useCometChatReady } from '../context/CometChatContext';
import { theme } from '../context/ThemeContext';

type Props = NativeStackScreenProps<MessagesStackParamList, 'ConversationThread'>;

export function ConversationThreadScreen({ route, navigation }: Props) {
  const { ccUid } = route.params;
  const { isReady } = useCometChatReady();
  const [ccUser, setCcUser] = useState<CometChat.User | null>(null);
  const [callSessionId, setCallSessionId] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady || !ccUid) return;
    CometChat.getUser(ccUid)
      .then((u) => {
        setCcUser(u);
        navigation.setOptions({ title: u.getName() });
      })
      .catch(() => navigation.goBack());
  }, [isReady, ccUid]);

  const handleAudioCall = async () => {
    if (!ccUser) return;
    try {
      const call = new CometChat.Call(
        ccUser.getUid(),
        CometChat.CALL_TYPE.AUDIO,
        CometChat.RECEIVER_TYPE.USER,
      );
      const initiated = await CometChat.initiateCall(call);
      setCallSessionId(initiated.getSessionId());
    } catch (e) {
      console.error('[CometChat] call initiation failed:', e);
    }
  };

  useEffect(() => {
    if (!isReady || !ccUser) return;
    const listenerId = `call-${ccUser.getUid()}`;
    CometChat.addCallListener(
      listenerId,
      new CometChat.CallListener({
        onIncomingCallReceived: () => {},
        onOutgoingCallAccepted: (call: CometChat.Call) => {
          setCallSessionId(call.getSessionId());
        },
        onOutgoingCallRejected: () => setCallSessionId(null),
        onIncomingCallCancelled: () => setCallSessionId(null),
      }),
    );
    return () => CometChat.removeCallListener(listenerId);
  }, [isReady, ccUser]);

  if (!isReady || !ccUser) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CometChatMessageHeader
        user={ccUser}
        onBack={() => navigation.goBack()}
        showBackButton
        AuxiliaryButtonView={() => (
          <View testID="cometchat-call-button">
            <TouchableOpacity onPress={handleAudioCall} style={styles.callBtn}>
              <Ionicons name="call-outline" size={22} color={theme.colors.primary} />
            </TouchableOpacity>
          </View>
        )}
      />

      <View style={styles.flex} testID="cometchat-message-list">
        <CometChatMessageList
          user={ccUser}
          hideReplyInThreadOption
        />
      </View>

      <CometChatMessageComposer
        user={ccUser}
        keyboardAvoidingViewProps={
          Platform.OS === 'android' ? {} : { behavior: 'padding' }
        }
      />

      {callSessionId && (
        <View style={StyleSheet.absoluteFillObject} testID="cometchat-outgoing-call">
          <CometChatOngoingCall
            sessionID={callSessionId}
            callSettingsBuilder={CometChatCalls.CallSettingsBuilder}
            onError={(e) => {
              console.error('[CometChat] ongoing call error:', e);
              setCallSessionId(null);
            }}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  flex: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  callBtn: {
    padding: 8,
  },
});
