import { useRouter } from "expo-router";
import { useState } from "react";
import { Button, Text, TextInput, View } from "react-native";




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
            <TextInput
            value={formData.registro}
            onChangeText={(text)=>{indetificarTexto('registro', text)}}/>
            <Text>Nome da empresa:</Text>
            <TextInput
            value={formData.registro2}
            onChangeText={(text)=>{indetificarTexto('registro2', text)}}/>
            <Text>Telefone:</Text>
            <TextInput
            value={formData.registro3}
            onChangeText={(text)=>{indetificarTexto('registro3', text)}}/>
            <Text>Endereço:</Text>
            <TextInput
            value={formData.registro4}
            onChangeText={(text)=>{indetificarTexto('registro4', text)}}/>
            <Text>Data de Nascimento:</Text>
            <TextInput
            value={formData.registro5}
            onChangeText={(text)=>{indetificarTexto('registro5', text)}}/>
            <Text>E-mail:</Text>
            <TextInput
            value={formData.registro6}
            onChangeText={(text)=>{indetificarTexto('registro6', text)}}/>
            <Text>Senha:</Text>
            <TextInput  
            value={formData.registro7}
            onChangeText={(text)=>{indetificarTexto('registro7', text)}}/>

          <Button title='Registrar' disabled={!liberar} onPress={()=>{router.push('/Confeiteira/perfil_confeiteira')}}/>
        <Button title='Voltar' onPress={()=>{router.push('/Registros/Registro') }}/>
        </View>
    )
}