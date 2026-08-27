import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, typography } from '../../constants';
import Icon from '../common/Icon';
import Avatar from '../common/Avatar';
import StatusBadge from '../common/StatusBadge';

export default function ResultRow({ result, index = 0, onPress }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={styles.left}>
        <Avatar name={`Student ${result.student_id}`} index={index} size={40} />
        <View>
          <Text style={styles.name}>Student #{result.student_id}</Text>
          <Text style={styles.meta}>{result.examTitle}{result.courseName ? ` • ${result.courseName}` : ''}</Text>
        </View>
      </View>
      <View style={styles.right}>
        <Text style={styles.grade}>{result.percentage != null ? `${result.percentage}%` : '—'}</Text>
        <StatusBadge status={result.result_status} />
        <Icon name="chevron-right" size={18} color={colors.outline} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(195,198,215,0.2)',
  },
  pressed: {
    backgroundColor: colors.surfaceContainerLow,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    flexShrink: 1,
  },
  name: {
    ...typography.bodyLg,
    fontWeight: '600',
    color: colors.onSurface,
  },
  meta: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  grade: {
    ...typography.headlineMd,
    fontWeight: '700',
    color: colors.onSurface,
  },
});
