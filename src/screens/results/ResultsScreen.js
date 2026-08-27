import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, radius } from '../../constants';
import AppHeader from '../../components/navigation/AppHeader';
import SearchBar from '../../components/forms/SearchBar';
import ResultRow from '../../components/cards/ResultRow';
import EmptyState from '../../components/feedback/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { listCourses } from '../../api/courses';
import { listCourseExams, getExamResults } from '../../api/exams';

export default function ResultsScreen({ navigation }) {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data: courses } = await listCourses(1, 100);
      const examLists = await Promise.all(
        courses.slice(0, 8).map(c =>
          listCourseExams(c.id)
            .then(r => r.data.map(e => ({ ...e, courseName: c.name })))
            .catch(() => []),
        ),
      );
      const exams = examLists.flat().filter(e => e.status === 'PUBLISHED' || e.status === 'CLOSED');
      const resultLists = await Promise.all(
        exams.map(e =>
          getExamResults(e.id)
            .then(r => r.data.map(attempt => ({ ...attempt, examTitle: e.title, courseName: e.courseName })))
            .catch(() => []),
        ),
      );
      setResults(resultLists.flat());
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
    if (!query.trim()) return results;
    const q = query.toLowerCase();
    return results.filter(
      r => String(r.student_id).includes(q) || r.examTitle?.toLowerCase().includes(q) || r.courseName?.toLowerCase().includes(q),
    );
  }, [query, results]);

  const stats = useMemo(() => {
    const graded = results.filter(r => r.percentage != null);
    const passed = graded.filter(r => r.result_status === 'PASS');
    const avg = graded.length ? graded.reduce((s, r) => s + r.percentage, 0) / graded.length : 0;
    return {
      avgScore: graded.length ? `${avg.toFixed(1)}%` : '—',
      passRate: graded.length ? `${((passed.length / graded.length) * 100).toFixed(0)}%` : '—',
      totalGraded: results.length,
    };
  }, [results]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AppHeader title="Institute ERP" subtitle={user?.full_name || user?.email} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View>
          <Text style={styles.title}>Results Management</Text>
          <Text style={styles.subtitle}>Across all published and closed exams.</Text>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Avg Score</Text>
            <Text style={[styles.statValue, { color: colors.primary }]}>{stats.avgScore}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Pass Rate</Text>
            <Text style={[styles.statValue, { color: colors.primary }]}>{stats.passRate}</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Total Graded</Text>
            <Text style={[styles.statValue, { color: colors.onSurface }]}>{stats.totalGraded}</Text>
          </View>
        </View>

        <SearchBar
          value={query}
          onChangeText={setQuery}
          placeholder="Search by student ID, exam, or course..."
        />

        {loading ? (
          <ActivityIndicator color={colors.primary} style={styles.loader} />
        ) : (
          <View style={styles.listCard}>
            {filtered.length === 0 && (
              <EmptyState icon="assessment" title="No results found" description="Submitted exam attempts will show here once exams are published." />
            )}
            {filtered.map((result, index) => (
              <ResultRow
                key={result.id}
                result={result}
                index={index}
                onPress={() => navigation.navigate('ResultDetails', { attemptId: result.id })}
              />
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
  title: {
    ...typography.headlineLgMobile,
    color: colors.onBackground,
  },
  subtitle: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  statBox: {
    flexBasis: '46%',
    flexGrow: 1,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(195,198,215,0.2)',
    padding: spacing.md,
    gap: 4,
  },
  statLabel: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
    marginBottom: 4,
  },
  statValue: {
    ...typography.display,
    fontSize: 28,
  },
  loader: {
    marginTop: spacing.xl,
  },
  listCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(195,198,215,0.2)',
    overflow: 'hidden',
  },
});
