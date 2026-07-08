## Marketplace (mkt) — mobile

skills: variant: chose cometchat-native-expo-patterns want cometchat-native-calls (calls skill not triggered automatically; implemented via CometChat.initiateCall SDK API + CometChatOngoingCall UI Kit component)
docsEscape: CometChatCallButtons prop signatures not in docs-mcp for RN v5; read source types directly from node_modules to find AuxiliaryButtonView, SendButtonView, and callSettingsBuilder APIs
staleness: cometchat-native-core documents initFromSettings as GA in >=5.3.8; used flat init() form for safety since initFromSettings type availability could not be verified without a running build
coverageGap: "CometChatMessageComposer does not expose testID on internal TextInput or send button — Maestro steps cometchat-message-input and cometchat-send-button will fail until CometChat exposes those IDs or native test uses type-based selectors"

## Marketplace (mkt) — backend

skills: missedTrigger: Python/FastAPI — no Python-specific skill exists; cometchat-production (Node/TS patterns) was adapted to httpx + async FastAPI manually.
docsEscape: Python REST API client for CometChat — had to translate Node.js fetch patterns to async httpx; no Python recipe in the docs MCP.

## Marketplace (mkt) — web

skills: hallucination: CometChatConversationsWithMessages — does not exist in @cometchat/chat-uikit-react@6.5.3; used CometChatConversations + CometChatMessageHeader + CometChatMessageList + CometChatMessageComposer split panel instead (per cometchat-nextjs-patterns §5 pattern).
staleness: cometchat-nextjs-patterns skill references force-dynamic requirement verified on Next 16.2.9 vs actual project running Next 14.2.5 — applied defensively.
