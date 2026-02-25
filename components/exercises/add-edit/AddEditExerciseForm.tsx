import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { LoadingState } from '@/components/shared/LoadingState';
import { COLORS } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';

import { DIFFICULTY_OPTIONS } from '../shared/constants/difficulties';
import { EXERCISE_TYPE_OPTIONS } from '../shared/constants/exerciseTypes';
import { MUSCLE_GROUP_OPTIONS } from '../shared/constants/muscleGroups';
import { ChipSelector } from './components/ChipSelector';
import { ExerciseImagePicker } from './components/ExerciseImagePicker';
import { useExerciseForm } from './hooks/useExerciseForm';

type AddEditExerciseFormProps = {
  id?: string;
};

export function AddEditExerciseForm(props: AddEditExerciseFormProps) {
  const { id } = props;
  const { form, setField, loading, initialLoading, handleSubmit, handleCancel } = useExerciseForm({ id });

  if (initialLoading) {
    return <LoadingState />;
  }

  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>
      <View style={styles.content}>
        <Text style={styles.label}>Фото</Text>
        <ExerciseImagePicker imageUri={form.imageUri} onImageChange={(v) => setField('imageUri', v)} />

        <Text style={styles.label}>Назва *</Text>
        <Input value={form.name} onChangeText={(v) => setField('name', v)} placeholder='Назва вправи' autoFocus={!id} />

        <Text style={styles.label}>Тип *</Text>
        <ChipSelector options={EXERCISE_TYPE_OPTIONS} value={form.type} onChange={(v) => setField('type', v)} />

        <Text style={styles.label}>{"Група м'язів *"}</Text>
        <ChipSelector
          options={MUSCLE_GROUP_OPTIONS}
          value={form.muscleGroup}
          onChange={(v) => setField('muscleGroup', v)}
        />

        <Text style={styles.label}>Складність *</Text>
        <ChipSelector
          options={DIFFICULTY_OPTIONS}
          value={form.difficulty}
          onChange={(v) => setField('difficulty', v)}
        />

        <Text style={styles.label}>Опис</Text>
        <Input
          value={form.description}
          onChangeText={(v) => setField('description', v)}
          placeholder='Техніка виконання...'
          multiline
          style={styles.textArea}
        />

        <Text style={styles.label}>{"Основні м'язи"}</Text>
        <Input
          value={form.primaryMuscles}
          onChangeText={(v) => setField('primaryMuscles', v)}
          placeholder='через кому: біцепс, груди'
        />

        <Text style={styles.label}>{"Допоміжні м'язи"}</Text>
        <Input
          value={form.secondaryMuscles}
          onChangeText={(v) => setField('secondaryMuscles', v)}
          placeholder='через кому: трицепс, плечі'
        />

        <Text style={styles.label}>Техніка виконання</Text>
        <Input
          value={form.technique}
          onChangeText={(v) => setField('technique', v)}
          placeholder='Техніка виконання та поширені помилки...'
          multiline
          style={styles.textArea}
        />

        <Text style={styles.label}>{form.type === 'time' ? 'Макс. секунд (ціль)' : 'Макс. повторень (ціль)'}</Text>
        <Input
          value={form.goalValue}
          onChangeText={(v) => setField('goalValue', v)}
          placeholder={"необов'язково"}
          keyboardType='number-pad'
        />

        <View style={styles.buttonRow}>
          <Button title='Зберегти' onPress={handleSubmit} loading={loading} style={styles.saveBtn} />
          <Button
            title='Скасувати'
            onPress={handleCancel}
            variant='danger'
            disabled={loading}
            style={styles.cancelBtn}
          />
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  label: {
    fontSize: 15,
    fontFamily: FONTS.semiBold,
    color: COLORS.text.primary,
    marginBottom: 8,
    marginTop: 8,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  saveBtn: {
    flex: 1,
  },
  cancelBtn: {
    flex: 1,
  },
});
