import { useRouter } from "expo-router";
import { useState } from "react";
import { Button, Text, TextInput, TouchableOpacity, View } from "react-native";
import  DatePicker from  "react-datepicker" ;
import "react-datepicker/dist/react-datepicker.css";


export default function registrarConfeiteira(){
  
    /*tive uma dicas de como prosseguir e qual caminho devo pegar este aplicativo tera como 
    cliente final o usuario e nao a boleira / confeiteira devo seguir esta linha de raciocinio e
    criar um aplicativo que seja mais voltado para o usuario final e nao para a boleira / confeiteira
    mais nao devo neglegir a boleira / confeiteira pois ela sera a pessoa que ira cadastrar os bolos e o usuario final
    */

    //parte de regitro de confeiteira finalizada  possivei adiçoes de melhorias
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
    const indetificarTexto = (registro: string, valor: string) =>{
        setFormData((prevState) => {
            const newFormData = {...prevState,[registro]:valor};
            const TodososRegistro = Object.values(newFormData).every((item)=>item.trim()!== '');
            setLiberar(TodososRegistro);
            return newFormData;
        })
    }
    const RegistrarConf = async () => {
        try{
            const Confdata: Confeiteira = {
                ...formData,
                datanascimento: data,
            }
            const response = await fetch('/api/rota', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(Confdata),
            });
            if (!response.ok) {
                throw new Error('Erro ao registrar confeiteira');
            }
            alert('Confeiteira registrada com sucesso!');
            router.push('/Confeiteira/perfil_confeiteira')
        }catch (error) {
            alert(error || 'Erro ao registrar confeiteira.');
            console.error(error);
            alert('Erro ao registrar confeiteira.');
        }
    }
       
    return(
        <View>
            <Text>Nome Completo:</Text>
            <TextInput
            value={formData.nome}
            onChangeText={(text)=>{indetificarTexto('nome', text)}}
            />
            <Text>Nome da empresa:</Text>
            <TextInput
            value={formData.nomeloja}
            onChangeText={(text)=>{indetificarTexto('nomeloja', text)}}/>
            <Text>Telefone:</Text>
            <TextInput
            value={formData.telefone}
            onChangeText={(text)=>{indetificarTexto('telefone', text)}}/>
            <Text>Endereço:</Text>
            <TextInput
            value={formData.endereco}
            onChangeText={(text)=>{indetificarTexto('endereco', text)}}/>
            <Text>Data de Nascimento:</Text>
            <DatePicker 
            selected={data} 
            onChange={(data) => {
                 if (data){ setData(data);
                    indetificarTexto('datanascimento', data.toString())}
                else {setData(new Date())}
                  }}/>
            {/* <TextInput
            value={formData.datanascimento}
            onChangeText={(text)=>{indetificarTexto('datanascimento', text)}}/> */}
            <Text>E-mail:</Text>
            <TextInput
            value={formData.email}
            onChangeText={(text)=>{indetificarTexto('email', text)}}/>
            <Text>Senha:</Text>
            <TextInput  
            value={formData.senha}
            onChangeText={(text)=>{indetificarTexto('senha', text)}}/>
        <Button title='Registrar' onPress={RegistrarConf} disabled={!liberar}/>
        <Button title='Voltar' onPress={()=>{router.push('/Registros/Registro') }}/>
        </View>
    )
}