import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native';
import { colors, radius, typography, spacing } from '../../constants';
import Icon from '../common/Icon';

export default function Input({
  label,
  icon,
  secureTextEntry,
  error,
  style,
  containerStyle,
  ...rest
}) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(!!secureTextEntry);

  return (
    <View style={[styles.container, containerStyle]}>
      {!!label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputWrap,
          focused && styles.inputWrapFocused,
          error && styles.inputWrapError,
        ]}
      >
        {!!icon && <Icon name={icon} size={20} color={colors.outline} style={styles.leftIcon} />}
        <TextInput
          style={[styles.input, icon && styles.inputWithIcon, style]}
          placeholderTextColor={colors.outlineVariant}
          secureTextEntry={hidden}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          {...rest}
        />
        {secureTextEntry && (
          <Pressable onPress={() => setHidden(!hidden)} style={styles.rightIcon} hitSlop={8}>
            <Icon name={hidden ? 'visibility-off' : 'visibility'} size={20} color={colors.outline} />
          </Pressable>
        )}
      </View>
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    ...typography.labelMd,
    color: colors.onSurface,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceContainerLowest,
    paddingHorizontal: 12,
  },
  inputWrapFocused: {
    borderColor: colors.primary,
  },
  inputWrapError: {
    borderColor: colors.error,
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    padding: 4,
    marginLeft: 4,
  },
  input: {
    flex: 1,
    ...typography.bodyMd,
    fontSize: 15,
    color: colors.onSurface,
    padding: 0,
    height: '100%',
  },
  inputWithIcon: {
    paddingLeft: 0,
  },
  errorText: {
    ...typography.labelMd,
    color: colors.error,
  },
});
