// src/components/SideSheetModal.tsx
import type React from "react";
import { useEffect, useRef } from "react";
import { View, Text, Modal, TouchableOpacity, Animated, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { twMerge } from "tailwind-merge"; // Importe twMerge se você ainda não o fez

const screenWidth = Dimensions.get('window').width; // Pega a largura da tela

interface SideSheetModalProps {
  visible: boolean; // Controla se o modal está visível
  onClose: () => void; // Função para fechar o modal
  title?: string; // Título opcional para o modal
  children: React.ReactNode; // Conteúdo a ser renderizado dentro do modal
  modalWidth?: number; // Largura fixa opcional do modal (se não definido, usará um padrão ou um percentual)
  // Opcional: Prop para determinar se o modal abre da esquerda ou direita
  // Por agora, vamos fazer da esquerda para a direita por padrão.
  // slideFrom?: 'left' | 'right'; // Adicione se quiser flexibilidade futura
}

const SideSheetModal = ({
  visible,
  onClose,
  title,
  children,
  modalWidth, // Recebe a largura opcional
  // slideFrom = 'left', // Padrão 'left'
}: SideSheetModalProps) => {
  // Inicia fora da tela, à esquerda (negativo)
  const slideAnim = useRef(new Animated.Value(-screenWidth)).current;
  const insets = useSafeAreaInsets(); // Obtém os insets da área segura

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (visible) {
      // Quando o modal se torna visível, anima para a posição 0 (dentro da tela)
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Quando o modal não está visível, anima para fora da tela (para a esquerda)
      Animated.timing(slideAnim, {
        toValue: -screenWidth,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
    // Para animações da direita, o toValue seria `screenWidth` quando fechando e `0` quando abrindo
    // e o `justify-end` no backdrop seria importante para alinhamento.
  }, [visible, slideAnim, screenWidth]); // Dependências da animação

  return (
    <Modal
      animationType="none" // Desativa a animação padrão do Modal
      transparent={true} // Torna o fundo do modal transparente
      visible={visible}
      onRequestClose={onClose} // Para o botão de "voltar" do Android
    >
      {/* Backdrop (fundo escuro) */}
      <TouchableOpacity
        className="flex-1 bg-black/70 justify-start items-start" // Alinha o conteúdo à esquerda
        activeOpacity={1} // Desabilita o feedback visual no toque
        onPress={onClose} // Fecha o modal ao clicar no backdrop
      >
        {/* Conteúdo animado do modal */}
        <Animated.View
          className={twMerge(`
            h-full
            bg-background
            rounded-r-2xl
            p-4
          `)}
          style={[
            { transform: [{ translateX: slideAnim }] }, // Use translateX para movimento horizontal
            // Adiciona padding seguro na parte superior e lateral para lidar com notches
            { paddingTop: insets.top > 0 ? insets.top : 16 },
            { paddingBottom: insets.bottom > 0 ? insets.bottom : 16 },
            { paddingLeft: insets.left > 0 ? insets.left : 16 }, // Padding para o lado esquerdo
            // Define a largura do modal. Por padrão, pode ser um percentual ou um valor fixo.
            modalWidth ? { width: modalWidth } : { width: screenWidth * 0.8 }, // Ex: 80% da largura da tela
          ]}
          // Impede que o toque no conteúdo do modal feche o modal (passando para o backdrop)
          onStartShouldSetResponder={() => true}
        >
          {/* Título do modal (se fornecido) */}
          {title && (
            <Text className="text-foreground text-2xl font-bold mb-4 text-start">
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

export { SideSheetModal };