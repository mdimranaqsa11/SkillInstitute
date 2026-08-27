import React from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, typography, spacing } from '../../constants';
import Icon from '../../components/common/Icon';

// The institute-backend API has no password-reset flow at all (no forgot-password,
// OTP, or reset endpoint) — this is intentionally not a mocked wizard.
export default function ForgotPasswordScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Pressable onPress={() => navigation.goBack()} style={styles.backButton} hitSlop={8}>
              <Icon name="arrow-back" size={22} color={colors.onSurfaceVariant} />
            </Pressable>
            <Text style={styles.brand}>Skill Institute</Text>
            <View style={styles.backButton} />
          </View>

          <View style={styles.unavailableWrap}>
            <View style={styles.iconWrap}>
              <Icon name="lock-reset" size={28} color={colors.unavailable} />
              <View style={styles.crossBadge}>
                <Icon name="close" size={14} color={colors.onError} />
              </View>
            </View>
            <Text style={styles.title}>Not available via API</Text>
            <Text style={styles.description}>
              The institute-backend has no password-reset endpoint yet — there's no forgot-password, OTP,
              or reset flow to call. Contact your institute admin to have your password changed directly.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
  },
  card: {
    width: '100%',
    maxWidth: 440,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
    padding: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brand: {
    ...typography.headlineLgMobile,
    fontSize: 20,
    color: colors.primary,
    fontWeight: '700',
  },
  unavailableWrap: {
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.lg,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.unavailableBorder,
    backgroundColor: colors.unavailableBg,
  },
  iconWrap: {
    marginBottom: spacing.sm,
  },
  crossBadge: {
    position: 'absolute',
    right: -6,
    top: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.headlineMd,
    fontSize: 16,
    color: colors.unavailable,
  },
  description: {
    ...typography.bodyMd,
    color: colors.unavailable,
    textAlign: 'center',
  },
});
