import { createStackNavigator } from '@react-navigation/stack';
import UsersScreen from '../screens/UsersScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Users" component={UsersScreen} />
    </Stack.Navigator>
  );
}
