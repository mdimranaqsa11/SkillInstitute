import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, radius, typography, spacing } from '../../constants';
import Icon from '../common/Icon';
import StatusBadge from '../common/StatusBadge';
import { formatDateTime } from '../../utils/formatDate';

export function ExamCard({ exam, onPress }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.headerRow}>
        <StatusBadge status={exam.status} />
        <Icon name="chevron-right" size={20} color={colors.outline} />
      </View>
      <Text style={styles.title}>{exam.title}</Text>
      {!!exam.courseName && <Text style={styles.subject}>{exam.courseName}</Text>}

      <View style={styles.metaGrid}>
        <View style={styles.metaCell}>
          <Text style={styles.metaLabel}>Duration</Text>
          <Text style={styles.metaValue}>{exam.duration_minutes} min</Text>
        </View>
        <View style={styles.metaCell}>
          <Text style={styles.metaLabel}>Total Marks</Text>
          <Text style={styles.metaValue}>{exam.total_marks}</Text>
        </View>
      </View>

      {!!exam.starts_at && (
        <View style={styles.footer}>
          <Icon name="schedule" size={16} color={colors.onSurfaceVariant} />
          <Text style={styles.footerText}>{formatDateTime(exam.starts_at)}</Text>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
    padding: 20,
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
  title: {
    ...typography.headlineMd,
    fontSize: 18,
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
    marginBottom: spacing.sm,
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
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceVariant,
  },
  footerText: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
  },
});
