import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing } from '../../constants';
import AppHeader from '../../components/navigation/AppHeader';
import SearchBar from '../../components/forms/SearchBar';
import PrimaryButton from '../../components/common/PrimaryButton';
import EmptyState from '../../components/feedback/EmptyState';
import CourseCard from '../../components/cards/CourseCard';
import { courses } from '../../data/mockData';

export default function CoursesScreen({ navigation }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return courses;
    const q = query.toLowerCase();
    return courses.filter(c => c.title.toLowerCase().includes(q) || c.code.toLowerCase().includes(q));
  }, [query]);

  const rows = useMemo(() => {
    const chunks = [];
    for (let i = 0; i < filtered.length; i += 2) chunks.push(filtered.slice(i, i + 2));
    return chunks;
  }, [filtered]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AppHeader title="Institute ERP" onNotificationsPress={() => navigation.getParent()?.navigate('More', { screen: 'Notifications' })} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Courses</Text>
            <Text style={styles.subtitle}>Manage and view all active courses.</Text>
          </View>
        </View>

        <PrimaryButton title="Add Course" icon="add" iconPosition="left" onPress={() => {}} style={styles.addButton} />

        <SearchBar value={query} onChangeText={setQuery} placeholder="Search courses..." />

        <View style={styles.grid}>
          {filtered.length === 0 && (
            <EmptyState icon="menu-book" title="No courses found" description="Try a different search term." />
          )}
          {rows.map((row, idx) => (
            <View key={idx} style={styles.row}>
              {row.map(course => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onPress={() => navigation.navigate('CourseDetails', { course })}
                />
              ))}
              {row.length === 1 && <View style={styles.spacer} />}
            </View>
          ))}
        </View>
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
});
