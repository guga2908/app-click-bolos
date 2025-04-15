import React, { useState } from "react";
import { Button, Image, Text, TextInput, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
 /*tive uma dicas de como prosseguir e qual caminho devo pegar este aplicativo tera como 
    cliente final o usuario e nao a boleira / confeiteira devo seguir esta linha de raciocinio e
    criar um aplicativo que seja mais voltado para o usuario final e nao para a boleira / confeiteira
    mais nao devo neglegir a boleira / confeiteira pois ela sera a pessoa que ira cadastrar os bolos e o usuario final
    */

/* Aki a Confeiteira ira adicionar um novo bolo para o catalogo dela com o nome, imagen e uma breve descreição do bolo
oque falta fazer?
    - adicionar uma imagem do bolo(feito)
    - adicionar um botão para cancelar a adição do bolo(feito)
    - adicionar um botão para voltar para o perfil da confeiteira(feito)
    - adicionar um botão para adicionar o bolo ao catalogo(feito)
    acrefito que nao falta mais nada aki talves falta adicionar um loading para quando o bolo estiver sendo adicionado
    - adicionar um loading para quando o bolo estiver sendo adicionado(opcional)
*/

export default function AdicionarBolos() {
  const router = useRouter();
  const [nomeBolo, setNomeBolo] = useState("");
  const [descricaoBolo, setDescricaoBolo] = useState("");
  const [imagem, setImagem] = useState<string | null>(null);
  const [valorBolo, setValorBolo] = useState("");

  const selecionarImagem = async () => {
    // Solicitar permissão para acessar a galeria
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permissão para acessar a galeria é necessária!");
      return;
    }

    // Abrir o seletor de imagens
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImagem(result.assets[0].uri); // Salvar o URI da imagem selecionada
    }
  };

  const adicionarBolo = async () => {
    if (!nomeBolo || !descricaoBolo || !imagem || !valorBolo) {
      alert("Preencha todos os campos e selecione uma imagem!");
      return;
    }

    const formData = new FormData();
    formData.append("valor", valorBolo);
    formData.append("nome", nomeBolo);
    formData.append("descricao", descricaoBolo);
    formData.append("imagem", {
      uri: imagem,
      name: "bolo.jpg",
      type: "image/jpeg",
    } as any);

    try {
      const response = await fetch("api/rota", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erro ao adicionar bolo");
      }

      alert("Bolo adicionado com sucesso!");
      router.push("/Confeiteira/perfil_confeiteira");
    } catch (error) {
      console.error(error);
      alert("Erro ao adicionar bolo.");
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Nome do Bolo"
        value={nomeBolo}
        onChangeText={setNomeBolo}
      />
      <TextInput
        placeholder="Descrição do Bolo"
        value={descricaoBolo}
        onChangeText={setDescricaoBolo}
      />
      <TextInput
      placeholder="Valor do Bolo"
      value={valorBolo}
      onChangeText={setValorBolo}
      />
        <Text>Selecione uma imagem do bolo:</Text>
      <Button title="Selecionar Imagem" onPress={selecionarImagem} />
      {imagem && <Image source={{ uri: imagem }} style={{ width: 200, height: 200 }} />}
      <Button title="Adicionar Bolo ao Catálogo" onPress={adicionarBolo} />
      <Button title="Cancelar" onPress={() => router.push("/Confeiteira/perfil_confeiteira")} />
    </View>
  );
}