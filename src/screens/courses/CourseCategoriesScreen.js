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
  listCourseCategories,
  createCourseCategory,
  updateCourseCategory,
  deleteCourseCategory,
} from '../../api/courseCategories';
import { ApiError } from '../../api/client';

export default function CourseCategoriesScreen({ navigation, route }) {
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const canWrite = can(user, 'writeContent');
  const pickMode = !!route.params?.onPick;

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      const { data } = await listCourseCategories();
      setCategories(data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const unsub = navigation.addListener('focus', load);
    return unsub;
  }, [navigation, load]);

  const addCategory = async () => {
    if (!name.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const { data } = await createCourseCategory({ name: name.trim(), description: description.trim() || undefined });
      setName('');
      setDescription('');
      if (pickMode) {
        route.params.onPick(data);
        navigation.goBack();
      } else {
        load();
      }
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to create category');
    } finally {
      setSaving(false);
    }
  };

  const toggleStatus = category => {
    const next = category.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    updateCourseCategory(category.id, { status: next })
      .then(load)
      .catch(e => showAlert('Failed', e instanceof ApiError ? e.message : 'Could not update category'));
  };

  const removeCategory = category => {
    showAlert('Deactivate category?', `${category.name} will be marked inactive.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Deactivate',
        style: 'destructive',
        onPress: () => deleteCourseCategory(category.id).then(load).catch(() => {}),
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <DetailHeader title={pickMode ? 'Select Category' : 'Course Categories'} onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        {canWrite && (
          <View style={styles.form}>
            <Input label="New Category Name" placeholder="e.g. Web Development" value={name} onChangeText={setName} />
            <Input label="Description (optional)" placeholder="Short description" value={description} onChangeText={setDescription} />
            {error && <Text style={styles.error}>{error}</Text>}
            <PrimaryButton title="Add Category" onPress={addCategory} loading={saving} />
          </View>
        )}

        {loading ? (
          <ActivityIndicator color={colors.primary} style={styles.loader} />
        ) : categories.length === 0 ? (
          <EmptyState icon="category" title="No categories yet" description="Add your first course category above." />
        ) : (
          <View style={styles.list}>
            {categories.map(cat => (
              <Pressable
                key={cat.id}
                style={styles.row}
                onPress={pickMode ? () => { route.params.onPick(cat); navigation.goBack(); } : undefined}
              >
                <View style={styles.rowInfo}>
                  <Text style={[styles.rowName, cat.status === 'INACTIVE' && styles.rowNameInactive]}>{cat.name}</Text>
                  {!!cat.description && <Text style={styles.rowDesc}>{cat.description}</Text>}
                </View>
                {canWrite && !pickMode && (
                  <View style={styles.rowActions}>
                    <Pressable hitSlop={8} onPress={() => toggleStatus(cat)}>
                      <Icon name={cat.status === 'ACTIVE' ? 'toggle-on' : 'toggle-off'} size={28} color={cat.status === 'ACTIVE' ? colors.primary : colors.outline} />
                    </Pressable>
                    <Pressable hitSlop={8} onPress={() => removeCategory(cat)}>
                      <Icon name="delete-outline" size={22} color={colors.error} />
                    </Pressable>
                  </View>
                )}
                {pickMode && <Icon name="chevron-right" size={20} color={colors.outline} />}
              </Pressable>
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
    justifyContent: 'space-between',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
    padding: spacing.md,
  },
  rowInfo: {
    flex: 1,
    gap: 2,
  },
  rowName: {
    ...typography.bodyLg,
    fontWeight: '600',
    color: colors.onSurface,
  },
  rowNameInactive: {
    color: colors.onSurfaceVariant,
    textDecorationLine: 'line-through',
  },
  rowDesc: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
  rowActions: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
});
