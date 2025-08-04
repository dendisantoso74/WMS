import React, {useCallback} from 'react';
import {useFocusEffect, useNavigation} from '@react-navigation/native';

/**
 * Prevents the user from navigating back to a specific screen.
 * @param {string} toScreen - The name of the screen to navigate to when back is pressed.
 *  @returns {JSX.Element} - A component that handles the back navigation prevention.
 */
const PreventBackNavigate = ({toScreen = 'HomeWMS'}) => {
  const navigation = useNavigation();

  useFocusEffect(
    useCallback(() => {
      const subscription = navigation.addListener('beforeRemove', (e: any) => {
        e.preventDefault();
        navigation.navigate(toScreen);
      });

      return () => {
        subscription();
      };
    }, [navigation, toScreen]),
  );

  return null; // This component only handles navigation, no UI
};

export default PreventBackNavigate;
