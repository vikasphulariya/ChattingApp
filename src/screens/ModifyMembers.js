// import { View, Text,StyleSheet } from 'react-native'
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Dimensions,
    Image,
    TouchableOpacity,
  } from 'react-native';
  import React, {useEffect, useState,} from 'react';
  import {useRoute} from '@react-navigation/native';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused, useNavigation} from '@react-navigation/native';
// import React from 'react'
import uuid from 'react-native-uuid';


const ModifyMembers = () => {

    const route = useRoute();
    const [members, setmembers] = useState([])
    const [users, setUsers] = useState([]);
    const navigation = useNavigation();
    const [mode, setMode] = useState('LIGHT');
    const isFocued = useIsFocused();
    useEffect(() => {
        console.log(route.params.id)
      getUsers();
      // getGroups()
    }, [isFocued]);
    useEffect(() => {
      getMode();
    }, [isFocued]);
    useEffect(() => {
    //   getMode();
    SelectMembers()
    }, [users]);

    const SelectMembers =async()=>{
        const email = await AsyncStorage.getItem('EMAIL');
        let k=[email]
        users.forEach(user =>{
            // console.log(user)
            if(user.isSelected){
                k.push(user.email)
            }
        })
        setmembers(k)
    }

    const createGroup = ()=>{
        // const userId = uuid.v4();

        firestore()
        .collection('groups')
        .doc(route.params.id)
        .update({
          members: members,
         
        })
        .then(res => {
          console.log('Group created ');
          navigation.goBack();
        })
        .catch(error => {
          console.log(error);
        });
    }
    const getMode = async () => {
      let k=await AsyncStorage.getItem('MODE');
      if(k!=null){
        setMode(k);
      }
      console.log(k);
    };

    const getUsers = async () => {
        id = await AsyncStorage.getItem('USERID');
        const email = await AsyncStorage.getItem('EMAIL');
        const usersSnapshot = await firestore()
          .collection('users')
          .where('email', '!=', email)
          .get();
      
        let tempData = [];
        for (const userDoc of usersSnapshot.docs) {
          const user = userDoc.data();
          const isEmailExists = await checkValueExistsInArray(user.email);
          if (isEmailExists) {
            console.log('Email exists in the members array', user.email);
            user.isSelected = true;
          } else {
            console.log('Email does not exist in the members array', user.email);
            user.isSelected = false;
          }
          tempData.push(user);
        }
      
        setUsers(tempData);
      };
      const checkEmailExists = async (email) => {
        const snapshot = await firestore()
          .collection('groups')
        //   .doc('route.params.')
          .where('members', 'array-contains', email)
          .get();
      
        return !snapshot.empty;
      };
      const onSelect=(ind)=>{
        let newData=users.map((item)=>{
    // console.log(temp)
    if(ind.email===item.email){
        // console.log("dsd",item.name)
        
        return{...item,isSelected:!item.isSelected};
    }
    else{
        // console.log(ind)
        return item;

    }
    
},
)



setUsers(newData)
      }


      const checkValueExistsInArray = async (id) => {
        const snapshot = await firestore()
          .collection('groups')
          .doc(route.params.id)
          .get();
    //   console.log(snapshot)

        if (snapshot.exists) {
          const documentData = snapshot.data();
          const arrayField = documentData['members'];
      
          if (Array.isArray(arrayField) && arrayField.includes(id)) {
            return true; // Value exists in the array field
            console.log("found")
        }
        else{
            
            // console.log("not found")
          }
        }
      
        return false; // Value does not exist in the array field or document doesn't exist
      };


      return (
        <View
          style={[
            styles.container,
            {backgroundColor: mode == 'LIGHT' ? 'white' : '#212121'},
          ]}>
        {/* <Text onPress={()=>{
            console.log('gdf')
            // checkValueExistsInArray()
        }} style={[styles.name,{color:mode !== 'LIGHT' ? 'white' : '#212121',alignSelf:'center',marginLeft:0,marginTop:20}]}>Group Members</Text> */}
          <FlatList
            data={users}
            // style={{backgroundColor:'red',height:5}}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  style={[styles.userItem, {backgroundColor:item.isSelected?'green': 'white'}]}
                  onPress={() => {
                    onSelect(item)
                  }}>
                  <Image
                    source={require('../images/user.png')}
                    style={styles.userIcon}
                  />
                  <Text style={styles.name}>{item.name}</Text>
                </TouchableOpacity>
              );
            }}
          />
          <View>

          {/* <Text style={[styles.name,{color:mode !== 'LIGHT' ? 'white' : '#212121',alignSelf:'center',marginLeft:0,marginTop:20}]}>Group Members</Text> */}
          </View>
          <TouchableOpacity onPress={()=>{
            // console.log(Date.parse(new Date()))
            createGroup();
            // console.log(members)
            
          }}
           style={[styles.btn,{backgroundColor: mode == 'LIGHT' ? 'black' : 'white',position:'absolute',alignItems:'center',padding:10,bottom:90,right:20
        }]}>
            <Text style={{color: mode == 'LIGHT' ? 'white' : 'black',fontSize:18,margin:0}}>Modify</Text>
            <Text style={{color: mode == 'LIGHT' ? 'white' : 'black',fontSize:18,margin:0}}>Group</Text>
          </TouchableOpacity>
        </View>
      );
    };

export default ModifyMembers

const styles = StyleSheet.create({
    container: {
      backgroundColor: 'white',
      flex: 1,
    },
    header: {
      width: '100%',
      height: 60,
      backgroundColor: 'white',
      elevation: 5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      color: 'purple',
      fontSize: 20,
      fontWeight: '600',
    },
    userItem: {
      width: Dimensions.get('window').width - 50,
      alignSelf: 'center',
      marginTop: 20,
      flexDirection: 'row',
      height: 60,
      borderWidth: 0.5,
      borderRadius: 10,
      paddingLeft: 20,
      alignItems: 'center',
    },
    userIcon: {
      width: 40,
      height: 40,
    },
    name: {color: 'black', marginLeft: 20, fontSize: 20},
    btn: {
      // width: 100,
      // height: 50,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      // padding:5,
      paddingHorizontal:20
    },
  });
  