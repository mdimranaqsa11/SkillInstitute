import React from 'react';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { colors } from '../../constants';

// Stitch uses Google "Material Symbols Outlined" — the closest native equivalent
// available for React Native is Google's Material Icons font (same glyph names),
// shipped via react-native-vector-icons. Iconify itself is a web/CSS icon
// framework with no native React Native renderer, so this is the practical
// on-device substitute that preserves the exact icon set from the design.
export default function Icon({
  name,
  size = 20,
  color = colors.onSurface,
  style,
}) {
  return <MaterialIcons name={name} size={size} color={color} style={style} />;
}
