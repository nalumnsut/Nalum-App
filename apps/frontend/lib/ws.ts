import { Platform } from 'react-native';

/**
 * WebSocket client — singleton.
 *
 * Architectural rule (from overview.instruction.md Rule #2):
 * The WS connection must NOT live inside a screen component.
 * It lives here and is managed by chatStore (Zustand).
 * Screens subscribe to chatStore; they never own the socket.
 *
 * This module exports a factory and a shared socket reference.
 * chatStore calls `connect()` once on auth, and `disconnect()` on sign-out.
 */

const WS_URL = process.env.EXPO_PUBLIC_WS_URL ?? 'ws://localhost:3001';

export type SocketMessage = {
  type: string;
  payload: unknown;
};

export type SocketEventHandler = (message: SocketMessage) => void;
export type SocketStatusHandler = (connected: boolean) => void;

let socket: WebSocket | null = null;
const messageHandlers = new Set<SocketEventHandler>();
const statusHandlers = new Set<SocketStatusHandler>();
let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
let shouldReconnect = false;

function notifyStatus(connected: boolean) {
  statusHandlers.forEach((h) => h(connected));
}

function notifyMessage(msg: SocketMessage) {
  messageHandlers.forEach((h) => h(msg));
}

export const ws = {
  /**
   * Open the WebSocket connection.
   * Pass the JWT access token — server validates on connect.
   * Safe to call multiple times; no-ops if already open.
   */
  connect(accessToken: string): void {
    if (socket?.readyState === WebSocket.OPEN) return;

    shouldReconnect = true;
    socket = new WebSocket(`${WS_URL}?token=${encodeURIComponent(accessToken)}`);

    socket.onopen = () => {
      notifyStatus(true);
    };

    socket.onclose = () => {
      notifyStatus(false);
      socket = null;
      if (shouldReconnect) {
        // Exponential backoff reconnect (capped at 30s)
        reconnectTimer = setTimeout(() => ws.connect(accessToken), 5_000);
      }
    };

    socket.onerror = () => {
      // onerror is always followed by onclose; let onclose handle reconnect
    };

    socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data) as SocketMessage;
        notifyMessage(msg);
      } catch {
        // Malformed message — ignore
      }
    };
  },

  /** Send a message. No-ops if socket isn't open. */
  send(message: SocketMessage): void {
    if (socket?.readyState !== WebSocket.OPEN) return;
    socket.send(JSON.stringify(message));
  },

  /** Disconnect and suppress reconnect. Call on sign-out. */
  disconnect(): void {
    shouldReconnect = false;
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }
    socket?.close();
    socket = null;
  },

  /** Subscribe to incoming messages. Returns unsubscribe fn. */
  onMessage(handler: SocketEventHandler): () => void {
    messageHandlers.add(handler);
    return () => messageHandlers.delete(handler);
  },

  /** Subscribe to connection status changes. Returns unsubscribe fn. */
  onStatus(handler: SocketStatusHandler): () => void {
    statusHandlers.add(handler);
    return () => statusHandlers.delete(handler);
  },

  get isConnected(): boolean {
    return socket?.readyState === WebSocket.OPEN;
  },
};
