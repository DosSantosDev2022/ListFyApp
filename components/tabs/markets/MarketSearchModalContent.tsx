import type React from 'react';
import { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import debounce from 'lodash.debounce';
import { Input, Button } from "@/components/ui";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useToast } from "@/components/ui/toast";
import type { Market, MarketSearchModalContentProps, Prediction } from '@/types';


const MarketSearchModalContent: React.FC<MarketSearchModalContentProps> = ({
  Maps_API_KEY,
  onMarketSelected,
  currentLocation,
  setCurrentLocation,
}) => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState<Prediction[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedMarketDetails, setSelectedMarketDetails] = useState<Market | null>(null);
  const toast = useToast();
  const mapRef = useRef<MapView>(null);

  // --- Funções de Localização ---
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permissão de Localização Negada",
          "Por favor, conceda permissão de localização para usar este recurso.",
        );
        return;
      }
      try {
        const location = await Location.getCurrentPositionAsync({});
        setCurrentLocation({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        });
      } catch (error) {
        console.error("Erro ao obter localização inicial:", error);
        toast.showToast("Não foi possível obter sua localização atual.", "destructive");
      }
    })();
  }, [setCurrentLocation, toast]); // Adicionado setCurrentLocation e toast às dependências

  // Função para buscar lugares na API do Google Places (Autocomplete)
  const searchPlaces = async (text: string) => {
    if (!text || text.length < 2) {
      setSearchResults([]);
      return;
    }

    if (!Maps_API_KEY || !currentLocation) {
      console.warn("API Key ou localização não disponíveis para busca.");
      return;
    }

    setIsSearching(true);
    try {
      const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(text)}&key=${Maps_API_KEY}&language=pt-BR&components=country:br&types=establishment&location=${currentLocation.latitude},${currentLocation.longitude}&radius=50000`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK') {
        setSearchResults(data.predictions);
      } else {
        console.error("Erro na API do Google Places Autocomplete:", data.status, data.error_message);
        setSearchResults([]);
        toast.showToast("Erro ao buscar lugares. Tente novamente.", "destructive");
      }
    } catch (error) {
      console.error("Erro na requisição de busca:", error);
      setSearchResults([]);
      toast.showToast("Erro de rede ao buscar. Verifique sua conexão.", "destructive");
    } finally {
      setIsSearching(false);
    }
  };

  // Debounce para a função de busca
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  const debouncedSearch = useCallback(
    debounce((text: string) => searchPlaces(text), 500),
    [Maps_API_KEY, currentLocation, toast] // Adicione dependências relevantes
  );

  // Lida com a mudança de texto no input de busca
  const handleSearchTextChange = (text: string) => {
    setSearchText(text);
    debouncedSearch(text);
  };

  // Função para obter detalhes de um lugar específico (após seleção)
  const getPlaceDetails = async (place_id: string) => {
    if (!Maps_API_KEY) {
      console.warn("API Key não disponível para obter detalhes.");
      return;
    }

    try {
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${place_id}&key=${Maps_API_KEY}&language=pt-BR&fields=name,formatted_address,geometry,place_id`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.status === 'OK' && data.result) {
        const details = data.result;
        const market: Market = {
          id: details.place_id,
          name: details.name,
          address: details.formatted_address,
          latitude: details.geometry.location.lat,
          longitude: details.geometry.location.lng,
        };
        setSelectedMarketDetails(market);
        // Centraliza o mapa no novo mercado
        mapRef.current?.animateToRegion(
          {
            latitude: market.latitude,
            longitude: market.longitude,
            latitudeDelta: 0.005,
            longitudeDelta: 0.005,
          },
          1000,
        );
      } else {
        console.error("Erro na API do Google Places Details:", data.status, data.error_message);
        toast.showToast("Não foi possível obter detalhes do lugar selecionado.", "destructive");
      }
    } catch (error) {
      console.error("Erro na requisição de detalhes:", error);
      toast.showToast("Erro de rede ao obter detalhes. Verifique sua conexão.", "destructive");
    }
  };

  // Lida com a seleção de um lugar na lista de sugestões
  const handleSelectPlace = (place_id: string) => {
    setSearchResults([]); // Limpa a lista de sugestões após a seleção
    setSearchText(''); // Limpa o texto do input
    getPlaceDetails(place_id);
  };

  return (
    <View className="flex-1 p-4 w-full"> {/* Removi mb-20, o BottomSheetModal já tem padding */}
      {Maps_API_KEY && currentLocation ? (
        <>
          {/* Input de busca manual */}
          <Input
            placeholder="Buscar supermercado..."
            value={searchText}
            onChangeText={handleSearchTextChange}
            className="mb-2"
          />

          {isSearching && (
            <ActivityIndicator size="small" color="#007AFF" className="my-2" />
          )}

          {/* Lista de resultados da busca */}
          {searchResults.length > 0 && searchText.length > 1 ? (
            <View className="border border-border rounded-lg p-3 max-h-60 overflow-scroll"> {/* Usar overflow-scroll para a FlatList */}
              <FlatList
                data={searchResults}
                keyExtractor={(item) => item.place_id}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className="p-3 border-b border-border-foreground"
                    onPress={() => handleSelectPlace(item.place_id)}
                  >
                    <Text className="text-foreground text-base font-medium">
                      {item.structured_formatting?.main_text || item.description}
                    </Text>
                    <Text className="text-muted-foreground text-sm">{item.description}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          ) : null}

          {/* Mapa e Detalhes do Mercado Selecionado */}
          {currentLocation ? (
            <View className="flex-1 rounded-lg overflow-hidden mt-4">
              <MapView
                ref={mapRef}
                provider={PROVIDER_GOOGLE}
                className="w-full h-full"
                initialRegion={{
                  latitude: currentLocation.latitude,
                  longitude: currentLocation.longitude,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                showsUserLocation
                followsUserLocation
                loadingEnabled
              >
                {selectedMarketDetails ? (
                  <Marker
                    coordinate={{
                      latitude: selectedMarketDetails.latitude,
                      longitude: selectedMarketDetails.longitude,
                    }}
                    title={selectedMarketDetails.name}
                    description={selectedMarketDetails.address}
                  />
                ) : null}
              </MapView>
            </View>
          ) : null}

          {selectedMarketDetails ? (
            <View className="p-3 bg-card rounded-lg mt-4 border border-border">
              <Text className="text-foreground text-xl font-bold">
                {selectedMarketDetails.name}
              </Text>
              <Text className="text-muted-foreground text-base mt-1">
                {selectedMarketDetails.address}
              </Text>
              <Button
                onPress={() => onMarketSelected(selectedMarketDetails)} // Chama a função passada via prop
                className="mt-3 w-full"
              >
                <MaterialCommunityIcons
                  name="star-plus"
                  size={20}
                  color="white"
                  className="mr-2"
                />
                <Text className="text-primary-foreground font-bold">
                  Favoritar este Mercado
                </Text>
              </Button>
            </View>
          ) : null}
        </>
      ) : (
        <ActivityIndicator
          size="large"
          color="#007AFF"
          className="my-4"
        />
      )}
    </View>
  );
};

export { MarketSearchModalContent };