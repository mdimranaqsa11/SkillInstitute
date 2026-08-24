import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, radius } from '../../constants';
import DetailHeader from '../../components/navigation/DetailHeader';
import Icon from '../../components/common/Icon';
import EmptyState from '../../components/feedback/EmptyState';
import { notifications } from '../../data/mockData';

export default function NotificationsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <DetailHeader title="Notifications" onBack={() => navigation.goBack()} />
      <FlatList
        data={notifications}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.content}
        ListEmptyComponent={
          <EmptyState icon="notifications" title="You're all caught up" description="No notifications yet." />
        }
        renderItem={({ item }) => (
          <View style={styles.row}>
            <View style={[styles.iconWrap, item.unread && styles.iconWrapUnread]}>
              <Icon name={item.icon} size={18} color={item.unread ? colors.primary : colors.onSurfaceVariant} />
            </View>
            <View style={styles.body}>
              <Text style={[styles.title, item.unread && styles.titleUnread]}>{item.title}</Text>
              <Text style={styles.meta}>{item.meta}</Text>
            </View>
            {item.unread && <View style={styles.dot} />}
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: {
    padding: spacing.containerPadding,
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
    padding: spacing.md,
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surfaceContainerLow,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapUnread: {
    backgroundColor: 'rgba(37,99,235,0.12)',
  },
  body: {
    flex: 1,
  },
  title: {
    ...typography.bodyMd,
    color: colors.onSurface,
  },
  titleUnread: {
    fontWeight: '700',
  },
  meta: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.error,
  },
});
