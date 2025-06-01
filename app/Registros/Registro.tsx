import { useRouter } from 'expo-router';
import { useState } from 'react';
import{ Button, Text, View }from 'react-native'


export default function(){
    const router = useRouter();

    return(
        <View>
            <Text>Escolha uma dessas Opções:</Text>
            <Button title='Confeiteira' onPress={()=> router.push('/Registros/Registro_confeiteira')}/>
            <Button title='Cliente'onPress={()=> router.push('/Registros/Registro_cliente')}/>
        </View>
    )
}
export function Cadastros(){
    const [formData, setFormData] = useState({
        
    })
}
