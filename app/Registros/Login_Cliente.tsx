import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Button, Text, TextInput, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Login_Usuarios(){
    /*Conectar essa pagina no banco de dados para ela funcionar da maneira correta*/
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const indentificarlogin = async () => {
        try {
        console.log('Email:', email);
        console.log('Senha:', senha);
            const cliente = await fetch('http://localhost:8081/login-cliente', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, senha }), 
        });
            if (!cliente.ok) {
                const errorData = await cliente.json();
                Alert.alert("Erro ao fazer login", errorData.error || "Erro desconhecido");
                return;
            }
            const data = await cliente.json();
            Alert.alert('Login realizado', `ID do cliente: ${data.id}`);
            await AsyncStorage.setItem('clienteId', String(data.id));
            router.push('../perfils/Usuario/perfil');
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            Alert.alert('Erro ao fazer login', 'Verifique suas credenciais e tente novamente');
        }
    }
    

    return(
        <View>
            <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder='Email'
            keyboardType='email-address'
            />
            <TextInput
            value={senha}
            onChangeText={setSenha}
            placeholder='Senha'
            secureTextEntry
            />
            <Button title='Entrar' onPress={indentificarlogin}/>
        </View>
        )
    }
