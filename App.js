import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import * as Location from "expo-location";
import { StatusBar } from "expo-status-bar";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const API_KEY = "99ee187344a227237be12765ba0a9100";

const weatherIcons = {
  Thunderstorm: "weather-lightning-rainy",
  Drizzle: "weather-hail",
  Rain: "weather-rainy",
  Snow: "weather-snowy",
  Atmosphere: "weather-fog",
  Clear: "weather-sunny",
  Clouds: "weather-cloudy",
};

export default function App() {
  const [location, setLocation] = useState([]);
  const [forecast, setForecast] = useState([]);
  const [error, setError] = useState(false);

  const getLocation = async () => {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      setError(true);
    }
    const {
      coords: { latitude, longitude },
    } = await Location.getCurrentPositionAsync({ accuracy: 3 });
    const location = await Location.reverseGeocodeAsync(
      { latitude, longitude },
      { useGoogleMaps: false }
    );
    setLocation(location[0]);
    getWeather(latitude, longitude);
  };

  const getWeather = async (latitude, longitude) => {
    const json = await (
      await fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`
      )
    ).json();
    setForecast(json.daily);
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.cityName}>{location.city}</Text>
      </View>
      {error ? (
        <View>Error</View>
      ) : (
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
        >
          {forecast.length === 0 ? (
            <View style={styles.weatherCard}>
              <ActivityIndicator size="large" />
            </View>
          ) : (
            forecast.map((today, index) => (
              <View key={index} style={styles.weatherCard}>
                <Text style={styles.temperature}>
                  {parseFloat(today.temp.day).toFixed(1)}°
                </Text>
                <View style={styles.description}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Text style={{ ...styles.bigText, marginRight: 10 }}>
                      {today.weather[0].main}
                    </Text>
                    <MaterialCommunityIcons
                      name={weatherIcons[today.weather[0].main]}
                      size="48"
                    />
                  </View>
                  <Text style={styles.littleText}>
                    {today.weather[0].description}
                  </Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "yellow" },
  header: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cityName: {
    fontSize: 38,
    fontWeight: "bold",
  },
  weatherCard: {
    flex: 1,
    width: SCREEN_WIDTH,
  },
  temperature: {
    marginTop: 30,
    marginLeft: 30,
    fontSize: 118,
    fontWeight: "bold",
  },
  description: {
    marginLeft: 40,
  },
  bigText: {
    fontSize: 38,
  },
  littleText: {
    fontSize: 20,
  },
});
