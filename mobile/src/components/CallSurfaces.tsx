import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { CometChat } from '@cometchat/chat-sdk-react-native';
import { CometChatCalls } from '@cometchat/calls-sdk-react-native';
import {
  CometChatIncomingCall,
  CometChatOutgoingCall,
  CometChatOngoingCall,
  CometChatUIEventHandler,
} from '@cometchat/chat-uikit-react-native';

// Root-mounted call handler (per cometchat-native-calls skill): incoming/outgoing/ongoing
// call surfaces only appear where BOTH listeners are registered — must live above all
// stacks/tabs, NOT on a leaf screen. Registers the SDK socket + the UI-event channel.
const CALL_LISTENER_ID = 'app-call-listener';

export function CallSurfaces() {
  const [outgoingCall, setOutgoingCall] = useState<CometChat.Call | null>(null);
  const [incomingCall, setIncomingCall] = useState<CometChat.Call | null>(null);
  const [ongoingCall, setOngoingCall] = useState<CometChat.Call | null>(null);

  useEffect(() => {
    CometChat.addCallListener(
      CALL_LISTENER_ID,
      new CometChat.CallListener({
        onIncomingCallReceived: (call: CometChat.Call) => setIncomingCall(call),
        onIncomingCallCancelled: () => setIncomingCall(null),
        onOutgoingCallAccepted: () => {},
        onOutgoingCallRejected: () => setOutgoingCall(null),
      })
    );
    // UI events fired by CometChatCallButtons / CometChatMessageHeader on tap
    CometChatUIEventHandler.addCallListener(CALL_LISTENER_ID, {
      ccOutgoingCall: ({ call }: any) => setOutgoingCall(call),
      ccCallEnded: () => { setOutgoingCall(null); setIncomingCall(null); setOngoingCall(null); },
      ccShowOngoingCall: ({ call }: any) => setOngoingCall(call),
    });
    return () => {
      CometChat.removeCallListener(CALL_LISTENER_ID);
      CometChatUIEventHandler.removeCallListener(CALL_LISTENER_ID);
    };
  }, []);

  return (
    <>
      {incomingCall && (
        <View style={StyleSheet.absoluteFill}>
          <CometChatIncomingCall call={incomingCall} onDecline={() => setIncomingCall(null)} />
        </View>
      )}
      {outgoingCall && (
        <View style={StyleSheet.absoluteFill}>
          <CometChatOutgoingCall call={outgoingCall} />
        </View>
      )}
      {ongoingCall && (
        <View style={StyleSheet.absoluteFill}>
          <CometChatOngoingCall
            sessionID={ongoingCall.getSessionId()}
            callSettingsBuilder={new CometChatCalls.CallSettingsBuilder().setIsAudioOnlyCall(ongoingCall.getType() === 'audio')}
          />
        </View>
      )}
    </>
  );
}
