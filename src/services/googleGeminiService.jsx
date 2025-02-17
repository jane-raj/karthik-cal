import axios from 'axios';

// Load environment variable
const GOOGLE_GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;

export const analyzeFoodImage = async (imageUri) => {
  try {
    const response = await axios.post('https://gemini.googleapis.com/v1/analyze', {
      image: imageUri,
      key: GOOGLE_GEMINI_API_KEY,
    });

    // Assuming the response contains the identified food item
    const foodItem = response.data.foodItem; // Adjust based on actual API response structure
    return { foodItem };
  } catch (error) {
    throw new Error('Error analyzing food image: ' + error.message);
  }
}; 