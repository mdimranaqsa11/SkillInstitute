import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing } from '../../constants';
import { can } from '../../constants/roles';
import AppHeader from '../../components/navigation/AppHeader';
import SearchBar from '../../components/forms/SearchBar';
import PrimaryButton from '../../components/common/PrimaryButton';
import EmptyState from '../../components/feedback/EmptyState';
import CourseCard from '../../components/cards/CourseCard';
import { useAuth } from '../../context/AuthContext';
import { listCourses } from '../../api/courses';
import { listEnrollments } from '../../api/enrollments';

export default function CoursesScreen({ navigation }) {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [courses, setCourses] = useState([]);
  const [enrollCounts, setEnrollCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const [{ data: courseList }, { data: enrollments }] = await Promise.all([
        listCourses(1, 100),
        listEnrollments().catch(() => ({ data: [] })),
      ]);
      setCourses(courseList);
      const counts = {};
      enrollments.forEach(e => {
        if (e.status === 'ACTIVE') counts[e.course_id] = (counts[e.course_id] || 0) + 1;
      });
      setEnrollCounts(counts);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    const unsub = navigation.addListener('focus', load);
    return unsub;
  }, [navigation, load]);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  const filtered = useMemo(() => {
    if (!query.trim()) return courses;
    const q = query.toLowerCase();
    return courses.filter(c => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q));
  }, [query, courses]);

  const rows = useMemo(() => {
    const chunks = [];
    for (let i = 0; i < filtered.length; i += 2) chunks.push(filtered.slice(i, i + 2));
    return chunks;
  }, [filtered]);

  const canWrite = can(user, 'writeContent');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AppHeader title="Institute ERP" />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Courses</Text>
            <Text style={styles.subtitle}>Manage and view all courses.</Text>
          </View>
        </View>

        {canWrite && (
          <PrimaryButton
            title="Add Course"
            icon="add"
            iconPosition="left"
            onPress={() => navigation.navigate('CourseForm')}
            style={styles.addButton}
          />
        )}

        <SearchBar value={query} onChangeText={setQuery} placeholder="Search courses..." />

        {loading ? (
          <ActivityIndicator color={colors.primary} style={styles.loader} />
        ) : (
          <View style={styles.grid}>
            {filtered.length === 0 && (
              <EmptyState icon="menu-book" title="No courses found" description="Try a different search, or add your first course." />
            )}
            {rows.map((row, idx) => (
              <View key={idx} style={styles.row}>
                {row.map(course => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    students={enrollCounts[course.id] || 0}
                    onPress={() => navigation.navigate('CourseDetails', { courseId: course.id })}
                  />
                ))}
                {row.length === 1 && <View style={styles.spacer} />}
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
    gap: spacing.md,
    paddingBottom: spacing.xl * 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    ...typography.headlineLg,
    fontSize: 26,
    color: colors.onBackground,
  },
  subtitle: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginTop: 4,
  },
  addButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 24,
    width: undefined,
  },
  grid: {
    gap: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  spacer: {
    flex: 1,
  },
  loader: {
    marginTop: spacing.xl,
  },
});
