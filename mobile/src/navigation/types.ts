export type AuthStackParamList = {
  Login: undefined;
};

export type FeedStackParamList = {
  Feed: undefined;
  ListingDetail: { listingId: string };
  ConversationThread: { conversationId: string };
};

export type MessagesStackParamList = {
  ConversationList: undefined;
  ConversationThread: { conversationId: string };
};

export type SellStackParamList = {
  CreateListing: undefined;
};

export type ProfileStackParamList = {
  Profile: undefined;
};

export type AdminStackParamList = {
  AdminDashboard: undefined;
};

export type AppTabsParamList = {
  MarketplaceTab: undefined;
  MessagesTab: undefined;
  SellTab: undefined;
  ProfileTab: undefined;
  AdminTab: undefined;
};
