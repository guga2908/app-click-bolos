import React, { useState, useEffect } from "react";
import { Button, Image, Text, TextInput, View, Platform, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";

export default function AdicionarBolos() {
  const router = useRouter();
  /* const [confeiteiraId, setConfeiteiraId] = useState<number | null>(null); */
  const [nomeBolo, setNomeBolo] = useState("");
  const [descricaoBolo, setDescricaoBolo] = useState("");
  const [imagem, setImagem] = useState<string | null>(null);
  const [valorBolo, setValorBolo] = useState("");
  const [pesoBolo, setPesoBolo] = useState("");
  const [saborBolo, setSaborBolo] = useState("");
  const [tipoBolo, setTipoBolo] = useState("");


  const selecionarImagem = async () => {
    if (Platform.OS === "web") {
      alert("Use o campo abaixo para selecionar uma imagem no ambiente web.");
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permissão para acessar a galeria é necessária!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImagem(uri);
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImagem(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const adicionarBolo = async () => {
    if (!nomeBolo || !descricaoBolo || !imagem || !valorBolo || !pesoBolo || !saborBolo || !tipoBolo) {
      alert("Preencha todos os campos e selecione uma imagem!");
      return;
    }

    const boloData = {
      nome: nomeBolo,
      descricao: descricaoBolo,
      imagem: imagem,
      preco: parseFloat(valorBolo),
      peso: pesoBolo,
      sabor: saborBolo,
      tipo: tipoBolo,
/*       confeiteiraId: confeiteiraId, */
    };

    console.log("Dados enviados para o backend:", boloData);

    try {
      const response = await fetch("/api/rota", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(boloData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erro do backend:", errorData);
        throw new Error("Erro ao adicionar bolo");
      }

      alert("Bolo adicionado com sucesso!");
      router.push("/Confeiteira/perfil_confeiteira");
    } catch (error) {
      console.error("Erro ao adicionar bolo:", error);
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
      {Platform.OS === "web" ? (
        <input type="file" accept="image/*" onChange={handleFileInputChange} />
      ) : (
        <Button title="Selecionar Imagem" onPress={selecionarImagem} />
      )}
      {imagem && <Image source={{ uri: imagem }} style={{ width: 200, height: 200 }} />}
      <Button title="Adicionar Bolo ao Catálogo" onPress={adicionarBolo} />
      <Button title="Cancelar" onPress={() => router.push("/Confeiteira/perfil_confeiteira")} />
    {/*   <Text>ID da Confeiteira: {confeiteiraId}</Text> */}
    </View>
  );
}
