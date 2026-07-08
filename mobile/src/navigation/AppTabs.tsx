import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';

import { FeedScreen } from '../screens/FeedScreen';
import { ListingDetailScreen } from '../screens/ListingDetailScreen';
import { ConversationListScreen } from '../screens/ConversationListScreen';
import { ConversationThreadScreen } from '../screens/ConversationThreadScreen';
import { CreateListingScreen } from '../screens/CreateListingScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { AdminDashboardScreen } from '../screens/AdminDashboardScreen';

import { useAuth } from '../context/AuthContext';
import { theme } from '../context/ThemeContext';

import {
  AppTabsParamList,
  FeedStackParamList,
  MessagesStackParamList,
  SellStackParamList,
  ProfileStackParamList,
  AdminStackParamList,
} from './types';

const Tab = createBottomTabNavigator<AppTabsParamList>();
const FeedStack = createNativeStackNavigator<FeedStackParamList>();
const MsgStack = createNativeStackNavigator<MessagesStackParamList>();
const SellStack = createNativeStackNavigator<SellStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();
const AdminStack = createNativeStackNavigator<AdminStackParamList>();

const stackScreenOpts = {
  headerStyle: { backgroundColor: theme.colors.surface },
  headerTintColor: theme.colors.primary,
  headerTitleStyle: { fontWeight: '600' as const },
  contentStyle: { backgroundColor: theme.colors.background },
};

function FeedNavigator() {
  return (
    <FeedStack.Navigator screenOptions={stackScreenOpts}>
      <FeedStack.Screen name="Feed" component={FeedScreen} options={{ title: 'Marketplace' }} />
      <FeedStack.Screen name="ListingDetail" component={ListingDetailScreen} options={{ title: 'Listing' }} />
      <FeedStack.Screen name="ConversationThread" component={ConversationThreadScreen} options={{ title: 'Chat' }} />
    </FeedStack.Navigator>
  );
}

function MessagesNavigator() {
  return (
    <MsgStack.Navigator screenOptions={stackScreenOpts}>
      <MsgStack.Screen name="ConversationList" component={ConversationListScreen} options={{ title: 'Messages' }} />
      <MsgStack.Screen name="ConversationThread" component={ConversationThreadScreen} options={{ title: 'Chat' }} />
    </MsgStack.Navigator>
  );
}

function SellNavigator() {
  return (
    <SellStack.Navigator screenOptions={stackScreenOpts}>
      <SellStack.Screen name="CreateListing" component={CreateListingScreen} options={{ title: 'New Listing' }} />
    </SellStack.Navigator>
  );
}

function ProfileNavigator() {
  return (
    <ProfileStack.Navigator screenOptions={stackScreenOpts}>
      <ProfileStack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
    </ProfileStack.Navigator>
  );
}

function AdminNavigator() {
  return (
    <AdminStack.Navigator screenOptions={stackScreenOpts}>
      <AdminStack.Screen name="AdminDashboard" component={AdminDashboardScreen} options={{ title: 'Admin' }} />
    </AdminStack.Navigator>
  );
}

export function AppTabs() {
  const { user } = useAuth();
  const isSeller = user?.role === 'seller' || user?.role === 'admin';
  const isAdminOrMod = user?.role === 'admin' || user?.role === 'moderator';

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
        tabBarIcon: ({ color, size }) => {
          const icons: Record<string, string> = {
            MarketplaceTab: 'storefront-outline',
            MessagesTab: 'chatbubbles-outline',
            SellTab: 'add-circle-outline',
            ProfileTab: 'person-outline',
            AdminTab: 'shield-checkmark-outline',
          };
          return <Ionicons name={icons[route.name] as any} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="MarketplaceTab"
        component={FeedNavigator}
        options={{ title: 'Marketplace' }}
      />
      <Tab.Screen
        name="MessagesTab"
        component={MessagesNavigator}
        options={{ title: 'Messages' }}
      />
      {isSeller && (
        <Tab.Screen
          name="SellTab"
          component={SellNavigator}
          options={{ title: 'Sell' }}
        />
      )}
      <Tab.Screen
        name="ProfileTab"
        component={ProfileNavigator}
        options={{ title: 'Profile' }}
      />
      {isAdminOrMod && (
        <Tab.Screen
          name="AdminTab"
          component={AdminNavigator}
          options={{ title: 'Admin' }}
        />
      )}
    </Tab.Navigator>
  );
}
