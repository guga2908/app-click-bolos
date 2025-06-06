import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Alert, Button, Text, TouchableOpacity, View, StyleSheet,} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function Pedidos() {
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [bolo, setBolo] = useState<{ nome: string; preco: number } | null>(
    null
  );
  const [quantidadeKg, setQuantidadeKg] = useState(1);
  const [formadepagamento, setFormaDePagamento] = useState("");
  const [endereco, setEndereco] = useState<string | null>(null);
  const [dataEntrega, setDataEntrega] = useState(new Date());
  const [valorTotal, setValorTotal] = useState(0);

  useEffect(() => {
    const fetchBolo = async () => {
      try {
        const response = await fetch(`http://localhost:8081/bolo/${id}`);
        const data = await response.json();
        setBolo(data);
        setValorTotal(data.preco);
      } catch (error) {
        Alert.alert("Erro", "Erro ao buscar dados do bolo");
      }
    };

    if (id) fetchBolo();
  }, [id]);

  useEffect(() => {
    const fetchEndereco = async () => {
      try {
        const clienteId = await AsyncStorage.getItem("clienteId");
        if (!clienteId) return;

        const response = await fetch(`http://localhost:8081/cliente/${clienteId}/endereco`);
        const enderecoTexto = await response.text();
        setEndereco(enderecoTexto);
      } catch (error) { 
        Alert.alert("Erro", "Erro ao buscar endereço do cliente");
      }
    };

    fetchEndereco();
  }, []);

  useEffect(() => {
    if (bolo) {
      setValorTotal(bolo.preco * quantidadeKg);
    }
  }, [quantidadeKg, bolo]);

  const aumentarKg = () => setQuantidadeKg((prev) => prev + 1);
  const diminuirKg = () => {
    if (quantidadeKg > 1) setQuantidadeKg((prev) => prev - 1);
  };

  const hoje = new Date();
  const entregaHoje = dataEntrega.toDateString() === hoje.toDateString();

  return (
    <View style={styles.container}>
      {bolo && (
        <>
          <Text style={styles.titulo}>{bolo.nome}</Text>
          <Text style={styles.valor}>Preço por Kg: R$ {bolo.preco.toFixed(2)}</Text>

          <Text style={styles.label}>Quantidade (Kg):</Text>
          <View style={styles.kgContainer}>
            <Button title="-" onPress={diminuirKg} />
            <Text style={styles.kgText}>{quantidadeKg} Kg</Text>
            <Button title="+" onPress={aumentarKg} />
          </View>

          <Text style={styles.valor}>Valor total: R$ {valorTotal.toFixed(2)}</Text>

          <Text style={styles.label}>Forma de Pagamento:</Text>
          {["Pix", "Crédito", "Débito", "Dinheiro"].map((forma) => (
            <TouchableOpacity key={forma} onPress={() => setFormaDePagamento(forma)}>
              <Text style={{ color: formadepagamento === forma ? "blue" : "black" }}>
                {formadepagamento === forma ? "• " : ""}{forma}
              </Text>
            </TouchableOpacity>
          ))}

          <Text style={styles.label}>Endereço de entrega:</Text>
          {endereco ? (
            <Text style={styles.endereco}>
             {endereco}
            </Text>
          ) : (
            <Text>Carregando endereço...</Text>
          )}

          <Text style={styles.label}>Data de Entrega:</Text>
          <DateTimePicker
            value={dataEntrega}
            mode="date"
            display="default"
            minimumDate={new Date()}
            onChange={(event, selectedDate) => {
              if (selectedDate) setDataEntrega(selectedDate);
            }}
          />

          {entregaHoje && (
            <Text style={{ color: "red", marginTop: 10 }}>
              Entrega para hoje! Será necessário confirmar disponibilidade com a confeiteira.
            </Text>
          )}

          <View style={{ marginTop: 20 }}>
            <Button
              title="Confirmar Pedido"
              onPress={() => {
                Alert.alert("Pedido enviado", "Em breve a confeiteira entrará em contato.");
                router.push("./(drawer)/index");
              }}
            />
          </View>

          <View style={{ marginTop: 10 }}>
            <Button
              title="Cancelar"
              onPress={() => router.push("./(drawer)/index")}
              color="gray"
            />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  titulo: { fontSize: 22, fontWeight: "bold" },
  valor: { fontSize: 16, marginVertical: 5 },
  kgContainer: { flexDirection: "row", alignItems: "center", gap: 15, marginVertical: 10 },
  kgText: { fontSize: 18 },
  label: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
  endereco: { marginVertical: 5, fontSize: 16 },
});
