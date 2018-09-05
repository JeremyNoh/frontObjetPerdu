// @flow
import React from "react";
import {
    AppRegistry,
    Alert,
    Platform,
    StyleSheet,
    View,
    Dimensions,
    Image,
    Modal,
    TouchableHighlight,
    TouchableOpacity,
    ScrollView,
    TextInput,
    AsyncStorage,
} from "react-native";

import {Text, Button, Card, Badge} from "react-native-elements";
import {
    CardTitle,
    CardContent,
    CardAction,
} from "react-native-cards";

import MultiSelect from "react-native-sectioned-multi-select";
import Toast, {DURATION} from 'react-native-easy-toast'
import PopupDialog, {DialogTitle, DialogButton} from "react-native-popup-dialog";
import Expo from 'expo';
import Prompt from 'react-native-prompt-crossplatform';
import moment from 'moment';
import 'moment/locale/fr'


type Props = {
    /* ... */
};

type State = {
    modalVisible: boolean,
    isAffine: boolean,
    isStation: boolean,
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
    nbrObj: number,
    userEmail: string,
    userName: string,
    writeEmail: boolean,
};

class HomeScreen extends React.Component<Props, State> {
    constructor() {
        super();
        this.state = {
            modalVisible: false,
            isAffine: false,
            isStation: false,
            isCardInfo: true,
            page: 0,
            station: [],
            natureObject: [],
            typeObject: [],
            stationChoice: undefined,
            typeChoice: undefined,
            natureChoice: undefined,
            newNatureObject: [],
            isSearchReady: false,
            objeFound: [],
            PageMax: 0,
            nbrObj: 0,
            userEmail: '',
            userName: '',
            writeEmail: false,
        };
    }



