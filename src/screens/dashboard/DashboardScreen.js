import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, radius, shadow } from '../../constants';
import { can } from '../../constants/roles';
import AppHeader from '../../components/navigation/AppHeader';
import StatCard from '../../components/cards/StatCard';
import SectionHeader from '../../components/common/SectionHeader';
import Icon from '../../components/common/Icon';
import EmptyState from '../../components/feedback/EmptyState';
import Skeleton from '../../components/feedback/Skeleton';
import { useAuth } from '../../context/AuthContext';
import { listCourses } from '../../api/courses';
import { listCourseExams } from '../../api/exams';
import { listAuditLogs } from '../../api/auditLogs';
import { listBranches } from '../../api/branches';
import { getMyInstitute, getInstituteProfile } from '../../api/institute';
import { splitDate, formatTime, timeAgo } from '../../utils/formatDate';
import { describeAuditLog } from '../../utils/auditLog';

const QUICK_ACTIONS = [
  { id: 'create-exam', icon: 'post-add', label: 'Create Exam', tint: colors.primary, target: 'Courses' },
  { id: 'add-course', icon: 'library-add', label: 'Add Course', tint: colors.secondary, target: 'Courses' },
  { id: 'publish-result', icon: 'fact-check', label: 'Manage Exams', tint: colors.tertiary, target: 'Exams' },
  { id: 'add-branch', icon: 'domain-add', label: 'Branches', tint: colors.success, permission: 'manageBranches', navigate: nav => nav.navigate('More', { screen: 'Branches' }) },
];

const BRANCH_TINTS = [colors.primary, colors.secondary, colors.tertiary];
const BRANCH_ICONS = ['business', 'corporate-fare', 'domain'];

