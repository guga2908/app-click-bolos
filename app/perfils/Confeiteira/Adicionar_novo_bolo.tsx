import React, { useState, useEffect } from "react";
import { Button, Image, Text, TextInput, View, Platform, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function AdicionarBolos() {
  const router = useRouter();
  const {id} = useLocalSearchParams();
  console.log("ID da confeiteira:", id);
  const [nomeBolo, setNomeBolo] = useState("");
  const [descricaoBolo, setDescricaoBolo] = useState("");
  const [imagem, setImagem] = useState<string | null>(null);
  const [valorBolo, setValorBolo] = useState("");
  const [pesoBolo, setPesoBolo] = useState("");
  const [saborBolo, setSaborBolo] = useState("");
  const [imagemArquivo, setImagemArquivo] = useState<File | null>(null);
  const [catalogo, setCatalogo] = useState<any[]>([]);

  useEffect(() => {
    const fetchCatalogo = async () => {
      try {
        const resposta = await fetch(`http://localhost:8081/confeiteira/${id}/bolo`);
        const data = await resposta.json();
        setCatalogo(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Erro ao buscar catálogo:", error);
      }
    };

    fetchCatalogo();
  }, [id]);

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
      mediaTypes: 'images',
      allowsEditing: true,
      quality: 1
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setImagem(uri);
    }
  };

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImagemArquivo(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagem(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const adicionarBolo = async () => {
    if (!nomeBolo || !descricaoBolo || !imagem || !valorBolo || !pesoBolo || !saborBolo ) {
      alert("Preencha todos os campos e selecione uma imagem!");
      return;
    }

    const formData = new FormData();
    formData.append('nome', nomeBolo);
    formData.append('descricao', descricaoBolo);
    formData.append('preco', valorBolo);
    formData.append('peso', pesoBolo);
    formData.append('sabor', saborBolo);

    if (Platform.OS === "web") {
      // No web, envie o arquivo real
      if (imagemArquivo) {
        formData.append('imagem', imagemArquivo);
      } else {
        alert("Selecione uma imagem!");
        return;
      }
    } else {
      // No mobile, envie o objeto { uri, name, type }
      if (imagem) {
        const filename = imagem.split('/').pop();
        const match = /\.(\w+)$/.exec(filename ?? '');
        const type = match ? `image/${match[1]}` : `image`;

        formData.append('imagem', {
          uri: imagem,
          name: filename ?? 'photo.jpg',
          type: type,
        } as any);
      } else {
        alert("Selecione uma imagem!");
        return;
      }
    }

    try {
      const response = await fetch(`http://localhost:8081/confeiteira/${id}/bolo`, {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Erro do backend:", errorData);
        throw new Error("Erro ao adicionar bolo");
      }

      alert("Bolo adicionado com sucesso!");
      router.push(`./Confeiteira/perfilConfeiteiras/${id}`);

    } catch (error) {
      console.error("Erro ao adicionar bolo:", error);
      alert("Erro ao adicionar bolo.");
    }
  }

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
        onChangeText={text => setValorBolo(text.replace(/[^0-9.]/g, ""))}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Peso do Bolo"
        value={pesoBolo}
        onChangeText={text => setPesoBolo(text.replace(/[^0-9.]/g, ""))}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Sabor do Bolo"
        value={saborBolo}
        onChangeText={setSaborBolo}
      />
      <Text>Selecione uma imagem do bolo:</Text>
      {Platform.OS === "web" ? (
        <input type="file" accept="image/*" onChange={handleFileInputChange} />
      ) : (
        <Button title="Selecionar Imagem" onPress={selecionarImagem} />
      )}
      {imagem && <Image source={{ uri: imagem }} style={{ width: 200, height: 200 }} />}
      <Button title="Adicionar Bolo ao Catálogo" onPress={adicionarBolo} />
      <Button title="Cancelar" onPress={() => router.push(`/perfils/Confeiteira/${id}`)} />
    </View>
  );
}
