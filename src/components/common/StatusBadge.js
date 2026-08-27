import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors, radius } from '../../constants';

const VARIANTS = {
  ongoing: { bg: '#dcfce7', border: '#bbf7d0', text: '#166534' },
  scheduled: { bg: 'rgba(37,99,235,0.12)', border: 'rgba(37,99,235,0.3)', text: colors.primaryContainer },
  completed: { bg: colors.surfaceContainerHighest, border: colors.outlineVariant, text: colors.onSurfaceVariant },
  passed: { bg: 'rgba(212,237,218,0.5)', border: 'transparent', text: '#155724' },
  failed: { bg: 'rgba(255,218,214,0.5)', border: 'transparent', text: colors.onErrorContainer },
  active: { bg: 'rgba(208,225,251,0.5)', border: 'transparent', text: colors.secondary },
  draft: { bg: colors.surfaceContainerHigh, border: colors.outlineVariant, text: colors.onSurfaceVariant },
  published: { bg: '#dcfce7', border: '#bbf7d0', text: '#166534' },
  archived: { bg: colors.surfaceContainerHighest, border: colors.outlineVariant, text: colors.onSurfaceVariant },
  closed: { bg: colors.surfaceContainerHighest, border: colors.outlineVariant, text: colors.onSurfaceVariant },
  pending: { bg: 'rgba(255,219,205,0.4)', border: 'transparent', text: colors.onTertiaryFixedVariant },
  approved: { bg: '#dcfce7', border: '#bbf7d0', text: '#166534' },
  rejected: { bg: 'rgba(255,218,214,0.5)', border: 'transparent', text: colors.onErrorContainer },
  inactive: { bg: 'rgba(255,218,214,0.5)', border: 'transparent', text: colors.onErrorContainer },
  cancelled: { bg: colors.surfaceContainerHighest, border: colors.outlineVariant, text: colors.onSurfaceVariant },
};

export default function StatusBadge({ status, label, style }) {
  const key = status ? status.toLowerCase() : '';
  const variant = VARIANTS[key] || VARIANTS.scheduled;
  return (
    <View style={[styles.badge, { backgroundColor: variant.bg, borderColor: variant.border }, style]}>
      <Text style={[styles.text, { color: variant.text }]}>{label || status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: radius.sm,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
});
