import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { colors, radius, dimensions } from '../../constants';
import Icon from './Icon';

export default function Fab({ icon = 'add', onPress, style }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.fab, pressed && styles.pressed, style]}
    >
      <Icon name={icon} size={24} color={colors.onPrimary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    right: 20,
    width: dimensions.fabSize,
    height: dimensions.fabSize,
    borderRadius: radius.lg,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  pressed: {
    transform: [{ scale: 0.95 }],
  },
});
