import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';
import Loader from './Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';

export default function Home({authToken}) {

    const navigate = useNavigation()

    function goTo(x){
        navigate.navigate(x)
    }


  return (
    <View style={styles.Home}>
      <Text style={styles.Welcome}>Welcome to $pendalyzer</Text>
      
      {/* button  */}
      {authToken
      ?
      <TouchableOpacity style={[styles.GetStarted, {backgroundColor:'#228D57'}]} onPress={() => goTo('Expense')}>
        <Text style={styles.GetStartedText}>My Expenses</Text>
      </TouchableOpacity>
      :
      <TouchableOpacity style={[styles.GetStarted, {backgroundColor:'#228D57'}]} onPress={() => goTo('Login')}>
        <Text style={styles.GetStartedText}>Get Started</Text>
      </TouchableOpacity>
      }

      <Text style={styles.footer}>Created by Gaurang Pai Palondicar</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    Home:{
        width:'100%',
        flex:1,
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
        marginTop:-60,
        gap:50,
    },
    Welcome:{
        fontSize:24,
        color:"black",
        fontWeight:'bold'
    },
    GetStarted:{
        paddingVertical: 8,
        paddingHorizontal:15,
        borderRadius: 10,
    },
    GetStartedText:{
        color: '#E8E9C9',
        textAlign:'center',
        fontSize:16,
        fontWeight:'bold'
    },
    footer:{
      position:'absolute',
      bottom:40,
      fontStyle:'italic',
      fontSize:11,
      color:'#bbb'

    }
})