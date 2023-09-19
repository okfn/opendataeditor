import CsvFormat from './Csv'
import EmptyFormat from './Empty'
import ExcelFormat from './Excel'
import JsonFormat from './Json'
import { useStore } from '../../store'

export default function Format() {
  const format = useStore((state) => state.format)
  switch (format) {
    case 'csv':
      return <CsvFormat />
    case 'excel':
      return <ExcelFormat />
    case 'json':
      return <JsonFormat />
    default:
      return <EmptyFormat />
  }
}
