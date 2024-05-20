/*
 * It returns a Monaco Editor language based on the file format.
 * If format is not supported (e.g. binary), it returns undefined.
 */
export function getLanguageByFormat(format?: string) {
  switch (format) {
    case 'csv':
      return 'csv'
    case 'tsv':
      return 'tsv'
    case 'ndjson':
      return 'json'
    case 'jsonl':
      return 'json'
    case 'json':
      return 'json'
    case 'geojson':
      return 'json'
    case 'topojson':
      return 'json'
    case 'yaml':
      return 'yaml'
    case 'md':
      return 'markdown'
    case 'py':
      return 'python'
    case 'js':
      return 'javascript'
    case 'r':
      return 'r'
    case 'html':
      return 'html'
    default:
      return undefined
  }
}
