import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router';

export default function NotFoundScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16 }}>Página não encontrada</Text>
      <Text style={{ fontSize: 16, marginBottom: 32 }}>A rota que você tentou acessar não existe.</Text>
    </View>
  );
}