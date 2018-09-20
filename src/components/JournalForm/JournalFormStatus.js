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
import { SimpleLineIcons, Ionicons } from "@expo/vector-icons"

const mapStateToProps = state => ({})

const mapDispatchToProps = dispatch => ({})

class JournalFormStatus extends Component {
  constructor(props) {
    super(props)

    this.state = {
      activeOptionEnum: "not_started"
    }
  }

  static STATUS_OPTIONS = [
    { text: "NOT STARTED", enum: "not_started" },
    { text: "ACTIVE", enum: "active" },
    { text: "PAUSED", enum: "paused" },
    { text: "FINISHED", enum: "completed" }
  ]

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

  persistAndNavigate = () => {
    this.props.navigation.navigate("JournalFormUpload")
  }

  isActiveOption(option) {
    return option.enum === this.state.activeOptionEnum
  }

  renderRadioButton(isActive) {
    if (isActive) {
      return (
        <View
          style={{
            height: 20,
            width: 20,
            backgroundColor: "white",
            borderColor: "#FF8C34",
            borderWidth: 1,
            marginRight: 20,
            borderRadius: 10,
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
          }}>
          <View style={{ height: 12, width: 12, backgroundColor: "#FF8C34", borderRadius: 6 }} />
        </View>
      )
    } else {
      return (
        <View
          style={{ height: 20, width: 20, marginRight: 10, borderRadius: 10, borderWidth: 1, borderColor: "white" }}
        />
      )
    }
  }

  updateActiveOption = option => {
    this.setState({
      activeOptionEnum: option.enum
    })
  }

  renderOption(option) {
    const isActive = this.isActiveOption(option)
    return (
      <TouchableWithoutFeedback onPress={() => this.updateActiveOption(option)}>
        <View
          style={[
            {
              backgroundColor: "transparent",
              borderColor: "white",
              borderWidth: 1,
              borderRadius: 6,
              height: 52,
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              paddingLeft: 10,
              paddingRight: 10,
              marginBottom: 10
            },
            isActive ? { backgroundColor: "white" } : {}
          ]}>
          {this.renderRadioButton(isActive)}
          <View>
            <Text style={[{ fontSize: 24 }, isActive ? { color: "#FF8C34" } : { color: "white" }]}>{option.text}</Text>
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  renderStatusOptions() {
    return JournalFormStatus.STATUS_OPTIONS.map((option, index) => {
      return this.renderOption(option)
    })
  }

  renderForm() {
    return (
      <View style={{ margin: 20 }}>
        <View style={{ marginBottom: 30 }}>
          <Text style={{ fontFamily: "playfair", fontSize: 36, color: "white" }}>What's the status of your trip</Text>
        </View>
        <View>{this.renderStatusOptions()}</View>
        <View>
          <TouchableHighlight onPress={this.persistAndNavigate}>
            <View style={{ borderRadius: 30, marginTop: 20, backgroundColor: "white" }}>
              <Text
                style={{
                  color: "#FF8C34",
                  textAlign: "center",
                  paddingTop: 15,
                  fontSize: 18,
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
)(JournalFormStatus)
