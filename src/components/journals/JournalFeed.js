import React, { Component } from "react"
import { StyleSheet, ScrollView, Dimensions } from "react-native"
import { connect } from "react-redux"
import { get } from "agent"
import { JOURNAL_FEED_LOADED, RESET_JOURNAL_TAB } from "actions/action_types"
import JournalCard from "components/journals/JournalCard"

const mapDispatchToProps = dispatch => ({
  onLoad: payload => {
    dispatch({ type: JOURNAL_FEED_LOADED, payload })
  },

  resetJournal: () => {
    dispatch({ type: RESET_JOURNAL_TAB })
  }
})

const mapStateToProps = state => ({
  journals: state.journalFeed.allJournals,
  currentUser: state.common.currentUser
})

class JournalFeed extends Component {
  constructor(props) {
    super(props)
  }

  componentWillMount() {
    Expo.ScreenOrientation.allow("PORTRAIT_UP")
    this.getJournalFeed()
  }

  async getJournalFeed() {
    get("/journals").then(data => {
      this.props.onLoad(data.journals)
    })
  }

  handlePress = journalId => {
    this.props.resetJournal()
    this.props.navigation.navigate("Journal", { journalId })
  }

  render() {
    return (
      <ScrollView style={{ backgroundColor: "white" }}>
        {this.props.journals.map((journal, index) => {
          return (
            <JournalCard
              {...journal}
              width={Dimensions.get("window").width}
              height={Dimensions.get("window").height}
              handlePress={this.handlePress}
            />
          )
        })}
      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    backgroundColor: "white",
    paddingBottom: 50
  }
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JournalFeed)
