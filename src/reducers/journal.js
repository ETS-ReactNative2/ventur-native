import {
  POPULATE_SINGLE_JOURNAL,
  RESET_JOURNAL_TAB,
  IMAGE_UPLOADING,
  POPULATE_JOURNAL_CHAPTERS,
  POPULATE_JOURNAL_GEAR
} from "../actions/journals"
import { REMOVE_CHAPTER_FROM_STATE } from "../actions/chapter"
import { PUSH_CHAPTER_TO_JOURNAL, UPDATE_FEED_DISTANCE } from "../actions/chapter_form"

const defaultJournalData = {
  journal: {
    user: {},
    chapters: [],
    gear: []
  },
  noRequest: false,
  loaded: false,
  imageUploading: false,
  subContentLoading: true
}

export default (state = defaultJournalData, action) => {
  switch (action.type) {
    case POPULATE_SINGLE_JOURNAL:
      return {
        ...state,
        journal: Object.assign({}, state.journal, action.payload),
        loaded: true
      }
    case POPULATE_JOURNAL_CHAPTERS:
      return {
        ...state,
        journal: Object.assign({}, state.journal, { chapters: action.payload }),
        subContentLoading: false
      }

    case POPULATE_JOURNAL_GEAR:
      console.log("GEAR!!!", action.payload)
      return {
        ...state,
        journal: Object.assign({}, state.journal, { gear: action.payload })
      }
    case RESET_JOURNAL_TAB:
      return defaultJournalData
    case REMOVE_CHAPTER_FROM_STATE:
      let chapters = state.journal.chapters.filter(chapter => {
        return chapter.id != action.payload.id
      })

      return {
        ...state,
        journal: Object.assign({}, state.journal, { chapters: chapters })
      }
    case IMAGE_UPLOADING:
      return {
        ...state,
        imageUploading: action.payload
      }
    case PUSH_CHAPTER_TO_JOURNAL:
      return {
        ...state,
        journal: Object.assign({}, state.journal, {
          chapters: action.payload.chapters,
          distance: action.payload.distance
        })
      }
    default:
      return state
  }
}
