import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StackNavigator, TabNavigator, TabBarBottom  } from 'react-navigation';
console.disableYellowBox = true ;
import  HomeScreen  from './screens/home';




const RootStack = StackNavigator(
    {
      home: {
           screen: HomeScreen,
       },
    },
);

export default class App extends React.Component {
  render() {
    return (
      <RootStack />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
