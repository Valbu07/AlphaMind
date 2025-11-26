import { View, Text, StyleSheet } from "react-native";

export default function UserCard({ item }) {
  return (
    <View style={styles.card}>
      <Text style={styles.name}>{item.nombre}</Text>
      <Text style={styles.text}>Correo: {item.correo}</Text>
      <Text style={styles.text}>Teléfono: {item.telefono}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 6,
    borderRadius: 10,
    elevation: 3,
  },
  name: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 5
  },
  text: {
    fontSize: 14
  }
});
