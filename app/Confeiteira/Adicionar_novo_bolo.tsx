import { Button, Text, TextInput, View } from "react-native";
import { router, useRouter } from "expo-router";
 /*tive uma dicas de como prosseguir e qual caminho devo pegar este aplicativo tera como 
    cliente final o usuario e nao a boleira / confeiteira devo seguir esta linha de raciocinio e
    criar um aplicativo que seja mais voltado para o usuario final e nao para a boleira / confeiteira
    mais nao devo neglegir a boleira / confeiteira pois ela sera a pessoa que ira cadastrar os bolos e o usuario final
    */

/* Aki a Confeiteira ira adicionar um novo bolo para o catalogo dela com o nome, imagen e uma breve descreição do bolo
oque falta fazer?
    
    - adicionar uma imagem do bolo
    - adicionar um botão para cancelar a adição do bolo
    - adicionar um botão para voltar para o perfil da confeiteira
*/

export default function AdicionarBolos(){
    const router = useRouter();

// 
    return(
        <View>
            <TextInput
            placeholder="Nome Do Bolos"/>
            {/*<Image/>*/}
            <TextInput
            placeholder="Descrição do Bolo"/>
            <Text>Possui igredientes Alergicos?</Text>
            {/* <Button title="Sim" onPress={()=>{}}/>
            <Button title="Não" onPress={()=>{}}/>
             */}

             <Button title="Adicionar Bolo ao catalogo" onPress={()=>{router.push('/Confeiteira/perfil_confeiteira')}}/>
        </View>
    )
}