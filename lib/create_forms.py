from json import loads as json_parse, dumps as json_stringify
from re import sub as regex_sub
from arguments import Arguments

ARGS = Arguments()

formsfile = ARGS.Get("f")

if formsfile:
  with open(formsfile,"r") as f:
    obj = json_parse("".join(f.readlines()))

  print("#include \"../lib/forms.h\"")
  print("#include \"drive.h\"")
  print("")
  
  print("function createBaselineForms() {")
  print("var rootFolder = DriveApp.getFolderById(DRIVE_FOLDER_ID);")
  print("var configFolder = rootFolder.createFolder(\"config_UI\");")
  print("rootFolder.createFile(\"config.json\",\"{\\\"types\\\":{}}\",\"application/json\");")

  for formIdx in range(len(obj["forms"])):
    formvar = f"frm{formIdx}"
    formname = obj["forms"][formIdx]["name"]
    print(f"NEW_FORM({formvar},\"{formname}\")")
    
    for fieldIdx in range(len(obj["forms"][formIdx]["fields"])):
      fieldvar = f"field{fieldIdx}"
      fieldname = obj["forms"][formIdx]["fields"][fieldIdx]["label"]
      fieldtype = obj["forms"][formIdx]["fields"][fieldIdx]["type"]

      if fieldtype == "short-text":
        print(f"NEW_SHORT_TEXT_FIELD({formvar},{fieldvar},\"{fieldname}\")")
        
        if "eval" in [a for a in obj["forms"][formIdx]["fields"][fieldIdx].keys()]:
          evaltype = obj["forms"][formIdx]["fields"][fieldIdx]["eval"]

          if evaltype == "email":
            print(f"VAL_EMAIL({fieldvar})")
          elif evaltype == "phone":
            print(f"VAL_PHONE({fieldvar})")
          elif evaltype == "pattern":
            helptext = obj["forms"][formIdx]["fields"][fieldIdx]["helptext"]
            pattern = obj["forms"][formIdx]["fields"][fieldIdx]["pattern"]
            
            print(f"VAL_PATTERN({fieldvar},\"{helptext}\",\"{pattern}\")")
      
      elif fieldtype == "long-text":
        print(f"NEW_LONG_TEXT_FIELD({formvar},{fieldvar},\"{fieldname}\")")
      
      elif fieldtype == "dropdown":
        if "list" in [a for a in obj["forms"][formIdx]["fields"][fieldIdx].keys()]:
          listar = regex_sub("\"","\\\"",json_stringify(obj["forms"][formIdx]["fields"][fieldIdx]["list"]))

          print(f"NEW_LIST_FIELD({formvar},{fieldvar},\"{fieldname}\",\"{listar}\")")
        else:
          print(f"NEW_EMPTY_LIST_FIELD({formvar},{fieldvar},\"{fieldname}\")")
      
      elif fieldtype == "checkbox":
        if "list" in [a for a in obj["forms"][formIdx]["fields"][fieldIdx].keys()]:
          listar = regex_sub("\"","\\\"",json_stringify(obj["forms"][formIdx]["fields"][fieldIdx]["list"]))

          print(f"NEW_CHECKBOXES_FIELD({formvar},{fieldvar},\"{fieldname}\",\"{listar}\")")
        else:
          print(f"NEW_EMPTY_CHECKBOXES_FIELD({formvar},{fieldvar},\"{fieldname}\")")
      
      elif fieldtype == "date":
        print(f"NEW_DATE_FIELD({formvar},{fieldvar},\"{fieldname}\")")
      
      elif fieldtype == "time":
        print(f"NEW_TIME_FIELD({formvar},{fieldvar},\"{fieldname}\")")
    
    print(f"DriveApp.getFileById({formvar}.getId()).moveTo(configFolder);")
  
  print("}")