import {
  GET_COLORS_REQUEST,
  GET_COLORS_RESPONSE,
  GET_COLORS_ERROR,
  GENERATE_PATTERN_REQUEST,
  GENERATE_PATTERN_RESPONSE,
  GENERATE_PATTERN_ERROR
} from "./lib/constants/actions";
import networkStatus from "./lib/constants/networkStatus";

export const initialState = {
  dmcColors: null,
  getColorsInProgress: networkStatus.CLEAR,
  generatePatternInProgress: networkStatus.CLEAR,
  patternSource: null
};

export default function reducer(state, { type, payload }) {
  switch (type) {
    case GET_COLORS_REQUEST:
      return { ...state, getColorsInProgress: networkStatus.IN_PROGRESS };
    case GET_COLORS_RESPONSE:
      return {
        ...state,
        dmcColors: payload.dmcColors,
        getColorsInProgress: networkStatus.SUCCESS
      };
    case GET_COLORS_ERROR:
      return { ...state, getColorsInProgress: networkStatus.ERROR };
    case GENERATE_PATTERN_REQUEST:
      return { ...state, generatePatternInProgress: networkStatus.IN_PROGRESS };
    case GENERATE_PATTERN_RESPONSE:
      return {
        ...state,
        generatePatternInProgress: networkStatus.SUCCESS,
        patternSource: payload.patternSource
      };
    case GENERATE_PATTERN_ERROR:
      return { ...state, generatePatternInProgress: networkStatus.ERROR };
    default:
      return state;
  }
}
