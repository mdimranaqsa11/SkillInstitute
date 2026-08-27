import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing, typography } from '../../constants';
import DetailHeader from '../../components/navigation/DetailHeader';
import Input from '../../components/forms/Input';
import PrimaryButton from '../../components/common/PrimaryButton';
import { updateModule } from '../../api/courseModules';
import { ApiError } from '../../api/client';

const STATUSES = ['DRAFT', 'PUBLISHED', 'ARCHIVED'];

export default function ModuleFormScreen({ navigation, route }) {
  const { module } = route.params;
  const [title, setTitle] = useState(module.title || '');
  const [description, setDescription] = useState(module.description || '');
  const [status, setStatus] = useState(module.status);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const submit = async () => {
    setError(null);
    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    setSaving(true);
    try {
      await updateModule(module.id, { title: title.trim(), description: description.trim() || undefined, status });
      navigation.goBack();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to update module');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <DetailHeader title="Edit Module" onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Input label="Title" value={title} onChangeText={setTitle} />
        <Input label="Description (optional)" value={description} onChangeText={setDescription} />

        <View>
          <Text style={styles.label}>Status</Text>
          <View style={styles.chipsRow}>
            {STATUSES.map(s => (
              <Pressable key={s} style={[styles.chip, status === s && styles.chipActive]} onPress={() => setStatus(s)}>
                <Text style={[styles.chipText, status === s && styles.chipTextActive]}>{s}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {error && <Text style={styles.error}>{error}</Text>}
        <PrimaryButton title="Save Changes" onPress={submit} loading={saving} style={styles.submit} />
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
  label: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.xs,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainerLowest,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    ...typography.labelMd,
    fontSize: 11,
    color: colors.onSurface,
  },
  chipTextActive: {
    color: colors.onPrimary,
  },
  error: {
    ...typography.bodyMd,
    color: colors.error,
  },
  submit: {
    marginTop: spacing.sm,
  },
});
