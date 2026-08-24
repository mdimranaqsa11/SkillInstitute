import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
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
import { useAuth } from '../../context/AuthContext';

const LOGO_URI =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuAz9B9StSXHK4JKaLVSZC95Bmu0GLuT2ZtoY4k1CmTwu3HWni-b9wu-Lfriio9RuJsfh9S-YxnbiXu2jTEXDHmA6J9PIpJ8JDKyyAnHIigIz2SswP5tUpqRMA_1L4nKbkdswOX501Zm51A3nj6JImP1FJFSbsCR_doCq3sgjKWGGC5--l5KAQJLj-BHvj_K9pWinkcM5GLZoUfA2F4Ef4GySBBdeUuUaN2KBlC1xox5JiH65QYalkXh';

export default function CreateAccountScreen({ navigation }) {
  const { login } = useAuth();
  const [instituteName, setInstituteName] = useState('');
  const [adminName, setAdminName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);

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
            <View style={styles.header}>
              <Image source={{ uri: LOGO_URI }} style={styles.logo} />
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.subtitle}>Set up your administrator portal</Text>
            </View>

            <View style={styles.form}>
              <Input
                label="Institute Name"
                icon="domain"
                placeholder="e.g. Skill Institute"
                value={instituteName}
                onChangeText={setInstituteName}
              />
              <Input
                label="Admin Name"
                icon="person"
                placeholder="Full Name"
                value={adminName}
                onChangeText={setAdminName}
              />
              <Input
                label="Email Address"
                icon="mail"
                placeholder="admin@example.com"
                autoCapitalize="none"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
              />
              <Input
                label="Mobile Number"
                icon="phone-iphone"
                placeholder="+1 (555) 000-0000"
                keyboardType="phone-pad"
                value={mobile}
                onChangeText={setMobile}
              />
              <Input
                label="Password"
                icon="lock"
                placeholder="••••••••"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              <Input
                label="Confirm Password"
                icon="lock-reset"
                placeholder="••••••••"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />

              <Pressable style={styles.termsRow} onPress={() => setAgreed(!agreed)}>
                <View style={[styles.checkbox, agreed && styles.checkboxChecked]}>
                  {agreed && <Icon name="check" size={14} color={colors.onPrimary} />}
                </View>
                <Text style={styles.termsText}>
                  I agree to the <Text style={styles.link}>Terms of Service</Text> &{' '}
                  <Text style={styles.link}>Privacy Policy</Text>.
                </Text>
              </Pressable>

              <PrimaryButton
                title="Create Account"
                icon="arrow-forward"
                onPress={login}
                disabled={!agreed}
              />
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Already have an account?{' '}
                <Text style={styles.link} onPress={() => navigation.goBack()}>
                  Login here
                </Text>
              </Text>
            </View>
          </View>

          <View style={styles.secureNote}>
            <Icon name="shield" size={16} color={colors.onSurfaceVariant} />
            <Text style={styles.secureText}>Secure Enterprise Portal</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.surface,
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
    gap: spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  header: {
    alignItems: 'center',
    gap: spacing.md,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceContainerHigh,
  },
  title: {
    ...typography.headlineLgMobile,
    color: colors.onSurface,
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
  form: {
    gap: spacing.md,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginTop: spacing.xs,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.outline,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  termsText: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    flex: 1,
  },
  link: {
    color: colors.primary,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceVariant,
  },
  footerText: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
  secureNote: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: spacing.lg,
    opacity: 0.6,
  },
  secureText: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
  },
});
