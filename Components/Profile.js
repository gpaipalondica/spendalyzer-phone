import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import { useEffect } from 'react';
import Icon from  'react-native-vector-icons/FontAwesome5'
import Loader from './Loader';
import { useNavigation } from '@react-navigation/native'

export default function Profile({userData, authToken, setAuthToken, setUserData}) {

    //To store data
    const storeData = async (key, value) => {
    try {
        await AsyncStorage.setItem(key, value);
    } catch (error) {
        console.error('Error storing data:', error);
    }
    };

    // To retrieve data
    const getData = async (key) => {
    try {
        const value = await AsyncStorage.getItem(key);
        if (value !== null) {
        return value;
        }
    } catch (error) {
        console.error('Error retrieving data:', error);
    }
    };

    // To remove data
    const removeData = async (key) => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (error) {
        console.error('Error removing data:', error);
    }
    };

    let [loading, setLoading] = useState(false)
    let [user, setUser] = useState('My')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const getThisUser = await getData('user');
                if (getThisUser) {
                    const thisUsername = JSON.parse(getThisUser).username;
                    setUser(thisUsername);
                }
            } catch(error) {
                console.error('Error in user details:', error);
            }
        };
        fetchData()
    },[])

    let nav = useNavigation()
    
    function goTo(x){
        nav.navigate(x)
    }


    function logmeOut(){
        // console.log("hehe");
        Alert.alert(
            'Confirmation',
            'Are you sure you want to logout?',
            [
                {
                  text: 'No',
                  style: 'cancel'
                },
                {
                  text: 'Yes',
                  onPress: () => {
                    setLoading(true)
                    
                    setTimeout(() => {
                        removeData('user')
                        removeData('token')
                        removeData('data')
                        setAuthToken('')
                        setUserData(null)
                        goTo('Home')
                        setLoading(false)
                    }, 2000)
                  }
                }
              ],
              { cancelable: false }
        )
    }

  return (<>
    <View style={{flex:1, width:'100%', justifyContent:"center", alignItems:"center", gap:100}}>
        <View style={{justifyContent:'center', alignItems:'center', gap:20}}>
            <Icon name='user-circle' color='#777' size={70}/>
            <Text style={{fontSize:22, backgroundColor:'white', paddingHorizontal:50, paddingVertical:5 ,fontWeight:'bold', borderRadius:10, borderColor:'#222', borderWidth:1}}>{user}</Text>
        </View>
        <TouchableOpacity onPress={logmeOut}>
            <Text style={{fontSize:18, backgroundColor:'#777', color:'white', paddingVertical:10, paddingHorizontal:80, borderRadius:10 }}>Logout</Text>
        </TouchableOpacity>
    </View>
    {loading && <Loader/>}
  </>
  )
}