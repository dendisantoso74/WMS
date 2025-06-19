import React from 'react';
import {View, StyleSheet} from 'react-native';
import ButtonMenu from '../compnents/ButtonMenu';

const HomeScreen = (props: any) => {
  return (
    <View style={styles.container}>
      <ButtonMenu
        navigation={props.navigation}
        navigateTo="List"
        iconLibrary="FontAwesome"
        iconName="check-square-o"
        text="Digital checkSheet"
      />
      <ButtonMenu
        navigation={props.navigation}
        navigateTo="HomeWMS"
        iconLibrary="FontAwesome"
        iconName="home"
        // iconColor="white"
        text="WMS"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default HomeScreen;
