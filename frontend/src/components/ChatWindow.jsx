import React, { useState, useRef, useEffect } from 'react';
import AppleStyleButton from './AppleStyleButton.jsx'; // Reusable button component
import '../styles/variables.css'; // Component-specific styles

/**
 * ChatWindow Component
 * Displays the detailed chat history for an active conversation and provides an input
 * area for an admin to send messages.
 *
 * @param {object} props - Component props.
 * @param {object} props.conversation - The active conversation object containing messages.
 * @param {function} props.onSendMessage - Callback function to send a message (admin intervention).
 */
function ChatWindow({ conversation, onSendMessage }) {
  const [message, setMessage] = useState(''); // State for the message input field
  const messagesEndRef = useRef(null); // Ref for auto-scrolling to the bottom of messages

  // Effect to scroll to the latest message whenever conversation messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.messages]); // Dependency on conversation.messages ensures scroll on new message

  // Handles sending a message when the "Send" button is clicked or Enter is pressed
  const handleSend = () => {
    if (message.trim()) { // Ensure message is not empty or just whitespace
      onSendMessage(conversation.id, message); // Call the parent's send function
      setMessage(''); // Clear the input field after sending
    }
  };

  // Handles key presses in the textarea for sending messages on Enter
  const handleKeyPress = (e) => {
    // Check if Enter key is pressed and Shift key is NOT pressed (to allow multiline input with Shift+Enter)
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent default Enter behavior (e.g., new line)
      handleSend(); // Send the message
    }
  };

  // If no conversation is selected, display a prompt
  if (!conversation) {
    return (
      <div className="no-conversation-selected">
        Select a conversation from the sidebar to view chat history.
      </div>
    );
  }

  return (
    <div className="chat-window">
      {/* Chat Header: Displays conversation partner's ID and active status */}
      <div className="chat-header">
        <h2>Conversation with {conversation.userId}</h2>
        {/* Status dot indicating if the conversation is active (e.g., user is online/bot is active) */}
        <span className={`status-dot ${conversation.active ? 'online' : 'offline'}`}></span>
      </div>

      {/* Messages Container: Displays all messages in the conversation */}
      <div className="messages-container">
        {conversation.messages.map((msg, index) => (
          <div
            key={msg.id || index} // Use unique message ID if available, fallback to index
            className={`message-bubble ${msg.sender === 'USER' ? 'user' : (msg.sender === 'ADMIN' ? 'admin' : 'ai')}`}
          >
            <p>{msg.text}</p>
            {/* Display message timestamp */}
            <span className="message-timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</span>
          </div>
        ))}
        {/* Empty div to act as a scroll target for auto-scrolling */}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input Area: Textarea for typing and Send button */}
      <div className="message-input-area">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)} // Update state on input change
          onKeyPress={handleKeyPress} // Handle Enter key press
          placeholder="Type a message to intervene..."
          rows="3" // Initial rows, allows vertical resize
          aria-label="Message input for admin intervention"
        ></textarea>
        {/* Apple-style Send button */}
        <AppleStyleButton onClick={handleSend} text="Send" type="primary" />
      </div>
    </div>
  );
}

export default ChatWindow;
