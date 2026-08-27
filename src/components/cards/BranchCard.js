import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, radius, typography, spacing } from '../../constants';
import Icon from '../common/Icon';

const TINTS = [colors.primary, colors.secondary, colors.tertiary];
const ICONS = ['business', 'corporate-fare', 'domain'];
const tintFor = id => TINTS[id % TINTS.length];
const iconFor = id => ICONS[id % ICONS.length];

export default function BranchCard({ branch, onPress }) {
  const tint = tintFor(branch.id);
  const isActive = branch.status === 'ACTIVE';

  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconWrap, { backgroundColor: `${tint}1A` }]}>
            <Icon name={iconFor(branch.id)} size={22} color={tint} />
          </View>
          <View>
            <Text style={styles.name}>{branch.name}</Text>
            <View style={[styles.statusRow, !isActive && styles.statusRowInactive]}>
              <View style={[styles.statusDot, !isActive && styles.statusDotInactive]} />
              <Text style={styles.statusText}>{isActive ? 'Active' : 'Inactive'}</Text>
            </View>
          </View>
        </View>
        <Text style={styles.code}>{branch.code}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.contactCol}>
        {!!branch.email && (
          <View style={styles.contactRow}>
            <Icon name="mail" size={20} color={colors.outline} />
            <Text style={styles.contactText}>{branch.email}</Text>
          </View>
        )}
        {!!branch.phone && (
          <View style={styles.contactRow}>
            <Icon name="call" size={20} color={colors.outline} />
            <Text style={styles.contactText}>{branch.phone}</Text>
          </View>
        )}
      </View>
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
    gap: spacing.md,
  },
  pressed: {
    opacity: 0.96,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flexDirection: 'row',
    gap: 12,
    flexShrink: 1,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  name: {
    ...typography.headlineMd,
    color: colors.onSurface,
  },
  code: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
    backgroundColor: 'rgba(208,225,251,0.3)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  statusRowInactive: {
    backgroundColor: colors.errorContainer,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  statusDotInactive: {
    backgroundColor: colors.error,
  },
  statusText: {
    ...typography.labelMd,
    fontSize: 11,
    color: colors.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.surfaceVariant,
  },
  contactCol: {
    gap: 12,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  contactText: {
    ...typography.bodyMd,
    color: colors.onSurface,
    flexShrink: 1,
  },
});
