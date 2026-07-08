import React from 'react';
import {
  FlatList,
  TouchableOpacity,
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Listing } from '../types';
import { theme } from '../context/ThemeContext';

interface Props {
  listings: Listing[];
  loading?: boolean;
  onPress: (listing: Listing) => void;
  onEndReached?: () => void;
  refreshing?: boolean;
  onRefresh?: () => void;
}

function ListingCard({ listing, onPress }: { listing: Listing; onPress: () => void }) {
  const imageUri = listing.images[0];
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      {imageUri ? (
        <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />
      ) : (
        <View style={[styles.image, styles.imagePlaceholder]}>
          <Text style={styles.imagePlaceholderText}>🛍️</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{listing.title}</Text>
        <Text style={styles.price}>
          {listing.currency} {listing.price.toFixed(2)}
        </Text>
        <Text style={styles.seller} numberOfLines={1}>by {listing.seller.name}</Text>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{listing.category}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export function ListingFlatList({
  listings,
  loading = false,
  onPress,
  onEndReached,
  refreshing = false,
  onRefresh,
}: Props) {
  return (
    <FlatList
      data={listings}
      keyExtractor={(item) => item.id}
      numColumns={2}
      columnWrapperStyle={styles.row}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <ListingCard listing={item} onPress={() => onPress(item)} />
      )}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.4}
      refreshing={refreshing}
      onRefresh={onRefresh}
      ListEmptyComponent={
        loading ? null : (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No listings found</Text>
          </View>
        )
      }
      ListFooterComponent={loading ? <ActivityIndicator color={theme.colors.primary} style={{ margin: 16 }} /> : null}
    />
  );
}

const styles = StyleSheet.create({
  list: {
    padding: theme.spacing.sm,
    paddingBottom: theme.spacing.xl,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: theme.spacing.sm,
  },
  card: {
    width: '48.5%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  image: {
    width: '100%',
    height: 140,
  },
  imagePlaceholder: {
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  imagePlaceholderText: {
    fontSize: 40,
  },
  info: {
    padding: theme.spacing.sm,
  },
  title: {
    fontSize: theme.typography.sm,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: 4,
  },
  price: {
    fontSize: theme.typography.base,
    fontWeight: '700',
    color: theme.colors.primary,
    marginBottom: 2,
  },
  seller: {
    fontSize: theme.typography.xs,
    color: theme.colors.textSecondary,
    marginBottom: 6,
  },
  categoryBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.borderRadius.sm,
    alignSelf: 'flex-start',
  },
  categoryText: {
    fontSize: theme.typography.xs,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  empty: {
    alignItems: 'center',
    paddingTop: 60,
  },
  emptyText: {
    fontSize: theme.typography.base,
    color: theme.colors.textMuted,
  },
});
