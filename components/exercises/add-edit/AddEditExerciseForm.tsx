import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { Button } from '@/components/shared/Button';
import { Input } from '@/components/shared/Input';
import { LoadingState } from '@/components/shared/LoadingState';
import { COLORS } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';

import { DIFFICULTY_OPTIONS } from '../shared/constants/difficulties';
import { EXERCISE_TYPE_OPTIONS } from '../shared/constants/exerciseTypes';
import { MUSCLE_GROUP_OPTIONS } from '../shared/constants/muscleGroups';
import { ChipSelector } from './components/ChipSelector';
import { ImagePreview } from './components/ImagePreview';
import { ImageUrlModal } from './components/ImageUrlModal';
import { useExerciseForm } from './hooks/useExerciseForm';

type AddEditExerciseFormProps = {
  id?: string;
};

export function AddEditExerciseForm(props: AddEditExerciseFormProps) {
  const { id } = props;
  const { form, setField, loading, initialLoading, handleSubmit, handleCancel } = useExerciseForm({ id });

  const [urlModalVisible, setUrlModalVisible] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [urlError, setUrlError] = useState<string | null>(null);

  function handleOpenUrlModal() {
    setUrlInput('');
    setUrlError(null);
    setUrlModalVisible(true);
  }

  function handleChangeUrl(value: string) {
    setUrlInput(value);
    setUrlError(null);
  }

  function handleSaveUrl() {
    const trimmed = urlInput.trim();
    if (trimmed.length === 0) {
      setField('imageUri', null);
      setUrlModalVisible(false);
      return;
    }
    try {
      const parsed = new URL(trimmed);
      if (parsed.protocol !== 'https:') {
        setUrlError('URL повинен починатися з https://');
        return;
      }
    } catch {
      setUrlError('Невірний формат URL');
      return;
    }
    setField('imageUri', trimmed);
    setUrlModalVisible(false);
  }

  function handleCancelUrl() {
    setUrlModalVisible(false);
  }

  if (initialLoading) {
    return <LoadingState />;
  }

  return (
    <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps='handled'>
      <View style={styles.content}>
        <Text style={styles.label}>Фото</Text>
        {form.imageUri ? (
          <ImagePreview uri={form.imageUri} onRemove={() => setField('imageUri', null)} />
        ) : (
          <>
            <TouchableOpacity style={styles.imagePickerBtn} onPress={handleOpenUrlModal}>
              <Ionicons name='link-outline' size={20} color={COLORS.text.secondary} />
              <Text style={styles.imagePickerText}>URL</Text>
            </TouchableOpacity>
            <ImageUrlModal
              visible={urlModalVisible}
              url={urlInput}
              error={urlError}
              onChangeUrl={handleChangeUrl}
              onSave={handleSaveUrl}
              onCancel={handleCancelUrl}
            />
          </>
        )}

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
          autoCapitalize='none'
        />

        <Text style={styles.label}>{"Допоміжні м'язи"}</Text>
        <Input
          value={form.secondaryMuscles}
          onChangeText={(v) => setField('secondaryMuscles', v)}
          placeholder='через кому: трицепс, плечі'
          autoCapitalize='none'
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
  imagePickerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border.default,
    borderStyle: 'dashed',
    backgroundColor: COLORS.background.secondary,
    marginBottom: 8,
  },
  imagePickerText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.text.secondary,
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
