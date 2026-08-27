import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, Pressable, StyleSheet, ActivityIndicator, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing, typography } from '../../constants';
import DetailHeader from '../../components/navigation/DetailHeader';
import Icon from '../../components/common/Icon';
import StatusBadge from '../../components/common/StatusBadge';
import { getCourseDetail } from '../../api/courses';
import { listEnrollments } from '../../api/enrollments';
import { formatDateTime } from '../../utils/formatDate';

const RESOURCE_ICONS = { PDF: 'picture-as-pdf', DOCUMENT: 'description', IMAGE: 'image', VIDEO: 'videocam', LINK: 'link', OTHER: 'attachment' };

export default function CoursePreviewScreen({ route, navigation }) {
  const { courseId } = route.params;

  const [course, setCourse] = useState(null);
  const [enrolledCount, setEnrolledCount] = useState(0);
  const [loading, setLoading] = useState(true);

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
    load();
  }, [load]);

  if (loading || !course) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <DetailHeader title="Course Preview" onBack={() => navigation.goBack()} />
        <ActivityIndicator color={colors.primary} style={styles.loader} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <DetailHeader title="Course Preview" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        {!!course.thumbnail_url && <Image source={{ uri: course.thumbnail_url }} style={styles.thumbnail} />}

        <View style={styles.headerBlock}>
          <View style={styles.titleRow}>
            <View style={styles.flex1}>
              {!!course.category_name && <Text style={styles.category}>{course.category_name}</Text>}
              <Text style={styles.courseTitle}>{course.name}</Text>
            </View>
            <StatusBadge status={course.status} />
          </View>
          {!!course.description && <Text style={styles.courseDescription}>{course.description}</Text>}

          <View style={styles.metaRow}>
            {!!course.code && (
              <View style={styles.metaChip}>
                <Icon name="local-offer" size={15} color={colors.onSurfaceVariant} />
                <Text style={styles.metaChipText}>{course.code}</Text>
              </View>
            )}
            {!!course.duration_value && (
              <View style={styles.metaChip}>
                <Icon name="schedule" size={15} color={colors.onSurfaceVariant} />
                <Text style={styles.metaChipText}>{course.duration_value} {course.duration_unit?.toLowerCase()}</Text>
              </View>
            )}
            {!!course.price && (
              <View style={styles.metaChip}>
                <Icon name="payments" size={15} color={colors.onSurfaceVariant} />
                <Text style={styles.metaChipText}>{course.price}</Text>
              </View>
            )}
            <View style={styles.metaChip}>
              <Icon name="group" size={15} color={colors.onSurfaceVariant} />
              <Text style={styles.metaChipText}>{enrolledCount} enrolled</Text>
            </View>
            <View style={styles.metaChip}>
              <Icon name={course.self_enrollment_enabled ? 'check-circle' : 'cancel'} size={15} color={colors.onSurfaceVariant} />
              <Text style={styles.metaChipText}>
                Self-enrollment {course.self_enrollment_enabled ? 'enabled' : 'disabled'}
              </Text>
            </View>
            {!!course.created_at && (
              <View style={styles.metaChip}>
                <Icon name="event" size={15} color={colors.onSurfaceVariant} />
                <Text style={styles.metaChipText}>Created {formatDateTime(course.created_at)}</Text>
              </View>
            )}
          </View>
        </View>

        {course.modules.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Course Content</Text>
            {course.modules.map(mod => (
              <View key={mod.id} style={styles.moduleCard}>
                <Text style={styles.moduleTitle}>{mod.title}</Text>
                {!!mod.description && <Text style={styles.moduleDescription}>{mod.description}</Text>}

                {mod.lessons.map(lesson => (
                  <View key={lesson.id} style={styles.lessonCard}>
                    <View style={styles.lessonHeaderRow}>
                      <Icon name="play-circle-outline" size={18} color={colors.primary} />
                      <Text style={styles.lessonTitle}>{lesson.title}</Text>
                      {!!lesson.duration_minutes && (
                        <Text style={styles.lessonDuration}>{lesson.duration_minutes} min</Text>
                      )}
                    </View>

                    {!!lesson.description && <Text style={styles.lessonDescription}>{lesson.description}</Text>}
                    {!!lesson.content && <Text style={styles.lessonContent}>{lesson.content}</Text>}

                    {lesson.resources.map(res => (
                      <Pressable
                        key={res.id}
                        style={styles.resourceRow}
                        onPress={() => Linking.openURL(res.file_url).catch(() => {})}
                      >
                        <Icon name={RESOURCE_ICONS[res.resource_type] || 'attachment'} size={15} color={colors.onSurfaceVariant} />
                        <Text style={styles.resourceText} numberOfLines={1}>{res.name}</Text>
                      </Pressable>
                    ))}
                  </View>
                ))}
              </View>
            ))}
          </View>
        )}

        {course.exams.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Exams</Text>
            {course.exams.map(exam => (
              <View key={exam.id} style={styles.examRow}>
                <Icon name="quiz" size={18} color={colors.primary} />
                <Text style={styles.examTitle}>{exam.title}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
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
  thumbnail: {
    width: '100%',
    height: 220,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceContainerHigh,
  },
  headerBlock: {
    gap: spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: spacing.sm,
  },
  flex1: {
    flex: 1,
  },
  category: {
    ...typography.labelMd,
    color: colors.primary,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  courseTitle: {
    ...typography.headlineLg,
    fontSize: 24,
    color: colors.onSurface,
  },
  courseDescription: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginTop: spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  metaChipText: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
  },
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    ...typography.headlineMd,
    fontSize: 18,
    color: colors.onSurface,
  },
  moduleCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  moduleTitle: {
    ...typography.bodyLg,
    fontWeight: '700',
    color: colors.onSurface,
  },
  moduleDescription: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
  lessonCard: {
    gap: 4,
    paddingTop: spacing.sm,
    paddingLeft: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceVariant,
    borderLeftWidth: 2,
    borderLeftColor: colors.primary + '40',
  },
  lessonHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  lessonTitle: {
    ...typography.bodyMd,
    fontWeight: '600',
    color: colors.onSurface,
    flex: 1,
  },
  lessonDuration: {
    ...typography.labelMd,
    color: colors.outline,
  },
  lessonDescription: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginLeft: 24,
  },
  lessonContent: {
    ...typography.bodyMd,
    color: colors.onSurface,
    marginLeft: 24,
  },
  resourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginLeft: 24,
  },
  resourceText: {
    ...typography.labelMd,
    color: colors.primary,
    flex: 1,
  },
  examRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
    padding: spacing.md,
  },
  examTitle: {
    ...typography.bodyLg,
    fontWeight: '600',
    color: colors.onSurface,
  },
});
