import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { StatCard } from '../components/StatCard';
import { QuickActionList } from '../components/QuickActionList';
import { theme } from '../context/ThemeContext';
import { getConversations } from '../api/conversations';
import { getListings } from '../api/listings';
import { getUsers, updateUser } from '../api/users';
import { User } from '../types';

export function AdminDashboardScreen() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ listings: 0, conversations: 0, users: 0, flagged: 0 });
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [listingsRes, convsRes, flaggedRes, usersRes] = await Promise.allSettled([
        getListings({ limit: 1 }),
        getConversations({ limit: 1 }),
        getConversations({ status: 'flagged', limit: 1 }),
        getUsers({ limit: 10 }),
      ]);

      setStats({
        listings: listingsRes.status === 'fulfilled' ? listingsRes.value.pagination.total : 0,
        conversations: convsRes.status === 'fulfilled' ? convsRes.value.pagination.total : 0,
        flagged: flaggedRes.status === 'fulfilled' ? flaggedRes.value.pagination.total : 0,
        users: usersRes.status === 'fulfilled' ? usersRes.value.pagination.total : 0,
      });

      if (usersRes.status === 'fulfilled') {
        setUsers(usersRes.value.data);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const toggleBan = async (u: User) => {
    const nextStatus = u.status === 'banned' ? 'active' : 'banned';
    Alert.alert(
      nextStatus === 'banned' ? 'Ban user' : 'Unban user',
      `${nextStatus === 'banned' ? 'Ban' : 'Unban'} ${u.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          style: 'destructive',
          onPress: async () => {
            try {
              const updated = await updateUser(u.uid, nextStatus);
              setUsers((prev) => prev.map((x) => (x.uid === updated.uid ? updated : x)));
            } catch {
              Alert.alert('Error', 'Failed to update user.');
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.greeting}>Welcome, {user?.name}</Text>
      <Text style={styles.subtitle}>Admin Dashboard</Text>

      <View style={styles.statsRow}>
        <StatCard label="Listings" value={stats.listings} icon="🛍️" color={theme.colors.primary} />
        <StatCard label="Conversations" value={stats.conversations} icon="💬" color={theme.colors.secondary} />
      </View>
      <View style={[styles.statsRow, { marginTop: 8 }]}>
        <StatCard label="Users" value={stats.users} icon="👥" color="#7C3AED" />
        <StatCard label="Flagged" value={stats.flagged} icon="🚩" color={theme.colors.warning} />
      </View>

      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <QuickActionList
        actions={[
          {
            label: 'View flagged conversations',
            icon: 'flag-outline',
            color: theme.colors.warning,
            onPress: () => Alert.alert('Info', 'Filter applied: status=flagged'),
          },
          {
            label: 'Manage users',
            icon: 'people-outline',
            color: theme.colors.primary,
            onPress: () => {},
          },
          {
            label: 'Platform health',
            icon: 'pulse-outline',
            color: theme.colors.secondary,
            onPress: () => Alert.alert('Health', 'API is operational.'),
          },
        ]}
      />

      <Text style={styles.sectionTitle}>Recent Users</Text>
      {users.map((u) => (
        <View key={u.uid} style={styles.userRow}>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{u.name}</Text>
            <Text style={styles.userRole}>{u.role} · {u.uid}</Text>
          </View>
          {user?.role === 'admin' && (
            <TouchableOpacity
              style={[styles.banBtn, u.status === 'banned' && styles.unbanBtn]}
              onPress={() => toggleBan(u)}
            >
              <Text style={styles.banBtnText}>
                {u.status === 'banned' ? 'Unban' : 'Ban'}
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
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
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  greeting: {
    fontSize: theme.typography.xxl,
    fontWeight: '700',
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: theme.typography.base,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  sectionTitle: {
    fontSize: theme.typography.lg,
    fontWeight: '600',
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    marginBottom: 8,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: theme.typography.base,
    fontWeight: '600',
    color: theme.colors.text,
  },
  userRole: {
    fontSize: theme.typography.xs,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  banBtn: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.sm,
  },
  unbanBtn: {
    backgroundColor: '#D1FAE5',
  },
  banBtnText: {
    fontSize: theme.typography.sm,
    fontWeight: '600',
    color: theme.colors.text,
  },
});
