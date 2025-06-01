import { useRouter } from "expo-router";
import { Button, View } from "react-native";

export default function index(){
    const router = useRouter();
/* talves nao precise mudar mais essa pagina */
    return(
        <View>
            <Button title="Confeiteira" onPress={()=>router.push('/Registros/Login_Confeiteira')}/>
            <Button title="Cliente" onPress={()=> router.push('/Registros/Login_Cliente')}/>
            <Button title="Registrar" onPress={()=> router.push('/Registros/Registro')}/>
        </View>
    )
}
    