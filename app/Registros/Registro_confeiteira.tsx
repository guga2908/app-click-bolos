import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TextInput, View } from "react-native";




export default function registrarConfeiteira(){
    const router = useRouter();
    const [formData, setFormData] = useState({
        registro :'',
        registro2 :'',
        registro3 :'',
        registro4 :'',
        registro5 :'',
        registro6 :'',
        registro7 :''
    });
    const [liberar, setLiberar] = useState(false);
    const indetificarTexto = (registro: string, valor: string) =>{
        setFormData((prevState) => {
            const newFormData = {...prevState,[registro]:valor};
            const TodososRegistro = Object.values(newFormData).every((item)=>item.trim()!== '');
            setLiberar(TodososRegistro);
            return newFormData;
        })
    }
    return(
        <View>
            <Text>Nome Completo:</Text>
            <TextInput/>
            <Text>Nome da empresa:</Text>
            <TextInput/>
            <Text>Telefone:</Text>
            <TextInput/>
            <Text>Endereço:</Text>
            <TextInput/>
            <Text>Data de Nascimento:</Text>
            <TextInput/>
            <Text>E-mail:</Text>
            <TextInput/>
            <Text>Senha:</Text>
            <TextInput/>
        </View>
    )
}