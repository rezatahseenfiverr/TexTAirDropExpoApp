// components/ChatScreen.js

import React, { useState, useEffect, useRef } from 'react';
import { View, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { Text, Image } from 'react-native';
import dayjs from 'dayjs';
import { useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons'; // Using Ionicons for the send icon

const MessageBubble = ({ message, isCurrentUser }) => {
  return (
    <View
      className={`flex-row my-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
    >
      {!isCurrentUser && (
        <Image
          source={{ uri: message.avatar }}
          className="w-8 h-8 rounded-full mr-2"
        />
      )}
      <View
        className={`max-w-3/4 p-3 rounded-lg ${
          isCurrentUser ? 'bg-blue-500' : 'bg-gray-200'
        }`}
      >
        <Text
          className={`text-sm ${
            isCurrentUser ? 'text-white' : 'text-black'
          }`}
        >
          {message.text}
        </Text>
        <Text
          className={`text-xs mt-1 ${
            isCurrentUser ? 'text-blue-200' : 'text-gray-500'
          }`}
          style={{ textAlign: 'right' }}
        >
          {dayjs(message.timestamp).format('h:mm A')}
        </Text>
      </View>
      {isCurrentUser && (
        <Image
          source={{ uri: message.avatar }}
          className="w-8 h-8 rounded-full ml-2"
        />
      )}
    </View>
  );
};

const ChatScreen = () => {
  const route = useRoute();
  const { message: conversation } = route.params;

  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const flatListRef = useRef();

  useEffect(() => {
    // Initialize with some dummy messages
    const initialMessages = [
      {
        id: '1',
        text: 'Hi there!',
        timestamp: '2024-04-25T10:00:00.000Z',
        sender: 'Alice Johnson',
        avatar: conversation.avatar,
        isCurrentUser: false,
      },
      {
        id: '2',
        text: 'Hello! How are you?',
        timestamp: '2024-04-25T10:05:00.000Z',
        sender: 'You',
        avatar: 'https://randomuser.me/api/portraits/men/46.jpg', // Replace with current user avatar
        isCurrentUser: true,
      },
      // Add more initial messages as needed
    ];
    setMessages(initialMessages);
  }, []);

  const handleSend = () => {
    if (inputText.trim() === '') return;

    const newMessage = {
      id: (messages.length + 1).toString(),
      text: inputText,
      timestamp: new Date().toISOString(),
      sender: 'You',
      avatar: 'https://randomuser.me/api/portraits/men/46.jpg', // Replace with current user avatar
      isCurrentUser: true,
    };

    setMessages([...messages, newMessage]);
    setInputText('');

    // Scroll to the bottom when a new message is sent
    flatListRef.current.scrollToEnd({ animated: true });
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MessageBubble
            message={item}
            isCurrentUser={item.isCurrentUser}
          />
        )}
        contentContainerStyle="p-4"
      />
      <View className="flex-row items-center p-2 border-t border-gray-200">
        <TextInput
          className="flex-1 bg-gray-100 rounded-full px-4 py-2 mr-2 text-gray-700"
          placeholder="Type a message"
          value={inputText}
          onChangeText={setInputText}
          multiline
        />
        <TouchableOpacity
          className="p-2"
          onPress={handleSend}
        >
          <Ionicons name="send" size={24} color="#007AFF" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;
