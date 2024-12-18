import classNames from 'classnames'
import { truncate } from 'lodash'
import { useTranslation } from 'react-i18next'
import LightTooltip from '../../Parts/Tooltips/Light'

export interface ReportTableProps {
  tags: string[]
  labels: string[]
  data: {
    [rowNumber: number]: {
      values: any[]
      errors: Set<number>
    }
  }
  visibleRowsCount: number
  rowNumbers: number[]
}

export default function ReportTable(props: ReportTableProps) {
  const { t } = useTranslation()
  const { visibleRowsCount, rowNumbers } = props
  const isHeaderVisible = props.tags.includes('#row')
  let afterFailRowNumber = 1
  if (rowNumbers[rowNumbers.length - 1]) {
    afterFailRowNumber = rowNumbers[rowNumbers.length - 1] + 1
  } else {
    afterFailRowNumber = 2
  }
  return (
    <table className="table table-sm" style={{ display: 'table' }}>
      <tbody>
        {props.labels && isHeaderVisible && (
          <tr className="before-fail">
            <td className="text-center">{t('row-number')}</td>
            {props.labels.map((label, index) => (
              <td key={index}>{label}</td>
            ))}
          </tr>
        )}
        {rowNumbers.map(
          (rowNumber, index) =>
            index < visibleRowsCount && (
              <tr key={index}>
                <td className="result-row-index">{rowNumber || t('row-number')}</td>
                {props.data[rowNumber].values.map((value, innerIndex) => (
                  <td
                    key={innerIndex}
                    className={classNames({
                      fail: props.data[rowNumber].errors.has(innerIndex + 1),
                    })}
                  >
                    {value.length > 50 ? (
                      <LightTooltip title={value}>
                        <div className="cell-content" style={{ lineClamp: 1 }}>
                          {truncate(value, { length: 50 })}
                        </div>
                      </LightTooltip>
                    ) : (
                      <div className="cell-content">{value}</div>
                    )}
                  </td>
                ))}
              </tr>
            )
        )}
        <tr className="after-fail">
          <td className="result-row-index">{afterFailRowNumber}</td>
          {props.labels && props.labels.map((_, index) => <td key={index} />)}
        </tr>
      </tbody>
    </table>
  )
}
