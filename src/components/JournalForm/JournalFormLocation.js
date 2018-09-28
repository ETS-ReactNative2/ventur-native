import React, { Component } from "react"
import { LinearGradient } from "expo"
import { connect } from "react-redux"
import {
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  TouchableHighlight,
  TextInput,
  ImageBackground,
  Dimensions
} from "react-native"
import { updateJournalForm } from "actions/journal_form"
import { SimpleLineIcons, Ionicons } from "@expo/vector-icons"
const API_ROOT = "http://192.168.7.23:3000"

const mapStateToProps = state => ({
  id: state.journalForm.id,
  description: state.journalForm.description
})

const mapDispatchToProps = dispatch => ({
  updateJournalForm: payload => dispatch(updateJournalForm(payload))
})

class JournalFormLocation extends Component {
  constructor(props) {
    super(props)

    this.state = {
      description: props.description
    }
  }

  navigateBack = () => {
    this.props.navigation.goBack()
  }

  renderBackButtonHeader() {
    return (
      <View style={{ marginTop: 20, marginLeft: 20 }}>
        <TouchableHighlight underlayColor="rgba(111, 111, 111, 0.5)" onPress={this.navigateBack}>
          <Ionicons name="ios-arrow-back" size={40} color="white" />
        </TouchableHighlight>
      </View>
    )
  }
  handleTextChange(text) {
    this.setState({
      description: text
    })
  }

  persistUpdate = async () => {
    let params = { id: this.props.id, description: this.state.description }
    fetch(`${API_ROOT}/journals/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(params)
    })
      .then(response => {
        return response.json()
      })
      .then(data => {
        this.props.updateJournalForm({ description: data.description })
        this.props.navigation.navigate("JournalFormStatus")
      })
  }

  renderForm() {
    return (
      <View style={{ margin: 20 }}>
        <View style={{ marginBottom: 50 }}>
          <Text style={{ fontFamily: "playfair", fontSize: 36, color: "white" }}>Where are you cycling</Text>
        </View>
        <View>
          <TextInput
            autoFocus
            multiline
            onChangeText={text => this.handleTextChange(text)}
            selectionColor="white"
            style={{
              fontSize: 28,
              borderBottomWidth: 1,
              paddingBottom: 5,
              marginBottom: 20,
              borderBottomColor: "white",
              color: "white"
            }}
          />
        </View>
        <View>
          <TouchableHighlight onPress={this.persistUpdate}>
            <View style={{ borderRadius: 30, backgroundColor: "white" }}>
              <Text
                style={{
                  color: "#FF8C34",
                  textAlign: "center",
                  fontSize: 18,
                  paddingTop: 15,
                  paddingBottom: 15
                }}>
                CONTINUE
              </Text>
            </View>
          </TouchableHighlight>
        </View>
      </View>
    )
  }

  render() {
    return (
      <View>
        <LinearGradient style={{ height: Dimensions.get("window").height }} colors={["#FF8C34", "#E46545"]}>
          {this.renderBackButtonHeader()}
          {this.renderForm()}
        </LinearGradient>
      </View>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JournalFormLocation)