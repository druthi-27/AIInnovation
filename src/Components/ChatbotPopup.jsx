import React, { useState, useRef, useEffect } from "react";
import annaGuideAvatar from "../assets/anna-guide.png";
import './ChatbotPopup.css';

const BOT_NAME = "Anna, your guide";
const BOT_AVATAR = annaGuideAvatar;

const initialBotMessage = {
  sender: "bot",
  text: "Hello! How can I help you today?",
  timestamp: new Date(),
};

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

const ChatbotPopup = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [conversation, setConversation] = useState([initialBotMessage]);
  const [listening, setListening] = useState(false);
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Scroll to bottom when conversation updates
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversation, open]);

  // Send message handler
  const handleSend = () => {
    if (message.trim()) {
      const userMsg = {
        sender: "user",
        text: message,
        timestamp: new Date(),
      };
      setConversation((prev) => [...prev, userMsg]);
      setMessage("");

      // Simulate bot response after a short delay
      setTimeout(() => {
        setConversation((prev) => [
          ...prev,
          {
            sender: "bot",
            text: "I'm here to assist you! (This is a demo response.)",
            timestamp: new Date(),
          },
        ]);
      }, 800);
    }
  };

  // Mic handler with speech-to-text using ref
  const handleMic = () => {
    if (!SpeechRecognition) {
      alert("Sorry, your browser does not support speech recognition.");
      return;
    }

    // If already listening, stop
    if (recognitionRef.current && listening) {
      recognitionRef.current.stop();
      return;
    }

    // Create recognition instance if not already created
    if (!recognitionRef.current) {
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setMessage((prev) => (prev ? prev + " " : "") + transcript);
      };

      recognition.onerror = (event) => {
        // Only alert if not aborted by user
        if (event.error !== "aborted") {
          alert("Speech recognition error: " + event.error);
        }
        setListening(false);
      };

      recognition.onend = () => {
        setListening(false);
      };

      recognitionRef.current = recognition;
    }

    // Start recognition
    try {
      recognitionRef.current.start();
      setListening(true);
    } catch (e) {
      // If recognition is already started, ignore
    }
  };

  // Stop recognition on unmount or when closing popup
  useEffect(() => {
    if (!open && recognitionRef.current && listening) {
      recognitionRef.current.stop();
    }
    // Cleanup on unmount
    return () => {
      if (recognitionRef.current && listening) {
        recognitionRef.current.stop();
      }
    };
    // eslint-disable-next-line
  }, [open]);

  // Allow Enter key to send message
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Clear conversation handler
  const handleClear = () => {
    setConversation([
      {
        ...initialBotMessage,
        timestamp: new Date(),
      },
    ]);
  };

  return (
    <>
      {/* Floating Chatbot Icon */}
      <button
        className="chatbot-popup-btn"
        onClick={() => setOpen(true)}
        aria-label="Open Chatbot"
        tabIndex={0}
      >
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
          <circle cx="20" cy="20" r="20" fill="#1976d2" />
          <ellipse cx="20" cy="23" rx="13" ry="8" fill="#fff" />
          <circle cx="16" cy="22" r="2" fill="#1976d2" />
          <circle cx="24" cy="22" r="2" fill="#1976d2" />
          <rect x="18" y="27" width="4" height="2" rx="1" fill="#1976d2" />
        </svg>
      </button>

      {/* Popup Modal */}
      {open && (
        <div className="chatbot-popup-modal">
          <div className="chatbot-popup-content">
            {/* Header Row: Guide Info (center), Close (right) */}
            <div className="chatbot-popup-header-row">
              <div className="chatbot-guide-header">
                <img
                  src={BOT_AVATAR}
                  alt={BOT_NAME}
                  className="chatbot-guide-avatar"
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: "50%",
                    marginRight: 16,
                    objectFit: "cover",
                    background: "#fff3e0",
                    border: "2px solid #1976d2",
                  }}
                />
                <div>
                  <div className="chatbot-guide-name" style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
                    {BOT_NAME}
                  </div>
                  <div className="chatbot-guide-role" style={{ fontSize: "1rem", color: "#888" }}>
                    I am here to help you with everything.
                  </div>
                </div>
              </div>
              <button
                className="chatbot-popup-close"
                onClick={() => setOpen(false)}
                aria-label="Close Chatbot"
                tabIndex={0}
              >
                ×
              </button>
            </div>
            {/* Conversation Area */}
            <div className="chatbot-conversation-area">
              {conversation.map((msg, idx) => (
                <div
                  key={idx}
                  className={`chatbot-message-row ${msg.sender === "user" ? "user" : "bot"}`}
                >
                  {msg.sender === "bot" && (
                    <img
                      src={BOT_AVATAR}
                      alt={BOT_NAME}
                      className="chatbot-message-avatar"
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: "50%",
                        marginRight: 8,
                        objectFit: "cover",
                        background: "#fff3e0",
                        border: "1px solid #1976d2",
                      }}
                    />
                  )}
                  <div className="chatbot-message-bubble">
                    {msg.text}
                    <span className="chatbot-message-time">
                      {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  {msg.sender === "user" && (
                    <div style={{ width: 32, marginLeft: 8 }} /> // Placeholder for alignment
                  )}
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
            {/* Clear Button just above input */}
            <div className="chatbot-clear-btn-row">
              <button
                className="chatbot-popup-clear"
                onClick={handleClear}
                aria-label="Clear Chat"
                tabIndex={0}
                type="button"
              >
                Clear Chat
              </button>
            </div>
            {/* Chat input area */}
            <div className="chatbot-input-row">
              <button
                className="chatbot-mic-btn"
                onClick={handleMic}
                aria-label="Voice input"
                type="button"
                style={listening ? { background: "#e3f2fd" } : {}}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect x="9" y="2" width="6" height="12" rx="3" fill="#1976d2" />
                  <path d="M5 10v2a7 7 0 0 0 14 0v-2" stroke="#1976d2" strokeWidth="2" fill="none" />
                  <line x1="12" y1="22" x2="12" y2="19" stroke="#1976d2" strokeWidth="2" />
                  <line x1="8" y1="22" x2="16" y2="22" stroke="#1976d2" strokeWidth="2" />
                </svg>
              </button>
              <input
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
                className="chatbot-input"
                style={{
                  flex: 1,
                  padding: "10px",
                  border: "none",
                  outline: "none",
                  fontSize: "1.1rem",
                  background: "transparent",
                }}
                autoFocus
              />
              <button
                className="chatbot-send-btn"
                onClick={handleSend}
                aria-label="Send message"
                type="button"
                disabled={!message.trim()}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M2 21l21-9-21-9v7l15 2-15 2z" fill="#1976d2" />
                </svg>
              </button>
            </div>
            {/* Optional: Show listening status */}
            {listening && (
              <div style={{ textAlign: "center", color: "#1976d2", fontSize: "0.95rem", marginTop: 4 }}>
                Listening...
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default ChatbotPopup;