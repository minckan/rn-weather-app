import * as Location from 'expo-location';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet, Text, ScrollView, Dimensions, ActivityIndicator } from 'react-native'; 
import { useEffect, useState } from 'react';
import { Fontisto } from '@expo/vector-icons'; 

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const API_KEY = '0f27b3a4b4c156ecc48d5474d0a292e2'

const icons = {
  Clouds: "cloudy",
  Clear: "day-sunny",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Rain: "rains",
  Drizzle: "rain",
  Thunderstorm: "lightning"
}

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
    const response = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude={alerts}&appid=${API_KEY}&units=metric`)
    const json = await response.json()
    setDays(json.daily);
    console.log(json.daily);
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
        {days.length === 0
          ? <View style={{...styles.day, alignItems: 'center'}}>
            <ActivityIndicator color={'white'} size={'large'} style={{marginTop:10 }}/>
          </View>
          : (
            days.map((day, index) => (
              <View key={index} style={styles.day}>
                <Text style={ styles.date}>{ `${new Date().getMonth() + 1} / ${new Date().getDate() + index}` }</Text>
                <View style={{ flexDirection: 'row', justifyContent:'space-between', alignItems: 'center', width: '100%'}}>
                  <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
                  <Fontisto name={ icons[day.weather[0].main]} size={68} color="white" />
                </View>
                <Text style={styles.description}>{day.weather[0].main}</Text>
                <Text style={styles.tinyText}>{ day.weather[0].description}</Text>
              </View>
            ))
          )}
      </ScrollView>
    </View>
  );
}


const styles = StyleSheet.create({
  constainer: {
    flex: 1, backgroundColor: "#ffb310", 
  },
  city: {
    flex: 1.2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cityName: {
    fontSize: 68,
    fontWeight: '500',
    color: 'white'
  },
  date: {
    fontSize: 34, color: 'white', fontWeight: '500'
  },
  weather: {
    color: 'white'
  },
  day: {
    alignItems: 'center', width: SCREEN_WIDTH, color: 'white',
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  temp: {
    fontSize: 100, color: 'white', marginTop: -10, fontWeight: '600'
  },
  description: {
    fontSize: 30, marginTop: -10,color: 'white', fontWeight: '500'
  },
  tinyText: {
    fontSize: 30, color: 'white', marginTop: -5, fontWeight: '500'
  }
})