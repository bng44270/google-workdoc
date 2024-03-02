# google-workdoc

##Installation:  
1. Run ```make``` and enter the ID of the root application folder in Drive  
2. Copy/paste the contents of ```build/create_forms.js``` into a new App Script project and run the ```createBaselineForms```  
3. Add the following scripts to Forms as follows:
   
    AddComment:  
	      - form-scripts/AddComment.gs => Code.gs  
	      - form-scripts/ResponseData.gs => ResponseData.gs  
    
	CreateWorkDoc:  
	      - form-scripts/CreateWorkDoc.gs => Code.gs  
	      - form-scripts/ResponseData.gs => ResponseData.gs  
	
    NewWorkDocType:  
	      - form-scripts/NewWorkDocType.gs => Code.gs  
	      - form-scripts/ResponseData.gs => ResponseData.gs

   NOTE:  Create properties and triggers as specified in the Code.gs files
   
4. Add the contents of the ```WorkDocUI-script``` folder into a new App Script project named "WorkDocUI"