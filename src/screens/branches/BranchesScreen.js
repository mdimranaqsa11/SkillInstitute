import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing } from '../../constants';
import { can } from '../../constants/roles';
import DetailHeader from '../../components/navigation/DetailHeader';
import SearchBar from '../../components/forms/SearchBar';
import BranchCard from '../../components/cards/BranchCard';
import Fab from '../../components/common/Fab';
import EmptyState from '../../components/feedback/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { listBranches } from '../../api/branches';

export default function BranchesScreen({ navigation }) {
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      const { data } = await listBranches(1, 100);
      setBranches(data);
      setError(null);
    } catch (e) {
      setError(e.message || 'Failed to load branches');
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
    if (!query.trim()) return branches;
    const q = query.toLowerCase();
    return branches.filter(b => b.name.toLowerCase().includes(q) || b.code.toLowerCase().includes(q));
  }, [query, branches]);

  const canManage = can(user, 'manageBranches');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <DetailHeader title="Institute Branches" onBack={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <SearchBar value={query} onChangeText={setQuery} placeholder="Search branches..." />

        {loading ? (
          <ActivityIndicator color={colors.primary} style={styles.loader} />
        ) : (
          <View style={styles.list}>
            {error && (
              <EmptyState icon="error-outline" title="Couldn't load branches" description={error} />
            )}
            {!error && filtered.length === 0 && (
              <EmptyState
                icon="storefront"
                title="No branches found"
                description={
                  canManage ? 'Try a different search, or add your first branch.' : 'Try a different search term.'
                }
              />
            )}
            {filtered.map(branch => (
              <BranchCard
                key={branch.id}
                branch={branch}
                onPress={() => navigation.navigate('BranchDetails', { branch })}
              />
            ))}
          </View>
        )}
      </ScrollView>
      {canManage && <Fab style={styles.fab} onPress={() => navigation.navigate('BranchForm')} />}
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
  loader: {
    marginTop: spacing.xl,
  },
  fab: {
    bottom: 24,
  },
});
