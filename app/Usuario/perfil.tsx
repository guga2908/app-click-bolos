import { Image, ScrollView, Text, TextInput, View } from "react-native";




    /*tive uma dicas de como prosseguir e qual caminho devo pegar este aplicativo tera como 
    cliente final o usuario e nao a boleira / confeiteira devo seguir esta linha de raciocinio e
    criar um aplicativo que seja mais voltado para o usuario final e nao para a boleira / confeiteira
    mais nao devo neglegir a boleira / confeiteira pois ela sera a pessoa que ira cadastrar os bolos e o usuario final
    */

export default function Perfil() {
 const favoritos =[
    {
        id: '1',
        nome: 'showBolo'
    },
    {   id: '2',
        nome: 'BelasBolos'}
 ]
 type ItemProps ={Bolos:string}
 const Item =({Bolos}:ItemProps) =>(
    <View>
        <Text>{Bolos}</Text>
    </View>
 )
/* comecar a montar esta pagina tambem */

    return(
        <View>
            <View>
            <Image/>
            <Text>nome usuario</Text>
            </View>
            <View>
                <Text>favoitos</Text>
            <ScrollView showsVerticalScrollIndicator={false}>
                {favoritos.map((Bolos)=>(
                    <View key={Bolos.id}>
                        <Image
                source={require('../../assets/images/lala.png')}
                style={{ width: 100, height: 100 }}/> 
                // Caminho da imagem local
                        <Text>{Bolos.nome}</Text>
                    </View>
                ))}
            </ScrollView>
            </View>
            
        </View>
    )
}