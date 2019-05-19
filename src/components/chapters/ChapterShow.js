import React, { Component } from "react"
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  ImageBackground,
  TouchableHighlight,
  TouchableWithoutFeedback,
  Alert
} from "react-native"
import { connect } from "react-redux"
import { updateChapterForm } from "actions/chapter_form"
import { sendEmails } from "actions/chapter"
import { loadRouteEditor } from "actions/route_editor"
import { loadRouteViewer } from "actions/route_viewer"
import ThreeDotDropdown from "components/shared/ThreeDotDropdown"
import CommentsContainer from "components/Comments/CommentsContainer"
import { editChapterPublished, deleteChapter } from "actions/chapter"
import { MaterialCommunityIcons, MaterialIcons, Feather } from "@expo/vector-icons"
import { persistChapterToAsyncStorage, removeChapterFromAsyncStorage } from "utils/offline_helpers"

const mapStateToProps = state => ({
  chapter: state.chapter.chapter,
  loaded: state.chapter.loaded,
  user: state.chapter.chapter.user,
  currentUser: state.common.currentUser,
  width: state.common.width,
  height: state.common.height
})

const mapDispatchToProps = dispatch => ({
  updateChapterForm: payload => dispatch(updateChapterForm(payload)),
  loadRouteEditor: payload => dispatch(loadRouteEditor(payload)),
  loadRouteViewer: payload => dispatch(loadRouteViewer(payload)),
  sendEmails: payload => dispatch(sendEmails(payload)),
  editChapterPublished: (chapter, published) => dispatch(editChapterPublished(chapter, published, dispatch)),
  deleteChapter: (chapterId, callback) => dispatch(deleteChapter(chapterId, callback, dispatch))
})

class ChapterShow extends Component {
  constructor(props) {
    super(props)
  }

  navigateBack = () => {
    this.props.navigation.goBack()
  }

  openDeleteAlert = () => {
    Alert.alert(
      "Are you sure?",
      "Deleting this chapter will erase all images and content",
      [{ text: "Delete Chapter", onPress: this.handleDelete }, { text: "Cancel", style: "cancel" }],
      { cancelable: true }
    )
  }

  navigateToChapterForm = () => {
    let { id, title, distance, description, journal, imageUrl } = this.props.chapter
    let distanceAmount = distance.distanceType === "kilometer" ? distance.kilometerAmount : distance.mileAmount

    let obj = Object.assign(
      {},
      {
        id: id,
        title: title,
        distance: distanceAmount,
        description: description,
        readableDistanceType: distance.readableDistanceType,
        imageUrl: imageUrl,
        journalId: journal.id
      }
    )

    this.props.updateChapterForm(obj)
    this.props.navigation.navigate("ChapterMetaDataForm")
  }

  handleDelete = async () => {
    this.props.deleteChapter(this.props.chapter.id, this.navigateBack)
  }

  sendEmails = async () => {
    if (this.props.chapter.emailSent) return

    this.props.sendEmails(this.props.chapter.id)
  }

  getEmailToggle() {
    if (this.props.chapter.emailSent) {
      return "Email Sent"
    } else {
      return "Send Email"
    }
  }

  getChapterUserFormProps() {
    let optionsProps = [
      {
        type: "touchable",
        iconName: "edit",
        title: "Edit Metadata",
        callback: this.navigateToChapterForm,
        closeMenuOnClick: true
      },
      {
        type: "touchable",
        iconName: "delete",
        title: "Delete Chapter",
        callback: this.openDeleteAlert,
        closeMenuOnClick: true
      },
      {
        type: "switch",
        title: "Published",
        iconName: "publish",
        value: this.props.chapter.published,
        callback: this.updatePublishedStatus,
        closeMenuOnClick: false
      }
    ]

    if (this.props.chapter.published) {
      const emailOption = {
        type: "touchable",
        iconName: "mail-outline",
        title: this.getEmailToggle(),
        callback: this.sendEmails
      }
      optionsProps.push(emailOption)
    }

    return optionsProps
  }

  updatePublishedStatus = async () => {
    const {
      chapter: { id, published }
    } = this.props
    this.props.editChapterPublished(id, !published)
  }

  renderTitle() {
    const { title } = this.props.chapter
    return (
      <View style={styles.titleDescriptionContainer}>
        <View
          style={[
            {
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "row",
              alignItems: "center"
            },
            { marginTop: this.props.chapter.imageUrl ? 0 : 20 }
          ]}>
          <Text style={styles.title}>{title}</Text>
        </View>
      </View>
    )
  }

  returnDistanceString(distance) {
    const { distanceType, kilometerAmount, mileAmount, readableDistanceType } = distance
    switch (distanceType) {
      case "kilometer":
        return `${kilometerAmount} ${readableDistanceType}`

      case "mile":
        return `${mileAmount} ${readableDistanceType}`

      default:
        return ""
    }
  }

  navigateToMap = async () => {
    const { cycleRouteId } = this.props.chapter

    if (this.props.currentUser.id == this.props.chapter.user.id) {
      this.props.loadRouteEditor(cycleRouteId)
      this.props.navigation.navigate("RouteEditor")
    } else {
      this.props.loadRouteViewer(cycleRouteId)
      this.props.navigation.navigate("RouteViewer")
    }
  }

  renderMapIconCta() {
    return (
      <TouchableWithoutFeedback onPress={this.navigateToMap}>
        <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
          <View>
            <Feather name="map" size={25} color="#323941" />
          </View>
        </View>
      </TouchableWithoutFeedback>
    )
  }

  renderMapIconWithImage() {
    if (!this.props.chapter.imageUrl) return

    return this.renderMapIconCta()
  }

