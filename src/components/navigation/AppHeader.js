import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, typography, spacing, dimensions, shadow } from '../../constants';
import Avatar from '../common/Avatar';

// Sticky top app bar used across Dashboard / Exams / Courses / Results / Branches.
// Matches the Stitch "TopAppBar" pattern: leading identity block + trailing actions.
export default function AppHeader({
  title,
  subtitle,
  avatarUri,
  avatarName,
  branchLabel,
  rightExtra,
}) {
  return (
    <View style={styles.header}>
      <View style={styles.leading}>
        {(avatarUri || avatarName) && (
          <Avatar uri={avatarUri} name={avatarName} size={40} style={styles.avatar} />
        )}
        <View>
          {!!subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>

      <View style={styles.trailing}>
        {!!branchLabel && (
          <View style={styles.branchChip}>
            <Text style={styles.branchLabel}>{branchLabel}</Text>
          </View>
        )}
        {rightExtra}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: dimensions.topBarHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.containerPadding,
    backgroundColor: colors.surface,
    ...shadow.sm,
  },
  leading: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flexShrink: 1,
  },
  avatar: {
    marginRight: 4,
  },
  subtitle: {
    ...typography.bodyMd,
    fontSize: 13,
    color: colors.onSurfaceVariant,
  },
  title: {
    ...typography.headlineMd,
    fontSize: 18,
    fontWeight: '700',
    color: colors.primary,
  },
  trailing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  branchChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  branchLabel: {
    ...typography.labelMd,
    color: colors.onSurface,
  },
});
