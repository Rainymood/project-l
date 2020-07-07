import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const HomeScreen = (props) => {
    return (
        <View style={styles.homeScreen}>
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
