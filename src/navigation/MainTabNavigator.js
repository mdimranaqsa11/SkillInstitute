import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import BottomNavBar from '../components/navigation/BottomNavBar';
import DashboardStack from './DashboardStack';
import ExamsStack from './ExamsStack';
import CoursesStack from './CoursesStack';
import ResultsStack from './ResultsStack';
import MoreStack from './MoreStack';

const Tab = createBottomTabNavigator();

function renderTabBar(props) {
  return <BottomNavBar {...props} />;
}

export default function MainTabNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={renderTabBar}>
      <Tab.Screen name="Dashboard" component={DashboardStack} />
      <Tab.Screen name="Exams" component={ExamsStack} />
      <Tab.Screen name="Courses" component={CoursesStack} />
      <Tab.Screen name="Results" component={ResultsStack} />
      <Tab.Screen name="More" component={MoreStack} />
    </Tab.Navigator>
  );
}
