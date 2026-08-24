import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, typography, spacing, dimensions } from '../../constants';
import Icon from '../common/Icon';
import Avatar from '../common/Avatar';

// Sticky top app bar used across Dashboard / Exams / Courses / Results / Branches.
// Matches the Stitch "TopAppBar" pattern: leading identity block + trailing actions.
export default function AppHeader({
  title,
  subtitle,
  avatarUri,
  avatarName,
  onNotificationsPress,
  showNotificationDot = true,
  onBranchPress,
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
          <Pressable style={styles.branchChip} onPress={onBranchPress}>
            <Text style={styles.branchLabel}>{branchLabel}</Text>
            <Icon name="expand-more" size={18} color={colors.onSurfaceVariant} />
          </Pressable>
        )}
        {rightExtra}
        {!!onNotificationsPress && (
          <Pressable style={styles.iconButton} onPress={onNotificationsPress} hitSlop={8}>
            <Icon name="notifications" size={22} color={colors.primary} />
            {showNotificationDot && <View style={styles.dot} />}
          </Pressable>
        )}
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
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceVariant,
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
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
    borderWidth: 2,
    borderColor: colors.surface,
  },
});
