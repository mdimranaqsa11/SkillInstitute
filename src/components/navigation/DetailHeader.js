import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { colors, typography, spacing, dimensions } from '../../constants';
import Icon from '../common/Icon';

export default function DetailHeader({ title, onBack, right }) {
  return (
    <View style={styles.header}>
      <Pressable onPress={onBack} style={styles.iconButton} hitSlop={8}>
        <Icon name="arrow-back" size={22} color={colors.onSurfaceVariant} />
      </Pressable>
      <Text style={styles.title} numberOfLines={1}>{title}</Text>
      <View style={styles.iconButton}>{right}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: dimensions.topBarHeight,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceVariant,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.headlineMd,
    fontSize: 17,
    color: colors.onSurface,
    flex: 1,
    textAlign: 'center',
  },
});
