import classNames from 'classnames'
import { useState } from 'react'
import Table from './Table'

export interface ReportGroupProps {
  count: number
  type: string
  title: string
  description: string
  messages: string[]
  tags: string[]
  labels: string[]
  data: {
    [rowNumber: number]: {
      values: any[]
      errors: Set<number>
    }
  }
}

export default function ReportGroup(props: ReportGroupProps) {
  const [visibleRowsCount, setVisibleRowsCount] = useState(10)
  const rowNumbers = getRowNumbers(props)
  return (
    <div className="result">
      {/* Heading */}
      <div className="error-summary">
        <div
          className={classNames({
            'd-flex': true,
            'align-items-center': true,
            'button-report': true,
          })}
        >
          <span> {props.title} </span>
          <span
            className={classNames({
              badge: true,
              'badge-error': true,
              count: true,
            })}
          >
            {props.count}
          </span>
        </div>
        <div>
          {props.description && (
            <div className="error-description">
              <div>{props.description}</div>
            </div>
          )}
        </div>
      </div>

      {/* Table view */}
      {!['source-error'].includes(props.type) && (
        <div className="table-view">
          <div className="inner">
            <Table
              tags={props.tags}
              labels={props.labels}
              data={props.data}
              visibleRowsCount={visibleRowsCount}
              rowNumbers={rowNumbers}
            />
          </div>
        </div>
      )}

      {/* Show more */}
      {visibleRowsCount < rowNumbers.length && (
        <a
          className="show-more"
          onClick={() => setVisibleRowsCount(visibleRowsCount + 10)}
        >
          Show more <span className="icon-keyboard_arrow_down" />
        </a>
      )}
    </div>
  )
}

// Helpers

function getRowNumbers(props: ReportGroupProps) {
  return Object.keys(props.data)
    .map((item) => parseInt(item, 10))
    .sort((a, b) => a - b)
}
