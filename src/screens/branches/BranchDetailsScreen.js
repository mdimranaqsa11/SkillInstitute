import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, radius } from '../../constants';
import DetailHeader from '../../components/navigation/DetailHeader';
import Icon from '../../components/common/Icon';
import PrimaryButton from '../../components/common/PrimaryButton';

export default function BranchDetailsScreen({ route, navigation }) {
  const { branch } = route.params;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <DetailHeader title="Branch Details" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <View style={[styles.iconWrap, { backgroundColor: `${branch.tint}1A` }]}>
              <Icon name={branch.icon} size={26} color={branch.tint} />
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.name}>{branch.name}</Text>
              <View style={styles.statusRow}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Active</Text>
              </View>
            </View>
          </View>

          <View style={styles.metaGrid}>
            <View style={styles.metaCell}>
              <Text style={styles.metaLabel}>Students</Text>
              <Text style={styles.metaValue}>{branch.students}</Text>
            </View>
            <View style={styles.metaCell}>
              <Text style={styles.metaLabel}>Administrator</Text>
              <Text style={styles.metaValue}>{branch.admin}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.contactRow}>
            <Icon name="location-on" size={20} color={colors.outline} />
            <Text style={styles.contactText}>{branch.address}</Text>
          </View>
          <View style={styles.contactRow}>
            <Icon name="call" size={20} color={colors.outline} />
            <Text style={styles.contactText}>{branch.phone}</Text>
          </View>
        </View>

        <PrimaryButton title="Edit Branch" icon="edit" iconPosition="left" onPress={() => {}} />
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
  statusText: {
    ...typography.labelMd,
    color: colors.secondary,
  },
  metaGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  metaCell: {
    flex: 1,
  },
  metaLabel: {
    ...typography.labelMd,
    color: colors.outline,
    marginBottom: 4,
  },
  metaValue: {
    ...typography.bodyLg,
    fontWeight: '600',
    color: colors.onSurface,
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
});
