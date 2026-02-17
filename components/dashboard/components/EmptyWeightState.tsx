import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { COLORS } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';

export function EmptyWeightState() {
  const router = useRouter();

  function handleAddWeight() {
    router.push('/(tabs)/(weight)/add-edit');
  }

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name='scale-outline' size={48} color={COLORS.text.secondary} />
      </View>
      <Text style={styles.title}>Почни відстежувати свою вагу</Text>
      <Text style={styles.message}>Додай першу вагу, щоб бачити прогрес та статистику</Text>
      <TouchableOpacity style={styles.button} onPress={handleAddWeight} activeOpacity={0.7}>
        <Ionicons name='add' size={20} color={COLORS.text.inverse} />
        <Text style={styles.buttonText}>Додати вагу</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background.primary,
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border.default,
    alignItems: 'center',
    gap: 12,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.background.secondary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontFamily: FONTS.semiBold,
    color: COLORS.text.primary,
    textAlign: 'center',
  },
  message: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.text.secondary,
    textAlign: 'center',
    marginBottom: 8,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.accent.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: FONTS.semiBold,
    color: COLORS.text.inverse,
  },
});
