import axios from 'axios';

const EDAMAM_APP_ID = process.env.EDAMAM_APP_ID;
const EDAMAM_APP_KEY = process.env.EDAMAM_APP_KEY;

export const getNutritionData = async (foodItem: string) => {
  try {
    const response = await axios.get(`https://api.edamam.com/api/nutrition-data?app_id=${EDAMAM_APP_ID}&app_key=${EDAMAM_APP_KEY}&ingr=${foodItem}`);
    return response.data;
  } catch (error) {
    throw new Error('Error fetching nutrition data: ' + (error as { message: string }).message);
  }
}; 