  renderMapIconNoImage() {
    if (this.props.chapter.imageUrl) return

    return this.renderMapIconCta()
  }

  renderStatistics() {
    const { readableDate, distance } = this.props.chapter
    const distanceString = this.returnDistanceString(distance)
    return (
      <View style={styles.statisticsPadding}>
        <View style={styles.statisticsContainer}>
          <MaterialCommunityIcons name="calendar" size={18} style={styles.iconPosition} />
          <Text style={styles.statisticsText}>{`${readableDate}`.toUpperCase()}</Text>
        </View>
        <View style={styles.statisticsContainer}>
          <MaterialIcons style={styles.iconPosition} name="directions-bike" size={16} />
          <Text style={styles.statisticsText}>{`${distanceString}`.toUpperCase()}</Text>
        </View>
      </View>
    )
  }

  renderChapterImage() {
    let fourthWindowWidth = this.props.width / 2.5
    const { imageUrl } = this.props.chapter
    if (!imageUrl) return
    return (
      <Image
        style={{ width: this.props.width, height: fourthWindowWidth, borderRadius: 0, marginBottom: 20 }}
        source={{ uri: imageUrl }}
      />
    )
  }

  renderDivider() {
    return (
      <View
        style={{
          borderBottomWidth: 3,
          borderBottomColor: "#323941",
          width: 90,
          marginTop: 10,
          marginLeft: 20,
          marginBottom: 30
        }}
      />
    )
  }

  getInputStyling(entry) {
    switch (entry.styles) {
      case "H1":
        return {
          fontFamily: "playfair",
          fontSize: 22
        }
      case "QUOTE":
        return {
          fontStyle: "italic",
          borderLeftWidth: 5,
          paddingTop: 10,
          paddingBottom: 10
        }
      default:
        return {}
    }
  }

  renderImageCaption(entry) {
    if (entry.caption.length === 0) return

    return (
      <View
        style={{
          paddingLeft: 20,
          paddingRight: 20
        }}>
        <Text style={{ textAlign: "center" }}>{entry.caption}</Text>
      </View>
    )
  }

  getImageHeight(aspectRatio) {
    return aspectRatio * this.props.width
  }

  renderImageEntry(entry, index) {
    return (
      <View key={`image${index}`} style={{ position: "relative", marginBottom: 20 }}>
        <ImageBackground
          style={{ width: this.props.width, height: this.getImageHeight(entry.aspectRatio) }}
          source={{ uri: entry.uri }}
        />
        {this.renderImageCaption(entry)}
      </View>
    )
  }

  renderTextEntry(entry, index) {
    return (
      <View
        style={{
          padding: 20
        }}>
        <Text
          multiline
          key={index}
          style={[
            {
              fontSize: 20,
              fontFamily: "open-sans-regular"
            },
            this.getInputStyling(entry)
          ]}>
          {entry.content}
        </Text>
      </View>
    )
  }

  renderEntry = (entry, index) => {
    switch (entry.type) {
      case "text":
        return this.renderTextEntry(entry, index)
      case "image":
        return this.renderImageEntry(entry, index)
      default:
        console.log("WHAT IS IT", entry)
    }
  }

  renderBodyContent() {
    if (!this.props.chapter.editorBlob.content) return

    let entries = this.props.chapter.editorBlob.content
    if (!Array.isArray(entries)) {
      entries = Array.from(entries)
    }

    return entries.map((entry, index) => {
      return this.renderEntry(entry, index)
    })
  }

  renderThreeDotMenu() {
    if (this.props.user.id != this.props.currentUser.id) {
      return <View />
    }
    const options = this.getChapterUserFormProps()
    return (
      <ThreeDotDropdown
        options={options}
        openMenuStyling={{ borderWidth: 1, borderColor: "#D7D7D7", borderRadius: 4, backgroundColor: "#f8f8f8" }}
      />
    )
  }

  renderIconAndThreeDotMenu() {
    return (
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          paddingRight: 20,
          paddingLeft: 20,
          marginBottom: 5
        }}>
        {this.renderMapIconCta()}
        {this.renderThreeDotMenu()}
      </View>
    )
  }

  renderCommentContainer() {
    let commentableProps = Object.assign(
      {},
      {
        commentableId: this.props.chapter.id,
        commentableType: "chapter",
        commentableUser: this.props.chapter.user,
        commentableTitle: this.props.chapter.title,
        commentCount: this.props.chapter.commentCount,
        navigation: this.props.navigation
      }
    )
    return <CommentsContainer {...commentableProps} />
  }

  render() {
    return (
      <ScrollView style={[styles.container, { minHeight: this.props.height }]}>
        <View style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
          {this.renderChapterImage()}
          {this.renderMapIconWithImage()}
        </View>
        {this.renderTitle()}
        {this.renderStatistics()}
        {this.renderIconAndThreeDotMenu()}
        {this.renderDivider()}
        <View style={{ marginBottom: 100 }}>{this.renderBodyContent()}</View>
        <View style={{ marginBottom: 200 }}>{this.renderCommentContainer()}</View>
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    marginBottom: 100
  },
  titleDescriptionContainer: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 10
  },
  title: {
    fontSize: 28,
    fontFamily: "playfair",
    color: "#323941"
  },
  description: {
    fontSize: 18,
    color: "#c3c3c3",
    fontFamily: "open-sans-semi"
  },
  statisticsContainer: {
    display: "flex",
    flexDirection: "row",
    paddingTop: 5
  },
  iconPosition: {
    marginRight: 5
  },
  statisticsPadding: {
    padding: 20,
    paddingTop: 0
  },
  statisticsText: {
    fontFamily: "overpass",
    fontSize: 14
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ChapterShow)
