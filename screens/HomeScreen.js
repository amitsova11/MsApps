import * as React from 'react';
import { Image, Platform, StyleSheet, Text, TouchableOpacity, View ,Button,SafeAreaView} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/Feather';
import { Ionicons } from '@expo/vector-icons';
import { BarCodeScanner } from 'expo-barcode-scanner';
import Snackbar from "react-native-paper/src/components/Snackbar";


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


  _requestCameraPermission = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    this.setState({
      hasCameraPermission: status === 'granted',
    });
  };

  handleBarCodeScanned = (result) => {
    try {
      if (!this.state.scanned) {
        const {moviesList} = this.state;
        const movieData = JSON.parse(result.data);
        // Amit Sova: The image link in the QR Code refers to a website and is not a valid .jpg file. Therefore i have replaced it with the hardcoded link to the correct image.
        movieData.image = "https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_SY1000_CR0,0,704,1000_AL_.jpg"
        moviesList.push(movieData);
        moviesList.sort((e1, e2) => {
          return e1.releaseYear < e2.releaseYear
        })
        this.setState({scanned: result, moviesList, showQRScanner: false, showSuccessSnackbar: true});
      } else {
        this.setState({showQRScanner: false, showAlreadyScannedSnackbar: true})
      }
    }
    catch (e) {
      alert("Invalid QRCode")
      this.setState({showQRScanner: false});
    }
  };

  render() {
    const {moviesList, selectedMovie,showQRScanner} = this.state;
      return (
          <SafeAreaView style={{flex:1, backgroundColor: "white"}}>
            {showQRScanner ?
                this.state.hasCameraPermission === null
                    ?
                    <View>
                      <TouchableOpacity style = {{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "white",
                        borderRadius: 20,
                        width: 38,
                        marginTop: 10,
                        marginLeft: 10
                      }} onPress={()=> this.setState({showQRScanner: false})}>
                        <Icon name="arrow-left" size={35} color="black" iconStyle={{zIndex: 1000, marginLeft: 20}}/>
                      </TouchableOpacity>
                      <Text style={{ color: '#fff' }}>
                        {"Camera permission is not granted"}
                      </Text>
                    </View>
                    :
                    <View
                        style={{
                          height: "100%",
                          width: "100%",
                          flexDirection: 'column',
                          justifyContent: 'flex-start',
                        }}>
                      <BarCodeScanner
                          onBarCodeScanned={this.handleBarCodeScanned}
                          style={StyleSheet.absoluteFillObject}
                      />
                      <TouchableOpacity style = {{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "white",
                        borderRadius: 20,
                        width: 38,
                        marginTop: 10,
                        marginLeft: 10
                      }} onPress={()=> this.setState({showQRScanner: false})}>
                        <Icon name="arrow-left" size={35} color="black" iconStyle={{zIndex: 1000, marginLeft: 20}}/>
                      </TouchableOpacity>
                    </View> : null
            }
            <ScrollView contentContainerStyle={styles.container}   ref={ref => this.scrollView = ref}>
          {showQRScanner ? null : selectedMovie ?
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
                  {selectedMovie.genre.map((genre,index)=><Text key={index}>{index != selectedMovie.genre.length-1 ? genre + ", " : genre}</Text>)}
                </Text></View>
              </View>
              :
              <View style={{backgroundColor: "white", display: "flex",}}>
                <View style = {{
                  backgroundColor: "#65a892",
                  borderRadius: 40,
                  fontStyle:"bold",
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "50%",
                  alignSelf: "center"
                }}>
                  <Ionicons name="md-add-circle-outline" size={24} color="white" />
                  <Button
                      title="Add New Movie"
                      color="#fff"
                      style={{fontStyle:"bold"}}
                      onPress={() => {this._requestCameraPermission(); this.setState({showQRScanner: true})}}
                  />
                </View>
                {moviesList.map((movie, index)=>
                  <TouchableOpacity key = {index} onPress={()=> {this.setState({selectedMovie: movie }); this.scrollView.scrollTo({y:0})}}>
                    <View style={styles.movie}>
                      <Text style={{fontSize: 17}}>
                        {movie.title}
                      </Text>
                      <Icon name="info" size={20} color="#669999" />
                    </View>
                  </TouchableOpacity>
                )}
                <Snackbar
                    visible={this.state.showSuccessSnackbar}
                    onDismiss={() => this.setState({ showSuccessSnackbar: false })}
                    duration ={3000}
                    action={{
                      label: '',
                      color: "white",
                      onPress: () => {
                        this.setState({ showSuccessSnackbar: false })
                      },
                    }}
                    wrapperStyle={{textColor: "white", position: "absolute", top: 0, zIndex: 1000}}
                    style={{backgroundColor: "green"}}
                >
                  <Text style={{fontWeight: "bold", fontSize: 15}}>Movie Added Successfully!</Text>

                </Snackbar>
                <Snackbar
                    visible={this.state.showAlreadyScannedSnackbar}
                    duration ={3000}
                    onDismiss={() => this.setState({ showAlreadyScannedSnackbar: false })}
                    action={{
                      label: '',
                      onPress: () => {
                        this.setState({ showAlreadyScannedSnackbar: false })
                      },
                    }}
                    wrapperStyle={{fontColor: "white", color: "white",position: "absolute", top: 0,}}
                    style={{backgroundColor: "orange", color: "white", textColor: "white"}}
                >
                  <Text style={{fontWeight: "bold", fontSize: 15}}>Current movie already exists in the Database</Text>
                </Snackbar>
              </View>}
          </ScrollView>
        </SafeAreaView>
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
