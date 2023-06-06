import {View, Text} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import {GiftedChat} from 'react-native-gifted-chat';
import {useRoute} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';
import uuid from 'react-native-uuid';

const Chat = () => {
  const [messageList, setMessageList] = useState([]);
  const route = useRoute();


  useEffect(() => {
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
  }, []);



  useEffect(() => {
    const chatId = route.params.data.group ? route.params.data.userId : route.params.id + route.params.data.userId;
    const subscriber = firestore()
      .collection('chats')
      .doc(chatId)
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot(querySnapshot => {
        const allMessages = querySnapshot.docs.map(item => {
          return { ...item.data(), createdAt: item.data().createdAt.toDate() };
        });
        setMessageList(allMessages);
      });

    return () => subscriber();
  }, []);

  const onSend = useCallback(async (messages = []) => {
    const msg = messages[0];
    const myMsg = {
      ...msg,
      sendBy: route.params.id,
      sendTo: route.params.data.userId,
      createdAt: Date.parse(msg.createdAt),
    };
    setMessageList(previousMessages =>
      GiftedChat.append(previousMessages, myMsg),
    );
    firestore()
      .collection('chats')
      .doc('' + route.params.id + route.params.data.userId)
      .collection('messages')
      .add(myMsg);
    firestore()
      .collection('chats')
      .doc('' + route.params.data.userId + route.params.id)
      .collection('messages')
      .add(myMsg);
      
      firestore()
      .collection('users')
      .doc(route.params.data.userId)
      .update({
        name: route.params.data.name,
        email: route.params.data.email,
        password: route.params.data.password,
        mobile: route.params.data.mobile,
        userId: route.params.data.userId,
        UpdatedAt:Date.parse(msg.createdAt),
        group: route.params.data.group
      })
      .then(res => {
        console.log('user created ');
        // navigation.navigate('Login');
      })
      .catch(error => {
        console.log(error);
      });


  }, []);

  return (
    <View style={{flex: 1}}>
      <GiftedChat
        messages={messageList}
        onSend={messages => onSend(messages)}
        user={{
          _id: route.params.id,
        }}
      />
    </View>
  );
};

export default Chat;
