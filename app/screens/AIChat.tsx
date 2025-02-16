import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, StyleSheet } from 'react-native';

const AIChat = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState('');

  const handleQuery = async () => {
    try {
      const res = await fetch('http://localhost:5000/ai-query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setResponse(data.answer); // Assuming the response contains an 'answer' field
    } catch (error) {
      Alert.alert('Error', error.message);
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
      <Button title="Send" onPress={handleQuery} />
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