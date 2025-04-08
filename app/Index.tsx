import { useRouter } from "expo-router";
import { Button, Text, View } from "react-native";

export default function Tela_De_Seleção(){
    const router = useRouter();
/* talves nao precise mudar mais essa pagina */
    return(
        <View>
            <Button title="Confeiteira" onPress={()=>router.push('../Login_Confeiteira')}/>
            <Button title="Cliente" onPress={()=> router.push('/Login_Cliente')}/>
            <Button title="Registrar" onPress={()=> router.push('/Registros/Registro')}/>
        </View>
    )
}
