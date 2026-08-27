import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, shadow, typography, spacing } from '../../constants';
import DetailHeader from '../../components/navigation/DetailHeader';
import Icon from '../../components/common/Icon';
import Input from '../../components/forms/Input';
import PrimaryButton from '../../components/common/PrimaryButton';
import { useAuth } from '../../context/AuthContext';
import { useAlert } from '../../context/AlertContext';
import { deleteInstitute } from '../../api/institutes';
import { ApiError } from '../../api/client';

export default function DeleteInstituteScreen({ navigation }) {
  const { logout } = useAuth();
  const { showAlert } = useAlert();
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const runDelete = async () => {
    setLoading(true);
    try {
      await deleteInstitute(password);
      await logout();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not delete institute.');
    } finally {
      setLoading(false);
    }
  };

  const submit = () => {
    setError(null);
    if (!password) {
      setError('Enter your password to confirm.');
      return;
    }

    showAlert('Delete this institute?', 'Every course, exam, result, and branch under it will be permanently erased. This cannot be undone.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete Everything', style: 'destructive', onPress: runDelete },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <DetailHeader title="Delete Institute" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.warningCard}>
          <Icon name="warning" size={28} color={colors.error} />
          <Text style={styles.warningTitle}>This can't be undone</Text>
          <Text style={styles.warningText}>
            This permanently deletes your institute and everything under it — branches, courses,
            modules, lessons, exams, questions, enrollments, and student results. There is no
            recovery. Students who registered under this institute will remain able to log in to
            their own app, but their courses and exam history here will be gone.
          </Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Current Password"
            icon="lock"
            placeholder="Enter your password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
          {!!error && <Text style={styles.errorText}>{error}</Text>}

          <PrimaryButton
            title="Delete Institute"
            icon="delete-forever"
            iconPosition="left"
            style={styles.deleteButton}
            onPress={submit}
            loading={loading}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: {
    padding: spacing.containerPadding,
    gap: spacing.xl,
    paddingBottom: spacing.xl,
  },
  warningCard: {
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.errorContainer,
    padding: spacing.lg,
    ...shadow.sm,
  },
  warningTitle: {
    ...typography.headlineMd,
    fontSize: 17,
    color: colors.error,
  },
  warningText: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
  },
  form: {
    gap: spacing.md,
  },
  errorText: {
    ...typography.bodyMd,
    color: colors.error,
  },
  deleteButton: {
    backgroundColor: colors.error,
  },
});
