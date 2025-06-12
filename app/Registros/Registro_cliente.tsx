import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, Platform, Pressable, StyleSheet } from 'react-native';
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
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Cliente</Text>

      <Text style={styles.label}>Nome:</Text>
      <TextInput
        value={formData.nome}
        onChangeText={(text) => handleChange('nome', text)}
        placeholder="Digite seu nome"
        style={styles.input}
      />

      <Text style={styles.label}>Email:</Text>
      <TextInput
        value={formData.email}
        onChangeText={(text) => handleChange('email', text)}
        placeholder="Digite seu email"
        keyboardType="email-address"
        style={styles.input}
      />

      <Text style={styles.label}>Telefone:</Text>
      <TextInput
        value={formData.telefone}
        onChangeText={(text) => handleChange('telefone', text.replace(/[^0-9]/g, ''))}
        placeholder="(99) 99999-9999"
        keyboardType="phone-pad"
        style={styles.input}
      />

      <Text style={styles.label}>Endereço:</Text>
      <TextInput
        value={formData.endereco}
        onChangeText={(text) => handleChange('endereco', text)}
        placeholder="Rua, número, bairro"
        style={styles.input}
      />

      <Text style={styles.label}>Data de Nascimento:</Text>
      {Platform.OS === "web" ? (
        <input
          type="date"
          value={formData.datanascimento}
          onChange={e => handleChange('datanascimento', e.target.value)}
          style={{ ...styles.input, padding: 8 }}
        />
      ) : (
        <>
          <Pressable onPress={() => setShowDatePicker(true)} style={styles.dateInput}>
            <Text style={formData.datanascimento ? styles.dateText : styles.placeholderText}>
              {formData.datanascimento || 'Selecionar data'}
            </Text>
          </Pressable>
          {showDatePicker && (
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
          )}
        </>
      )}

      <Text style={styles.label}>Senha:</Text>
      <TextInput
        value={formData.senha}
        onChangeText={(text) => handleChange('senha', text)}
        placeholder="Digite sua senha"
        secureTextEntry
        style={styles.input}
      />

      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Registrar</Text>
      </Pressable>
    </View>
  );
}

//estilo do app

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAF0F8',
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#D81B60',
    textAlign: 'center',
    marginBottom: 30,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    marginBottom: 15,
  },
  dateInput: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
  },
  placeholderText: {
    color: '#999',
    fontSize: 16,
  },
  dateText: {
    fontSize: 16,
    color: '#000',
  },
  button: {
    backgroundColor: '#D81B60',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
  },
});
