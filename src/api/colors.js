import apiRoute from "../lib/constants/apiRoute";
import {
  GET_COLORS_RESPONSE,
  GET_COLORS_ERROR
} from "../lib/constants/actions";

export function getColors(dispatch) {
  try {
    fetch(`${apiRoute}/colors`, {
      method: "GET"
    }).then(function(response) {
      response.json().then(function(allColors) {
        dispatch({ type: GET_COLORS_RESPONSE, payload: { allColors } });
      });
    });
  } catch (e) {
    dispatch({ type: GET_COLORS_ERROR });
  }
}
