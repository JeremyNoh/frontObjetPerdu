import React from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  View,
  Dimensions,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,

} from "react-native";


class HomeScreen extends React.Component {


  // Debut navigationOptions
  static navigationOptions = ({ navigation }) => {


    return {
      headerTitle: "ObjetPerdu",
      headerStyle: {
        backgroundColor: "#A80C7C"
      },
      headerTitleStyle: {
        color: "#fff"
      },
    };
  };
  // Fin navigationOptions

render() {
    return (
      <View style={styles.container}>
      <Text> Home Page</Text>
      <Text> :D</Text>
      </View>
    );
  }
}

export default HomeScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: 'center',

  },
  title : {
    textAlign: "center",
    color : '#5C63D8',
    textDecorationLine : "underline" ,
    paddingTop : 20,
    paddingBottom : 20 ,
  },


});
