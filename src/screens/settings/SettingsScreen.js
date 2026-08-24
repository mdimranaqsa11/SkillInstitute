import React, { useState } from 'react';
import { View, Text, ScrollView, Switch, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, radius } from '../../constants';
import DetailHeader from '../../components/navigation/DetailHeader';
import ListItem from '../../components/common/ListItem';
import Icon from '../../components/common/Icon';

export default function SettingsScreen({ navigation }) {
  const [pushEnabled, setPushEnabled] = useState(true);
  const [emailEnabled, setEmailEnabled] = useState(false);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <DetailHeader title="Settings" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionLabel}>Notifications</Text>
        <View style={styles.section}>
          <ListItem
            icon="notifications-active"
            label="Push Notifications"
            showChevron={false}
            right={
              <Switch
                value={pushEnabled}
                onValueChange={setPushEnabled}
                trackColor={{ true: colors.primary, false: colors.surfaceVariant }}
                thumbColor={colors.surfaceContainerLowest}
              />
            }
          />
          <ListItem
            icon="mail"
            label="Email Notifications"
            showChevron={false}
            right={
              <Switch
                value={emailEnabled}
                onValueChange={setEmailEnabled}
                trackColor={{ true: colors.primary, false: colors.surfaceVariant }}
                thumbColor={colors.surfaceContainerLowest}
              />
            }
          />
        </View>

        <Text style={styles.sectionLabel}>Account</Text>
        <View style={styles.section}>
          <ListItem icon="lock" label="Change Password" onPress={() => {}} />
          <ListItem icon="language" label="Language" sublabel="English" onPress={() => {}} />
        </View>

        <View style={styles.footer}>
          <Icon name="verified-user" size={16} color={colors.onSurfaceVariant} />
          <Text style={styles.footerText}>Skill Institute ERP v2.1.0</Text>
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
