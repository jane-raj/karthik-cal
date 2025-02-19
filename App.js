import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Login from './app/auth/login';
import Register from './app/auth/register';
import Dashboard from './app/dashboard/Dashboard';
import Subscription from './app/screens/Subscription';
import { Text } from 'react-native'; // Import Text for loading message
import AIChat from './app/screens/AIChat';
import Community from './app/screens/Community';

const Stack = createStackNavigator();

const App = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // State to hold error messages
  const apiUrl = 'http://localhost:5000'; // Use the environment variable or default to localhost

  console.log('API URL:', apiUrl); // Log the API URL for debugging

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${apiUrl}/fetch-data`); // Adjust the endpoint as necessary
        if (!response.ok) {
          setError('Network response was not ok'); // Set error message
          return; // Exit the function if the response is not ok
        }
        const result = await response.json();
        setData(result); // Set the fetched data to state
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Error fetching data'); // Set error message
      } finally {
        setLoading(false); // Set loading to false after fetching
      }
    };

    fetchData();
  }, []); // Empty dependency array means this runs once on mount

  if (loading) {
    return <Text>Loading...</Text>; // Show loading indicator
  }

  if (error) {
    return <Text>{error}</Text>; // Display error message if there is an error
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="Subscription" component={Subscription} />
        <Stack.Screen name='CalorieTracker' component={CalorieTracker} />
        <Stack.Screen name='TaskManager' component={TaskManager} />
        <Stack.Screen name='WalkingAnalytics' component={WalkingAnalytics} />
        <Stack.Screen name='AiChat' component={AIChat} />
        <Stack.Screen name='Community' component={Community} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;