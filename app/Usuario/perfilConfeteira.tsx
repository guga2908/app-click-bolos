import { useRouter } from "expo-router";
import { FlatList, Image, Pressable, Text, View } from "react-native";




export default function perfilConfeteira (){


    return(
        <View>
            <View>
                <Image/>
                <Text>Nome da loja</Text>
            </View>
            <Text>Horarios:</Text>
            <Text>Descrição Boleira</Text>

            <View>
               <Pressable>
                <FlatList/>
               </Pressable>
            </View>
        </View>
    )
}