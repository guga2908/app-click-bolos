import { useRouter } from "expo-router";
import { Image, Pressable, Text, TextInput, TouchableOpacity, View } from "react-native";



export default function telaPrincipalConfeiteiras(){
    const router = useRouter();

/** encorpar mais esse arquivo pedir dicar ou pesquisar oque colocar aki */
return(
        <View>
            <Pressable onPress={()=> router.push('/Confeiteira/perfil_confeiteira')}>
            <Image
           source={require('../../assets/images/')}
           style={{ width: 100, height: 100 }}/>
           </Pressable>
            <Text>Titulo</Text>
            <TextInput
            placeholder="Descrição"/>
            
        </View>
    )
}