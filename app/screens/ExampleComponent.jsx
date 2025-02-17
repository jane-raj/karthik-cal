import React, { useEffect, useState } from 'react';
import { View, Text, Alert } from 'react-native';
import { supabase } from '../../services/supabase';

const ExampleComponent = () => {
    const [data, setData] = useState([]);

    const fetchData = async () => {
        try {
            const { data: fetchedData, error } = await supabase.from('your_table_name').select('*');
            if (error) throw error;
            setData(fetchedData);
        } catch (error) {
            Alert.alert('Error fetching data', error.message);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <View>
            {data.map(item => (
                <Text key={item.id}>{item.name}</Text> // Adjust according to your data structure
            ))}
        </View>
    );
};

export default ExampleComponent; 