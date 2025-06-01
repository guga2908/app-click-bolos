import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, Platform, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import  DatePicker from  "react-datepicker" ;

export default function RegistroCliente() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    endereco: '',
    datanascimento: '', // formato YYYY-MM-DD
    senha: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState<Date>(new Date());

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
      // Salva no formato YYYY-MM-DD
      const iso = selectedDate.toISOString().split('T')[0];
      handleChange('datanascimento', iso);
    }
  };

  const handleSubmit = async () => {
    if (
      !formData.nome ||
      !formData.email ||
      !formData.telefone ||
      !formData.endereco ||
      !formData.datanascimento ||
      !formData.senha
    ) {
      Alert.alert('Preencha todos os campos!');
      return;
    }

    try {
      const response = await fetch('http://localhost:8081/registrar-cliente', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        Alert.alert(errorData.error || 'Erro desconhecido');
        return;
      }
      const result = await response.json();
      Alert.alert('Cliente registrado com sucesso!');
      router.push(`../Usuario/perfil/${result.id}`);
    } catch (error) {
      Alert.alert('Erro ao registrar cliente.');
      console.error(error);
    }
  };

  function indetificarTexto(name: string, value: string) {
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  return (
    <View style={{ padding: 20 }}>
      <Text>Nome:</Text>
      <TextInput
        value={formData.nome}
        onChangeText={(text) => handleChange('nome', text)}
        placeholder="Nome"
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />
      <Text>Email:</Text>
      <TextInput
        value={formData.email}
        onChangeText={(text) => handleChange('email', text)}
        placeholder="Email"
        keyboardType="email-address"
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />
      <Text>Telefone:</Text>
      <TextInput
        value={formData.telefone}
        onChangeText={(text) => handleChange('telefone', text.replace(/[^0-9]/g, ""))}
        placeholder="Telefone"
        keyboardType="phone-pad"
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />
      <Text>Endereço:</Text>
      <TextInput
        value={formData.endereco}
        onChangeText={(text) => handleChange('endereco', text)}
        placeholder="Endereço"
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />
      <Text>Data de Nascimento:</Text>
      <DatePicker 
        selected={date} 
        onChange={(data) => {
          if (data) {
            setDate(data);
            indetificarTexto('datanascimento', data.toISOString().split('T')[0]);
          } else {
            setDate(new Date());
          }
        }}
      />
      <Text>Senha:</Text>
      <TextInput
        value={formData.senha}
        onChangeText={(text) => handleChange('senha', text)}
        placeholder="Senha"
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />
      <Button title="Registrar" onPress={handleSubmit} />
    </View>
  );
}