import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native"

import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login_Boleira(){
        /* conectar essa pagina no banco de dados para ela funcionar da maneira correta*/

const router = useRouter();
const [email, setEmail] = useState('');
const [senha, setSenha] = useState('');
const [loading, setLoading] = useState(false);

const identificarlogin = async () => {
    if(!email || !senha){
        Alert.alert('Preencha todos os campos');
        return;
    }
    setLoading(true);
    try {
        const response = await fetch('http://26.41.136.188:8081/servicos/rota/loginConf', {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, senha }),
        });

        if (!response.ok) {
            throw new Error('Erro ao fazer login');
        }

        const { token, id, nomeloja } = await response.json();
        await AsyncStorage.setItem('token', token);
      // Salvar o token no armazenamento local (opcional)
      // Você pode usar AsyncStorage ou SecureStore
      // Exemplo com AsyncStorage:
      // await AsyncStorage.setItem("token", token);
      Alert.alert('Login realizado com sucesso');
      router.push('/Confeiteira/perfil_confeiteira');
}catch (error) {
    console.error("Erro ao fazer login:", error);
    Alert.alert('Erro ao fazer login', 'Verifique suas credenciais e tente novamente');
} finally {
    setLoading(false);  
}
};

return(
    <View>
        <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"/>

        <TextInput
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        />
        <Button title={loading ? "Carregando...":"Entrar"} onPress={identificarlogin} disabled={loading}/>
        <Button title='Voltar' onPress={()=> router.push('/Index')}/>
    </View>
)

}