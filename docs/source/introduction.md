# Introduction

## What is Open Data Editor

[Open Data Editor (ODE)](https://okfn.org/opendataeditor), developed by the [Open Knowledge Foundation (OKFN)](https://okfn.org/en/), is a free, open-source tool designed to help nonprofits, data journalists, activists, and public servants detect errors in their datasets. It is designed for people working with tabular data (Excel, Google Sheets, CSV) who don't know how to code or don't have the programming skills to automatise the data exploration process.

The technical mission of ODE is to provide a free, open-source, no-code, cross-platform desktop application that empowers non-technical users working with tabular data to quickly detect and correct errors, enforce data-validation and metadata standards (notably the [FAIR principles](https://www.go-fair.org/fair-principles/)), and output clean, interoperable datasets ready for publication – while preserving privacy (local-first architecture), remaining lightweight (suitable for low-resource or offline contexts), and employing open standards (e.g., the [Frictionless framework](https://framework.frictionlessdata.io/)) for maximum reuse and integration.

Since 2025, the Digital Public Goods Alliance (DPGA) has recognised Open Data Editor as a [digital public good](https://blog.okfn.org/2025/10/22/open-data-editor-recognised-as-a-digital-public-good/) (DPG), which means it meets high standards of openness and supports sustainable development globally.

## FAIR data 

The Open Data Editor (ODE) improves data quality based on the [FAIR principles](https://www.go-fair.org/fair-principles/).

As described by the [GO FAIR initiative](https://www.go-fair.org/), FAIR data refers to data that adheres to the **Findable**, **Accessible**, **Interoperable**, and **Reusable** principles, designed to make research data more discoverable and usable by people and machines, enhancing its value and reuse.

**Findable**  
The first step in (re)using data is to find it. Metadata and data should be easy to find for both humans and computers.

**Accessible**  
Once the user finds the required data, they need to know how it can be accessed, possibly including authentication and authorisation.

**Interoperable**  
The data usually need to be integrated with other data. In addition, the data needs to interoperate with applications or workflows for analysis, storage, and processing.

**Reusable**  
The ultimate goal of FAIR is to optimise the reuse of data. To achieve this, metadata and data should be well-described so that they can be replicated and/or combined in different settings.

Learn all about the FAIR principles in [Module 4](https://schoolofdata.org/courses/quality-and-consistent-data-with-open-data-editor/lessons/introduction-6/) of the ‘Quality and Consistent Data with ODE’ course, available on [School of Data](https://schoolofdata.org/).

## Responsible AI integration

The Open Data Editor (ODE) has an AI component to help users better understand their data. The AI component is powered by local models. **No data is sent to the cloud, and all operations take place on the user’s computer.**

The introduction of these AI-assisted data quality features significantly expands the tool’s capabilities, enabling faster identification of anomalies, smarter suggestions for corrections, and improved handling of large, dense datasets while retaining a privacy-preserving, local-first design.

This deepens Open Knowledge Foundation's commitment to developing simple, sustainable and long-lasting technologies that solve people’s real problems, in line with [The Tech We Want](https://okfn.org/en/projects/the-tech-we-want/) initiative.

In order to use the AI feature, ODE will guide users to download the model onto their machine first.

:::{note} 
As the model is local and all computing will be happening in the user’s computer, performance will be affected by the machine’s hardware, and the response quality sometimes will be minor than typical cloud LLMs like ChatGPT, Deepseek or Claude. 
:::

ODE is trying to balance user experience for non-technical audiences and performance and privacy.

## Free data literacy course 

Open Data Editor's focus on improving digital literacy and preparing non-technical users to work with data, led us to develop a free course available on School of Data. [‘Quality and Consistent Data with the Open Data Editor’](https://schoolofdata.org/courses/quality-and-consistent-data-with-open-data-editor/) is an essential open educational resource for anyone who wants to generate knowledge from data. The course is now available in English and Portuguese, and will soon be translated into Spanish and French.

It is specially designed for non-technical users working with tabular data (Excel, Google Sheets, CSV) but without advanced technical knowledge. It's 100% online, free, and gamified.

You can check the contents and enrol here: [https://schoolofdata.org/courses/quality-and-consistent-data-with-open-data-editor/](https://schoolofdata.org/courses/quality-and-consistent-data-with-open-data-editor/) 

## Similar tools and differentiators

The tools currently available with functions similar to those of the Open Data Editor were created for a specific purpose and have a more technical profile. This makes them difficult for people unfamiliar with code, standards or programming languages to access.

The main differences in relation to ODE are listed in each subsection below:

### Data Check

Available at: [https://data.humdata.org/tools/datacheck/import](https://data.humdata.org/tools/datacheck/import)

Main differences:

* Maximum file size: 20 MB.  
* Works only with the HXL standard.  
* The table view after the error check is limited, and the user needs to navigate through several tabs if the file has many lines.  
* Does not include a publication feature.

### IATI Validator

Available at: [https://validator.iatistandard.org/](https://validator.iatistandard.org/)

Main differences:

* Works only with the IATI standard.  
* Targets a specific sector, the international aid community.  
* The tool offers five levels of qualification regarding data quality (Success, Success with Advisories, Warning, Error, and Critical), rather than a list of all errors and how to correct them.

### CSV Lint.io

Available at: [https://csvlint.io/](https://csvlint.io/)

Main differences:

* Works only with CSV files, informing the user if the file “is readable” or not.  
* Agnostic tool; the schema can also be ingested.

### 360Giving Data Quality Checker

Available at: [https://dataquality.threesixtygiving.org/](https://dataquality.threesixtygiving.org/) 

Main differences:

* Works only with the 360Giving standard.

## Acknowledgements

We are grateful for the support and partnership of the [Patrick J. McGovern Foundation (PJMF)](https://www.mcgovern.org/), without which the development of the Open Data Editor would not have been possible. Learn more about its funding programmes [here](https://www.mcgovern.org/grants/).

## Latest updates

Open Data Editor is being built in the open. Follow the progress, from feature updates to community stories on the Open Knowledge Blog: [https://blog.okfn.org/category/open-data-editor/](https://blog.okfn.org/category/open-data-editor/) 