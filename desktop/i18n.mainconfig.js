import i18n from 'i18next';
import backend from 'i18next-fs-backend'
import {
    initReactI18next
  } from "react-i18next";

// On Mac, the folder for resources isn't
// in the same directory as Linux/Windows;
// https://www.electron.build/configuration/contents#extrafiles
import path from 'path';
const isMac = process.platform === 'darwin';
const isDev = process.env.NODE_ENV === 'development';
const prependPath = isMac && !isDev ? path.join(process.resourcesPath, '..') : '.';

i18n.use(backend)
    .use(initReactI18next)
    .init({
        backend: {
            loadPath: prependPath + '/client/locales/{{lng}}.json',
            contextBridgeApiKey: "opendataeditor"
        },
        debug: false,
        namespace: 'translation',
        saveMissing: true,
        saveMissingTo: 'current',
        lng: 'en',
        fallbackLng: false, // set to false when generating translation files locally
        });

export default i18n;