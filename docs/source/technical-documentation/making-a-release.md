## Making a release

To make a release, follow the following checklist:

* Check with the Product Owner that the `main` branch is code complete.  
* Check that the distributables built on `main` are working by installing them on your machine.  
* Sometimes PyInstaller cannot compile new dependencies, and the application will fail at runtime.  
* Create a new PR bumping the version of the application in the `pyproject.toml` file and merge it to main.  
* Create a New Github Release with a new tag matching the new version number of the application.  
* Fill in the Release notes.  
* Create the Release.  
* Wait until the GitHub Action for the new tag finishes, and then upload the distributable files to the new Release.  
* Notify the Communications Team to make the announcement and changes to the [OKFN’s Website](https://okfn.org/opendataeditor/).