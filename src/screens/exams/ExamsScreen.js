import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing } from '../../constants';
import AppHeader from '../../components/navigation/AppHeader';
import FilterButton from '../../components/common/FilterButton';
import Fab from '../../components/common/Fab';
import EmptyState from '../../components/feedback/EmptyState';
import { ExamCard, OngoingExamCard } from '../../components/cards/ExamCard';
import { exams, examTabs, currentUser } from '../../data/mockData';

export default function ExamsScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState('All');

  const filteredExams = useMemo(() => {
    if (activeTab === 'All') return exams;
    return exams.filter(exam => exam.statusLabel === activeTab);
  }, [activeTab]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AppHeader
        title="Institute ERP"
        subtitle="Main Branch"
        avatarUri={currentUser.avatarUri}
        onNotificationsPress={() => navigation.getParent()?.navigate('More', { screen: 'Notifications' })}
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View>
          <Text style={styles.title}>Exams</Text>
          <Text style={styles.subtitle}>Manage and track institute examinations.</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsRow}>
          {examTabs.map(tab => (
            <FilterButton key={tab} label={tab} active={activeTab === tab} onPress={() => setActiveTab(tab)} />
          ))}
        </ScrollView>

        <View style={styles.list}>
          {filteredExams.length === 0 && (
            <EmptyState
              icon="quiz"
              title="No exams found"
              description="There are no exams in this category yet."
            />
          )}
          {filteredExams.map(exam =>
            exam.status === 'ongoing' ? (
              <OngoingExamCard
                key={exam.id}
                exam={exam}
                onPress={() => navigation.navigate('ExamDetails', { exam })}
              />
            ) : (
              <ExamCard
                key={exam.id}
                exam={exam}
                onPress={() => navigation.navigate('ExamDetails', { exam })}
              />
            ),
          )}
        </View>
      </ScrollView>
      <Fab style={styles.fab} onPress={() => {}} />
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
  fab: {
    bottom: 24,
  },
});
