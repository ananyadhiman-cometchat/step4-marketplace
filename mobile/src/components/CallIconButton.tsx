import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../context/ThemeContext';

interface Props {
  type?: 'audio' | 'video';
  onPress: () => void;
}

export function CallIconButton({ type = 'audio', onPress }: Props) {
  return (
    <TouchableOpacity
      style={styles.btn}
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={type === 'video' ? 'Start video call' : 'Start audio call'}
    >
      <Ionicons
        name={type === 'video' ? 'videocam-outline' : 'call-outline'}
        size={22}
        color={theme.colors.primary}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    padding: 8,
    borderRadius: theme.borderRadius.md,
  },
});
