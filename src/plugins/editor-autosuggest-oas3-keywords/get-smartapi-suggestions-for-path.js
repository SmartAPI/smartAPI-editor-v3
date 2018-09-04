import isArray from "lodash/isArray"
import isObject from "lodash/isObject"
import mapValues from "lodash/mapValues"
import isPlainObject from "lodash/isPlainObject"
import toArray from "lodash/toArray"
import isString from "lodash/isString"
import axios from 'axios'

export default function getSmartapiSuggestionsForPath(path, enumSuggestions, callback) {
  /*alert(path)
  if(path[0] === "paths") {
    path.splice(1, 1, "pathitem");
    path.splice(path.length-2, 1);
  }
  if(path[path.length-1] === 'x-role')  {
    alert("open profiler")


  }*/
  var url = 'https://smart-api.info/api/suggestion?field='+path.toString().replace(/,/g, '.')
  var arr = []
  axios.get(url).then(res => {
    if (enumSuggestions.length === 0){
      //const posts = res.data.field_values.buckets.map(obj => obj.key); //array of keys
      //callback(posts.map(constructAceCompletion.bind(null, "value")))
      res.data.field_values.buckets.map(obj => {
        arr.push(constructAceCompletion("meta", obj.key, obj.doc_count))
      })

    }
    else {
      arr = []
      var count = 0
      enumSuggestions.map(enm =>
        {
          count = 0
          res.data.field_values.buckets.map(obj => {
            if (enm.caption === obj.key) {
              count = obj.doc_count
            }
          })

          arr.push(constructAceCompletion("meta", enm.caption, count))

        })
      }//else

      callback(arr)
    })

  }

  function constructAceCompletion(meta, keyword, count) {
    if(keyword.slice(0, 2) === "__") {
      return {}
    }

    // Give keywords, that extra colon
    let snippet
    switch(meta) {
      case "keyword":
      snippet = `${keyword}: `
      break
      case "object":
      snippet = `${keyword}:\n  `
      break
      default:
      snippet = keyword
    }
    meta = "FQ ="+count
    // snippet's treat `$` as special characters
    snippet = snippet.replace("$", "\\$")
    return {
      snippet,
      caption: keyword,
      score: 300+count,
      meta,
    }

  }
