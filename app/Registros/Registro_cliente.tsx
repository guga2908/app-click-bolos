import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';


export default function registrarCliente(){
    const router = useRouter();
    const [registro, setRegistro] = useState('');
    const [registro2, setRegistro2] = useState('');
    const [registro3, setRegistro3] = useState('');
    const [registro4, setRegistro4] = useState('');
    const [registro5, setRegistro5] = useState('');
    const [registro6, setRegistro6] = useState('');
    
    const [liberar,setLiberar] = useState(false);

    const verificarCampos = ()=> {
      
        if(registro.trim()!=='' && registro2.trim()!=='' && registro3.trim()!=='' && registro4.trim()!=='' && registro5.trim()!=='' && registro6.trim()!==''){
            setLiberar(true);
        }else{
            setLiberar(false);
        }
    }

    return(
        <View>
        <Text>Nome Completo:</Text>
        <TextInput    
        value={registro}
        onChangeText={(texto)=>{
            setRegistro(texto)
            verificarCampos();
        }}/>
        <Text>E-mail:</Text>
        <TextInput
        value={registro2}
        onChangeText={(texto)=>{
            setRegistro2(texto)
            verificarCampos();
        }}/>
        <Text>Telefone:</Text>
        <TextInput
        value={registro3}
        onChangeText={(texto)=>{
            setRegistro3(texto)
            verificarCampos();
        }}/>
        <Text>Endereço:</Text>
        <TextInput
        value={registro4}
        onChangeText={(texto)=>{
            setRegistro4(texto)
            verificarCampos();
        }}/>
        <Text>data de nascimento:</Text>
        <TextInput
        value={registro5}
        onChangeText={(texto)=>{
            setRegistro5(texto)
            verificarCampos();
        }}/>
        <Text>senha:</Text>
        <TextInput
        value={registro6}
        onChangeText={(texto)=>{
            setRegistro6(texto)
            verificarCampos();
        }}/>
        <Button title='Registrar' disabled={!liberar}/>
        <Button title='Voltar' onPress={()=>router.push('/Registros/Registro')}/>
       </View>
       
    )
}