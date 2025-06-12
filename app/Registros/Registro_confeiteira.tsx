import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Button,
  Text,
  TextInput,
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Tipo para confeiteira
interface Confeiteira {
  nome: string;
  nomeloja: string;
  telefone: string;
  endereco: string;
  datanascimento: Date | string;
  email: string;
  senha: string;
}

export default function RegistrarConfeiteira() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nome: '',
    nomeloja: '',
    telefone: '',
    endereco: '',
    datanascimento: '',
    email: '',
    senha: '',
  });

  const [data, setData] = useState(new Date());
  const [liberar, setLiberar] = useState(false);

  const indetificarTexto = (registro: string, valor: string) => {
    setFormData((prevState) => {
      const newFormData = { ...prevState, [registro]: valor };
      const TodososRegistro = Object.values(newFormData).every(
        (item) => item.trim() !== ''
      );
      setLiberar(TodososRegistro);
      return newFormData;
    });
  };

  const formatarData = (data: Date) => data.toISOString().split('T')[0];

  const RegistrarConf = async () => {
    try {
      const Confdata: Confeiteira = {
        ...formData,
        datanascimento: formatarData(data),
      };

      const response = await fetch('http://localhost:8081/registrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(Confdata),
      });

      if (!response.ok) {
        const errorData = await response.json();
        Alert.alert(errorData.error || 'Erro desconhecido');
        return;
      }

      const result = await response.json();
      Alert.alert('Confeiteira registrada com sucesso!');
      router.push(`../perfils/Confeiteira/perfilConfeiteiras/${result.id}`);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro ao registrar confeiteira.');
    }
  };



  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Cadastro da Confeiteira</Text>

      <Text style={styles.label}>Nome Completo:</Text>
      <TextInput
        style={styles.input}
        value={formData.nome}
        onChangeText={(text) => indetificarTexto('nome', text)}
        placeholder="Digite seu nome completo"
      />

      <Text style={styles.label}>Nome da empresa:</Text>
      <TextInput
        style={styles.input}
        value={formData.nomeloja}
        onChangeText={(text) => indetificarTexto('nomeloja', text)}
        placeholder="Nome da loja"
      />

      <Text style={styles.label}>Telefone:</Text>
      <TextInput
        style={styles.input}
        value={formData.telefone}
        onChangeText={(text) => indetificarTexto('telefone', text)}
        placeholder="(99) 99999-9999"
        keyboardType="phone-pad"
      />

      <Text style={styles.label}>Endereço:</Text>
      <TextInput
        style={styles.input}
        value={formData.endereco}
        onChangeText={(text) => indetificarTexto('endereco', text)}
        placeholder="Rua, número, bairro"
      />

      <Text style={styles.label}>Data de Nascimento:</Text>
      <View style={styles.datePickerContainer}>
        <DatePicker
          selected={data}
          onChange={(date) => {
            if (date) {
              setData(date);
              indetificarTexto('datanascimento', date.toISOString());
            } else {
              setData(new Date());
            }
          }}
          dateFormat="dd/MM/yyyy"
          placeholderText="Selecione a data"
          className="datepicker" // você pode usar um estilo externo se preferir
        />
      </View>

      <Text style={styles.label}>E-mail:</Text>
      <TextInput
        style={styles.input}
        value={formData.email}
        onChangeText={(text) => indetificarTexto('email', text)}
        placeholder="exemplo@email.com"
        keyboardType="email-address"
      />

      <Text style={styles.label}>Senha:</Text>
      <TextInput
        style={styles.input}
        value={formData.senha}
        onChangeText={(text) => indetificarTexto('senha', text)}
        placeholder="Crie uma senha"
        secureTextEntry
      />

      <Button
        title="Registrar"
        onPress={RegistrarConf}
        disabled={!liberar}
        color="#D81B60"
      />
    </ScrollView>
  );
}

//estilo do app


const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#FFF8F0',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    color: '#D81B60',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#FFF',
    borderColor: '#CCC',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
  datePickerContainer: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
  },
});