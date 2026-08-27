import React, { useState } from 'react';
import { View, Text, Pressable, Modal, FlatList, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, radius, spacing, typography } from '../../constants';
import Icon from '../common/Icon';

function Separator() {
  return <View style={styles.separator} />;
}

// Bottom-sheet style select. `options` is [{ label, value }]; `action` (optional) renders
// an extra row below the list, e.g. "Manage categories", for flows a flat list can't cover.
export default function Dropdown({
  label,
  icon,
  value,
  options,
  placeholder = 'Select',
  onChange,
  action,
  style,
}) {
  const [open, setOpen] = useState(false);
  const insets = useSafeAreaInsets();
  const selected = options.find(o => o.value === value);

  return (
    <View style={style}>
      {!!label && <Text style={styles.label}>{label}</Text>}
      <Pressable
        style={({ pressed }) => [styles.trigger, pressed && styles.triggerPressed]}
        onPress={() => setOpen(true)}
      >
        {!!icon && <Icon name={icon} size={18} color={colors.onSurfaceVariant} style={styles.triggerIcon} />}
        <Text style={[styles.flex1, selected ? styles.value : styles.placeholder]} numberOfLines={1}>
          {selected ? selected.label : placeholder}
        </Text>
        <Icon name="expand-more" size={20} color={colors.outline} />
      </Pressable>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <Pressable style={[styles.sheet, { paddingBottom: insets.bottom + spacing.md }]} onPress={() => {}}>
            <View style={styles.sheetHandle} />
            <View style={styles.sheetHeader}>
              <Text style={styles.sheetTitle}>{label || placeholder}</Text>
              <Pressable hitSlop={8} onPress={() => setOpen(false)}>
                <Icon name="close" size={20} color={colors.onSurfaceVariant} />
              </Pressable>
            </View>

            <FlatList
              data={options}
              keyExtractor={item => String(item.value)}
              style={styles.list}
              ItemSeparatorComponent={Separator}
              renderItem={({ item }) => {
                const active = item.value === value;
                return (
                  <Pressable
                    style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
                    onPress={() => {
                      onChange(item.value);
                      setOpen(false);
                    }}
                  >
                    <Text style={[styles.optionText, active && styles.optionTextActive]}>{item.label}</Text>
                    {active && <Icon name="check" size={18} color={colors.primary} />}
                  </Pressable>
                );
              }}
              ListEmptyComponent={<Text style={styles.emptyText}>No options yet</Text>}
            />

            {!!action && (
              <Pressable
                style={({ pressed }) => [styles.action, pressed && styles.optionPressed]}
                onPress={() => {
                  setOpen(false);
                  action.onPress();
                }}
              >
                <Icon name={action.icon || 'add'} size={18} color={colors.primary} />
                <Text style={styles.actionText}>{action.label}</Text>
              </Pressable>
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    ...typography.labelMd,
    color: colors.onSurface,
    marginBottom: spacing.xs,
  },
  flex1: {
    flex: 1,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainerLowest,
    paddingHorizontal: spacing.md,
  },
  triggerPressed: {
    backgroundColor: colors.surfaceContainerLow,
  },
  triggerIcon: {
    marginRight: -2,
  },
  value: {
    ...typography.bodyMd,
    color: colors.onSurface,
  },
  placeholder: {
    ...typography.bodyMd,
    color: colors.outline,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(25,27,35,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surfaceContainerLowest,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingTop: spacing.sm,
    paddingHorizontal: spacing.lg,
    maxHeight: '65%',
  },
  sheetHandle: {
    width: 36,
    height: 4,
    borderRadius: radius.full,
    backgroundColor: colors.outlineVariant,
    alignSelf: 'center',
    marginBottom: spacing.md,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },
  sheetTitle: {
    ...typography.headlineMd,
    fontSize: 16,
    color: colors.onSurface,
  },
  list: {
    flexGrow: 0,
  },
  separator: {
    height: 1,
    backgroundColor: colors.surfaceVariant,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  optionPressed: {
    opacity: 0.6,
  },
  optionText: {
    ...typography.bodyLg,
    color: colors.onSurface,
  },
  optionTextActive: {
    fontWeight: '700',
    color: colors.primary,
  },
  emptyText: {
    ...typography.bodyMd,
    color: colors.outline,
    paddingVertical: spacing.lg,
    textAlign: 'center',
  },
  action: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceVariant,
  },
  actionText: {
    ...typography.bodyMd,
    fontWeight: '700',
    color: colors.primary,
  },
});
