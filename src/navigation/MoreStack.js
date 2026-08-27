import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MoreScreen from '../screens/profile/MoreScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import BranchesScreen from '../screens/branches/BranchesScreen';
import BranchDetailsScreen from '../screens/branches/BranchDetailsScreen';
import BranchFormScreen from '../screens/branches/BranchFormScreen';
import InstituteDetailsScreen from '../screens/profile/InstituteDetailsScreen';
import InstituteProfileScreen from '../screens/profile/InstituteProfileScreen';
import AuditLogsScreen from '../screens/profile/AuditLogsScreen';
import DeleteInstituteScreen from '../screens/settings/DeleteInstituteScreen';

const Stack = createNativeStackNavigator();

export default function MoreStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MoreHome" component={MoreScreen} />
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="Branches" component={BranchesScreen} />
      <Stack.Screen name="BranchDetails" component={BranchDetailsScreen} />
      <Stack.Screen
        name="BranchForm"
        component={BranchFormScreen}
        options={{
          presentation: 'formSheet',
          sheetAllowedDetents: [0.7],
          sheetInitialDetentIndex: 0,
          sheetCornerRadius: 24,
          sheetGrabberVisible: true,
        }}
      />
      <Stack.Screen name="InstituteDetails" component={InstituteDetailsScreen} />
      <Stack.Screen name="InstituteProfile" component={InstituteProfileScreen} />
      <Stack.Screen name="AuditLogs" component={AuditLogsScreen} />
      <Stack.Screen name="DeleteInstitute" component={DeleteInstituteScreen} />
    </Stack.Navigator>
  );
}
