import React from 'react';
import '../styles/variables.css'; // Component-specific styles

/**
 * ConversationCard Component
 * Displays a summary of a single conversation in the sidebar.
 * It shows the user ID, last message, timestamp, and an unread badge.
 *
 * @param {object} props - Component props.
 * @param {object} props.conversation - The conversation object to display.
 * @param {boolean} props.isActive - True if this card represents the currently active conversation.
 * @param {function} props.onClick - Callback function when the card is clicked.
 */
function ConversationCard({ conversation, isActive, onClick }) {
  // Determine the text of the last message for display
  const lastMessageText = conversation.messages.length > 0
    ? conversation.messages[conversation.messages.length - 1].text
    : 'No messages yet';

  // Format the last updated timestamp for display
  const formattedTimestamp = conversation.lastUpdated
    ? new Date(conversation.lastUpdated).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : ''; // Empty string if no timestamp

  return (
    <div
      className={`conversation-card ${isActive ? 'active' : ''}`} // Apply 'active' class if selected
      onClick={onClick} // Handle click to activate conversation
      role="button" // Indicate that this div is interactive
      tabIndex="0" // Make it focusable for keyboard navigation
      aria-label={`Conversation with ${conversation.userId}. Last message: ${lastMessageText}`}
    >
      <div className="card-header">
        {/* Display the user ID, or a fallback if not available */}
        <span className="user-id">User: {conversation.userId || 'Unknown User'}</span>
        {/* Display the formatted timestamp of the last update */}
        <span className="timestamp">{formattedTimestamp}</span>
      </div>
      {/* Display the last message text */}
      <p className="last-message">{lastMessageText}</p>
      {/* Unread badge, visible only if there are unread messages */}
      {conversation.unreadCount > 0 && (
        <span className="unread-badge">{conversation.unreadCount}</span>
      )}
    </div>
  );
}

export default ConversationCard;
