import { ReactNode } from 'react';
import { Modal, Pressable, StyleSheet, Text } from 'react-native';

import { BlurView } from 'expo-blur';

import { COLORS } from '@/constants/colors';
import { FONTS } from '@/constants/fonts';

type ModalShellProps = {
  visible: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
};

export function ModalShell(props: ModalShellProps) {
  const { visible, title, onClose, children } = props;

  return (
    <Modal visible={visible} transparent animationType='fade' onRequestClose={onClose}>
      <BlurView intensity={20} tint='light' style={styles.overlay}>
        <Pressable style={styles.backdrop} onPress={onClose}>
          <Pressable style={styles.card} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.title}>{title}</Text>
            {children}
          </Pressable>
        </Pressable>
      </BlurView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
  },
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: COLORS.background.overlay,
  },
  card: {
    backgroundColor: COLORS.background.primary,
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  title: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: COLORS.text.primary,
    marginBottom: 20,
    textAlign: 'center',
  },
});
