// CustomNavbar.js
import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import {
  BsPersonFill,
  BsPencilSquare,
  BsJournalText,
  BsCalendarEvent,
  BsClipboardData,
  BsChatDots,
  BsBoxArrowRight,
  BsGear
} from "react-icons/bs";

// Importa tus imágenes
import logoCediplus from "../../assets/Recursos/logoCediplus.png";
import persona from "../../assets/Recursos/Foto.jpg";

export function CustomNavbar(props) {
  return (
    <DrawerContentScrollView {...props}>

      {/* LOGO */}
      <View style={styles.header}>
        <Image source={logoCediplus} style={styles.logo} />
      </View>

      {/* OPCIONES DEL MENÚ */}
      <DrawerItem
        label="Usuarios"
        icon={() => <BsPersonFill size={20} />}
        onPress={() => props.navigation.navigate("Usuarios")}
      />

      <DrawerItem
        label="Crear Actividades"
        icon={() => <BsPencilSquare size={20} />}
        onPress={() => props.navigation.navigate("CrearActividad")}
      />

      <DrawerItem
        label="Actividades"
        icon={() => <BsJournalText size={20} />}
        onPress={() => props.navigation.navigate("Actividades")}
      />

      <DrawerItem
        label="Calendario"
        icon={() => <BsCalendarEvent size={20} />}
        onPress={() => props.navigation.navigate("Calendario")}
      />

      <DrawerItem
        label="Reportes"
        icon={() => <BsClipboardData size={20} />}
        onPress={() => props.navigation.navigate("Reportes")}
      />

      <DrawerItem
        label="Chat"
        icon={() => <BsChatDots size={20} />}
        onPress={() => props.navigation.navigate("Chat")}
      />

      {/* PERFIL / CONFIG */}
      <View style={styles.footer}>
        <Image source={persona} style={styles.avatar} />
        <Text style={styles.name}>Nombre de Usuario</Text>

        <DrawerItem
          label="Salir"
          icon={() => <BsBoxArrowRight size={20} />}
          onPress={() => props.navigation.navigate("Login")}
        />

        <DrawerItem
          label="Configuración"
          icon={() => <BsGear size={20} />}
          onPress={() => props.navigation.navigate("Configuracion")}
        />
      </View>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    padding: 20,
  },
  logo: {
    width: 120,
    height: 60,
    resizeMode: "contain",
  },
  footer: {
    marginTop: 40,
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginVertical: 10,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 20,
  },
});
