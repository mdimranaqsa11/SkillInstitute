import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, StyleSheet, ActivityIndicator, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, radius, spacing, typography } from '../../constants';
import { can } from '../../constants/roles';
import DetailHeader from '../../components/navigation/DetailHeader';
import Icon from '../../components/common/Icon';
import PrimaryButton from '../../components/common/PrimaryButton';
import EmptyState from '../../components/feedback/EmptyState';
import { useAuth } from '../../context/AuthContext';
import { getMyInstitute, getInstituteProfile } from '../../api/institute';

export default function InstituteDetailsScreen({ navigation }) {
  const { user } = useAuth();
  const canEdit = can(user, 'editInstituteProfile');
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
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <DetailHeader title="Institute Profile" onBack={() => navigation.goBack()} />
        <ActivityIndicator color={colors.primary} style={styles.loader} />
      </SafeAreaView>
    );
  }

  if (!institute) {
    return (
      <SafeAreaView style={styles.safe} edges={['top']}>
        <DetailHeader title="Institute Profile" onBack={() => navigation.goBack()} />
        <EmptyState icon="domain" title="Couldn't load institute" description="Please try again." style={styles.emptyState} />
      </SafeAreaView>
    );
  }

  const address = [
    institute.address_line1,
    institute.address_line2,
    institute.city,
    institute.state,
    institute.country,
    institute.postal_code,
  ]
    .filter(Boolean)
    .join(', ');

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <DetailHeader title="Institute Profile" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <View style={styles.iconWrap}>
              <Icon name="domain" size={26} color={colors.primary} />
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.name}>{institute.legal_name || institute.name}</Text>
              <Text style={styles.code}>{institute.code}</Text>
            </View>
          </View>

          {!!institute.description && (
            <>
              <View style={styles.divider} />
              <Text style={styles.description}>{institute.description}</Text>
            </>
          )}

          <View style={styles.divider} />

          {!!institute.registration_number && (
            <View style={styles.infoRow}>
              <Icon name="badge" size={20} color={colors.outline} />
              <Text style={styles.infoText}>Reg. No. {institute.registration_number}</Text>
            </View>
          )}
          {!!institute.established_year && (
            <View style={styles.infoRow}>
              <Icon name="event" size={20} color={colors.outline} />
              <Text style={styles.infoText}>Established {institute.established_year}</Text>
            </View>
          )}
          {!!address && (
            <View style={styles.infoRow}>
              <Icon name="location-on" size={20} color={colors.outline} />
              <Text style={styles.infoText}>{address}</Text>
            </View>
          )}
          {!!institute.email && (
            <View style={styles.infoRow}>
              <Icon name="mail" size={20} color={colors.outline} />
              <Text style={styles.infoText}>{institute.email}</Text>
            </View>
          )}
          {!!institute.phone && (
            <View style={styles.infoRow}>
              <Icon name="call" size={20} color={colors.outline} />
              <Text style={styles.infoText}>{institute.phone}</Text>
            </View>
          )}
          {!!institute.website && (
            <Pressable style={styles.infoRow} onPress={() => Linking.openURL(institute.website).catch(() => {})}>
              <Icon name="public" size={20} color={colors.outline} />
              <Text style={[styles.infoText, styles.link]}>{institute.website}</Text>
            </Pressable>
          )}
        </View>

        {canEdit && (
          <PrimaryButton
            title="Edit Profile"
            icon="edit"
            iconPosition="left"
            onPress={() => navigation.navigate('InstituteProfile')}
          />
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
  loader: {
    marginTop: spacing.xl,
  },
  emptyState: {
    marginTop: spacing.xl,
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
    backgroundColor: `${colors.primary}1A`,
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
  code: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  description: {
    ...typography.bodyMd,
    color: colors.onSurface,
  },
  divider: {
    height: 1,
    backgroundColor: colors.surfaceVariant,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  infoText: {
    ...typography.bodyMd,
    color: colors.onSurface,
    flexShrink: 1,
  },
  link: {
    color: colors.primary,
  },
});
