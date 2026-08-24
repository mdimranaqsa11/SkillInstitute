import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, typography, spacing } from '../../constants';
import Icon from './Icon';

export default function ListItem({ icon, label, sublabel, onPress, danger, showChevron = true, right }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.row, pressed && styles.pressed]}>
      <View style={styles.left}>
        {!!icon && (
          <Icon name={icon} size={22} color={danger ? colors.error : colors.onSurfaceVariant} />
        )}
        <View>
          <Text style={[styles.label, danger && styles.dangerText]}>{label}</Text>
          {!!sublabel && <Text style={styles.sublabel}>{sublabel}</Text>}
        </View>
      </View>
      {right || (showChevron && <Icon name="chevron-right" size={20} color={colors.outline} />)}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.containerPadding,
  },
  pressed: {
    backgroundColor: colors.surfaceContainerLow,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  label: {
    ...typography.bodyLg,
    color: colors.onSurface,
  },
  dangerText: {
    color: colors.error,
  },
  sublabel: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
});
