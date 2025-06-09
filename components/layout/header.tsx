// components/CustomHeader.tsx
import type React from "react";
import { View, Text, Image, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // Para lidar com a notch e status bar
import { UserCircle2 } from "lucide-react-native"; // Ícone de usuário do Lucide
import { cn } from "@/lib/utils"; // Se você tem o utilitário cn
import { Avatar, AvatarFallback, AvatarImage, H1 } from "../ui";

const CustomHeader: React.FC = () => {
	// Simule uma URL de imagem de perfil de usuário ou use uma local
	const userProfilePic = "https://via.placeholder.com/40"; // Substitua pela URL real da foto do usuário

	return (
		// SafeAreaView para garantir que o conteúdo não se sobreponha à barra de status/notch
		<SafeAreaView className="bg-[hsl(203_64%_24%)] pt-2 pb-2">
			<View className="flex-row items-center justify-between px-4">
				{/* Logo do App / Nome do App */}
				<View className="flex-row items-center">
					{/* Você pode adicionar um Image para o logo aqui */}
					{/* <Image
            source={require('../assets/images/listfy-logo.png')} // Caminho para o seu logo
            style={tailwind("w-8 h-8 mr-2")}
          /> */}
					<H1 className="text-primary-foreground text-2xl">
						ListFy App
					</H1>
				</View>

				{/* Foto do Usuário / Ícone de Usuário */}
				<View className="ml-auto">
					{userProfilePic ? (
						<>
							<Avatar alt="avatar-with-image">
								<AvatarImage
									source={{
										uri: "https://avatars.githubusercontent.com/u/66306912?v=4",
									}}
								/>
								<AvatarFallback>
									<Text>UN</Text>
								</AvatarFallback>
							</Avatar>
						</>
					) : (
						<UserCircle2 size={40} color="white" /> // Ícone Lucide se não houver foto
					)}
				</View>
			</View>
		</SafeAreaView>
	);
};

export default CustomHeader;
