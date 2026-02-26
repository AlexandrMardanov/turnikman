import { ScrollView, StyleSheet, Text } from 'react-native';

import { useRouter } from 'expo-router';

import { ErrorState } from '@/components/shared/ErrorState';
import { HeaderIconButton } from '@/components/shared/HeaderIconButton';
import { LoadingState } from '@/components/shared/LoadingState';
import { COLORS } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';
import { useRefreshOnFocus } from '@/hooks/useRefreshOnFocus';
import { useScreenOptions } from '@/hooks/useScreenOptions';

import { ExerciseImage } from './components/ExerciseImage';
import { ExerciseInfo } from './components/ExerciseInfo';
import { ExerciseLogSection } from './components/ExerciseLogSection';
import { ExerciseTechnique } from './components/ExerciseTechnique';
import { useExerciseDetail } from './hooks/useExerciseDetail';

type ExerciseDetailScreenProps = {
  id: string;
};

export function ExerciseDetailScreen(props: ExerciseDetailScreenProps) {
  const { id } = props;
  const router = useRouter();
  const { exercise, loading, error, refresh } = useExerciseDetail(id);

  useRefreshOnFocus(refresh);

  useScreenOptions({
    title: exercise?.name ?? '',
    headerRight: exercise
      ? () => (
          <HeaderIconButton
            iconName='create-outline'
            onPress={() => router.push(`/(tabs)/(exercises)/add-edit?id=${id}`)}
          />
        )
      : undefined,
  });

  if (loading) {
    return <LoadingState />;
  }

  if (error || !exercise) {
    return <ErrorState message={error ?? 'Вправу не знайдено'} />;
  }

  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
      <ExerciseImage imageUrl={exercise.image_url} />
      <Text style={styles.name}>{exercise.name}</Text>
      <ExerciseInfo exercise={exercise} />
      {exercise.technique && <ExerciseTechnique technique={exercise.technique} />}
      <ExerciseLogSection />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    padding: 24,
  },
  name: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: COLORS.text.primary,
    marginBottom: 12,
  },
});
