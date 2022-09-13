const doPost = (request = {}) => {
  let { parameter, postData: { contents, type } = {} } = request;
  try{
      var { action, value } = JSON.parse(contents);
    }catch(error){
      return sendJSON_({status: 500, message: `Formato incorrecto para el body, debe ser {"action" : "base64", "value" : "Hola Mundo"} Verifique e intente nuevamente.`});
  }

  if (typeof action != "string" || typeof value != "string"){
    return sendJSON_({status: 500, message: `Los campos "actión" y "value" deben ser de tipo String`});
  }
  if (action.length < 0 && value.length < 0){
    return sendJSON_({status: 500, message: `Los campos "action" y "valor" deben tener al menos un caracter`});
  }

  try{
    switch (action) {
      case "base64":
        //Conversion de un String en Base64
        let base_64 = Utilities.base64Encode(value)
        return sendJSON_({status: 200, result: base_64});
      case "upper":
        // Transformacion de un texto en mayusculas
        let upperCase = value.toUpperCase();
        return sendJSON_({status: 200, result: upperCase});
      case "lower":
        // Transformacion de un texto a minusculas
        let lowerCase = value.toLowerCase();
        return sendJSON_({status: 200, result: lowerCase});
      case "capitalize":
        // Transformacion de un texto a mayuscula la primera de cada letra
        return sendJSON_({status: 200, result: capitalize(value)});
      default:
        return sendJSON_({status: 500, message: `No se tiene una función para procesar la action ${action}`});
    }
  }catch(error){
    return sendJSON_({status: 500, message: `Error al intentar ejecutar la action ${action}`});
  }
};

function capitalize(string_phrase){
  let words = string_phrase.toLowerCase().split(" ");

  for (var i = 0; i < words.length; i++) {
      words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
  }

  //Unir las palabras nuevamente
  return words.join(" ");
}


//Función que prepara los elementos para devolverlos como un JSON
function sendJSON_(jsonResponse){
  //No es posible enviar otro estado de respuesta, y siempre respondera con 200 a menos que sea un 
  // fallo interno de Google Services.
  return ContentService
  .createTextOutput(JSON.stringify(jsonResponse))
  .setMimeType(ContentService.MimeType.JSON); 
}
