import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { useFetchUsers } from "../hooks/useFetchUsers";
import UserCard from "../components/UserCard";

export default function UsersScreen() {
  const { users, loading } = useFetchUsers();

  if (loading) return <ActivityIndicator size="large" />;

  return (
    <FlatList
      data={users}
      keyExtractor={item => item.id.toString()}
      renderItem={({ item }) => <UserCard user={item} />}
    />
  );
}
