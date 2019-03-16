import React, { Component } from "react"
import { resetChapter } from "actions/chapter"
import { StyleSheet, View, Text, ScrollView, Image, ImageBackground, TouchableHighlight } from "react-native"
import { connect } from "react-redux"
import { updateChapterForm } from "actions/chapter_form"
import EditorDropdown from "components/editor/EditorDropdown"
import CommentsContainer from "components/Comments/CommentsContainer"
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons"

const mapStateToProps = state => ({
  chapter: state.chapter.chapter,
  loaded: state.chapter.loaded,
  user: state.chapter.chapter.user,
  currentUser: state.common.currentUser,
  width: state.common.width,
  height: state.common.height
})

const mapDispatchToProps = dispatch => ({
  resetChapter: dispatch(resetChapter),
  updateChapterForm: payload => dispatch(updateChapterForm(payload))
})

class ChapterShow extends Component {
  constructor(props) {
    super(props)
  }

  navigateBack() {
    this.props.navigation.goBack()
  }

  renderTitle() {
    const { title } = this.props.chapter
    return (
      <View style={styles.titleDescriptionContainer}>
        <View
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "row",
            alignItems: "center"
          }}>
          <Text style={styles.title}>{title}</Text>
          {this.renderEditCta()}
        </View>
      </View>
    )
  }

  editMetaData = () => {
    let { id, title, distance, description } = this.props.chapter

    let obj = {
      id: id,
      title: title,
      distance: distance,
      description: description,
      journalId: this.props.chapter.journal.id
    }

    this.props.updateChapterForm(obj)
    this.props.navigation.navigate("ChapterFormTitle")
  }

  renderEditCta() {
    return
    if (this.props.currentUser.id == this.props.user.id) {
      return (
        <TouchableHighlight onPress={this.editMetaData}>
          <View>
            <Text>EDIT</Text>
          </View>
        </TouchableHighlight>
      )
    }
  }

  renderStatistics() {
    const { readableDate, distance } = this.props.chapter
    return (
      <View style={styles.statisticsPadding}>
        <View style={styles.statisticsContainer}>
          <MaterialCommunityIcons name="calendar" size={18} style={styles.iconPosition} />
          <Text style={styles.statisticsText}>{`${readableDate}`.toUpperCase()}</Text>
        </View>
        <View style={styles.statisticsContainer}>
          <MaterialIcons style={styles.iconPosition} name="directions-bike" size={16} />
          <Text style={styles.statisticsText}>{`${distance} miles`.toUpperCase()}</Text>
        </View>
      </View>
    )
  }

  renderChapterImage() {
    let fourthWindowWidth = this.props.width / 4
    const { imageUrl } = this.props.chapter
    if (!imageUrl) return
    return (
      <Image
        style={{ width: fourthWindowWidth, height: fourthWindowWidth, borderRadius: fourthWindowWidth / 2, margin: 20 }}
        source={{ uri: imageUrl }}
      />
    )
  }

  renderDivider() {
    return (
      <View
        style={{
          borderBottomWidth: 3,
          borderBottomColor: "black",
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

  renderToggleEdit() {
    return
    if (this.props.user.id != this.props.currentUser.id) return

    return (
      <TouchableHighlight onPress={this.props.toggleEditMode}>
        <View
          style={{
            height: 50,
            backgroundColor: "#f8f8f8",
            width: this.props.width,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center"
          }}>
          <Text style={{ fontSize: 18 }}>Edit Content</Text>
        </View>
      </TouchableHighlight>
    )
  }

  renderEditorDropdown() {
    return
    if (this.props.user.id != this.props.currentUser.id) return

    return (
      <View style={{ alignItems: "flex-end", paddingRight: 20 }}>
        <EditorDropdown navigation={this.props.navigation} />
      </View>
    )
  }

  renderCommentContainer() {
    let commentableProps = Object.assign(
      {},
      { commentableId: this.props.chapter.id, commentableType: "chapter", commentCount: this.props.chapter.commentCount }
    )
    return <CommentsContainer {...commentableProps} />
  }

  render() {
    return (
      <ScrollView style={[styles.container, { minHeight: this.props.height }]}>
        {this.renderChapterImage()}
        {this.renderTitle()}
        {this.renderStatistics()}
        {this.renderEditorDropdown()}
        {this.renderDivider()}
        {this.renderToggleEdit()}
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
    color: "black"
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
