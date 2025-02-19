import axios from 'axios';

const GEMINI_API_URL = 'https://api.gemini.ai/v1/analyze'; // Replace with the actual endpoint

export const analyzeFoodImage = async (imageUri) => {
  const formData = new FormData();
  formData.append('file', {
    uri: imageUri,
    type: 'image/jpeg', // Adjust based on your image type
    name: 'food.jpg',
  });

  try {
    const response = await axios.post(GEMINI_API_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'Authorization': `Bearer ${process.env.GEMINI_API_KEY}`,
      },
    });
    return response.data; // Adjust based on the response structure
  } catch (error) {
    throw new Error('Error analyzing food image: ' + error.message);
  }
};