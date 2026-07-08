import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Conversation, Message } from '../types';
import { getConversation } from '../api/conversations';
import { MessageBubble } from '../components/MessageBubble';
import { ComposerBar } from '../components/ComposerBar';
import { CallIconButton } from '../components/CallIconButton';
import { useAuth } from '../context/AuthContext';
import { theme } from '../context/ThemeContext';
import { MessagesStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<MessagesStackParamList, 'ConversationThread'>;

let nextId = 1;

export function ConversationThreadScreen({ route, navigation }: Props) {
  const { conversationId } = route.params;
  const { user } = useAuth();
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const listRef = useRef<FlatList>(null);

  const load = useCallback(async () => {
    try {
      const conv = await getConversation(conversationId);
      setConversation(conv);

      navigation.setOptions({
        title:
          conv.buyer.uid === user?.uid
            ? conv.seller.name
            : conv.buyer.name,
        headerRight: () => (
          <View style={{ flexDirection: 'row', gap: 4 }}>
            <CallIconButton type="audio" onPress={() => handleStartCall('audio')} />
            <CallIconButton type="video" onPress={() => handleStartCall('video')} />
          </View>
        ),
      });
    } catch {
      Alert.alert('Error', 'Could not load conversation.');
      navigation.goBack();
    } finally {
      setLoading(false);
    }
  }, [conversationId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleStartCall = (type: 'audio' | 'video') => {
    Alert.alert(
      `Start ${type} call`,
      'Calling is powered by CometChat (integrated in a later phase).',
      [{ text: 'OK' }]
    );
  };

  const handleSend = (text: string) => {
    const msg: Message = {
      id: nextId++,
      conversation_id: conversationId,
      sender_uid: user!.uid,
      text,
      type: 'text',
      sent_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, msg]);
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const isClosed = conversation?.status === 'closed';

  return (
    <View style={styles.container}>
      {conversation && (
        <View style={styles.contextBanner}>
          <Text style={styles.contextText} numberOfLines={1}>
            📦 Listing #{conversation.listing_id.slice(0, 8)}…
          </Text>
          <Text style={[
            styles.statusText,
            conversation.status === 'flagged' && { color: theme.colors.warning },
            conversation.status === 'closed' && { color: theme.colors.textMuted },
          ]}>
            {conversation.status.toUpperCase()}
          </Text>
        </View>
      )}

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <MessageBubble message={item} isMine={item.sender_uid === user?.uid} />
        )}
        contentContainerStyle={styles.messageList}
        ListEmptyComponent={
          <View style={styles.emptyMessages}>
            <Text style={styles.emptyText}>No messages yet. Say hello! 👋</Text>
          </View>
        }
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: false })}
      />

      <ComposerBar onSend={handleSend} disabled={isClosed} />
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
  contextBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 8,
    backgroundColor: '#EEF2FF',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  contextText: {
    flex: 1,
    fontSize: theme.typography.sm,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  statusText: {
    fontSize: theme.typography.xs,
    fontWeight: '600',
    color: theme.colors.success,
  },
  messageList: {
    paddingTop: theme.spacing.sm,
    paddingBottom: theme.spacing.sm,
    flexGrow: 1,
  },
  emptyMessages: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: theme.typography.base,
    color: theme.colors.textSecondary,
  },
});
