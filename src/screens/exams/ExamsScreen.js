import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing } from '../../constants';
import AppHeader from '../../components/navigation/AppHeader';
import FilterButton from '../../components/common/FilterButton';
import EmptyState from '../../components/feedback/EmptyState';
import { ExamCard } from '../../components/cards/ExamCard';
import { useAuth } from '../../context/AuthContext';
import { listCourses } from '../../api/courses';
import { listCourseExams } from '../../api/exams';

const TABS = ['All', 'DRAFT', 'PUBLISHED', 'CLOSED', 'ARCHIVED'];

export default function ExamsScreen({ navigation }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('All');
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data: courses } = await listCourses(1, 100);
      const lists = await Promise.all(
        courses.map(c =>
          listCourseExams(c.id)
            .then(r => r.data.map(e => ({ ...e, courseName: c.name })))
            .catch(() => []),
        ),
      );
      setExams(lists.flat().sort((a, b) => b.id - a.id));
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

  const filteredExams = useMemo(() => {
    if (activeTab === 'All') return exams;
    return exams.filter(exam => exam.status === activeTab);
  }, [activeTab, exams]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AppHeader title="Institute ERP" subtitle={user?.full_name || user?.email} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View>
          <Text style={styles.title}>Exams</Text>
          <Text style={styles.subtitle}>Across all courses. Tap a course to create a new exam.</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsRow}>
          {TABS.map(tab => (
            <FilterButton key={tab} label={tab} active={activeTab === tab} onPress={() => setActiveTab(tab)} />
          ))}
        </ScrollView>

        {loading ? (
          <ActivityIndicator color={colors.primary} style={styles.loader} />
        ) : (
          <View style={styles.list}>
            {filteredExams.length === 0 && (
              <EmptyState
                icon="quiz"
                title="No exams found"
                description="Open a course and use 'Exams' to create one."
              />
            )}
            {filteredExams.map(exam => (
              <ExamCard
                key={exam.id}
                exam={exam}
                onPress={() => navigation.navigate('Courses', { screen: 'ExamDetails', params: { examId: exam.id } })}
              />
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.containerPadding,
    gap: spacing.md,
    paddingBottom: spacing.xl * 2,
  },
  title: {
    ...typography.headlineLgMobile,
    color: colors.onBackground,
  },
  subtitle: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginTop: 4,
  },
  tabsRow: {
    gap: 8,
    paddingVertical: 4,
  },
  list: {
    gap: spacing.md,
  },
  loader: {
    marginTop: spacing.xl,
  },
});
