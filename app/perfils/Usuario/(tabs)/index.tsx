import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  Button,
  Alert,
  Image,
  Pressable,
  TextInput,
  TouchableOpacity,
} from "react-native";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import { styles } from "../../../../Estilos/estiloTelaPrincipal";

export default function TelaPrincipalUsuario() {
  const [localizacaoUsuario, setLocalizacaoUsuario] = useState<Location.LocationObjectCoords | null>(null);
  const [confeiteiras, setConfeiteiras] = useState<any[]>([]);
  const [confeiteirasFiltradas, setConfeiteirasFiltradas] = useState<any[]>([]);
  const [filtroNome, setFiltroNome] = useState("");
  const [raioKm, setRaioKm] = useState(50);
  const { id } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    const obterLocalizacao = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permissão negada", "Permita o acesso à localização para usar o filtro.");
        return;
      }
      const localizacao = await Location.getCurrentPositionAsync({});
      setLocalizacaoUsuario(localizacao.coords);
    };
    obterLocalizacao();
  }, []);

  useEffect(() => {
    const buscarConfeiteiras = async () => {
      try {
        const response = await fetch("http://localhost:8081/confeiteiras");
        if (!response.ok) throw new Error("Erro ao buscar confeiteiras");
        const data = await response.json();
        console.log("Confeiteiras recebidas:", data);
        setConfeiteiras(data);
        setConfeiteirasFiltradas(data);
      } catch (error) {
        console.error("Erro ao buscar confeiteiras:", error);
        Alert.alert("Erro", "Não foi possível carregar as confeiteiras.");
      }
    };
    buscarConfeiteiras();
  }, []);

  useEffect(() => {
    const filtradas = confeiteiras.filter((confeiteira) =>
      (confeiteira.nomeloja || "").toLowerCase().startsWith(filtroNome.toLowerCase())
    );
    setConfeiteirasFiltradas(filtradas);
  }, [filtroNome, confeiteiras]);

  const calcularDistancia = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const filtrarPorLocalizacao = () => {
    if (!localizacaoUsuario) {
      Alert.alert("Erro", "Localização do usuário não encontrada.");
      return;
    }
    const proximas = confeiteiras.filter((confeiteira) => {
      const distancia = calcularDistancia(
        localizacaoUsuario.latitude,
        localizacaoUsuario.longitude,
        confeiteira.latitude,
        confeiteira.longitude
      );
      return distancia <= raioKm;
    });
    setConfeiteirasFiltradas(proximas);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Página Principal</Text>
      <View style={styles.filterContainer}>
        <TextInput
          style={styles.input}
          placeholder="Digite o nome da confeiteira"
          value={filtroNome}
          onChangeText={setFiltroNome}
        />
        <View style={styles.radiusContainer}>
          <Text style={styles.label}>Selecione o raio:</Text>
          <View style={styles.radiusButtons}>
            {[5, 10, 20, 50].map((raio) => (
              <TouchableOpacity
                key={raio}
                style={[
                  styles.radiusButton,
                  raioKm === raio && styles.activeRadiusButton,
                ]}
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
          data={confeiteirasFiltradas}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Pressable onPress={() => router.push(`./perfilConfeteira?id=${item.id}`)}>
              <View style={styles.item}>
                {item.imagem ? (
                  <Image
                    source={{ uri: `http://localhost:8081${item.imagem}` }}
                    style={styles.imagem}
                  />
                ) : (
                  <Text style={{ color: "gray" }}>Sem imagem</Text>
                )}
                <Text style={styles.itemText}>{item.nomeloja}</Text>
              </View>
            </Pressable>
          )}
        />
      </View>
    </View>
  );
}
