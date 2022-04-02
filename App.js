import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, Text, ScrollView, Dimensions } from 'react-native'; 
import { useEffect, useState } from 'react';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const API_KEY = '0f27b3a4b4c156ecc48d5474d0a292e2'

export default function App() {
  const [city, setCity] = useState('Loading...')
  const [days, setDays] = useState([])
  const [ok, setOk] = useState(true)
  const ask = async () => {
    const {granted} = await Location.requestForegroundPermissionsAsync()
    if (!granted) {
      setOk(false)
    } 
    const {coords: {latitude, longitude}} = await Location.getCurrentPositionAsync({ accuracy: 5 })
    const location = await Location.reverseGeocodeAsync({ latitude, longitude }, { useGoogleMaps: false })
    setCity(location[0].city);
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude={alerts}&appid=${API_KEY}`)
    const json = await response.json()
    console.log(json);
  }
  useEffect(() => {
    ask()
  }, [])
  return (
    <View style={styles.constainer }>
      <View style={styles.city }>
        <Text style={styles.cityName}>{ city }</Text>
      </View>
      <ScrollView horizontal pagingEnabled showsHorizontalScrollIndicator={false} contentContainerStyle={styles.weather}>
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>sunny</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>sunny</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>sunny</Text>
        </View>
        <View style={styles.day}>
          <Text style={styles.temp}>27</Text>
          <Text style={styles.description}>sunny</Text>
        </View>
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  constainer: {
    flex: 1, backgroundColor: "#ffb310"
  },
  city: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center'
  },
  cityName: {
    fontSize: 68,
    fontWeight: '500'
  },
  weather: {
    
  },
  day: {
    alignItems: 'center', width: SCREEN_WIDTH
  },
  temp: {
    fontSize: 178, marginTop: 50
  },
  description: {
    fontSize: 60, marginTop: -30,
  }
})