// ProfileScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Alert,
  StyleSheet,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';

const ProfileScreen = () => {
  const [name, setName] = useState('User Name');
  const [username, setUsername] = useState('username123');
  const [profilePic, setProfilePic] = useState(null);
  const [blockedUsers, setBlockedUsers] = useState(['User1', 'User2']);
  const [settings, setSettings] = useState([
    { id: '1', name: 'Change Profile Picture' },
    { id: '2', name: 'Notification Settings' },
    { id: '3', name: 'Privacy Settings' },
  ]);

  // Password change state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleUnblockUser = (user) => {
    Alert.alert(
      'Unblock User',
      `Are you sure you want to unblock ${user}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Unblock',
          onPress: () => {
            setBlockedUsers((prev) => prev.filter((u) => u !== user));
            Alert.alert(`${user} has been unblocked.`);
          },
        },
      ]
    );
  };

  const renderBlockedUser = ({ item }) => (
    <View style={styles.blockedUserContainer}>
      <Text style={styles.blockedUserText}>{item}</Text>
      <TouchableOpacity onPress={() => handleUnblockUser(item)}>
        <Text style={styles.unblockText}>Unblock</Text>
      </TouchableOpacity>
    </View>
  );

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Passwords do not match!');
      return;
    }
    // Simulate a password change
    Alert.alert('Success', 'Your password has been changed successfully.');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleChangeProfilePic = async () => {
    // Request permission to access the camera roll
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      Alert.alert('Permission to access camera roll is required!');
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync();

    if (!result.canceled) {
      setProfilePic(result.assets[0].uri);
    }
  };

  const handleSaveName = () => {
    Alert.alert('Success', 'Your name has been updated successfully.');
  };

  const handleSaveUsername = () => {
    Alert.alert('Success', 'Your username has been updated successfully.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
      <View style={styles.profileContainer}>
        <Text style={styles.headerText}>Profile</Text>

        {/* Profile Picture */}
        <TouchableOpacity onPress={handleChangeProfilePic}>
          {profilePic ? (
            <Image source={{ uri: profilePic }} style={styles.profilePic} />
          ) : (
            <View style={styles.profilePicPlaceholder}>
              <Text style={styles.profilePicPlaceholderText}>Add Profile Picture</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Name Input */}
        <TextInput
          style={styles.input}
          placeholder="Enter your name"
          value={name}
          onChangeText={setName}
        />
        <TouchableOpacity style={styles.button} onPress={handleSaveName}>
          <Text style={styles.buttonText}>Change Name</Text>
        </TouchableOpacity>

        {/* Username Input */}
        <TextInput
          style={styles.input}
          placeholder="Enter your username"
          value={username}
          onChangeText={setUsername}
        />
        <TouchableOpacity style={styles.button} onPress={handleSaveUsername}>
          <Text style={styles.buttonText}>Change Username</Text>
        </TouchableOpacity>

        {/* Change Password Section */}
        <Text style={styles.sectionHeader}>Change Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Old Password"
          secureTextEntry
          value={oldPassword}
          onChangeText={setOldPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="New Password"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm New Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={handleChangePassword}
        >
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity>

        {/* Blocked Users Section */}
        <Text style={styles.sectionHeader}>Blocked Users</Text>
        {blockedUsers.length > 0 ? (
          <FlatList
            data={blockedUsers}
            renderItem={renderBlockedUser}
            keyExtractor={(item) => item}
          />
        ) : (
          <Text style={styles.noBlockedText}>No blocked users.</Text>
        )}

        {/* Settings Section */}
        <Text style={styles.sectionHeader}>General Settings</Text>
        <FlatList
          data={settings}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.settingItem}>
              <Text style={styles.settingText}>{item.name}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
        />
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  profileContainer: {
    padding: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  profilePicPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  profilePicPlaceholderText: {
    color: '#999999',
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
    width: '100%',
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 8,
    padding: 12,
    marginTop: 10,
    width: '100%',
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  blockedUserContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    marginVertical: 5,
  },
  blockedUserText: {
    fontSize: 16,
  },
  unblockText: {
    color: 'red',
  },
  noBlockedText: {
    color: '#999999',
  },
  settingItem: {
    padding: 10,
  },
  settingText: {
    fontSize: 16,
  },
});

export default ProfileScreen;
