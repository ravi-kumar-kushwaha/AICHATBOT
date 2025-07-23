import { useState, useRef, useEffect } from "react";

const MessageInput = ({ onSendMessage, isStreaming, onStop }) => {
  const [message, setMessage] = useState("");
  const [isComposing, setIsComposing] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + "px";
    }
  }, [message]);

  useEffect(() => {
    if (!isStreaming && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [isStreaming]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isStreaming && !isComposing) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey && !isComposing) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };

  return (
    <div className="border-t border-gray-700 bg-gray-800 p-4">
      <form onSubmit={handleSubmit} className="flex items-end space-x-4">
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={handleCompositionEnd}
            placeholder="Ask anything..."
            disabled={isStreaming}
            className="w-full text-2xl resize-none rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 px-4 py-3 pr-12 min-h-[52px] max-h-[200px] scrollbar-thin scrollbar-track-gray-700 scrollbar-thumb-gray-500"
            rows={1}
          />

          {message.length > 0 && (
            <div className="absolute bottom-1 right-12 text-xs text-gray-500">
              {message.length}
            </div>
          )}
        </div>

        {isStreaming ? (
          <button
            type="button"
            onClick={onStop}
            className="flex items-center justify-center w-12 h-12 rounded-lg bg-red-600 text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors"
            title="Stop generation (Esc)"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        ) : (
          <button
            type="submit"
            disabled={!message.trim() || isComposing}
            className="flex items-center justify-center w-12 h-12 rounded-lg bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
            title="Send message (Enter)"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
              />
            </svg>
          </button>
        )}
      </form>

      <div className="mt-2 text-xs text-gray-500 flex justify-between items-center">
        <span>
          {isStreaming ? (
            <>
              <span className="text-yellow-400">●</span> AI is responding...
              Press Esc to stop
            </>
          ) : (
            "Enter to send, Shift+Enter for new line"
          )}
        </span>

        {message.trim() && !isStreaming && (
          <span className="text-green-400">Ready to send</span>
        )}
      </div>
    </div>
  );
};

export default MessageInput;
