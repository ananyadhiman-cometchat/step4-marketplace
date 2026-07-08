import React, { useCallback, useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Listing } from '../types';
import { getListings } from '../api/listings';
import { ListingFlatList } from '../components/ListingFlatList';
import { CategoryChips } from '../components/CategoryChips';
import { SearchInput } from '../components/SearchInput';
import { theme } from '../context/ThemeContext';
import { FeedStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<FeedStackParamList, 'Feed'>;

export function FeedScreen({ navigation }: Props) {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');

  const fetchListings = useCallback(
    async (nextPage: number, replace: boolean) => {
      try {
        const filters: Record<string, string | number> = {
          page: nextPage,
          limit: 20,
          status: 'active',
        };
        if (category !== 'All') filters.category = category;

        const res = await getListings(filters);
        const fetched = res.data;
        setListings((prev) => (replace ? fetched : [...prev, ...fetched]));
        setHasMore(nextPage * 20 < res.pagination.total);
        setPage(nextPage);
      } catch {
        // silently ignore — show empty state
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [category]
  );

  useEffect(() => {
    setLoading(true);
    setListings([]);
    fetchListings(1, true);
  }, [fetchListings]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchListings(1, true);
  };

  const handleEndReached = () => {
    if (!loading && hasMore) {
      fetchListings(page + 1, false);
    }
  };

  const filtered = search.trim()
    ? listings.filter(
        (l) =>
          l.title.toLowerCase().includes(search.toLowerCase()) ||
          l.category.toLowerCase().includes(search.toLowerCase())
      )
    : listings;

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <SearchInput value={search} onChangeText={setSearch} />
      </View>
      <CategoryChips selected={category} onSelect={(c) => setCategory(c)} />
      <ListingFlatList
        listings={filtered}
        loading={loading}
        onPress={(listing) => navigation.navigate('ListingDetail', { listingId: listing.id })}
        onEndReached={handleEndReached}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchBar: {
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
});
