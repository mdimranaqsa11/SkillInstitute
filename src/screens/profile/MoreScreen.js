import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, radius } from '../../constants';
import AppHeader from '../../components/navigation/AppHeader';
import Avatar from '../../components/common/Avatar';
import ListItem from '../../components/common/ListItem';
import { useAuth } from '../../context/AuthContext';
import { can } from '../../constants/roles';

export default function MoreScreen({ navigation }) {
  const { user, logout } = useAuth();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <AppHeader title="More" />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileCard}>
          <Avatar name={user?.full_name || user?.email} size={48} />
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{user?.full_name || user?.email}</Text>
            <Text style={styles.profileBranch}>{user?.role?.replace(/_/g, ' ')}</Text>
          </View>
        </View>

        <View style={styles.section}>
          {can(user, 'manageBranches') && (
            <ListItem icon="storefront" label="Branches" onPress={() => navigation.navigate('Branches')} />
          )}
          <ListItem icon="domain" label="Institute Profile" onPress={() => navigation.navigate('InstituteDetails')} />
          {can(user, 'viewAuditLogs') && (
            <ListItem icon="history" label="Audit Logs" onPress={() => navigation.navigate('AuditLogs')} />
          )}
          <ListItem icon="account-circle" label="Profile" onPress={() => navigation.navigate('Profile')} />
          <ListItem icon="settings" label="Settings" onPress={() => navigation.navigate('Settings')} />
        </View>

        <View style={styles.section}>
          <ListItem icon="logout" label="Logout" danger showChevron={false} onPress={logout} />
        </View>

        <Text style={styles.version}>v1.0.0</Text>
      </ScrollView>
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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
    padding: spacing.md,
  },
  profileInfo: { flex: 1 },
  profileName: {
    ...typography.bodyLg,
    fontWeight: '700',
    color: colors.onSurface,
  },
  profileBranch: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  section: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
    overflow: 'hidden',
  },
  version: {
    ...typography.labelMd,
    color: colors.outline,
    textAlign: 'center',
  },
});
