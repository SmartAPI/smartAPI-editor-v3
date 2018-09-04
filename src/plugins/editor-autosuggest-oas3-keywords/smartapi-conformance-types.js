import smartapiOas3Schema from "../validate-json-schema/structural-validation/oas3-schema"
import isObject from "lodash/isObject"
import  'lodash'

export default function getSmartapiConformancePerType(){

 // var props = smartapiOas3Schema.properties
  //props.map((prop) => {

 // })
  var defs = smartapiOas3Schema.definitions
  var conformanceObject = {}
  var  optionalList = [];
  var  tempOptionalList = [];
  var  tempRecomList = [];
  var  recommendedList = [];

  Object.keys(defs).map(function(d){

    if (defs[d].optionals) {
    	defs[d].optionals.map((item) => {
    		tempOptionalList.push(d+"."+item)

    	})
    }
  //  if (defs[d].optionals) { defs[d].optionals.map((item) => {alert(item)} )}else { alert("bye")}
    if (defs[d].optionals != undefined) {
      	defs[d].optionals.map((item) => {
      			Object.keys(defs).map(function(dd){
      				//console.log("**"+dd + defs[dd].type)
       				if(defs[dd].properties) {
        			let props = Object.keys(defs[dd].properties)
        			props.map((prop) => {
        				if (d == prop) {
        					if(tempOptionalList.indexOf(d+"."+item) > -1) {
       					  		optionalList.push(dd+"."+d+"."+item)
       					  		tempOptionalList.splice(tempOptionalList.indexOf(d+"."+item), 1);
       					  		}
       					}
       				})
       	 		 }


       		 })
    	})
    }
    if (defs[d].recommended) {
    	defs[d].recommended.map((item) => {
    		tempRecomList.push(d+"."+item)

    	})
    }
    if (defs[d].recommended) {
      	defs[d].recommended.map((item) => {
      			Object.keys(defs).map(function(dd){
       if(defs[dd].properties) {
        	let props = Object.keys(defs[dd].properties)
        	props.map((prop) => {
        		if (d == prop) {
        		if(tempOptionalList.indexOf(d+"."+item) > -1) {
       				recommendedList.push(dd+"."+d+"."+item)
       				tempRecomList.splice(tempRecomList.indexOf(d+"."+item), 1);
       			  }
       			}
       		})
       	  }

       })
    })
       }

    let newOptionalList = [...(new Set(optionalList))].concat(tempOptionalList);
    let newRecomList = [...(new Set(recommendedList))].concat(tempRecomList);
	conformanceObject ={ "recommended": newRecomList , "optional": newOptionalList }
  });



  return conformanceObject

}


