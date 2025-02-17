import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { AuthProvider, useAuth } from '../../services/context/AuthContext';
import * as Notifications from 'expo-notifications';
import { View, Text, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { supabase } from '../../src/services/supabase';

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
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!context) {
    return <Text>Loading...</Text>;
  }

  const { user } = context;

  const handleLogin = async () => {
    try {
      await signIn(email, password);
      Alert.alert('Success', 'Logged in successfully!');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <View style={user ? styles.loggedInContainer : styles.loggedOutContainer}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="auth/login"/>
        <Stack.Screen name="auth/register" />
        <Stack.Screen name="dashboard" />
        <Stack.Screen name="subscription" />
      </Stack>
      <View style={styles.container}>
        <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
        <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
        <Button title="Login" onPress={handleLogin} />
      </View>
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
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default App;