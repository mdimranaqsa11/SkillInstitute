import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, typography, spacing, radius } from '../../constants';
import DetailHeader from '../../components/navigation/DetailHeader';
import Icon from '../../components/common/Icon';
import PrimaryButton from '../../components/common/PrimaryButton';

export default function CourseDetailsScreen({ route, navigation }) {
  const { course } = route.params;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <DetailHeader title="Course Details" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.card}>
          <View style={[styles.iconWrap, { backgroundColor: `${course.tint}33` }]}>
            <Icon name={course.icon} size={28} color={course.tint} />
          </View>
          <Text style={[styles.code, { color: course.tint }]}>{course.code}</Text>
          <Text style={styles.title}>{course.title}</Text>

          <View style={styles.metaRow}>
            <Icon name="group" size={18} color={colors.onSurfaceVariant} />
            <Text style={styles.metaText}>{course.students} Students enrolled</Text>
          </View>
        </View>

        <PrimaryButton title="View Enrolled Students" icon="arrow-forward" onPress={() => {}} />
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
    gap: spacing.sm,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },
  code: {
    ...typography.labelMd,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  title: {
    ...typography.headlineLg,
    fontSize: 22,
    color: colors.onSurface,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: spacing.sm,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.surfaceVariant,
  },
  metaText: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
  },
});
