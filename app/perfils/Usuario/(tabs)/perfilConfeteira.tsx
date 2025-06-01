import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, Image, Pressable, Text, View } from "react-native";
import { styles } from '../../../../Estilos/estiloPerfilConfeiteira';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from '@expo/vector-icons';

export default function PerfilConfeteira() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  interface Confeiteira {
    imagem: string;
    nome: string;
    horarioInicio: string;
    horarioFim: string;
    descricao: string;
  }

  interface Bolo {
    id: number;
    imagem: string;
    nome: string;
    descricao: string;
    preco: number;
  }

  const [confeiteira, setConfeiteira] = useState<Confeiteira | null>(null);
  const [catalogo, setCatalogo] = useState<Bolo[]>([]);
  const [favoritado, setFavoritado] = useState(false);

  useEffect(() => {
    if (!id) return;

    const IP = 'localhost'; // <=== substitua pelo seu IP local

    const buscarConfeiteira = async () => {
      try {
        const response = await fetch(`http://${IP}:8081/confeiteira/${id}`);
        if (!response.ok) throw new Error("Erro ao buscar confeiteira");
        const data = await response.json();
        setConfeiteira(data);
      } catch (error) {
        console.error("Erro ao buscar confeiteira:", error);
      }
    };

    const buscarCatalogo = async () => {
      try {
        const response = await fetch(`http://${IP}:8081/confeiteira/${id}/catalogo`);
        if (!response.ok) throw new Error("Erro ao buscar catálogo");
        const data = await response.json();
        console.log("Catálogo recebido:", data);
        setCatalogo(data);
      } catch (error) {
        console.error("Erro ao buscar catálogo:", error);
      }
    };

    buscarConfeiteira();
    buscarCatalogo();
  }, [id]);

  useEffect(() => {
    const verificarFavorito = async () => {
      const clienteId = await AsyncStorage.getItem('clienteId');
      if (!clienteId) return;
      try {
        const response = await fetch(`http://${IP}:8081/cliente/${clienteId}/favoritos`);
        if (response.ok) {
          const favoritos = await response.json();
          setFavoritado(favoritos.some((fav: any) => String(fav.confeiteiraId) === String(id)));
        }
      } catch (error) {
        setFavoritado(false);
      }
    };
    if (id) verificarFavorito();
  }, [id]);

  if (!confeiteira) {
    return <Text>Carregando...</Text>;
  }

  const alternarFavorito = async () => {
    const clienteId = await AsyncStorage.getItem('clienteId');
    if (!clienteId) {
      Alert.alert("Erro", "Você precisa estar logado para favoritar uma confeiteira");
      return;
    }
    try {
      if (!favoritado) {
        const response = await fetch(`http://${IP}:8081/cliente/${clienteId}/favoritos`, {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ confeiteiraId: id }),
        });
        if (!response.ok) throw new Error("Erro ao favoritar confeiteira");
        setFavoritado(true);
        Alert.alert("Sucesso", "Confeiteira adicionada aos favoritos");
      } else {
        const response = await fetch(`http://${IP}:8081/cliente/${clienteId}/favoritos/${id}`, {
          method: 'DELETE',
        });
        if (!response.ok && response.status !== 204) throw new Error("Erro ao remover dos favoritos");
        setFavoritado(false);
        Alert.alert("Removido", "Confeiteira removida dos favoritos!");
      }
    } catch (error) {
      Alert.alert("Erro", "Ocorreu um problema ao alterar favoritos.");
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: confeiteira.imagem }} style={styles.imagem} />
        <Text style={styles.nome}>{confeiteira.nome}</Text>
        <Pressable onPress={alternarFavorito}>
          <Ionicons
            name={favoritado ? "heart" : "heart-outline"}
            size={32}
            color={favoritado ? "red" : "gray"}
            style={{ marginTop: 10 }}
          />
        </Pressable>
      </View>

      <Text style={styles.horarios}>
        Horários: {confeiteira.horarioInicio} - {confeiteira.horarioFim}
      </Text>
      <Text style={styles.descricao}>{confeiteira.descricao}</Text>

      <Text style={styles.catalogoTitulo}>Catálogo:</Text>

     {catalogo.length === 0 ? (
  <Text>Nenhum bolo cadastrado no catálogo.</Text>
) : (
  <FlatList
    data={catalogo}
    keyExtractor={(item) => item.id.toString()}
    renderItem={({ item }) => (
      <Pressable onPress={() => router.push(`../pedidos?id=${item.id}`)}>
        <View style={styles.item}>
          <Image source={{ uri: item.imagem }} style={styles.itemImagem} />
          <Text style={styles.itemNome}>{item.nome}</Text>
          <Text style={styles.itemDescricao}>{item.descricao}</Text>
          <Text style={styles.itemPreco}>Preço: R$ {item.preco}</Text>
        </View>
      </Pressable>
    )}
  />
)}

    </View>
  );
}
