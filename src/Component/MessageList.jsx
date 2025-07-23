import { useEffect, useRef } from "react";

const MessageList = ({ messages, isTyping, isStreaming }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const TypingIndicator = () => (
    <div className="flex items-center space-x-2 p-4">
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
        <div
          className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
          style={{ animationDelay: "0.1s" }}
        ></div>
        <div
          className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
          style={{ animationDelay: "0.2s" }}
        ></div>
      </div>
      <span className="text-gray-400 text-sm">AI is thinking...</span>
    </div>
  );

  const MessageBubble = ({ message }) => {
    const isUser = message.role === "user";

    return (
      <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
        <div
          className={`flex max-w-3xl ${
            isUser ? "flex-row-reverse" : "flex-row"
          } items-start space-x-3`}
        >
          <div
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium ${
              isUser ? "bg-blue-600 ml-3" : "bg-green-600 mr-3"
            }`}
          >
            {isUser ? "U" : "AI"}
          </div>

          <div
            className={`rounded-lg px-4 py-2 max-w-full ${
              isUser
                ? "bg-blue-600 text-white"
                : message.error
                ? "bg-red-900 text-red-100"
                : "bg-gray-700 text-gray-100"
            }`}
          >
            <div className="whitespace-pre-wrap break-words">
              {message.content}
              {message.streaming && (
                <span className="inline-block w-2 h-5 bg-gray-400 ml-1 animate-pulse"></span>
              )}
            </div>
            <div
              className={`text-xs mt-2 opacity-70 ${
                isUser ? "text-blue-100" : "text-gray-400"
              }`}
            >
              {formatTime(message.createdAt)}
              {message.streaming && " • Streaming..."}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex-1 overflow-y-auto custom-chatbox p-4 bg-gray-800">
      {messages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center h-full">
          <div className="text-center text-gray-400">
            <div className="text-6xl mb-4">💬</div>
            <h2 className="text-xl font-semibold mb-2">Start a conversation</h2>
            <p>Send a message to begin chatting with the AI</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((message, index) => (
            <MessageBubble key={message.id || index} message={message} />
          ))}

          {isTyping && <TypingIndicator />}

          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
};

export default MessageList;
