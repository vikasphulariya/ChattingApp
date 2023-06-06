import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Dimensions,
  Image,
  TouchableOpacity,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useIsFocused, useNavigation } from '@react-navigation/native';
let id = '';
const Users = () => {
  const [users, setUsers] = useState([]);
  const navigation = useNavigation();
  const [mode, setMode] = useState('LIGHT');
  const isFocued = useIsFocused();

  useEffect(() => {
    loadUsers();
    getUsers();
    // getGroups()
  }, [isFocued]);

  useEffect(() => {
    getMode();
  }, [isFocued]);

  const loadUsers = async() =>{
    let userTempStorgae=await AsyncStorage.getItem('Users')
    console.log("load",userTempStorgae)
    if(userTempStorgae!=null){
      console.log("data Load",userTempStorgae)
      setUsers(JSON.parse(userTempStorgae))
    }
  }

  const getMode = async () => {
    let k=await AsyncStorage.getItem('MODE');
    if(k!=null){
      setMode(k);
    }
    console.log(k);
  };
  const getUsers = async () => {
    try {
      
      let chated = []
      let nonchated = []
    let tempData = []
    let group = []
    const ss = await AsyncStorage.getItem('USERID');
    id = await AsyncStorage.getItem('USERID');
    // let tempData = [];
    const email = await AsyncStorage.getItem('EMAIL');
    firestore()
      .collection('users')
      .where('email', '!=', email)
      .get()
      .then(res => {
        if (res.docs != []) {
          res.docs.map(async (item) => {
            // userd="wscsdc"
            k = item.data()
            // console.log("fassef", k)
            tempData = [...tempData, item.data()]
           
          });
        }


       
        firestore()
          .collection('groups')
          .where('members', 'array-contains', email)
          .get()
          .then(async(res) => {
            if (res.docs != []) {
              res.docs.map(async (item) => {
                kr=item.data()

                kr.latestMsg = kr.UpdatedAt
                // console.log("Ss", kr.name, kr.UpdatedAt,kr.latestMsg)
                // tempData.push(item.data());
                group.push(item.data());
              });
            }
            // console.log(group)  

              for (const item of tempData) {
                try {
                  const isDocumentAvailable = await checkDocumentAvailability('chats', item.userId + id);
                  // console.log(isDocumentAvailable);
                  // console.log(item.name);
                  if (isDocumentAvailable) {
                    // Document is available in the collection
                    // console.log("Available", item.name, item.userId + id);
                    const doc = await firestore()
                      .collection('chats')
                      .doc(item.userId + id)
                      .get();
                    // console.log(doc.data().latestMsg);
                    item.latestMsg = doc.data().latestMsg;
                    let fullDisc=doc.data().recentMsg
                    // console.log(fullDisc.slice(0,20));
                    if(fullDisc.length>20){
                      // console.log("long")
                      fullDisc=fullDisc.slice(0,20)+"....";
                      // console.log(fullDisc)
                    }
                  item.recentMsg = fullDisc;
                    // console.log('dddgg', k);
                    // console.log(chated.length);
                    chated.push(item);
                  } else {
                    // Document is not available in the collection
                    // console.log("Not Available", item.name, item.userId + id);
                    item.latestMsg = item.CreatedAt;
                    item.recentMsg = 'No Messages Yet';
                    nonchated.push(item);
                  }
                } catch (error) {
                  console.error('Error:', error);
                }
              }
              // console.log(chated);
              // console.log(nonchated.length);
              // console.log(nonchated.length);
              console.log("gd",group);
              // console.log("cd",chated);
              // console.log("nd",nonchated);
              
              const mergedList = [...group, ...chated, ...nonchated];
          
            // console.log(mergedList);
          
         
            mergedList.forEach(async(item)=>{})
            const unsorted = mergedList.sort((a, b) => {
                if (a.latestMsg < b.latestMsg) return 1;
              if (a.latestMsg > b.latestMsg) return -1;
              return 0;
            });

   
            setUsers(unsorted)
            const stringifyUsersData = JSON.stringify(unsorted);
            await AsyncStorage.setItem('Users', stringifyUsersData);
            // unsorted.forEach((i) => {
            //   let kkk=new Date(i.latestMsg)
            //   console.log(kkk.getMinutes);
            // })
            
            // tempData=[...tempData,tempData];
          })
        // console.log(tempData.length);
        // setUsers(tempData);
        
        
      
        
      
      })
    } catch (error) {
      
    }
  
    
    };


   

  const checkDocumentAvailability = async (collectionName, documentId) => {
    const documentRef = firestore().collection(collectionName).doc(documentId);
    const documentSnapshot = await documentRef.get();
    return(documentSnapshot.exists);
 
      }
    


  return (
    <View
      style={[
        styles.container,
        { backgroundColor: mode == 'LIGHT' ? 'white' : '#212121' },
      ]}>
      <View style={styles.header}>
        <Text style={styles.title} onPress={() => {
          console.log("ede")
          const unsorted = users.sort((a, b) => a.name.localeCompare(a.name));

          console.log(unsorted)
          setUsers(unsorted)
        }
        }>Simple Chat App</Text>
      </View>
      <FlatList
        data={users}
        renderItem={({ item, index }) => {
          return (
            <TouchableOpacity
              style={[styles.userItem, { backgroundColor: 'white' }]}
              onPress={() => {
                console.log(item);
                navigation.navigate('Chat', { data: item, id: id });
              }}>
              <Image
                source={require('../images/user.png')}
                style={styles.userIcon}
              />
              <View>

              <Text style={styles.name}>{item.name}</Text>
              <View style={{flexDirection:'row',width:'85%',}}>

              <Text style={styles.Msg}>Msg:</Text>
              <Text style={[styles.Disc,{color:item.recentMsg==='No Messages Yet'?'red':'green'}]}>{item.recentMsg}</Text>
              </View>
              </View>
              
            </TouchableOpacity>
          );
        }}
      />
      <TouchableOpacity onPress={() => {
        navigation.navigate('Select Participants')
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
          backgroundColor: mode == 'LIGHT' ? 'black' : 'white', position: 'absolute', alignItems: 'center', padding: 10, bottom: 90, right: 20
        }]}>
        <Text style={{ color: mode == 'LIGHT' ? 'white' : 'black', fontSize: 18, margin: 0 }}>New </Text>
        <Text style={{ color: mode == 'LIGHT' ? 'white' : 'black', fontSize: 18, margin: 0 }}>Group</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Users;
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
