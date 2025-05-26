import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Button, Text, TextInput, View } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login_Boleira(){
        /* conectar essa pagina no banco de dados para ela funcionar da maneira correta*/

const router = useRouter();
const [email, setEmail] = useState('');
const [senha, setSenha] = useState('');

const indentificarlogin = async () => {
    try{
        console.log('Email:', email);
        console.log('Senha:', senha);
        const confeiteira = await fetch('http://localhost:8081/login', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, senha }),
        });
        if (!confeiteira.ok) {
            const errorData = await confeiteira.json();
            Alert.alert("Erro ao fazer login", errorData.error || "Erro desconhecido");
            return;
        }
        const data = await confeiteira.json();
        await AsyncStorage.setItem("confeiteiraId", data.id);
        Alert.alert('Login realizado', `ID da confeiteira: ${data.id}`);
         router.push(`./Confeiteira/perfilConfeiteiras/${data.id}`);
    }catch (error) {
        console.error("Erro ao fazer login:", error);
        Alert.alert('Erro ao fazer login', 'Verifique suas credenciais e tente novamente');
}
}

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
        <Button title={"Entrar"} onPress={indentificarlogin}/>
        <Button title='Voltar' onPress={()=> router.push('./index')}/>
    </View>
)
}