// Genearl

export const FORMATS = ['csv', 'xlsx']
export const HASHINGS = ['md5', 'sha256']
export const ENCODINGS = ['utf-8', 'iso-8859-1']

// Defaults

export const DEFAULT_PORT = 7070
export const DEFAULT_EXPORT_FORMAT = 'json'
export const DEFAULT_FIELD_CONFIDENCE = 0.9

// Others

export const STEPS = [
  {
    label: 'Describe',
    page: 'describe',
    description:
      "You can infer, edit and save metadata of your data tables. It's a first step for ensuring data quality and usability. You can use this mode in isolation just e.g. uploading a file, editing a schema, and exporting it. Another option is to commit changes globally to be used in extract, validate, and transform modes.",
  },
  {
    label: 'Extract',
    page: 'extract',
    description:
      'You can read your data using a unified tabular interface. Data quality and consistency are guaranteed by a schema.',
  },
  {
    label: 'Validate',
    page: 'validate',
    description:
      'You can validate data tables, resources, and datasets. Frictionless generates a unified validation report.',
  },
  {
    label: 'Transform',
    page: 'transform',
    description:
      'You can clean, reshape, and transfer your data tables and datasets. Frictionless provides a pipeline capability.',
  },
]
