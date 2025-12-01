import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { CustomNavbar } from "./src/components/Navbar";
// import UsersScreen from "./screens/UsersScreen";
import CrearActividad from "./src/screens/CrearActScreen";


const Drawer = createDrawerNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        drawerContent={(props) => <CustomNavbar {...props} />}
        screenOptions={{ headerShown: false }}
      >
        <Drawer.Screen name="CrearActividad" component={CrearActividad} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}


