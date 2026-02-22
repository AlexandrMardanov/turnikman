import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';

type FilterButtonProps = {
  onPress: () => void;
  activeCount: number;
};

export function FilterButton(props: FilterButtonProps) {
  const { onPress, activeCount } = props;

  return (
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Ionicons
        name='options-outline'
        size={24}
        color={activeCount > 0 ? COLORS.accent.primary : COLORS.text.primary}
      />
      {activeCount > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{activeCount}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    marginRight: 8,
    marginLeft: 8,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 4,
    backgroundColor: COLORS.accent.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: COLORS.text.inverse,
    fontSize: 10,
    fontFamily: FONTS.medium,
  },
});
