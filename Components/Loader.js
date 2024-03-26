import {Animated, View, StyleSheet, Easing } from 'react-native'
import React, { useEffect, useRef } from 'react'

export default function Loader() {

    const spinValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.loop(
        Animated.timing(
          spinValue,
          {
            toValue: 1,
            duration: 1500,
            easing: Easing.linear,
            useNativeDriver: true,
          }
        )
      ).start();
    }, [spinValue]);
  
    const spin = spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });

  return (
    <View style={Styles.loadercontainer}>
       <Animated.View style={{ transform: [{ rotate: spin }] }}>
      <View style={Styles.loader} />
      </Animated.View>
    </View>
  )
}

const Styles = StyleSheet.create({
    loadercontainer:{
        display: 'flex',
        width: 100,
        height: 100,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: '43%',
        left: '50%',
        transform: [{translateX: -50}],
        zIndex: 10,
        borderRadius: 10
    },
    loader: {
      width: 48,
      height: 48,
      borderWidth: 6,
      // borderStartColor:'#E8E9C9',
      borderStartColor:'white',
      borderEndColor:'white',
      borderBlockStartColor:'#228D57',
      borderBlockEndColor:'white',
      borderTopWidth: 6,
      borderRadius: 50,
    }


})
