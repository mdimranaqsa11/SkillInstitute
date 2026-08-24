import React from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, radius } from '../../constants';
import AppHeader from '../../components/navigation/AppHeader';
import StatCard from '../../components/cards/StatCard';
import SectionHeader from '../../components/common/SectionHeader';
import Icon from '../../components/common/Icon';
import {
  currentUser,
  dashboardStats,
  quickActions,
  upcomingExamsPreview,
  recentActivity,
} from '../../data/mockData';

export default function DashboardScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AppHeader
        subtitle="Good morning,"
        title={currentUser.name}
        avatarUri={currentUser.avatarUri}
        avatarName={currentUser.name}
        branchLabel={currentUser.branch}
        onNotificationsPress={() => navigation.getParent()?.navigate('More', { screen: 'Notifications' })}
      />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.statsGrid}>
          {dashboardStats.map(stat => (
            <StatCard key={stat.id} icon={stat.icon} label={stat.label} value={stat.value} tint={stat.tint} />
          ))}
        </View>

        <View>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickActionsRow}
          >
            {quickActions.map(action => (
              <Pressable
                key={action.id}
                style={[styles.quickAction, action.primary && styles.quickActionPrimary]}
              >
                <Icon
                  name={action.icon}
                  size={18}
                  color={action.primary ? colors.onPrimary : colors.secondary}
                />
                <Text style={[styles.quickActionLabel, action.primary && styles.quickActionLabelPrimary]}>
                  {action.label}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View>
          <SectionHeader
            title="Upcoming Exams"
            actionLabel="View All"
            onActionPress={() => navigation.getParent()?.navigate('Exams')}
          />
          <View style={styles.examsCard}>
            {upcomingExamsPreview.map((exam, index) => (
              <Pressable
                key={exam.id}
                style={[styles.examRow, index === upcomingExamsPreview.length - 1 && styles.examRowLast]}
              >
                <View style={styles.examLeft}>
                  <View style={styles.dateBox}>
                    <Text style={styles.dateMonth}>{exam.month}</Text>
                    <Text style={styles.dateDay}>{exam.day}</Text>
                  </View>
                  <View style={styles.examInfo}>
                    <Text style={styles.examTitle}>{exam.title}</Text>
                    <View style={styles.examMetaRow}>
                      <Icon name="schedule" size={14} color={colors.onSurfaceVariant} />
                      <Text style={styles.examMetaText}>{exam.time}</Text>
                    </View>
                    <View style={styles.examMetaRow}>
                      <Icon name="location-on" size={14} color={colors.onSurfaceVariant} />
                      <Text style={styles.examMetaText}>{exam.location}</Text>
                    </View>
                  </View>
                </View>
                <Icon name="chevron-right" size={20} color={colors.outline} />
              </Pressable>
            ))}
          </View>
        </View>

        <View>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            {recentActivity.map((activity, index) => (
              <View key={activity.id} style={styles.activityRow}>
                <View style={styles.activityLine}>
                  <View style={[styles.activityIcon, { backgroundColor: activity.tintBg }]}>
                    <Icon name={activity.icon} size={14} color={activity.tint} />
                  </View>
                  {index !== recentActivity.length - 1 && <View style={styles.activityConnector} />}
                </View>
                <View style={styles.activityBody}>
                  <Text style={styles.activityTitle}>{activity.title}</Text>
                  <Text style={styles.activityMeta}>{activity.meta}</Text>
                </View>
              </View>
            ))}
          </View>
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
  quickActionsRow: {
    gap: spacing.sm,
    paddingRight: spacing.md,
  },
  quickAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    height: 48,
    paddingHorizontal: 20,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
  },
  quickActionPrimary: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  quickActionLabel: {
    ...typography.labelMd,
    color: colors.onSurface,
  },
  quickActionLabelPrimary: {
    color: colors.onPrimary,
  },
  examsCard: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: 'rgba(195,198,215,0.2)',
    overflow: 'hidden',
  },
  examRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(195,198,215,0.2)',
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
    borderColor: 'rgba(195,198,215,0.3)',
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
    borderColor: 'rgba(195,198,215,0.2)',
    padding: spacing.md,
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
    backgroundColor: 'rgba(195,198,215,0.3)',
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
