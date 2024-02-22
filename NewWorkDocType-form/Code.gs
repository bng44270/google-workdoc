/*
Requires property:

    root_folder - ID of root folder containing WorkDoc app and data
    number_length - number of digits to use for WorkDoc number after prefix
*/

/*
Trigger: on submit
*/
function createWorkDocType() {
  var rootFolderId = PropertiesService.getScriptProperties().getProperty('root_folder');
  var numberLength = PropertiesService.getScriptProperties().getProperty('number_length');

  var rootFolder = DriveApp.getFolderById(rootFolderId);

  var configFile = rootFolder.getFilesByName('config.json').next();
  
  var configObj = JSON.parse(configFile.getBlob().getDataAsString());
  
  var resps = FormApp.getActiveForm().getResponses();
  var thisResp = resps[resps.length -1];

  var thisRespData = new ResponseData(thisResp);

  var newTypeName = thisRespData.getField('Name');
  var newTypePrefix = thisRespData.getField('Prefix');

  if (newTypeName.length > 0 && newTypePrefix.length > 0) {
    if (Object.keys(configObj.types).indexOf(newTypeName) == -1) {
      configObj.types[newTypeName] = {}
      configObj.types[newTypeName]['prefix'] = newTypePrefix;
      configObj.types[newTypeName]['numlen'] = parseInt(numberLength);
      configObj.types[newTypeName]['next'] = 1;
    }
  }

  configFile.setContent(JSON.stringify(configObj));
  rootFolder.createFolder(newTypeName);
}
