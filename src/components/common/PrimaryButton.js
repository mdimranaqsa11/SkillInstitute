import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { colors, radius, typography } from '../../constants';
import Icon from './Icon';

export default function PrimaryButton({
  title,
  onPress,
  disabled,
  loading,
  icon,
  iconPosition = 'right',
  style,
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        (disabled || loading) && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={colors.onPrimary} />
      ) : (
        <View style={styles.content}>
          {icon && iconPosition === 'left' && (
            <Icon name={icon} size={18} color={colors.onPrimary} style={styles.iconLeft} />
          )}
          <Text style={styles.label}>{title}</Text>
          {icon && iconPosition === 'right' && (
            <Icon name={icon} size={18} color={colors.onPrimary} style={styles.iconRight} />
          )}
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...typography.labelMd,
    fontSize: 15,
    fontWeight: '600',
    color: colors.onPrimary,
  },
  iconLeft: { marginRight: 8 },
  iconRight: { marginLeft: 8 },
});
