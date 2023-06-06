// import { View, Text,StyleSheet } from 'react-native'
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Dimensions,
    Image,
    TouchableOpacity,
    TextInput,ToastAndroid
  } from 'react-native';
  import React, {useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useIsFocused, useNavigation} from '@react-navigation/native';
// import React from 'react'
import uuid from 'react-native-uuid';



const SelectMembers = () => {
    const [members, setmembers] = useState([])
    const [users, setUsers] = useState([]);
    const navigation = useNavigation();
    const [mode, setMode] = useState('LIGHT');
  // let mode ='DARK'
    const isFocued = useIsFocused();
    const [groupName, setGroupName] = useState('')
    const [validator, setValidator] = useState(false)
// console.log(mode)
    useEffect(() => {
      getMode();
      console.log(mode);
    }, [isFocued]);
    
    useEffect(() => {
      getUsers();
      // getGroups()
    }, [isFocued]);
    useEffect(() => {
      // getMode();
    }, [isFocued]);
    useEffect(() => {
    //   getMode();
    SelectMembers()
    }, [users]);
    useEffect(() => {
    //   getMode();
    //console.log(groupName)

    if(groupName.length > 0 && members.length > 1) {
      setValidator(true)
   //   console.log('i ran true')
    }else{
      setValidator(false)
//console.log('i ran false')
    }
    }, [users,groupName]);

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
        const userId = uuid.v4();
        firestore()
        .collection('groups')
        .doc(userId)
        .set({
          name: groupName,
          members: members,
          UpdatedAt:Date.parse( new Date),
          userId: userId,
          group:true,
          recentMsg:"No Messages Yet"
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
        let tempData = [];
        const email = await AsyncStorage.getItem('EMAIL');
        firestore()
          .collection('users')
          .where('email', '!=', email)
          .get()
          .then(res => {
            if (res.docs != []) {
              res.docs.map(item => {
                // userd="wscsdc"
                k=item.data()
                k.isSelected=false
             //   console.log("fsf",k)
                tempData=[...tempData,item.data()]
              });  
            }
            // console.log("aska",tempData.length);
            setUsers(tempData);
          });
          // let b=tempData
          // setUsers(tempData);
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
      return (
        <View
          style={[
            styles.container,
            {backgroundColor: mode == 'LIGHT' ? 'white' : '#212121'},
          ]}>
        <TextInput  onPressIn={()=>{console.log('')}}
        style={{width:Dimensions.get('window').width - 50,borderRadius:10,fontSize:18,
        backgroundColor: mode == 'LIGHT' ? 'white' : 'black',
        alignSelf:'center',
        paddingHorizontal:10,
          borderWidth:1,
          borderColor:'#c0c0c0',
        marginTop:10,
        color:mode == 'LIGHT' ? 'black' : 'white'}}
        placeholder='Enter Group Name'
        placeholderTextColor={mode == 'LIGHT' ? 'black' : 'white'}
        value={groupName}
        onChangeText={(e)=>{setGroupName(e)}}
        />
          <FlatList
            data={users}
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
          <TouchableOpacity onPress={()=>{
            // console.log(Date.parse(new Date()))
            if(!(groupName.length > 0 && members.length > 1)){
              console.log('sdsd');
              ToastAndroid.show(`Please select Participants\nAnd a Group Name`,100)
            }
            else{

              createGroup();
            }
            // console.log(members)
            
          }}
           style={[styles.btn,{backgroundColor: groupName.length > 0 && members.length > 1 ? 'green' : 'grey',position:'absolute',alignItems:'center',padding:10,bottom:50,right:20
        }]}>
            <Text style={{color: mode == 'LIGHT' ? 'white' : 'black',fontSize:18,margin:0}}>Create</Text>
            <Text style={{color: mode == 'LIGHT' ? 'white' : 'black',fontSize:18,margin:0}}>Group</Text>
          </TouchableOpacity>
        </View>
      );
    };

export default SelectMembers

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
  