import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing, typography } from '../../constants';
import DetailHeader from '../../components/navigation/DetailHeader';
import EmptyState from '../../components/feedback/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';
import { getExamAttempts } from '../../api/exams';
import { formatDateTime } from '../../utils/formatDate';

export default function ExamAttemptsListScreen({ route, navigation }) {
  const { examId } = route.params;
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getExamAttempts(examId)
      .then(({ data }) => setAttempts(data))
      .finally(() => setLoading(false));
  }, [examId]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <DetailHeader title="Attempts" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <ActivityIndicator color={colors.primary} style={styles.loader} />
        ) : attempts.length === 0 ? (
          <EmptyState icon="assignment" title="No attempts yet" description="Student attempts will appear here once they start the exam." />
        ) : (
          <View style={styles.list}>
            {attempts.map(a => (
              <Pressable
                key={a.id}
                style={styles.row}
                onPress={() => navigation.navigate('AttemptDetails', { attemptId: a.id })}
              >
                <View style={styles.rowInfo}>
                  <Text style={styles.rowName}>Student #{a.student_id} • Attempt {a.attempt_number}</Text>
                  <Text style={styles.rowMeta}>{formatDateTime(a.started_at)}</Text>
                </View>
                <StatusBadge status={a.status} />
              </Pressable>
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
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
    padding: spacing.md,
    gap: spacing.sm,
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
