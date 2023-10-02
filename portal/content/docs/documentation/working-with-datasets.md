---
title: Working with Datasets
sidebar:
  order: 7
---

This section explains about how to create dataset and publish it.

## Creating a Dataset

You can upload a package/dataset with its resources if you already have one. To upload click `Add > Local Folder` button on the bottom left of the `File Explorer`.

![ADD DATASET](./assets/working-with-datasets/datasets-add.png)

If you have resources files only, you can generate a package by using `Create Dataset` dialg box. To open the dialog, navigate to `Create > Datasets` menu. From there, set the file name and click `Create` button to create the dataset.

![CREATE DATASET](./assets/working-with-datasets/datasets-create.png)

Within the dialog box, you can also use `AI` by giving instructions through prompt input box. For instance, "Use table.csv only"

## Editing Metadata

Once you have package file `<file_name>.json`, you can make changes to it using `Metadata` editor. Using the UI, you can add/change resources, licenses, contributors and sources.

![EDIT DATASET](./assets/working-with-datasets/datasets-editor.png)

## Adding Resources

Resources can be added to dataset/package in multiple ways. While creating dataset/package, specify the resources you want to include in `Chat AI` prompt.

![ADD RESOURCE](./assets/working-with-datasets/datasets-resources-ai.png)

Or, you can add it using `Metadata` editor. To add new resource navigate to `Package > Resources`, you will see the list view page for resources. Click on the `Add Resource` button and select the resources you want to add.

![RESOURCE LIST](./assets/working-with-datasets/datasets-resources-listview.png)

Or, if the package has the resources listed in the metadata, it will automatically be listed in `Metadata > Package > Resources` section.

## Publishing

Make sure to save the modifications made to metadata by using `Save` button. Once the package and resources are ready, you can proceed to publish the dataset by clicking `Publish` button.

![PUBLISH DATASET](./assets/working-with-datasets/datasets-publish.png)

ODE supports publishing to multiple platforms: `CKAN`, `Github`, `Zenodo`. You can choose the platform of your choice and publish the dataset by adding the required credentials.
