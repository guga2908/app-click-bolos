import React, { useState } from "react";
import { Button, Image, Text, TextInput, View } from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import * as FileSystem from "expo-file-system";

export default function AdicionarBolos() {
  const router = useRouter();
  const [nomeBolo, setNomeBolo] = useState("");
  const [descricaoBolo, setDescricaoBolo] = useState("");
  const [imagem, setImagem] = useState<string | null>(null);
  const [valorBolo, setValorBolo] = useState("");
  const [pesoBolo, setPesoBolo] = useState("");
  const [saborBolo, setSaborBolo] = useState("");
  const [tipoBolo, setTipoBolo] = useState(""); // Estado para o tipo do bolo

  const selecionarImagem = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permissão para acessar a galeria é necessária!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
      base64: false,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;

      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      console.log("Base64:", base64);
      setImagem(base64);
    }
  };

  const adicionarBolo = async () => {
    if (!nomeBolo || !descricaoBolo || !imagem || !valorBolo || !pesoBolo || !saborBolo || !tipoBolo) {
      alert("Preencha todos os campos e selecione uma imagem!");
      return;
    }

    const boloData = {
      valor: valorBolo,
      nome: nomeBolo,
      descricao: descricaoBolo,
      imagem: imagem,
      peso: pesoBolo,
      sabor: saborBolo,
      tipo: tipoBolo,
    };

    try {
      const response = await fetch("api/rota", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: JSON.stringify(boloData),
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
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Peso do Bolo"
        value={pesoBolo}
        onChangeText={setPesoBolo}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Sabor do Bolo"
        value={saborBolo}
        onChangeText={setSaborBolo}
      />
      <Text>Selecione o Tipo do Bolo:</Text>
      <Picker
        selectedValue={tipoBolo}
        onValueChange={(itemValue: string) => setTipoBolo(itemValue)}
        style={{ height: 50, width: 200 }}
      >
        <Picker.Item label="Selecione o tipo" value="" />
        <Picker.Item label="Aniversário" value="aniversario" />
        <Picker.Item label="Casamento" value="casamento" />
        <Picker.Item label="Simples" value="simples" />
        <Picker.Item label="Personalizado" value="personalizado" />
      </Picker>
      <Text>Selecione uma imagem do bolo:</Text>
      <Button title="Selecionar Imagem" onPress={selecionarImagem} />
      {imagem && <Image source={{ uri: imagem }} style={{ width: 200, height: 200 }} />}
      <Button title="Adicionar Bolo ao Catálogo" onPress={adicionarBolo} />
      <Button title="Cancelar" onPress={() => router.push("/Confeiteira/perfil_confeiteira")} />
    </View>
  );
}