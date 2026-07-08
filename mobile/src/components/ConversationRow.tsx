import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import { Conversation } from '../types';
import { theme } from '../context/ThemeContext';
import { UnreadBadge } from './UnreadBadge';

interface Props {
  conversation: Conversation;
  currentUid: string;
  onPress: () => void;
}

const STATUS_COLORS: Record<string, string> = {
  open: theme.colors.success,
  closed: theme.colors.textMuted,
  flagged: theme.colors.warning,
};

export function ConversationRow({ conversation, currentUid, onPress }: Props) {
  const other =
    conversation.buyer.uid === currentUid ? conversation.seller : conversation.buyer;
  const statusColor = STATUS_COLORS[conversation.status] ?? theme.colors.textMuted;

  return (
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{other.name.charAt(0).toUpperCase()}</Text>
      </View>
      <View style={styles.content}>
        <View style={styles.topRow}>
          <Text style={styles.name} numberOfLines={1}>{other.name}</Text>
          <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
        </View>
        <Text style={styles.listingId} numberOfLines={1}>
          Listing #{conversation.listing_id.slice(0, 8)}…
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  avatarText: {
    color: '#fff',
    fontSize: theme.typography.lg,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  name: {
    flex: 1,
    fontSize: theme.typography.base,
    fontWeight: '600',
    color: theme.colors.text,
    marginRight: 8,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  listingId: {
    fontSize: theme.typography.sm,
    color: theme.colors.textSecondary,
  },
});
