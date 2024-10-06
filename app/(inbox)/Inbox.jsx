// App.js

import React from 'react';
import Inbox from './components/Inbox';
import MessageDetail from '../../components/MessageDetails';
import ChatScreen from '../../components/ChatScreen'; // Import ChatScreen
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Inbox">
        <Stack.Screen
          name="Inbox"
          component={Inbox}
          options={{ title: 'Inbox' }}
        />
        <Stack.Screen
          name="MessageDetail"
          component={MessageDetail}
          options={{ title: 'Message Detail' }}
        />
        <Stack.Screen
          name="Chat"
          component={ChatScreen}
          options={({ route }) => ({ title: route.params.message.sender })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
