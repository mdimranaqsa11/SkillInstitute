import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, radius } from '../../constants';
import DetailHeader from '../../components/navigation/DetailHeader';
import Avatar from '../../components/common/Avatar';
import ListItem from '../../components/common/ListItem';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen({ navigation }) {
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <DetailHeader title="Profile" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerCard}>
          <Avatar name={user?.full_name || user?.email} size={72} />
          <Text style={styles.name}>{user?.full_name || user?.email}</Text>
          <Text style={styles.role}>{user?.role?.replace(/_/g, ' ')}</Text>
        </View>

        <View style={styles.section}>
          <ListItem icon="mail" label="Email" sublabel={user?.email} showChevron={false} />
          <ListItem icon="badge" label="Role" sublabel={user?.role?.replace(/_/g, ' ')} showChevron={false} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: {
    padding: spacing.containerPadding,
    gap: spacing.lg,
  },
  headerCard: {
    alignItems: 'center',
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
    padding: spacing.lg,
    gap: spacing.xs,
  },
  name: {
    ...typography.headlineMd,
    color: colors.onSurface,
    marginTop: spacing.sm,
  },
  role: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
  section: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
    overflow: 'hidden',
  },
});
