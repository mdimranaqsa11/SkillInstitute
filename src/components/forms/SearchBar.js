import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';
import { colors, radius, typography } from '../../constants';
import Icon from '../common/Icon';

export default function SearchBar({ value, onChangeText, placeholder = 'Search...', style }) {
  return (
    <View style={[styles.wrap, style]}>
      <Icon name="search" size={20} color={colors.outline} style={styles.icon} />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.outline}
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderWidth: 1,
    borderColor: colors.surfaceVariant,
    borderRadius: radius.md,
    backgroundColor: colors.surfaceContainerLowest,
    paddingHorizontal: 12,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    ...typography.bodyMd,
    fontSize: 15,
    color: colors.onSurface,
    padding: 0,
    height: '100%',
  },
});
