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
import { Card, CardTitle, CardContent, CardAction, CardButton } from 'react-native-cards';




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
    // recuperation des données de la page précédente
    let data = this.props.navigation.state.params.data || {}
    let query = this.props.navigation.state.params.query || "https://objetperduv2.herokuapp.com/api//lost_object/"
    let natureObject  = this.props.navigation.state.params.natureObject || []
    let station =  this.props.navigation.state.params.station || []
    let typeObject = this.props.navigation.state.params.typeObject  || []
    console.log(query);
    this.setState({data, query, natureObject, station,typeObject })
  }

  componentDidMount() {
  console.log("componentDidMount");

  // fetch de l'api pour recuperer les objet perdu en fonction des params
  fetch(this.state.query)
    .then(response => response.json())
    .then(responseJson => {
      let objeFound = []
      for (objectOne of responseJson.found_object) {
        objectFoundOne = {}
        objectFoundOne.id = objectOne.id
        objectFoundOne.date = objectOne.date

        // modification de l'id station en mot
        this.state.station.map( item => {
          if (item.id == objectOne.station ) {
            objectFoundOne.station = item.name
          }
        })

        // modification de l'id type en mot
        this.state.typeObject.map( item => {
          if (item.id == objectOne.typeObject ) {
            objectFoundOne.typeObject = item.name
          }
        })
        // modification de l'id nature en mot
        this.state.natureObject.map( item => {
          if (item.id == objectOne.natureObject ) {
            objectFoundOne.natureObject = item.name
          }
        })
        objeFound.push(objectFoundOne)
      }
      // console.log(objeFound);
      this.setState({ objeFound , isReady : true})

    })
    .catch(error => {
      console.error(error);
    });
}
  // Debut navigationOptions
  static navigationOptions = ({ navigation }) => {
    const { state, setParams, navigate } = navigation;
    return {
      headerTitle: "Objet perdu",
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
  isReady() {
    if (this.state.isReady) {
      return (
        <ScrollView>
          {this.state.objeFound.map((item, index) => (
            <Card key={index}>
              <CardTitle subtitle={item.natureObject} />
              <CardContent text={item.typeObject} />
              <CardAction separator={true} inColumn={false}>
                <CardButton
                  onPress={() => {}}
                  title="j'ajoute dans mon Panier"
                  color="#E41E62"
                />
              </CardAction>
            </Card>
          ))}
        </ScrollView>
      );
    }
  }

  render() {
     return (
       <View style={styles.container}>
       <Text h3 style={styles.title}>Vous avez {this.state.isReady && this.state.objeFound.length} Resultats  </Text>
       {this.isReady()}
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
