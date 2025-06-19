/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import {NavigationContainer} from '@react-navigation/native';
import React from 'react';
import AppNavigator from './navigation/AppNavigator';
import {AppProvider} from './context/AppContext';
import '../global.css'; // Ensure global styles are imported

function App(): React.JSX.Element {
  return (
    <AppProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AppProvider>
  );
}

export default App;
