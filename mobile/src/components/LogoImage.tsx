import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../context/ThemeContext';

export function LogoImage() {
  return (
    <View style={styles.container}>
      <View style={styles.badge}>
        <Text style={styles.icon}>🛍️</Text>
      </View>
      <Text style={styles.title}>Marketplace</Text>
      <Text style={styles.subtitle}>Buy. Sell. Connect.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  badge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  icon: {
    fontSize: 36,
  },
  title: {
    fontSize: theme.typography.xxl,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  subtitle: {
    fontSize: theme.typography.sm,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
});
