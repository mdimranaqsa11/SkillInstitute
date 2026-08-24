import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, radius } from '../../constants';
import DetailHeader from '../../components/navigation/DetailHeader';
import Avatar from '../../components/common/Avatar';
import StatusBadge from '../../components/common/StatusBadge';

export default function ResultDetailsScreen({ route, navigation }) {
  const { result } = route.params;
  const passed = result.status === 'passed';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <DetailHeader title="Result Details" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Avatar name={result.studentName} size={56} />
            <View style={styles.headerInfo}>
              <Text style={styles.name}>{result.studentName}</Text>
              <Text style={styles.id}>ID: {result.studentId}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.rowLabel}>Course</Text>
            <Text style={styles.rowValue}>{result.courseName}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Grade</Text>
            <Text style={styles.gradeValue}>{result.grade}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Status</Text>
            <StatusBadge status={result.status} label={passed ? 'Passed' : 'Failed'} />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  content: {
    padding: spacing.containerPadding,
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
    alignItems: 'center',
    gap: spacing.md,
  },
  headerInfo: {
    flex: 1,
  },
  name: {
    ...typography.headlineMd,
    color: colors.onSurface,
  },
  id: {
    ...typography.labelMd,
    color: colors.onSurfaceVariant,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.surfaceVariant,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rowLabel: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
  rowValue: {
    ...typography.bodyMd,
    fontWeight: '600',
    color: colors.onSurface,
  },
  gradeValue: {
    ...typography.headlineMd,
    fontWeight: '700',
    color: colors.onSurface,
  },
});
