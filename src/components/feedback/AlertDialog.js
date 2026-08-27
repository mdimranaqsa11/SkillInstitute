import React, { useEffect, useRef } from 'react';
import { Modal, View, Text, Pressable, StyleSheet, Animated } from 'react-native';
import { colors, radius, spacing, typography } from '../../constants';
import Icon from '../common/Icon';

const VARIANTS = {
  success: { icon: 'check-circle', iconColor: colors.success, iconBg: colors.successContainer, buttonColor: colors.success },
  error: { icon: 'error-outline', iconColor: colors.error, iconBg: colors.errorContainer, buttonColor: colors.error },
  confirm: { icon: 'help-outline', iconColor: colors.tertiary, iconBg: colors.tertiaryFixed, buttonColor: colors.primary },
  info: { icon: 'info-outline', iconColor: colors.primary, iconBg: colors.secondaryContainer, buttonColor: colors.primary },
};

export default function AlertDialog({ visible, title, message, buttons, variant = 'success', onDismiss }) {
  const scale = useRef(new Animated.Value(0.9)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      scale.setValue(0.9);
      opacity.setValue(0);
      Animated.parallel([
        Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 18, bounciness: 6 }),
        Animated.timing(opacity, { toValue: 1, duration: 150, useNativeDriver: true }),
      ]).start();
    }
  }, [visible, scale, opacity]);

  if (!visible) return null;

  const { icon, iconColor, iconBg, buttonColor } = VARIANTS[variant] || VARIANTS.success;
  const list = buttons && buttons.length ? buttons : [{ text: 'OK' }];

  const press = btn => {
    onDismiss();
    btn.onPress && btn.onPress();
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={onDismiss} statusBarTranslucent>
      <View style={styles.overlay}>
        <Animated.View style={[styles.card, { opacity, transform: [{ scale }] }]}>
          <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
            <Icon name={icon} size={26} color={iconColor} />
          </View>
          {!!title && <Text style={styles.title}>{title}</Text>}
          {!!message && <Text style={styles.message}>{message}</Text>}
          <View style={[styles.actions, list.length > 1 && styles.actionsRow]}>
            {list.map((btn, i) => {
              const isCancel = btn.style === 'cancel';
              const isDestructive = btn.style === 'destructive';
              return (
                <Pressable
                  key={i}
                  onPress={() => press(btn)}
                  style={({ pressed }) => [
                    styles.button,
                    list.length > 1 && styles.buttonFlex,
                    isCancel
                      ? styles.buttonOutline
                      : { backgroundColor: isDestructive ? colors.error : buttonColor },
                    pressed && styles.buttonPressed,
                  ]}
                >
                  <Text style={[styles.buttonText, isCancel && styles.buttonTextCancel]}>{btn.text}</Text>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(17,18,23,0.5)',
    padding: spacing.lg,
  },
  card: {
    width: '100%',
    maxWidth: 340,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.xl,
    padding: spacing.lg,
    alignItems: 'center',
    gap: spacing.xs,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.headlineMd,
    fontSize: 18,
    color: colors.onSurface,
    textAlign: 'center',
  },
  message: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: 2,
  },
  actions: {
    width: '100%',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  actionsRow: {
    flexDirection: 'row',
  },
  button: {
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  buttonFlex: {
    flex: 1,
  },
  buttonOutline: {
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  buttonPressed: {
    opacity: 0.85,
  },
  buttonText: {
    ...typography.labelMd,
    fontSize: 15,
    fontWeight: '600',
    color: colors.onPrimary,
  },
  buttonTextCancel: {
    color: colors.onSurfaceVariant,
  },
});
