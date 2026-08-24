import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, radius } from '../../constants';
import AppHeader from '../../components/navigation/AppHeader';
import SearchBar from '../../components/forms/SearchBar';
import ResultRow from '../../components/cards/ResultRow';
import PrimaryButton from '../../components/common/PrimaryButton';
import Icon from '../../components/common/Icon';
import EmptyState from '../../components/feedback/EmptyState';
import { resultStats, results, currentUser } from '../../data/mockData';

export default function ResultsScreen({ navigation }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return results;
    const q = query.toLowerCase();
    return results.filter(r => r.studentName.toLowerCase().includes(q) || r.studentId.toLowerCase().includes(q));
  }, [query]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AppHeader
        title="Institute ERP"
        avatarUri={currentUser.avatarUri}
        onNotificationsPress={() => navigation.getParent()?.navigate('More', { screen: 'Notifications' })}
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View>
          <Text style={styles.title}>Results Management</Text>
          <Text style={styles.subtitle}>Skill Institute - Main Campus</Text>
        </View>

        <View style={styles.statsGrid}>
          {resultStats.map(stat => (
            <View key={stat.id} style={styles.statBox}>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={[styles.statValue, { color: stat.tint }]}>{stat.value}</Text>
            </View>
          ))}
        </View>

        <View style={styles.toolsRow}>
          <SearchBar
            value={query}
            onChangeText={setQuery}
            placeholder="Search by student name or ID..."
            style={styles.searchFlex}
          />
        </View>
        <View style={styles.actionButtonsRow}>
          <Pressable style={styles.secondaryChip}>
            <Icon name="filter-list" size={18} color={colors.onSurface} />
            <Text style={styles.secondaryChipText}>Filter</Text>
          </Pressable>
          <Pressable style={styles.secondaryChip}>
            <Icon name="download" size={18} color={colors.onSurface} />
            <Text style={styles.secondaryChipText}>Export</Text>
          </Pressable>
        </View>

        <View style={styles.listCard}>
          {filtered.length === 0 && (
            <EmptyState icon="assessment" title="No results found" description="Try a different search term." />
          )}
          {filtered.map((result, index) => (
            <ResultRow
              key={result.id}
              result={result}
              index={index}
              onPress={() => navigation.navigate('ResultDetails', { result })}
            />
          ))}
        </View>

        <PrimaryButton title="Publish Results" icon="publish" iconPosition="left" onPress={() => {}} style={styles.publishButton} />
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
  toolsRow: {
    flexDirection: 'row',
  },
  searchFlex: {
    flex: 1,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  secondaryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.outlineVariant,
  },
  secondaryChipText: {
    ...typography.bodyMd,
    color: colors.onSurface,
  },
  listCard: {
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(195,198,215,0.2)',
    overflow: 'hidden',
  },
  publishButton: {
    alignSelf: 'flex-end',
    paddingHorizontal: 24,
    width: undefined,
  },
});
