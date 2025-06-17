import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  Alert,
  Image,
  Pressable,
  TextInput,
  StyleSheet,
  Dimensions,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function TelaPrincipalUsuario() {
  const [confeiteiras, setConfeiteiras] = useState<any[]>([]);
  const [confeiteirasFiltradas, setConfeiteirasFiltradas] = useState<any[]>([]);
  const [filtroNome, setFiltroNome] = useState("");
  const { id } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    const buscarConfeiteiras = async () => {
      try {
        const response = await fetch("http://localhost:8081/confeiteiras");
        if (!response.ok) throw new Error("Erro ao buscar confeiteiras");
        const data = await response.json();
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
    const filtradas = confeiteiras.filter((confeiteira) => {
      const nomeloja = (confeiteira.nomeloja || "").toLowerCase();
      const nome = (confeiteira.nome || "").toLowerCase();
      const filtro = filtroNome.toLowerCase();

      return nomeloja.includes(filtro) || nome.includes(filtro);
    });
    setConfeiteirasFiltradas(filtradas);
  }, [filtroNome, confeiteiras]);

  const renderEstrelas = (avaliacao: number) => {
    return (
      <View style={{ flexDirection: "row", marginTop: 4 }}>
        {[...Array(5)].map((_, i) => (
          <Ionicons
            key={i}
            name={i < avaliacao ? "star" : "star-outline"}
            size={18}
            color="#FFD700"
          />
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerBanner}>
        <Text style={styles.logoText}>🎂Click Bolos</Text>
        <Text style={styles.slogan}>Encontre o bolo perfeito a um CLICK de distância!</Text>
      </View>

      <View style={styles.filterContainer}>
        <View style={styles.inputWrapper}>
          <Ionicons name="search" size={20} color="#9575CD" style={styles.icon} />
          <TextInput
            style={styles.input}
            placeholder="Pesquisar confeiteira ou loja..."
            value={filtroNome}
            onChangeText={setFiltroNome}
            placeholderTextColor="#B39DDB"
          />
        </View>
      </View>

      <Text style={styles.sectionTitle}>Confeiteiras disponíveis:</Text>
      <FlatList
        data={confeiteirasFiltradas}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <Pressable onPress={() => router.push(`./perfilConfeteira?id=${item.id}`)}>
            <View style={styles.card}>
              {item.imagem ? (
                <Image
                  source={{ uri: `http://localhost:8081${item.imagem}` }}
                  style={styles.cardImage}
                />
              ) : (
                <View style={[styles.cardImage, styles.noImage]}>
                  <Text style={{ color: "#9E9E9E" }}>Sem imagem</Text>
                </View>
              )}
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.cardTitle}>{item.nome}</Text>
                <Text style={styles.cardSubtitle}>{item.nomeloja}</Text>
                {renderEstrelas(item.avaliacao ?? 0)}
              </View>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3E5F5",
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  headerBanner: {
    backgroundColor: "#D1C4E9",
    paddingVertical: 26,
    paddingHorizontal: 20,
    borderRadius: 22,
    marginBottom: 24,
    alignItems: "center",
    shadowColor: "#9575CD",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  logoText: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#6A1B9A",
    marginBottom: 6,
  },
  slogan: {
    fontSize: 15,
    color: "#7E57C2",
    textAlign: "center",
    fontStyle: "italic",
    fontWeight: "500",
    letterSpacing: 0.5,
  },
  filterContainer: {
    marginBottom: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderColor: "#CE93D8",
    borderWidth: 1.4,
    borderRadius: 14,
    paddingHorizontal: 12,
  },
  icon: {
    marginRight: 6,
  },
  input: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: "#5E35B1",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "600",
    color: "#6A1B9A",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    padding: 16,
    borderRadius: 18,
    marginBottom: 14,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: 85,
    height: 85,
    borderRadius: 16,
    backgroundColor: "#E1BEE7",
  },
  noImage: {
    justifyContent: "center",
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#512DA8",
    marginBottom: 2,
  },
  cardSubtitle: {
    fontSize: 14,
    color: "#7E57C2",
    marginBottom: 6,
  },
});