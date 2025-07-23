import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

// Custom error class
class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

// Axios response handler
const handleAxiosResponse = (response) => {
  if (!response || !response.data || !response.data.success) {
    throw new ApiError("Invalid Axios response", response?.status || 500);
  }
  return response.data.data;
};

// Fetch response handler
const handleFetchResponse = async (response) => {
  if (!response.ok) {
    const errorText = await response.text();
    throw new ApiError(errorText || `HTTP ${response.status}`, response.status);
  }

  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    const json = await response.json();
    return json.data || json;
  }

  return await response.text();
};

export const api = {
  // Get all chats
  async getChats() {
    try {
      const response = await axios.get(`${API_BASE_URL}/chat/all-chats`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return handleAxiosResponse(response);
    } catch (error) {
      console.error("Failed to fetch chats:", error);
      throw error;
    }
  },

  // Create new chat
  async createChat(title = "New Chat") {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/chat/create-chat`,
        { title },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );
      return handleAxiosResponse(response);
    } catch (error) {
      console.error("Failed to create chat:", error);
      throw error;
    }
  },

  // Get chat with messages
  async getChat(chatId) {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/chat/single-chat/${chatId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return handleAxiosResponse(response);
    } catch (error) {
      console.error("Failed to fetch chat:", error);
      throw error;
    }
  },

  // Send message (uses fetch for streaming)
  async sendMessage(chatId, message) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/message/send-message/${chatId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ message }),
        }
      );

      if (!response.ok) {
        throw new ApiError(
          `Failed to send message: ${response.status}`,
          response.status
        );
      }

      return response;
    } catch (error) {
      console.error("Failed to send message:", error);
      throw error;
    }
  },

  // Stop generation
  async stopGeneration(chatId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/message/stop-generation/${chatId}/stop`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      return await handleFetchResponse(response);
    } catch (error) {
      console.error("Failed to stop generation:", error);
      throw error;
    }
  },

  // Delete chat
  async deleteChat(chatId) {
    try {
      const response = await fetch(
        `${API_BASE_URL}/chat/delete-chat/${chatId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("delete chat response", response);
      return await handleFetchResponse(response);
    } catch (error) {
      console.error("Failed to delete chat:", error);
      throw error;
    }
  },

  // Health check
  async healthCheck() {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return await handleFetchResponse(response);
    } catch (error) {
      console.error("Health check failed:", error);
      throw error;
    }
  },
};
