import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Button, FlatList, Image, Pressable, Text, View} from "react-native";
import { styles } from '../../Estilos/estiloPerfilConfeiteira' 
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from '@expo/vector-icons';


export default function PerfilConfeteira() {
  const { id } = useLocalSearchParams(); // Recupera o ID da confeiteira da URL
  interface Confeiteira {
    imagem: string;
    nome: string;
    horarioInicio: string;
    horarioFim: string;
    descricao: string;
    catalogo: Array<{
      id: number;
      imagem: string;
      nome: string;
      descricao: string;
      preco: number;
    }>;
  }

  const [confeiteira, setConfeiteira] = useState<Confeiteira | null>(null);
  const [catalogo, setCatalogo] = useState<Confeiteira["catalogo"]>([]);
  const [favoritado, setFavoritado] = useState(false);

  useEffect(() => {
    const buscarConfeiteira = async () => {
      try {
        const response = await fetch(`http://localhost:8081/confeiteira/${id}`); // Substitua pelo IP correto
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
  
  useEffect(()=>{
    const verificarFavorito = async () =>{
      const clienteId = await AsyncStorage.getItem('clienteId');
      if(!clienteId)return;
      try{
        const response = await fetch(`http://localhost:8081/cliente/${clienteId}/favoritos`);
        if(response.ok){
          const favoritos = await response.json();
          setFavoritado(favoritos.some((fav:any)=> String(fav.confeiteiraId) === String(id)))
        }
      }catch(error){
        setFavoritado(false);
      }
    };
    if(id) verificarFavorito();
  }, [id]);

  if (!confeiteira) {
    return <Text>Carregando...</Text>;
  }
  const alternarFavorito = async () =>{
    console.log("clicou no coração")
    const clienteId = await AsyncStorage.getItem('clienteId');
    if(!clienteId){
      Alert.alert("Erro","Voce Precisa estar logado para favoritar uma confeiteira");
      return;
    }
    if(!favoritado){
      //favoritar
      try{
        const response = await fetch(`http://localhost:8081/cliente/${clienteId}/favoritos`,{
          method:'POST',
          headers:{'content-type': 'application/json'},
          body: JSON.stringify({confeiteiraId: id})
        });
        if(!response.ok) throw new Error("Erro ao favoritar confeiteira");
        setFavoritado(true);
        Alert.alert("Sucesso", " Confeiteira adicionada aos favoritos");
      }catch(error){
        Alert.alert("Erro", "Não foi possivel Favoritar");
        console.error(error);
      }
    }else{
      try{
        const response = await fetch (`http://localhost:8081/cliente/${clienteId}/favoritos/${id}`,{
          method:'DELETE'
        });
        if(!response.ok && response.status !== 204) throw new Error("Erro ao remover dos favoritos");
        setFavoritado(false);
        Alert.alert("Removido", "Confeiteira removida dos favoritos!");
      }catch(error){
       Alert.alert("Erro", "Não foi possível remover dos favoritos.");
      console.error(error);
      }
    }
  }
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={{ uri: confeiteira.imagem }} style={styles.imagem} />
        <Text style={styles.nome}>{confeiteira!.nome}</Text>
       <Pressable  onPress = {alternarFavorito}>
       <Ionicons
       name = {favoritado ? "heart" : "heart-outline"}
       size = {32}
       color = {favoritado ? "red" : "gray"}
       style = {{marginTop: 10}}
       />
       </Pressable>
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
