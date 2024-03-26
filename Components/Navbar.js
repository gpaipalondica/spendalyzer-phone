import { Text, View, StyleSheet } from 'react-native'
import React, { Component } from 'react'

export default class Navbar extends Component {
  render() {
    return (
      <View style={style.navbar}>
        <Text style={{fontSize:26, fontWeight:'bold', color:'#E8E9C9'}}>$pendalyzer</Text>
      </View>
    )
  }
}

const style = StyleSheet.create({
navbar:{
    width:'100%',
    height:85,
    display:'flex', 
    justifyContent:'center', 
    alignItems:'center', 
    flexDirection:'row',
    paddingTop:35,
    paddingHorizontal: 40,
    backgroundColor:'#228D57',
    elevation:5
}
})

