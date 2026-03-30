import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import AddMatchScreen from '../screens/AddMatchScreen';
import HistoryScreen from '../screens/HistoryScreen';
import MatchDetailsScreen from '../screens/MatchDetailsScreen';

import LoginScreen from '../screens/LoginScreen';
import SignupScreen from '../screens/SignupScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import { AuthContext } from '../context/AuthContext';
import { View, ActivityIndicator } from 'react-native';
import { colors } from '../utils/colors';

const Stack = createStackNavigator();
const AuthStack = createStackNavigator();

const AuthNavigator = () => (
    <AuthStack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: colors.bg }
        }}
    >
        <AuthStack.Screen name="Welcome" component={WelcomeScreen} />
        <AuthStack.Screen name="Login" component={LoginScreen} />
        <AuthStack.Screen name="Signup" component={SignupScreen} />
    </AuthStack.Navigator>
);

const AppNavigator = () => {
    const { user, isLoading } = React.useContext(AuthContext);

    if (isLoading) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg }}>
                <ActivityIndicator size="large" color={colors.primary} />
            </View>
        );
    }

    return (
        <Stack.Navigator
            initialRouteName={user ? "Home" : "Auth"}
            screenOptions={{
                headerStyle: {
                    backgroundColor: colors.primary,
                },
                headerTintColor: colors.white,
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
                cardStyle: {
                    backgroundColor: colors.bg
                }
            }}
        >
            {!user ? (
                <Stack.Screen
                    name="Auth"
                    component={AuthNavigator}
                    options={{ headerShown: false }}
                />
            ) : (
                <>
                    <Stack.Screen
                        name="Home"
                        component={HomeScreen}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="AddMatch"
                        component={AddMatchScreen}
                        options={{ title: 'Record Match' }}
                    />
                    <Stack.Screen
                        name="History"
                        component={HistoryScreen}
                        options={{ title: 'History' }}
                    />
                    <Stack.Screen
                        name="MatchDetails"
                        component={MatchDetailsScreen}
                        options={{ title: 'Match Details' }}
                    />
                </>
            )}
        </Stack.Navigator>
    );
};
export default AppNavigator;
