import React, { createContext, useContext, useState, ReactNode } from 'react';
import { supabase } from '../../src/services/supabase'; // Adjust if necessary

// Define the type for the user object
interface User {
    id: string; // Unique identifier for the user
    email: string | null | undefined; // Allow email to be null or undefined
    // Add other user properties as needed
}

// Define the type for the context value
interface AuthContextType {
    user: User | null; // User can be null if not authenticated
    signIn: (email: string, password: string) => Promise<void>; // Method to sign in
    signOut: () => Promise<void>; // Method to sign out
}

// Create the AuthContext with the correct type
const AuthContext = createContext<AuthContextType | null>(null); // Initialize with null

// AuthProvider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null); // User state can be null or a User object

    const signIn = async (email: string, password: string) => {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
            throw new Error((error as { message: string }).message);
        }

        // Map the Supabase user to your local User type
        const supabaseUser = data.user;
        const localUser: User = {
            id: supabaseUser.id,
            email: supabaseUser.email || '', // Provide a default value if email is null
            // Map other properties as needed
        };

        setUser(localUser); // Set the user state
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            throw new Error((error as { message: string }).message);
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
