const ss = SpreadsheetApp.openById('<table id>');
const sheet = ss.getSheetByName('<sheet name>');


function sendStat(){
  
  let newValues = sheet.getRange(2, 5, sheet.getLastRow()-1).getValues().map(item => item[0]);
  let oldValues = sheet.getRange(2, 5, sheet.getLastRow()-1).getNotes().map(item => item[0]);
   
  for (let i = 0; i < newValues.length; i++){ // перебираем циклом весь массив
    let name = sheet.getRange(i+2, 4).getValue(); // достаем имя из массива
    
    if (newValues[i] != '') { // если массив не пустой
      if (oldValues[i] == ''){ // если массив старых значений пустой присваиваем баланс = 0
        sheet.getRange(i+2, 5).setNote(newValues[i]); // присваиваем старые значения
        sendMessage(187051021, `${name} balance changed from: 0 → to ${newValues[i]} grn`); // отправляем в телеграм
      } else if (newValues[i] != oldValues[i]){ // если значения из старого и нового массива не совпадают
        sheet.getRange(i+2, 5).setNote(newValues[i]); // присваиваем старые значения
        sendMessage(187051021, `${name} balance changed from: ${oldValues[i]} → to ${newValues[i]} grn`); // отправляем в телеграм
        } 
      
     } 
    
  } // end for loop
  
} //end sendStat

function setTriggerTime() {
  ScriptApp.newTrigger("sendStat")
  .timeBased()
  .everyMinutes(1)
  .create();
}

function deleteTrigger(){
  // Deletes all triggers in the current project.
  let triggers = ScriptApp.getProjectTriggers();
  for (let i = 0; i < triggers.length; i++) {
    ScriptApp.deleteTrigger(triggers[i]);
  }
}

function sendMessage(id_chat, text, keyboard) { // Отправляет сообщение используя sendMessage
  var data = {
    method: "post",
    payload: {
      method: "sendMessage",
      chat_id: String(id_chat),
      text: text,
      parse_mode: "HTML",
      reply_markup: JSON.stringify(keyboard)
    }
  };
  UrlFetchApp.fetch('https://api.telegram.org/bot' + token + '/', data);
}
