import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { FlatList, Image, Text, View, StyleSheet } from "react-native";

export default function PerfilConfeteira() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); // Recupera o ID da confeiteira da URL
  const [confeiteira, setConfeiteira] = useState(null);
  const [catalogo, setCatalogo] = useState([]);

  useEffect(() => {
    const buscarConfeiteira = async () => {
      try {
        const response = await fetch(`http://192.168.100.191:8081/api/confeiteira/${id}`); // Substitua pelo IP correto
        if (!response.ok) {
          throw new Error("Erro ao buscar confeiteira");
        }
        const data = await response.json();
        setConfeiteira(data);
        setCatalogo(data.catalogo); // Supondo que o catálogo esteja incluído nos dados
      } catch (error) {
        console.error("Erro ao buscar confeiteira:", error);
      }
    };

    if (id) {
      buscarConfeiteira();
    }
  }, [id]);

  if (!confeiteira) {
    return <Text>Carregando...</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: confeiteira.imagem }} style={styles.imagem} />
        <Text style={styles.nome}>{confeiteira.nome}</Text>
      </View>
      <Text style={styles.horarios}>
        Horários: {confeiteira.horarioInicio} - {confeiteira.horarioFim}
      </Text>
      <Text style={styles.descricao}>{confeiteira.descricao}</Text>

      <Text style={styles.catalogoTitulo}>Catálogo:</Text>
      <FlatList
        data={catalogo}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={{ uri: item.imagem }} style={styles.itemImagem} />
            <Text style={styles.itemNome}>{item.nome}</Text>
            <Text style={styles.itemDescricao}>{item.descricao}</Text>
            <Text style={styles.itemPreco}>Preço: R$ {item.preco}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    alignItems: "center",
    marginBottom: 16,
  },
  imagem: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 8,
  },
  nome: {
    fontSize: 20,
    fontWeight: "bold",
  },
  horarios: {
    fontSize: 16,
    marginBottom: 8,
  },
  descricao: {
    fontSize: 14,
    marginBottom: 16,
  },
  catalogoTitulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  item: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingBottom: 8,
  },
  itemImagem: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemNome: {
    fontSize: 16,
    fontWeight: "bold",
  },
  itemDescricao: {
    fontSize: 14,
  },
  itemPreco: {
    fontSize: 14,
    color: "green",
  },
});