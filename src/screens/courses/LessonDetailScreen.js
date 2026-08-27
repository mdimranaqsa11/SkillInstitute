import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, KeyboardAvoidingView, Platform, StyleSheet, ActivityIndicator, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { pick, isErrorWithCode, errorCodes } from '@react-native-documents/picker';
import { colors, radius, shadow, spacing, typography } from '../../constants';
import { can } from '../../constants/roles';
import DetailHeader from '../../components/navigation/DetailHeader';
import Input from '../../components/forms/Input';
import PrimaryButton from '../../components/common/PrimaryButton';
import EmptyState from '../../components/feedback/EmptyState';
import Icon from '../../components/common/Icon';
import Fab from '../../components/common/Fab';
import BottomSheet from '../../components/common/BottomSheet';
import { useAuth } from '../../context/AuthContext';
import { useAlert } from '../../context/AlertContext';
import { getLesson, updateLesson } from '../../api/lessons';
import {
  listLessonResources,
  createLessonResource,
  createLessonResourceLink,
  deleteLessonResource,
} from '../../api/lessonResources';
import { ApiError } from '../../api/client';

const RESOURCE_ICONS = { PDF: 'picture-as-pdf', DOCUMENT: 'description', IMAGE: 'image', VIDEO: 'videocam', LINK: 'link', OTHER: 'attachment' };
const STATUSES = ['DRAFT', 'PUBLISHED', 'ARCHIVED'];

