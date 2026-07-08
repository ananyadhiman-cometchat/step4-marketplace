import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Role } from '../types';
import { theme } from '../context/ThemeContext';

interface Props {
  role: Role;
}

const ROLE_LABELS: Record<Role, string> = {
  admin: 'Admin',
  seller: 'Seller',
  buyer: 'Buyer',
  moderator: 'Moderator',
  smoke: 'Smoke',
};

export function RoleBadge({ role }: Props) {
  const bg = theme.colors.badge[role] ?? theme.colors.textMuted;
  return (
    <View style={[styles.badge, { backgroundColor: bg }]}>
      <Text style={styles.label}>{ROLE_LABELS[role]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: theme.borderRadius.full,
    alignSelf: 'flex-start',
  },
  label: {
    color: '#fff',
    fontSize: theme.typography.xs,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
