import React, { Component } from "react"
import { connect } from "react-redux"
import { updateJournalForm } from "actions/journal_form"
import CameraRollPicker from "react-native-camera-roll-picker"
import { Header } from "components/editor/Header"

const mapStateToProps = state => ({})
const mapDispatchToProps = dispatch => ({
  updateJournalForm: payload => dispatch(updateJournalForm(payload))
})

class BannerImagePicker extends Component {
  constructor(props) {
    super(props)
    this.handleGoBack = this.handleGoBack.bind(this)
    this.getSelectedImage = this.getSelectedImage.bind(this)
    this.journalImage = this.journalImage.bind(this)

    this.state = {
      selectedImage: {}
    }
  }

  handleGoBack() {
    this.setState({
      selectedImage: {}
    })
    this.props.navigation.goBack()
  }

  getSelectedImage(images) {
    if (images.length === 0) return
    let image = images[0]
    this.setState({
      selectedImage: image
    })
  }

  renderHeader() {
    const headerProps = {
      goBackCta: "Cancel",
      handleGoBack: this.handleGoBack,
      centerCta: `Banner Image`,
      handleConfirm: this.journalImage,
      confirmCta: "Add"
    }
    return <Header key="header" {...headerProps} />
  }

  journalImage() {
    let payload = { key: "bannerImage", value: this.state.selectedImage }
    this.props.updateJournalForm(payload)
    this.props.navigation.goBack()
  }

  renderCameraRollPicker() {
    return (
      <CameraRollPicker
        selectSingleItem
        key="cameraRollPicker"
        selected={[this.state.selectedImage]}
        callback={this.getSelectedImage}
      />
    )
  }

  render() {
    return (
      <React.Fragment>
        {this.renderHeader()}
        {this.renderCameraRollPicker()}
      </React.Fragment>
    )
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BannerImagePicker)