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
import { useAuth } from '../../context/AuthContext';
import { useAlert } from '../../context/AlertContext';
import {
  listQuestions,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  createOption,
  updateOption,
  deleteOption,
} from '../../api/examQuestions';
import { ApiError } from '../../api/client';

const emptyOptions = () => [
  { option_text: '', is_correct: true },
  { option_text: '', is_correct: false },
];

function QuestionCard({ question, index, canWrite, onRemove, onChanged }) {
  const { showAlert } = useAlert();
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(question.question_text);
  const [marks, setMarks] = useState(String(question.marks));
  const [negativeMarks, setNegativeMarks] = useState(String(question.negative_marks || 0));
  const [newOptionText, setNewOptionText] = useState('');
  const [saving, setSaving] = useState(false);

  const saveQuestion = async () => {
    setSaving(true);
    try {
      await updateQuestion(question.id, {
        question_text: text.trim(),
        marks: Number(marks) || 1,
        negative_marks: Number(negativeMarks) || 0,
      });
      setEditing(false);
      onChanged();
    } catch (e) {
      showAlert('Failed', e instanceof ApiError ? e.message : 'Could not update question');
    } finally {
      setSaving(false);
    }
  };

  const toggleCorrect = async option => {
    try {
      await updateOption(option.id, { is_correct: !option.is_correct });
      onChanged();
    } catch (e) {
      showAlert('Failed', e instanceof ApiError ? e.message : 'Could not update option');
    }
  };

  const removeOption = optionId => {
    showAlert('Delete option?', null, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteOption(optionId).then(onChanged).catch(() => {}) },
    ]);
  };

  const addOption = async () => {
    if (!newOptionText.trim()) return;
    try {
      await createOption(question.id, { option_text: newOptionText.trim(), is_correct: false, sort_order: (question.options || []).length });
      setNewOptionText('');
      onChanged();
    } catch (e) {
      showAlert('Failed', e instanceof ApiError ? e.message : 'Could not add option');
    }
  };

  return (
    <View style={styles.questionCard}>
      <View style={styles.questionHeader}>
        {editing ? (
          <Input value={text} onChangeText={setText} containerStyle={styles.flex1} />
        ) : (
          <Text style={styles.questionText}>{index + 1}. {question.question_text}</Text>
        )}
        {canWrite && (
          <Pressable onPress={() => setEditing(v => !v)} hitSlop={8}>
            <Icon name={editing ? 'close' : 'edit'} size={20} color={colors.onSurfaceVariant} />
          </Pressable>
        )}
        {canWrite && (
          <Pressable onPress={onRemove} hitSlop={8}>
            <Icon name="delete-outline" size={20} color={colors.error} />
          </Pressable>
        )}
      </View>

      {editing ? (
        <View style={styles.row}>
          <View style={styles.flex1}>
            <Input label="Marks" keyboardType="numeric" value={marks} onChangeText={setMarks} />
          </View>
          <View style={styles.flex1}>
            <Input label="Negative Marks" keyboardType="numeric" value={negativeMarks} onChangeText={setNegativeMarks} />
          </View>
        </View>
      ) : (
        <Text style={styles.questionMeta}>{question.marks} marks{question.negative_marks ? ` · -${question.negative_marks} negative` : ''}</Text>
      )}

      {(question.options || []).map(o => (
        <View key={o.id} style={styles.optionDisplay}>
          <Pressable onPress={() => (canWrite && editing ? toggleCorrect(o) : null)} hitSlop={8}>
            <Icon
              name={o.is_correct ? 'check-circle' : 'radio-button-unchecked'}
              size={16}
              color={o.is_correct ? colors.success : colors.outline}
            />
          </Pressable>
          <Text style={styles.optionDisplayText}>{o.option_text}</Text>
          {canWrite && editing && (
            <Pressable onPress={() => removeOption(o.id)} hitSlop={8}>
              <Icon name="close" size={16} color={colors.error} />
            </Pressable>
          )}
        </View>
      ))}

      {canWrite && editing && (
        <View style={styles.optionRow}>
          <View style={styles.flex1}>
            <Input placeholder="New option" value={newOptionText} onChangeText={setNewOptionText} />
          </View>
          <Pressable onPress={addOption} hitSlop={8}>
            <Icon name="add-circle" size={22} color={colors.primary} />
          </Pressable>
        </View>
      )}

      {editing && <PrimaryButton title="Save Question" onPress={saveQuestion} loading={saving} />}
    </View>
  );
}

