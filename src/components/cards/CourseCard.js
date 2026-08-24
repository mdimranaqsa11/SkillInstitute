import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, radius, typography, spacing } from '../../constants';
import Icon from '../common/Icon';

export default function CourseCard({ course, onPress }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={[styles.tint, { backgroundColor: `${course.tint}0D` }]} />
      <View style={styles.headerRow}>
        <View style={[styles.iconWrap, { backgroundColor: `${course.tint}33` }]}>
          <Icon name={course.icon} size={24} color={course.tint} />
        </View>
        <Icon name="more-vert" size={20} color={colors.onSurfaceVariant} />
      </View>
      <View style={styles.body}>
        <Text style={[styles.code, { color: course.tint }]}>{course.code}</Text>
        <Text style={styles.title} numberOfLines={2}>{course.title}</Text>
      </View>
      <View style={styles.footer}>
        <View style={styles.studentsRow}>
          <Icon name="group" size={16} color={colors.onSurfaceVariant} />
          <Text style={styles.studentsText}>{course.students} Students</Text>
        </View>
        <Icon name="chevron-right" size={20} color={colors.outline} />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(195,198,215,0.5)',
    padding: 20,
    gap: spacing.md,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.95,
  },
  tint: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 128,
    height: 128,
    borderBottomLeftRadius: 100,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
  },
  code: {
    ...typography.labelMd,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  title: {
    ...typography.headlineMd,
    fontSize: 18,
    color: colors.onSurface,
    marginTop: 4,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: 'rgba(195,198,215,0.4)',
  },
  studentsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  studentsText: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
});
