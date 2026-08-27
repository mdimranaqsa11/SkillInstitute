import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, KeyboardAvoidingView, Platform, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing, typography } from '../../constants';
import { can } from '../../constants/roles';
import DetailHeader from '../../components/navigation/DetailHeader';
import Input from '../../components/forms/Input';
import PrimaryButton from '../../components/common/PrimaryButton';
import EmptyState from '../../components/feedback/EmptyState';
import Icon from '../../components/common/Icon';
import StatusBadge from '../../components/common/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { useAlert } from '../../context/AlertContext';
import { listExamEnrollments, enrollStudentInExam, cancelExamEnrollment } from '../../api/examEnrollments';
import { ApiError } from '../../api/client';

export default function ExamEnrollmentsScreen({ route, navigation }) {
  const { examId } = route.params;
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const canManage = can(user, 'manageEnrollments');

  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      const { data } = await listExamEnrollments(examId);
      setEnrollments(data);
    } finally {
      setLoading(false);
    }
  }, [examId]);

  useEffect(() => {
    load();
  }, [load]);

  const addEnrollment = async () => {
    setError(null);
    const id = Number(studentId);
    if (!id) {
      setError('Enter a valid student ID.');
      return;
    }
    setSaving(true);
    try {
      await enrollStudentInExam(examId, id);
      setStudentId('');
      load();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to enroll student');
    } finally {
      setSaving(false);
    }
  };

  const removeEnrollment = enrollment => {
    showAlert('Cancel enrollment?', `Student #${enrollment.student_id} will no longer be enrolled in this exam.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => cancelExamEnrollment(enrollment.id).then(load).catch(() => {}) },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <DetailHeader title="Student Enrollments" onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {canManage && (
          <View style={styles.form}>
            <Input label="Student ID" placeholder="e.g. 777" keyboardType="numeric" value={studentId} onChangeText={setStudentId} />
            <Text style={styles.hint}>
              Students must have an active enrollment in this exam's course before they can be enrolled here.
            </Text>
            {error && <Text style={styles.error}>{error}</Text>}
            <PrimaryButton title="Enroll Student" onPress={addEnrollment} loading={saving} />
          </View>
        )}

        {loading ? (
          <ActivityIndicator color={colors.primary} style={styles.loader} />
        ) : enrollments.length === 0 ? (
          <EmptyState icon="how-to-reg" title="No students enrolled" description="Enroll a student above so they can attempt this exam." />
        ) : (
          <View style={styles.list}>
            {enrollments.map(e => (
              <View key={e.id} style={styles.row}>
                <Text style={styles.rowName}>Student #{e.student_id}</Text>
                <StatusBadge status={e.status} />
                {canManage && e.status !== 'CANCELLED' && (
                  <Pressable hitSlop={8} onPress={() => removeEnrollment(e)}>
                    <Icon name="close" size={20} color={colors.error} />
                  </Pressable>
                )}
              </View>
            ))}
          </View>
        )}
      </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: {
    padding: spacing.containerPadding,
    gap: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  form: {
    gap: spacing.md,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
    padding: spacing.lg,
  },
  hint: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
  },
  error: {
    ...typography.bodyMd,
    color: colors.error,
  },
  loader: {
    marginTop: spacing.xl,
  },
  list: {
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
    padding: spacing.md,
  },
  rowName: {
    ...typography.bodyLg,
    fontWeight: '600',
    color: colors.onSurface,
    flex: 1,
  },
});
