import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, typography, spacing } from '../../constants';
import Icon from '../../components/common/Icon';
import Input from '../../components/forms/Input';
import PrimaryButton from '../../components/common/PrimaryButton';

const STEP_SEND = 1;
const STEP_VERIFY = 2;
const STEP_RESET = 3;
const STEP_DONE = 4;

export default function ForgotPasswordScreen({ navigation }) {
  const [step, setStep] = useState(STEP_SEND);
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState(['', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const otpRefs = [useRef(), useRef(), useRef(), useRef()];

  const handleBack = () => {
    if (step === STEP_SEND) {
      navigation.goBack();
    } else {
      setStep(step - 1);
    }
  };

  const handleOtpChange = (value, index) => {
    const next = [...otp];
    next[index] = value.slice(-1);
    setOtp(next);
    if (value && index < 3) {
      otpRefs[index + 1].current?.focus();
    }
  };

  const resetForNewLogin = () => {
    setStep(STEP_SEND);
    setIdentifier('');
    setOtp(['', '', '', '']);
    setNewPassword('');
    setConfirmPassword('');
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.card}>
            {step !== STEP_DONE && (
              <View style={styles.headerRow}>
                <Pressable onPress={handleBack} style={styles.backButton} hitSlop={8}>
                  <Icon name="arrow-back" size={22} color={colors.onSurfaceVariant} />
                </Pressable>
                <Text style={styles.brand}>Skill Institute</Text>
                <View style={styles.backButton} />
              </View>
            )}

            {step === STEP_SEND && (
              <>
                <View style={styles.stepHeader}>
                  <Text style={styles.stepTitle}>Reset Password</Text>
                  <Text style={styles.stepSubtitle}>
                    Enter your email or mobile number to receive a verification code.
                  </Text>
                </View>
                <Input
                  label="Email or Mobile Number"
                  placeholder="e.g. user@example.com or +1234567890"
                  autoCapitalize="none"
                  value={identifier}
                  onChangeText={setIdentifier}
                />
                <PrimaryButton
                  title="Send OTP"
                  icon="send"
                  onPress={() => setStep(STEP_VERIFY)}
                  style={styles.actionSpacing}
                />
              </>
            )}

            {step === STEP_VERIFY && (
              <>
                <View style={styles.stepHeader}>
                  <Text style={styles.stepTitle}>Verify OTP</Text>
                  <Text style={styles.stepSubtitle}>
                    Enter the 4-digit code sent to your email/mobile.
                  </Text>
                </View>
                <View style={styles.otpRow}>
                  {otp.map((digit, index) => (
                    <TextInput
                      key={index}
                      ref={otpRefs[index]}
                      value={digit}
                      onChangeText={value => handleOtpChange(value, index)}
                      maxLength={1}
                      keyboardType="number-pad"
                      style={styles.otpInput}
                    />
                  ))}
                </View>
                <PrimaryButton
                  title="Verify & Continue"
                  onPress={() => setStep(STEP_RESET)}
                  style={styles.actionSpacing}
                />
                <Pressable style={styles.resendWrap}>
                  <Text style={styles.link}>Resend OTP</Text>
                </Pressable>
              </>
            )}

            {step === STEP_RESET && (
              <>
                <View style={styles.stepHeader}>
                  <Text style={styles.stepTitle}>New Password</Text>
                  <Text style={styles.stepSubtitle}>Create a strong password for your account.</Text>
                </View>
                <View style={styles.form}>
                  <Input
                    label="New Password"
                    placeholder="••••••••"
                    secureTextEntry
                    value={newPassword}
                    onChangeText={setNewPassword}
                  />
                  <Input
                    label="Confirm Password"
                    placeholder="••••••••"
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />
                </View>
                <PrimaryButton
                  title="Update Password"
                  onPress={() => setStep(STEP_DONE)}
                  style={styles.actionSpacing}
                />
              </>
            )}

            {step === STEP_DONE && (
              <View style={styles.successWrap}>
                <View style={styles.successIcon}>
                  <Icon name="check-circle" size={32} color={colors.primary} />
                </View>
                <Text style={styles.stepTitle}>Password reset successfully</Text>
                <Text style={[styles.stepSubtitle, styles.successSubtitle]}>
                  You can now use your new password to log in.
                </Text>
                <PrimaryButton title="Go to Login" onPress={resetForNewLogin} style={styles.fullWidth} />
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: { flex: 1 },
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
  stepHeader: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  stepTitle: {
    ...typography.headlineMd,
    color: colors.onSurface,
    marginBottom: 8,
    textAlign: 'center',
  },
  stepSubtitle: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
  form: {
    gap: spacing.md,
  },
  actionSpacing: {
    marginTop: spacing.md,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: spacing.lg,
  },
  otpInput: {
    width: 48,
    height: 56,
    textAlign: 'center',
    fontSize: 24,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceContainerLowest,
    color: colors.onSurface,
  },
  resendWrap: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  link: {
    ...typography.labelMd,
    color: colors.primary,
  },
  successWrap: {
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  successIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(37,99,235,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  successSubtitle: {
    marginBottom: spacing.xl,
  },
  fullWidth: {
    width: '100%',
  },
});
