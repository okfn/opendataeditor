# Translations

The ODE supports several languages following the [Qt Framework practices for internationalization](https://doc.qt.io/qt-6/internationalization.html).

## Internationalization workflow
:::{note}
The ODE provides a `make update-translations` and `make compile-translations` command for all the supported languages. Check the project's `Makefile` file for reference.
:::

1. Create or update translation files by running `make update-translations` (or the `pyside6-lupdate` command directly if you are in MacOS)
2. Update the translation files:
    1. Complete `unfinished` translations (this is the actual addition of translated text).
    2. Clean `vanished` translations.
3. Compile the translations files by running `make compile-translations` (or the `pyside6-lrelease` command directly if you are in MacOS)
4. Commit both the `.ts` and `.qm` files.
5. Create a PR with the changes.

All translation files are located in the `ode/assets/translations/` folder.

## Translation Tools

For updating translations you can use either:

  1. A text editor to directly update the translation files (*.ts)
  2. Install Qt and use [Qt Linguist](https://doc.qt.io/qt-6/qtlinguist-index.html) application to do the translation using a UI.

## Adding new languages

When adding a new language two extra changes are required:

1. Add the new language to both `make update-translations` and `make compile-translations` commands of the `Makefile`. (after doing this you can run the `make update-translations` and it will create the `.ts` file for you.)
2. Update the `language` QComboBox of the `main.py` file so the new language appears as an option to the user.

Here is a reference Pull Request of what is expected when adding a new language: [https://github.com/okfn/opendataeditor/pull/750](https://github.com/okfn/opendataeditor/pull/750)
