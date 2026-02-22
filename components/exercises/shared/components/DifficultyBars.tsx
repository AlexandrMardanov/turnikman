import { StyleSheet, View } from 'react-native';

import { COLORS } from '@/constants/colors';
import type { Difficulty } from '@/lib/exercise-service';

import { getDifficultyColor } from '../utils/getDifficultyColor';
import { getDifficultyDots } from '../utils/getDifficultyDots';

type DifficultyBarsProps = {
  difficulty: Difficulty;
  isActive?: boolean;
};

export function DifficultyBars(props: DifficultyBarsProps) {
  const { difficulty, isActive = false } = props;
  const filled = getDifficultyDots(difficulty);
  const color = getDifficultyColor(difficulty);

  return (
    <View style={styles.row}>
      {[1, 2, 3].map((bar) => (
        <View
          key={bar}
          style={[
            styles.bar,
            {
              backgroundColor:
                bar <= filled
                  ? isActive
                    ? COLORS.text.inverse
                    : color
                  : isActive
                    ? 'rgba(255,255,255,0.3)'
                    : COLORS.border.default,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    gap: 2,
    alignItems: 'center',
  },
  bar: {
    width: 10,
    height: 4,
    borderRadius: 2,
  },
});
