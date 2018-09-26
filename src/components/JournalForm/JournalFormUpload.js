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
  Dimensions,
  ScrollView
} from "react-native"
import { updateJournalForm, endOfForm } from "actions/journal_form"
import { SimpleLineIcons, Ionicons } from "@expo/vector-icons"
import CameraRollPicker from "react-native-camera-roll-picker"
const API_ROOT = "http://192.168.7.23:3000"

const mapStateToProps = state => ({
  id: state.journalForm.id
})

const mapDispatchToProps = dispatch => ({
  updateJournalForm: payload => dispatch(updateJournalForm(payload)),
  endOfForm: () => dispatch(endOfForm())
})

class JournalFormLocation extends Component {
  constructor(props) {
    super(props)

    this.state = {
      bannerImage: props.bannerImage,
      selectedImage: {}
    }
  }

  navigateBack = () => {
    this.props.navigation.goBack()
  }

  getSelectedImage = images => {
    if (images.length === 0) return
    let image = images[0]
    this.setState({
      selectedImage: image
    })
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
    const formData = new FormData()
    let { selectedImage } = this.state
    let imgPost = {
      uri: selectedImage.uri,
      name: selectedImage.filename,
      type: "multipart/form-data"
    }
    formData.append("banner_image", imgPost)
    let params = { id: this.props.id, banner_image: imgPost }
    fetch(`${API_ROOT}/journals/${params.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "multipart/form-data"
      },
      body: formData
    })
      .then(response => {
        return response.json()
      })
      .then(data => {
        this.props.endOfForm(data)
        this.props.navigation.navigate("Explore")
        // runs something that resets journal form and then goes to journal
      })
  }

  renderForm() {
    return (
      <View style={{ margin: 20 }}>
        <View style={{ marginBottom: 20 }}>
          <Text style={{ fontFamily: "playfair", fontSize: 36, color: "white" }}>Upload A Cover Photo</Text>
        </View>
        <ScrollView
          style={{
            marginLeft: -20,
            marginBottom: 20,
            height: 350,
            width: Dimensions.get("window").width
          }}>
          <CameraRollPicker
            selectSingleItem
            key="cameraRollPicker"
            selected={[this.state.selectedImage]}
            callback={this.getSelectedImage}
          />
        </ScrollView>
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
