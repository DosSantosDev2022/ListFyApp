import { BottomSheetModal, Button, Input } from "@/components/ui";
import { useToast } from "@/components/ui/toast";
import { useCategoryStore } from "@/store/categoryStore";
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
  const [editedCategoryIcon, setEditedCategoryIcon] = useState(""); // Novo estado para o ícone editado
  const [editedCategoryColor, setEditedCategoryColor] = useState(""); // Novo estado para a cor editada

  const toast = useToast();

  const handleEditPress = () => {
    setEditedCategoryName(category.name);
    setEditedCategoryIcon(category.icon || "");
    setEditedCategoryColor(category.color || "");
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
      icon: editedCategoryIcon.trim() || undefined, // undefined se vazio
      color: editedCategoryColor.trim() || undefined, // undefined se vazio
    };

    onEdit(updatedCategory); // Chama a função onEdit (que é updateCategory do store)
    toast.showToast(`Categoria "${updatedCategory.name}" atualizada!`, "success");
    setIsEditModalVisible(false); // Fecha o modal
  };

  return (
    <View className="flex-row items-center justify-between p-3 my-1 bg-secondary/50 rounded-lg border border-border">
      <View className="flex-row items-center">
        {/* Você pode renderizar o ícone e a cor aqui se tiver essa informação no objeto Category */}
        {category.icon && (
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          <MaterialCommunityIcons name={category.icon as any} size={24} color={category.color || "white"} className="mr-3" />
        )}
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
          {/* Implemente um seletor de ícones aqui, talvez com um FlatList de ícones do MaterialCommunityIcons */}
          <Input
            placeholder="Nome do Ícone (ex: food-apple)"
            value={editedCategoryIcon}
            onChangeText={setEditedCategoryIcon}
            className="mb-3"
          />
          {/* Implemente um seletor de cores aqui, talvez com botões de cores */}
          <Input
            placeholder="Cor do Ícone (ex: #FF0000)"
            value={editedCategoryColor}
            onChangeText={setEditedCategoryColor}
            className="mb-4"
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