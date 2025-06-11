// src/components/CustomBottomSheetModal.tsx
import React, { useEffect, useRef } from "react";
import { View, Text, Modal, TouchableOpacity, Animated, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const screenHeight = Dimensions.get('window').height; // Pega a altura da tela

interface CustomBottomSheetModalProps {
  visible: boolean; // Controla se o modal está visível
  onClose: () => void; // Função para fechar o modal
  title?: string; // Título opcional para o modal
  children: React.ReactNode; // Conteúdo a ser renderizado dentro do modal
  modalHeight?: number; // Altura fixa opcional do modal (se não definido, adapta ao conteúdo)
}

const BottomSheetModal = ({
  visible,
  onClose,
  title,
  children,
  modalHeight, // Recebe a altura opcional
}: CustomBottomSheetModalProps) => {
  const slideAnim = useRef(new Animated.Value(screenHeight)).current; // Inicia fora da tela
  const insets = useSafeAreaInsets(); // Obtém os insets da área segura (notches, etc.)

  useEffect(() => {
    if (visible) {
      // Quando o modal se torna visível, anima para o topo da tela
      Animated.timing(slideAnim, {
        toValue: 0, // 0 significa que a parte superior do conteúdo do modal está alinhada à parte inferior da tela (ou onde for determinado pelo flexbox)
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Quando o modal não está visível, anima para fora da tela (para baixo)
      Animated.timing(slideAnim, {
        toValue: screenHeight, // Move para fora da tela
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible, slideAnim, screenHeight]);

  return (
    <Modal
      animationType="none" // Desativa a animação padrão do Modal
      transparent={true} // Torna o fundo do modal transparente
      visible={visible}
      onRequestClose={onClose} // Para o botão de "voltar" do Android
    >
      {/* Backdrop (fundo escuro) */}
      <TouchableOpacity
        className="flex-1 bg-black/70 justify-end" // Estiliza o fundo escuro e alinha o conteúdo no final
        activeOpacity={1} // Desabilita o feedback visual no toque
        onPress={onClose} // Fecha o modal ao clicar no backdrop
      >
        {/* Conteúdo animado do modal */}
        <Animated.View
          className="p-4 bg-background rounded-t-2xl" // Estilos para o conteúdo do modal
          style={[
            { transform: [{ translateY: slideAnim }] },
            // Adiciona padding na parte inferior para lidar com a área segura (notch, barra de navegação)
            { paddingBottom: insets.bottom > 0 ? insets.bottom : 16 }, // Garante um padding mínimo
            modalHeight ? { height: modalHeight } : {}, // Aplica altura fixa se fornecida
          ]}
          // Impede que o toque no conteúdo do modal feche o modal (passando para o backdrop)
          onStartShouldSetResponder={() => true}
        >
          {/* Handle visual (a barrinha de arrastar) */}
          <View className="items-center mb-4">
            <View className="w-16 h-1.5 bg-gray-400 rounded-full"></View>
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
      </TouchableOpacity>
    </Modal>
  );
};

export {BottomSheetModal}