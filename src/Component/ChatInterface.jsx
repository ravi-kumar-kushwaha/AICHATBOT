import { useState, useRef, useEffect } from "react";
import MessageInput from "./MessageInput";
import MessageList from "./MessageList";
import { api } from "../lib/api";

const ChatInterface = ({ chat, onRefresh, onUpdateTitle }) => {
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
  const [messages, setMessages] = useState([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentStreamContent, setCurrentStreamContent] = useState("");
  const abortControllerRef = useRef(null);

  useEffect(() => {
    if (chat?.messages) {
      setMessages(chat.messages);
    }
  }, [chat]);

  const sendMessage = async (messageText) => {
    if (!messageText.trim() || isStreaming) return;

    const userMessage = {
      role: "user",
      content: messageText.trim(),
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsStreaming(true);
    setIsTyping(true);
    setCurrentStreamContent("");

    const assistantMessage = {
      role: "assistant",
      content: "",
      timestamp: new Date().toISOString(),
      streaming: true,
    };
    setMessages((prev) => [...prev, assistantMessage]);

    try {
      const chatId = chat?.chat?.id || chat?.id;
      console.log("chatId", chatId);

      if (!chatId) {
        throw new Error("Chat ID is missing");
      }

      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Authentication token is missing");
      }
      abortControllerRef.current = new AbortController();
      let response;

      try {
        response = await fetch(
          `${API_BASE_URL}/message/send-message/${chatId}`,
          {
            method: "POST",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
              Accept: "application/json, text/plain, */*",
            },
            body: JSON.stringify({ prompt: messageText.trim() }),
            signal: abortControllerRef.current.signal,
          }
        );
      } catch (fetchError) {
        console.error("Standard fetch failed:", fetchError);
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response body:", errorText);
        throw new Error(
          `HTTP error! status: ${response.status}, message: ${
            errorText || response.statusText
          }`
        );
      }

      if (!response.body) {
        throw new Error("Response body is empty");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let streamedContent = "";

      setIsTyping(false);

      while (true) {
        try {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          streamedContent += chunk;
          setCurrentStreamContent(streamedContent);

          setMessages((prev) =>
            prev.map((msg) =>
              msg.streaming ? { ...msg, content: streamedContent } : msg
            )
          );
        } catch (readError) {
          console.error("Error reading stream:", readError);
          break;
        }
      }

      setMessages((prev) =>
        prev.map((msg) => (msg.streaming ? { ...msg, streaming: false } : msg))
      );

      if (messages.length === 0) {
        const title =
          messageText.length > 50
            ? messageText.substring(0, 47) + "..."
            : messageText;
        if (onUpdateTitle) {
          onUpdateTitle(chatId, title);
        }
      }

      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error("error:", error);

      if (error.name === "AbortError") {
        console.log("Stream was aborted");
      } else {
        console.error("Error sending message:", error);

        setMessages((prev) => prev.filter((msg) => !msg.streaming));

       
        let errorMessage =
          "Sorry, I encountered an error processing your request.";

        if (error.message.includes("404")) {
          errorMessage =
            "Chat not found. The chat may have been deleted or the ID is invalid.";
        } else if (
          error.message.includes("401") ||
          error.message.includes("Authentication")
        ) {
          errorMessage = "Authentication failed. Please log in again.";
        } else if (error.message.includes("Chat ID is missing")) {
          errorMessage = "Invalid chat selected. Please select a valid chat.";
        } else if (error.message.includes("Failed to fetch")) {
          errorMessage =
            "Unable to connect to the server. Please check your connection.";
        }

        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: errorMessage,
            timestamp: new Date().toISOString(),
            error: true,
          },
        ]);
      }
    } finally {
      setIsStreaming(false);
      setIsTyping(false);
      setCurrentStreamContent("");
      abortControllerRef.current = null;
    }
  };

  const stopGeneration = async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    try {
      const chatId = chat?.chat?.id || chat?.id;
      if (chatId && api.stopGeneration) {
        await api.stopGeneration(chatId);
        alert("Generation stopped successfully");
      }
    } catch (error) {
      console.error("Error stopping generation:", error);
    }

    setIsStreaming(false);
    setIsTyping(false);
    setCurrentStreamContent("");

    setMessages((prev) =>
      prev.map((msg) => (msg.streaming ? { ...msg, streaming: false } : msg))
    );
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape" && isStreaming) {
        stopGeneration();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isStreaming]);

  if (!chat) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-gray-400">Select a chat to start messaging</div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b border-gray-700 p-4">
        <h1 className="text-xl font-semibold text-white truncate">
          {chat.title}
        </h1>
        <div className="text-sm text-gray-400 mt-1">
          {messages.length} messages
        </div>
      </div>
      <MessageList
        messages={messages}
        isTyping={isTyping}
        isStreaming={isStreaming}
      />
      <MessageInput
        onSendMessage={sendMessage}
        isStreaming={isStreaming}
        onStop={stopGeneration}
      />
    </div>
  );
};

export default ChatInterface;