    // fetch pour récupérer les 3 infos de recherche
    componentWillMount(): any {
      this.getInfoUserStorage()
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
                station.sort(function (a, b) {
                    return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
                });
                this.setState({station});
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
                natureObject.sort();
                this.setState({natureObject});
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
                typeObject.sort(function (a, b) {
                    return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
                });
                this.setState({typeObject});
            })
            .catch(error => {
                console.error(error);
            });
    }
    // stoke  dans un state
    async getInfoUserStorage() {
      try {
        const result = await AsyncStorage.getItem("@User");
        if (result) {
          user = JSON.parse(result);
          if (user.userEmail !== undefined) {
            this.setState({ userEmail: user.userEmail });
          }
          if (user.isCardInfo !== undefined) {
            this.setState({ isCardInfo: user.isCardInfo });
          }
        }
      } catch (e) {
        console.log(e);
      }
    }

    // Debut navigationOptions
    static navigationOptions = ({navigation}) => {
        const {state, setParams, navigate} = navigation;

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

    // maj du state sur la station séléctionnée
    onVilleChange = (stationChoice: [number]) => {
        this.setState({stationChoice});
    };

    // maj du state sur le type d'objet séléctionné
    onTypeChange = (typeChoice: [number]) => {
        this.majNature(typeChoice[0]);
        this.setState({typeChoice});
    };

    // maj des natures d'objet pour afficher en fonction du type
    majNature(numbertype: number | string) {
        var newNatureObject: array = [];
        for (var obj of this.state.natureObject) {
            if (numbertype == obj.idType) {
                newNatureObject.push(obj);
            }
        }
        newNatureObject.sort(function (a, b) {
            return (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0);
        });
        this.setState({isAffine: true, newNatureObject});
    }

    // maj du state sur la nature d'objet séléctionnée
    onNatureChange = (natureChoice: number) => {
        this.setState({natureChoice, isStation: true});
    };

    // prepare la query pour fetch
    submit() {
        var query: string = `https://objetperduv2.herokuapp.com/api/lost_object/page/${
        this.state.page + 1
            }/`;
        var data = {};
        var page: number = this.state.page + 1
        this.setState({page})

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

        // ferme le modal
        this.fetchResult(query);

        this.setModalVisible(false);
    }

    // renvoi un boolean pour savoir si c'est le first params sur la query
    firstParams(query: string): boolean {
        query = query.substr(query.length - 1, 1)
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
                    var PageMax: number = 0
                    var nbrObj: number = 0
                    PageMax = responseJson.information.pages;
                    nbrObj = responseJson.information.objects;
                    let objeFound: array = this.state.objeFound;
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
                    console.log("nombre de resultat : ", nbrObj);
                    console.log("Page total : ", PageMax);
                    this.setState({objeFound, isSearchReady: true, PageMax, nbrObj});


                } else {
                    // erreur connection ou autres
                    this.refs.toast.show("il n'y a pas de resultats", 1500, () => {
                    });

                    var objeFound: array = [];
                    this.setState({objeFound, isSearchReady: true, PageMax: 0, nbrObj: 0});
                    console.log(responseJson.Error);
                }
            })
            .catch(error => {
                console.error(error);
            });
        // ferme le spinner
        // loading.close();
    }

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
                        selectText="Décris ton objet"
                        searchInputPlaceholderText="Recherche le nom de ta gare"
                        onChangeInput={text => console.log(text)}
                        showCancelButton={true}
                        confirmText="je confirme"
                        searchPlaceholderText="recherche la nature de ton objet"
                        tagBorderColor="#CCC"
                        tagTextColor="#CCC"
                        selectedItemTextColor="#CCC"
                        itemTextColor="#000"
                        single={true}
                        searchInputStyle={{color: "#CCC"}}
                    />
                </Card>
            </View>
        );
    };

    // Card sur la Gare
    villeView = () => {
        return (
            <View>
                <Card key={3} title="Gare SNCF :">
                    <MultiSelect
                        hideTags
                        items={this.state.station}
                        uniqueKey="id"
                        ref={component => {
                            this.multiSelect = component;
                        }}
                        onSelectedItemsChange={this.onVilleChange}
                        selectedItems={this.state.stationChoice}
                        selectText="Recherche la gare SNCF"
                        searchInputPlaceholderText="Recherche le nom de ta gare"
                        onChangeInput={text => console.log(text)}
                        showCancelButton={true}
                        confirmText="je confirme"
                        searchPlaceholderText="Rechercher une gare"
                        tagBorderColor="#CCC"
                        tagTextColor="#CCC"
                        selectedItemTextColor="#CCC"
                        itemTextColor="#000"
                        single={true}
                        searchInputStyle={{color: "#CCC"}}
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
                <Text style={{marginBottom: 5}}>
                    Vous avez oublié un objet dans une gare SNCF et vous vous demandez comment le récupérer
                    ?
                </Text>
                <Text style={{marginBottom: 10}}>
                    Plus besoin de vous déplacer ou de passer votre temps au téléphone, il vous suffit simplement de
                    faire votre recherche grâce à cette application.
                </Text>
                <Button
                    backgroundColor="#03A9F4"
                    buttonStyle={{
                        borderRadius: 0,
                        marginLeft: 0,
                        marginRight: 0,
                        marginBottom: 0

                    }}
                    title="J'ai compris !"
                    onPress={() => {
                        const user = {
                          isCardInfo: false,
                          userEmail : this.state.userEmail
                        };
                        const str = JSON.stringify(user);
                        AsyncStorage.setItem("@User", str).then(() => {
                          this.setState({isCardInfo: false});
                        });
                    }}
                />
            </Card>
        );
    };

    setModalVisible(visible: boolean) {
        this.setState({modalVisible: visible});
    }

    onDateChange(date) {
        this.setState({
            selectedStartDate: date,
        });
    }

    // modal pour la recherche
    modal() {
        return (
            <View style={{marginTop: 22}}>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.modalVisible}
                >
                    <View style={styles.modal}>

                        <ScrollView>
                            <Card key={1} title=" Type d'objet : ">
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
                                    onChangeInput={text => console.log(text)}
                                    tagBorderColor="#CCC"
                                    showCancelButton={true}
                                    confirmText="je confirme"
                                    searchPlaceholderText="recherche un type d'objet"
                                    tagTextColor="#CCC"
                                    selectedItemTextColor="#CCC"
                                    itemTextColor="#000"
                                    single={true}
                                    searchInputStyle={{color: "#CCC"}}
                                />
                            </Card>

                            {this.state.isAffine && this.affineView()}
                            {this.state.isStation && this.villeView()}

                            <Button
                                title="Rechercher"
                                titleStyle={{fontWeight: "700"}}
                                buttonStyle={styles.buttonStyle}
                                containerStyle={{marginTop: 20}}
                                onPress={() => {
                                    // loading.show();
                                    this.submit();
                                }}
                            />

                            <Button

                                disabled={!this.state.isStation}
                                title="Créer une alerte"
                                titleStyle={{fontWeight: "700"}}
                                buttonStyle={{backgroundColor: "#428BCA"}}
                                containerStyle={{marginTop: 20}}
                                onPress={() => {
                                    this.popupDialog.show()
                                    // this.setModalVisible(false);
                                }}
                            />
                        </ScrollView>
                        {this.createAlert()}
                    </View>
                </Modal>



                <Button
                    title="Nouvelle recherche"
                    buttonStyle={{backgroundColor: '#5CB85C'}}
                    titleStyle={{fontWeight: "700"}}
                    containerStyle={{marginTop: 20}}
                    onPress={() => {
                        var page: number = 0;
                        var objeFound: array = [];
                        this.setState({stationChoice: undefined,typeChoice: undefined,natureChoice: undefined, page, objeFound});
                        this.setModalVisible(true);
                    }}
                />
              {  this.buttonAffiche()}
            </View>
        );
    }

    // Code Ui permettant d'afficher  le bouton Affine ta recherche
    buttonAffiche(){
      if (this.state.typeChoice !== undefined) {
        return(
          <Button
              title="Affine ta recherche "
              buttonStyle={{backgroundColor: '#428BCA', marginTop : 10}}
              titleStyle={{fontWeight: "700"}}
              containerStyle={{marginTop: 20}}
              onPress={() => {
                  var page: number = 0;
                  var objeFound: array = [];
                  this.setState({isCardInfo: false, page, objeFound});
                  this.setModalVisible(true);
              }}
          />
        )
      }
    }


    //  Code UI permettant la creation d'alerte
    createAlert() {
        return (
            <PopupDialog
                dialogTitle={<DialogTitle
                    title={this.state.userEmail == '' ? 'Veuillez rentrer votre Email' : `Envoyé à : ${this.state.userEmail}`}/>}
                ref={popupDialog => {
                    this.popupDialog = popupDialog;
                }}
            >
                <Button
                    title="Facebook"
                    buttonStyle={{marginTop: 20, backgroundColor: '#4267b2'}}
                    containerStyle={{marginTop: 20}}
                    onPress={() => this.signInWithFacebookAsync()}
                />
                <Button
                    title="Google"
                    buttonStyle={{marginTop: 20, backgroundColor: '#d14836'}}
                    containerStyle={{marginTop: 20}}
                    onPress={() => this.signInWithGoogleAsync()}
                />

                <Button
                    title="E-mail"
                    buttonStyle={{marginTop: 20}}
                    containerStyle={{marginTop: 20}}
                    onPress={() => this.signInWithYourEmail()}
                />
                <Prompt
                    title="Renseignez votre email"
                    submitButtonText="Enregistrer"
                    cancelButtonText="Retour"
                    placeholder="Example@domaine.com"
                    inputPlaceholder="Example@domaine.com"
                    isVisible={this.state.writeEmail}
                    onChangeText={(text) => {
                        this.setState({userEmail: text});
                    }}
                    onCancel={() => {
                        this.setState({
                            userEmail: '',
                            writeEmail: false,
                        });
                    }}
                    onSubmit={() => {
                        if (this.emailVerif()) {
                            this.setEmailStorage()
                            this.setState({writeEmail: false});
                        }
                        else {
                            Alert.alert(
                                `Email non valide`,
                                `Veuillez entrer un email correct`,
                            )
                        }
                    }}
                />
                <DialogButton
                    text={"Créer mon alerte"}
                    disabled={this.state.userEmail == '' ? true : false}
                    onPress={() => this.submitYourEmail()}
                />
            </PopupDialog>
        )
    }


    // Verifie si c'est une vrai adresse Mail
    emailVerif() {
        const reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        if (reg.test(this.state.userEmail) === true) {
            return true
        }
        else {
            return false
        }
    }

    // Post dans la BDD une alert
    submitYourEmail() {

        // Creation de l'objet pour le Post
        var obj = {}
        obj.email = this.state.userEmail
        if (!(this.state.userName == '')) {
            obj.username = this.state.userName
        }
        if (!(this.state.stationChoice == undefined)) {
            obj.station = this.state.stationChoice[0]
        }
        if (!(this.state.natureChoice == undefined)) {
            obj.nature = this.state.natureChoice[0]
        }
        if (!(this.state.typeChoice == undefined)) {
            obj.type = this.state.typeChoice[0]
        }
        console.log(obj);

        fetch('https://objetperduv2.herokuapp.com/api/user/alert', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(obj),
        })
            .catch(error => {
                console.error("c'est une erreur !!!", error);
                Alert.alert("Erreur un problème est survenu")
            })
            .then((response) => response.json())
            .then(responseJson => {
                this.popupDialog.dismiss(() => {
                    Alert.alert(
                        `Alerte Programmée`,
                        `Un email vous sera envoyé lorsque votre objet sera trouvé`,
                    )
                })
            })

    }

    // set email dans le loclaStorage
    setEmailStorage(){
      const user = {
        isCardInfo: this.state.isCardInfo,
        userEmail : this.state.userEmail,
      };
      const str = JSON.stringify(user);
      AsyncStorage.setItem("@User", str).then(() => {
      });
    }

    // function pour se connecter via Facebook
    async signInWithFacebookAsync() {
        const {type, token} = await Expo.Facebook.logInWithReadPermissionsAsync('267723867174602', {
            permissions: ['public_profile'],
        });
        if (type === 'success') {
            const response = await fetch(
                `https://graph.facebook.com/me?access_token=${token}&fields=email,name`);
            const userInfo = await response.json()
            this.setState({userEmail: userInfo.email, userName: userInfo.name})
            Alert.alert(
                'Connecté',
                `Bonjour ${userInfo.name}!`,
            );
        }
        this.setEmailStorage()
    }

    // function pour se connecter via Google
    async signInWithGoogleAsync() {
        try {
            // test
            this.popupDialog.dismiss(() => {
                this.setModalVisible(false);
            });
            // finTest
            const result = await Expo.Google.logInAsync({
                androidClientId: "438182509769-i7hv6ahrqce4kqi1tt05se0bm81si8l5.apps.googleusercontent.com",
                iosClientId: "438182509769-tdq4o1dh626vnf7a593unil97la8nhu2.apps.googleusercontent.com",
                scopes: ['profile', 'email'],
            });

            if (result.type === 'success') {

                this.setState({userEmail: result.user.email, userName: result.user.name})
            } else {
                console.log("cancelled");
            }
        } catch (e) {
            console.log('error', e);
        }
        this.setModalVisible(true);
        this.popupDialog.show();
        this.setEmailStorage()
    }


    // function pour rentrer son email
    signInWithYourEmail(): any {
        this.setState({writeEmail: true})
    }

    //  Permet l'affichage des cards + detection de la fin de la ScrollView
    ListObjFound(): any {
        if (this.state.isSearchReady) {
            moment.locale('fr')
            return (
                <ScrollView
                    onMomentumScrollEnd={(e) => {
                        var windowHeight = Dimensions.get('window').height,
                            height = e.nativeEvent.contentSize.height,
                            offset = e.nativeEvent.contentOffset.y;
                        if (windowHeight + offset >= height) {
                            this.nextPage()
                        }
                    }}
                >
                    {this.state.objeFound.map((item, index) => (
                        <Card key={index}>
                            <CardTitle subtitle={item.natureObject}/>
                            <CardContent text={item.station}/>
                            <CardAction separator={true} inColumn={false}>
                                <Text style={{marginBottom: 5, color: "#E41E62", fontWeight: 'bold', marginTop: 5}}>
                                    {moment(item.date).locale('fr').format("LL")}
                                </Text>


                            </CardAction>
                        </Card>
                    ))}
                </ScrollView>
            );
        }
    }

    nbrObjFound() {
        return (
            <Text h3 style={styles.titleSearch}>Vous avez {this.state.nbrObj} résultats </Text>
        )
    }

    // function pour Page suivante ou affichage du toast
    nextPage() {
        var page: number = this.state.page
        page += 1
        if (this.state.PageMax < page) {
            this.refs.toast.show("Liste d'objet chargée. Veuillez créer une alerte", 1500, () => {
            });
        }
        else {
            // loading.show()
            this.setState({page})
            this.submit()
        }

    }

    render() {
        return (
            <View style={styles.container}>
                {this.state.isCardInfo && this.cardInfo()}
                {this.modal()}
                {this.state.isSearchReady && this.nbrObjFound()}
                {this.state.isSearchReady && this.ListObjFound()}
                <Toast ref="toast" position='center' opacity={0.7}/>
            </View>
        );
    }
}

export default HomeScreen;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff"
    },

    modal: {
        backgroundColor: "#fff",
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
        paddingTop: 20,
        paddingBottom: 20
    },

    buttonStyle: {
        alignItems: "center",
        backgroundColor: "#5CB85C",
        padding: 10,
        marginBottom: 30,
        marginTop: 50,
        borderRadius: 5
    },
    cardTitle: {
        backgroundColor: "#fff",
        borderRadius: 5,
    }
});
