import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { COLORS } from '@/constants/colors';
import { useTabBar } from '@/contexts/TabBarContext';
import { useWeightReminderContext } from '@/contexts/WeightReminderContext';

export default function TabsLayout() {
  const { isTabBarHidden } = useTabBar();
  const { shouldShowBadge } = useWeightReminderContext();

  return (
    <NativeTabs tintColor={COLORS.accent.primary} hidden={isTabBarHidden}>
      <NativeTabs.Trigger name='(dashboard)'>
        <NativeTabs.Trigger.Label>Дашборд</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf='square.grid.2x2.fill' />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name='(weight)'>
        <NativeTabs.Trigger.Label>Вага</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf='figure.stand' md='accessibility' />
        {shouldShowBadge && <NativeTabs.Trigger.Badge>!</NativeTabs.Trigger.Badge>}
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name='(exercises)'>
        <NativeTabs.Trigger.Label>Вправи</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf='figure.strengthtraining.functional' md='fitness_center' />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
