import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing, typography } from '../../constants';
import DetailHeader from '../../components/navigation/DetailHeader';
import EmptyState from '../../components/feedback/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';
import { listEnrollments } from '../../api/enrollments';
import { formatDateTime } from '../../utils/formatDate';

export default function CourseEnrollmentsScreen({ route, navigation }) {
  const { courseId, courseName } = route.params;

  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const { data } = await listEnrollments();
      setEnrollments(data.filter(e => e.course_id === courseId));
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
      <DetailHeader title={courseName ? `${courseName} — Enrolled` : 'Enrolled Students'} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <ActivityIndicator color={colors.primary} style={styles.loader} />
        ) : enrollments.length === 0 ? (
          <EmptyState icon="group" title="No students enrolled" description="Students enrolled in this course will show up here." />
        ) : (
          <View style={styles.list}>
            {enrollments.map(e => (
              <View key={e.id} style={styles.row}>
                <View style={styles.rowInfo}>
                  <Text style={styles.rowName}>Student #{e.student_id}</Text>
                  <Text style={styles.rowMeta}>
                    Enrolled {formatDateTime(e.enrolled_at)}
                    {e.completed_at ? ` · Completed ${formatDateTime(e.completed_at)}` : ''}
                  </Text>
                </View>
                <StatusBadge status={e.status} />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
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
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
    padding: spacing.md,
  },
  rowInfo: {
    flex: 1,
    gap: 2,
  },
  rowName: {
    ...typography.bodyLg,
    fontWeight: '600',
    color: colors.onSurface,
  },
  rowMeta: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
  },
});
