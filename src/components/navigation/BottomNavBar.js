import React from 'react';
import { View, Text, Pressable, StyleSheet, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, typography } from '../../constants';
import Icon from '../common/Icon';

const ICONS = {
  Dashboard: 'dashboard',
  Exams: 'quiz',
  Courses: 'menu-book',
  Results: 'assessment',
  More: 'more-horiz',
};

// Custom tab bar reproducing the Stitch "BottomNavBar" — active tab gets a
// pill-shaped tonal background and filled icon, matching the HTML reference.
export default function BottomNavBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.nav, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;
        const label = options.tabBarLabel ?? route.name;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <Pressable key={route.key} onPress={onPress} style={styles.item}>
            <View style={[styles.itemInner, isFocused && styles.itemInnerActive]}>
              <Icon
                name={ICONS[route.name] || 'circle'}
                size={22}
                color={isFocused ? colors.primary : colors.onSecondaryFixedVariant}
              />
              <Text style={[styles.label, isFocused && styles.labelActive]}>{label}</Text>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 8,
    paddingHorizontal: 4,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: { elevation: 8 },
    }),
  },
  item: {
    flex: 1,
    alignItems: 'center',
  },
  itemInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 12,
    minWidth: 56,
  },
  itemInnerActive: {
    backgroundColor: 'rgba(37,99,235,0.1)',
  },
  label: {
    ...typography.labelMd,
    fontSize: 11,
    color: colors.onSecondaryFixedVariant,
    marginTop: 4,
  },
  labelActive: {
    color: colors.primary,
    fontWeight: '600',
  },
});
