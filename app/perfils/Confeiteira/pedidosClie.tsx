import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, Button, Linking } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router"; // Adicione esta linha

type Pedido = {
  id: number;
  NumeroPedido?: number;
  status?: string;
  dataPedido?: string;
  valorTotal?: number;
  cliente?: {
    nome?: string;
    endereco?: string;
    telefone?: string;
  };
  itenspedido?: {
    bolo?: {
      nome?: string;
      peso?: number;
      preco?: number;
    };
    quantidade?: number;
  }[];
};

export default function PedidosClie() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const router = useRouter(); // Adicione esta linha

  useEffect(() => {
    buscarPedidos();
  }, []);

  const buscarPedidos = async () => {
    const confeiteiraId = await AsyncStorage.getItem("confeiteiraId");
    if (!confeiteiraId) return;
    fetch(`http://localhost:8081/confeiteira/${confeiteiraId}/pedidos`)
      .then(res => res.json())
      .then(data => setPedidos(Array.isArray(data) ? data : []))
      .catch(err => console.error("Erro ao buscar pedidos:", err));
  };

  // Função para atualizar o status do pedido
  const atualizarStatus = async (pedidoId: number, novoStatus: string) => {
    try {
      const res = await fetch(`http://localhost:8081/pedidos/${pedidoId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: novoStatus }),
      });
      if (res.ok) {
        buscarPedidos(); // Atualiza a lista após a mudança
      }
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
    }
  };

  function getStatusStyle(status?: string): { color: string } {
    switch (status) {
      case "Pendente":
        return { color: styles.pendente.color };
      case "Em produção":
        return { color: styles.producao.color };
      case "Entregue":
        return { color: styles.entregue.color };
      case "Cancelado":
        return { color: styles.cancelado.color };
      default:
        return { color: "#888" };
    }
  }

  return (
    <View style={styles.container}>
      <Button title="Voltar" onPress={() => router.back()} /> {/* Botão de voltar */}
      <Text style={styles.titulo}>Pedidos Recebidos</Text>
      <FlatList
        data={pedidos}
        keyExtractor={item => item.id?.toString() ?? Math.random().toString()}
        renderItem={({ item }) => (
          <View style={styles.pedidoBox}>
            <Text style={styles.label}>
              Pedido Nº: <Text style={styles.valor}>{item.NumeroPedido ?? item.id}</Text>
            </Text>
            <Text style={styles.label}>
              Status: <Text style={[styles.valor, getStatusStyle(item.status)]}>{item.status || "Desconhecido"}</Text>
            </Text>
            {/* Botões para mudar status */}
            <View style={{ flexDirection: "row", gap: 8, marginVertical: 8 }}>
              {["Pendente", "Em produção", "Entregue", "Cancelado"].map(status => (
                <Button
                  key={status}
                  title={status}
                  color={getStatusStyle(status).color || "#888"}
                  onPress={() => atualizarStatus(item.id, status)}
                  disabled={item.status === status}
                />
              ))}
            </View>
            <Text style={styles.label}>
              Data do Pedido: <Text style={styles.valor}>
                {item.dataPedido ? new Date(item.dataPedido).toLocaleString("pt-BR") : "?"}
              </Text>
            </Text>
            <Text style={styles.label}>
              Cliente: <Text style={styles.valor}>{item.cliente?.nome || "Desconhecido"}</Text>
            </Text>
            {item.itenspedido && item.itenspedido.length > 0 ? (
              item.itenspedido.map((it, idx) => (
                <View key={idx} style={styles.itemBox}>
                  <Text style={styles.label}>
                    Bolo: <Text style={styles.valor}>{it.bolo?.nome || "Desconhecido"}</Text>
                  </Text>
                  <Text style={styles.label}>
                    Peso: <Text style={styles.valor}>{it.bolo?.peso ?? "?"} kg</Text>
                  </Text>
                  <Text style={styles.label}>
                    Valor: <Text style={styles.valor}>R$ {it.bolo?.preco ?? "?"}</Text>
                  </Text>
                  <Text style={styles.label}>
                    Quantidade: <Text style={styles.valor}>{it.quantidade ?? "?"}</Text>
                  </Text>
                </View>
              ))
            ) : (
              <Text style={styles.valor}>Nenhum bolo neste pedido.</Text>
            )}
            <Text style={styles.label}>
              Valor Total: <Text style={styles.valor}>R$ {item.valorTotal?.toFixed(2) ?? "?"}</Text>
            </Text>
            <Text style={styles.label}>
              Endereço: <Text style={styles.valor}>{item.cliente?.endereco || "Desconhecido"}</Text>
            </Text>
            <Text style={styles.label}>
              Contato: <Text style={styles.valor}>{item.cliente?.telefone || "Desconhecido"}</Text>
            </Text>
            {item.cliente?.telefone && (
              <Button
                title="WhatsApp"
                color="#25D366"
                onPress={() => Linking.openURL(`https://wa.me/55${item.cliente?.telefone}`)}
              />
            )}
          </View>
        )}
        ListEmptyComponent={<Text>Nenhum pedido encontrado.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  pedidoBox: { backgroundColor: "#f9f9f9", padding: 12, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: "#eee" },
  itemBox: { marginLeft: 10, marginBottom: 5, backgroundColor: "#f1f1f1", borderRadius: 6, padding: 6 },
  label: { fontWeight: "bold" },
  valor: { fontWeight: "normal" },
  pendente: { color: "#FFA500" },
  producao: { color: "#007bff" },
  entregue: { color: "#28a745" },
  cancelado: { color: "#dc3545" }
});