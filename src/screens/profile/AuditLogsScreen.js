import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing, typography } from '../../constants';
import DetailHeader from '../../components/navigation/DetailHeader';
import EmptyState from '../../components/feedback/EmptyState';
import Icon from '../../components/common/Icon';
import PrimaryButton from '../../components/common/PrimaryButton';
import { listAuditLogs } from '../../api/auditLogs';
import { describeAuditLog } from '../../utils/auditLog';
import { formatDateTime } from '../../utils/formatDate';

export default function AuditLogsScreen({ navigation }) {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadPage = async (pageNum, append) => {
    if (append) setLoadingMore(true);
    try {
      const { data, pagination } = await listAuditLogs(pageNum, 20);
      setLogs(prev => (append ? [...prev, ...data] : data));
      setTotalPages(pagination?.total_pages || 1);
      setPage(pageNum);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    loadPage(1, false);
  }, []);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <DetailHeader title="Audit Logs" onBack={() => navigation.goBack()} />
      {loading ? (
        <ActivityIndicator color={colors.primary} style={styles.loader} />
      ) : (
        <FlatList
          data={logs}
          keyExtractor={item => String(item.id)}
          contentContainerStyle={styles.content}
          ListEmptyComponent={<EmptyState icon="history" title="No audit logs yet" description="Actions like publishing exams or approving enrollments will show here." />}
          renderItem={({ item }) => {
            const d = describeAuditLog(item);
            return (
              <View style={styles.row}>
                <View style={[styles.icon, { backgroundColor: `${d.tint}26` }]}>
                  <Icon name={d.icon} size={18} color={d.tint} />
                </View>
                <View style={styles.rowInfo}>
                  <Text style={styles.rowTitle}>{d.title}</Text>
                  <Text style={styles.rowMeta}>{d.meta} • {formatDateTime(item.created_at)}</Text>
                </View>
              </View>
            );
          }}
          ListFooterComponent={
            page < totalPages ? (
              <PrimaryButton
                title="Load More"
                onPress={() => loadPage(page + 1, true)}
                loading={loadingMore}
                style={styles.loadMore}
              />
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: {
    padding: spacing.containerPadding,
    gap: spacing.sm,
    paddingBottom: spacing.xl * 2,
  },
  loader: {
    marginTop: spacing.xl,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
    padding: spacing.md,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowInfo: {
    flex: 1,
    gap: 2,
  },
  rowTitle: {
    ...typography.bodyMd,
    fontWeight: '600',
    color: colors.onSurface,
  },
  rowMeta: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
  },
  loadMore: {
    marginTop: spacing.sm,
  },
});
