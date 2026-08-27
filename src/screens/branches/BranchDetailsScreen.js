import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, radius } from '../../constants';
import { can } from '../../constants/roles';
import DetailHeader from '../../components/navigation/DetailHeader';
import Icon from '../../components/common/Icon';
import PrimaryButton from '../../components/common/PrimaryButton';
import SecondaryButton from '../../components/common/SecondaryButton';
import { useAuth } from '../../context/AuthContext';
import { useAlert } from '../../context/AlertContext';
import { deleteBranch } from '../../api/branches';
import { ApiError } from '../../api/client';

const TINTS = [colors.primary, colors.secondary, colors.tertiary];
const ICONS = ['business', 'corporate-fare', 'domain'];

export default function BranchDetailsScreen({ route, navigation }) {
  const { branch } = route.params;
  const { user } = useAuth();
  const { showAlert } = useAlert();
  const canManage = can(user, 'manageBranches');
  const [deleting, setDeleting] = useState(false);
  const tint = TINTS[branch.id % TINTS.length];
  const icon = ICONS[branch.id % ICONS.length];
  const isActive = branch.status === 'ACTIVE';

  const handleDeactivate = () => {
    showAlert('Deactivate branch?', `${branch.name} will be marked inactive. This can be reversed by an admin later.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Deactivate',
        style: 'destructive',
        onPress: async () => {
          setDeleting(true);
          try {
            await deleteBranch(branch.id);
            navigation.goBack();
          } catch (e) {
            showAlert('Failed', e instanceof ApiError ? e.message : 'Could not deactivate branch');
          } finally {
            setDeleting(false);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <DetailHeader title="Branch Details" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <View style={[styles.iconWrap, { backgroundColor: `${tint}1A` }]}>
              <Icon name={icon} size={26} color={tint} />
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.name}>{branch.name}</Text>
              <View style={styles.statusRow}>
                <View style={[styles.statusDot, !isActive && styles.statusDotInactive]} />
                <Text style={styles.statusText}>{isActive ? 'Active' : 'Inactive'}</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.contactRow}>
            <Icon name="tag" size={20} color={colors.outline} />
            <Text style={styles.contactText}>{branch.code}</Text>
          </View>
          {!!branch.email && (
            <View style={styles.contactRow}>
              <Icon name="mail" size={20} color={colors.outline} />
              <Text style={styles.contactText}>{branch.email}</Text>
            </View>
          )}
          {!!branch.phone && (
            <View style={styles.contactRow}>
              <Icon name="call" size={20} color={colors.outline} />
              <Text style={styles.contactText}>{branch.phone}</Text>
            </View>
          )}
        </View>

        {canManage && (
          <View style={styles.actions}>
            <PrimaryButton
              title="Edit Branch"
              icon="edit"
              iconPosition="left"
              onPress={() => navigation.navigate('BranchForm', { branch })}
            />
            {isActive && (
              <SecondaryButton title="Deactivate Branch" onPress={handleDeactivate} disabled={deleting} />
            )}
          </View>
        )}
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
  card: {
    backgroundColor: colors.surfaceContainerLowest,
    borderRadius: radius.xl,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
    padding: spacing.lg,
    gap: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    ...typography.headlineMd,
    color: colors.onSurface,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.primary,
  },
  statusDotInactive: {
    backgroundColor: colors.error,
  },
  statusText: {
    ...typography.labelMd,
    color: colors.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.surfaceVariant,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  contactText: {
    ...typography.bodyMd,
    color: colors.onSurface,
    flexShrink: 1,
  },
  actions: {
    gap: spacing.md,
  },
});
