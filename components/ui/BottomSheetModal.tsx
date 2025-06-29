// src/components/CustomBottomSheetModal.tsx
import type React from "react";
import { useEffect } from "react"; // Remova useRef, Animated, Dimensions
import { View, Text, Modal, Pressable, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Importar do react-native-reanimated
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

// Podemos manter screenHeight como uma constante, mas com Reanimated, não precisamos dela diretamente no useSharedValue
// como 'toValue' ou 'fromValue' fixos que o Animated.Value usava.
// Em vez disso, usaremos 'withTiming' para animar para um valor calculado ou para 0.
const screenHeight = Dimensions.get('window').height; // Apenas para referência ou cálculo de altura de modal

interface CustomBottomSheetModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  modalHeight?: number;
}

const BottomSheetModal = ({
  visible,
  onClose,
  title,
  children,
  modalHeight,
}: CustomBottomSheetModalProps) => {
  // Use useSharedValue para a tradução Y
  const translateY = useSharedValue(screenHeight); // Começa abaixo da tela
  const backdropOpacity = useSharedValue(0); // Para animar o fade do backdrop
  const insets = useSafeAreaInsets();

  // Estilos animados para o conteúdo do modal
  const animatedModalStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      // Não adicione opacidade aqui se você já a controla no backdrop
    };
  });

  // Estilos animados para o backdrop
  const animatedBackdropStyle = useAnimatedStyle(() => {
    return {
      opacity: backdropOpacity.value,
    };
  });

  useEffect(() => {
    if (visible) {
      // Quando visível, anima para 0 (posição original, acima)
      translateY.value = withTiming(0, { duration: 300 });
      backdropOpacity.value = withTiming(0.5, { duration: 300 }); // Fade-in para 50% de opacidade
    } else {
      // Quando invisível, anima para a altura da tela (abaixo)
      // Chama onClose SOMENTE DEPOIS que a animação de saída termina
      translateY.value = withTiming(screenHeight, { duration: 300 }, () => {
        runOnJS(onClose)(); // Garante que o modal seja removido do DOM APÓS a animação
      });
      backdropOpacity.value = withTiming(0, { duration: 300 }); // Fade-out do backdrop
    }
  }, [visible, translateY, backdropOpacity, onClose]);

  // Função para lidar com o fechamento do modal, incluindo a animação de saída
  const handleClose = () => {
    translateY.value = withTiming(screenHeight, { duration: 300 }, () => {
      runOnJS(onClose)();
    });
    backdropOpacity.value = withTiming(0, { duration: 300 });
  };

  return (
    <Modal
      animationType="none" // Reanimated cuidará da animação
      transparent={true}
      visible={visible}
      onRequestClose={handleClose} // Usa a nova função de handleClose
    >
      <View className="flex-1">
        {/* Backdrop (fundo escuro) */}
        <Pressable
          className="absolute inset-0 bg-black/70" // Comece com bg-black, a opacidade será animada
          onPress={handleClose} // Usa a nova função de handleClose
        >
          <Animated.View style={[{ flex: 1 }, animatedBackdropStyle]} /> {/* Aplica a opacidade animada aqui */}
        </Pressable>

        {/* Conteúdo animado do modal - Posicionado no final */}
        <Animated.View
          className="p-4 bg-background rounded-t-2xl absolute bottom-0 w-full"
          style={[
            animatedModalStyle, // Aplica o estilo de transformação animado
            { paddingBottom: insets.bottom > 0 ? insets.bottom : 16 },
            modalHeight ? { height: modalHeight } : {},
          ]}
        >
          {/* Handle visual */}
          <View className="items-center mb-4">
            <View className="w-16 h-1.5 bg-gray-400 rounded-full" />
          </View>

          {/* Título do modal (se fornecido) */}
          {title && (
            <Text className="text-foreground text-2xl font-bold mb-4 ml-3 text-start">
              {title}
            </Text>
          )}

          {/* Conteúdo dinâmico (children) */}
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};

export { BottomSheetModal };