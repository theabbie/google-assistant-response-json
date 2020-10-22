module.exports = function(msg, card, sugg, data, list, link) {
  var result = {
    "fulfillmentText": msg,
    "payload": {
      "google": {
        "expectUserResponse": true,
        "richResponse": {
          "items": [{
            "simpleResponse": {
              "textToSpeech": msg
            }
          }]
        },
        "userStorage": data
      }
    }
  };
  if (card) {
    result.fulfillmentMessages = [{
      "card": {
        "title": card[0],
        "subtitle": card[2],
        "imageUri": card[3],
        "buttons": [{
          "text": card[4],
          "postback": card[5]
        }]
      }
    }];
    result.payload.google.richResponse.items.push({
      "basicCard": {
        "title": card[0],
        "subtitle": card[1],
        "formattedText": card[2],
        "image": {
          "url": card[3],
          "accessibilityText": card[0]
        },
        "buttons": [{
          "title": card[4],
          "openUrlAction": {
            "url": card[5]
          }
        }],
        "imageDisplayOptions": "CROPPED"
      }
    });
  }
  if (sugg) {
    result.payload.google.richResponse.suggestions = [];
    sugg.forEach(function (x) {
      result.payload.google.richResponse.suggestions.push({
        "title": x
      })
    })
    if (link) {
      result.payload.google.richResponse["linkOutSuggestion"] = {
        "destinationName": link[0],
        "url": link[1]
      }
    }
  }
  if (list) {
    var title = list[0];
    list.shift();
    result.payload.google.systemIntent = {
      "intent": "actions.intent.OPTION",
      "data": {
        "@type": "type.googleapis.com/google.actions.v2.OptionValueSpec",
        "listSelect": {
          "title": title,
          "items": list.map(function (x) {
            return {
              "optionInfo": {
                "key": Array.isArray(x) ? x[0] : x,
                "synonyms": Array.isArray(x) ? [x[0]] : [x]
              },
              "description": Array.isArray(x) ? x[1] : x,
              "image": {
                "url": Array.isArray(x) ? x[2] : "https://storage.googleapis.com/actionsresources/logo_assistant_2x_64dp.png",
                "accessibilityText": Array.isArray(x) ? x[0] : x
              },
              "title": Array.isArray(x) ? x[0] : x
            }
          })
        }
      }
    };
  }
  return result;
}

