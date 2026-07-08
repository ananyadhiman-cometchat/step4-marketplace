import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CometChatConversations } from '@cometchat/chat-uikit-react-native';
import { CometChat } from '@cometchat/chat-sdk-react-native';
import { MessagesStackParamList } from '../navigation/types';
import { useCometChatReady } from '../context/CometChatContext';
import { theme } from '../context/ThemeContext';

type Props = NativeStackScreenProps<MessagesStackParamList, 'ConversationList'>;

export function ConversationListScreen({ navigation }: Props) {
  const { isReady } = useCometChatReady();

  if (!isReady) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container} testID="cometchat-conversation-list">
      <CometChatConversations
        onItemPress={(conversation) => {
          const entity = conversation.getConversationWith();
          const type = conversation.getConversationType();
          if (type === 'user') {
            navigation.navigate('ConversationThread', {
              ccUid: (entity as CometChat.User).getUid(),
            });
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
