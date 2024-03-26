import React, { useState } from 'react';
import {Alert, View, TextInput, Button, StyleSheet, TouchableOpacity, Text } from 'react-native';
import Icon from 'react-native-vector-icons/Entypo'
import { useNavigation } from '@react-navigation/native';
import validator from 'validator';
import Loader from './Loader';

const Register = () => {

  let [loading, setLoading] = useState(false)

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [conpassword, setConPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConPassword, setShowConPassword] = useState(false);

  const [uname, setUname] = useState(false)
  const [uemail, setUemail] = useState(false)
  const [upass, setUpass] = useState(false)
  const [upassconf, setUpassconf] = useState(false)

  const handleUsernameChange = (text) => {
    setUsername(text);
    setUname(false)
  };
  const handleEmailChange = (text) => {
    setEmail(text);
    setUemail(false)
  };

  const handlePasswordChange = (text) => {
    setPassword(text);
    setUpass(false)
  };
  const handleConPasswordChange = (text) => {
    setConPassword(text);
    setUpassconf(false)
  };

  const url = 'https://spendalyzerbackend.azurewebsites.net'


  async function handleSubmit() {
    // Handle form submission
    if(username === ''){
        setUname(true)
    }
    else if(email === ''){
      setUemail({"bool":true, "message": 'Email required'})
    }
    else if(password === ''){
        setUpass({"bool":true, "message": 'Password required'})
    }
    else if(conpassword === ''){
        setUpassconf({"bool":true, "message": 'Confirm Password required'})
    }
    else if(!validator.isEmail(email)){
      setUemail({"bool":true, "message": 'Email is invalid'})
    }
    else if(password.length<8){
      setUpass({"bool":true, "message": 'Password should be at least 8 characters'})
    }
    else if(password !== conpassword){
      setUpassconf({"bool":true, "message": 'Passwords do not match'})
    }
    else{
      setLoading(true)
        setUname(false)
        setUemail(false)
        setUpass(false)
        setUpassconf(false)

        let newUser = {
          "name": username,
          "email": email,
          "password": password,
          "passwordconfirm": conpassword
        }

        console.log("data",newUser);

        let isUnique 
        try{
            isUnique = await checkUser(newUser)
        }
        catch(error){
            console.log(error);
        }

        console.log("isUnique",isUnique);
        
        if(isUnique === true) {
              // console.log("YASS");
              let data2 = {
                  "username": newUser.name,
                  "email": newUser.email,
                  "password": newUser.password
              }
    
              // console.log("data2", data2);
              fetch(url+'/user',{
                  method:'POST',
                  headers:{
                      'Content-Type':'application/json',
                  }, 
                  body: JSON.stringify(data2)
              }).then(response => response.json())
              .then(data => {
                  // console.log(data);
                  // setLoading(false)
                  Alert.alert(
                    'Success',
                    'User registered successfully.',
                    [
                      { text: 'OK' }
                    ],
                    { cancelable: false }
                    );
                  setLoading(false)
                  goTo('Login')
              })
              .catch(error => {
                  console.log(error);
              })
    
      }else if(isUnique.count === "Email"){
          // setLoading(false)
          Alert.alert(
            'Email already exists',
            'Verify your email or use a different email',
            [
              { text: 'OK' }
            ],
            { cancelable: false }
            );
      }else if(isUnique.count === "Username"){
          // setLoading(false)
          Alert.alert(
            'Username taken',
            'Verify your username or use a different username.',
            [
              { text: 'OK' }
            ],
            { cancelable: false }
            );
      }
    }
  };

  async function checkUser(newUser){
    // console.log("NU", newUser);
    
    return fetch(url+'/users', {
        method:"GET"
    }).then(response => response.json())
    .then(data => {
        let allUsers = data
        let countEmail = 0 
        let countUsername = 0 
  
        for(let user in allUsers){
            if (allUsers[user].email === newUser.email){
                countEmail++
            }else if(allUsers[user].username === newUser.name){
                countUsername++
            }
        }
  
        if (countEmail === 0 && countUsername === 0){
            return true 
        }else if(countEmail > 0){ 
          return {bool:false,count:'Email'}
        }
        else if(countUsername > 0){ 
          return {bool:false,count:'Username'}
        }
  
  
    }).catch(error => {
        console.log(error);
    })
  }


  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const toggleConPasswordVisibility = () => {
    setShowConPassword((prev) => !prev);
  };

  let nav = useNavigation()

  function goTo(x){
    setUname(false)
    setUemail(false)
    setUpass(false)
    setUpassconf(false)
    nav.navigate(x)
  }

  return (<>
    {loading && <Loader/>}
    <View style={styles.Register}>
    
    <View style={styles.Form}>
      <Text style={styles.Title}>Register</Text>
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
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={handleEmailChange}
          keyboardType='email-address'
        />
        {uemail && (
          <Text style={{ color: "red" }}>{uemail.message}</Text>
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
            <Text style={{ color: "red" }}>{upass.message}</Text>
            )}
            <TouchableOpacity style={styles.eyeIcon} onPress={togglePasswordVisibility}>
                <Text>{showPassword ? <Icon name='eye' size={20}/> : <Icon name='eye-with-line' size={20}/> }</Text>
            </TouchableOpacity>
        </View>
      </View>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Confirm Password</Text>
        <View style={{position:'relative'}}>
            <TextInput
            style={styles.input}
            placeholder="Confirm your password"
            secureTextEntry={!showConPassword}
            value={conpassword}
            onChangeText={handleConPasswordChange}
            />
            {upassconf && (
            <Text style={{ color: "red" }}>{upassconf.message}</Text>
            )}
            <TouchableOpacity style={styles.eyeIcon} onPress={toggleConPasswordVisibility}>
                <Text>{showConPassword ? <Icon name='eye' size={20}/> : <Icon name='eye-with-line' size={20}/> }</Text>
            </TouchableOpacity>
        </View>
      </View>
      <TouchableOpacity style={styles.BtnLogin} onPress={handleSubmit}>
        <Text style={styles.BtnLoginText}>Register</Text>
      </TouchableOpacity>

      <View style={{ flexDirection:'row', justifyContent:'center', gap:5, marginTop:30, width:'100%'}}>
        <Text>Already have an account?</Text>
        <Text style={{color:'#228D57', textDecorationLine:'underline'}} onPress={() => goTo('Login')}>Login Now!</Text>
      </View>
    </View>    
    </View>
  </>
  );
};

const styles = StyleSheet.create({
  Register: {
    flex: 1,
    padding: 20,
    backgroundColor:'#fff',
    alignItems:'center',
    justifyContent:'center',
    gap:50
  },
  Form:{
    width: "90%",
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    // marginTop:60,
    gap:10
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

export default Register;
