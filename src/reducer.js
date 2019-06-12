import {
  GET_COLORS_REQUEST,
  GET_COLORS_RESPONSE,
  GET_COLORS_ERROR,
  GENERATE_PATTERN_REQUEST,
  GENERATE_PATTERN_RESPONSE,
  GENERATE_PATTERN_ERROR,
  CLEAR_GENERATE_PATTERN
} from "./lib/constants/actions";
import networkStatus from "./lib/constants/networkStatus";

export const initialState = {
  allColors: null,
  getColorsInProgress: networkStatus.CLEAR,
  generatePatternStatus: networkStatus.CLEAR,
  patternSource: null,
  selectedColors: null
};

export default function reducer(state, { type, payload }) {
  switch (type) {
    case GET_COLORS_REQUEST:
      return { ...state, getColorsInProgress: networkStatus.IN_PROGRESS };
    case GET_COLORS_RESPONSE:
      return {
        ...state,
        allColors: payload.allColors,
        getColorsInProgress: networkStatus.SUCCESS
      };
    case GET_COLORS_ERROR:
      return { ...state, getColorsInProgress: networkStatus.ERROR };
    case GENERATE_PATTERN_REQUEST:
      return { ...state, generatePatternStatus: networkStatus.IN_PROGRESS };
    case GENERATE_PATTERN_RESPONSE:
      return {
        ...state,
        generatePatternStatus: networkStatus.SUCCESS,
        patternSource: payload.patternSource,
        selectedColors: payload.selectedColors
      };
    case GENERATE_PATTERN_ERROR:
      return { ...state, generatePatternStatus: networkStatus.ERROR };
    case CLEAR_GENERATE_PATTERN:
      return {
        ...state,
        generatePatternStatus: networkStatus.CLEAR,
        selectedColors: null
      };
    default:
      return state;
  }
}
