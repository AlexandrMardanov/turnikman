import { StyleSheet, Text } from 'react-native';

import { ScreenContainer } from '@/components/shared/ScreenContainer';
import { COLORS } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';

type ErrorStateProps = {
  message: string;
};

export function ErrorState(props: ErrorStateProps) {
  const { message } = props;

  return (
    <ScreenContainer>
      <Text style={styles.errorText}>{message}</Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  errorText: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.accent.danger,
    textAlign: 'center',
  },
});
