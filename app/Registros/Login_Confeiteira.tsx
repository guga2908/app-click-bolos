import { useRouter } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Text,
    TextInput,
    View,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Login_Boleira() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');

    const indentificarlogin = async () => {
        try {
            const confeiteira = await fetch('http://localhost:8081/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, senha }),
            });

            if (!confeiteira.ok) {
                const errorData = await confeiteira.json();
                Alert.alert("Erro ao fazer login", errorData.error || "Erro desconhecido");
                return;
            }

            const data = await confeiteira.json();
            await AsyncStorage.setItem("confeiteiraId", data.id);
            Alert.alert('Login realizado', `ID da confeiteira: ${data.id}`);
            router.push(`../perfils/Confeiteira/${data.id}`);
        } catch (error) {
            console.error("Erro ao fazer login:", error);
            Alert.alert('Erro ao fazer login', 'Verifique suas credenciais e tente novamente');
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.container}
        >
            <Text style={styles.title}>🧁 Bem-vinda, Confeiteira!</Text>
            <Text style={styles.subtitle}>Adoce seu dia com mais praticidade 💕</Text>

            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                placeholderTextColor="#A1887F"
            />

            <TextInput
                style={styles.input}
                placeholder="Senha"
                value={senha}
                onChangeText={setSenha}
                secureTextEntry
                placeholderTextColor="#A1887F"
            />

            <TouchableOpacity
                style={styles.button}
                onPress={indentificarlogin}
                activeOpacity={0.85}
            >
                <Text style={styles.buttonText}>Entrar</Text>
            </TouchableOpacity>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF0F5', // Rosa chantilly
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        paddingVertical: 40,
    },
    title: {
        textAlign:'center',
        fontSize: 30,
        fontWeight: 'bold',
        color: '#AD1457', // Rosa framboesa
        marginBottom: 10,
        
    },
    subtitle: {
        fontSize: 16,
        color: '#6D4C41', // Chocolate leve
        marginBottom: 30,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        backgroundColor: '#FFFFFF', // Branco confeiteiro
        borderColor: '#F8BBD0', // Rosa doce
        borderWidth: 1.5,
        borderRadius: 12,
        paddingVertical: 14,
        paddingHorizontal: 16,
        fontSize: 16,
        marginBottom: 16,
        color: '#4E342E', // Chocolate escuro
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    button: {
        backgroundColor: '#8D4C3F', // Chocolate quente
        paddingVertical: 16,
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        borderBottomLeftRadius: 28, // borda mais curvada na base
        borderBottomRightRadius: 28,
        width: '100%',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        elevation: 5,
        borderWidth: 1,
        borderColor: '#5D2E2E', // borda calda de chocolate
    },
    buttonText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
});