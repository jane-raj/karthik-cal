import React, { createContext, useContext, useState } from 'react';
import { supabase } from '../../services/supabase'; // Adjust if necessary

// Create the AuthContext
const AuthContext = createContext(null); // Initialize with null

// AuthProvider component
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // User state can be null or a User object

    const signIn = async (email, password) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            throw new Error(error.message); // Handle error appropriately
        }

        // Map the Supabase user to your local User type
        const supabaseUser = data.user;
        const localUser = {
            id: supabaseUser.id,
            email: supabaseUser.email || '', // Provide a default value if email is null
        };

        setUser(localUser); // Set the user state
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            throw new Error(error.message); // Handle error appropriately
        }
        setUser(null); // Clear the user state
    };

    return (
        <AuthContext.Provider value={{ user, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook to use the AuthContext
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;
