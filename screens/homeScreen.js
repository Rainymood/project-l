import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

// Components
import DoubleButton from '../components/DoubleButton';

const HomeScreen = (props) => {
    return (
        <View style={styles.homeScreen}>
            <DoubleButton />
            <Text>Homescreen text</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    homeScreen: {
        width: '100%',
        height: '100%',
        backgroundColor: '#fff',
        borderWidth: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default HomeScreen;
