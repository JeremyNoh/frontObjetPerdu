// @flow
import React from "react";
import {
  Alert,
  Platform,
  StyleSheet,
  View,
  Dimensions,
  Image,
  // Text,
  Modal,
  TouchableHighlight,
  TouchableOpacity,
  ScrollView,
  TextInput
} from "react-native";

import { Text, Button, Card ,Badge} from "react-native-elements";
import {
  CardTitle,
  CardContent,
  CardAction,
  CardButton
} from "react-native-cards";

// import ville from '../assets/ville.json'
// import typeObjet from '../assets/typeObjet.json'
// import natureObjet from '../assets/natureObjet.json'

import MultiSelect from "react-native-sectioned-multi-select";

type Props = {
  /* ... */
};

type State = {
  modalVisible: boolean,
  isAffine: boolean,
  isCardInfo: boolean,
  page: number,
  station: array,
  natureObject: array,
  typeObject: array,
  stationChoice: array,
  typeChoice: array,
  natureChoice: array,
  newNatureObject: array,
  isSearchReady: boolean,
  objeFound: array,
  PageMax: number,
  nbrObj: number
};

class HomeScreen extends React.Component<Props, State> {
  constructor() {
    super();
    this.state = {
      modalVisible: false,
      isAffine: false,
      isCardInfo: true,
      page: 1,
      station: [],
      natureObject: [],
      typeObject: [],
      stationChoice: undefined,
      typeChoice: undefined,
      natureChoice: undefined,
      newNatureObject: [],
      isSearchReady: false,
      objeFound: [],
      PageMax: undefined,
      nbrObj: undefined
    };
  }

  // fetch pour récupérer les 3 infos de recherche
  componentWillMount(): any {
    console.log("start");
    fetch("https://objetperduv2.herokuapp.com/api/lost_object/stations")
      .then(response => response.json())
      .then(responseJson => {
        var station: array = [];
        for (var OneStation of responseJson.station) {
          var villeOne = {};
          villeOne.id = OneStation.id;
          villeOne.name = OneStation.stationName;
          station.push(villeOne);
        }
        this.setState({ station });
      })
      .catch(error => {
        console.error(error);
      });

    fetch("https://objetperduv2.herokuapp.com/api/lost_object/natures")
      .then(response => response.json())
      .then(responseJson => {
        var natureObject: array = [];
        for (var OneNatureObject of responseJson.nature) {
          var natureOne = {};
          natureOne.id = OneNatureObject.id;
          natureOne.name = OneNatureObject.natureObject;
          natureOne.idType = OneNatureObject.type_object_id;
          natureObject.push(natureOne);
        }
        this.setState({ natureObject });
      })
      .catch(error => {
        console.error(error);
      });

    fetch("https://objetperduv2.herokuapp.com/api/lost_object/types")
      .then(response => response.json())
      .then(responseJson => {
        var typeObject: array = [];
        for (var OnetypeObject of responseJson.type) {
          var typeOne = {};
          typeOne.id = OnetypeObject.id;
          typeOne.name = OnetypeObject.typeObject;
          typeObject.push(typeOne);
        }
        this.setState({ typeObject });
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
      }
    };
  };
  // Fin navigationOptions

  // maj du state sur la station séléctionnée
  onVilleChange = (stationChoice: [number]) => {
    this.setState({ stationChoice });
  };

  // maj du state sur le type d'objet séléctionné
  onTypeChange = (typeChoice: [number]) => {
    this.majNature(typeChoice[0]);
    this.setState({ typeChoice });
  };

  // maj des natures d'objet pour afficher en fonction du type
  majNature(numbertype: number | string) {
    var newNatureObject: array = [];
    for (var obj of this.state.natureObject) {
      if (numbertype == obj.idType) {
        newNatureObject.push(obj);
      }
    }
    this.setState({ isAffine: true, newNatureObject });
  }

