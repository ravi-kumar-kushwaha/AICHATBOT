"use client";
import ChatInterface from "@/Component/ChatInterface";
import Navbar from "@/Component/Navbar";
import Sidebar from "@/Component/Sidebar";
import { api } from "@/lib/api";
import Link from "next/link";

import { useState, useEffect, useCallback } from "react";

export default function Home() {
  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      const chatList = await api.getChats();
      setChats(chatList);
      if (chatList.length > 0 && !currentChatId) {
        setCurrentChatId(chatList[0].id);
      }
    } catch (error) {
      console.error("Failed to load chats:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentChatId) {
      loadCurrentChat();
    }
  }, [currentChatId]);

  const loadCurrentChat = async () => {
    if (!currentChatId) return;

    try {
      const chatData = await api.getChat(currentChatId);
      setCurrentChat(chatData);
    } catch (error) {
      console.error("Failed to load current chat:", error);
    }
  };

  const createNewChat = async () => {
    try {
      const newChat = await api.createChat();
      setChats((prev) => [newChat, ...prev]);
      setCurrentChatId(newChat.id);
      setCurrentChat(newChat);
      // setCurrentChat({ chat: newChat, messages: [] });
    } catch (error) {
      console.error("Failed to create new chat:", error);
    }
  };

  const selectChat = (chatId) => {
    setCurrentChatId(chatId);
  };

  const deleteChat = async (chatId) => {
    try {
      await api.deleteChat(chatId);
      setChats((prev) => prev.filter((chat) => chat.id !== chatId));
      alert("Chat deleted successfully");

      if (chatId === currentChatId) {
        const remainingChats = chats.filter((chat) => chat.id !== chatId);
        if (remainingChats.length > 0) {
          setCurrentChatId(remainingChats[0].id);
        } else {
          setCurrentChatId(null);
          setCurrentChat(null);
        }
      }
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };

  const updateChatTitle = (chatId, newTitle) => {
    setChats((prevChats) =>
      prevChats.map((chat) =>
        chat.id === chatId ? { ...chat, title: newTitle } : chat
      )
    );

    setCurrentChat((prevCurrentChat) => {
      if (!prevCurrentChat || !prevCurrentChat.chat) return prevCurrentChat;

      if (prevCurrentChat.chat.id === chatId) {
        return {
          ...prevCurrentChat,
          chat: {
            ...prevCurrentChat.chat,
            title: newTitle,
          },
        };
      }

      return prevCurrentChat;
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900 text-white">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }
  const token = localStorage.getItem("token");

  return (
    <>
      <Navbar />
      <div className="flex h-screen bg-gray-800 mt-20 fixed text-white w-full">
        <Sidebar
          chats={chats}
          currentChatId={currentChatId}
          onNewChat={createNewChat}
          onSelectChat={selectChat}
          onDeleteChat={deleteChat}
        />
        <div className="flex-1 flex flex-col min-h-[400px]">
          {currentChatId && currentChat ? (
            <ChatInterface
              chat={currentChat}
              onRefresh={loadCurrentChat}
              onUpdateTitle={updateChatTitle}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-4xl font-bold mb-4">Welcome to Chat App</h1>
                <p className="text-gray-400 mb-8">
                  Start a new conversation to get started
                </p>
                {token ? (
                  <button
                    onClick={createNewChat}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    New Chat
                  </button>
                ) : (
                  <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    <Link href="/login">New Chat</Link>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
