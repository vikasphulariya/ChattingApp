import {View, Text,TouchableOpacity,StyleSheet,Dimensions} from 'react-native';
import React, {useCallback, useEffect, useState,} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import {useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';
import { InputToolbar } from 'react-native-gifted-chat';
const mode='LIGHT'
const Chat = ({navigation}) => {
  const [messageList, setMessageList] = useState([]);

  const route = useRoute();

   useEffect(() => {

     if(route.params.data.group){
      console.log('group load')
      const chatId = route.params.data.group ? route.params.data.userId : route.params.id + route.params.data.userId;
      // console.log("chatId")
      const subscriber = firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .orderBy('createdAt', 'desc');
      subscriber.onSnapshot(querySnapshot => {
        const allMessages = querySnapshot.docs.map(item => {
          return { ...item._data, createdAt: item._data.createdAt };
        });
        // console.log(allMessages)
        setMessageList(allMessages);
      });
      return () => subscriber();
    }
    else{
      console.log('single load')
      const subscriber = firestore()
      .collection('chats')
      .doc(route.params.id + route.params.data.userId)
      .collection('messages')
      .orderBy('createdAt', 'desc');
    subscriber.onSnapshot(querysnapshot => {
      const allmessages = querysnapshot.docs.map(item => {
        return {...item._data, createdAt: item._data.createdAt};
      });
      setMessageList(allmessages);
    });
    return () => subscriber();
    };

  }, []);

  const onSend = useCallback(async (messages = []) => {
    
    const msg = messages[0];
    console.log(msg.text);
    const myMsg = {
      ...msg,
      sendBy: route.params.id,
      sendTo: route.params.data.userId,
      createdAt: Date.parse(msg.createdAt),
    };

    
    setMessageList(previousMessages => GiftedChat.append(previousMessages, myMsg));
    if(route.params.data.group){

      console.log('group')
      const chatId = route.params.data.userId
      firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .add(myMsg);
      
      console.log('scvscsss')
      firestore()
      .collection('groups')
      .doc(chatId).update({
      recentMsg: msg.text
      }).then(() =>{
        console.log('scvsc')
      })

    }
    else{
      console.log('single')
      firestore()
      .collection('chats')
      .doc('' + route.params.id + route.params.data.userId)
      .collection('messages')
      .add(myMsg);

      //
      firestore()
      .collection('chats')
      .doc('' + route.params.id + route.params.data.userId)
      .set({latestMsg:Date.parse( new Date),recentMsg:msg.text})
      // .add(myMsg);


    firestore()
      .collection('chats')
      .doc('' + route.params.data.userId + route.params.id)
      .collection('messages')
      .add(myMsg);

      firestore()
      .collection('chats')
      .doc('' + route.params.data.userId + route.params.id).set({
        latestMsg:Date.parse( new Date),recentMsg:msg.text
      })
    }

console.log('frfr')
    firestore()
    .collection(route.params.data.group?'groups':'users')
    .doc(route.params.data.userId)
    .update({

      UpdatedAt:Date.parse(msg.createdAt),
      // group: route.params.data.group,
    })
    .then(res => {
      console.log('user created ');
      // navigation.navigate('Login');
    })
    .catch(error => {
      console.log("sdcsd",error,route.params.data.userId);
    });
    
  }, []);

  const customtInputToolbar = props => {
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          backgroundColor: "white",
          borderTopColor: "#E8E8E8",
          borderTopWidth: 1,
          padding: 5,
          paddingHorizontal:10,
          color:'black',
        }}
        textInputStyle={{
          color: 'black', // Change the text color here
        }}
  
      />
    );
  };

  return (
    <View style={{flex: 1}}>
      <GiftedChat 
        messages={messageList}
        onSend={messages => onSend(messages)}
        user={{
          _id: route.params.id,
        }}
        renderInputToolbar={props => customtInputToolbar(props)}
        col
      />
      {route.params.data.group?
<TouchableOpacity onPress={() => {
        navigation.navigate('Modify Participants',{ id:route.params.data.userId })
        console.log("ede")
        // const unsorted=users.sort((a,b) => {
        //   console.log(a.name<b.name);
        //   a.name< b.name ?1:-1;
        // })

        // console.log( unsorted)
        // setUsers(unsorted)
      }
      }
        style={[styles.btn, {
          backgroundColor: mode == 'LIGHT' ? 'black' : 'white', position: 'absolute', alignItems: 'center', padding: 10, top:20, right: 20
        }]}>
        <Text style={{ color: mode == 'LIGHT' ? 'white' : 'black', fontSize: 18, margin: 0 }}>Modify</Text>
        <Text style={{ color: mode == 'LIGHT' ? 'white' : 'black', fontSize: 18, margin: 0 }}>Group</Text>
      </TouchableOpacity>:null}
    </View>
  );
};

export default Chat;

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
    // height: 100,
    borderWidth: 0.5,
    borderRadius: 10,
    paddingLeft: 20,
    padding:10,
    alignItems: 'center',
  },
  userIcon: {
    width: 40,
    height: 40,
  },
  name: { color: 'black',fontWeight:'600', marginLeft: 20, fontSize: 20 },
  Disc: { color: 'green', marginLeft: 2, fontSize: 16,maxWidth:'90%',flexDirection:'row',flexWrap:'nowrap', },
  Msg: { color: 'green', marginLeft: 20, fontSize: 16,maxWidth:'90%',flexDirection:'row',flexWrap:'nowrap', },
  btn: {
    // width: 100,
    // height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    // padding:5,
    paddingHorizontal: 20
  },
});