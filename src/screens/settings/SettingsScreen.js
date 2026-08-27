import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, radius } from '../../constants';
import DetailHeader from '../../components/navigation/DetailHeader';
import ListItem from '../../components/common/ListItem';
import Icon from '../../components/common/Icon';
import { useAuth } from '../../context/AuthContext';
import { can } from '../../constants/roles';

export default function SettingsScreen({ navigation }) {
  const { user } = useAuth();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <DetailHeader title="Settings" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionLabel}>Institute</Text>
        <View style={styles.section}>
          <ListItem
            icon="domain"
            label="Institute Profile"
            onPress={() => navigation.navigate('InstituteDetails')}
          />
        </View>

        {can(user, 'deleteInstitute') && (
          <>
            <Text style={styles.sectionLabel}>Danger Zone</Text>
            <View style={styles.section}>
              <ListItem
                icon="delete-forever"
                label="Delete Institute"
                danger
                onPress={() => navigation.navigate('DeleteInstitute')}
              />
            </View>
          </>
        )}

        <View style={styles.footer}>
          <Icon name="verified-user" size={16} color={colors.onSurfaceVariant} />
          <Text style={styles.footerText}>Skill Institute ERP v1.0.0</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: {
    padding: spacing.containerPadding,
    gap: spacing.sm,
  },
  sectionLabel: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    marginTop: spacing.md,
    marginBottom: spacing.xs,
  },
  section: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
    overflow: 'hidden',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: spacing.lg,
    opacity: 0.6,
  },
  footerText: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
  },
});
