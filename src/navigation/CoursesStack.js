import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CoursesScreen from '../screens/courses/CoursesScreen';
import CourseDetailsScreen from '../screens/courses/CourseDetailsScreen';
import CourseFormScreen from '../screens/courses/CourseFormScreen';
import CourseCategoriesScreen from '../screens/courses/CourseCategoriesScreen';
import CourseModulesScreen from '../screens/courses/CourseModulesScreen';
import ModuleFormScreen from '../screens/courses/ModuleFormScreen';
import CourseLessonsScreen from '../screens/courses/CourseLessonsScreen';
import LessonDetailScreen from '../screens/courses/LessonDetailScreen';
import EnrollmentRequestsScreen from '../screens/courses/EnrollmentRequestsScreen';
import CourseEnrollmentsScreen from '../screens/courses/CourseEnrollmentsScreen';
import CoursePreviewScreen from '../screens/courses/CoursePreviewScreen';
import CourseExamsScreen from '../screens/exams/CourseExamsScreen';
import ExamFormScreen from '../screens/exams/ExamFormScreen';
import ExamDetailsScreen from '../screens/exams/ExamDetailsScreen';
import ExamQuestionsScreen from '../screens/exams/ExamQuestionsScreen';
import ExamEnrollmentsScreen from '../screens/exams/ExamEnrollmentsScreen';
import ExamAttemptsListScreen from '../screens/exams/ExamAttemptsListScreen';
import AttemptDetailsScreen from '../screens/exams/AttemptDetailsScreen';

const Stack = createNativeStackNavigator();

export default function CoursesStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CoursesList" component={CoursesScreen} />
      <Stack.Screen name="CourseDetails" component={CourseDetailsScreen} />
      <Stack.Screen name="CourseForm" component={CourseFormScreen} />
      <Stack.Screen name="CourseCategories" component={CourseCategoriesScreen} />
      <Stack.Screen name="CourseModules" component={CourseModulesScreen} />
      <Stack.Screen name="ModuleForm" component={ModuleFormScreen} />
      <Stack.Screen name="CourseLessons" component={CourseLessonsScreen} />
      <Stack.Screen name="LessonDetail" component={LessonDetailScreen} />
      <Stack.Screen name="EnrollmentRequests" component={EnrollmentRequestsScreen} />
      <Stack.Screen name="CourseEnrollments" component={CourseEnrollmentsScreen} />
      <Stack.Screen name="CoursePreview" component={CoursePreviewScreen} />
      <Stack.Screen name="CourseExams" component={CourseExamsScreen} />
      <Stack.Screen name="ExamForm" component={ExamFormScreen} />
      <Stack.Screen name="ExamDetails" component={ExamDetailsScreen} />
      <Stack.Screen name="ExamQuestions" component={ExamQuestionsScreen} />
      <Stack.Screen name="ExamEnrollments" component={ExamEnrollmentsScreen} />
      <Stack.Screen name="ExamAttemptsList" component={ExamAttemptsListScreen} />
      <Stack.Screen name="AttemptDetails" component={AttemptDetailsScreen} />
    </Stack.Navigator>
  );
}
