import React, { useMemo, useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../../constants';
import DetailHeader from '../../components/navigation/DetailHeader';
import SearchBar from '../../components/forms/SearchBar';
import BranchCard from '../../components/cards/BranchCard';
import Fab from '../../components/common/Fab';
import EmptyState from '../../components/feedback/EmptyState';
import { branches } from '../../data/mockData';

export default function BranchesScreen({ navigation }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return branches;
    const q = query.toLowerCase();
    return branches.filter(b => b.name.toLowerCase().includes(q));
  }, [query]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <DetailHeader title="Institute Branches" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search branches..." />

        <View style={styles.list}>
          {filtered.length === 0 && (
            <EmptyState icon="storefront" title="No branches found" description="Try a different search term." />
          )}
          {filtered.map(branch => (
            <BranchCard
              key={branch.id}
              branch={branch}
              onPress={() => navigation.navigate('BranchDetails', { branch })}
            />
          ))}
        </View>
      </ScrollView>
      <Fab style={styles.fab} onPress={() => {}} />
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
  list: {
    gap: spacing.lg,
  },
  fab: {
    bottom: 24,
  },
});
