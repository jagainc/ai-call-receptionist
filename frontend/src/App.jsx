import React, { useState, useEffect } from 'react';
import ChatWindow from './components/ChatWindow.jsx';
import ConversationCard from './components/ConversationCard.jsx';
import SystemStatus from './components/SystemStatus.jsx';
// import AppleStyleButton from './components/AppleStyleButton.jsx'; // Removed: AppleStyleButton is used within ChatWindow.jsx, not directly in App.jsx
// import MarqueeText from './components/MarqueeText.jsx'; // MarqueeText is defined inline below
import useWebSocket from './hooks/useWebSocket.js'; // Custom WebSocket hook
import './styles/globals.css'; // Ensure global styles are imported

// Placeholder for a unique user ID for the current admin session.
// In a real application, this would come from an authentication system.
const ADMIN_USER_ID = "admin-session-123"; // Example static ID

function App() {
  const [conversations, setConversations] = useState([]);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [systemStatus, setSystemStatus] = useState({ botOnline: false, llmOnline: false, activeUsers: 0 });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State for hamburger menu/sidebar

  // WebSocket connection for real-time updates from the Spring Boot backend
  // Connects to the STOMP endpoint defined in WebSocketConfig
  const { lastMessage, sendMessage, readyState } = useWebSocket('ws://localhost:8080/ws/admin');

  useEffect(() => {
    // Function to fetch initial conversations from backend
    const fetchInitialConversations = async () => {
      try {
        const response = await fetch('/api/conversations');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setConversations(data);
        // If there are conversations, set the first one as active by default
        if (data.length > 0) {
          setActiveConversationId(data[0].id);
        }
      } catch (error) {
        console.error('Error fetching initial conversations:', error);
        // Optionally, display an error message to the user
      }
    };

    fetchInitialConversations(); // Call on component mount

    // Handle incoming WebSocket messages
    if (lastMessage !== null) {
      try {
        const data = JSON.parse(lastMessage.data);
        console.log('WebSocket message received:', data);

        // Update conversations or system status based on message type
        if (data.type === 'CONVERSATION_UPDATE' && data.payload) {
          setConversations((prevConversations) => {
            const updatedConversation = data.payload;
            const existingIndex = prevConversations.findIndex(
              (conv) => conv.id === updatedConversation.id
            );

            if (existingIndex > -1) {
              // Update existing conversation
              const newConversations = [...prevConversations];
              newConversations[existingIndex] = updatedConversation;
              // Sort to bring recently updated conversations to the top
              return newConversations.sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
            } else {
              // Add new conversation and sort
              return [updatedConversation, ...prevConversations].sort((a, b) => new Date(b.lastUpdated) - new Date(a.lastUpdated));
            }
          });
        } else if (data.type === 'STATUS_UPDATE' && data.payload) {
          setSystemStatus(data.payload);
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    }
  }, [lastMessage]); // Dependency array: re-run when lastMessage changes

  // Function to handle admin sending a message to a Telegram user
  const handleAdminIntervention = (conversationId, messageText) => {
    if (sendMessage && readyState === WebSocket.OPEN) {
      // Send message via WebSocket to the backend
      sendMessage(JSON.stringify({
        type: 'ADMIN_MESSAGE',
        conversationId: conversationId,
        message: messageText,
        senderId: ADMIN_USER_ID // Include admin's ID
      }));
      console.log(`Admin message sent for conversation ${conversationId}: ${messageText}`);
    } else {
      console.warn('WebSocket not open. Message not sent.');
      // Optionally, show a user-friendly error message
    }
  };

  // Toggle sidebar visibility for mobile (hamburger menu)
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Find the currently active conversation to pass to ChatWindow
  const currentActiveConversation = conversations.find(
    (c) => c.id === activeConversationId
  );

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>AI Receptionist Dashboard</h1>
        {/* Hamburger menu icon, visible on mobile */}
        <div className={`hamburger-menu ${isSidebarOpen ? 'open' : ''}`} onClick={toggleSidebar}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </header>

      <div className="main-content">
        {/* Sidebar for conversation list and system status */}
        <aside className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <SystemStatus status={systemStatus} />
          <h2 className="sidebar-title">Conversations</h2>
          <div className="conversation-list">
            {conversations.length > 0 ? (
              conversations.map((conv) => (
                <ConversationCard
                  key={conv.id}
                  conversation={conv}
                  isActive={conv.id === activeConversationId}
                  onClick={() => {
                    setActiveConversationId(conv.id);
                    setIsSidebarOpen(false); // Close sidebar on mobile after selection
                  }}
                />
              ))
            ) : (
              <p className="no-conversation-selected">No active conversations yet.</p>
            )}
          </div>
        </aside>

        {/* Main chat area */}
        <main className="chat-area">
          {currentActiveConversation ? (
            <ChatWindow
              conversation={currentActiveConversation}
              onSendMessage={handleAdminIntervention}
            />
          ) : (
            <div className="no-conversation-selected">
              Select a conversation from the sidebar to view chat history.
            </div>
          )}
        </main>
      </div>

      {/* Marquee running text at the bottom */}
      <MarqueeText />
    </div>
  );
}

export default App;

// MarqueeText component (can be in its own file: components/MarqueeText.jsx)
// For simplicity, included here as it's small and tightly coupled to this specific feature.
function MarqueeText() {
  const [currentMessage, setCurrentMessage] = useState('');

  // Example messages for the marquee. These could be fetched from an API.
  const messages = [
    "Jaga downloaded the app!",
    "Lekha bought a subscription!",
    "New user 'Alex' just joined the bot!",
    "AI handled 15 calls today!",
    "Support query from 'Maria' resolved!",
    "System running smoothly with 99% uptime!",
    "Bot responded in 0.5 seconds!",
    "Team meeting scheduled for tomorrow!",
    "New feature: Voice notes coming soon!",
    "Customer feedback received: 'Amazing service!'",
  ];

  useEffect(() => {
    let messageIndex = 0;
    const interval = setInterval(() => {
      setCurrentMessage(messages[messageIndex]);
      messageIndex = (messageIndex + 1) % messages.length;
    }, 5000); // Change message every 5 seconds

    // Set initial message immediately
    setCurrentMessage(messages[0]);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <footer className="marquee-footer">
      <div className="marquee-content">
        {currentMessage}
      </div>
    </footer>
  );
}
