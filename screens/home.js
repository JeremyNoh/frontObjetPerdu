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
import ville from '../assets/ville.json'
import typeObjet from '../assets/typeObjet.json'
import natureObjet from '../assets/natureObjet.json'

import MultiSelect from 'react-native-multiple-select';
// import { Dropdown } from 'react-native-material-dropdown';

class HomeScreen extends React.Component {
  constructor(){
    super()
    this.state = {
      ville: [],
      typeObject: [],
      natureObject: [],

    }
  }

  onVilleChange = (ville) => {
    this.setState({ ville });
  }

  onTypeChange = (typeObject) => {
    this.setState({ typeObject });
  }

  onNatureChange = (natureObject) => {
    this.setState({ natureObject });
  }

  submit() {
    console.log("get");
  }


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

  // villeView = () => {
  //
  // }


  render() {
     return (
       <View style={styles.container}>
       <Text h3 style={styles.title}>Etape 1 : Type d'objet perdu ? </Text>

       <MultiSelect
         hideTags
         items={typeObjet}
         uniqueKey="name"
         ref={(component) => { this.multiSelect = component }}
         onSelectedItemsChange={this.onTypeChange}
         selectedItems={this.state.typeObject}
         selectText="Choisi ton type d'objet"
         searchInputPlaceholderText="Search Items..."
         onChangeInput={ (text)=> console.log(text)}
         tagBorderColor="#CCC"
         tagTextColor="#CCC"
         selectedItemTextColor="#CCC"
         itemTextColor="#000"
         single={true}
         searchInputStyle={{ color: '#CCC' }}
       />

       <View style={styles.conter1}>
       <Text h3 style={styles.title}>Etape 2 : Renseigne ta ville </Text>
         <MultiSelect
           hideTags
           items={ville}
           uniqueKey="name"
           ref={(component) => { this.multiSelect = component }}
           onSelectedItemsChange={this.onVilleChange}
           selectedItems={this.state.ville}
           selectText="Choisi ton endroit "
           searchInputPlaceholderText="Recherche le nom de ta gare"
           onChangeInput={ (text)=> console.log(text)}
           tagBorderColor="#CCC"
           tagTextColor="#CCC"
           selectedItemTextColor="#CCC"
           itemTextColor="#000"
           single={true}
           searchInputStyle={{ color: '#CCC' }}
         />
         </View>

         <View style={styles.conter2}>
         <Text h3 style={styles.title}>Etape 3 :Affine ta recherche </Text>
           <MultiSelect
             hideTags
             items={natureObjet}
             uniqueKey="name"
             ref={(component) => { this.multiSelect = component }}
             onSelectedItemsChange={this.onNatureChange}
             selectedItems={this.state.natureObject}
             selectText="Decrit ton object   "
             searchInputPlaceholderText="Recherche le nom de ta gare"
             onChangeInput={ (text)=> console.log(text)}
             tagBorderColor="#CCC"
             tagTextColor="#CCC"
             selectedItemTextColor="#CCC"
             itemTextColor="#000"
             single={true}
             searchInputStyle={{ color: '#CCC' }}
           />
           </View>
           <Button
             title="Rechercher"
             titleStyle={{ fontWeight: "700" }}
             buttonStyle={styles.buttonStyle}
             containerStyle={{ marginTop: 20 }}
             onPress={this.submit}
           />
       </View>
     );
   }
}

export default HomeScreen;
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
