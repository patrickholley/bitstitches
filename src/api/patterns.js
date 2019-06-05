import { GENERATE_PATTERN_RESPONSE } from "../lib/constants/actions";

export function generatePattern(bodyObject, dispatch) {
  fetch("https://localhost:5001/api/pattern", {
    method: "POST",
    body: JSON.stringify(bodyObject)
  }).then(response => {
    response.text().then(function(responsePatternSource) {
      dispatch({
        type: GENERATE_PATTERN_RESPONSE,
        payload: {
          patternSource: `data:image/png;base64,${responsePatternSource}`
        }
      });
    });
  });
}
