import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { theme } from '../context/ThemeContext';

interface Props {
  price: number;
  currency?: string;
  size?: 'sm' | 'lg';
}

export function PriceLabel({ price, currency = 'USD', size = 'lg' }: Props) {
  return (
    <Text style={[styles.price, size === 'lg' ? styles.large : styles.small]}>
      {currency} {price.toFixed(2)}
    </Text>
  );
}

const styles = StyleSheet.create({
  price: {
    fontWeight: '700',
    color: theme.colors.primary,
  },
  large: {
    fontSize: theme.typography.xxl,
  },
  small: {
    fontSize: theme.typography.base,
  },
});
