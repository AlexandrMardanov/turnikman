import { useEffect, useState } from 'react';
import { Alert } from 'react-native';

import { useRouter } from 'expo-router';

import type { Difficulty, ExerciseCreate, ExerciseType, MuscleGroup } from '@/lib/exercise-service';
import { addExercise, getExercise, updateExercise } from '@/lib/exercise-service';

import { validateExerciseInput } from '../utils/validateExerciseInput';

type UseExerciseFormProps = {
  id?: string;
};

export type FormState = {
  name: string;
  type: ExerciseType;
  muscleGroup: MuscleGroup;
  difficulty: Difficulty;
  description: string;
  primaryMuscles: string;
  secondaryMuscles: string;
  technique: string;
  goalValue: string;
  imageUri: string | null;
};

const INITIAL_FORM: FormState = {
  name: '',
  type: 'weight',
  muscleGroup: 'back',
  difficulty: 'medium',
  description: '',
  primaryMuscles: '',
  secondaryMuscles: '',
  technique: '',
  goalValue: '',
  imageUri: null,
};

export function useExerciseForm(props: UseExerciseFormProps) {
  const { id } = props;
  const router = useRouter();

  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(!!id);

  useEffect(() => {
    if (!id) return;

    async function loadExercise() {
      try {
        setInitialLoading(true);
        const ex = await getExercise(id!);
        setForm({
          name: ex.name,
          type: ex.type,
          muscleGroup: ex.muscle_group,
          difficulty: ex.difficulty,
          description: ex.description ?? '',
          primaryMuscles: ex.primary_muscles.join(', '),
          secondaryMuscles: ex.secondary_muscles.join(', '),
          technique: ex.technique ?? '',
          goalValue: ex.goal_value?.toString() ?? '',
          imageUri: ex.image_url,
        });
      } catch (err) {
        Alert.alert('Помилка', (err as Error).message);
      } finally {
        setInitialLoading(false);
      }
    }

    loadExercise();
  }, [id]);

  function setField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleSubmit() {
    const {
      name,
      type,
      muscleGroup,
      difficulty,
      description,
      primaryMuscles,
      secondaryMuscles,
      technique,
      goalValue,
      imageUri,
    } = form;
    const validation = validateExerciseInput(name, type, muscleGroup, difficulty);

    if (!validation.isValid) {
      Alert.alert('Помилка', validation.error);
      return;
    }

    setLoading(true);

    const data: ExerciseCreate = {
      name: name.trim(),
      type,
      muscle_group: muscleGroup,
      difficulty,
      description: description.trim() || null,
      image_url: imageUri,
      primary_muscles: primaryMuscles
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      secondary_muscles: secondaryMuscles
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      technique: technique.trim() || null,
      goal_value: goalValue && !Number.isNaN(parseInt(goalValue, 10)) ? parseInt(goalValue, 10) : null,
    };

    const savePromise = id ? updateExercise(id, data) : addExercise(data);

    savePromise
      .then(() => {
        router.back();
      })
      .catch((err) => {
        Alert.alert('Помилка', (err as Error).message);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  function handleCancel() {
    router.back();
  }

  return { form, setField, loading, initialLoading, handleSubmit, handleCancel };
}
