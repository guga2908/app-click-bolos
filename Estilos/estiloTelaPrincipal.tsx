import {StyleSheet} from 'react-native';


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },

  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },

  filterContainer: {
    marginBottom: 20,
  },

  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
    marginBottom: 10,
  },

  radiusContainer: {
    marginBottom: 10,
  },

  label: {
    fontSize: 16,
    marginBottom: 5,
  },

  radiusButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  
  radiusButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
    marginRight: 10,
  },

  activeRadiusButton: {
    backgroundColor: "#007bff",
    borderColor: "#007bff",
  },

  radiusButtonText: {
    color: "#000",
  },

  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },

  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    flexDirection: "row",
    alignItems: "center",
  },

  itemText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  
  imagem: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
})