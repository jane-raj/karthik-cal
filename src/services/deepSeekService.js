import axios from 'axios';

export const getNutritionData = async (foodItem) => {
    // Replace with your actual API endpoint and logic
    const response = await axios.get(`${foodItem}`);

    if (response.data) {
        return {
            calories: response.data.calories, // Adjust based on your API response
            // Add other nutritional information if needed
        };
    } else {
        throw new Error('Failed to fetch nutrition data');
    }
}; 