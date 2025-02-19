import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, StyleSheet, FlatList, TextInput } from 'react-native';
import { supabase } from '../../src/services/supabase';

const TaskManager = () => {
    const [tasks, setTasks] = useState([]); // Remove Task type
    const [newTask, setNewTask] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('tasks')
                .select('*');

            if (error) {
                throw new Error(error.message);
            }

            console.log('Fetched tasks:', data);
            setTasks(data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
            Alert.alert('Error fetching tasks', error.message);
        } finally {
            setLoading(false);
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
            fetchTasks();
            Alert.alert('Success', 'Task added successfully!');
        }
    };

    const handleCompleteTask = async (taskId) => { // Remove type annotation
        const { error } = await supabase.from('tasks').update({ completed: true }).eq('id', taskId);
        if (error) {
            Alert.alert('Error completing task', error.message);
        } else {
            fetchTasks();
            Alert.alert('Success', 'Task marked as completed!');
        }
    };

    const handleUpdateTask = async (taskId, updatedContent) => { // New function to update a task
        const { error } = await supabase
            .from('tasks')
            .update({ content: updatedContent }) // Update task content
            .eq('id', taskId);
        if (error) {
            Alert.alert('Error updating task', error.message);
        } else {
            fetchTasks();
            Alert.alert('Success', 'Task updated successfully!');
        }
    };

    const handleDeleteTask = async (taskId) => { // New function to delete a task
        const { error } = await supabase
            .from('tasks')
            .delete()
            .eq('id', taskId);
        if (error) {
            Alert.alert('Error deleting task', error.message);
        } else {
            fetchTasks();
            Alert.alert('Success', 'Task deleted successfully!');
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return (
        <View style={styles.container}>
            {loading && <Text>Loading tasks...</Text>}
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
                        {!item.completed && (
                            <>
                                <Button title="Complete" onPress={() => handleCompleteTask(item.id)} />
                                <Button title="Update" onPress={() => handleUpdateTask(item.id, 'New Content')} />
                                <Button title="Delete" onPress={() => handleDeleteTask(item.id)} />
                            </>
                        )}
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