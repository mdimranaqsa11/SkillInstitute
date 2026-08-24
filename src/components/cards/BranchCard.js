import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, radius, typography, spacing } from '../../constants';
import Icon from '../common/Icon';

export default function BranchCard({ branch, onPress }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <View style={[styles.iconWrap, { backgroundColor: `${branch.tint}1A` }]}>
            <Icon name={branch.icon} size={22} color={branch.tint} />
          </View>
          <View>
            <Text style={styles.name}>{branch.name}</Text>
            <View style={styles.statusRow}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>Active</Text>
            </View>
          </View>
        </View>
        <Icon name="more-vert" size={20} color={colors.onSurfaceVariant} />
      </View>

      <View style={styles.metaGrid}>
        <View style={styles.metaCell}>
          <Text style={styles.metaLabel}>Students</Text>
          <View style={styles.metaValueRow}>
            <Icon name="group" size={18} color={branch.tint} />
            <Text style={styles.metaValue}>{branch.students}</Text>
          </View>
        </View>
        <View style={styles.metaCell}>
          <Text style={styles.metaLabel}>Administrator</Text>
          <View style={styles.metaValueRow}>
            <Icon name="person" size={18} color={branch.tint} />
            <Text style={styles.metaValue}>{branch.admin}</Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.contactCol}>
        <View style={styles.contactRow}>
          <Icon name="location-on" size={20} color={colors.outline} />
          <Text style={styles.contactText}>{branch.address}</Text>
        </View>
        <View style={styles.contactRow}>
          <Icon name="call" size={20} color={colors.outline} />
          <Text style={styles.contactText}>{branch.phone}</Text>
        </View>
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
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  statusText: {
    ...typography.labelMd,
    fontSize: 11,
    color: colors.secondary,
  },
  metaGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  metaCell: {
    flex: 1,
  },
  metaLabel: {
    ...typography.labelMd,
    color: colors.outline,
    marginBottom: 4,
  },
  metaValueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaValue: {
    ...typography.bodyLg,
    fontWeight: '600',
    color: colors.onSurface,
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
