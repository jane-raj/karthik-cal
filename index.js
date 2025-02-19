import 'dotenv/config'; // Load environment variables
import { AppRegistry } from 'react-native';
import { AuthProvider } from './src/context/AuthContext'; // Ensure this import is correct
import App from './App'; // Your main app component
import { name as appName } from './app.json';

const Main = () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

AppRegistry.registerComponent(appName, () => Main);