import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing, typography } from '../../constants';
import { can } from '../../constants/roles';
import DetailHeader from '../../components/navigation/DetailHeader';
import Icon from '../../components/common/Icon';
import PrimaryButton from '../../components/common/PrimaryButton';
import SecondaryButton from '../../components/common/SecondaryButton';
import StatusBadge from '../../components/common/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { useAlert } from '../../context/AlertContext';
import { getExam, publishExam, closeExam, deleteExam, getExamStatistics, getExamAttempts } from '../../api/exams';
import { ApiError } from '../../api/client';

export default function ExamDetailsScreen({ route, navigation }) {
  const { examId } = route.params;
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const canWrite = can(user, 'writeContent');

  const [exam, setExam] = useState(null);
  const [stats, setStats] = useState(null);
  const [attemptCount, setAttemptCount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState(null);

  const load = useCallback(async () => {
    try {
      const { data: e } = await getExam(examId);
      setExam(e);
      if (e.status !== 'DRAFT') {
        const [{ data: s }, { data: attempts }] = await Promise.all([
          getExamStatistics(examId).catch(() => ({ data: null })),
          getExamAttempts(examId).catch(() => ({ data: [] })),
        ]);
        setStats(s);
        setAttemptCount(attempts.length);
      }
    } finally {
      setLoading(false);
    }
  }, [examId]);

  useEffect(() => {
    const unsub = navigation.addListener('focus', load);
    return unsub;
  }, [navigation, load]);

  const handlePublish = async () => {
    setActionLoading(true);
    setActionError(null);
    try {
      await publishExam(examId);
      load();
    } catch (e) {
      setActionError(e instanceof ApiError ? e.message : 'Could not publish exam');
    } finally {
      setActionLoading(false);
    }
  };

  const handleClose = () => {
    showAlert('Close exam?', 'Students will no longer be able to attempt this exam, and gated results become visible.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Close',
        style: 'destructive',
        onPress: async () => {
          setActionLoading(true);
          setActionError(null);
          try {
            await closeExam(examId);
            load();
          } catch (e) {
            setActionError(e instanceof ApiError ? e.message : 'Could not close exam');
          } finally {
            setActionLoading(false);
          }
        },
      },
    ]);
  };

  const handleDelete = () => {
    showAlert('Archive exam?', 'This exam will be archived and no longer usable.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Archive',
        style: 'destructive',
        onPress: async () => {
          setActionLoading(true);
          setActionError(null);
          try {
            await deleteExam(examId);
            navigation.goBack();
          } catch (e) {
            setActionError(e instanceof ApiError ? e.message : 'Could not archive exam');
            setActionLoading(false);
          }
        },
      },
    ]);
  };

  if (loading || !exam) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <DetailHeader title="Exam Details" onBack={() => navigation.goBack()} />
        <ActivityIndicator color={colors.primary} style={styles.loader} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <DetailHeader title="Exam Details" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Text style={styles.title}>{exam.title}</Text>
            <StatusBadge status={exam.status} />
          </View>
          {!!exam.description && <Text style={styles.description}>{exam.description}</Text>}

          <View style={styles.metaGrid}>
            <MetaCell label="Duration" value={`${exam.duration_minutes} min`} />
            <MetaCell label="Passing Marks" value={String(exam.passing_marks)} />
            <MetaCell label="Total Marks" value={String(exam.total_marks)} />
            <MetaCell label="Max Attempts" value={String(exam.max_attempts)} />
          </View>

          {actionError && <Text style={styles.error}>{actionError}</Text>}

          {canWrite && (
            <View style={styles.statusActions}>
              <SecondaryButton title="Edit Exam" onPress={() => navigation.navigate('ExamForm', { exam })} />
              {exam.status === 'DRAFT' && (
                <PrimaryButton title="Publish Exam" onPress={handlePublish} loading={actionLoading} />
              )}
              {exam.status === 'PUBLISHED' && (
                <SecondaryButton title="Close Exam" onPress={handleClose} disabled={actionLoading} />
              )}
              {exam.status !== 'ARCHIVED' && (
                <SecondaryButton title="Archive Exam" onPress={handleDelete} disabled={actionLoading} />
              )}
            </View>
          )}
        </View>

        {stats && (
          <View style={styles.card}>
            <Text style={styles.section}>Statistics</Text>
            <View style={styles.statsGrid}>
              <MetaCell label="Enrolled" value={String(stats.total_enrolled)} />
              <MetaCell label="Submitted" value={String(stats.submitted)} />
              <MetaCell label="Passed" value={String(stats.passed)} />
              <MetaCell label="Failed" value={String(stats.failed)} />
              <MetaCell label="Avg Score" value={String(stats.average_score)} />
              <MetaCell label="Not Attempted" value={String(stats.not_attempted)} />
            </View>
          </View>
        )}

        <View style={styles.linksGrid}>
          <NavLink
            icon="quiz"
            label="Questions"
            sub={exam.status === 'DRAFT' ? 'Build the question set' : 'View question set (locked)'}
            onPress={() => navigation.navigate('ExamQuestions', { examId, examStatus: exam.status })}
          />
          <NavLink
            icon="how-to-reg"
            label="Student Enrollments"
            sub="Who can attempt this exam"
            onPress={() => navigation.navigate('ExamEnrollments', { examId })}
          />
          {attemptCount !== null && (
            <NavLink
              icon="assignment"
              label="Attempts"
              sub={`${attemptCount} attempt${attemptCount === 1 ? '' : 's'}`}
              onPress={() => navigation.navigate('ExamAttemptsList', { examId })}
            />
          )}
        </View>
      </ScrollView>
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

function NavLink({ icon, label, sub, onPress }) {
  return (
    <Pressable style={styles.linkRow} onPress={onPress}>
      <View style={styles.linkIcon}>
        <Icon name={icon} size={22} color={colors.primary} />
      </View>
      <View style={styles.flex1}>
        <Text style={styles.linkLabel}>{label}</Text>
        <Text style={styles.linkSub}>{sub}</Text>
      </View>
      <Icon name="chevron-right" size={20} color={colors.outline} />
    </Pressable>
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
    ...typography.headlineLg,
    fontSize: 20,
    color: colors.onSurface,
    flex: 1,
  },
  description: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
  metaGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  statsGrid: {
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
  error: {
    ...typography.bodyMd,
    color: colors.error,
  },
  statusActions: {
    gap: spacing.sm,
  },
  section: {
    ...typography.headlineMd,
    fontSize: 16,
    color: colors.onSurface,
  },
  linksGrid: {
    gap: spacing.sm,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
    padding: spacing.md,
  },
  linkIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: `${colors.primary}1A`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkLabel: {
    ...typography.bodyLg,
    fontWeight: '600',
    color: colors.onSurface,
  },
  linkSub: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
});
