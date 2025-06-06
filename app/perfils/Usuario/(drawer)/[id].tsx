import React, { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from "expo-router";

type Confeiteira = {
  id: number;
  nome: string;
  imagem?: string;
};

type Cliente = {
  nome: string;
  favoritos: { confeiteira: Confeiteira }[];
};

export default function Perfil() {
  const router = useRouter();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const buscarCliente = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (!userId) {
          setLoading(false);
          return;
        }
        const response = await fetch(`http://localhost:8081/cliente/${userId}`);
        const data = await response.json();
        setCliente(data);
      } catch (error) {
        console.error("Erro ao buscar dados do cliente:", error);
      } finally {
        setLoading(false);
      }
    };

    buscarCliente();
  }, []);

  if (loading) {
    return <Text>Carregando...</Text>;
  }

  if (!cliente) {
    return <Text>Usuário não encontrado ou não logado.</Text>;
  }

  return (
    <View>
      <View>
        <Text>Bem vindo: {cliente.nome}</Text>
      </View>

      <View>
        <Text>Seus Favoritos</Text>
            <ScrollView showsHorizontalScrollIndicator={false}>
              {cliente.favoritos?.length ? (
                cliente.favoritos.map((fav, idx) => (
              <Pressable key={fav.confeiteira.id ?? idx}
              onPress={() => router.push({
                pathname:"/perfils/Usuario/(drawer)/perfilConfeteira",
                params:{id: String(fav.confeiteira.id)}
              })
            }
              >
                  <View key={fav.confeiteira.id ?? idx}>
                    {fav.confeiteira.imagem && (
                      <Image
                        source={{ uri: `http://localhost:8081${fav.confeiteira.imagem}` }}
                        style={{ width: 100, height: 100, borderRadius: 50 }}
                      />
                    )}
                    <Text>{fav.confeiteira.nome}</Text>
                  </View>
              </Pressable>
                ))
              ) : (
                <Text>Você ainda não tem favoritos.</Text>
              )}
            </ScrollView>
      </View>
    </View>
  );
}