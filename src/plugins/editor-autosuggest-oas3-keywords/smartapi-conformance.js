import smartapiOas3Schema from "../validate-json-schema/structural-validation/oas3-schema"
import isObject from "lodash/isObject"

export default function getSmartapiConformance(){

  var defs = smartapiOas3Schema.definitions

  var conformanceList = []

  Object.keys(defs).map(function(d){
    //path.push(s)
    let  conformance = {};

    if (defs[d].optionals) {
      defs[d].optionals.map((item) => { conformance[(d+"."+item).toLowerCase()] = "Optional"})
      conformanceList.push(conformance)
    }
    if (defs[d].recommended) {
      defs[d].recommended.map((item) => { conformance[(d+"."+item).toLowerCase()] = "Recommended"})
      conformanceList.push(conformance)
    }
    if (defs[d].required) {
      defs[d].required.map((item) => { conformance[(d+"."+item).toLowerCase()] = "Required"})
      conformanceList.push(conformance)
    }

  });
 // alert(JSON.stringify(conformanceList));
  return conformanceList

}
