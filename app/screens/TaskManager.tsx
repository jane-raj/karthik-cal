import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, StyleSheet, FlatList, TextInput } from 'react-native';
import { supabase } from '../services/supabase';

const TaskManager = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');

  const fetchTasks = async () => {
    const { data, error } = await supabase.from('tasks').select('*');
    if (error) {
      Alert.alert('Error fetching tasks', error.message);
    } else {
      setTasks(data);
    }
  };

  const handleAddTask = async () => {
    if (!newTask.trim()) {
      Alert.alert('Error', 'Task content cannot be empty.');
      return;
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert([{ user_id: 'USER_ID', content: newTask, completed: false }]); // Replace 'USER_ID' with actual user ID

    if (error) {
      Alert.alert('Error adding task', error.message);
    } else {
      setNewTask('');
      fetchTasks(); // Refresh the list of tasks
      Alert.alert('Success', 'Task added successfully!');
    }
  };

  const handleCompleteTask = async (taskId) => {
    const { error } = await supabase.from('tasks').update({ completed: true }).eq('id', taskId);
    if (error) {
      Alert.alert('Error completing task', error.message);
    } else {
      fetchTasks(); // Refresh the list of tasks
      Alert.alert('Success', 'Task marked as completed!');
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Add a new task"
        value={newTask}
        onChangeText={setNewTask}
        style={styles.input}
      />
      <Button title="Add Task" onPress={handleAddTask} />
      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.taskContainer}>
            <Text style={{ textDecorationLine: item.completed ? 'line-through' : 'none' }}>{item.content}</Text>
            {!item.completed && <Button title="Complete" onPress={() => handleCompleteTask(item.id)} />}
          </View>
        )}
      />
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
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 5,
  },
});

export default TaskManager; 