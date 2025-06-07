import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  FlatList,
  Alert,
  Image,
  Pressable,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { styles } from "../../../../Estilos/estiloTelaPrincipal";

export default function TelaPrincipalUsuario() {
  // Removi estado de localização do usuário
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
    const filtradas = confeiteiras.filter((confeiteira) =>{
      const nomeloja = (confeiteira.nomeloja || "").toLowerCase();
      const nome = (confeiteira.nome || "").toLowerCase();
      const filtro = filtroNome.toLowerCase();

      return nomeloja.includes(filtro) || nome.includes(filtro)
    }
    );
    setConfeiteirasFiltradas(filtradas);
  }, [filtroNome, confeiteiras]);

  // Função para renderizar estrelas baseado na avaliação (0-5)
  const renderEstrelas = (avaliacao: number) => {
    const estrelas = [];
    for (let i = 1; i <= 5; i++) {
      estrelas.push(
        <Text key={i} style={{ color: i <= avaliacao ? '#FFD700' : '#ccc', fontSize: 18 }}>
          ★
        </Text>
      );  
    }
    return <View style={{ flexDirection: "row" }}>{estrelas}</View>;
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
        {/* Removido filtro por localização e botão */}
      </View>

      <View>
        <Text style={styles.subtitle}>Confeiteiras:</Text>
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
                <View style={{ flex: 1, marginLeft: 10 }}>
                   <Text style={{ fontSize: 18, fontWeight: "bold" }}>{item.nome}</Text>
                  <Text style={{ fontSize: 14, color: "#555" }}>{item.nomeloja}</Text>
                  {/* Exibe as estrelas de avaliação */}
                  {renderEstrelas(item.avaliacao ?? 0)}
                </View>
              </View>
            </Pressable>
          )}
        />
      </View>
    </View>
  );
}
