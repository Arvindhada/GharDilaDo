import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home, Search, Heart, User, LayoutDashboard } from 'lucide-react-native';
import { useAppTheme } from '../context/ThemeContext';

import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import SavedScreen from '../screens/SavedScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AddListingScreen from '../screens/AddListingScreen';
import DashboardScreen from '../screens/DashboardScreen';
import { useAppStore } from '../store/useAppStore';

export type TabParamList = {
    Home: undefined;
    Search: undefined;
    AddListing: undefined;
    Saved: undefined;
    Dashboard: undefined;
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

    if (routeName === 'AddListing') {
        return (
            <View style={styles.fabWrap}>
                <View style={styles.fabInner}>
                    <Text style={styles.fabPlus}>+</Text>
                </View>
            </View>
        );
    }

    if (routeName === 'Saved') return <Heart size={size} color={color} strokeWidth={2} />;
    if (routeName === 'Dashboard') return <LayoutDashboard size={size} color={color} strokeWidth={2} />;
    if (routeName === 'Profile') return <User size={size} color={color} strokeWidth={2} />;
    return null;
};

export default function TabNavigator() {
    const { t } = useAppTheme();
    const userRole = useAppStore(state => state.userRole);
    const isKycd = useAppStore(state => state.isKycd);

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

            {/* Conditional Add Property Tab for Owners/Brokers */}
            {(userRole === 'owner' || userRole === 'broker') && (
                <Tab.Screen
                    name="AddListing"
                    component={AddListingScreen}
                    listeners={({ navigation }) => ({
                        tabPress: (e) => {
                            if (!isKycd) {
                                e.preventDefault();
                                // Navigate to Verification stack screen
                                navigation.navigate('Verification' as any);
                            }
                        },
                    })}
                    options={{
                        tabBarLabel: 'Add Property',
                        tabBarStyle: { display: 'none' } // Hide tab bar on add listing screen
                    }}
                />
            )}

            {userRole === 'seeker' && <Tab.Screen name="Saved" component={SavedScreen} />}

            {(userRole === 'owner' || userRole === 'broker') && (
                <Tab.Screen name="Dashboard" component={DashboardScreen} />
            )}

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
    fabWrap: {
        top: -10,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff', // Or dynamic based on theme if needed
        borderRadius: 30,
        padding: 4,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    fabInner: {
        width: 46,
        height: 46,
        borderRadius: 23,
        backgroundColor: '#0C886B',
        justifyContent: 'center',
        alignItems: 'center',
    },
    fabPlus: {
        color: '#fff',
        fontSize: 28,
        fontWeight: '300',
        marginTop: -3,
    }
});
