import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing, typography } from '../../constants';
import { can } from '../../constants/roles';
import DetailHeader from '../../components/navigation/DetailHeader';
import EmptyState from '../../components/feedback/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';
import { useAuth } from '../../context/AuthContext';
import { useAlert } from '../../context/AlertContext';
import { listEnrollmentRequests, approveEnrollmentRequest, rejectEnrollmentRequest } from '../../api/enrollmentRequests';
import { ApiError } from '../../api/client';
import { formatDateTime } from '../../utils/formatDate';

export default function EnrollmentRequestsScreen({ route, navigation }) {
  const courseId = route.params?.courseId;
  const courseName = route.params?.courseName;
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const canManage = can(user, 'manageEnrollments');

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    try {
      const { data } = await listEnrollmentRequests();
      setRequests(courseId ? data.filter(r => r.course_id === courseId) : data);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    const unsub = navigation.addListener('focus', load);
    return unsub;
  }, [navigation, load]);

  const pending = useMemo(() => requests.filter(r => r.status === 'PENDING'), [requests]);
  const resolved = useMemo(() => requests.filter(r => r.status !== 'PENDING'), [requests]);

  const approve = async request => {
    setBusyId(request.id);
    try {
      await approveEnrollmentRequest(request.id);
      load();
    } catch (e) {
      showAlert('Failed', e instanceof ApiError ? e.message : 'Could not approve request');
    } finally {
      setBusyId(null);
    }
  };

  const reject = request => {
    showAlert('Reject request?', `Student #${request.student_id}'s request will be rejected.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Reject',
        style: 'destructive',
        onPress: async () => {
          setBusyId(request.id);
          try {
            await rejectEnrollmentRequest(request.id);
            load();
          } catch (e) {
            showAlert('Failed', e instanceof ApiError ? e.message : 'Could not reject request');
          } finally {
            setBusyId(null);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <DetailHeader title={courseName ? `${courseName} — Requests` : 'Enrollment Requests'} onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <ActivityIndicator color={colors.primary} style={styles.loader} />
        ) : requests.length === 0 ? (
          <EmptyState icon="person-add" title="No enrollment requests" description="Student enrollment requests will show up here." />
        ) : (
          <>
            {pending.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Pending ({pending.length})</Text>
                <View style={styles.list}>
                  {pending.map(req => (
                    <View key={req.id} style={styles.card}>
                      <View style={styles.cardHeader}>
                        <Text style={styles.studentText}>Student #{req.student_id}</Text>
                        <StatusBadge status={req.status} />
                      </View>
                      {!!req.message && <Text style={styles.message}>"{req.message}"</Text>}
                      <Text style={styles.meta}>{formatDateTime(req.requested_at)}</Text>
                      {canManage && (
                        <View style={styles.actions}>
                          <Pressable
                            style={[styles.actionBtn, styles.approveBtn]}
                            onPress={() => approve(req)}
                            disabled={busyId === req.id}
                          >
                            <Text style={styles.approveText}>Approve</Text>
                          </Pressable>
                          <Pressable
                            style={[styles.actionBtn, styles.rejectBtn]}
                            onPress={() => reject(req)}
                            disabled={busyId === req.id}
                          >
                            <Text style={styles.rejectText}>Reject</Text>
                          </Pressable>
                        </View>
                      )}
                    </View>
                  ))}
                </View>
              </View>
            )}

            {resolved.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Resolved</Text>
                <View style={styles.list}>
                  {resolved.map(req => (
                    <View key={req.id} style={styles.card}>
                      <View style={styles.cardHeader}>
                        <Text style={styles.studentText}>Student #{req.student_id}</Text>
                        <StatusBadge status={req.status} />
                      </View>
                      {!!req.rejection_reason && <Text style={styles.message}>{req.rejection_reason}</Text>}
                      <Text style={styles.meta}>{formatDateTime(req.reviewed_at)}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: {
    padding: spacing.containerPadding,
    gap: spacing.xl,
    paddingBottom: spacing.xl * 2,
  },
  loader: {
    marginTop: spacing.xl,
  },
  section: {
    gap: spacing.md,
  },
  sectionTitle: {
    ...typography.headlineMd,
    fontSize: 16,
    color: colors.onSurface,
  },
  list: {
    gap: spacing.sm,
  },
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
    padding: spacing.md,
    gap: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  studentText: {
    ...typography.bodyLg,
    fontWeight: '600',
    color: colors.onSurface,
  },
  message: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    fontStyle: 'italic',
  },
  meta: {
    ...typography.labelMd,
    color: colors.outline,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  actionBtn: {
    flex: 1,
    height: 36,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  approveBtn: {
    backgroundColor: colors.successContainer,
    borderColor: colors.successContainerBorder,
  },
  approveText: {
    ...typography.labelMd,
    color: colors.success,
    fontWeight: '700',
  },
  rejectBtn: {
    backgroundColor: colors.errorContainer,
    borderColor: 'transparent',
  },
  rejectText: {
    ...typography.labelMd,
    color: colors.onErrorContainer,
    fontWeight: '700',
  },
});
