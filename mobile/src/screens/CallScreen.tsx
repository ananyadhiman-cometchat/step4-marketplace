import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../context/ThemeContext';

interface Props {
  calleeName?: string;
  callType?: 'audio' | 'video';
  onEnd?: () => void;
}

export function CallScreen({
  calleeName = 'Unknown',
  callType = 'audio',
  onEnd,
}: Props) {
  const [muted, setMuted] = useState(false);
  const [speakerOn, setSpeakerOn] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.callType}>
          {callType === 'video' ? '📹 Video Call' : '📞 Voice Call'}
        </Text>
        <Text style={styles.calleeName}>{calleeName}</Text>
        <Text style={styles.status}>Connecting…</Text>
      </View>

      <View style={styles.controls}>
        <TouchableOpacity
          style={[styles.controlBtn, muted && styles.controlBtnActive]}
          onPress={() => setMuted((m) => !m)}
          accessibilityRole="button"
          accessibilityLabel={muted ? 'Unmute' : 'Mute'}
        >
          <Ionicons
            name={muted ? 'mic-off' : 'mic'}
            size={26}
            color={muted ? theme.colors.error : '#fff'}
          />
          <Text style={styles.controlLabel}>{muted ? 'Unmute' : 'Mute'}</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.endBtn]}
          onPress={onEnd}
          accessibilityRole="button"
          accessibilityLabel="End call"
        >
          <Ionicons name="call" size={30} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlBtn, speakerOn && styles.controlBtnActive]}
          onPress={() => setSpeakerOn((s) => !s)}
          accessibilityRole="button"
          accessibilityLabel={speakerOn ? 'Speaker off' : 'Speaker on'}
        >
          <Ionicons
            name={speakerOn ? 'volume-high' : 'volume-medium'}
            size={26}
            color={speakerOn ? theme.colors.secondary : '#fff'}
          />
          <Text style={styles.controlLabel}>{speakerOn ? 'Speaker' : 'Earpiece'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2937',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 80,
  },
  header: {
    alignItems: 'center',
  },
  callType: {
    fontSize: theme.typography.sm,
    color: 'rgba(255,255,255,0.6)',
    marginBottom: theme.spacing.md,
  },
  calleeName: {
    fontSize: theme.typography.xxl + 4,
    fontWeight: '700',
    color: '#fff',
    marginBottom: theme.spacing.sm,
  },
  status: {
    fontSize: theme.typography.base,
    color: 'rgba(255,255,255,0.6)',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xl,
  },
  controlBtn: {
    alignItems: 'center',
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    gap: 4,
  },
  controlBtnActive: {
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  controlLabel: {
    fontSize: theme.typography.xs,
    color: '#fff',
  },
  endBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.colors.error,
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ rotate: '135deg' }],
  },
});
