import { StyleSheet, Text, View } from 'react-native';

import DateTimePicker from '@react-native-community/datetimepicker';

import { Button } from '@/components/shared/Button';
import { FormContainer } from '@/components/shared/FormContainer';
import { Input } from '@/components/shared/Input';
import { LoadingState } from '@/components/shared/LoadingState';
import { COLORS } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';

import { useWeightForm } from './hooks/useWeightForm';

type AddEditWeightFormProps = {
  id?: string;
};

export function AddEditWeightForm(props: AddEditWeightFormProps) {
  const { id } = props;
  const { weight, setWeight, date, setDate, loading, initialLoading, handleSubmit, handleCancel } = useWeightForm({
    id,
  });

  if (initialLoading) {
    return <LoadingState />;
  }

  return (
    <FormContainer centered={false}>
      <Text style={styles.label}>Вага (кг)</Text>
      <Input
        value={weight}
        onChangeText={setWeight}
        placeholder='Введіть вагу'
        keyboardType='decimal-pad'
        autoFocus={!id}
      />
      <Text style={styles.label}>Дата</Text>
      <View style={styles.datePickerContainer}>
        <DateTimePicker
          value={date}
          mode='date'
          display='inline'
          onChange={(_, selectedDate) => {
            if (selectedDate) {
              setDate(selectedDate);
            }
          }}
          maximumDate={new Date()}
        />
      </View>
      <View style={styles.buttonRow}>
        <Button title='Зберегти' onPress={handleSubmit} loading={loading} variant='primary' style={styles.saveButton} />
        <Button
          title='Скасувати'
          onPress={handleCancel}
          variant='danger'
          style={styles.cancelButton}
          disabled={loading}
        />
      </View>
    </FormContainer>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontFamily: FONTS.semiBold,
    color: COLORS.text.primary,
    marginBottom: 8,
  },
  datePickerContainer: {
    backgroundColor: COLORS.background.primary,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border.default,
    marginBottom: 16,
    overflow: 'hidden',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  saveButton: {
    flex: 1,
  },
  cancelButton: {
    flex: 1,
  },
});
