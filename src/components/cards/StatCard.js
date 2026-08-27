import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius, shadow, typography, spacing } from '../../constants';
import Icon from '../common/Icon';
import Skeleton from '../feedback/Skeleton';

export default function StatCard({ icon, label, value, tint = colors.primary, tintBg, loading }) {
  return (
    <View style={styles.card}>
      <View style={[styles.iconWrap, { backgroundColor: tintBg || `${tint}1A` }]}>
        <Icon name={icon} size={20} color={tint} />
      </View>
      <View>
        <Text style={styles.label}>{label}</Text>
        {loading ? (
          <Skeleton width={40} height={24} style={styles.valueSkeleton} />
        ) : (
          <Text style={styles.value}>{value}</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: '46%',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
    padding: spacing.md,
    gap: 12,
    ...shadow.sm,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...typography.labelMd,
    fontSize: 11,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  value: {
    ...typography.headlineLgMobile,
    fontSize: 24,
    color: colors.onSurface,
  },
  valueSkeleton: {
    marginTop: 2,
  },
});
