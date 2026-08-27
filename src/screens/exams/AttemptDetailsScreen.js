import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing, typography } from '../../constants';
import DetailHeader from '../../components/navigation/DetailHeader';
import StatusBadge from '../../components/common/StatusBadge';
import Icon from '../../components/common/Icon';
import { getAttemptDetails } from '../../api/examAttempts';

export default function AttemptDetailsScreen({ route, navigation }) {
  const { attemptId } = route.params;
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAttemptDetails(attemptId)
      .then(({ data }) => setAttempt(data))
      .catch(e => setError(e.message || 'Failed to load attempt'))
      .finally(() => setLoading(false));
  }, [attemptId]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <DetailHeader title="Attempt Details" onBack={() => navigation.goBack()} />
      {loading ? (
        <ActivityIndicator color={colors.primary} style={styles.loader} />
      ) : error || !attempt ? (
        <Text style={styles.error}>{error || 'Attempt not found'}</Text>
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.card}>
            <View style={styles.headerRow}>
              <Text style={styles.title}>Student #{attempt.student_id} — Attempt {attempt.attempt_number}</Text>
              <StatusBadge status={attempt.status} />
            </View>
            <View style={styles.metaGrid}>
              <MetaCell label="Score" value={`${attempt.obtained_marks ?? '—'} / ${attempt.total_marks}`} />
              <MetaCell label="Result" value={attempt.result_status} />
              <MetaCell label="Correct" value={String(attempt.correct_answers ?? '—')} />
              <MetaCell label="Wrong" value={String(attempt.wrong_answers ?? '—')} />
              <MetaCell label="Unanswered" value={String(attempt.unanswered ?? '—')} />
              <MetaCell label="Percentage" value={attempt.percentage != null ? `${attempt.percentage}%` : '—'} />
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.section}>Answer Breakdown</Text>
            <View style={styles.answerList}>
              {(attempt.answers || []).map((a, idx) => (
                <View key={a.question_id} style={styles.answerRow}>
                  <Icon
                    name={a.is_correct ? 'check-circle' : a.selected_option_id ? 'cancel' : 'remove-circle-outline'}
                    size={20}
                    color={a.is_correct ? colors.success : a.selected_option_id ? colors.error : colors.outline}
                  />
                  <View style={styles.flex1}>
                    <Text style={styles.answerText} numberOfLines={2}>{idx + 1}. {a.question_text}</Text>
                    <Text style={styles.answerMeta}>{a.marks_obtained} marks</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

function MetaCell({ label, value }) {
  return (
    <View style={styles.metaCell}>
      <Text style={styles.metaLabel}>{label}</Text>
      <Text style={styles.metaValue}>{value}</Text>
    </View>
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
  error: {
    ...typography.bodyMd,
    color: colors.error,
    padding: spacing.containerPadding,
  },
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
    padding: spacing.lg,
    gap: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  flex1: {
    flex: 1,
  },
  title: {
    ...typography.headlineMd,
    fontSize: 16,
    color: colors.onSurface,
    flex: 1,
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  metaCell: {
    flexBasis: '47%',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.DEFAULT,
    padding: spacing.sm,
  },
  metaLabel: {
    fontSize: 10,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  metaValue: {
    ...typography.bodyLg,
    fontWeight: '600',
    color: colors.onSurface,
  },
  section: {
    ...typography.headlineMd,
    fontSize: 16,
    color: colors.onSurface,
  },
  answerList: {
    gap: spacing.sm,
  },
  answerRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
  },
  answerText: {
    ...typography.bodyMd,
    color: colors.onSurface,
  },
  answerMeta: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
  },
});
