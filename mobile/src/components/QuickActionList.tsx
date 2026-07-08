import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../context/ThemeContext';

interface Action {
  label: string;
  icon: string;
  onPress: () => void;
  color?: string;
}

interface Props {
  actions: Action[];
}

export function QuickActionList({ actions }: Props) {
  return (
    <View style={styles.container}>
      {actions.map((action) => (
        <TouchableOpacity
          key={action.label}
          style={styles.item}
          onPress={action.onPress}
          activeOpacity={0.7}
        >
          <View style={[styles.iconWrap, { backgroundColor: (action.color ?? theme.colors.primary) + '20' }]}>
            <Ionicons
              name={action.icon as any}
              size={20}
              color={action.color ?? theme.colors.primary}
            />
          </View>
          <Text style={styles.label}>{action.label}</Text>
          <Ionicons name="chevron-forward" size={16} color={theme.colors.textMuted} />
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  iconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.md,
  },
  label: {
    flex: 1,
    fontSize: theme.typography.base,
    color: theme.colors.text,
    fontWeight: '500',
  },
});
