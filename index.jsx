import 'dotenv/config'; // Load environment variables
import { AppRegistry } from 'react-native';
import { AuthProvider } from './src/context/AuthContext'; // Ensure this import is correct
import { BrowserRouter as Router} from 'react-router-dom';
import { name as appName } from './app.json';
import Login from './auth/login';
import Register from './auth/register';
import Dashboard from './dashboard/Dashboard';
import CalorieTracker from './screens/CalorieTracker';
import Subscription from './components/subscription/Subscription';
import UserProfile from './screens/UserProfile';
const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Router path="/auth/login" component={Login} />
                <Router path="/auth/register" component={Register} />
                <Router path="/dashboard" component={Dashboard} />
                <Router path="/calories" component={CalorieTracker} />
                <Router path="/subscription" component={Subscription} />
                <Router path="/user-profile" component={UserProfile} />
                <Router path="/task-manager" component={TaskManager} />
                <Router path="/settings" component={Settings} />
                <Router path="/ai-chat" component={AIChat} />
            </Router>
        </AuthProvider>
    );
};

AppRegistry.registerComponent(appName, () => App);