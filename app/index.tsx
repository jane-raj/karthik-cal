import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { AuthProvider, useAuth } from '../src/context/AuthContext';
import * as Notifications from 'expo-notifications';
import { Alert, View, StyleSheet, Text } from 'react-native';
import Dashboard from './dashboard/Dashboard';
import Login from './auth/login';
import Register from './auth/register';
import Subscription from './screens/Subscription';
import CalorieTracker from './screens/CalorieTracker';
import WalkingAnalytics from './screens/WalkingAnalytics';
import Community from './screens/Community';
import UserProfile from './screens/UserProfile';
import TaskManager from './screens/TaskManager';
import Settings from './screens/Settings';
import AIChat from './screens/AIChat';

const App = () => {
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log(notification);
    });

    const requestPermissions = async () => {
      const { status } = await Notifications.getPermissionsAsync();
      if (status !== 'granted') {
        const { status: newStatus } = await Notifications.requestPermissionsAsync();
        if (newStatus !== 'granted') {
          Alert.alert('Permission not granted', 'You will not receive notifications.');
        }
      }
    };

    requestPermissions();

    return () => subscription.remove();
  }, []);

  return (
    <PaperProvider>
      <AuthProvider>
        <Main />
      </AuthProvider>
    </PaperProvider>
  );
};

const Main = () => {
  const { user } = useAuth();

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" options={{ title: 'Welcome to My App' }} />
      <Stack.Screen name="auth/login">
        {() => <Login />}
      </Stack.Screen>
      <Stack.Screen name="auth/register">
        {() => <Register />}
      </Stack.Screen>
      <Stack.Screen name="dashboard">
        {() => <Dashboard />}
      </Stack.Screen>
      <Stack.Screen name="subscription" component={Subscription} />
      <Stack.Screen name="settings" component={Settings} />
      <Stack.Screen name="ai-chat" component={AIChat} />
      <Stack.Screen name="calorie-tracker" component={CalorieTracker} />
      <Stack.Screen name="walking-analytics" component={WalkingAnalytics} />
      <Stack.Screen name="community" component={Community} />
      <Stack.Screen name="user-profile" component={UserProfile} />
      <Stack.Screen name="task-manager" component={TaskManager} />
    </Stack>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 24,
  },
  loggedInContainer: {
    flex: 1,
    backgroundColor: '#E0F7FA',
    padding: 20,
  },
  loggedOutContainer: {
    flex: 1,
    backgroundColor: '#FFEBEE',
    padding: 20,
  },
});

export default App; 