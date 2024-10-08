import React, { useState, useRef } from 'react';
import {
  FlatList,
  Image,
  TouchableOpacity,
  Text,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Modal,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import dayjs from 'dayjs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useRoute, useNavigation } from '@react-navigation/native';
import { launchImageLibrary } from 'react-native-image-picker';
import { SafeAreaView } from 'react-native-safe-area-context';


const REACTIONS = ['❤️', '😂', '😮', '😢', '👍', '👎'];

const Inbox = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { chat } = route.params;

  const [messages, setMessages] = useState([
    {
      id: 'm1',
      text: 'Hello!',
      avatar: chat.avatar,
      timestamp: '2024-04-25T14:48:00.000Z',
      sender: 'them',
      reactions: [],
    },
    {
      id: 'm2',
      text: 'Hi there! How are you?',
      avatar: chat.myAvatar, // Your avatar
      timestamp: '2024-04-25T14:50:00.000Z',
      sender: 'me',
      reactions: [],
    },
  ]);

  const [inputText, setInputText] = useState('');
  const flatListRef = useRef();

  // State for Reaction Picker Modal
  const [reactionModalVisible, setReactionModalVisible] = useState(false);
  const [selectedMessageId, setSelectedMessageId] = useState(null);

  // State for selecting messages
  const [selectedMessages, setSelectedMessages] = useState(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);

  // State for editing message
  const [editingMessageId, setEditingMessageId] = useState(null);

  // State for Options Menu
  const [optionsModalVisible, setOptionsModalVisible] = useState(false);

  // State for Set Name Modal
  const [setNameModalVisible, setSetNameModalVisible] = useState(false);
  const [newChatName, setNewChatName] = useState(chat.name);

  // State for Blocking
  const [blocked, setBlocked] = useState(false);

  const sendMessage = () => {
    if (inputText.trim() === '' || blocked) return;

    const newMessage = {
      id: `m${messages.length + 1}`,
      text: inputText,
      timestamp: new Date().toISOString(),
      sender: 'me',
      reactions: [],
      avatar: chat.myAvatar, // Your avatar
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputText('');

    // Scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);
  };

  const sendFile = () => {
    if (blocked) return;

    const options = {
      mediaType: 'photo', // or 'video' or 'mixed'
      quality: 1,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else {
        const asset = response.assets[0];
        const newMessage = {
          id: `m${messages.length + 1}`,
          text: asset.uri, // Image URI
          timestamp: new Date().toISOString(),
          sender: 'me',
          type: 'image',
          reactions: [],
          avatar: chat.myAvatar, // Your avatar
        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);

        // Scroll to bottom
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    });
  };

  const handleLongPress = (messageId, sender) => {
    if (blocked) return;

    if (sender === 'me') {
      setIsSelectionMode(true);
      toggleMessageSelection(messageId);
    } else {
      setSelectedMessageId(messageId);
      setReactionModalVisible(true);
    }
  };

  const toggleMessageSelection = (messageId) => {
    setSelectedMessages((prevSelected) => {
      const newSelected = new Set(prevSelected);
      if (newSelected.has(messageId)) {
        newSelected.delete(messageId);
      } else {
        newSelected.add(messageId);
      }
      return newSelected;
    });
  };

  const deleteSelectedMessages = () => {
    setMessages((prevMessages) =>
      prevMessages.filter((msg) => !selectedMessages.has(msg.id))
    );
    setSelectedMessages(new Set());
    setIsSelectionMode(false);
  };

  const editSelectedMessage = () => {
    if (selectedMessages.size === 1) {
      const messageId = Array.from(selectedMessages)[0];
      const messageToEdit = messages.find((msg) => msg.id === messageId);
      setInputText(messageToEdit.text); // Set the input to the message text
      setEditingMessageId(messageId); // Set the editing message ID
      setIsSelectionMode(false); // Exit selection mode
      setSelectedMessages(new Set()); // Clear selected messages
    }
  };

  const saveEditedMessage = () => {
    if (editingMessageId && !blocked) {
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg.id === editingMessageId
            ? { ...msg, text: inputText } // Update the message text
            : msg
        )
      );
      setInputText(''); // Clear the input field
      setEditingMessageId(null); // Reset editing message ID
    }
  };

  const addReaction = (emoji) => {
    setMessages((prevMessages) =>
      prevMessages.map((msg) =>
        msg.id === selectedMessageId
          ? { ...msg, reactions: [emoji] } // Replace existing reaction with new one
          : msg
      )
    );
    setReactionModalVisible(false);
  };

  const unsendMessage = () => {
    Alert.alert(
      'Unsend Message',
      'Are you sure you want to delete this message?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Unsend',
          style: 'destructive',
          onPress: () => {
            setMessages((prevMessages) =>
              prevMessages.filter((msg) => msg.id !== selectedMessageId)
            );
            setReactionModalVisible(false);
          },
        },
      ]
    );
  };

  const renderReactionPicker = () => (
    <Modal
      transparent
      animationType="fade"
      visible={reactionModalVisible}
      onRequestClose={() => setReactionModalVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => setReactionModalVisible(false)}>
        <View className="flex-1 justify-center items-center bg-black bg-opacity-25">
          <View className="flex-row bg-white p-3 rounded-full">
            {REACTIONS.map((emoji) => (
              <TouchableOpacity
                key={emoji}
                onPress={() => addReaction(emoji)}
                className="mx-2"
              >
                <Text style={{ fontSize: 24 }}>{emoji}</Text>
              </TouchableOpacity>
            ))}
            {messages.find((msg) => msg.id === selectedMessageId)?.sender ===
              'me' && (
              <TouchableOpacity onPress={unsendMessage} className="mx-2">
                <Icon name="delete" size={24} color="#FF0000" />
              </TouchableOpacity>
            )}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  const renderOptionsMenu = () => (
    <Modal
      transparent
      animationType="fade"
      visible={optionsModalVisible}
      onRequestClose={() => setOptionsModalVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => setOptionsModalVisible(false)}>
        <View className="flex-1 justify-center items-center bg-black bg-opacity-25">
          <View className="bg-white p-4 rounded-lg w-60">
            <TouchableOpacity
              onPress={() => {
                setOptionsModalVisible(false);
                blocked ? handleUnblockUser() : handleBlockUser();
              }}
              className="py-2"
            >
              <Text className="text-lg text-red-500">
                {blocked ? 'Unblock' : 'Block'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setOptionsModalVisible(false);
                handleDeleteChat();
              }}
              className="py-2"
            >
              <Text className="text-lg text-red-500">Delete Chat</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                setOptionsModalVisible(false);
                setSetNameModalVisible(true);
              }}
              className="py-2"
            >
              <Text className="text-lg text-blue-500">Set Name</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  const renderSetNameModal = () => (
    <Modal
      transparent
      animationType="slide"
      visible={setNameModalVisible}
      onRequestClose={() => setSetNameModalVisible(false)}
    >
      <TouchableWithoutFeedback onPress={() => setSetNameModalVisible(false)}>
        <View className="flex-1 justify-center items-center bg-black bg-opacity-25">
          <View className="bg-white p-6 rounded-lg w-80">
            <Text className="text-xl font-bold mb-4">Set Chat Name</Text>
            <TextInput
              className="border border-gray-300 rounded px-4 py-2 mb-4"
              placeholder="Enter new name"
              value={newChatName}
              onChangeText={setNewChatName}
            />
            <View className="flex-row justify-end">
              <TouchableOpacity
                onPress={() => setSetNameModalVisible(false)}
                className="mr-4"
              >
                <Text className="text-blue-500">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSetName}>
                <Text className="text-blue-500 font-semibold">Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );

  const renderOptionsMenuButton = () => (
    <TouchableOpacity onPress={() => setOptionsModalVisible(true)}>
      <Icon name="more-vert" size={24} color="#3B82F6" />
    </TouchableOpacity>
  );

  const handleBlockUser = () => {
    Alert.alert(
      'Block User',
      'Are you sure you want to block this user?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Block',
          style: 'destructive',
          onPress: () => {
            setBlocked(true);
            Alert.alert('User Blocked', 'You have blocked this user.');
            // Implement additional block logic here (e.g., update backend)
          },
        },
      ]
    );
  };

  const handleUnblockUser = () => {
    Alert.alert(
      'Unblock User',
      'Are you sure you want to unblock this user?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Unblock',
          style: 'default',
          onPress: () => {
            setBlocked(false);
            Alert.alert('User Unblocked', 'You have unblocked this user.');
            // Implement additional unblock logic here (e.g., update backend)
          },
        },
      ]
    );
  };

  const handleDeleteChat = () => {
    Alert.alert(
      'Delete Chat',
      'Are you sure you want to delete this chat?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setMessages([]); // Clear messages
            Alert.alert('Chat Deleted', 'The chat has been deleted.');
            navigation.goBack();
            // Implement additional delete logic here (e.g., update backend)
          },
        },
      ]
    );
  };

  const handleSetName = () => {
    if (newChatName.trim() === '') {
      Alert.alert('Invalid Name', 'Please enter a valid name.');
      return;
    }
    // Assuming chat.name is mutable. If not, manage it via state.
    chat.name = newChatName;
    setSetNameModalVisible(false);
    Alert.alert('Name Updated', `Chat name has been set to "${newChatName}".`);
    // Implement additional set name logic here (e.g., update backend)
  };

  const renderItem = ({ item }) => {
    const isMe = item.sender === 'me';
    const isSelected = selectedMessages.has(item.id);

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onLongPress={() => handleLongPress(item.id, item.sender)}
        onPress={() => isSelectionMode && toggleMessageSelection(item.id)}
        className={`flex-row ${isMe ? 'justify-end' : 'justify-start'} my-2`}
      >
        {/* Avatar */}
        <Image
          source={{ uri: item.avatar}}
          className="w-8 h-8 rounded-full mr-2"
        />

        {/* Message Container */}
        <View className="max-w-3/4 relative">
          <View
            className={`p-3 rounded-lg ${
              isMe ? 'bg-blue-500' : 'bg-gray-300'
            } ${isSelected ? 'border-2 border-blue-700' : ''}`}
          >
            {item.type === 'image' ? (
              <Image
                source={{ uri: item.text }}
                className="w-36 h-36 rounded-lg"
                resizeMode="cover"
              />
            ) : (
              <Text
                className={`text-sm ${
                  isMe ? 'text-white text-right' : 'text-black text-left'
                }`}
              >
                {item.text}
              </Text>
            )}
            <Text
              className={`text-xs mt-1 ${
                isMe ? 'text-gray-200 text-right' : 'text-gray-500 text-left'
              }`}
            >
              {dayjs(item.timestamp).format('h:mm A')}
            </Text>
          </View>

          {/* Reaction */}
          {item.reactions.length > 0 && (
            <View
              className={`absolute ${
                isMe ? 'right-0' : 'left-0'
              } -bottom-4`}
            >
              <Text className="text-lg">{item.reactions[0]}</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-100"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      <SafeAreaView className="flex-1">
        {/* Header */}
        <View className="flex-row items-center bg-white p-4 border-b border-gray-200">
          <TouchableOpacity onPress={() => navigation.goBack()} className="mr-4">
            <Icon name="arrow-back" size={24} color="#3B82F6" />
          </TouchableOpacity>
          <Image
            source={{ uri: chat.avatar }} // Ensure `chat.avatar` is a valid URI
            className="w-10 h-10 rounded-full mr-4"
          />
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-800">{chat.name}</Text>
            <View className="flex-row items-center">
              <View className="w-3 h-3 rounded-full bg-green-500 mr-1" />
              <Text className="text-sm text-gray-600">Active</Text>
            </View>
          </View>
          {renderOptionsMenuButton()}
        </View>

        {/* Options Menu Modal */}
        {renderOptionsMenu()}

        {/* Set Name Modal */}
        {renderSetNameModal()}

        {/* Selection Mode Bar */}
        {isSelectionMode && (
          <View className="flex-row justify-between items-center bg-gray-200 p-4">
            <TouchableOpacity onPress={deleteSelectedMessages}>
              <Text className="text-red-500 text-lg font-semibold">Delete</Text>
            </TouchableOpacity>
            {selectedMessages.size === 1 && (
              <TouchableOpacity onPress={editSelectedMessage}>
                <Text className="text-blue-500 text-lg font-semibold">Edit</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={() => {
                setIsSelectionMode(false);
                setSelectedMessages(new Set());
              }}
            >
              <Text className="text-gray-600 text-lg font-semibold">Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Messages List */}
        {blocked ? (
  <View className="flex-1 justify-center items-center">
    <Text className="text-lg text-gray-500">You can't reply to this conversation.</Text>
  </View>
) : (
  <FlatList
    ref={flatListRef}
    data={messages}
    keyExtractor={(item) => item.id}
    renderItem={renderItem}
    contentContainerStyle={{ padding: 10 }}
    onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
    className="flex-1"
  />
)}

        {/* Reaction Picker Modal */}
        {renderReactionPicker()}

        {/* Input Area */}
        <View className="flex-row items-center p-4 bg-white border-t border-gray-200">
  <TouchableOpacity onPress={sendFile} className="mr-4" disabled={blocked}>
    <Icon name="attach-file" size={24} color={blocked ? "#A9A9A9" : "#6B7280"} />
  </TouchableOpacity>
  <TextInput
    className="flex-1 max-h-24 px-4 py-2 bg-gray-200 rounded-full text-base text-gray-800"
    placeholder="Type a message"
    value={inputText}
    onChangeText={setInputText}
    multiline
    editable={!blocked} // Disable the input if blocked
  />
  <TouchableOpacity 
    onPress={editingMessageId ? saveEditedMessage : sendMessage} 
    className="ml-4"
    disabled={blocked}
  >
    <Icon name="send" size={24} color={blocked ? "#A9A9A9" : "#3B82F6"} />
  </TouchableOpacity>
</View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

// Tailwind styles are now applied via className
export default Inbox;
