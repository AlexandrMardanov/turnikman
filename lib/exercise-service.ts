import { supabase } from './supabase';

export type MuscleGroup = 'back' | 'chest' | 'legs' | 'abs' | 'shoulders' | 'arms';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type ExerciseType = 'weight' | 'time' | 'emom';

export type Exercise = {
  id: string;
  user_id: string;
  name: string;
  type: ExerciseType;
  description: string | null;
  image_url: string | null;
  muscle_group: MuscleGroup;
  difficulty: Difficulty;
  primary_muscles: string[];
  secondary_muscles: string[];
  technique: string | null;
  goal_value: number | null;
  created_at: string;
};

export type ExerciseLog = {
  id: string;
  user_id: string;
  exercise_id: string;
  date: string;
  sets?: number;
  reps?: number;
  weight_kg?: number;
  duration_sec?: number;
  rounds_completed?: number;
  notes: string | null;
  created_at: string;
};

export type ExerciseFilters = {
  muscleGroup: MuscleGroup | null;
  difficulty: Difficulty | null;
  type: ExerciseType | null;
};

export type ExerciseCreate = Omit<Exercise, 'id' | 'user_id' | 'created_at'>;
export type ExerciseUpdate = Partial<Omit<Exercise, 'id' | 'created_at'>>;

export async function getExercises(filters?: ExerciseFilters): Promise<Exercise[]> {
  let query = supabase.from('exercises').select('*').order('created_at', { ascending: false });

  if (filters?.muscleGroup) {
    query = query.eq('muscle_group', filters.muscleGroup);
  }

  if (filters?.difficulty) {
    query = query.eq('difficulty', filters.difficulty);
  }

  if (filters?.type) {
    query = query.eq('type', filters.type);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error('Помилка завантаження вправ');
  }

  return data || [];
}

export async function getExercise(id: string): Promise<Exercise> {
  const { data, error } = await supabase.from('exercises').select('*').eq('id', id).single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new Error('Вправу не знайдено');
    }
    throw new Error('Помилка завантаження вправи');
  }

  return data;
}

export async function addExercise(data: ExerciseCreate): Promise<Exercise> {
  const { data: session } = await supabase.auth.getSession();
  const userId = session.session?.user.id;

  if (!userId) {
    throw new Error('Користувач не авторизований');
  }

  const { data: newExercise, error } = await supabase
    .from('exercises')
    .insert([{ ...data, user_id: userId }])
    .select()
    .single();

  if (error) {
    throw new Error('Помилка додавання вправи');
  }

  return newExercise;
}

export async function updateExercise(id: string, data: ExerciseUpdate): Promise<Exercise> {
  const { data: updated, error } = await supabase.from('exercises').update(data).eq('id', id).select().single();

  if (error) {
    if (error.code === 'PGRST116') {
      throw new Error('Вправу не знайдено');
    }
    throw new Error('Помилка оновлення вправи');
  }

  return updated;
}

export async function deleteExercise(id: string): Promise<void> {
  const { data, error } = await supabase.from('exercises').delete().eq('id', id).select('id');

  if (error) {
    throw new Error('Помилка видалення вправи');
  }

  if (!data || data.length === 0) {
    throw new Error('Вправу не знайдено');
  }
}

export async function getExerciseLogs(exerciseId: string): Promise<ExerciseLog[]> {
  const { data, error } = await supabase
    .from('exercise_logs')
    .select('*')
    .eq('exercise_id', exerciseId)
    .order('date', { ascending: false });

  if (error) {
    throw new Error('Помилка завантаження записів');
  }

  return data || [];
}
