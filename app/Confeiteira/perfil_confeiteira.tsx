import { router } from "expo-router";
import { useState } from "react";
import { Button, Image, ScrollView, Text, TextInput, View } from "react-native";
//import lala from '../../imagens/lala.png';
export default function Perfil (){
    const [texto, setTexto]= useState ('Descrição');
    const [editado, setEditado] = useState(false);
//pagina finalizada por enquanto, quando começar no laravel colocar os codigos corretos
    const salvar = ()=> {
        setEditado(false);
    }
    const catalogoBolos =[
        {
            id: '1',
            nome: 'bolo de cenoura',
            preco:'50,50'
        },
        {   id: '2',
            nome: 'bolo de morango',
            preco: '55,00'}
    ]
    type ItemProps = {Bolo:string}
    const Item = ({Bolo}: ItemProps) => (
        <View>
          <Text>{Bolo}</Text>
        </View>
      );
      const onPress =()=> router.push('/Confeiteira/catalogo_de_bolos')

    return(
<View>
    <View>
            <Image /**acredito que aki nao falta mais nada, adição futuras talves*//>
            <Text>*Nome da confeiteira ou loja*</Text>
            <Text>*Horarios de funcionamento*</Text>
            <Text>*numero de*</Text>
            <TextInput
            value={texto}
            onChangeText={setTexto}
            editable = {editado}
            maxLength={480}

            /** começar a utilizar o laravel para conectar a um banco de dados para comecar a fazer os codigos corretos */
            />
            {editado ?(
            <Button title="Salvar" onPress={salvar}/>) :(
            <Button title="Editar" onPress={() => setEditado(true)}/>   
)}
    </View> 
    
    <View /** coloquei um ScrollView para os catalogo dos Bolos*/>

            <Text>Catalogo</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {catalogoBolos.map((Bolo)=>(
                <View key={Bolo.id}>
                <Image
        source={require('../../imagens/lala.png')}
        style={{ width: 100, height: 100 }}/> // Caminho da imagem local
                <Text>{Bolo.nome}</Text>
                <Text>{Bolo.preco}</Text>
                </View>
                ))}
            </ScrollView>
    </View>

</View>
    )
}