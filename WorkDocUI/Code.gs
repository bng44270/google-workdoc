/*
Requires property:

    root_folder - ID of root folder containing WorkDoc app and data
    list_page_length - number of WorkDoc records to display per page
*/


var rootFolderId = PropertiesService.getScriptProperties().getProperty("root_folder");
var pageLength = parseInt(PropertiesService.getScriptProperties().getProperty("list_page_length"));

var rootFolder = DriveApp.getFolderById(rootFolderId);
var configFile = rootFolder.getFilesByName('config.json').next();
var configObject = JSON.parse(configFile.getBlob().getDataAsString());

function doGet(e) {
  var template = null;

  var queryObj = {};
  e.queryString.split('&').forEach(q => {
    var p = q.split('=');
    queryObj[p[0]] = p[1];
  });

  if (queryObj['action'] == 'list') {
    template = HtmlService.createTemplateFromFile("WorkDocListing.html");
    var docListing = [];

    var currentPage = (Object.key(queryObj).indexOf('page') > -1) ? parseInt(queryObj['page']) : 0;    

    var docType = (Object.keys(queryObj).indexOf('type') > -1) ? queryObj['type'] : '*';

    if (docType == '*') {
      Object.keys(configObject.types).forEach(t => {
        var docFiles = rootFolder.getFoldersByName(t).next().getFiles();

        while (docFiles.hasNext()) {
          var thisDoc = docFiles.next();

          var fileObj = JSON.parse(thisDoc.getBlob().getDataAsString());
          fileObj['filename'] = thisDoc.getName();
          fileObj['created'] = thisDoc.getDateCreated().toString();

          docListing.push(fileObj);
        }
      });
      
      if (currentPage > 0) {
        var startingItem = pageLength * currentPage;
        var lastItem = (startingItem + pageLength > docListing.length) ? docListing - startingItem : startingItem + pageLength;


        docListing = docListing.slice(startingItem,lastItem);
      }
    }
    else {
      var docFiles = rootFolder.getFoldersByName(docType).next().getFiles();
      
      while (docFiles.hasNext()) {
        var thisDoc = docFiles.next();

        var fileObj = JSON.parse(thisDoc.getBlob().getDataAsString());
        fileObj['filename'] = thisDoc.getName();
        fileObj['created'] = thisDoc.getDateCreated().toString();

        docListing.push(fileObj);
      }
    }

    template.docFiles = docListing;
  }
  else if (queryObj['action'] == 'view') {
    if (Object.keys(queryObj).indexOf('file') == -1) throw ReferenceError("View action requires 'file' parameter");

    var docFileName = queryObj['file'];
    
    
    
    
  }

  return template.evaluate();
}
