// ChatList.js
import React from 'react';
import { FlatList, Image, TouchableOpacity, Text, View } from 'react-native';
import dayjs from 'dayjs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';


// Sample chat data
const chatData = [
  {
    id: '1',
    name: 'John Doe',
    lastMessage: 'Hey, how are you?',
    timestamp: '2024-04-25T14:48:00.000Z',
    avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
    unread: true,
  },
  {
    id: '2',
    name: 'Jane Smith',
    lastMessage: "Let's catch up tomorrow.",
    timestamp: '2024-04-25T13:20:00.000Z',
    avatar: 'https://randomuser.me/api/portraits/women/2.jpg',
    unread: false,
  },
  // Add more chat items as needed
];



const ChatList = () => {
  const navigation = useNavigation();

  const renderItem = ({ item }) => (
    <TouchableOpacity
      className="flex-row items-center p-4 border-b border-gray-200"
      onPress={() => navigation.navigate('(inbox)/Inbox', { chat: item })}
    >
      <Image
        source={{ uri: item.avatar }}
        className="w-12 h-12 rounded-full"
      />
      <View className="flex-1 ml-4">
        <View className="flex-row justify-between">
          <Text className="text-lg font-bold text-black">{item.name}</Text>
          <Text className="text-sm text-gray-500">
            {dayjs(item.timestamp).format('h:mm A')}
          </Text>
        </View>
        <View className="flex-row justify-between items-center mt-1">
          <Text className="text-sm text-gray-600 flex-1" numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unread && (
            <View className="w-2.5 h-2.5 rounded-full bg-blue-500 ml-2" />
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <FlatList
        data={chatData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingVertical: 8 }}
        className="w-full h-full"
      />
    </SafeAreaView>
  );
};

export default ChatList;
