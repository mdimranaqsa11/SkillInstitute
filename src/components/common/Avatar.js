import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { colors } from '../../constants';

const PALETTE = [
  { bg: colors.secondaryContainer, text: colors.onSecondaryContainer },
  { bg: colors.tertiaryFixed, text: colors.onTertiaryFixedVariant },
  { bg: colors.errorContainer, text: colors.onErrorContainer },
  { bg: colors.primaryFixed, text: colors.onPrimaryFixedVariant },
];

function initialsFrom(name = '') {
  return name
    .trim()
    .split(/\s+/)
    .map(part => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function Avatar({ name, uri, size = 40, index = 0, style }) {
  const dimensionStyle = { width: size, height: size, borderRadius: size / 2 };

  if (uri) {
    return <Image source={{ uri }} style={[styles.image, dimensionStyle, style]} />;
  }

  const palette = PALETTE[index % PALETTE.length];
  return (
    <View style={[styles.fallback, dimensionStyle, { backgroundColor: palette.bg }, style]}>
      <Text style={[styles.initials, { color: palette.text, fontSize: size * 0.38 }]}>
        {initialsFrom(name)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: colors.surfaceContainerHigh,
  },
  fallback: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontWeight: '700',
  },
});
