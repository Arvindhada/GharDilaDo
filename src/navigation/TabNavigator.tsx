import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Search, Heart, User } from 'lucide-react-native';
import { useAppTheme } from '../context/ThemeContext';

import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import SavedScreen from '../screens/SavedScreen';
import ProfileScreen from '../screens/ProfileScreen';

export type TabParamList = {
    Home: undefined;
    Search: undefined;
    Saved: undefined;
    Profile: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const TabBarIcon = ({ routeName, color, focused }: { routeName: string, color: string, focused: boolean }) => {
    const size = 22;
    if (routeName === 'Home') {
        return (
            <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
                <Home size={size} color={color} strokeWidth={2} />
            </View>
        );
    }
    if (routeName === 'Search') return <Search size={size} color={color} strokeWidth={2} />;
    if (routeName === 'Saved') return <Heart size={size} color={color} strokeWidth={2} />;
    if (routeName === 'Profile') return <User size={size} color={color} strokeWidth={2} />;
    return null;
};

export default function TabNavigator() {
    const { t } = useAppTheme();

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: t.navBg,
                    borderTopColor: t.navBorder,
                    borderTopWidth: 1,
                    height: 72,
                    paddingBottom: 10,
                    paddingTop: 8,
                },
                tabBarActiveTintColor: '#0C886B',
                tabBarInactiveTintColor: t.muted,
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '500',
                },
                tabBarIcon: (props) => <TabBarIcon routeName={route.name} {...props} />,
            })}
        >
            <Tab.Screen name="Home" component={HomeScreen} />
            <Tab.Screen name="Search" component={SearchScreen} />
            <Tab.Screen name="Saved" component={SavedScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    iconWrap: {
        width: 44,
        height: 30,
        borderRadius: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconWrapActive: {
        backgroundColor: 'rgba(12, 136, 107, 0.1)',
    },
});
