import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Listing } from '../types';
import { getListing } from '../api/listings';
import { createConversation } from '../api/conversations';
import { ImageCarousel } from '../components/ImageCarousel';
import { PriceLabel } from '../components/PriceLabel';
import { SellerRow } from '../components/SellerRow';
import { ContactFAB } from '../components/ContactFAB';
import { theme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { FeedStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<FeedStackParamList, 'ListingDetail'>;

export function ListingDetailScreen({ route, navigation }: Props) {
  const { listingId } = route.params;
  const { user } = useAuth();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [contacting, setContacting] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await getListing(listingId);
        setListing(data);
      } catch {
        Alert.alert('Error', 'Could not load listing.');
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    })();
  }, [listingId]);

  const handleContact = async () => {
    if (!listing) return;
    setContacting(true);
    try {
      const conv = await createConversation(listing.id);
      navigation.navigate('ConversationThread', { conversationId: conv.id });
    } catch (err: any) {
      const msg = err?.response?.data?.detail || 'Could not start conversation.';
      Alert.alert('Error', msg);
    } finally {
      setContacting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (!listing) return null;

  const canContact =
    user?.role === 'buyer' && listing.seller.uid !== user.uid;

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <ImageCarousel images={listing.images} />

        <View style={styles.body}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>{listing.title}</Text>
            <View style={[
              styles.statusBadge,
              listing.status === 'active' ? styles.statusActive : styles.statusSold,
            ]}>
              <Text style={styles.statusText}>{listing.status.toUpperCase()}</Text>
            </View>
          </View>

          <PriceLabel price={listing.price} currency={listing.currency} size="lg" />

          <View style={styles.categoryRow}>
            <Text style={styles.categoryLabel}>{listing.category}</Text>
          </View>

          {listing.description ? (
            <Text style={styles.description}>{listing.description}</Text>
          ) : null}

          <SellerRow seller={listing.seller} />
        </View>
      </ScrollView>

      {canContact && (
        <ContactFAB onPress={handleContact} loading={contacting} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    paddingBottom: 100,
  },
  body: {
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    fontSize: theme.typography.xl,
    fontWeight: '700',
    color: theme.colors.text,
    marginRight: theme.spacing.sm,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.borderRadius.sm,
  },
  statusActive: {
    backgroundColor: '#D1FAE5',
  },
  statusSold: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: theme.typography.xs,
    fontWeight: '600',
  },
  categoryRow: {
    flexDirection: 'row',
  },
  categoryLabel: {
    fontSize: theme.typography.sm,
    color: theme.colors.primary,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.sm,
    fontWeight: '500',
  },
  description: {
    fontSize: theme.typography.base,
    color: theme.colors.textSecondary,
    lineHeight: 24,
  },
});