  // maj du state sur la nature d'objet séléctionnée
  onNatureChange = (natureChoice: number) => {
    this.setState({ natureChoice });
  };
  // sid ( station id), tid, ( typeid), nid (nature id), did ( date id )
  submit() {
    var query: string = `https://objetperduv2.herokuapp.com/api/lost_object/page=${
      this.state.page
    }/`;
    var data = {};

    if (!(this.state.typeChoice == undefined)) {
      data.typeChoice = this.state.typeChoice[0];
      if (this.firstParams(query)) {
        query += `?tid=${this.state.typeChoice[0]}`;
      }
      else {
        query += `&tid=${this.state.typeChoice[0]}`;
      }

    }
    if (!(this.state.stationChoice == undefined)) {
      data.stationChoice = this.state.stationChoice[0];
      if (this.firstParams(query)) {
        query += `?sid=${this.state.stationChoice[0]}`;
      }
      else {
        query += `&sid=${this.state.stationChoice[0]}`;
      }
    }

    if (!(this.state.natureChoice == undefined)) {
      data.natureChoice = this.state.natureChoice[0];
      if (this.firstParams(query)) {
        query += `?nid=${this.state.natureChoice[0]}`;
      }
      else {
        query += `&nid=${this.state.natureChoice[0]}`;
      }
    }
    // navigue sur la page des card , avec les params nécéssaires
    // this.props.navigation.navigate("list" , {query, data,natureObject, station,typeObject});

    // ferme le modal
    this.fetchResult(query);
    this.setModalVisible(!this.state.modalVisible);
  }

// renvois un boolean pour savoir si c'est le first params sur la query
  firstParams(query : string ) : boolean{
    query = query.substr(query.length-1, 1)
    if (query == "/") {
      return true
    }
      else {
        return false;
      }
  }

