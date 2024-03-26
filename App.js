import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import Navbar from './Components/Navbar';
import Home from './Components/Home';
import Login from './Components/Login';
import Register from './Components/Register';
import Expense from './Components/Expense';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Profile from './Components/Profile';
import { StatusBar } from 'expo-status-bar';


const Stack = createBottomTabNavigator();

function App() {
  // AsyncStorage.clear()
  const [authToken, setAuthToken] = useState(null);
  const [userData, setUserData] = useState({});

  useEffect(() => {
    // Retrieve token and data from AsyncStorage
    const getTokenAndData = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        if (token) {
          setAuthToken(token);
        }
        const data = await AsyncStorage.getItem('data');
        if (data) {
          setUserData(JSON.parse(data));
        }
      } catch (error) {
        console.error('Error retrieving data:', error);
      }
    };
    getTokenAndData();
  }, []);

  // Function to log AsyncStorage contents
const logAsyncStorage = async () => {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const items = await AsyncStorage.multiGet(keys);
    console.log('AsyncStorage contents:', items);
  } catch (error) {
    console.error('Error logging AsyncStorage contents:', error);
  }
};

// Call the function wherever needed, for example:
// logAsyncStorage();

  return (<>
    <StatusBar style="light" backgroundColor='#228D57' />
    <NavigationContainer>
      <Navbar />
      
      <Stack.Navigator screenOptions={{tabBarActiveTintColor:'#228D57', tabBarInactiveTintColor:'#666', tabBarStyle:{backgroundColor:'lightgray', borderTopColor:'black'}, animationEnabled: false, headerShown: false, tabBarIconStyle: { display: "none" }, tabBarLabelPosition:'beside-icon', tabBarLabelStyle:{position:'absolute', fontSize:17, textAlignVertical:'center', textAlign:'center' }, tabBarHideOnKeyboard:true}}>
        {authToken ? 
        <>
        <Stack.Screen name="Home" >
        {props => <Home {...props} authToken={authToken} />}
        </Stack.Screen>
        <Stack.Screen name="Expense">
          {props => <Expense {...props} authToken={authToken} />}
        </Stack.Screen>
        <Stack.Screen name="Profile">
          {props => <Profile {...props} userData={userData} authToken={authToken} setAuthToken={setAuthToken} setUserData={setUserData} />}
        </Stack.Screen>
        </>
        :
        <>
        <Stack.Screen name="Home">
        {props => <Home {...props} authToken={authToken} />}
        </Stack.Screen>
        <Stack.Screen name="Login">
          {props => <Login {...props} setAuthToken={setAuthToken} setUserData={setUserData} />}
        </Stack.Screen>
        <Stack.Screen name="Register" component={Register} />
        </>
      
      }
      </Stack.Navigator>
    </NavigationContainer>
    </>
  );
}

export default App;
