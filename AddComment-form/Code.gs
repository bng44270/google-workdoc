/*
Trigger: on submit
*/
function addComment() {
  var rootFolderId = PropertiesService.getScriptProperties().getProperty('root_folder');

  var rootFolder = DriveApp.getFolderById(rootFolderId);

  var configFile = rootFolder.getFilesByName('config.json').next();
  
  var configObj = JSON.parse(configFile.getBlob().getDataAsString());

  var resps = FormApp.getActiveForm().getResponses();
  var thisResp = resps[resps.length -1];

  var thisRespData = new ResponseData(thisResp);

  var docNum = thisRespData.getField('WordDoc Number');
  var commentText = thisRespData.getField('Comment');
  var commenterEmail = thisRespData.getField('Your E-mail Address');

  var docPrefix = docNum.replace(/[0-9]/g,'');

  var docType = '';

  Object.keys(configObj.types).forEach(t => {
    if (docPrefix == configObj.types[t].prefix) {
      docType = t;
    }
  });

  var docFile = rootFolder.getFoldersByName(docType).next().getFilesByName(docNum).next();

  var docObj = JSON.parse(docFile.getBlob().getDataAsString());

  docObj.comments.push({
    date : new Date().toString(),
    user : commenterEmail,
    text : commentText
  });

  docFile.setContent(JSON.stringify(docObj));
  FormApp.getActiveForm().setConfirmationMessage("YOU ADDED A COMMENT");
}
