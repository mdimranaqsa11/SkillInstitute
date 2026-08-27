import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, shadow, spacing, typography } from '../../constants';
import { can } from '../../constants/roles';
import DetailHeader from '../../components/navigation/DetailHeader';
import Input from '../../components/forms/Input';
import PrimaryButton from '../../components/common/PrimaryButton';
import EmptyState from '../../components/feedback/EmptyState';
import Icon from '../../components/common/Icon';
import StatusBadge from '../../components/common/StatusBadge';
import Fab from '../../components/common/Fab';
import BottomSheet from '../../components/common/BottomSheet';
import { useAuth } from '../../context/AuthContext';
import { useAlert } from '../../context/AlertContext';
import { listModules, createModule, deleteModule } from '../../api/courseModules';
import { getCourseDetail } from '../../api/courses';
import { ApiError } from '../../api/client';

export default function CourseModulesScreen({ route, navigation }) {
  const { courseId, courseName } = route.params;
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const canWrite = can(user, 'writeContent');

  const [modules, setModules] = useState([]);
  const [lessonCounts, setLessonCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      const [{ data }, { data: detail }] = await Promise.all([
        listModules(courseId),
        getCourseDetail(courseId).catch(() => ({ data: null })),
      ]);
      setModules(data);
      if (detail) {
        setLessonCounts(Object.fromEntries(detail.modules.map(m => [m.id, m.lessons.length])));
      }
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    const unsub = navigation.addListener('focus', load);
    return unsub;
  }, [navigation, load]);

  const closeSheet = () => {
    setSheetOpen(false);
    setTitle('');
    setError(null);
  };

  const addModule = async () => {
    if (!title.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await createModule(courseId, { title: title.trim(), sort_order: modules.length });
      closeSheet();
      load();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to create module');
    } finally {
      setSaving(false);
    }
  };

  const removeModule = mod => {
    showAlert('Archive module?', `${mod.title} and its lessons will be archived.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Archive', style: 'destructive', onPress: () => deleteModule(mod.id).then(load).catch(() => {}) },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <DetailHeader title={courseName ? `${courseName} — Modules` : 'Modules'} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator color={colors.primary} style={styles.loader} />
        ) : modules.length === 0 ? (
          <EmptyState
            icon="view-module"
            title="No modules yet"
            description={canWrite ? 'Tap + to add your first module.' : 'This course has no modules yet.'}
          />
        ) : (
          <View style={styles.list}>
            {modules.map(mod => (
              <Pressable
                key={mod.id}
                style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
                onPress={() => navigation.navigate('CourseLessons', { moduleId: mod.id, moduleTitle: mod.title, courseId })}
              >
                <View style={styles.cardHeader}>
                  <StatusBadge status={mod.status} />
                  {canWrite && (
                    <View style={styles.cardActions}>
                      <Pressable hitSlop={8} onPress={() => navigation.navigate('ModuleForm', { module: mod })}>
                        <Icon name="edit" size={18} color={colors.onSurfaceVariant} />
                      </Pressable>
                      <Pressable hitSlop={8} onPress={() => removeModule(mod)}>
                        <Icon name="delete-outline" size={18} color={colors.error} />
                      </Pressable>
                    </View>
                  )}
                </View>
                <Text style={styles.cardTitle}>{mod.title}</Text>
                {!!mod.description && (
                  <Text style={styles.cardDesc} numberOfLines={2}>{mod.description}</Text>
                )}
                <View style={styles.cardFooter}>
                  <Icon name="menu-book" size={16} color={colors.onSurfaceVariant} />
                  <Text style={styles.cardFooterText}>
                    {lessonCounts[mod.id] ?? 0} lesson{(lessonCounts[mod.id] ?? 0) === 1 ? '' : 's'}
                  </Text>
                  <View style={styles.spacer} />
                  <Icon name="chevron-right" size={20} color={colors.outline} />
                </View>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>

      {canWrite && <Fab style={styles.fab} onPress={() => setSheetOpen(true)} />}

      <BottomSheet visible={sheetOpen} onClose={closeSheet}>
        <Text style={styles.sheetTitle}>New Module</Text>
        <Input
          label="Module Title"
          placeholder="e.g. Getting Started"
          value={title}
          onChangeText={setTitle}
          autoFocus
        />
        {error && <Text style={styles.error}>{error}</Text>}
        <PrimaryButton title="Add Module" onPress={addModule} loading={saving} />
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: {
    padding: spacing.containerPadding,
    gap: spacing.lg,
    paddingBottom: spacing.xl * 3,
  },
  loader: {
    marginTop: spacing.xl,
  },
  list: {
    gap: spacing.md,
  },
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
    padding: 20,
    gap: 4,
    ...shadow.sm,
  },
  cardPressed: {
    transform: [{ scale: 0.98 }],
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardActions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  cardTitle: {
    ...typography.headlineMd,
    fontSize: 18,
    color: colors.onSurface,
  },
  cardDesc: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceVariant,
  },
  cardFooterText: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
  },
  spacer: {
    flex: 1,
  },
  fab: {
    bottom: 24,
  },
  sheetTitle: {
    ...typography.headlineMd,
    fontSize: 18,
    color: colors.onSurface,
  },
  error: {
    ...typography.bodyMd,
    color: colors.error,
  },
});
