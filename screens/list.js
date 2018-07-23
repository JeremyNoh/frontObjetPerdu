import React from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  View,
  Dimensions,
  Image,
  // Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";

import {Text , Button} from 'react-native-elements'



// import { Dropdown } from 'react-native-material-dropdown';

class ListScreen extends React.Component {
  constructor(){
    super()
    this.state = {
      // ville: [],
      // typeObject: [],
      // natureObject: [],

    }
  }


  componentWillMount() {
    console.log("componentWillMount");

  }
  // Debut navigationOptions
  static navigationOptions = ({ navigation }) => {
    const { state, setParams, navigate } = navigation;
    return {
      headerTitle: "ObjetPerdu",
      headerStyle: {
        backgroundColor: "#A80C7C"
      },
      headerTitleStyle: {
        color: "#fff"
      }
    };
  };
  // Fin navigationOptions
  // <Text h3 style={styles.title}>{this.state.data.test} </Text>


  render() {
     return (
       <View style={styles.container}>
       <Text h3 style={styles.title}>Voici vos resultats  </Text>
       
       </View>
     );
   }
}

export default ListScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: 'center',

  },
  title : {
    textAlign: "center",
    color : '#5C63D8',
    textDecorationLine : "underline" ,
    paddingTop : 20,
    paddingBottom : 20 ,
  },
  conter: {
    // backgroundColor: "#fff",
  },
  buttonStyle: {
  alignItems: "center",
  backgroundColor: "#66ff99",
  padding: 10,
  marginBottom: 30,
  marginTop: 50,
  borderRadius: 5
},

});
