import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, radius, typography, spacing } from '../../constants';
import Icon from '../common/Icon';
import StatusBadge from '../common/StatusBadge';

// Compact card used in the Exams list ("Scheduled" / "Completed" variants).
export function ExamCard({ exam, onPress }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.headerRow}>
        <StatusBadge status={exam.status} label={exam.statusLabel} />
        <Icon name="more-vert" size={20} color={colors.outline} />
      </View>
      <Text style={styles.title}>{exam.title}</Text>
      <Text style={styles.subject}>{exam.subject}</Text>

      {exam.status === 'completed' ? (
        <View style={styles.resultBox}>
          <View>
            <Text style={styles.metaLabel}>Results</Text>
            <Text style={styles.metaValueStrong}>{exam.resultStatus || 'Published'}</Text>
          </View>
          <View style={styles.doneBadge}>
            <Icon name="done-all" size={16} color={colors.onSecondaryContainer} />
          </View>
        </View>
      ) : (
        <View style={styles.metaGrid}>
          <View style={styles.metaCell}>
            <Text style={styles.metaLabel}>Date</Text>
            <Text style={styles.metaValue}>{exam.date}</Text>
          </View>
          <View style={styles.metaCell}>
            <Text style={styles.metaLabel}>Time</Text>
            <Text style={styles.metaValue}>{exam.time}</Text>
          </View>
        </View>
      )}

      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Icon name={exam.status === 'completed' ? 'calendar-today' : 'business'} size={16} color={colors.onSurfaceVariant} />
          <Text style={styles.footerText}>{exam.status === 'completed' ? exam.date : exam.branch}</Text>
        </View>
        {exam.status === 'completed' && (
          <Text style={styles.viewResults}>View Results</Text>
        )}
      </View>
    </Pressable>
  );
}

// Wide highlighted card used for the single "Ongoing" exam at the top of the list.
export function OngoingExamCard({ exam, onPress }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.wideCard, pressed && styles.pressed]}>
      <View style={styles.headerRow}>
        <View style={styles.ongoingMeta}>
          <StatusBadge status="ongoing" label="Ongoing" />
          <View style={styles.rowGap}>
            <Icon name="schedule" size={14} color={colors.onSurfaceVariant} />
            <Text style={styles.endsIn}>Ends in {exam.endsIn}</Text>
          </View>
        </View>
        <Icon name="more-vert" size={20} color={colors.outline} />
      </View>
      <Text style={styles.wideTitle}>{exam.title}</Text>
      <Text style={styles.subject}>{exam.subject}</Text>

      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${exam.progress}%` }]} />
      </View>
      <View style={styles.progressRow}>
        <Text style={styles.footerText}>{exam.submitted}/{exam.total} Students Submitted</Text>
        <Text style={styles.progressPercent}>{exam.progress}%</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          <Icon name="location-on" size={16} color={colors.onSurfaceVariant} />
          <Text style={styles.footerText}>{exam.branch}</Text>
        </View>
        <View style={styles.rowGap}>
          <Text style={styles.viewResults}>Monitor</Text>
          <Icon name="arrow-forward" size={16} color={colors.primary} />
        </View>
      </View>
    </Pressable>
  );
}

const cardBase = {
  backgroundColor: colors.surfaceContainerLowest,
  borderRadius: radius.xl,
  borderWidth: 1,
  borderColor: colors.surfaceVariant,
  padding: 20,
};

const styles = StyleSheet.create({
  card: {
    ...cardBase,
    gap: 4,
  },
  wideCard: {
    ...cardBase,
    gap: 4,
  },
  pressed: {
    transform: [{ scale: 0.98 }],
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  ongoingMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  rowGap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  endsIn: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
  },
  title: {
    ...typography.headlineMd,
    fontSize: 18,
    color: colors.onSurface,
    marginBottom: 4,
  },
  wideTitle: {
    ...typography.headlineMd,
    color: colors.onSurface,
    marginBottom: 4,
  },
  subject: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.md,
  },
  metaGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: spacing.md,
  },
  metaCell: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.DEFAULT,
    padding: 8,
  },
  metaLabel: {
    fontSize: 10,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  metaValue: {
    ...typography.labelMd,
    fontSize: 13,
    color: colors.onSurface,
  },
  metaValueStrong: {
    ...typography.labelMd,
    fontSize: 13,
    fontWeight: '700',
    color: colors.onSurface,
  },
  resultBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.DEFAULT,
    padding: 12,
    marginBottom: spacing.md,
  },
  doneBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.secondaryContainer,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.surfaceContainerHigh,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  progressRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
  },
  progressPercent: {
    ...typography.labelMd,
    color: colors.primary,
    fontWeight: '700',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceVariant,
  },
  footerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  footerText: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
  },
  viewResults: {
    ...typography.labelMd,
    color: colors.primary,
    fontWeight: '700',
  },
});