export default function ExamQuestionsScreen({ route, navigation }) {
  const { examId, examStatus } = route.params;
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const isDraft = examStatus === 'DRAFT';
  const canWrite = can(user, 'writeContent') && isDraft;

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [questionText, setQuestionText] = useState('');
  const [marks, setMarks] = useState('1');
  const [negativeMarks, setNegativeMarks] = useState('0');
  const [options, setOptions] = useState(emptyOptions());
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      const { data } = await listQuestions(examId);
      setQuestions(data);
    } finally {
      setLoading(false);
    }
  }, [examId]);

  useEffect(() => {
    load();
  }, [load]);

  const setOptionText = (idx, text) =>
    setOptions(opts => opts.map((o, i) => (i === idx ? { ...o, option_text: text } : o)));

  const setCorrect = idx => setOptions(opts => opts.map((o, i) => ({ ...o, is_correct: i === idx })));

  const addOptionField = () => setOptions(opts => [...opts, { option_text: '', is_correct: false }]);

  const removeOptionField = idx => setOptions(opts => opts.filter((_, i) => i !== idx));

  const resetForm = () => {
    setQuestionText('');
    setMarks('1');
    setNegativeMarks('0');
    setOptions(emptyOptions());
  };

  const addQuestion = async () => {
    setError(null);
    const filledOptions = options.filter(o => o.option_text.trim());
    if (!questionText.trim() || filledOptions.length < 2 || !filledOptions.some(o => o.is_correct)) {
      setError('Add question text, at least 2 options, and mark one option correct.');
      return;
    }
    setSaving(true);
    try {
      await createQuestion(examId, {
        question_text: questionText.trim(),
        question_type: 'MCQ',
        marks: Number(marks) || 1,
        negative_marks: Number(negativeMarks) || 0,
        sort_order: questions.length,
        options: filledOptions.map((o, i) => ({ option_text: o.option_text.trim(), is_correct: o.is_correct, sort_order: i })),
      });
      resetForm();
      load();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to add question');
    } finally {
      setSaving(false);
    }
  };

  const removeQuestion = q => {
    showAlert('Delete question?', 'This question and its options will be permanently removed.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteQuestion(q.id).then(load).catch(() => {}) },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <DetailHeader title="Exam Questions" onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {!isDraft && (
          <View style={styles.lockedBanner}>
            <Icon name="lock" size={16} color={colors.onSurfaceVariant} />
            <Text style={styles.lockedText}>Exam content is locked — questions can only be edited while the exam is a draft.</Text>
          </View>
        )}

        {canWrite && (
          <View style={styles.form}>
            <Text style={styles.section}>New Question</Text>
            <Input label="Question Text" placeholder="e.g. What is 2 + 2?" value={questionText} onChangeText={setQuestionText} />
            <View style={styles.row}>
              <View style={styles.flex1}>
                <Input label="Marks" keyboardType="numeric" value={marks} onChangeText={setMarks} />
              </View>
              <View style={styles.flex1}>
                <Input label="Negative Marks" keyboardType="numeric" value={negativeMarks} onChangeText={setNegativeMarks} />
              </View>
            </View>

            <Text style={styles.label}>Options — tap to mark correct</Text>
            {options.map((opt, idx) => (
              <View key={idx} style={styles.optionRow}>
                <Pressable onPress={() => setCorrect(idx)} hitSlop={8}>
                  <Icon name={opt.is_correct ? 'radio-button-checked' : 'radio-button-unchecked'} size={22} color={opt.is_correct ? colors.success : colors.outline} />
                </Pressable>
                <View style={styles.flex1}>
                  <Input placeholder={`Option ${idx + 1}`} value={opt.option_text} onChangeText={t => setOptionText(idx, t)} />
                </View>
                {options.length > 2 && (
                  <Pressable onPress={() => removeOptionField(idx)} hitSlop={8}>
                    <Icon name="close" size={20} color={colors.error} />
                  </Pressable>
                )}
              </View>
            ))}
            <Pressable style={styles.addOptionBtn} onPress={addOptionField}>
              <Icon name="add" size={18} color={colors.primary} />
              <Text style={styles.addOptionText}>Add option</Text>
            </Pressable>

            {error && <Text style={styles.error}>{error}</Text>}
            <PrimaryButton title="Add Question" onPress={addQuestion} loading={saving} />
          </View>
        )}

        {loading ? (
          <ActivityIndicator color={colors.primary} style={styles.loader} />
        ) : questions.length === 0 ? (
          <EmptyState icon="quiz" title="No questions yet" description={isDraft ? 'Add your first question above.' : 'This exam has no questions.'} />
        ) : (
          <View style={styles.list}>
            {questions.map((q, idx) => (
              <QuestionCard key={q.id} question={q} index={idx} canWrite={canWrite} onRemove={() => removeQuestion(q)} onChanged={load} />
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
  lockedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.surfaceContainerLow,
    padding: spacing.sm,
    borderRadius: radius.sm,
  },
  lockedText: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
    flex: 1,
  },
  form: {
    gap: spacing.md,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
    padding: spacing.lg,
  },
  section: {
    ...typography.headlineMd,
    fontSize: 16,
    color: colors.onSurface,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  flex1: {
    flex: 1,
  },
  label: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  addOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
  },
  addOptionText: {
    ...typography.labelMd,
    color: colors.primary,
    fontWeight: '600',
  },
  error: {
    ...typography.bodyMd,
    color: colors.error,
  },
  loader: {
    marginTop: spacing.xl,
  },
  list: {
    gap: spacing.md,
  },
  questionCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
    padding: spacing.md,
    gap: 6,
  },
  questionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  questionText: {
    ...typography.bodyLg,
    fontWeight: '600',
    color: colors.onSurface,
    flex: 1,
  },
  questionMeta: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
  },
  optionDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  optionDisplayText: {
    ...typography.bodyMd,
    color: colors.onSurface,
  },
});
