import { create } from 'zustand';
import { ws, type SocketMessage } from '../lib/ws';

// ─── Types ────────────────────────────────────────────────────────────────────

export type ChatMessage = {
  id: string;           // UUIDv7
  conversationId: string;
  senderId: string;
  content: string;
  sentAt: string;       // ISO timestamp — displayed in JetBrains Mono
  readAt: string | null;
};

export type Conversation = {
  id: string;           // UUIDv7
  participantIds: string[];
  lastMessage: ChatMessage | null;
  unreadCount: number;
};

type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error';

// ─── Store ────────────────────────────────────────────────────────────────────
//
// Architectural rule: The WS connection lives HERE, not in any screen.
// Screens subscribe to this store via useShallow selectors.
// Navigation between tabs must NOT cause the socket to disconnect.

type ChatState = {
  connectionStatus: ConnectionStatus;
  // Live messages keyed by conversationId — populated by incoming WS events
  liveMessages: Record<string, ChatMessage[]>;

  /** Connect the WS. Call once after auth — usually from the root layout. */
  connectSocket: (accessToken: string) => void;

  /** Disconnect. Call on sign-out only. */
  disconnectSocket: () => void;

  /** Append an incoming live message to the correct conversation bucket. */
  receiveMessage: (message: ChatMessage) => void;

  /** Clear live message cache for a conversation (on tab unmount cleanup). */
  clearLiveMessages: (conversationId: string) => void;
};

export const useChatStore = create<ChatState>((set, get) => {
  // Internal WS event handler — registered once on connect
  let unsubscribeMessage: (() => void) | null = null;
  let unsubscribeStatus: (() => void) | null = null;

  return {
    connectionStatus: 'disconnected',
    liveMessages: {},

    connectSocket: (accessToken: string) => {
      set({ connectionStatus: 'connecting' });

      // Subscribe to status changes
      unsubscribeStatus = ws.onStatus((connected) => {
        set({ connectionStatus: connected ? 'connected' : 'disconnected' });
      });

      // Subscribe to incoming messages
      unsubscribeMessage = ws.onMessage((event: SocketMessage) => {
        if (event.type === 'message:new') {
          const msg = event.payload as ChatMessage;
          get().receiveMessage(msg);
        }
      });

      ws.connect(accessToken);
    },

    disconnectSocket: () => {
      unsubscribeMessage?.();
      unsubscribeStatus?.();
      ws.disconnect();
      set({ connectionStatus: 'disconnected', liveMessages: {} });
    },

    receiveMessage: (message: ChatMessage) => {
      set((state) => ({
        liveMessages: {
          ...state.liveMessages,
          [message.conversationId]: [
            ...(state.liveMessages[message.conversationId] ?? []),
            message,
          ],
        },
      }));
    },

    clearLiveMessages: (conversationId: string) => {
      set((state) => {
        const updated = { ...state.liveMessages };
        delete updated[conversationId];
        return { liveMessages: updated };
      });
    },
  };
});
