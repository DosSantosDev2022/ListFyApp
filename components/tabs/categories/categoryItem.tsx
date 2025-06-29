// src/components/CategoryItem.tsx
import { BottomSheetModal, Button, Input } from "@/components/ui";
import { useToast } from "@/components/ui/toast";
import type { Category } from "@/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native"; // Remova 'Alert' daqui

// Importe o CenteredModal
import { CenteredModal } from "@/components/ui/CenteredModal"; // Ajuste o caminho se necessário

interface CategoryItemProps {
  category: Category;
  onDelete: (id: string) => void;
  onEdit: (category: Category) => void;
}

const CategoryItem = ({ category, onDelete, onEdit }: CategoryItemProps) => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editedCategoryName, setEditedCategoryName] = useState("");
  // NOVO ESTADO: Para o modal de confirmação de exclusão
  const [isConfirmDeleteModalVisible, setIsConfirmDeleteModalVisible] = useState(false);

  const toast = useToast();

  const handleEditPress = () => {
    setEditedCategoryName(category.name);
    setIsEditModalVisible(true);
  };

  // Funções para controlar o novo modal de confirmação
  const handleOpenConfirmDeleteModal = () => {
    setIsConfirmDeleteModalVisible(true);
  };
  const handleCloseConfirmDeleteModal = () => {
    setIsConfirmDeleteModalVisible(false);
  };

  const handleConfirmDelete = () => {
    onDelete(category.id);
    toast.showToast(`Categoria "${category.name}" deletada!`, 'success');
    handleCloseConfirmDeleteModal(); // Fecha o modal após a exclusão
  };

  // função para salvar edição do item
  const handleSaveEditedCategory = () => {
    if (!editedCategoryName.trim()) {
      toast.showToast("O nome da categoria não pode ser vazio.", "destructive");
      return;
    }

    const updatedCategory: Category = {
      ...category,
      name: editedCategoryName.trim(),
    };

    onEdit(updatedCategory);
    toast.showToast(`Categoria "${updatedCategory.name}" atualizada!`, "success");
    setIsEditModalVisible(false);
  };

  return (
    <View className="flex-row items-center justify-between p-3 my-1 bg-secondary/50 rounded-lg border border-border">
      <View className="flex-row items-center">
        <Text className="text-foreground text-lg font-medium">{category.name}</Text>
      </View>
      {!category.isPadrao && (
        <View className="flex-row gap-2">
          <TouchableOpacity onPress={handleEditPress}>
            <MaterialCommunityIcons name="pencil" size={20} color="gray" />
          </TouchableOpacity>
          {/* Agora este botão abre o CenteredModal de confirmação */}
          <TouchableOpacity onPress={handleOpenConfirmDeleteModal}>
            <MaterialCommunityIcons name="delete" size={20} color="red" />
          </TouchableOpacity>
        </View>
      )}

      {/* Modal para editar Categoria (BottomSheetModal existente) */}
      <BottomSheetModal
        visible={isEditModalVisible}
        onClose={() => setIsEditModalVisible(false)}
        title="Editar a Categoria"
      >
        <View className="p-4 w-full items-center">
          <Input
            placeholder="Nome da Categoria"
            value={editedCategoryName}
            onChangeText={setEditedCategoryName}
            className="mb-3"
          />
          <View className="flex-row gap-x-3 w-full">
            <Button className="flex-1" onPress={handleSaveEditedCategory}>
              <Text className="text-primary-foreground font-bold">Salvar</Text>
            </Button>
            <Button className="flex-1" variant="outline" onPress={() => setIsEditModalVisible(false)}>
              <Text className="text-foreground">Cancelar</Text>
            </Button>
          </View>
        </View>
      </BottomSheetModal>

      {/* CenteredModal para Confirmação de Exclusão da Categoria */}
      <CenteredModal
        visible={isConfirmDeleteModalVisible}
        onClose={handleCloseConfirmDeleteModal}
        title="Confirmar Exclusão"
      >
        <View className="p-4 items-center">
          <Text className="text-foreground text-lg text-center mb-6">
            Tem certeza que deseja deletar a categoria{" "}
            <Text className="font-bold text-destructive">"{category.name}"</Text>?
            Esta ação é irreversível.
          </Text>
          <View className="flex-row gap-x-3 w-full">
            <Button
              className="flex-1 bg-destructive"
              onPress={handleConfirmDelete} // Chama a função de exclusão após confirmação
            >
              <Text className="text-primary-foreground font-bold">Deletar</Text>
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

export { CategoryItem };