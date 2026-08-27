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
import { listLessons, createLesson, deleteLesson } from '../../api/lessons';
import { getCourseDetail } from '../../api/courses';
import { ApiError } from '../../api/client';

export default function CourseLessonsScreen({ route, navigation }) {
  const { moduleId, moduleTitle, courseId } = route.params;
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const canWrite = can(user, 'writeContent');

  const [lessons, setLessons] = useState([]);
  const [resourceCounts, setResourceCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      const [{ data }, detailResult] = await Promise.all([
        listLessons(moduleId),
        courseId ? getCourseDetail(courseId).catch(() => null) : Promise.resolve(null),
      ]);
      setLessons(data);
      const module = detailResult?.data?.modules.find(m => m.id === moduleId);
      if (module) {
        setResourceCounts(Object.fromEntries(module.lessons.map(l => [l.id, l.resources.length])));
      }
    } finally {
      setLoading(false);
    }
  }, [moduleId, courseId]);

  useEffect(() => {
    const unsub = navigation.addListener('focus', load);
    return unsub;
  }, [navigation, load]);

  const closeSheet = () => {
    setSheetOpen(false);
    setTitle('');
    setDescription('');
    setContent('');
    setDurationMinutes('');
    setError(null);
  };

  const addLesson = async () => {
    if (!title.trim()) return;
    setSaving(true);
    setError(null);
    try {
      await createLesson(moduleId, {
        title: title.trim(),
        description: description.trim() || undefined,
        content: content.trim() || undefined,
        duration_minutes: durationMinutes ? Number(durationMinutes) : undefined,
        sort_order: lessons.length,
      });
      closeSheet();
      load();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to create lesson');
    } finally {
      setSaving(false);
    }
  };

  const removeLesson = lesson => {
    showAlert('Archive lesson?', `${lesson.title} will be archived.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Archive', style: 'destructive', onPress: () => deleteLesson(lesson.id).then(load).catch(() => {}) },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <DetailHeader title={moduleTitle ? `${moduleTitle} — Lessons` : 'Lessons'} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {loading ? (
          <ActivityIndicator color={colors.primary} style={styles.loader} />
        ) : lessons.length === 0 ? (
          <EmptyState
            icon="play-lesson"
            title="No lessons yet"
            description={canWrite ? 'Tap + to add your first lesson.' : 'This module has no lessons yet.'}
          />
        ) : (
          <View style={styles.list}>
            {lessons.map(lesson => (
              <Pressable
                key={lesson.id}
                style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
                onPress={() => navigation.navigate('LessonDetail', { lessonId: lesson.id })}
              >
                <View style={styles.cardHeader}>
                  <StatusBadge status={lesson.status} />
                  {canWrite && (
                    <Pressable hitSlop={8} onPress={() => removeLesson(lesson)}>
                      <Icon name="delete-outline" size={18} color={colors.error} />
                    </Pressable>
                  )}
                </View>
                <Text style={styles.cardTitle}>{lesson.title}</Text>
                <View style={styles.cardFooter}>
                  <Icon name="schedule" size={16} color={colors.onSurfaceVariant} />
                  <Text style={styles.cardFooterText}>
                    {[
                      lesson.duration_minutes ? `${lesson.duration_minutes} min` : null,
                      `${resourceCounts[lesson.id] ?? 0} resource${(resourceCounts[lesson.id] ?? 0) === 1 ? '' : 's'}`,
                    ]
                      .filter(Boolean)
                      .join(' · ')}
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
        <ScrollView keyboardShouldPersistTaps="handled">
          <Text style={styles.sheetTitle}>New Lesson</Text>
          <View style={styles.sheetForm}>
            <Input
              label="Lesson Title"
              placeholder="e.g. Setting up your environment"
              value={title}
              onChangeText={setTitle}
              autoFocus
            />
            <Input
              label="Description (optional)"
              placeholder="Short description"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={2}
            />
            <Input
              label="Content / Notes (optional)"
              placeholder="Lesson body text"
              value={content}
              onChangeText={setContent}
              multiline
              numberOfLines={4}
            />
            <Input
              label="Duration in minutes (optional)"
              placeholder="e.g. 12"
              keyboardType="numeric"
              value={durationMinutes}
              onChangeText={setDurationMinutes}
            />
            {error && <Text style={styles.error}>{error}</Text>}
            <PrimaryButton title="Add Lesson" onPress={addLesson} loading={saving} />
          </View>
        </ScrollView>
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
  cardTitle: {
    ...typography.headlineMd,
    fontSize: 18,
    color: colors.onSurface,
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
  sheetForm: {
    gap: spacing.md,
    paddingTop: spacing.sm,
  },
  error: {
    ...typography.bodyMd,
    color: colors.error,
  },
});
