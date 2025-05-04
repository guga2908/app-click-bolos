import { useRouter } from "expo-router";
import { useEffect, useId, useState } from "react";
import { Button, Image, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import * as ImagePicker from "expo-image-picker";

    /*tive uma dicas de como prosseguir e qual caminho devo pegar este aplicativo tera como 
    cliente final o usuario e nao a boleira / confeiteira devo seguir esta linha de raciocinio e
    criar um aplicativo que seja mais voltado para o usuario final e nao para a boleira / confeiteira
    mais nao devo neglegir a boleira / confeiteira pois ela sera a pessoa que ira cadastrar os bolos e o usuario final
    */

    /*
    criar uma nova tabela no banco de dados para armazenar as informações da confeiteira e do catalogo de bolos
    e criar uma nova tela para adicionar novos bolos ao catalogo da confeiteira
    adicionar um ImagenPicker para a confeiteira adicionar uma imagem de perfil
    e conectar tudo isso com o banco de dados, 

    */
export default function Perfil (){
    const [nomeloja, setNomeloja] = useState("");
    const [horarioInicio, setHorarioInicio] = useState("");
    const [horarioFim, setHorarioFim] = useState("");
    const [imagem, setImagem] = useState<string | null>(null);
    const [descricao, setDescricao] = useState("");
    const [modoEdicao, setModoEdicao] = useState(false);
    interface Bolo {
        nome: string;
        descricao: string;
        preco: string;
        sabor: string;
        tipo: string;
        imagem: string;
    }

    const [catalogo, setCatalogo] = useState<Bolo[]>([]);
    const router = useRouter();
    
const onPress =() => (router.push("/Confeiteira/Adicionar_novo_bolo"));

    const validarHorario = (horario: string) => {
        const regex = /^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/
        return regex.test(horario);
    };
    useEffect(() => {
        const buscarDadosConfeiteira = async () => {
            try{
                const perfilResponse = await fetch(`http://192.168.100.1/api/rota/${useId}`);
                const perfilData = await perfilResponse.json();
                setNomeloja(perfilData.nomeloja || "");
                setHorarioInicio(perfilData.horarioInicio || "");
                setHorarioFim(perfilData.horarioFim || ""); 
                setDescricao(perfilData.descricao || "");
                setImagem(perfilData.imagem || null);

                const catalogoResponse = await fetch('/api/rota');
                const catalogoData = await catalogoResponse.json();
                setCatalogo(catalogoData || []);
            }catch (error) {
                console.error("Erro ao buscar dados da confeiteira:", error);
            }
        };
        buscarDadosConfeiteira();
    },[]);
    const salvarPerfil = async () => {
        if (validarHorario(horarioInicio) && validarHorario(horarioFim)) {
            alert("Por Favor, Informe o Horario de Abertura e Fechamento corretamente")
            return;
    }
    const perfilData = {   
        nomeloja,
        horarioInicio,
        horarioFim,
        descricao,
        imagem,
    }   
    
    try {
        const response = await fetch('/api/rota', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(perfilData),
    });
        if (!response.ok) {
            throw new Error('Erro ao salvar perfil');
        }
        alert('Perfil salvo com sucesso!');
        setModoEdicao(false);
    } catch (error) {
        console.error('Erro ao salvar perfil:', error);
        alert('Erro ao salvar perfil. Tente novamente mais tarde.');
    }
};

useEffect(() => {
    const buscarCatalogo = async () => {
        try{

            const response = await fetch('/api/rota');
            const data = await response.json();
            setCatalogo(data);
        }catch (error) {
            console.error("Erro ao buscar catalogo:", error);
        }
    };
    buscarCatalogo();
}, []);

    const selecionarImagem = async () => {
        const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if(!modoEdicao){
            alert("Para selecionar uma imagem, ative o modo de edição.");
            return;
        }

        if (status !== "granted"){
            alert("Permissão para acessar a galeria é necessária!");
            return;
        }
     const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
    });
    if (!result.canceled){
        setImagem(result.assets[0].uri);
    }
};


    return(
<View>
    <View>
            <Pressable onPress={selecionarImagem}>
                {imagem ? (
                    <Image source={{uri: imagem}} style={{width:200, height:200}}/>
                ) : (
                    <Text>Selecione uma imagem de perfil</Text>
                )}
            </Pressable>
            <TextInput
            value={nomeloja}
            onChangeText={setNomeloja}
            placeholder="Nome da Loja"
            editable={modoEdicao}
            />{/*Nome da confeiteira ou loja*/}
            <TextInput
            value={horarioInicio}
            onChangeText={(text)=> {
                const numericText = text.replace(/[^0-9:]/g, "");

                if(numericText.length >2){
                    const formattedText = numericText.slice(0,2) + ":" + numericText.slice(2,4);
                    setHorarioInicio(formattedText);
                }else{
                    setHorarioInicio(numericText);
                }
            }}
            placeholder="Horario de Abertura (ex: 07:00)"
            keyboardType="numeric"
            editable={modoEdicao}
            />
            <TextInput
            value={horarioFim}
            onChangeText={setHorarioFim}
            placeholder="Horario de Fechamento (ex: 18:00)"
            keyboardType="numeric"
            editable={modoEdicao}
            />{/* *Horarios de funcionamento* */}
            <TextInput
            value={descricao}
            onChangeText={setDescricao}
            placeholder="Descrição da Loja"
            multiline 
            maxLength={250}
            editable={modoEdicao}
            />{/* *Descrição da confeiteira ou loja*/}
            <Button title={modoEdicao ? "Salver " : "Editar Perfil"}
            onPress={modoEdicao ? salvarPerfil : () => setModoEdicao(!modoEdicao)}/>
            
    </View> 
    
    <View>
  <Text>Catálogo</Text>
  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
    {catalogo.map((bolo, index) => (
      <View key={index}>
        <Image source={{ uri: bolo.imagem }} style={{ width: 100, height: 100 }} />
        <Text>Nome: {bolo.nome}</Text>
        <Text>Descrição: {bolo.descricao}</Text>
        <Text>Preço: {bolo.preco}</Text>
        <Text>Sabor: {bolo.sabor}</Text>
        <Text>Tipo: {bolo.tipo}</Text> {/* Exibe o tipo do bolo */}
      </View>
    ))}
  </ScrollView>

  <Button title="Adicionar Bolo" onPress={onPress} />
</View>

</View>
    )
}