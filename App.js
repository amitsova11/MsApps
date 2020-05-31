import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';
import { Platform, StatusBar, StyleSheet, View,ActivityIndicator , Text} from 'react-native';
import HomeScreen from "./screens/HomeScreen";
import AsyncStorage from '@react-native-community/async-storage';

const Stack = createStackNavigator();

class App extends React.Component{

  constructor(props){
    super(props);
    this.state={
        finishedLoading : false,
        movies: [],
    };
  }
    getMoviesFromApiAsync = async()=> {
        try {
            let response = await fetch(
                'http://api.androidhive.info/json/movies.json'
            );
            let json = await response.json();
            return json;
        } catch (error) {
            console.error(error);
        }
    }

     storeData = async (value) => {
        try {
            const jsonValue = JSON.stringify(value)
            await AsyncStorage.setItem('movies_list', jsonValue)
        } catch (e) {
            // saving error
        }
    }

    getData = async () => {
        try {
            const jsonValue = await AsyncStorage.getItem('movies_list')
            return jsonValue != null ? JSON.parse(jsonValue) : null;
        } catch(e) {
            // error reading value
        }
    }


    async componentDidMount() {
      //check if movies list is in local storage
        let movies = await this.getData("movies_list");
        //if not, get movies list from API and store in local storage
        if (!movies){
            movies = await this.getMoviesFromApiAsync();
            this.storeData(movies);
        }
    this.setState({movies, finishedLoading: true})
  }

  render() {
      const {finishedLoading,movies} = this.state;
    return (
                <View style={styles.container}>
                    {Platform.OS === 'ios' && <StatusBar barStyle="dark-content"/>}
                    {        finishedLoading?

                    <NavigationContainer>
                        <Stack.Navigator navigationOptions={
                            {headerShown: false}
                        }>
                            <Stack.Screen
                                name="Home"
                                component={HomeScreen}
                                initialParams={{ movies }}
                                options={{
                                    title: 'Movies List',
                                    headerStyle: {
                                        backgroundColor: '#00b3b3',
                                    },
                                    headerTintColor: '#fff',
                                    headerTitleStyle: {
                                        fontWeight: 'bold',
                                        fontSize: 20,
                                    },
                                }}
                                headerShown={false}
                                navigationOptions={
                                    {headerShown: false}
                                }
                            />
                        </Stack.Navigator>
                    </NavigationContainer> :
                    <View style={styles.container}>
                        <ActivityIndicator size="large" color="#00ff00" />
                    </View>
                    }
                </View>
    );
  }
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
      display: "flex",
      justifyContent: "center"
  },
});
