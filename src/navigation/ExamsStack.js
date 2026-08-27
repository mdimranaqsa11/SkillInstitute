import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ExamsScreen from '../screens/exams/ExamsScreen';

const Stack = createNativeStackNavigator();

export default function ExamsStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ExamsList" component={ExamsScreen} />
    </Stack.Navigator>
  );
}
