import {Tabs} from "expo-router"
import {Ionicons} from "@expo/vector-icons"

export default function Layout() {
    return (
        <Tabs>
            <Tabs.Screen
                name="index"
                options={{
                    title: "Inicio",
                    tabBarIcon: ({color}) => <Ionicons name="home" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="perfil"
                options={{
                    title: "Perfil Cliente",
                    tabBarLabel: "Perfil",
                    tabBarIcon: ({color}) => <Ionicons name="person-circle" size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}