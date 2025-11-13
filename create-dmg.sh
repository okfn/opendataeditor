#!/bin/sh
# File to create the DMG file using create-dmg tool and notarize it.
#
# It is intended to work on Github Actions and so it might not be the most optimized
# workflow for executing it locally (because of the secrets required for code sign
# and notarizing)
#
# This script expects 6 secrets:
#  - CSC_LINK: A base64 encoded p12 certificate.
#  - CSC_KEY_PASSWORD: The password used to encrypt the p12 certificate
#  - APPLE_TEAM_ID: This is the ID of the team of your Apple Developer Account (Something like S1235Q75WSA)
#  - APPLE_APPLE_ID: This is the ID of your Apple Developer Account (usually your email)
#  - APPLE_APP_SPECIFIC_PASSWORD: The Application Specific Password created in your Developer Account.
#
# How to generate an APPLE_APP_SPECIFIC_PASSWORD
# 1) Visit the Apple ID website: https://appleid.apple.com/
# 2) Sign in with your Apple ID credentials
# 3) Navigate to the "Security" section
# 4) Look for "App-Specific Passwords"
# 5) Click "Generate Password..."
# 6) Enter a descriptive label (e.g., "macOS App Notarization")
# 7) Apple will generate a 16-character app-specific password
# 8) Copy this password and use it as the value for the $APPLE_APP_SPECIFIC_PASSWORD environment variable in your notarization workflow
#
# Context and materials that inspired this script:
#  - https://www.pythonguis.com/tutorials/packaging-pyqt6-applications-pyinstaller-macos-dmg/
#  - https://medium.com/flutter-community/build-sign-and-deliver-flutter-macos-desktop-applications-on-github-actions-5d9b69b0469c
#  - https://defn.io/2023/09/22/distributing-mac-apps-with-github-actions/
#  - https://gist.github.com/txoof/0636835d3cc65245c6288b2374799c43
# 
# Issues we had with the notarization process:
# - https://github.com/pyinstaller/pyinstaller/issues/8927

# Build the project
[ -e build ] && rm -r build
[ -e dist ] && rm -r dist
uv run build.py build

mv "dist/OpenDataEditor.app" "dist/Open Data Editor.app"

# # Codesign the executable created by pyinstaller
echo "Codesigning the executable created by PyInstaller"
echo $CSC_LINK | base64 --decode > certificate.p12
security create-keychain -p thisisatemporarypass build.keychain
security default-keychain -s build.keychain
security unlock-keychain -p thisisatemporarypass build.keychain
security import certificate.p12 -k build.keychain -P $CSC_KEY_PASSWORD -T /usr/bin/codesign
security set-key-partition-list -S apple-tool:,apple:,codedign: -s -k thisisatemporarypass build.keychain

echo "Signing complete application bundle..."
/usr/bin/codesign --force --deep --options=runtime --entitlements ./packaging/macos/entitlements.mac.plist -s $APPLE_TEAM_ID --timestamp "dist/Open Data Editor.app"

# Verify signature
echo "Verifying signature..."
codesign -vvv --deep --strict "dist/Open Data Editor.app"

echo "Signing process completed."

# Create dmg folder and copy our signed executable
mkdir -p dist/dmg

# We need to use -R to copy the app bundle recursively instead of -r because it doesn't preserver the symlinks otherwise
# https://github.com/pyinstaller/pyinstaller/issues/8927
# https://pyinstaller.org/en/stable/common-issues-and-pitfalls.html#requirements-imposed-by-symbolic-links-in-frozen-application
cp -R "dist/Open Data Editor.app" "dist/dmg" 

# We need to detach the volume if it is already mounted
# and remove the dmg file if it exists
echo "Unmounting any existing volume..."
hdiutil detach /Volumes/"Open Data Editor" &>/dev/null || true
sleep 5
rm -f *.dmg

# Create the dmg file
VERSION=$(uv run python -c "import ode; print(ode.__version__)")
FILENAME=opendataeditor-macos-$VERSION.dmg
[ -e $FILENAME ] && rm $FILENAME

MAX_RETRIES=3
RETRY_COUNT=0

while [ $RETRY_COUNT -lt $MAX_RETRIES ]; do
  echo "Creating the DMG file"
  if create-dmg \
    --volname "Open Data Editor" \
    --volicon "./packaging/macos/icon.icns" \
    --window-pos 200 120 \
    --window-size 800 400 \
    --icon-size 100 \
    --icon "Open Data Editor.app" 200 190 \
    --hide-extension "Open Data Editor.app" \
    --app-drop-link 600 185 \
    $FILENAME \
    "dist/dmg/";then

    echo "DMG created: $FILENAME"
    break
  else
      RETRY_COUNT=$((RETRY_COUNT + 1))
      echo "Failed to create DMG. Retrying... ($RETRY_COUNT/$MAX_RETRIES)"
      hdiutil detach "/Volumes/Open Data Editor" -force &>/dev/null || true
      killall Finder &>/dev/null || true
      sleep 20
  fi
done

if [ $RETRY_COUNT -eq $MAX_RETRIES ]; then
    echo "Failed to create DMG after $MAX_RETRIES attempts. Exiting."
    exit 1
fi

if [ ! -f "$FILENAME" ]; then
    echo "DMG file not found. Exiting."
    exit 1
fi

# Notarize the DMG File
# If an error occurs, we can check the logs using
# xcrun notarytool log $REPLACE-WITH-RUNNING-HASH --team-id $APPLE_TEAM_ID --apple-id $APPLE_ID --password $APPLE_APP_SPECIFIC_PASSWORD notarization_log.json
echo "Notarizing the DMG file"
xcrun notarytool submit --verbose --team-id $APPLE_TEAM_ID --apple-id $APPLE_ID --password $APPLE_APP_SPECIFIC_PASSWORD --wait $FILENAME > notarization_output.txt

# Staple the file
# We check if the notarization was successful
if grep -q "status: Accepted" notarization_output.txt; then
  echo "Notarization successful!"
  
  # We wait for 30 seconds to make sure the notarization ticket is available
  echo "Waiting 30 seconds for notarization ticket to be available..."
  sleep 30
  
  echo "Stapling the file"
  xcrun stapler staple $FILENAME
else
  echo "Notarization failed. Check notarization_output.txt for details."
  cat notarization_output.txt
  exit 1
fi
