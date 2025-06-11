// src/components/ShoppingListItem.tsx
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Link, useRouter } from "expo-router";
import { Button,BottomSheetModal, Input } from "@/components/ui";
import type { ShoppingList } from "@/types";
import { Entypo, MaterialIcons } from "@expo/vector-icons";

interface ShoppingListItemProps {
  item: ShoppingList;
  onRemove: (listId: string) => void;
	 onRename: (listId: string, newName: string) => void;
}

const ShoppingListItem = ({
  item,
  onRemove,
	onRename
}: ShoppingListItemProps) => {
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false); // Estado para controlar a visibilidade
	const [isRenameModalVisible, setIsRenameModalVisible] = useState(false);
	const [newListName, setNewListName] = useState(item.name);

  const handleOpenModal = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false); // Função para fechar o modal

	const handleOpenRenameModal = () => {
    handleCloseModal(); // Fecha o modal principal antes de abrir o de renomear
    setNewListName(item.name); // Pré-popula o input com o nome atual
    setIsRenameModalVisible(true);
  };
  const handleCloseRenameModal = () => setIsRenameModalVisible(false);

  const handleViewDetails = () => {
    handleCloseModal(); // Fecha o modal
    router.push({ pathname: "/detailsLists/[id]", params: { id: item.id } });
  };

  const handleDeleteList = () => {
    handleCloseModal(); // Fecha o modal
    onRemove(item.id); // Chama a função onRemove
  };

	 const handleSaveRename = () => {
    if (newListName.trim() !== "" && newListName !== item.name) {
      onRename(item.id, newListName.trim()); // Chama a prop onRename
    }
    handleCloseRenameModal(); // Fecha o modal de renomear
  };


  return (
    <View className="p-4 mb-3 bg-secondary rounded-2xl border border-border flex-row justify-between items-start">
       <View className="flex-1">
          <Text className="text-lg font-bold text-foreground">
            {item.name}
          </Text>
          <Text className="text-sm text-muted-foreground">
            Criada em:{" "}
            {new Date(item.dateCreation).toLocaleDateString()}
          </Text>
          <Text className="text-sm text-muted-foreground">
            Total da compra: R${" "}
            {item.TotalExpectedValue?.toFixed(2) || "0.00"}
          </Text>
          <Text className="text-sm text-muted-foreground capitalize">
            Status: {item.status}
          </Text>
        </View>

      <Button
        className="rounded-full"
        size={"icon"}
        variant={"link"}
        onPress={handleOpenModal} // Abre o modal
      >
        <Entypo color={'hsl(226.2 5% 55%)'} name="dots-three-vertical" size={24} />
      </Button>

      {/* Usando o componente CustomBottomSheetModal para as opções */}
      <BottomSheetModal
        visible={isModalVisible}
        onClose={handleCloseModal} // Passa a função de fechamento
        title="Gerenciar lista" // Título específico para esta tela
        // modalHeight={280} // Opcional: defina uma altura fixa se quiser
      >
        {/* Conteúdo específico para este modal */}
        <View className="gap-y-4 p-2 w-full">
					<Button variant={'outline'} className="flex-row items-center justify-start gap-3" onPress={handleOpenRenameModal}>
						<MaterialIcons name="mode-edit" size={24} color="white" />
            <Text className="text-primary-foreground font-bold">Renomear</Text>
          </Button>
          <Button variant={'outline'} className="flex-row items-center justify-start gap-3" onPress={handleViewDetails}>
						<MaterialIcons name="view-headline" size={24} color="white" />
            <Text className="text-primary-foreground font-bold">Ver Detalhes</Text>
          </Button>
          <Button variant={'outline'}  className="flex-row items-center justify-start gap-3" onPress={handleDeleteList}>
						<MaterialIcons name="delete" size={24} color="white" />
            <Text className="text-destructive-foreground font-bold">Excluir Lista</Text>
          </Button>
          <Button variant={'outline'} className="flex-row items-center justify-start gap-3" onPress={handleCloseModal}>
						<MaterialIcons name="close" size={24} color="white" />
            <Text className="text-foreground">Cancelar</Text>
          </Button>
        </View>
      </BottomSheetModal>

			{/* Modal para renomar nome da lista */}
			<BottomSheetModal
        visible={isRenameModalVisible}
        onClose={handleCloseRenameModal}
        title="Renomear Lista"
      >
        <View className="p-4 w-full items-center">
          {/* Campo de input para o novo nome */}
          <Input
            placeholder="Novo nome da lista"
            value={newListName}
            onChangeText={setNewListName}
            autoFocus // Foca automaticamente no input ao abrir
          />

          {/* Botões de Salvar e Cancelar */}
          <View className="flex-row gap-x-3 mt-2">
            <Button className="flex-1" onPress={handleSaveRename}>
              <Text className="text-primary-foreground font-bold">Salvar</Text>
            </Button>
            <Button className="flex-1" variant="outline" onPress={handleCloseRenameModal}>
              <Text className="text-foreground">Cancelar</Text>
            </Button>
          </View>
        </View>
      </BottomSheetModal>
    </View>
  );
};

export { ShoppingListItem };