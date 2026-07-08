import React, { useState } from 'react';
import { View, Image, FlatList, StyleSheet, Dimensions, TouchableOpacity, Text } from 'react-native';
import { theme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

interface Props {
  images: string[];
}

export function ImageCarousel({ images }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (images.length === 0) {
    return (
      <View style={[styles.slide, styles.placeholder]}>
        <Text style={styles.placeholderIcon}>🛍️</Text>
        <Text style={styles.placeholderText}>No images</Text>
      </View>
    );
  }

  return (
    <View>
      <FlatList
        data={images}
        keyExtractor={(_, i) => String(i)}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / width);
          setActiveIndex(idx);
        }}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.slide} resizeMode="cover" />
        )}
      />
      {images.length > 1 && (
        <View style={styles.dots}>
          {images.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === activeIndex && styles.dotActive]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  slide: {
    width,
    height: 280,
    backgroundColor: '#F3F4F6',
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  placeholderText: {
    fontSize: theme.typography.sm,
    color: theme.colors.textMuted,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingVertical: theme.spacing.sm,
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.border,
  },
  dotActive: {
    backgroundColor: theme.colors.primary,
  },
});
