import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, radius } from '../../constants';
import DetailHeader from '../../components/navigation/DetailHeader';
import Icon from '../../components/common/Icon';

// The institute-backend API has no notifications endpoint at all (no /notifications
// route, no push/webhook system) — this is intentionally not a mocked list.
export default function NotificationsScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <DetailHeader title="Notifications" onBack={() => navigation.goBack()} />
      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.iconWrap}>
            <Icon name="notifications-off" size={28} color={colors.unavailable} />
            <View style={styles.crossBadge}>
              <Icon name="close" size={14} color={colors.onError} />
            </View>
          </View>
          <Text style={styles.title}>Not available via API</Text>
          <Text style={styles.description}>
            The institute-backend has no notifications endpoint — there's nothing to fetch or display here yet.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: {
    flex: 1,
    padding: spacing.containerPadding,
    justifyContent: 'center',
  },
  card: {
    alignItems: 'center',
    gap: spacing.sm,
    padding: spacing.xl,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.unavailableBorder,
    backgroundColor: colors.unavailableBg,
  },
  iconWrap: {
    marginBottom: spacing.sm,
  },
  crossBadge: {
    position: 'absolute',
    right: -6,
    top: -6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: colors.error,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.headlineMd,
    fontSize: 16,
    color: colors.unavailable,
  },
  description: {
    ...typography.bodyMd,
    color: colors.unavailable,
    textAlign: 'center',
  },
});
