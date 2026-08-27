import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing, typography } from '../../constants';
import DetailHeader from '../../components/navigation/DetailHeader';
import Input from '../../components/forms/Input';
import PrimaryButton from '../../components/common/PrimaryButton';
import { createExam, updateExam } from '../../api/exams';
import { ApiError } from '../../api/client';

export default function ExamFormScreen({ route, navigation }) {
  const { courseId, courseName } = route.params;
  const editingExam = route.params?.exam || null;
  const isEdit = !!editingExam;
  const isDraft = !isEdit || editingExam.status === 'DRAFT';

  const [title, setTitle] = useState(editingExam?.title || '');
  const [description, setDescription] = useState(editingExam?.description || '');
  const [durationMinutes, setDurationMinutes] = useState(editingExam ? String(editingExam.duration_minutes) : '');
  const [passingMarks, setPassingMarks] = useState(editingExam ? String(editingExam.passing_marks) : '');
  const [maxAttempts, setMaxAttempts] = useState(editingExam ? String(editingExam.max_attempts) : '1');
  const [showResultImmediately, setShowResultImmediately] = useState(editingExam?.show_result_immediately ?? true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const submit = async () => {
    setError(null);
    if (!title.trim() || (isDraft && (!durationMinutes || !passingMarks))) {
      setError('Title, duration, and passing marks are required.');
      return;
    }
    setSaving(true);
    try {
      if (isEdit) {
        const payload = {
          title: title.trim(),
          description: description.trim() || undefined,
          show_result_immediately: showResultImmediately,
        };
        if (isDraft) {
          payload.duration_minutes = Number(durationMinutes);
          payload.passing_marks = Number(passingMarks);
          payload.max_attempts = Number(maxAttempts) || 1;
        }
        await updateExam(editingExam.id, payload);
        navigation.goBack();
      } else {
        const { data } = await createExam(courseId, {
          title: title.trim(),
          description: description.trim() || undefined,
          duration_minutes: Number(durationMinutes),
          passing_marks: Number(passingMarks),
          max_attempts: Number(maxAttempts) || 1,
          show_result_immediately: showResultImmediately,
        });
        navigation.replace('ExamDetails', { examId: data.id });
      }
    } catch (e) {
      setError(e instanceof ApiError ? e.message : `Failed to ${isEdit ? 'update' : 'create'} exam`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <DetailHeader
        title={isEdit ? 'Edit Exam' : courseName ? `New Exam — ${courseName}` : 'New Exam'}
        onBack={() => navigation.goBack()}
      />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Input label="Exam Title" placeholder="e.g. Midterm" value={title} onChangeText={setTitle} />
        <Input label="Description (optional)" placeholder="Short description" value={description} onChangeText={setDescription} />
        <View style={styles.row}>
          <View style={styles.flex1}>
            <Input
              label="Duration (minutes)"
              placeholder="e.g. 30"
              keyboardType="numeric"
              value={durationMinutes}
              onChangeText={setDurationMinutes}
              editable={isDraft}
            />
          </View>
          <View style={styles.flex1}>
            <Input
              label="Passing Marks"
              placeholder="e.g. 40"
              keyboardType="numeric"
              value={passingMarks}
              onChangeText={setPassingMarks}
              editable={isDraft}
            />
          </View>
        </View>
        <Input
          label="Max Attempts"
          placeholder="1"
          keyboardType="numeric"
          value={maxAttempts}
          onChangeText={setMaxAttempts}
          editable={isDraft}
        />

        <Pressable style={styles.toggleRow} onPress={() => setShowResultImmediately(v => !v)}>
          <View style={[styles.checkbox, showResultImmediately && styles.checkboxChecked]} />
          <Text style={styles.toggleText}>Show results to students immediately after submitting</Text>
        </Pressable>

        {!isDraft && (
          <Text style={styles.hint}>
            This exam is no longer a draft — duration, passing marks, and max attempts are locked and can't be changed.
          </Text>
        )}
        {isDraft && isEdit && (
          <Text style={styles.hint}>
            These fields lock once the exam is published.
          </Text>
        )}

        {error && <Text style={styles.error}>{error}</Text>}

        <PrimaryButton title={isEdit ? 'Save Changes' : 'Create Exam'} onPress={submit} loading={saving} style={styles.submit} />
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
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  flex1: {
    flex: 1,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainerLowest,
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  toggleText: {
    ...typography.bodyMd,
    color: colors.onSurface,
    flex: 1,
  },
  hint: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
    backgroundColor: colors.surfaceContainerLow,
    padding: spacing.sm,
    borderRadius: radius.sm,
  },
  error: {
    ...typography.bodyMd,
    color: colors.error,
  },
  submit: {
    marginTop: spacing.sm,
  },
});
