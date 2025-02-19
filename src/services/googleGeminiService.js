import axios from 'axios';

export const analyzeFoodImage = async (imageUri) => {
    // Replace with your actual API endpoint and logic
    const response = await axios.post('https://vwsgtspvztdmoafwschx.supabase.co/functions/v1/analyze-food-image', {
        image: imageUri,
    });

    if (response.data) {
        // Assuming the API returns an array of food items
        return { foodItems: response.data.foodItems }; // Adjust based on your API response
    } else {
        throw new Error('Failed to analyze food image');
    }
}; 