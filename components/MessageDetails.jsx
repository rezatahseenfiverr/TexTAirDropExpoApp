// components/MessageDetail.js

import React from 'react';
import { View, Image } from 'react-native';
import { Text } from 'react-native';
import dayjs from 'dayjs';

const MessageDetail = ({ route }) => {
  const { message } = route.params;

  return (
    <View className="flex-1 bg-white p-4">
      <View className="flex-row items-center mb-4">
        <Image
          source={{ uri: message.avatar }}
          className="w-16 h-16 rounded-full"
        />
        <View className="ml-4">
          <Text className="text-xl font-semibold text-black">{message.sender}</Text>
          <Text className="text-sm text-gray-500">
            {dayjs(message.timestamp).format('MMMM D, YYYY h:mm A')}
          </Text>
        </View>
      </View>
      <View className="border-b border-gray-200 pb-2 mb-4">
        <Text className="text-lg font-bold">{message.subject}</Text>
      </View>
      <Text className="text-base text-gray-700">
        {message.preview}
      </Text>
      {/* Add more message details or actions here */}
    </View>
  );
};

export default MessageDetail;
