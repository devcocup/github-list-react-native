/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

 import React, { useEffect, useState } from 'react';
 import {
   FlatList,
   Image,
   SafeAreaView,
   StatusBar,
   StyleSheet,
   Text,
   useColorScheme,
   View,
 } from 'react-native';
 import Icon from 'react-native-vector-icons/FontAwesome';
 import moment from 'moment';

 interface ItemProps {
   name: string;
   description: string;
   stars: number;
   username: string;
   avatar: string;
 }

 Icon.loadFont();

 const formatUsingAbbrevation = (count: number): string => {
  let suffixes = ["", "k", "m", "b","t"];
  let suffixNum = Math.floor(("" + count).length/3);
  let shortValue: number = parseFloat((suffixNum != 0 ? (count / Math.pow(1000,suffixNum)) : count).toPrecision(2));
  if (shortValue % 1 != 0) {
      shortValue = parseInt(shortValue.toFixed(1));
  }
  return shortValue + suffixes[suffixNum];
 }

 const App = () => {
   const isDarkMode = useColorScheme() === 'dark';
   const [items, setItems] = useState<ItemProps[]>([]);
   const [page, setPage] = useState<number>(1);
   const [loading, setLoading] = useState<boolean>(false);

   

   const fetchData = () => {
    const dateStr = moment().subtract(30,'days').format('YYYY-MM-DD');
    const URL = `https://api.github.com/search/repositories?q=created:>${dateStr}&sort=stars&order=desc&page=${page}`
    setLoading(true);
    fetch(URL, {
      method: 'GET',
    }).then(res => res.json())
    .then(result => {
      const data: ItemProps[] = result["items"].map((item: { name: any; description: any; stargazers_count: any; owner: { login: any; avatar_url: any; }; }) => {
        return {
          name: item.name,
          description: item.description,
          stars: item.stargazers_count,
          username: item.owner.login,
          avatar: item.owner.avatar_url
        }
      });
      console.log(data);
      setItems([...items, ...data]);
      setLoading(false);
    }).catch((err) => {
      console.log(err);
      setLoading(false);
    });
    
   }

   useEffect(() => {
    fetchData();
   }, []);

   const Item = ({
     name,
     description,
     avatar,
     username,
     stars
   }: ItemProps) => {
    return (
      <View style={styles.itemContainer}>
        <Text style={styles.title}>{name}</Text>
        <Text style={styles.description}>{description}</Text>
        <View style={[styles.row, {justifyContent: 'space-between', marginTop: 5}]}>
          <View style={styles.row}>
            <Image source={{uri: avatar}} style={styles.avatar}/>
            <Text style={styles.description}>{username}</Text>
          </View>
          <View style={styles.row}>
            <Icon name={'star'} />
            <Text style={styles.description}>{formatUsingAbbrevation(stars)}</Text>
          </View>
        </View>
      </View>
    )
   }

   const loadMoreData = () => {
     setPage(page + 1);
     fetchData();
   }

   const renderItem = ({item}: {item: ItemProps}) => (
     <Item name={item.name} description={item.description} stars={item.stars} username={item.username} avatar={item.avatar}/>
   )

   return (
     <SafeAreaView>
       <FlatList 
        data={items}
        renderItem={(item) => renderItem(item)}
        keyExtractor={(item: ItemProps, index: number) => `${item.username}-${index}`}
        onRefresh={fetchData}
        onEndReached={loadMoreData}
        refreshing={loading}
        ItemSeparatorComponent={() => <View style={styles.divider} />}
       />
     </SafeAreaView>
   );
 };

 const styles = StyleSheet.create({
   itemContainer: {
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
    paddingTop: 10,
   },
   title: {
     fontSize: 20,
     marginBottom: 5
   },
   description: {
     fontSize: 14,
   },
   row: {
     flexDirection: 'row',
     alignItems: 'center',
   },
   avatar: {
     width: 30,
     height: 30,
     borderRadius: 15,
     marginRight: 10,
   },
   divider: {
     height: 1,
     backgroundColor: 'lightgray',
   }
 });

 export default App;