export default function LessonDetailScreen({ route, navigation }) {
  const { lessonId } = route.params;
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const canWrite = can(user, 'writeContent');

  const [lesson, setLesson] = useState(null);
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [durationMinutes, setDurationMinutes] = useState('');
  const [status, setStatus] = useState('DRAFT');
  const [savingLesson, setSavingLesson] = useState(false);
  const [error, setError] = useState(null);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [resMode, setResMode] = useState('FILE');
  const [resName, setResName] = useState('');
  const [resUrl, setResUrl] = useState('');
  const [resFile, setResFile] = useState(null);
  const [savingResource, setSavingResource] = useState(false);
  const [resError, setResError] = useState(null);

  const load = useCallback(async () => {
    try {
      const [{ data: l }, { data: r }] = await Promise.all([getLesson(lessonId), listLessonResources(lessonId)]);
      setLesson(l);
      setTitle(l.title || '');
      setDescription(l.description || '');
      setContent(l.content || '');
      setDurationMinutes(l.duration_minutes ? String(l.duration_minutes) : '');
      setStatus(l.status);
      setResources(r);
    } finally {
      setLoading(false);
    }
  }, [lessonId]);

  useEffect(() => {
    load();
  }, [load]);

  const saveLesson = async () => {
    setSavingLesson(true);
    setError(null);
    try {
      await updateLesson(lessonId, {
        title: title.trim() || undefined,
        description: description.trim() || undefined,
        content: content || undefined,
        duration_minutes: durationMinutes ? Number(durationMinutes) : undefined,
        status,
      });
      showAlert('Saved', 'Lesson updated.');
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Failed to save lesson');
    } finally {
      setSavingLesson(false);
    }
  };

  const pickResourceFile = async () => {
    try {
      const [result] = await pick();
      setResFile(result);
    } catch (e) {
      if (!isErrorWithCode(e) || e.code !== errorCodes.OPERATION_CANCELED) {
        setResError('Failed to pick file');
      }
    }
  };

  const closeSheet = () => {
    setSheetOpen(false);
    setResName('');
    setResUrl('');
    setResFile(null);
    setResMode('FILE');
    setResError(null);
  };

  const addResource = async () => {
    if (!resName.trim()) return;
    if (resMode === 'LINK' ? !resUrl.trim() : !resFile) return;
    setSavingResource(true);
    setResError(null);
    try {
      if (resMode === 'LINK') {
        await createLessonResourceLink(lessonId, resName.trim(), resUrl.trim());
      } else {
        await createLessonResource(lessonId, resName.trim(), resFile);
      }
      closeSheet();
      const { data } = await listLessonResources(lessonId);
      setResources(data);
    } catch (e) {
      setResError(e instanceof ApiError ? e.message : 'Failed to add resource');
    } finally {
      setSavingResource(false);
    }
  };

  const removeResource = resource => {
    showAlert('Delete resource?', `${resource.name} will be permanently removed.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => deleteLessonResource(resource.id).then(() => setResources(rs => rs.filter(r => r.id !== resource.id))),
      },
    ]);
  };

  if (loading || !lesson) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <DetailHeader title="Lesson" onBack={() => navigation.goBack()} />
        <ActivityIndicator color={colors.primary} style={styles.loader} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <DetailHeader title={lesson.title} onBack={() => navigation.goBack()} />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          <Text style={styles.section}>Lesson Details</Text>
          <Input label="Title" value={title} onChangeText={setTitle} editable={canWrite} />
          <Input
            label="Description"
            placeholder="Short description"
            value={description}
            onChangeText={setDescription}
            editable={canWrite}
            multiline
            numberOfLines={3}
          />
          <Input
            label="Content / Notes"
            placeholder="Lesson body text"
            value={content}
            onChangeText={setContent}
            editable={canWrite}
            multiline
            numberOfLines={6}
            containerStyle={styles.contentField}
            style={styles.contentInput}
          />
          <Input label="Duration (minutes)" placeholder="e.g. 12" keyboardType="numeric" value={durationMinutes} onChangeText={setDurationMinutes} editable={canWrite} />

          {canWrite && (
            <View>
              <Text style={styles.label}>Status</Text>
              <View style={styles.segmentWrap}>
                {STATUSES.map(s => (
                  <Pressable
                    key={s}
                    style={[styles.segment, status === s && styles.segmentActive]}
                    onPress={() => setStatus(s)}
                  >
                    <Text style={[styles.segmentText, status === s && STATUS_TEXT_STYLES[s]]}>
                      {s}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {error && <Text style={styles.error}>{error}</Text>}
          {canWrite && <PrimaryButton title="Save Lesson" onPress={saveLesson} loading={savingLesson} />}
        </View>

        <View style={styles.card}>
          <Text style={styles.section}>Resources</Text>
          {resources.length === 0 && (
            <EmptyState
              icon="attachment"
              title="No resources"
              description={canWrite ? 'Tap + to attach a file or link.' : 'No resources have been added yet.'}
            />
          )}
          <View style={styles.resList}>
            {resources.map(r => (
              <Pressable
                key={r.id}
                style={({ pressed }) => [styles.resRow, pressed && styles.resRowPressed]}
                onPress={() => Linking.openURL(r.file_url).catch(() => {})}
              >
                <View style={styles.resIconWrap}>
                  <Icon name={RESOURCE_ICONS[r.resource_type] || 'attachment'} size={18} color={colors.primary} />
                </View>
                <View style={styles.resInfo}>
                  <Text style={styles.resName} numberOfLines={1}>{r.name}</Text>
                  <Text style={styles.resType}>{r.resource_type}</Text>
                </View>
                <Icon name="open-in-new" size={16} color={colors.outline} />
                {canWrite && (
                  <Pressable hitSlop={8} onPress={() => removeResource(r)}>
                    <Icon name="delete-outline" size={20} color={colors.error} />
                  </Pressable>
                )}
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
      </KeyboardAvoidingView>

      {canWrite && <Fab style={styles.fab} onPress={() => setSheetOpen(true)} />}

      <BottomSheet visible={sheetOpen} onClose={closeSheet}>
        <Text style={styles.sheetTitle}>Add Resource</Text>
        <Input label="Resource Name" placeholder="e.g. Slides" value={resName} onChangeText={setResName} autoFocus />
        <View style={styles.chipsRow}>
          {['FILE', 'LINK'].map(m => (
            <Pressable
              key={m}
              style={[styles.chip, resMode === m && styles.chipActive]}
              onPress={() => setResMode(m)}
            >
              <Text style={[styles.chipText, resMode === m && styles.chipTextActive]}>{m}</Text>
            </Pressable>
          ))}
        </View>
        {resMode === 'LINK' ? (
          <Input label="URL" placeholder="https://..." autoCapitalize="none" value={resUrl} onChangeText={setResUrl} />
        ) : (
          <View>
            <Text style={styles.label}>File</Text>
            <Pressable style={styles.fileButton} onPress={pickResourceFile}>
              <Text style={styles.fileButtonText} numberOfLines={1}>
                {resFile ? resFile.name : 'Choose File'}
              </Text>
            </Pressable>
          </View>
        )}
        {resError && <Text style={styles.error}>{resError}</Text>}
        <PrimaryButton title="Add Resource" onPress={addResource} loading={savingResource} />
      </BottomSheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  content: {
    padding: spacing.containerPadding,
    gap: spacing.lg,
    paddingBottom: spacing.xl * 3,
  },
  loader: {
    marginTop: spacing.xl,
  },
  card: {
    gap: spacing.md,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
    padding: spacing.lg,
    ...shadow.sm,
  },
  section: {
    ...typography.headlineMd,
    fontSize: 16,
    color: colors.onSurface,
  },
  contentField: {
    marginTop: 0,
  },
  contentInput: {
    minHeight: 96,
  },
  label: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
    marginBottom: spacing.xs,
  },
  segmentWrap: {
    flexDirection: 'row',
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.md,
    padding: 4,
    gap: 4,
  },
  segment: {
    flex: 1,
    height: 36,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentActive: {
    backgroundColor: colors.surfaceContainerLowest,
    ...shadow.sm,
  },
  segmentText: {
    ...typography.labelMd,
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
  segmentTextDraft: {
    color: colors.onSurfaceVariant,
    fontWeight: '700',
  },
  segmentTextPublished: {
    color: colors.success,
    fontWeight: '700',
  },
  segmentTextArchived: {
    color: colors.outline,
    fontWeight: '700',
  },
  resList: {
    gap: spacing.sm,
  },
  resRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.sm,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceContainerLow,
  },
  resRowPressed: {
    opacity: 0.85,
  },
  resIconWrap: {
    width: 32,
    height: 32,
    borderRadius: radius.DEFAULT,
    backgroundColor: colors.surfaceContainerLowest,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resInfo: {
    flex: 1,
    gap: 1,
  },
  resName: {
    ...typography.bodyMd,
    color: colors.onSurface,
  },
  resType: {
    ...typography.labelMd,
    fontSize: 10,
    color: colors.outline,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  fileButton: {
    height: 48,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  fileButtonText: {
    ...typography.bodyMd,
    color: colors.primary,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
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
  fab: {
    bottom: 24,
  },
  sheetTitle: {
    ...typography.headlineMd,
    fontSize: 18,
    color: colors.onSurface,
  },
});

const STATUS_TEXT_STYLES = {
  DRAFT: styles.segmentTextDraft,
  PUBLISHED: styles.segmentTextPublished,
  ARCHIVED: styles.segmentTextArchived,
};
