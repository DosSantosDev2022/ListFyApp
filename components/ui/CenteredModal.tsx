import type React from 'react';
import { useEffect } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Dimensions,
  TouchableOpacity, // Importar TouchableOpacity para o botão de fechar
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';


// Importar do react-native-reanimated
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring, // Efeito de mola/salto
  withTiming, // Animação com duração
  runOnJS, // Para executar funções JS na thread UI
} from 'react-native-reanimated';
import { H4 } from './Typography';

interface CenteredModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  modalWidth?: number | string;
  modalHeight?: number | string;
}

const { width: screenWidth } = Dimensions.get('window');

const CenteredModal = ({
  visible,
  onClose,
  title,
  children,
  modalWidth = '85%',
  modalHeight = 'auto',
}: CenteredModalProps) => {
  const scale = useSharedValue(0.7); // Valor inicial da escala (menor)
  const opacity = useSharedValue(0); // Valor inicial da opacidade (invisível)

  // Estilos animados para o conteúdo do modal
  const animatedModalStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  useEffect(() => {
    if (visible) {
      // Quando o modal se torna visível, anima para escala 1 (tamanho normal) e opacidade 1
      scale.value = withSpring(1, { damping: 15, stiffness: 100 }); // Efeito de mola
      opacity.value = withTiming(1, { duration: 200 }); // Fade-in mais suave
    } else {
      // Quando o modal é fechado, anima para escala 0.7 e opacidade 0 (para fora da tela)
      // O runOnJS é crucial para chamar `onClose` depois que a animação de saída termina
      scale.value = withTiming(0.7, { duration: 150 }, () => {
        runOnJS(onClose)(); // Chama onClose APENAS quando a animação de saída estiver completa
      });
      opacity.value = withTiming(0, { duration: 150 });
    }
  }, [visible, scale, opacity, onClose]); // Dependências do useEffect

  // O onClose no TouchableWithoutFeedback externo precisa ser modificado
  // para não fechar imediatamente, mas sim iniciar a animação de saída.
  const handleOverlayPress = () => {
    if (visible) { // Apenas inicie a animação de saída se o modal estiver visível
      scale.value = withTiming(0.7, { duration: 150 }, () => {
        runOnJS(onClose)();
      });
      opacity.value = withTiming(0, { duration: 150 });
    }
  };


  return (
    <Modal
      transparent={true}
      visible={visible}
      onRequestClose={handleOverlayPress} // Usa a nova função para fechar
    // animationType="fade" // Remova esta linha, o Reanimated vai gerenciar a animação
    >
      <TouchableWithoutFeedback onPress={handleOverlayPress}>
        <View style={styles.overlay} className="bg-black/50">
          <TouchableWithoutFeedback>
            {/* O Animated.View é o que receberá os estilos animados */}
            <Animated.View
              className="bg-secondary rounded-lg p-4 mx-4 border border-border"
              style={[
                styles.modalContent,
                { width: modalWidth as import('react-native').DimensionValue, height: modalHeight as import('react-native').DimensionValue },
                animatedModalStyle, // Aplica os estilos animados aqui
              ]}
            >
              <View className="flex-row items-center justify-between mb-4">
                {title && <H4 className="text-foreground">{title}</H4>}
                <TouchableOpacity onPress={handleOverlayPress} className="p-1">
                  <MaterialCommunityIcons name="close" size={24} color="gray" />
                </TouchableOpacity>
              </View>
              <View style={styles.modalBody}>{children}</View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    maxHeight: '90%',
    minWidth: screenWidth * 0.7,
  },
  modalBody: {
    flexGrow: 1,
  },
});

export { CenteredModal };