import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing, typography } from '../../constants';
import { can } from '../../constants/roles';
import DetailHeader from '../../components/navigation/DetailHeader';
import Icon from '../../components/common/Icon';
import StatusBadge from '../../components/common/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { useAlert } from '../../context/AlertContext';
import { getCourseDetail, publishCourse, archiveCourse } from '../../api/courses';
import { listEnrollments } from '../../api/enrollments';
import { ApiError } from '../../api/client';

function ActionChip({ icon, label, onPress, variant = 'default', loading, disabled }) {
  const iconColor =
    variant === 'primary' ? colors.onPrimary : variant === 'danger' ? colors.onErrorContainer : colors.primary;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.chip,
        variant === 'primary' && styles.chipPrimary,
        variant === 'danger' && styles.chipDanger,
        pressed && !(disabled || loading) && styles.chipPressed,
        (disabled || loading) && styles.chipDisabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator size="small" color={iconColor} />
      ) : (
        <>
          <Icon name={icon} size={16} color={iconColor} />
          <Text
            style={[
              styles.chipText,
              variant === 'primary' && styles.chipTextPrimary,
              variant === 'danger' && styles.chipTextDanger,
            ]}
          >
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}

export default function CourseDetailsScreen({ route, navigation }) {
  const { courseId } = route.params;
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const canWrite = can(user, 'writeContent');

  const [course, setCourse] = useState(null);
  const [enrolledCount, setEnrolledCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const load = useCallback(async () => {
    try {
      const [{ data: c }, { data: enrollments }] = await Promise.all([
        getCourseDetail(courseId),
        listEnrollments().catch(() => ({ data: [] })),
      ]);
      setCourse(c);
      setEnrolledCount(enrollments.filter(e => e.course_id === courseId && e.status === 'ACTIVE').length);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    const unsub = navigation.addListener('focus', load);
    return unsub;
  }, [navigation, load]);

  const handlePublish = async () => {
    setActionLoading(true);
    try {
      await publishCourse(courseId);
      load();
    } catch (e) {
      showAlert('Failed', e instanceof ApiError ? e.message : 'Could not publish course');
    } finally {
      setActionLoading(false);
    }
  };

  const handleArchive = async () => {
    showAlert('Archive course?', `${course.name} will be archived.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Archive',
        style: 'destructive',
        onPress: async () => {
          setActionLoading(true);
          try {
            await archiveCourse(courseId);
            load();
          } catch (e) {
            showAlert('Failed', e instanceof ApiError ? e.message : 'Could not archive course');
          } finally {
            setActionLoading(false);
          }
        },
      },
    ]);
  };

  if (loading || !course) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <DetailHeader title="Course Details" onBack={() => navigation.goBack()} />
        <ActivityIndicator color={colors.primary} style={styles.loader} />
      </SafeAreaView>
    );
  }

  const lessonTotal = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <DetailHeader title="Course Details" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          {course.thumbnail_url ? (
            <Image source={{ uri: course.thumbnail_url }} style={styles.thumbnail} />
          ) : (
            <View style={[styles.thumbnail, styles.thumbnailPlaceholder]}>
              <Icon name="menu-book" size={36} color={colors.primary} />
            </View>
          )}

          <View style={styles.cardBody}>
            <View style={styles.headerRow}>
              <View style={styles.flex1}>
                <Text style={styles.code}>{course.code}</Text>
                <Text style={styles.title}>{course.name}</Text>
              </View>
              <StatusBadge status={course.status} />
            </View>

            {!!course.category_name && (
              <View style={styles.categoryChip}>
                <Icon name="category" size={13} color={colors.primary} />
                <Text style={styles.categoryChipText}>{course.category_name}</Text>
              </View>
            )}

            <View style={styles.actionsRow}>
              <ActionChip
                icon="visibility"
                label="View"
                onPress={() => navigation.navigate('CoursePreview', { courseId })}
              />
              {canWrite && (
                <ActionChip
                  icon="edit"
                  label="Edit"
                  onPress={() => navigation.navigate('CourseForm', { course })}
                />
              )}
              {canWrite && course.status !== 'PUBLISHED' && (
                <ActionChip
                  icon="publish"
                  label="Publish"
                  variant="primary"
                  onPress={handlePublish}
                  loading={actionLoading}
                />
              )}
              {canWrite && course.status !== 'ARCHIVED' && (
                <ActionChip
                  icon="archive"
                  label="Archive"
                  variant="danger"
                  onPress={handleArchive}
                  disabled={actionLoading}
                />
              )}
            </View>
          </View>
        </View>

        <View style={styles.linksGrid}>
          <NavLink
            icon="view-module"
            label="Course Content"
            sub={`${course.modules.length} module${course.modules.length === 1 ? '' : 's'} · ${lessonTotal} lesson${lessonTotal === 1 ? '' : 's'}`}
            onPress={() => navigation.navigate('CourseModules', { courseId, courseName: course.name })}
          />
          <NavLink
            icon="quiz"
            label="Exams"
            sub={`${course.exams.length} exam${course.exams.length === 1 ? '' : 's'}`}
            onPress={() => navigation.navigate('CourseExams', { courseId, courseName: course.name })}
          />
          <NavLink
            icon="group"
            label="Enrolled Students"
            sub={`${enrolledCount} enrolled`}
            onPress={() => navigation.navigate('CourseEnrollments', { courseId, courseName: course.name })}
          />
          <NavLink
            icon="person-add"
            label="Enrollment Requests"
            sub="Approve or reject"
            onPress={() => navigation.navigate('EnrollmentRequests', { courseId, courseName: course.name })}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function NavLink({ icon, label, sub, onPress }) {
  return (
    <Pressable style={({ pressed }) => [styles.linkRow, pressed && styles.linkRowPressed]} onPress={onPress}>
      <View style={styles.linkIcon}>
        <Icon name={icon} size={22} color={colors.primary} />
      </View>
      <View style={styles.flex1}>
        <Text style={styles.linkLabel}>{label}</Text>
        <Text style={styles.linkSub}>{sub}</Text>
      </View>
      <Icon name="chevron-right" size={20} color={colors.outline} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: {
    padding: spacing.containerPadding,
    gap: spacing.lg,
    paddingBottom: spacing.xl * 2,
  },
  loader: {
    marginTop: spacing.xl,
  },
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: 200,
    backgroundColor: colors.surfaceContainerHigh,
  },
  thumbnailPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    padding: spacing.lg,
    gap: spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  flex1: {
    flex: 1,
  },
  code: {
    ...typography.labelMd,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.4,
  },
  title: {
    ...typography.headlineLg,
    fontSize: 22,
    color: colors.onSurface,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 4,
    backgroundColor: 'rgba(0,74,198,0.08)',
    borderRadius: radius.full,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  categoryChipText: {
    ...typography.labelMd,
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  actionsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceVariant,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 36,
    paddingHorizontal: 14,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
    backgroundColor: colors.surfaceContainerLowest,
  },
  chipPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.97 }],
  },
  chipDisabled: {
    opacity: 0.5,
  },
  chipPrimary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipDanger: {
    backgroundColor: colors.errorContainer,
    borderColor: colors.errorContainer,
  },
  chipText: {
    ...typography.labelMd,
    fontSize: 13,
    fontWeight: '700',
    color: colors.primary,
  },
  chipTextPrimary: {
    color: colors.onPrimary,
  },
  chipTextDanger: {
    color: colors.onErrorContainer,
  },
  linksGrid: {
    gap: spacing.sm,
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
    padding: spacing.md,
  },
  linkRowPressed: {
    backgroundColor: colors.surfaceContainerLow,
  },
  linkIcon: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    backgroundColor: `${colors.primary}1A`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkLabel: {
    ...typography.bodyLg,
    fontWeight: '600',
    color: colors.onSurface,
  },
  linkSub: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
});
