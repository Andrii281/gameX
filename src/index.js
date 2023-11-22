import { View, Text, StyleSheet, Switch, SafeAreaView, TouchableOpacity } from "react-native";
import React, { useEffect, useState, useRef } from "react";
import { Accelerometer } from 'expo-sensors';
import Animated, { useSharedValue, useDerivedValue, useAnimatedStyle, withSpring  } from 'react-native-reanimated';
import Line from "./line/Line";
import { useMetrics } from "../contex/MetricsContext";
import { Dimensions } from 'react-native';

const WIDTH = Dimensions.get('window').width;
const HEIGHT = Dimensions.get('window').height;

const RADIUS = 30;

const GyroScreen = () => {

  const [len, setLen] = useState(0);
  const [newX, setNewX] = useState(0);
  const dotColor = useSharedValue("blue");
  const accelerometrValue = useSharedValue({x:0,y:0});
  const prev = useSharedValue({x:0,y:0});
  const {metrics} = useMetrics();
  const [gyroEnabled, setGyroEnabled] = useState(true);

  console.log("metrics: ", metrics) 

  const deriveTranslations = useDerivedValue(() => {
    
      let newX = prev.value.x
      if(Math.abs(accelerometrValue.value.x) > 0.04){
        newX -= (accelerometrValue.value.x * 7);
      }
      let newY = prev.value.y
      if(Math.abs(accelerometrValue.value.y) > 0.04) {
        newY += (accelerometrValue.value.y * 7);
      }

      if(newX + 30 > WIDTH / 2) {
        console.log("WIDTH: ", WIDTH / 2)
        newX = (WIDTH / 2) - 30;
      }

      if(newX - 30 < -WIDTH / 2) {
        console.log("WIDTH: ", WIDTH / 2)
        newX = - WIDTH / 2 + 30;
      }

    prev.value = {
      x: newX,
      y: newY
    }

    const getDistance = (currentX, currentY, level = null) => {
      const checkLevel = level === null ? currentX : level;
      for(let i = metrics.length - 1; i >= 0; i--) {
        if(checkLevel > metrics[i].y1) {
          let localY = currentY - metrics[i].y1;
          let distance = Math.abs(((localY + RADIUS) * metrics[i].tg) - currentX + metrics[i].step)/Math.sqrt(Math.pow( metrics[i].tg, 2) + 1)
          return distance;
        }
      }
    }

    let distance = getDistance(newX, newY, newY + 30)
    // console.log("distance: ", distance)

    if(distance > 30) {
        dotColor.value = "red"
      } else {
        dotColor.value = "green"
      }

    // for(let i = metrics.length - 1; i >= 0; i--) {
    //   if(newY > metrics[i].y1) {
    //     let currentY = newY - metrics[i].y1;
    //     let lineXCorespond = ( newY - metrics[i].y1) * metrics[i].tg + metrics[i].step
    //     let distance = Math.abs(((currentY + RADIUS) * metrics[i].tg) - newX + metrics[i].step)/Math.sqrt(Math.pow( metrics[i].tg, 2) + 1)
    //     console.log("  lineXCorespond: ", lineXCorespond, "   distance: ", distance, "foo: ", getDistance(newX, newY))
        
    //     if(distance > 30) {
    //       dotColor.value = "red"
    //     } else {
    //       dotColor.value = "green"
    //     }
    //     break;
    //   }
    // }
    return {
      x: newX,
      y: newY 
    }
  })

  useEffect(() => {
    let subscription;
    if(gyroEnabled) {
      subscription = Accelerometer.addListener(({x, y, z}) => {
        accelerometrValue.value = {x, y}
      })
    } else {
      subscription?.remove();
    }
    return () => {
      subscription?.remove();
    };
  }, [gyroEnabled]);

  const handleGyroToggle = () => {
    setGyroEnabled(!gyroEnabled);
  }

  const AnimatedStyles = {
    motion: useAnimatedStyle(() => {
      return {
        backgroundColor: dotColor.value,
        transform: [
          {
            translateX: withSpring(deriveTranslations.value.x),
          }, 
          {
            translateY: withSpring(deriveTranslations.value.y),
          }
        ]
      }
    })
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={{position: "absolute"}}>
          <Text>len: {len}</Text>
          <Text>newX: {newX}</Text>
      </View>
      <Animated.View
        style={[styles.dot, AnimatedStyles.motion]}>
      </Animated.View>
      <View style ={{position: "absolute", width: "100%", height: "100%"}}>
        <Line />
      </View>
    </SafeAreaView>
  )
}

export default GyroScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    fontWeight: "bold",
    marginTop: 80
  },
  dot: {
    width: 2 * RADIUS,
    height: 2 * RADIUS,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  }
});
