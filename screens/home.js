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

import {Text , Button, Card} from 'react-native-elements'

// import ville from '../assets/ville.json'
// import typeObjet from '../assets/typeObjet.json'
// import natureObjet from '../assets/natureObjet.json'

import MultiSelect from 'react-native-multiple-select';
// import { Dropdown } from 'react-native-material-dropdown';

class HomeScreen extends React.Component {
  constructor(){
    super()
    this.state = {

      isVille : false,
      isAffine : false,
      isCard : true,
    }
  }

  // fetch pour récupérer les 3 infos de recherche
  componentWillMount() {
    fetch("https://objetperduv2.herokuapp.com/api/lost_object/stations")
      .then(response => response.json())
      .then(responseJson => {
         station = []
        for (OneStation of responseJson.station) {
          villeOne= {}
          villeOne.id  = OneStation.id
          villeOne.name  = OneStation.stationName
          station.push(villeOne)
        }
        this.setState({ station : station})
      })
      .catch(error => {
        console.error(error);
      });

      fetch("https://objetperduv2.herokuapp.com/api/lost_object/natures")
        .then(response => response.json())
        .then(responseJson => {
           natureObject = []
          for (OneNatureObject of responseJson.nature) {
            natureOne= {}
            natureOne.id  = OneNatureObject.id
            natureOne.name  = OneNatureObject.natureObject
            natureObject.push(natureOne)
          }
          this.setState({ natureObject})
        })
        .catch(error => {
          console.error(error);
        });

        fetch("https://objetperduv2.herokuapp.com/api/lost_object/types")
          .then(response => response.json())
          .then(responseJson => {
             typeObject = []
            for (OnetypeObject of responseJson.type) {
              typeOne= {}
              typeOne.id  = OnetypeObject.id
              typeOne.name  = OnetypeObject.typeObject
              typeObject.push(typeOne)
            }
            this.setState({ typeObject})
          })
          .catch(error => {
            console.error(error);
          });

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
      },
    };
  };
  // Fin navigationOptions

  // maj du state sur la station séléctionnée
  onVilleChange = (stationChoice) => {
    this.setState({ stationChoice});
  }

  // maj du state sur le type d'objet séléctionné
  onTypeChange = (typeChoice) => {
    this.setState({ typeChoice, isAffine : true });
  }

  // maj du state sur la nature d'objet séléctionnée
  onNatureChange = (natureChoice) => {
    this.setState({ natureChoice, isVille : true });

  }
     // sid ( station id), tid, ( typeid), nid (nature id), did ( date id )
  submit() {
    var query = "https://objetperduv2.herokuapp.com/api//lost_object/"
    var data =  {}
    if (!(this.state.typeChoice === undefined)) {
      data.typeChoice = this.state.typeChoice[0]
      query += `?tid=${this.state.typeChoice[0]}`
    }
    if (!(this.state.stationChoice === undefined)) {
      data.stationChoice = this.state.stationChoice[0]
      query += `&sid=${this.state.stationChoice[0]}`
    }

    if (!(this.state.natureChoice === undefined)) {
      data.natureChoice = this.state.natureChoice[0]
      query += `&nid=${this.state.natureChoice[0]}`
    }
    // console.log(query);
    this.props.navigation.navigate("list" , {query, data,natureObject, station,typeObject});
    console.log('get');
  }

  villeView = () => {
  return (
           <View >
           <Card
           key= {3}
           title ="Etape 3 : Renseigne ta ville"
           >
             <MultiSelect
               hideTags
               items={this.state.station}
               uniqueKey= "id"
               ref={(component) => { this.multiSelect = component }}
               onSelectedItemsChange={this.onVilleChange}
               selectedItems={this.state.stationChoice}
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
             </Card>

             </View>
  )
  }

  affineView = () => {
    return(

      <View style={styles.conter}>
      <Card
      key= {2}
      title = 'Etape 2 :Affine ta recherche'
      >
        <MultiSelect
          hideTags
          items={this.state.natureObject}
          uniqueKey="id"
          ref={(component) => { this.multiSelect = component }}
          onSelectedItemsChange={this.onNatureChange}
          selectedItems={this.state.natureChoice}
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
        </Card>
      </View>


    )
  }


  closeCard( ){
    this.setState({isCard : false})
  }

  card = () => {
    return (
      <Card
      key= {5}
      containerStyle ={styles.cardTitle}
      dividerStyle={styles.cardTitle}
         title='Bonjour '
         >
         <Text style={{marginBottom: 10}}>
         Le but de cette appli , est de retrouver ton objet
         que tu as perdu dans une gare SNCF
         </Text>
         <Button
           backgroundColor='#03A9F4'
           buttonStyle={{borderRadius: 0, marginLeft: 0, marginRight: 0, marginBottom: 0}}
           title="J'ai Compris !"
           onPress={ () => this.closeCard() }/>
       </Card>
    )
  }
  // <Text h5 style={styles.title}>Etape 1 : Type d'objet perdu ? </Text>


  render() {
     return (
       <View style={styles.container}>
       {this.state.isCard  && this.card()}
              <ScrollView>
       <Card
       key= {1}
       title="Etape 1 : Type d'objet perdu ?"
       >
       <MultiSelect
         hideTags
         items={this.state.typeObject}
         uniqueKey="id"
         ref={(component) => { this.multiSelect = component }}
         onSelectedItemsChange={this.onTypeChange}
         selectedItems={this.state.typeChoice}
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
       </Card>

       {this.state.isAffine && this.affineView()}
       {this.state.isVille  && this.villeView()}
       </ScrollView>
       <Button
         title="Rechercher"
         titleStyle={{ fontWeight: "700" }}
         buttonStyle={styles.buttonStyle}
         containerStyle={{ marginTop: 20 }}
         onPress={() => this.submit()}
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
    // textDecorationLine : "underline" ,
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
 cardTitle:{
    backgroundColor: '#A6ACAF',
    borderRadius: 5,
 },

});
