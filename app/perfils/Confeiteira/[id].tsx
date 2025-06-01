import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Button, Image, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
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
    const [imagemArquivo, setImagemArquivo] = useState<File | null>(null);
    const {id} = useLocalSearchParams();
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
    
const onPress = () => (router.push(`./Confeiteira/Adicionar_novo_bolo?id=${id}`));

const validarHorario = (horario: string) => {
    const regex = /^(0[0-9]|1[0-9]|2[0-3]):([0-5][0-9])$/
    return regex.test(horario);
};
useEffect(() => {
    const buscarDadosConfeiteira = async () => {
        try{
            const perfilResponse = await fetch(`http://localhost:8081/confeiteira/${id}`);
            const perfilData = await perfilResponse.json();
            setNomeloja(perfilData.nomeloja || "");
            setHorarioInicio(perfilData.horarioInicio || "");
            setHorarioFim(perfilData.horarioFim || ""); 
            setDescricao(perfilData.descricao || "");
            setImagem(perfilData.imagem ? `http://localhost:8081${perfilData.imagem}` : null);
            console.log("Imagem recebida do backend:", perfilData.imagem);
            
            const catalogoResponse = await fetch(`http://localhost:8081/confeiteira/${id}/catalogo`);
            const catalogoData = await catalogoResponse.json();
            setCatalogo(catalogoData || []);
        }catch (error) {
            console.error("Erro ao buscar dados da confeiteira:", error);
        }
    };
    buscarDadosConfeiteira();
},[]);
const handleFileInputChange=(event: React.ChangeEvent<HTMLInputElement>)=>{
    const file = event.target.files?.[0];
    if(file){
        setImagemArquivo(file);
        const reader = new FileReader();
        reader.onload = () =>{
            setImagem(reader.result as string);
        };
        reader.readAsDataURL(file);
    }
}
const selecionarImagem = async () => {
  if(Platform.OS === 'web'){
    alert("Use o campo abaixo para selecionar uma imagem no ambiente web.");
    return;
  }
  const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if(!modoEdicao){
    alert("Ative o modo de edição para selecionar uma imagem.");
    return;
  }
  if(status !== 'granted'){
    alert("Permissão para acessar a galeria é necessária!");
    return;
  }
 const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: 'images',
    allowsEditing: true,
    quality: 1,
});
if (!result.canceled){
    setImagem(result.assets[0].uri);
}
};

    const salvarPerfil = async () => {
     if(!validarHorario(horarioInicio)|| !validarHorario(horarioFim)){
        alert("Horário inválido. O horário deve estar no formato HH:MM.");
        return;
     }
     const formData = new FormData();
        formData.append("nomeloja", nomeloja);
        formData.append("horarioInicio", horarioInicio);
        formData.append("horarioFim", horarioFim);
        formData.append("descricao", descricao);
    if(imagem && !imagem.startsWith('http')) {
        const filename = imagem.split("/").pop();
        const match = /\.(\w+)$/.exec(filename ?? '');
        const type = match ? `image/${match[1]}` : `image`;

        formData.append('imagem', {
            uri: imagem,
            name: filename ?? 'photo.jpg',
            type: type
        } as any); // 'as any' is needed for React Native FormData compatibility
    }
    try{
        const response = await fetch(`http://localhost:8081/confeiteira/${id}`, {
            method: 'PUT',
            // NÃO coloque headers: {'Content-Type': ...}
            body: formData,
        });
        if(!response.ok){
            throw new Error("Erro ao salvar perfil");
        }
        alert("Perfil salvo com sucesso!");
        setModoEdicao(false);
    }catch(error){
        console.error("Erro ao salvar perfil:", error);
        alert("Erro ao salvar perfil. Tente novamente.");
    }
};

useEffect(() => {
    const buscarCatalogo = async () => {
        try{

            const catalogoResponse = await fetch(`http://localhost:8081/confeiteira/${id}/catalogo`);
            const data = await catalogoResponse.json();
            setCatalogo(data);
        }catch (error) {
            console.error("Erro ao buscar catalogo:", error);
        }
    };
    buscarCatalogo();
}, []);



    return(
<View>
    <View>
        {Platform.OS === "web" && modoEdicao ?(
            <input type = "file" accept="image/*" onChange={handleFileInputChange}/>
        ):(
            <Pressable onPress={selecionarImagem}>
                {imagem ? (
                    <Image
                      source={{ uri: imagem }}
                      style={{ width: 200, height: 200 }}
                      resizeMode="cover"
                    />
                ) : (
                    <Text>Selecione uma imagem de perfil</Text>
                )}
            </Pressable>
    )}
            <TextInput
            value={nomeloja}
            onChangeText={setNomeloja}
            placeholder="Nome da Loja"
            editable={modoEdicao}
            />{/*Nome da confeiteira ou loja*/}
            <TextInput
            value={horarioInicio}
            onChangeText={(text)=> {
              let cleaned = text.replace(/\D/g, "");
                if(cleaned.length >4){cleaned = cleaned.slice(0, 4);}
            let formatted = cleaned
            if(cleaned.length > 2){
                formatted = cleaned.slice(0, 2) + ":" + cleaned.slice(2); 
            }
            setHorarioInicio(formatted);
            }}
            placeholder="Horario de Abertura (ex: 07:00)"
            keyboardType="numeric"
            editable={modoEdicao}
            />
            <TextInput
            value={horarioFim}
            onChangeText={(text)=> {
                let cleaned = text.replace(/\D/g, "");
                if(cleaned.length >4){cleaned = cleaned.slice(0, 4);}
                let formatted = cleaned
                if(cleaned.length > 2){
                    formatted = cleaned.slice(0, 2) + ":" + cleaned.slice(2); 
                }
                setHorarioFim(formatted);
            }}
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