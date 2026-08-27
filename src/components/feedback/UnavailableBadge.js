import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, spacing, typography } from '../../constants';
import Icon from '../common/Icon';

/**
 * Flags UI that has no corresponding endpoint in the institute-backend API
 * (e.g. an aggregate stat nothing computes server-side). Deliberately loud —
 * dark blood red + a cross — so it reads as "not real data" rather than a
 * normal error or empty state.
 */
export default function UnavailableBadge({ label = 'Not available via API', compact }) {
  return (
    <View style={[styles.wrap, compact && styles.compact]}>
      <Icon name="close" size={compact ? 12 : 14} color={colors.unavailable} />
      <Text style={[styles.text, compact && styles.textCompact]} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    backgroundColor: colors.unavailableBg,
    borderWidth: 1,
    borderColor: colors.unavailableBorder,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
  },
  compact: {
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  text: {
    ...typography.labelMd,
    fontSize: 11,
    color: colors.unavailable,
  },
  textCompact: {
    fontSize: 10,
  },
});
