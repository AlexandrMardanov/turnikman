import { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import BottomSheet, { BottomSheetBackdrop, BottomSheetScrollView } from '@gorhom/bottom-sheet';
import type { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';

import { DIFFICULTY_OPTIONS } from '@/components/exercises/shared/constants/difficulties';
import { EXERCISE_TYPE_OPTIONS } from '@/components/exercises/shared/constants/exerciseTypes';
import { MUSCLE_GROUP_OPTIONS } from '@/components/exercises/shared/constants/muscleGroups';
import { COLORS } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';
import { useTabBarVisibility } from '@/hooks/useTabBarVisibility';
import type { Difficulty, ExerciseType, MuscleGroup } from '@/lib/exercise-service';

import { DifficultyBars } from '../../shared/components/DifficultyBars';

type FilterBottomSheetProps = {
  muscleGroup: MuscleGroup | null;
  difficulty: Difficulty | null;
  type: ExerciseType | null;
  onToggleMuscleGroup: (value: MuscleGroup) => void;
  onToggleDifficulty: (value: Difficulty) => void;
  onToggleType: (value: ExerciseType) => void;
  onClose: () => void;
  onClearAll: () => void;
  isOpen: boolean;
};

const SNAP_POINTS = ['55%'];

export function FilterBottomSheet(props: FilterBottomSheetProps) {
  const {
    muscleGroup,
    difficulty,
    type,
    onToggleMuscleGroup,
    onToggleDifficulty,
    onToggleType,
    onClose,
    onClearAll,
    isOpen,
  } = props;

  const hasActiveFilters = muscleGroup !== null || difficulty !== null || type !== null;
  const sheetRef = useRef<BottomSheet>(null);
  useTabBarVisibility(!isOpen);

  useEffect(() => {
    if (isOpen) {
      sheetRef.current?.expand();
    } else {
      sheetRef.current?.close();
    }
  }, [isOpen]);

  const handleSheetChange = useCallback(
    (index: number) => {
      if (index === -1) {
        onClose();
      }
    },
    [onClose]
  );

  const renderBackdrop = useCallback(
    (backdropProps: BottomSheetDefaultBackdropProps) => (
      <BottomSheetBackdrop {...backdropProps} disappearsOnIndex={-1} appearsOnIndex={0} pressBehavior='close' />
    ),
    []
  );

  return (
    <BottomSheet
      ref={sheetRef}
      index={-1}
      snapPoints={SNAP_POINTS}
      enablePanDownToClose
      onChange={handleSheetChange}
      backdropComponent={renderBackdrop}
      backgroundStyle={styles.background}
      handleIndicatorStyle={styles.handle}
    >
      <BottomSheetScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Фільтри</Text>
          {hasActiveFilters && (
            <TouchableOpacity onPress={onClearAll} style={styles.clearButton}>
              <Text style={styles.clearButtonText}>Очистити</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>{"Група м'язів"}</Text>
          <View style={styles.chipRow}>
            {MUSCLE_GROUP_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.chip, muscleGroup === opt.value && styles.chipActive]}
                onPress={() => onToggleMuscleGroup(opt.value)}
              >
                <Text style={[styles.chipText, muscleGroup === opt.value && styles.chipTextActive]}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Складність</Text>
          <View style={styles.chipRow}>
            {DIFFICULTY_OPTIONS.map((opt) => {
              const isActive = difficulty === opt.value;

              return (
                <TouchableOpacity
                  key={opt.value}
                  style={[styles.chip, isActive && styles.chipActive]}
                  onPress={() => onToggleDifficulty(opt.value)}
                >
                  <View style={styles.difficultyChipContent}>
                    <DifficultyBars difficulty={opt.value} isActive={isActive} />
                    <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{opt.label}</Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Тип вправи</Text>
          <View style={styles.chipRow}>
            {EXERCISE_TYPE_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={[styles.chip, type === opt.value && styles.chipActive]}
                onPress={() => onToggleType(opt.value)}
              >
                <Text style={[styles.chipText, type === opt.value && styles.chipTextActive]}>{opt.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  background: {
    backgroundColor: COLORS.background.primary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  handle: {
    backgroundColor: COLORS.border.default,
    width: 40,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  title: {
    fontSize: 18,
    fontFamily: FONTS.semiBold,
    color: COLORS.text.primary,
    marginBottom: 20,
    marginTop: 8,
  },
  section: {
    marginBottom: 20,
  },
  sectionLabel: {
    fontSize: 13,
    fontFamily: FONTS.medium,
    color: COLORS.text.secondary,
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border.default,
    backgroundColor: COLORS.background.primary,
  },
  chipActive: {
    backgroundColor: COLORS.accent.primary,
    borderColor: COLORS.accent.primary,
  },
  chipText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.text.secondary,
  },
  chipTextActive: {
    color: COLORS.text.inverse,
  },
  difficultyChipContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  clearButton: {
    paddingVertical: 4,
    paddingHorizontal: 2,
  },
  clearButtonText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.accent.primary,
  },
});
