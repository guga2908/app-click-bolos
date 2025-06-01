import {Tabs} from "expo-router"
import {Ionicons} from "@expo/vector-icons"


export default function Layout() {
    return (
        <Tabs>
            <Tabs.Screen
                name="index"
                options={{
                    title: "inicio",
                    tabBarIcon: ({color}) => <Ionicons name="compass" size={24} color={color} />,
                }}
            />
            <Tabs.Screen
                name="[id]"
                options={{
                    title: "Perfil",
                    tabBarLabel: "Perfil",
                    tabBarIcon: ({color}) => <Ionicons name="person-circle" size={24} color={color} />,
                }}
            />
        </Tabs>
    );
}