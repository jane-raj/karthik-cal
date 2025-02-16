import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { AuthProvider, useAuth } from '../../services/context/AuthContext';
import * as Notifications from 'expo-notifications';
import { View, Text, StyleSheet } from 'react-native';

const App = () => {
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener(notification => {
      console.log(notification);
    });

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
  const context = useAuth();

  if (!context) {
    return <Text>Loading...</Text>;
  }

  const { user } = context;

  return (
    <View style={user ? styles.loggedInContainer : styles.loggedOutContainer}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth/login"/>
        <Stack.Screen name="auth/register" />
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="subscription" />
      </Stack>
    </View>
  );
};

const styles = StyleSheet.create({
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