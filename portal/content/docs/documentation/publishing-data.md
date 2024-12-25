---
title: Publishing your data
sidebar:
  order: 11
---

You can publish a file using the **Publish** feature located at the top right of the datagrid:

![Publish button](./assets/publishing-data/publish-button.png)

Once you click the **Publish** button, the ODE will display the following dialog:

![Publish form](./assets/publishing-data/publish-form.png)

:::note
To be able to publish, you have to set the required credentials to connect to a data portal (CKAN, Zenodo, Github).
:::

## Zenodo

:::note
For testing purposes, you can use the Zenodo sandbox environment. To do so, set the Zenodo URL to `https://sandbox.zenodo.org`.
:::

To publish your data on Zenodo, you need to provide the following information:

- **Title**: The title of the dataset.
- **Description**: A description of the dataset.
- **Author**: The author of the dataset.
- **API Key**: Your Zenodo API key. You can find it in your Zenodo account settings:
  - Go to the token creation page: [Production](https://zenodo.org/account/settings/applications/tokens/new/) OR [Sandbox](https://sandbox.zenodo.org/account/settings/applications/tokens/new/)
  - Set the name of the token (e.g. ODE)
  - Set scopes to `deposit:write`
  - Click on the `Create` button
  - Copy the token, securely save it, and paste it in the API Key field.

