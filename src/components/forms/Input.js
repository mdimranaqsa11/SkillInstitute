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
  multiline,
  placeholder,
  value,
  ...rest
}) {
  const [focused, setFocused] = useState(false);
  const [hidden, setHidden] = useState(!!secureTextEntry);

  // Multiline fields keep the native placeholder (it must stay in TextInput's own
  // layout so the box can grow with content); single-line fields get a custom,
  // smaller overlay so the placeholder can differ in size from typed text, which
  // RN's TextInput style can't do on its own since it applies to both.
  const useOverlay = !multiline;
  const showOverlay = useOverlay && !!placeholder && !value;

  return (
    <View style={[styles.container, containerStyle]}>
      {!!label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputWrap,
          multiline && styles.inputWrapMultiline,
          focused && styles.inputWrapFocused,
          error && styles.inputWrapError,
        ]}
      >
        {!!icon && <Icon name={icon} size={20} color={colors.outline} style={styles.leftIcon} />}
        <View style={styles.fieldStack}>
          {showOverlay && (
            <View style={styles.placeholderOverlayWrap} pointerEvents="none">
              <Text style={styles.placeholderOverlayText} numberOfLines={1}>
                {placeholder}
              </Text>
            </View>
          )}
          <TextInput
            style={[
              styles.input,
              icon && styles.inputWithIcon,
              multiline && styles.inputMultiline,
              useOverlay && styles.inputOverlaid,
              style,
            ]}
            placeholder={useOverlay ? undefined : placeholder}
            placeholderTextColor={colors.outline}
            secureTextEntry={hidden}
            multiline={multiline}
            value={value}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            {...rest}
          />
        </View>
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
    fontSize: 13,
    fontWeight: '700',
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    borderColor: colors.surfaceContainerHigh,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceContainerHigh,
    paddingHorizontal: 12,
  },
  inputWrapFocused: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceContainerLowest,
  },
  inputWrapError: {
    borderColor: colors.error,
  },
  inputWrapMultiline: {
    height: undefined,
    minHeight: 120,
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    padding: 4,
    marginLeft: 4,
  },
  fieldStack: {
    flex: 1,
    alignSelf: 'stretch',
    position: 'relative',
  },
  placeholderOverlayWrap: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
  },
  placeholderOverlayText: {
    ...typography.bodyMd,
    fontSize: 12,
    lineHeight: 16,
    color: colors.outline,
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
  inputMultiline: {
    height: undefined,
    textAlignVertical: 'top',
  },
  inputOverlaid: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  errorText: {
    ...typography.labelMd,
    color: colors.error,
  },
});
