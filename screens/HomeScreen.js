import * as WebBrowser from 'expo-web-browser';
import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather';

import { MonoText } from '../components/StyledText';
import {Button} from "react-native-web";

class HomeScreen extends React.Component {

  constructor(props){
    super(props);
    this.state = {
      moviesList: [],
      selectedMovie: null,
    };
  }



  async componentDidMount() {
    let moviesList = this.props.route.params.movies;
    moviesList.sort((e1,e2)=>{return e1.releaseYear<e2.releaseYear})
    this.setState({moviesList})
  }


  render() {
    const {moviesList, selectedMovie} = this.state;
      return (
        <ScrollView automaticallyAdjustContentInsets={true} contentContainerStyle={styles.container}>
          {selectedMovie ?
              <View style={styles.movieDetails}>
                <TouchableOpacity onPress={()=> this.setState({selectedMovie: null})}>
                  <Icon name="arrow-left" size={35} color="#00b3b3" iconStyle={{marginLeft: 20}}/>
                </TouchableOpacity>
                <View style={styles.detail}><Text style={styles.detail}>{"Title: " + selectedMovie.title}</Text></View>
                <View style={styles.detail}>
                  <Text style={styles.detail}>{"Image: "}</Text>
                  <Image style={{height: 500}} source={{
                  uri: selectedMovie.image,
                  }}/>
                </View>
                <View style={styles.detail}><Text style={styles.detail}>{"Rating: " + selectedMovie.rating}</Text></View>
                  <View style={styles.detail}><Text style={styles.detail}>{"Release Year: " + selectedMovie.releaseYear}</Text></View>
                    <View style={styles.detail}><Text style={styles.detail}>{"Genres: "}
                  {selectedMovie.genre.map((genre,index)=><Text key={index}>{genre + ", "}</Text>)}
                </Text></View>
              </View>
              :
              <View style={{backgroundColor: "white"}}>
                {moviesList.map((movie, index)=>
              <TouchableOpacity key = {index} onPress={()=> {
                this.setState({selectedMovie: movie});
              }}>
                <View style={styles.movie}>
                  <Text style={{fontSize: 17}}>
                    {movie.title}
                  </Text>
                  <Icon name="info" size={20} color="#669999" />
                </View>
              </TouchableOpacity>
                )}
              </View>}
        </ScrollView>
      );
    }
}

export default HomeScreen;

HomeScreen.navigationOptions = {
  header: null,
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-evenly",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  movie:{
    paddingVertical:22,
    borderBottomWidth: 1,
    borderBottomColor: "#e6e6e6",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 10,
  },
  movieDetails:{
    display:"flex",
    flexDirection: "column",
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  detail:{
    position: "relative",
    fontSize:22,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#e6e6e6",
    width: "100%",
  }
});
