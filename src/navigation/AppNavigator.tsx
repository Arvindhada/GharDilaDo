import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { UserRole } from '../data/properties';

import TabNavigator from './TabNavigator';
import OnboardingScreen1 from '../screens/OnboardingScreen1';
import OnboardingScreen2 from '../screens/OnboardingScreen2';
import OnboardingScreen3 from '../screens/OnboardingScreen3';
import WelcomeScreen from '../screens/WelcomeScreen';
import OTPScreen from '../screens/OTPScreen';
import ListingsScreen from '../screens/ListingsScreen';
import PropertyDetailScreen from '../screens/PropertyDetailScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import SettingsScreen from '../screens/SettingsScreen';
import AddListingScreen from '../screens/AddListingScreen';
import HelpScreen from '../screens/HelpScreen';
import PrivacyScreen from '../screens/PrivacyScreen';
import DashboardScreen from '../screens/DashboardScreen';
import FilterScreen from '../screens/FilterScreen';

export type RootStackParamList = {
    Onboarding1: undefined;
    Onboarding2: undefined;
    Onboarding3: undefined;
    Welcome: undefined;
    OTP: { phone: string; role: UserRole };
    MainTabs: { screen?: string; params?: any } | undefined;
    Listings: { locality?: string; type?: string; featured?: boolean };
    PropertyDetail: { propertyId: string };
    Notifications: undefined;
    Settings: undefined;
    AddListing: undefined;
    Help: undefined;
    Privacy: undefined;
    Dashboard: undefined;
    Filter: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
    return (
        <Stack.Navigator
            initialRouteName="Onboarding1"
            screenOptions={{ headerShown: false, animation: 'slide_from_right' }}
        >
            <Stack.Screen name="Onboarding1" component={OnboardingScreen1} />
            <Stack.Screen name="Onboarding2" component={OnboardingScreen2} />
            <Stack.Screen name="Onboarding3" component={OnboardingScreen3} />
            <Stack.Screen name="Welcome" component={WelcomeScreen} />
            <Stack.Screen name="OTP" component={OTPScreen} />
            <Stack.Screen name="MainTabs" component={TabNavigator} />
            <Stack.Screen name="Listings" component={ListingsScreen} />
            <Stack.Screen name="PropertyDetail" component={PropertyDetailScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
            <Stack.Screen name="AddListing" component={AddListingScreen} />
            <Stack.Screen name="Help" component={HelpScreen} />
            <Stack.Screen name="Privacy" component={PrivacyScreen} />
            <Stack.Screen name="Dashboard" component={DashboardScreen} />
            <Stack.Screen name="Filter" component={FilterScreen} />
        </Stack.Navigator>
    );
}
