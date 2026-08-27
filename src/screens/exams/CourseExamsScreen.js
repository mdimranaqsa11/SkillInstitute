import React, { useCallback, useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../../constants';
import { can } from '../../constants/roles';
import DetailHeader from '../../components/navigation/DetailHeader';
import EmptyState from '../../components/feedback/EmptyState';
import Fab from '../../components/common/Fab';
import { ExamCard } from '../../components/cards/ExamCard';
import { useAuth } from '../../context/AuthContext';
import { listCourseExams } from '../../api/exams';

export default function CourseExamsScreen({ route, navigation }) {
  const { courseId, courseName } = route.params;
  const { user } = useAuth();
  const canWrite = can(user, 'writeContent');

  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const { data } = await listCourseExams(courseId);
      setExams(data);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    const unsub = navigation.addListener('focus', load);
    return unsub;
  }, [navigation, load]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <DetailHeader title={courseName ? `${courseName} — Exams` : 'Exams'} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <ActivityIndicator color={colors.primary} style={styles.loader} />
        ) : (
          <View style={styles.list}>
            {exams.length === 0 && (
              <EmptyState icon="quiz" title="No exams yet" description={canWrite ? 'Tap + to create your first exam.' : 'No exams have been created for this course.'} />
            )}
            {exams.map(exam => (
              <ExamCard key={exam.id} exam={exam} onPress={() => navigation.navigate('ExamDetails', { examId: exam.id })} />
            ))}
          </View>
        )}
      </ScrollView>
      {canWrite && (
        <Fab style={styles.fab} onPress={() => navigation.navigate('ExamForm', { courseId, courseName })} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: {
    padding: spacing.containerPadding,
    gap: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  loader: {
    marginTop: spacing.xl,
  },
  list: {
    gap: spacing.md,
  },
  fab: {
    bottom: 24,
  },
});
