import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, StyleSheet, FlatList, TextInput } from 'react-native';
import { supabase } from '../../src/services/supabase'; // Corrected import

const Community = () => {
    const [posts, setPosts] = useState([]); // Specify the type of posts
    const [newPost, setNewPost] = useState('');

    const fetchPosts = async () => {
        const { data, error } = await supabase.from('community_posts').select('*');
        if (error) {
            Alert.alert('Error fetching posts', error.message);
        } else {
            setPosts(data); // Now TypeScript knows data is of type Post[]
        }
    };

    const handleCreatePost = async () => {
        try {
            const { data, error } = await supabase
                .from('community_posts')
                .insert([{ content: newPost, user_id: 'USER_ID' }]); // Replace 'USER_ID' with actual user ID

            if (error) throw error;
            setNewPost('');
            fetchPosts(); // Refresh the list of posts
            Alert.alert('Success', 'Post created successfully!');
        } catch (error) {
            Alert.alert('Error', error.message);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="What's on your mind?"
                value={newPost}
                onChangeText={setNewPost}
                style={styles.input}
            />
            <Button title="Post" onPress={handleCreatePost} />
            <FlatList
                data={posts}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.postContainer}>
                        <Text>{item.content}</Text>
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
    postContainer: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
});

export default Community;