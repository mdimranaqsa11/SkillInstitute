import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, radius } from '../../constants';
import DetailHeader from '../../components/navigation/DetailHeader';
import StatusBadge from '../../components/common/StatusBadge';
import Icon from '../../components/common/Icon';
import PrimaryButton from '../../components/common/PrimaryButton';

export default function ExamDetailsScreen({ route, navigation }) {
  const { exam } = route.params;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <DetailHeader title="Exam Details" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <StatusBadge status={exam.status} label={exam.statusLabel} style={styles.badge} />
          <Text style={styles.title}>{exam.title}</Text>
          <Text style={styles.subject}>{exam.subject}</Text>

          <View style={styles.infoGrid}>
            {!!exam.date && (
              <InfoRow icon="calendar-today" label="Date" value={exam.date} />
            )}
            {!!exam.time && <InfoRow icon="schedule" label="Time" value={exam.time} />}
            {!!exam.branch && <InfoRow icon="location-on" label="Location" value={exam.branch} />}
            {exam.status === 'ongoing' && (
              <InfoRow icon="hourglass-top" label="Ends in" value={exam.endsIn} />
            )}
          </View>

          {exam.status === 'ongoing' && (
            <View style={styles.progressBlock}>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${exam.progress}%` }]} />
              </View>
              <Text style={styles.progressLabel}>
                {exam.submitted}/{exam.total} Students Submitted ({exam.progress}%)
              </Text>
            </View>
          )}

          {exam.status === 'completed' && (
            <View style={styles.resultBox}>
              <Text style={styles.resultLabel}>Results</Text>
              <Text style={styles.resultValue}>{exam.resultStatus || 'Published'}</Text>
            </View>
          )}
        </View>

        <PrimaryButton
          title={exam.status === 'ongoing' ? 'Monitor Live' : exam.status === 'completed' ? 'View Results' : 'Edit Exam'}
          icon="arrow-forward"
          onPress={() => {}}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <View style={styles.infoRow}>
      <Icon name={icon} size={18} color={colors.onSurfaceVariant} />
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: {
    padding: spacing.containerPadding,
    gap: spacing.lg,
  },
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
    padding: spacing.lg,
    gap: spacing.md,
  },
  badge: { alignSelf: 'flex-start' },
  title: {
    ...typography.headlineLg,
    fontSize: 22,
    color: colors.onSurface,
  },
  subject: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
  infoGrid: {
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoLabel: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
    width: 80,
  },
  infoValue: {
    ...typography.bodyMd,
    fontWeight: '600',
    color: colors.onSurface,
    flex: 1,
  },
  progressBlock: {
    gap: 8,
    marginTop: spacing.sm,
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surfaceContainerHigh,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  progressLabel: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
  },
  resultBox: {
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.DEFAULT,
    padding: spacing.md,
    marginTop: spacing.sm,
  },
  resultLabel: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
  },
  resultValue: {
    ...typography.bodyLg,
    fontWeight: '700',
    color: colors.onSurface,
    marginTop: 2,
  },
});
