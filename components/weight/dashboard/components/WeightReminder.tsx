import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { COLORS } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';

export function WeightReminder() {
  const router = useRouter();

  function handleAddWeight() {
    router.push('/(tabs)/(weight)/add-edit');
  }

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name='alert-circle' size={24} color={COLORS.accent.danger} />
      </View>
      <View style={styles.content}>
        <Text style={styles.title}>Час оновити дані</Text>
        <Text style={styles.message}>Минуло більше 7 днів з останнього запису</Text>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleAddWeight} activeOpacity={0.7}>
        <Ionicons name='add' size={20} color={COLORS.text.inverse} />
        <Text style={styles.buttonText}>Додати</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: `${COLORS.accent.danger}15`,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: `${COLORS.accent.danger}30`,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${COLORS.accent.danger}20`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    gap: 2,
  },
  title: {
    fontSize: 15,
    fontFamily: FONTS.semiBold,
    color: COLORS.text.primary,
  },
  message: {
    fontSize: 13,
    fontFamily: FONTS.regular,
    color: COLORS.text.secondary,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.accent.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 14,
    fontFamily: FONTS.semiBold,
    color: COLORS.text.inverse,
  },
});
