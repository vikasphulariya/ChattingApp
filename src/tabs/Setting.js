import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';

const Setting = () => {
  const [mode, setMode] = useState('LIGHT');
  const [userInfo, setUserInfo] = useState([])
  const isFocued = useIsFocused();
  const changeMode = async x => {
    await AsyncStorage.setItem('MODE', x);
  };
  useEffect(() => {
    
    getMode();
    getInfo()
  }, [isFocued]);

const getInfo=async()=>{
  const email = await AsyncStorage.getItem('EMAIL');

  firestore()
  .collection('users')
  .where('email', '==', email)
  .get()
  .then(res => {
    console.log(res._docs[0]._data)
    setUserInfo(res._docs[0]._data)
  })
}

const getMode = async () => {
  let k=await AsyncStorage.getItem('MODE');
  if(k!=null){
    setMode(k);
  }
  console.log(k);
};
  return (
    <View
      style={[
        styles.container,
        {backgroundColor: mode == 'LIGHT' ? 'white' : '#212121'},
      ]}>
      <View style={styles.themChangeView}>
        <Text style={{color: mode == 'LIGHT' ? 'black' : 'white'}}>
          Change Mode
        </Text>
        <TouchableOpacity
          style={[
            styles.btn,
            {backgroundColor: mode == 'LIGHT' ? 'black' : 'white'},
          ]}
          onPress={() => {
            setMode(mode == 'LIGHT' ? 'DARK' : 'LIGHT');
            changeMode(mode == 'LIGHT' ? 'DARK' : 'LIGHT');
          }}>
          <Text style={{color: mode == 'LIGHT' ? 'white' : 'black'}}>
            Dark Mode
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{margin:30,alignItems:'center'}}> 
        <Text style={{color: mode == 'LIGHT' ? 'black' : 'white',fontSize:24}}>Profile</Text>
        </View>
        <View style={styles.themChangeView}>
        
        <Text style={{color: mode == 'LIGHT' ? 'black' : 'white',fontSize:20}}>
          Name
        </Text>
        <Text style={{color: mode == 'LIGHT' ? 'black' : 'white',fontSize:20}}>
          {userInfo.name}
        </Text>
      </View>
        <View style={styles.themChangeView}>
        
        <Text style={{color: mode == 'LIGHT' ? 'black' : 'white',fontSize:20}}>
          Email: 
        </Text>
        <Text style={{color: mode == 'LIGHT' ? 'black' : 'white',fontSize:20}}>
          {userInfo.email}
        </Text>
      </View>
        <View style={styles.themChangeView}>
        
        <Text style={{color: mode == 'LIGHT' ? 'black' : 'white',fontSize:20}}>
          Mobile: 
        </Text>
        <Text style={{color: mode == 'LIGHT' ? 'black' : 'white',fontSize:20}}>
          {userInfo.mobile}
        </Text>
      </View>
    </View>
  );
};

export default Setting;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  themChangeView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingLeft: 30,
    paddingRight: 30,
    height: 50,
    width: '90%',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: 50,
  },
  btn: {
    width: 100,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
});
