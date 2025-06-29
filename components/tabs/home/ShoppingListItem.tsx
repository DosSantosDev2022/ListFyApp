import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Link, useRouter } from "expo-router";
import { Button, BottomSheetModal, Input } from "@/components/ui";
import type { ShoppingList } from "@/types";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import { useToast } from "@/components/ui/toast";
// Importe o CenteredModal
import { CenteredModal } from "@/components/ui/CenteredModal"; // Ajuste o caminho se necessário

interface ShoppingListItemProps {
  item: ShoppingList;
  onRemove: (listId: string) => void;
  onRename: (listId: string, newName: string) => void;
  archieList: (listId: string) => void
}

const ShoppingListItem = ({
  item,
  onRemove,
  onRename,
  archieList
}: ShoppingListItemProps) => {
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false); // Estado para controlar a visibilidade do BottomSheetModal principal
  const [isRenameModalVisible, setIsRenameModalVisible] = useState(false); // Estado para o modal de renomear
  // NOVO ESTADO: Para o modal de confirmação de exclusão
  const [isConfirmDeleteModalVisible, setIsConfirmDeleteModalVisible] = useState(false);

  const [newListName, setNewListName] = useState(item.name);
  const toast = useToast();

  const handleOpenModal = () => setIsModalVisible(true);
  const handleCloseModal = () => setIsModalVisible(false); // Função para fechar o modal principal

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

  // Funções para controlar o novo modal de confirmação
  const handleOpenConfirmDeleteModal = () => {
    handleCloseModal(); // Fecha o modal de opções antes de abrir o de confirmação
    setIsConfirmDeleteModalVisible(true);
  };
  const handleCloseConfirmDeleteModal = () => {
    setIsConfirmDeleteModalVisible(false);
  };

  // Função para deletar a lista (agora chamada após confirmação)
  const handleConfirmDeleteList = () => {
    onRemove(item.id); // Chama a função onRemove (prop recebida)
    toast.showToast('Lista excluída com sucesso!', 'success');
    handleCloseConfirmDeleteModal(); // Fecha o modal de confirmação
  };

  // função para renomear lista
  const handleSaveRename = () => {
    if (newListName.trim() !== "" && newListName !== item.name) {
      onRename(item.id, newListName.trim()); // Chama a prop onRename
      toast.showToast('Lista editada com sucesso!', 'success');
    }
    handleCloseRenameModal(); // Fecha o modal de renomear
  };

  // função para arquivar lista
  const handleArchiveList = () => {
    archieList(item.id);
    toast.showToast('Lista arquivada com sucesso!', 'success');
    handleCloseModal(); // Fecha o modal ao arquivar
  }

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
        {item.TotalExpectedValue !== undefined && item.TotalExpectedValue !== null && (
          <Text className="text-sm text-muted-foreground">
            Total da compra: R${" "}
            {item.TotalExpectedValue.toFixed(2) || "0.00"}
          </Text>
        )}
        <View className={'flex-row gap-2 text-sm capitalize'} >
          <Text className="text-muted-foreground">Status:</Text>
          <Text className={`font-bold ${item.status === 'Pendente' ? 'text-destructive ' : 'text-warning'} `}>
            {item.status}
          </Text>
        </View>
        {item.marketName ? (
          <Text className="text-sm text-muted-foreground">
            Mercado: {item.marketName}
          </Text>
        ) : (
          <Text className="text-sm text-muted-foreground italic">
            Mercado: Não vinculado
          </Text>
        )}
      </View>

      <Button
        className="rounded-full"
        size={"icon"}
        variant={"link"}
        onPress={handleOpenModal} // Abre o modal de opções
      >
        <Entypo color={'hsl(226.2 5% 55%)'} name="dots-three-vertical" size={24} />
      </Button>

      {/* BottomSheetModal com opções de ação */}
      <BottomSheetModal
        visible={isModalVisible}
        onClose={handleCloseModal}
        title="Gerenciar lista"
      >
        <View className="gap-y-4 p-2 w-full">
          <Button variant={'outline'} className="flex-row items-center justify-start gap-3" onPress={handleOpenRenameModal}>
            <MaterialIcons name="mode-edit" size={24} color="white" />
            <Text className="text-primary-foreground font-bold">Renomear</Text>
          </Button>
          <Button variant={'outline'} className="flex-row items-center justify-start gap-3" onPress={handleViewDetails}>
            <MaterialIcons name="view-headline" size={24} color="white" />
            <Text className="text-primary-foreground font-bold">Ver Detalhes</Text>
          </Button>
          <Button variant={'outline'} className="flex-row items-center justify-start gap-3" onPress={handleArchiveList}>
            <Entypo name="folder" size={24} color="white" />
            <Text className="text-destructive-foreground font-bold">Arquivar Lista</Text>
          </Button>
          {/* Agora este botão abre o CenteredModal de confirmação */}
          <Button variant={'outline'} className="flex-row items-center justify-start gap-3" onPress={handleOpenConfirmDeleteModal}>
            <MaterialIcons name="delete" size={24} color="white" />
            <Text className="text-destructive-foreground font-bold">Excluir Lista</Text>
          </Button>
          <Button variant={'outline'} className="flex-row items-center justify-start gap-3" onPress={handleCloseModal}>
            <MaterialIcons name="close" size={24} color="white" />
            <Text className="text-foreground">Cancelar</Text>
          </Button>
        </View>
      </BottomSheetModal>

      {/* BottomSheetModal para renomear nome da lista */}
      <BottomSheetModal
        visible={isRenameModalVisible}
        onClose={handleCloseRenameModal}
        title="Renomear Lista"
      >
        <View className="p-4 w-full items-center">
          <Input
            placeholder="Novo nome da lista"
            value={newListName}
            onChangeText={setNewListName}
            autoFocus
          />
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

      {/* NOVO CenteredModal para Confirmação de Exclusão */}
      <CenteredModal
        visible={isConfirmDeleteModalVisible}
        onClose={handleCloseConfirmDeleteModal}
        title="Confirmar Exclusão"
      >
        <View className="p-4 items-center">
          <Text className="text-foreground text-lg text-center mb-6">
            Tem certeza que deseja remover a lista{" "}
            <Text className="font-bold text-destructive">"{item.name}"</Text>?
            Esta ação é irreversível.
          </Text>
          <View className="flex-row gap-x-3 w-full">
            <Button
              className="flex-1 bg-destructive"
              onPress={handleConfirmDeleteList} // Chama a função de exclusão após confirmação
            >
              <Text className="text-primary-foreground font-bold">Remover</Text>
            </Button>
            <Button
              className="flex-1"
              variant="outline"
              onPress={handleCloseConfirmDeleteModal}
            >
              <Text className="text-foreground">Cancelar</Text>
            </Button>
          </View>
        </View>
      </CenteredModal>
    </View>
  );
};

export { ShoppingListItem };