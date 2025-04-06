import { router } from "expo-router";
import { useState } from "react";
import { Button, Image, ScrollView, Text, TextInput, View } from "react-native";



export default function Perfil (){
    const [texto, setTexto]= useState ('Descrição');
    const [editado, setEditado] = useState(false);
    const imagenName = 'lala.png'

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
            <Image/>
            <Text>*Nome da confeiteira ou loja*</Text>
            <Text>*Horarios de funcionamento*</Text>
            <Text>*numero de*</Text>
            <TextInput
            value={texto}
            onChangeText={setTexto}
            editable = {editado}
            maxLength={480}
            />
            {editado ?(
            <Button title="Salvar" onPress={salvar}/>) :(
            <Button title="Editar" onPress={() => setEditado(true)}/>   
)}
    </View> 
    <View>
            <Text>Catalogo</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {catalogoBolos.map((Bolo)=>(
                <View key={Bolo.id}>
                <Image
        source={require('../imagens/${imagenName}')}
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