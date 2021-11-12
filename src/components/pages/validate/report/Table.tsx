import React from 'react'
import classNames from 'classnames'
import { IReportError } from '../../../../interfaces/report'

interface TableProps {
  reportError: IReportError
  visibleRowsCount: number
  rowPositions: number[]
}

export default function Table(props: TableProps) {
  const { reportError, visibleRowsCount, rowPositions } = props
  const isHeaderVisible = reportError.tags.includes('#row')
  let afterFailRowPosition = 1
  if (rowPositions[rowPositions.length - 1]) {
    afterFailRowPosition = rowPositions[rowPositions.length - 1] + 1
  } else {
    afterFailRowPosition = 2
  }
  return (
    <table className="table table-sm" style={{ display: 'table' }}>
      <tbody>
        {reportError.header && isHeaderVisible && (
          <tr className="before-fail">
            <td className="text-center">1</td>
            {reportError.header.map((label, index) => (
              <td key={index}>{label}</td>
            ))}
          </tr>
        )}
        {rowPositions.map(
          (rowPosition, index) =>
            index < visibleRowsCount && (
              <tr key={index}>
                <td className="result-row-index">{rowPosition || 1}</td>
                {reportError.data[rowPosition].values.map((value, innerIndex) => (
                  <td
                    key={innerIndex}
                    className={classNames({
                      fail: reportError.data[rowPosition].errors.has(innerIndex + 1),
                    })}
                  >
                    {value}
                  </td>
                ))}
              </tr>
            )
        )}
        <tr className="after-fail">
          <td className="result-row-index">{afterFailRowPosition}</td>
          {reportError.header && reportError.header.map((_, index) => <td key={index} />)}
        </tr>
      </tbody>
    </table>
  )
}
