import keywordMap from "./keyword-map"
import getKeywordsForPath from "./get-keywords-for-path"
import getSmartapiSuggestionsForPath from "./get-smartapi-suggestions-for-path"
import getSmartapiConformance from "./smartapi-conformance"
import axios from 'axios'

export default function getCompletions(editor, session, pos, prefix, cb, ctx, system) {

  const { fn: { getPathForPosition }, specSelectors } = system

  const { isOAS3 } = specSelectors

  if(isOAS3 && !isOAS3()) {
    // isOAS3 selector exists, and returns false
    return cb(null, null)
  }

  const { AST } = ctx
  var editorValue = editor.getValue()
  var path = getPathForPosition({ pos, prefix, editorValue, AST})
  const suggestions = getKeywordsForPath({ system, path, keywordMap })
//  cb(null, suggestions)
  //smartapi extention
  var enumSuggestions = []
  if (suggestions.length > 0) {
    if (suggestions[0].meta !== "value"){
      cb(null, suggestions)
  }
    else {
      enumSuggestions = suggestions
    //  cb(null, enumSuggestions)
    path = getPathForPosition({ pos, prefix, editorValue, AST})

    getSmartapiSuggestionsForPath(path,enumSuggestions, function(smartAPIsuggestions){
        cb(null, smartAPIsuggestions)
  });
  }
}
  path = getPathForPosition({ pos, prefix, editorValue, AST})

  getSmartapiSuggestionsForPath(path,enumSuggestions, function(smartAPIsuggestions){
      cb(null, smartAPIsuggestions)
});
}
