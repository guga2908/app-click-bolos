import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
    },

    header: {
      alignItems: "center",
      marginBottom: 16,
    },

    imagem: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 8,
    },

    nome: {
      fontSize: 20,
      fontWeight: "bold",
    },
    
    horarios: {
      fontSize: 16,
      marginBottom: 8,
    },

    descricao: {
      fontSize: 14,
      marginBottom: 16,
    },

    catalogoTitulo: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 8,
    },

    item: {
      marginBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: "#ccc",
      paddingBottom: 8,
    },

    itemImagem: {
      width: 80,
      height: 80,
      borderRadius: 8,
      marginBottom: 8,
    },

    itemNome: {
      fontSize: 16,
      fontWeight: "bold",
    },

    itemDescricao: {
      fontSize: 14,
    },
    
    itemPreco: {
      fontSize: 14,
      color: "green",
    },
  })

