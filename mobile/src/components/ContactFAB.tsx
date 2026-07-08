import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../context/ThemeContext';

interface Props {
  onPress: () => void;
  loading?: boolean;
}

export function ContactFAB({ onPress, loading = false }: Props) {
  return (
    <TouchableOpacity
      style={styles.fab}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel="Message Seller"
    >
      <Ionicons name="chatbubble-ellipses" size={20} color="#fff" />
      <Text style={styles.label}>Message Seller</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 20,
    left: 20,
    backgroundColor: theme.colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.md,
    paddingVertical: 16,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  label: {
    color: '#fff',
    fontSize: theme.typography.base,
    fontWeight: '600',
  },
});
