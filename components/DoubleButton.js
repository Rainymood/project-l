import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import ApiCalendar from 'react-native-google-calendar-api';

export default class DoubleButton extends React.Component {
    constructor(props) {
        super(props);
        this.handleItemClick = this.handleItemClick.bind(this);
    }

    handleItemClick(event, name) {
        if (name === 'sign-in') {
            ApiCalendar.handleAuthClick();
            console.log(ApiCalendar)
            console.log('Sign in');
        } else if (name === 'sign-out') {
            ApiCalendar.handleSignoutClick();
            console.log('Sign out');
        }
    }

    render() {
        return (
            <View style={styles.buttonContainer}>
                <Button onPress={(e) => this.handleItemClick(e, 'sign-in')} title='Sign-in' />
                <Button onPress={(e) => this.handleItemClick(e, 'sign-out')} title='Sign-out' />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    buttonContainer: {
        borderWidth: 1,
        borderColor: 'black',
    },
});
