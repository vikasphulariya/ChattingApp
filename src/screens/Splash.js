import {View, Text, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const Splash = () => {
  const navigation = useNavigation();
  useEffect(() => {
    setTimeout(() => {
      checkLogin();
    }, 10);
  }, []);
  const checkLogin = async () => {
    const id = await AsyncStorage.getItem('USERID');
    if (id !== null) {
      navigation.replace('Main');
    } else {
      navigation.replace('Login');
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>{'Firebase Chat\nApp'}</Text>
    </View>
  );
};

export default Splash;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'purple',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    fontSize: 40,
    color: 'white',
    textAlign: 'center',
  },
});
