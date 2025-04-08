; NSIS Script to create a Windows Installer.
;
; To create a windows installer:
;   1. Install NSIS from https://nsis.sourceforge.io/Download
;   2. Build your application with PyInstaller first: python build.py
;   3. Create the installer: 'C:\Program Files (x86)\NSIS\makensis.exe' .\packaging\windows\installer.nsi
;
; The APP_ID was originaly set by electron-builder in the first versions of the application and we are maintaining it.
; https://www.electron.build/nsis.html#guid-vs-application-name

!define APP_ID "42c092cd-67f7-566d-b9a4-980d3103f082"
!define APP_NAME "Open Data Editor"
!define PUBLISHER "Open Knowledge Foundation"
!define INSTALL_DIR "$LOCALAPPDATA\Programs\opendataeditor"

; Required version parameter
!ifndef APP_VERSION
    !error "APP_VERSION must be defined via -DAPP_VERSION=x.y.z command parameter."
!endif

; Modern UI setup
!include "MUI2.nsh"
!include "LogicLib.nsh"
!include "FileFunc.nsh" ; To calculate Estimated Size

Name "${APP_NAME}"
OutFile "opendataeditor-win-${APP_VERSION}.exe"
InstallDir "${INSTALL_DIR}"
RequestExecutionLevel user ; No admin privileges needed for user-level install

; Registry key for uninstaller
!define UNINST_KEY "Software\Microsoft\Windows\CurrentVersion\Uninstall\${APP_ID}"
!define MUI_ICON "icon.ico"
!define MUI_UNICON "icon.ico"

!insertmacro MUI_PAGE_WELCOME
!insertmacro MUI_PAGE_INSTFILES
!insertmacro MUI_UNPAGE_CONFIRM
!insertmacro MUI_UNPAGE_INSTFILES
!insertmacro MUI_LANGUAGE "English"

Section "Install"
    ; Remove previous installation
    RMDir /r "$INSTDIR"

    ; Create installation directory
    SetOutPath "$INSTDIR"
    
    ; Copy application files from PyInstaller output
    File /r "..\..\dist\opendataeditor\*.*"

    ; Calculate installed size
    ${GetSize} "$INSTDIR" "/S=0K" $0 $1 $2
    IntFmt $0 "0x%08X" $0
    
    ; Create shortcuts
    CreateDirectory "$SMPROGRAMS\${APP_NAME}"
    CreateShortcut "$SMPROGRAMS\${APP_NAME}\${APP_NAME}.lnk" "$INSTDIR\opendataeditor.exe"
    CreateShortcut "$SMPROGRAMS\${APP_NAME}\Uninstall.lnk" "$INSTDIR\Uninstall opendataeditor.exe"

    ; Write uninstaller
    WriteUninstaller "$INSTDIR\Uninstall opendataeditor.exe"

    ; Write registry entries
    WriteRegStr HKCU "${UNINST_KEY}" "DisplayName" "${APP_NAME}"
    WriteRegStr HKCU "${UNINST_KEY}" "DisplayVersion" "${APP_VERSION}"
    WriteRegStr HKCU "${UNINST_KEY}" "Publisher" "${PUBLISHER}"
    WriteRegStr HKCU "${UNINST_KEY}" "UninstallString" '"$INSTDIR\Uninstall opendataeditor.exe" /currentuser'
    WriteRegStr HKCU "${UNINST_KEY}" "DisplayIcon" "$INSTDIR\opendataeditor.exe"
    WriteRegStr HKCU "${UNINST_KEY}" "InstallLocation" "$INSTDIR"
    WriteRegStr HKCU "${UNINST_KEY}" "NoModify" 1
    WriteRegStr HKCU "${UNINST_KEY}" "NoRepair" 1
    WriteRegDWORD HKCU "${UNINST_KEY}" "EstimatedSize" "$0"
SectionEnd

Section "Uninstall"
    ; Remove application files
    RMDir /r "$INSTDIR"

    ; Remove shortcuts
    RMDir /r "$SMPROGRAMS\${APP_NAME}"

    ; Remove registry entries
    DeleteRegKey HKCU "${UNINST_KEY}"
SectionEnd