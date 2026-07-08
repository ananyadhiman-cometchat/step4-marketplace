import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Seller } from '../types';
import { theme } from '../context/ThemeContext';

interface Props {
  seller: Seller & { avatar_url?: string | null };
}

export function SellerRow({ seller }: Props) {
  return (
    <View style={styles.container}>
      {seller.avatar_url ? (
        <Image source={{ uri: seller.avatar_url }} style={styles.avatar} />
      ) : (
        <View style={styles.avatarFallback}>
          <Text style={styles.avatarInitial}>{seller.name.charAt(0).toUpperCase()}</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.label}>Seller</Text>
        <Text style={styles.name}>{seller.name}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: theme.spacing.md,
  },
  avatarFallback: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  avatarInitial: {
    color: '#fff',
    fontSize: theme.typography.lg,
    fontWeight: '600',
  },
  info: {
    flex: 1,
  },
  label: {
    fontSize: theme.typography.xs,
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  name: {
    fontSize: theme.typography.base,
    fontWeight: '600',
    color: theme.colors.text,
  },
});