export default function DashboardScreen({ navigation }) {
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [coursesTotal, setCoursesTotal] = useState(null);
  const [upcomingExams, setUpcomingExams] = useState([]);
  const [branches, setBranches] = useState([]);
  const [activity, setActivity] = useState([]);
  const [institute, setInstitute] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [instituteResult, profileResult] = await Promise.all([
        getMyInstitute().catch(() => null),
        getInstituteProfile().catch(() => null),
      ]);
      if (instituteResult || profileResult) {
        setInstitute({ ...(instituteResult?.data || {}), ...(profileResult?.data || {}) });
      }

      const { data: courses, pagination } = await listCourses(1, 20);
      setCoursesTotal(pagination?.total ?? courses.length);

      const now = Date.now();
      const examLists = await Promise.all(
        courses.slice(0, 8).map(c =>
          listCourseExams(c.id)
            .then(r => r.data.map(e => ({ ...e, courseName: c.name })))
            .catch(() => []),
        ),
      );
      const upcoming = examLists
        .flat()
        .filter(e => e.status === 'PUBLISHED' && e.starts_at && new Date(e.starts_at).getTime() > now)
        .sort((a, b) => new Date(a.starts_at) - new Date(b.starts_at))
        .slice(0, 3);
      setUpcomingExams(upcoming);

      if (can(user, 'manageBranches')) {
        const { data: branchList } = await listBranches(1, 8);
        setBranches(branchList);
      }

      if (can(user, 'viewAuditLogs')) {
        const { data: logs } = await listAuditLogs(1, 5);
        setActivity(logs);
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const onRefresh = () => {
    setRefreshing(true);
    load();
  };

  const visibleActions = QUICK_ACTIONS.filter(a => !a.permission || can(user, a.permission));

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AppHeader
        subtitle="Good day,"
        title={user?.full_name || user?.email || 'Admin'}
        avatarName={user?.full_name || user?.email}
        branchLabel={user?.role?.replace(/_/g, ' ')}
      />
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {institute ? (
          <Pressable
            style={({ pressed }) => [styles.instituteCard, pressed && styles.instituteCardPressed]}
            onPress={() => navigation.navigate('InstituteDetails')}
          >
            <View style={styles.instituteTopRow}>
              <View style={styles.instituteIconWrap}>
                <Icon name="domain" size={24} color={colors.primary} />
              </View>
              <View style={styles.instituteInfo}>
                <Text style={styles.instituteName} numberOfLines={1}>{institute.legal_name || institute.name}</Text>
                <Text style={styles.instituteMeta} numberOfLines={1}>
                  {[institute.city, institute.country].filter(Boolean).join(', ') || institute.code}
                </Text>
              </View>
              <Icon name="chevron-right" size={20} color={colors.outline} />
            </View>
            {!!institute.id && (
              <View style={styles.instituteIdBadge}>
                <Text style={styles.instituteIdLabel}>INSTITUTE ID</Text>
                <Text style={styles.instituteIdValue}>{institute.id}</Text>
              </View>
            )}
          </Pressable>
        ) : loading ? (
          <View style={styles.instituteCard}>
            <View style={styles.instituteTopRow}>
              <Skeleton width={48} height={48} radius={radius.md} />
              <View style={styles.instituteInfo}>
                <Skeleton width="70%" height={17} style={styles.skeletonGap} />
                <Skeleton width="40%" height={13} />
              </View>
            </View>
            <Skeleton width="100%" height={52} radius={radius.md} style={styles.skeletonGap} />
          </View>
        ) : null}

        <View style={styles.statsGrid}>
          <StatCard
            icon="menu-book"
            label="Total Courses"
            value={String(coursesTotal ?? 0)}
            tint={colors.secondary}
            loading={loading}
          />
          <StatCard icon="quiz" label="Upcoming Exams" value={String(upcomingExams.length)} tint={colors.tertiary} loading={loading} />
        </View>

        <View>
          <SectionHeader title="Quick Actions" />
          <View style={styles.actionsGrid}>
            {visibleActions.map(action => (
              <Pressable
                key={action.id}
                style={({ pressed }) => [styles.actionTile, pressed && styles.actionTilePressed]}
                onPress={() => {
                  const parent = navigation.getParent();
                  if (!parent) return;
                  if (action.navigate) action.navigate(parent);
                  else parent.navigate(action.target);
                }}
              >
                <View style={[styles.actionIconWrap, { backgroundColor: `${action.tint}1A` }]}>
                  <Icon name={action.icon} size={22} color={action.tint} />
                </View>
                <Text style={styles.actionLabel}>{action.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {can(user, 'manageBranches') && (
          <View>
            <SectionHeader
              title="Branches"
              actionLabel="View All"
              onActionPress={() => navigation.getParent()?.navigate('More', { screen: 'Branches' })}
            />
            {loading ? (
              <View style={styles.branchesRow}>
                {[0, 1, 2].map(i => (
                  <View key={i} style={styles.branchCard}>
                    <Skeleton width={40} height={40} radius={radius.md} style={styles.skeletonGap} />
                    <Skeleton width="80%" height={14} style={styles.skeletonGap} />
                    <Skeleton width="50%" height={11} />
                  </View>
                ))}
              </View>
            ) : branches.length === 0 ? (
              <EmptyState icon="storefront" title="No branches yet" description="Use Branches in Quick Actions to add your first branch." />
            ) : (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.branchesRow}
              >
                {branches.map(branch => {
                  const tint = BRANCH_TINTS[branch.id % BRANCH_TINTS.length];
                  const isActive = branch.status === 'ACTIVE';
                  return (
                    <Pressable
                      key={branch.id}
                      style={({ pressed }) => [styles.branchCard, pressed && styles.branchCardPressed]}
                      onPress={() => navigation.getParent()?.navigate('More', { screen: 'BranchDetails', params: { branch } })}
                    >
                      <View style={[styles.branchIconWrap, { backgroundColor: `${tint}1A` }]}>
                        <Icon name={BRANCH_ICONS[branch.id % BRANCH_ICONS.length]} size={20} color={tint} />
                      </View>
                      <Text style={styles.branchName} numberOfLines={1}>{branch.name}</Text>
                      <View style={styles.branchStatusRow}>
                        <View style={[styles.branchStatusDot, !isActive && styles.branchStatusDotInactive]} />
                        <Text style={styles.branchStatusText}>{isActive ? 'Active' : 'Inactive'}</Text>
                      </View>
                    </Pressable>
                  );
                })}
              </ScrollView>
            )}
          </View>
        )}

        <View>
          <SectionHeader
            title="Upcoming Exams"
            actionLabel="View All"
            onActionPress={() => navigation.getParent()?.navigate('Exams')}
          />
          <View style={styles.examsCard}>
            {loading && (
              [0, 1].map(i => (
                <View key={i} style={[styles.examRow, i === 1 && styles.examRowLast]}>
                  <View style={styles.examLeft}>
                    <Skeleton width={48} height={48} radius={radius.md} />
                    <View style={styles.examInfo}>
                      <Skeleton width={140} height={15} style={styles.skeletonGap} />
                      <Skeleton width={90} height={11} style={styles.skeletonGap} />
                      <Skeleton width={110} height={11} />
                    </View>
                  </View>
                </View>
              ))
            )}
            {upcomingExams.length === 0 && !loading && (
              <View style={styles.emptyPad}>
                <EmptyState icon="quiz" title="No upcoming exams" description="Published exams with a start date will show here." />
              </View>
            )}
            {!loading && upcomingExams.map((exam, index) => {
              const { month, day } = splitDate(exam.starts_at);
              return (
                <Pressable
                  key={exam.id}
                  style={[styles.examRow, index === upcomingExams.length - 1 && styles.examRowLast]}
                  onPress={() => navigation.getParent()?.navigate('Exams', { screen: 'ExamDetails', params: { examId: exam.id } })}
                >
                  <View style={styles.examLeft}>
                    <View style={styles.dateBox}>
                      <Text style={styles.dateMonth}>{month}</Text>
                      <Text style={styles.dateDay}>{day}</Text>
                    </View>
                    <View style={styles.examInfo}>
                      <Text style={styles.examTitle}>{exam.title}</Text>
                      <View style={styles.examMetaRow}>
                        <Icon name="schedule" size={14} color={colors.onSurfaceVariant} />
                        <Text style={styles.examMetaText}>{formatTime(exam.starts_at)}</Text>
                      </View>
                      <View style={styles.examMetaRow}>
                        <Icon name="menu-book" size={14} color={colors.onSurfaceVariant} />
                        <Text style={styles.examMetaText}>{exam.courseName}</Text>
                      </View>
                    </View>
                  </View>
                  <Icon name="chevron-right" size={20} color={colors.outline} />
                </Pressable>
              );
            })}
          </View>
        </View>

        <View>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          {!can(user, 'viewAuditLogs') ? (
            <EmptyState icon="lock" title="Restricted" description="Only institute/branch admins can view the audit log." />
          ) : (
            <View style={styles.activityCard}>
              {loading && (
                [0, 1, 2].map(i => (
                  <View key={i} style={styles.activityRow}>
                    <View style={styles.activityLine}>
                      <Skeleton width={30} height={30} radius={15} />
                      {i !== 2 && <View style={styles.activityConnector} />}
                    </View>
                    <View style={styles.activityBody}>
                      <Skeleton width="60%" height={13} style={styles.skeletonGap} />
                      <Skeleton width="40%" height={11} />
                    </View>
                  </View>
                ))
              )}
              {activity.length === 0 && !loading && (
                <EmptyState icon="history" title="No activity yet" description="Actions like publishing exams or approving enrollments will show here." />
              )}
              {!loading && activity.map((log, index) => {
                const d = describeAuditLog(log);
                return (
                  <View key={log.id} style={styles.activityRow}>
                    <View style={styles.activityLine}>
                      <View style={[styles.activityIcon, { backgroundColor: `${d.tint}26` }]}>
                        <Icon name={d.icon} size={14} color={d.tint} />
                      </View>
                      {index !== activity.length - 1 && <View style={styles.activityConnector} />}
                    </View>
                    <View style={styles.activityBody}>
                      <Text style={styles.activityTitle}>{d.title}</Text>
                      <Text style={styles.activityMeta}>{timeAgo(log.created_at)} • {d.meta}</Text>
                    </View>
                  </View>
                );
              })}
            </View>
          )}
        </View>
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
    gap: spacing.xl,
    paddingBottom: spacing.xl,
  },
  instituteCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
    padding: spacing.md,
    ...shadow.sm,
  },
  instituteCardPressed: {
    transform: [{ scale: 0.98 }],
  },
  instituteTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  skeletonGap: {
    marginBottom: 6,
  },
  instituteIconWrap: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: `${colors.primary}1A`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instituteInfo: {
    flex: 1,
    gap: 2,
  },
  instituteName: {
    ...typography.bodyLg,
    fontWeight: '700',
    color: colors.onSurface,
  },
  instituteMeta: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
  },
  instituteIdBadge: {
    marginTop: spacing.md,
    backgroundColor: `${colors.primary}1A`,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  instituteIdLabel: {
    ...typography.labelMd,
    fontSize: 9,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.4,
  },
  instituteIdValue: {
    ...typography.headlineMd,
    fontSize: 20,
    fontWeight: '700',
    color: colors.primary,
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  sectionTitle: {
    ...typography.headlineMd,
    color: colors.onSurface,
    marginBottom: spacing.md,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
  },
  actionTile: {
    width: '47%',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
    padding: spacing.md,
    gap: spacing.sm,
    ...shadow.sm,
  },
  actionTilePressed: {
    transform: [{ scale: 0.97 }],
  },
  actionIconWrap: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionLabel: {
    ...typography.bodyMd,
    fontWeight: '600',
    color: colors.onSurface,
  },
  branchesRow: {
    flexDirection: 'row',
    gap: spacing.md,
    paddingRight: spacing.md,
  },
  branchCard: {
    width: 140,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
    padding: spacing.md,
    gap: spacing.sm,
    ...shadow.sm,
  },
  branchCardPressed: {
    transform: [{ scale: 0.97 }],
  },
  branchIconWrap: {
    width: 40,
    height: 40,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  branchName: {
    ...typography.bodyMd,
    fontWeight: '600',
    color: colors.onSurface,
  },
  branchStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  branchStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.success,
  },
  branchStatusDotInactive: {
    backgroundColor: colors.outline,
  },
  branchStatusText: {
    ...typography.labelMd,
    fontSize: 11,
    color: colors.onSurfaceVariant,
  },
  examsCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
    overflow: 'hidden',
    ...shadow.sm,
  },
  emptyPad: {
    padding: spacing.md,
  },
  examRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceVariant,
    gap: spacing.sm,
  },
  examRowLast: {
    borderBottomWidth: 0,
  },
  examLeft: {
    flexDirection: 'row',
    gap: spacing.md,
    flexShrink: 1,
  },
  dateBox: {
    width: 48,
    height: 48,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceContainerLow,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateMonth: {
    fontSize: 11,
    fontWeight: '700',
    color: colors.error,
  },
  dateDay: {
    ...typography.bodyLg,
    fontWeight: '600',
    color: colors.onSurface,
  },
  examInfo: {
    flexShrink: 1,
    gap: 2,
  },
  examTitle: {
    ...typography.bodyLg,
    fontWeight: '600',
    color: colors.onSurface,
  },
  examMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  examMetaText: {
    ...typography.bodyMd,
    fontSize: 12,
    color: colors.onSurfaceVariant,
  },
  activityCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
    padding: spacing.md,
    ...shadow.sm,
  },
  activityRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  activityLine: {
    alignItems: 'center',
    width: 30,
  },
  activityIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activityConnector: {
    flex: 1,
    width: 1,
    backgroundColor: colors.surfaceVariant,
    marginVertical: 4,
  },
  activityBody: {
    flex: 1,
    paddingBottom: spacing.md,
  },
  activityTitle: {
    ...typography.bodyMd,
    fontWeight: '600',
    color: colors.onSurface,
  },
  activityMeta: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
});
