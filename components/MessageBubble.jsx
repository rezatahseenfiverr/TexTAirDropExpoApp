// components/MessageBubble.js

import React from 'react';
import { View, Text, Image } from 'react-native';
import dayjs from 'dayjs';

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

export default MessageBubble;
