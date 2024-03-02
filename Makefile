#BUILD SETTINGS
TMP_FOLDER = tmp
LIB_FOLDER = lib
BUILD_FOLDER = build
CREATE_FORM_JS = ${BUILD_FOLDER}/create_forms.js
CPP_FILE = ${TMP_FOLDER}/forms.cpp
DRIVE_FILE = ${TMP_FOLDER}/drive.h
H_FILE = ${LIB_FOLDER}/forms.h
FORM_JSON = ${LIB_FOLDER}/forms.json
BUILD_FORM_BIN = python3 ${LIB_FOLDER}/create_forms.py

SHELL := bash

define newdefinestr
@read -p "$(1) [$(3)]: " thisset ; [[ -z "$$thisset" ]] && echo "#define $(2) \"$(3)\"" >> $(4) || echo "#define $(2) \"$$thisset\"" | sed 's/\/$$//g' >> $(4)
endef

all: ${CPP_FILE} ${BUILD_FOLDER}
	cpp -P ${CPP_FILE} > ${CREATE_FORM_JS}

${CPP_FILE} : ${DRIVE_FILE}
	${BUILD_FORM_BIN} -f ${FORM_JSON} > ${CPP_FILE}

${DRIVE_FILE} : ${TMP_FOLDER}
	$(call newdefinestr,Enter the ID of the app folder in Drive,DRIVE_FOLDER_ID,,${DRIVE_FILE})

${TMP_FOLDER}:
	mkdir ${TMP_FOLDER}

${BUILD_FOLDER}:
	mkdir ${BUILD_FOLDER}

clean:
	rm -rf ${TMP_FOLDER}
	rm -rf ${BUILD_FOLDER}
	rm -rf ${LIB_FOLDER}/__pycache__
