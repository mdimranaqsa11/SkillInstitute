import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import InstituteDetailsScreen from '../screens/profile/InstituteDetailsScreen';
import InstituteProfileScreen from '../screens/profile/InstituteProfileScreen';

const Stack = createNativeStackNavigator();

export default function DashboardStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DashboardHome" component={DashboardScreen} />
      <Stack.Screen name="InstituteDetails" component={InstituteDetailsScreen} />
      <Stack.Screen name="InstituteProfile" component={InstituteProfileScreen} />
    </Stack.Navigator>
  );
}