  // fetch les objet Perdu en fonction des params de la query
  fetchResult(query: string) {
    console.log(query);
    fetch(query)
      .then(response => response.json())
      .then(responseJson => {
        // gestion d'erreur si pas d'objet
        if (responseJson.information) {
          var PageMax: number = responseJson.information.pages;
          var nbrObj: number = responseJson.information.objects;
          let objeFound: array = [];
          for (var objectOne of responseJson.found_object) {
            var objectFoundOne = {};
            objectFoundOne.id = objectOne.id;
            objectFoundOne.date = objectOne.date;

            // modification de l'id station en mot
            this.state.station.map(item => {
              if (item.id == objectOne.station) {
                objectFoundOne.station = item.name;
              }
            });

            // modification de l'id type en mot
            this.state.typeObject.map(item => {
              if (item.id == objectOne.typeObject) {
                objectFoundOne.typeObject = item.name;
              }
            });
            // modification de l'id nature en mot
            this.state.natureObject.map(item => {
              if (item.id == objectOne.natureObject) {
                objectFoundOne.natureObject = item.name;
              }
            });
            objeFound.push(objectFoundOne);
          }
          this.setState({ objeFound, isSearchReady: true, PageMax, nbrObj });
        } else {
          // erreur connection ou autres
          var objeFound : array = [];
          this.setState({ objeFound, isSearchReady: true, PageMax : undefined, nbrObj: undefined });
          console.log(responseJson.Error);
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  // Card sur la Gare
  villeView = () => {
    return (
      <View>
        <Card key={3} title="Rechercher la Gare :">
          <MultiSelect
            hideTags
            items={this.state.station}
            uniqueKey="id"
            ref={component => {
              this.multiSelect = component;
            }}
            onSelectedItemsChange={this.onVilleChange}
            selectedItems={this.state.stationChoice}
            selectText="Recherche Une gare SNCF "
            searchInputPlaceholderText="Recherche le nom de ta gare"
            onChangeInput={text => console.log(text)}
            showCancelButton={true}
            tagBorderColor="#CCC"
            tagTextColor="#CCC"
            selectedItemTextColor="#CCC"
            itemTextColor="#000"
            single={true}
            searchInputStyle={{ color: "#CCC" }}
          />
        </Card>
      </View>
    );
  };

  // Card sur la nature de l'objet
  affineView = () => {
    return (
      <View>
        <Card key={2} title="Affine ta recherche">
          <MultiSelect
            hideTags
            items={this.state.newNatureObject}
            uniqueKey="id"
            ref={component => {
              this.multiSelect = component;
            }}
            onSelectedItemsChange={this.onNatureChange}
            selectedItems={this.state.natureChoice}
            selectText="Decrit ton object   "
            searchInputPlaceholderText="Recherche le nom de ta gare"
            onChangeInput={text => console.log(text)}
            showCancelButton={true}
            tagBorderColor="#CCC"
            tagTextColor="#CCC"
            selectedItemTextColor="#CCC"
            itemTextColor="#000"
            single={true}
            searchInputStyle={{ color: "#CCC" }}
          />
        </Card>
      </View>
    );
  };

  // Card Info pour expliquer brièvement l'appli
  cardInfo = () => {
    return (
      <Card
        key={5}
        containerStyle={styles.cardTitle}
        dividerStyle={styles.cardTitle}
        title="Bonjour "
      >
        <Text style={{ marginBottom: 10 }}>
          Le but de cette appli , est de retrouver ton objet que tu as perdu
          dans une gare SNCF
        </Text>
        <Button
          backgroundColor="#03A9F4"
          buttonStyle={{
            borderRadius: 0,
            marginLeft: 0,
            marginRight: 0,
            marginBottom: 0
          }}
          title="J'ai Compris !"
          onPress={() => {
            this.setState({ isCardInfo: false });
          }}
        />
      </Card>
    );
  };

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  // modal pour la recherche
  modal() {
    return (
      <View style={{ marginTop: 22 }}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
        >
          <View style={styles.modal}>
            <View>
              <ScrollView>
                <Card key={1} title=" Type d'objet perdu : ">
                  <MultiSelect
                    hideTags
                    items={this.state.typeObject}
                    uniqueKey="id"
                    ref={component => {
                      this.multiSelect = component;
                    }}
                    onSelectedItemsChange={this.onTypeChange}
                    selectedItems={this.state.typeChoice}
                    selectText="Choisi ton type d'objet"
                    searchInputPlaceholderText="Search Items..."
                    onChangeInput={text => console.log(text)}
                    tagBorderColor="#CCC"
                    showCancelButton={true}
                    tagTextColor="#CCC"
                    selectedItemTextColor="#CCC"
                    itemTextColor="#000"
                    single={true}
                    searchInputStyle={{ color: "#CCC" }}
                  />
                </Card>

                {this.state.isAffine && this.affineView()}
                {this.villeView()}
              </ScrollView>
              <Button
                title="Rechercher"
                titleStyle={{ fontWeight: "700" }}
                buttonStyle={styles.buttonStyle}
                containerStyle={{ marginTop: 20 }}
                onPress={() => this.submit()}
              />
            </View>
          </View>
        </Modal>

        <Button
          title="Faire une recherche"
          titleStyle={{ fontWeight: "700" }}
          containerStyle={{ marginTop: 20 }}
          onPress={() => {
            this.setModalVisible(true);
          }}
        />
      </View>
    );
  }

  ListObjFound(): any {
    if (this.state.isSearchReady) {
      return (
        // <View>
        // <Text h3 style={styles.titleSearch}>Vous avez {this.state.objeFound.length || 0} Resultats  </Text>
        <ScrollView
          pagingEnabled={true}
          onMomentumScrollEnd={() => this.nextPage()}
        >
          {this.state.objeFound.map((item, index) => (
            <Card key={index}>
              <CardTitle subtitle={item.natureObject} />
              <CardContent text={item.typeObject} />
              <CardAction separator={true} inColumn={false}>
                <CardButton
                  onPress={() => {}}
                  title="c'est mon Objet"
                  color="#E41E62"
                />
              </CardAction>
            </Card>
          ))}
        </ScrollView>
        // </View>
      );
    }
  }

  nbrObjFound(){
    return(
      <Text h3 style={styles.titleSearch}>Vous avez {this.state.nbrObj} Resultats  </Text>
    )
  }
  nextPage() {
    console.log("we are at the end ");
    // return(
    //   <Button
    //     title="Page suivante"
    //     titleStyle={{ fontWeight: "700" }}
    //     containerStyle={{ marginTop: 20 }}
    //     onPress={() => {
    //       this.setState({page : this.state.page +1});
    //     }}
    //   />
    // )
  }

  render() {
    return (
      <View style={styles.container}>
        {this.state.isCardInfo && this.cardInfo()}
        {this.modal()}
        {this.state.isSearchReady && this.nbrObjFound()}
        {this.state.isSearchReady && this.ListObjFound()}
        {this.state.isSearchReady && this.nextPage()}
      </View>
    );
  }
}

export default HomeScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
    // alignItems: "center",
    // justifyContent: 'center',
  },

  modal: {
    backgroundColor: "#fff",
    // alignItems: "center",
    justifyContent: "center",
    marginTop: 40
  },
  title: {
    textAlign: "center",
    color: "#5C63D8",
    paddingTop: 20,
    paddingBottom: 20
  },

  titleSearch: {
    textAlign: "center",
    color: "#5C63D8",
    // textDecorationLine : "underline" ,
    paddingTop: 20,
    paddingBottom: 20
  },

  buttonStyle: {
    alignItems: "center",
    backgroundColor: "#66ff99",
    padding: 10,
    marginBottom: 30,
    marginTop: 50,
    borderRadius: 5
  },
  cardTitle: {
    backgroundColor: "#A6ACAF",
    borderRadius: 5
  }
});
