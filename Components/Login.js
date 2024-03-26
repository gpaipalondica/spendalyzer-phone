import React, { useState } from 'react';
import {Alert, View, TextInput, Button, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo'
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from './Loader';

const Login = (props) => {

  let [loading, setLoading] = useState(false);

  const url = 'https://spendalyzerbackend.azurewebsites.net'

  const storeData = async (key, value) => {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('Error storing data:', error);
    }
  };


  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [uname, setUname] = useState(false)
  const [upass, setUpass] = useState(false)

  const handleUsernameChange = (text) => {
    setUsername(text);
    setUname(false)
};

const handlePasswordChange = (text) => {
    setPassword(text);
    setUpass(false)
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  let nav = useNavigation()

  function goTo(x){
    setUname(false)
    setUpass(false)
    nav.navigate(x)
  }

  async function handleSubmit() {

    
    // Handle form submission
    if(username === ''){
        setUname(true)
    }else if(password === ''){
        setUpass(true)
    }
    else{

      setLoading(true)

        let user = {
          "username": username,
          "password": password
        }

        let isVerified 
        try{
            isVerified = await verifyUser(user)
        }catch(error){
            console.error('Error', error);
        }

        // console.log("IV", isVerified);
        if(isVerified.data === true){
          let fullData;
          try {
            fullData = await getExpByUser(username); // Use await to wait for the Promise to resolve
          } catch (error) {
            console.error('Error in :', error);
          }
      
          // console.log("FD",fullData);
      
          loginUser(isVerified.user)
      }
      else if (isVerified.data === false){
           Alert.alert(
            'Incorrect credentials',
            'Verify your username and password and try again.',
            [
              { text: 'OK' }
            ],
            { cancelable: false }
            );
           setLoading(false)
      }else if(isVerified.message){
        Alert.alert(
          'User not found',
          'Verify your username or create a new account',
          [
            { text: 'OK' }
          ],
          { cancelable: false }
        );
          setLoading(false)
      }
    }
  };

  async function getExpByUser(name) {
    return fetch(url+'/list/'+name, {
      method: 'GET'
    })
      .then(response => response.json())
      .then(data => {
        return data; // Return the data inside the Promise chain
      })
      .catch(error => {
        console.log('Error in GET function', error);
        throw error; // Rethrow the error to propagate it
      });
  }

  async function verifyUser(passedUser){
    return fetch(url+'/users',{
            method:"GET"
           }).then(response => response.json())
          .then(data => {
              let allUsers = data
              // console.log("AU",allUsers);
              // console.log("PU",passedUser);
              let count = 0
              for(let user in allUsers){
                let au = allUsers[user].username
                let pu = passedUser.username
                  if(au === pu || allUsers[user].email === pu){
                      // console.log("USERNAME matched")
                      count++;
                      
                      let data3 = {
                          "plaintext": passedUser.password,
                          "hashed": allUsers[user].password
                      }

                      // console.log("data3", data3);

                     return fetch(url+'/verifyUser', {
                          method:"POST",
                          headers:{
                              'Content-type': 'application/json'
                          },
                          body: JSON.stringify(data3)
                      }).then(response => response.json())
                      .then(data => {
                          // console.log("HERE", data);
                          return {"data":data, "user": allUsers[user]}
                      })
                      .catch(err => {
                      console.log(err);
                      })
                  }
                  // else{
                  //   return {message:"user not found"}
                  // }
              }
              if(count === 0){
                return {message:"user not found"}
              }
              }) 
              .catch(error => {
              console.log('ERROR IN VERIFY USER FUNCTION', error);
              });
    }

    function loginUser(x){

      let name = x.username
  
      const data = {
          "username": name,
      }
  
      fetch(url+'/login',{
          method:"POST",
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
      })
      .then(response => response.json())
      .then(data => {
          // console.log("POST data", data);
  
          if(data.accessToken){
              let accTok = data.accessToken
              // console.log("AT",accTok);
              tokenVerify(x,accTok)
          }
          else{
              console.log("No Access Token");
          }
      })
      .catch(err => {
          console.log("POST error: ",err);
      })
  
  }

  function tokenVerify(x2,x) {
    let accTok = x; 
    let userDetails = {
      "user_id":x2.user_id,
      "username": x2.username,
      "email": x2.email
    }

    // console.log(userDetails);

    const token = accTok

    const auth = `Bearer ${token}`

    // console.log(auth);

    fetch(url+'/posts', {
    method: 'GET',
    headers: {
        'Authorization': auth
    }
    })
  .then(response => {
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {

    storeData('user', JSON.stringify(userDetails))
    storeData('token',token)
    storeData('data',JSON.stringify(data))

    props.setAuthToken(token)
    props.setUserData(JSON.stringify(data))

    goTo('Expense')
    setLoading(false)
  
  })
  .catch(error => {
    console.error('Fetch error:', error);
  });
}
  

  return (<>
    {loading && <Loader/>}
    <View style={styles.Login}>    
    <View style={styles.Form}>
      <Text style={styles.Title}>Login</Text>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Username</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your username"
          value={username}
          onChangeText={handleUsernameChange}
        />
        {uname && (
          <Text style={{ color: "red" }}>Username required</Text>
        )}
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Password</Text>
        <View style={{position:'relative'}}>
            <TextInput
            style={styles.input}
            placeholder="Enter your password"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={handlePasswordChange}
            />
            {upass && (
            <Text style={{ color: "red" }}>Password Required</Text>
            )}
            <TouchableOpacity style={styles.eyeIcon} onPress={togglePasswordVisibility}>
                <Text>{showPassword ? <Icon name='eye' size={20}/> : <Icon name='eye-with-line' size={20}/> }</Text>
            </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.BtnLogin} onPress={handleSubmit}>
        <Text style={styles.BtnLoginText}>Login</Text>
      </TouchableOpacity>

      <View style={{ flexDirection:'row', justifyContent:'center', gap:5, marginTop:30, width:'100%'}}>
        <Text>Don't have an account?</Text>
        <Text style={{color:'#228D57', textDecorationLine:'underline'}} onPress={() => goTo('Register')}>Register Now!</Text>
      </View>
    </View>   
    </View>
    </>
  );
};

const styles = StyleSheet.create({
  Login: {
    flex: 1,
    padding: 20,
    backgroundColor:'#fff',
    alignItems:'center',
    justifyContent:'center',
    gap:50,
  },
  Form:{
    width: "90%",
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginTop:-60,
    gap:10,
  },
  Title:{
    fontSize:26,
    textAlign:'center',
    marginBottom:27,
    fontWeight:'bold'
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 5,
    fontSize:16
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    height:40
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: 10,
    color: 'blue',
  },
  BtnLogin:{
    paddingVertical: 8,
    paddingHorizontal:15,
    backgroundColor: '#228D57',
    borderRadius: 10,
    marginTop:10,
    width:'50%',
    alignSelf:"center"
  },
  BtnLoginText:{
    color: '#E8E9C9',
    textAlign:'center',
    fontSize:16,
    fontWeight:'bold',
  }

});

export default Login;
