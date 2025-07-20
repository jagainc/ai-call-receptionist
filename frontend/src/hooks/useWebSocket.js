import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom React Hook for advanced WebSocket communication.
 * Manages the WebSocket connection lifecycle, including:
 * - Automatic reconnection with exponential backoff.
 * - Heartbeat (ping/pong) mechanism to detect and prevent idle connection drops.
 * - Message queuing for messages sent before connection is established.
 * - Configurable options for fine-tuning behavior.
 *
 * @param {string} url - The WebSocket URL to connect to (e.g., 'ws://localhost:8080/ws/admin').
 * @param {object} [options] - Configuration options for the WebSocket.
 * @param {number} [options.reconnectIntervalBase=1000] - Base time in ms for exponential backoff.
 * @param {number} [options.maxReconnectAttempts=10] - Maximum number of reconnection attempts.
 * @param {number} [options.pingInterval=30000] - Interval in ms to send ping messages (heartbeat).
 * @param {number} [options.pongTimeout=5000] - Timeout in ms to wait for a pong response after ping.
 * @returns {object} An object containing:
 * - lastMessage: The last message received from the WebSocket.
 * - sendMessage: A function to send messages via the WebSocket.
 * - readyState: The current ready state of the WebSocket connection (e.g., WebSocket.OPEN).
 * - WebSocket: The WebSocket constructor itself, useful for checking readyState constants.
 * - reconnectAttempts: Current count of reconnection attempts.
 */
const useWebSocket = (url, options = {}) => {
  const {
    reconnectIntervalBase = 1000, // 1 second
    maxReconnectAttempts = 10,
    pingInterval = 30000, // 30 seconds
    pongTimeout = 5000, // 5 seconds
  } = options;

  const [readyState, setReadyState] = useState(WebSocket.CLOSED);
  const [lastMessage, setLastMessage] = useState(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);

  const ws = useRef(null);
  const messageQueue = useRef([]);
  const isMounted = useRef(true);
  const pingIntervalId = useRef(null); // Ref for heartbeat ping interval
  const pongTimeoutId = useRef(null); // Ref for heartbeat pong timeout

  // Function to send messages via WebSocket
  const sendMessage = useCallback((message) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(message);
    } else {
      messageQueue.current.push(message);
      console.warn('WebSocket not open, message queued:', message);
    }
  }, []);

  // --- Heartbeat Mechanism ---
  const startHeartbeat = useCallback(() => {
    // Clear any existing heartbeat to prevent duplicates
    stopHeartbeat();

    pingIntervalId.current = setInterval(() => {
      if (ws.current && ws.current.readyState === WebSocket.OPEN) {
        // Send a ping message (e.g., a simple string or a specific JSON structure)
        // For STOMP, a "heart-beat" frame is usually handled by the client library,
        // but for raw WS, a custom ping can be useful.
        ws.current.send('ping'); // Or JSON.stringify({ type: 'PING' })
        console.log('WebSocket: Sent ping.');

        // Set a timeout to close connection if no pong/response is received
        pongTimeoutId.current = setTimeout(() => {
          console.warn('WebSocket: Pong timeout. Closing connection.');
          ws.current?.close(); // This will trigger onclose and reconnection logic
        }, pongTimeout);
      }
    }, pingInterval);
  }, [pingInterval, pongTimeout]);

  const stopHeartbeat = useCallback(() => {
    if (pingIntervalId.current) {
      clearInterval(pingIntervalId.current);
      pingIntervalId.current = null;
    }
    if (pongTimeoutId.current) {
      clearTimeout(pongTimeoutId.current);
      pongTimeoutId.current = null;
    }
  }, []);

  // --- Connection Logic ---
  const connect = useCallback(() => {
    // Prevent multiple connection attempts
    if (ws.current && (ws.current.readyState === WebSocket.CONNECTING || ws.current.readyState === WebSocket.OPEN)) {
      return;
    }

    // Close any lingering connection
    if (ws.current) {
      ws.current.close();
    }

    // Exponential backoff calculation
    const delay = Math.min(reconnectIntervalBase * Math.pow(2, reconnectAttempts), 30000); // Max 30 seconds delay
    console.log(`WebSocket: Attempting to connect... (Attempt ${reconnectAttempts + 1}, next retry in ${delay / 1000}s)`);

    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      if (isMounted.current) {
        setReadyState(WebSocket.OPEN);
        setReconnectAttempts(0); // Reset attempts on successful connection
        console.log('WebSocket connected successfully.');
        startHeartbeat(); // Start heartbeat
      }
      // Send any queued messages
      while (messageQueue.current.length > 0) {
        ws.current.send(messageQueue.current.shift());
      }
    };

    ws.current.onmessage = (event) => {
      if (isMounted.current) {
        setLastMessage(event);
      }
      // If a pong message is expected and received, clear the timeout
      if (pongTimeoutId.current) {
        clearTimeout(pongTimeoutId.current);
        pongTimeoutId.current = null;
      }
      // You might also reset pongTimeoutId here if *any* message from server counts as "alive"
    };

    ws.current.onclose = (event) => {
      if (isMounted.current) {
        setReadyState(WebSocket.CLOSED);
        console.log('WebSocket closed:', event.code, event.reason);
        stopHeartbeat(); // Stop heartbeat on close
      }
      // Attempt to reconnect if not explicitly closed by user and max attempts not reached
      if (isMounted.current && reconnectAttempts < maxReconnectAttempts) {
        setReconnectAttempts(prev => prev + 1);
        const nextDelay = Math.min(reconnectIntervalBase * Math.pow(2, reconnectAttempts), 30000);
        setTimeout(connect, nextDelay);
      } else if (isMounted.current) {
        console.error('WebSocket: Max reconnection attempts reached. Giving up.');
        // Optionally, notify consuming component or user here that connection failed permanently
      }
    };

    ws.current.onerror = (error) => {
      console.error('WebSocket error:', error);
      // Errors typically lead to a close event, so onclose will handle reconnection logic
      ws.current?.close();
    };
  }, [url, reconnectIntervalBase, maxReconnectAttempts, reconnectAttempts, startHeartbeat, stopHeartbeat]);

  // Main effect hook for component lifecycle
  useEffect(() => {
    isMounted.current = true; // Mark component as mounted
    connect(); // Initiate the first connection attempt

    // Cleanup function: runs when the component unmounts
    return () => {
      isMounted.current = false; // Mark component as unmounted
      stopHeartbeat(); // Ensure heartbeat is stopped
      if (ws.current) {
        console.log('Cleaning up WebSocket connection on unmount.');
        ws.current.close(); // Close the WebSocket connection
      }
    };
  }, [connect]); // Reconnect if 'connect' function changes (due to its dependencies)

  return { lastMessage, sendMessage, readyState, WebSocket, reconnectAttempts };
};

export default useWebSocket;
