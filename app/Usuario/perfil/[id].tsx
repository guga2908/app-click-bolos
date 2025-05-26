import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Image, ScrollView, Text, TextInput, View } from "react-native";
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
    const { id } = useLocalSearchParams();
    const [cliente, setCliente] = useState<Cliente | null>(null);
    const [nome, setNome] = useState<string>("");
    
    useEffect(() => {
        const buscarCliente = async () => {
            try {
                const response = await fetch(`http://localhost:8081/cliente/${id}`);
                const data = await response.json();
                setCliente(data);
            } catch (error) {
                console.error("Erro ao buscar dados do cliente:", error);
            }
        };

        buscarCliente();
    }, [id]);

    return(
        <View>
            <View>
                <Text>Bem vindo: {cliente ?.nome ?? "Carregando..."}</Text>
            </View>

            <View>
                <Text>Seus Favoritos</Text>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {cliente?.favoritos?.length ? (
                            cliente.favoritos.map((fav, idx)=> (
                                <View key={fav.confeiteira.id ?? idx}>
                                    {fav.confeiteira.imagem && (
                                        <Image
                                        source={{uri: `http://localhost:8081${fav.confeiteira.imagem}`}}
                                        style={{ width: 100, height: 100, borderRadius: 50 }}
                                        />
                                    )}
                                    <Text>{fav.confeiteira.nome}</Text>
                                </View>
                            ))
                        ) : (
                            <Text>Você ainda não tem favoritos.</Text>
                        )}
                    </ScrollView>
            </View>
        </View>
    )
}