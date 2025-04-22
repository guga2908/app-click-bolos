import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, FlatList, Button, Alert, Image, Pressable, TextInput, TouchableOpacity } from "react-native";
import * as Location from "expo-location";
import { useRouter } from "expo-router";

export default function TelaPrincipalUsuario() {
  const [localizacaoUsuario, setLocalizacaoUsuario] = useState<Location.LocationObjectCoords | null>(null);
  const [confeiteiras, setConfeiteiras] = useState<{ id: string; nome: string; latitude: number; longitude: number; imagem: string }[]>([]);
  const [confeiteirasFiltradas, setConfeiteirasFiltradas] = useState<{ id: string; nome: string; latitude: number; longitude: number; imagem: string }[]>([]);
  const [filtroNome, setFiltroNome] = useState("");
  const [raioKm, setRaioKm] = useState(50); // Estado para o raio selecionado
  const router = useRouter();

  useEffect(() => {
    const obterLocalizacao = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissão negada", "Permita o acesso à localização para usar o filtro.");
        return;
      }

      const localizacao = await Location.getCurrentPositionAsync({});
      console.log("Localização do usuário:", localizacao.coords); // Verificar as coordenadas
      setLocalizacaoUsuario(localizacao.coords);
    };

    obterLocalizacao();
  }, []);

  useEffect(() => {
    const buscarConfeiteiras = async () => {
      try {
        const response = await fetch("/api/rota"); // Substitua pela URL da sua API
        if (!response.ok) {
          throw new Error("Erro ao buscar confeiteiras");
        }
        const data = await response.json();
        setConfeiteiras(data); // Atualiza o estado com os dados das confeiteiras
        setConfeiteirasFiltradas(data); // Inicializa a lista filtrada
      } catch (error) {
        console.error("Erro ao buscar confeiteiras:", error);
        Alert.alert("Erro", "Não foi possível carregar as confeiteiras.");
      }
    };

    buscarConfeiteiras();
  }, []);

  useEffect(() => {
    const confeiteirasFiltradasPorNome = confeiteiras.filter((confeiteira) =>
      confeiteira.nome.toLowerCase().startsWith(filtroNome.toLowerCase())
    );
    setConfeiteirasFiltradas(confeiteirasFiltradasPorNome);
  }, [filtroNome]);

  const calcularDistancia = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Raio da Terra em km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distancia = R * c; // Distância em km
    console.log(`Distância entre (${lat1}, ${lon1}) e (${lat2}, ${lon2}): ${distancia} km`);
    return distancia;
  };

  const filtrarPorLocalizacao = () => {
    if (!localizacaoUsuario) {
      Alert.alert("Erro", "Localização do usuário não encontrada.");
      return;
    }

    const confeiteirasProximas = confeiteiras.filter((confeiteira) => {
      const distancia = calcularDistancia(
        localizacaoUsuario.latitude,
        localizacaoUsuario.longitude,
        confeiteira.latitude,
        confeiteira.longitude
      );
      console.log(`Distância para ${confeiteira.nome}: ${distancia} km`);
      return distancia <= raioKm;
    });

    console.log("Confeiteiras próximas:", confeiteirasProximas); // Verificar as confeiteiras filtradas
    setConfeiteirasFiltradas(confeiteirasProximas);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Página Principal</Text>
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite o nome da confeiteira"
          value={filtroNome}
          onChangeText={setFiltroNome} // Atualiza o estado do filtro por nome
        />
        <View style={styles.radiusContainer}>
          <Text style={styles.label}>Selecione o raio:</Text>
          <View style={styles.radiusButtons}>
            {[5, 10, 20, 50].map((raio) => (
              <TouchableOpacity
                key={raio}
                style={[styles.radiusButton, raioKm === raio && styles.activeRadiusButton]}
                onPress={() => setRaioKm(raio)}
              >
                <Text style={styles.radiusButtonText}>{raio} km</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <Button title="Filtrar por Localização" onPress={filtrarPorLocalizacao} />
      </View>
      <View>
        <Text style={styles.subtitle}>Confeiteiras Próximas:</Text>
        <FlatList
          data={confeiteirasFiltradas.length > 0 ? confeiteirasFiltradas : confeiteiras}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Pressable onPress={() => router.push(`/Usuario/perfilConfeteira?id=${item.id}`)}>
              <View style={styles.item}>
                <Image source={{ uri: item.imagem }} style={styles.imagem} />
                <Text style={styles.itemText}>{item.nome}</Text> {/* Nome da loja */}
              </View>
            </Pressable>
          )}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  filterContainer: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
    marginBottom: 10,
  },
  radiusContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  radiusButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  radiusButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    marginRight: 10,
  },
  activeRadiusButton: {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
  },
  radiusButtonText: {
    color: "#000",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flexDirection: "row",
    alignItems: "center",
  },
  itemText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  imagem: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
});
