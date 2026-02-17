import { StyleSheet, Text, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { COLORS } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';

type WeightTrendProps = {
  change: number;
  changePercent: number;
};

export function WeightTrend(props: WeightTrendProps) {
  const { change, changePercent } = props;

  const isIncreasing = change > 0;
  const isNeutral = change === 0;

  const trendText = isNeutral ? 'Стабільно' : isIncreasing ? 'Зростає' : 'Знижується';
  const trendColor = isNeutral ? COLORS.text.secondary : isIncreasing ? COLORS.accent.primary : COLORS.accent.success;
  const arrowIcon = isNeutral ? 'remove' : isIncreasing ? 'trending-up' : 'trending-down';

  return (
    <View style={styles.container}>
      <View style={[styles.iconContainer, { backgroundColor: `${trendColor}20` }]}>
        <Ionicons name={arrowIcon} size={32} color={trendColor} />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.trendText, { color: trendColor }]}>{trendText}</Text>
        <Text style={styles.changeText}>
          {isIncreasing ? '+' : ''}
          {change.toFixed(1)} кг ({isIncreasing ? '+' : ''}
          {changePercent.toFixed(1)}%) за місяць
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: 12,
    backgroundColor: COLORS.background.secondary,
    borderRadius: 8,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  trendText: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    marginBottom: 4,
  },
  changeText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.text.secondary,
  },
});
