import React from 'react'
import { StyleSheet, Platform, Image, Text, View, TextInput } from 'react-native'
import { DateTime } from 'luxon'

import firebase from 'react-native-firebase'

export default class App extends React.Component {
  constructor() {
    super()
    this.handleInputChange = this.handleInputChange.bind(this)
    this.saveMessageToFirebase = this.saveMessageToFirebase.bind(this)
    this.formatTimeStamp = this.formatTimeStamp.bind(this)
    this.state = {
      messages: [],
      text: '',
    }
  }

  componentDidMount() {
    const ref = firebase.database().ref('messages')
    ref.on('value', messages => {
      const messageArr = []
      messages.forEach(message => {
        messageArr.push(message.val())
      })
      this.setState({
        messages: messageArr
      })
    }, error => {
      console.log('Error', error)
    })
  }

  handleInputChange(message) {
    this.setState({
      text: message
    })
  }
  saveMessageToFirebase() {
    const ref = firebase.database().ref('messages')
    const messageToSave = this.state.text
    ref.push({
      text: messageToSave,
      createdAt: firebase.database.ServerValue.TIMESTAMP
    }, () => {
      // console.log(`Message ('${messageToSave}') saved to Firebase!`)
      this.setState({
        text: ''
      })
    })
  }
  formatTimeStamp(timestamp) {
    if (Platform.OS === 'ios') {
      return DateTime.fromMillis(timestamp, { zone: 'Europe/Stockholm', locale: 'sv-SE' }).toFormat("HH':'mm")
    } else {
      // Android doesn't ship with JS locale information so we can't localize the DateTime object
      return DateTime.fromMillis(timestamp).toFormat("HH':'mm")
    }
  }

  render() {
    const messages = this.state.messages

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to Övik Developer Meetup{'\n'}React Native starter project!
        </Text>
        <View style={styles.messages}>
          <Text style={styles.messagesHeader}>Messages</Text>
          {messages.map((message, index) => (
            <Text key={index} style={styles.instructions}>
              {this.formatTimeStamp(message.createdAt)}: {message.text}
            </Text>
          ))}
        </View>
        <View style={styles.input}>
          <View style={styles.inputContent}>
            <TextInput
              style={styles.inputText}
              placeholder="Write a message"
              onChangeText={text => this.handleInputChange(text)}
              onSubmitEditing={() => this.saveMessageToFirebase()}
              value={this.state.text}
              underlineColorAndroid={'transparent'}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
    paddingTop: 30,
  },
  welcome: {
    marginLeft: 20,
    marginRight: 20,
  },
  messages: {
    margin: 20,
  },
  messagesHeader: {
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  input: {
    height: 44,
    marginHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#EAE6E6',
    borderColor: '#EAE6E6',
    borderWidth: 2,
  },
  inputContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
  },
  inputText: {
    flex: 1,
  },
});
