import { BottomSheetModal, Button, Input } from "@/components/ui";
import { useToast } from "@/components/ui/toast";
import type { Category } from "@/types";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

interface CategoryItemProps {
  category: Category;
  onDelete: (id: string) => void; // Se você quiser permitir deletar
  onEdit: (category: Category) => void; // Se você quiser permitir editar
}

const CategoryItem = ({ category, onDelete, onEdit }: CategoryItemProps) => {
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editedCategoryName, setEditedCategoryName] = useState(""); // Novo estado para o nome editado

  const toast = useToast();

  const handleEditPress = () => {
    setEditedCategoryName(category.name);
    setIsEditModalVisible(true);
  };

  const handleDeletePress = () => {
    // Adicionar uma confirmação para o usuário
    Alert.alert(
      "Confirmar Exclusão",
      `Tem certeza que deseja deletar a categoria "${category.name}"?`,
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Deletar",
          onPress: () => {
            onDelete(category.id);
            toast.showToast(`Categoria "${category.name}" deletada!`, 'success');
          },
          style: "destructive"
        }
      ],
      { cancelable: true }
    );
  };

  // função para salvar edição do item
  const handleSaveEditedCategory = () => { // Renomeado para clareza
    if (!editedCategoryName.trim()) {
      toast.showToast("O nome da categoria não pode ser vazio.", "destructive");
      return;
    }

    const updatedCategory: Category = {
      ...category, // Mantém o ID e outras propriedades da categoria original
      name: editedCategoryName.trim(),
    };

    onEdit(updatedCategory); // Chama a função onEdit (que é updateCategory do store)
    toast.showToast(`Categoria "${updatedCategory.name}" atualizada!`, "success");
    setIsEditModalVisible(false); // Fecha o modal
  };

  return (
    <View className="flex-row items-center justify-between p-3 my-1 bg-secondary/50 rounded-lg border border-border">
      <View className="flex-row items-center">

        <Text className="text-foreground text-lg font-medium">{category.name}</Text>
      </View>
      {/* Adicione botões de edição/deleção aqui se necessário */}
      {!category.isPadrao && ( // Só permite editar/deletar categorias não padrão
        <View className="flex-row gap-2">
          <TouchableOpacity onPress={handleEditPress}>
            <MaterialCommunityIcons name="pencil" size={20} color="gray" />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleDeletePress}>
            <MaterialCommunityIcons name="delete" size={20} color="red" />
          </TouchableOpacity>
        </View>
      )}


      {/* Modal para editar Categoria */}
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
    </View>
  );
};

export { CategoryItem }