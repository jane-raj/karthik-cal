import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet } from 'react-native';

const AIChat = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false); // Loading state

  const handleQuery = async () => {
    if (!query.trim()) {
      Alert.alert('Error', 'Please enter a query.');
      return;
    }

    setLoading(true); // Set loading to true when fetching starts
    try {
      // Replace with your actual API endpoint and logic
      const res = await fetch('http://localhost:5000/ai-query', { // Your API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }), // Sending the user's query
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to fetch response');

      setResponse(data.answer); // Assuming the response contains an 'answer' field
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false); // Set loading to false when fetching ends
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Ask me anything..."
        value={query}
        onChangeText={setQuery}
        style={styles.input}
      />
      <Button title={loading ? "Loading..." : "Send"} onPress={handleQuery} disabled={loading} />
      {response ? <Text style={styles.response}>{response}</Text> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  response: {
    marginTop: 20,
    fontSize: 16,
  },
});

export default AIChat; 