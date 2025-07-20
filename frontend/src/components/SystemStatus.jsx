import React from 'react';
import '../styles/variables.css'; // Component-specific styles

/**
 * SystemStatus Component
 * Displays the current operational status of the Telegram bot and the local LLM server,
 * along with the count of active conversations.
 *
 * @param {object} props - Component props.
 * @param {object} props.status - An object containing status information.
 * @param {boolean} props.status.botOnline - True if the Telegram bot is online.
 * @param {boolean} props.status.llmOnline - True if the LLM server is online.
 * @param {number} props.status.activeUsers - The number of currently active conversations.
 */
function SystemStatus({ status }) {
  return (
    <div className="system-status-card">
      <h3 className="status-title">System Status</h3>
      <div className="status-item">
        <span className="status-label">Telegram Bot:</span>
        {/* Status dot changes color based on botOnline status */}
        <span className={`status-dot ${status.botOnline ? 'online' : 'offline'}`} aria-label={`Telegram Bot is ${status.botOnline ? 'Online' : 'Offline'}`}></span>
        {/* Text indicating bot status */}
        <span className="status-text">{status.botOnline ? 'Online' : 'Offline'}</span>
      </div>
      <div className="status-item">
        <span className="status-label">LLM Server:</span>
        {/* Status dot changes color based on llmOnline status */}
        <span className={`status-dot ${status.llmOnline ? 'online' : 'offline'}`} aria-label={`LLM Server is ${status.llmOnline ? 'Online' : 'Offline'}`}></span>
        {/* Text indicating LLM server status */}
        <span className="status-text">{status.llmOnline ? 'Online' : 'Offline'}</span>
      </div>
      <div className="status-item">
        <span className="status-label">Active Conversations:</span>
        {/* Display the count of active conversations */}
        <span className="status-value">{status.activeUsers}</span>
      </div>
    </div>
  );
}

export default SystemStatus;
