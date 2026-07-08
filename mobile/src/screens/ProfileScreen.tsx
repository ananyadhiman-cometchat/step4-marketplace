import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { AvatarUpload } from '../components/AvatarUpload';
import { RoleBadge } from '../components/RoleBadge';
import { PrimaryButton } from '../components/PrimaryButton';
import { theme } from '../context/ThemeContext';

export function ProfileScreen() {
  const { user, logout } = useAuth();
  const [avatarUri, setAvatarUri] = useState<string | null>(user?.avatar_url ?? null);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
    Alert.alert('Sign out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign out',
        style: 'destructive',
        onPress: async () => {
          setLoggingOut(true);
          await logout();
        },
      },
    ]);
  };

  if (!user) return null;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <AvatarUpload
          uri={avatarUri}
          name={user.name}
          onPicked={setAvatarUri}
          editable
        />
        <Text style={styles.name}>{user.name}</Text>
        <RoleBadge role={user.role} />
      </View>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>UID</Text>
          <Text style={styles.rowValue}>{user.uid}</Text>
        </View>
        <View style={[styles.row, styles.rowBorder]}>
          <Text style={styles.rowLabel}>Role</Text>
          <Text style={styles.rowValue}>{user.role}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>About Marketplace</Text>
        <Text style={styles.about}>
          Marketplace lets you discover products, negotiate directly with sellers, and complete
          transactions through real-time messaging and calls.
        </Text>
      </View>

      <PrimaryButton
        label="Sign Out"
        onPress={handleLogout}
        loading={loggingOut}
        variant="danger"
        style={styles.logoutBtn}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: theme.spacing.md,
    paddingBottom: 48,
  },
  header: {
    alignItems: 'center',
    paddingVertical: theme.spacing.xl,
    gap: theme.spacing.md,
  },
  name: {
    fontSize: theme.typography.xxl,
    fontWeight: '700',
    color: theme.colors.text,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  rowBorder: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    marginTop: 6,
    paddingTop: 12,
  },
  rowLabel: {
    fontSize: theme.typography.sm,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  rowValue: {
    fontSize: theme.typography.sm,
    color: theme.colors.text,
    fontWeight: '600',
    maxWidth: '60%',
    textAlign: 'right',
  },
  sectionTitle: {
    fontSize: theme.typography.base,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  about: {
    fontSize: theme.typography.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  logoutBtn: {
    marginTop: theme.spacing.sm,
  },
});
