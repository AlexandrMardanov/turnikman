import { ActivityIndicator } from 'react-native';

import { ScreenContainer } from '@/components/shared/ScreenContainer';
import { COLORS } from '@/constants/colors';

export function LoadingState() {
  return (
    <ScreenContainer>
      <ActivityIndicator size='large' color={COLORS.accent.primary} />
    </ScreenContainer>
  );
}
