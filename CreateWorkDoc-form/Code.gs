/*
Requires property:

    root_folder - ID of root folder containing WorkDoc app and data
*/

/*
Trigger:  on load
*/
function updateTypeChoiceList() {
  var rootFolderId = PropertiesService.getScriptProperties().getProperty('root_folder');

  var rootFolder = DriveApp.getFolderById(rootFolderId);

  var configFile = rootFolder.getFilesByName('config.json').next();
  
  var configObj = JSON.parse(configFile.getBlob().getDataAsString());

  var newDocForm = FormApp.getActiveForm();
  newDocForm.getItems().filter(i => i.getTitle() == 'Type').forEach(i => {
    var newChoiceList = Object.keys(configObj.types).map(t => {
      return i.asListItem().createChoice(t);
    });

    i.asListItem().setChoices(newChoiceList);
  });
}

/*
Trigger: on submit
*/
function createNewWorkDoc() {
  var rootFolderId = PropertiesService.getScriptProperties().getProperty('root_folder');

  var rootFolder = DriveApp.getFolderById(rootFolderId);

  var configFile = rootFolder.getFilesByName('config.json').next();
  
  var configObj = JSON.parse(configFile.getBlob().getDataAsString());
  
  var resps = FormApp.getActiveForm().getResponses();
  var thisResp = resps[resps.length -1];

  var thisRespData = new ResponseData(thisResp);

  var docDescription = thisRespData.getField('Description');
  var docEmail = thisRespData.getField('Your E-mail Address');
  var docPhone = thisRespData.getField('Your Phone Number');
  var docType = thisRespData.getField('Type');

  var typeConf = configObj.types[docType];
  var docNum = typeConf.prefix + typeConf.next.toString().padStart(typeConf.numlen,'0');

  var docObj = {
    description : docDescription,
    userEmail : docEmail,
    userPhone : docPhone,
    comments : []
  };

  rootFolder.getFoldersByName(docType).next().createFile(docNum,JSON.stringify(docObj),'application/json');

  typeConf.next++;

  configObj.types[docType] = typeConf;
  configFile.setContent(JSON.stringify(configObj));
}
