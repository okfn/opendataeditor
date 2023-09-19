import { marked } from 'marked'
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
  const [isDetailsVisible, setIsDetailsVisible] = useState(false)
  const [visibleRowsCount, setVisibleRowsCount] = useState(10)
  const rowNumbers = getRowNumbers(props)
  return (
    <div className="result">
      {/* Heading */}
      <div className="d-flex align-items-center">
        <span className="count">{props.count} x</span>
        <a
          role="button"
          className={classNames({
            badge: true,
            'badge-error': true,
            collapsed: !isDetailsVisible,
          })}
          data-toggle="collapse"
          onClick={() => setIsDetailsVisible(!isDetailsVisible)}
          aria-expanded="false"
        >
          {props.title}
        </a>
      </div>

      {/* Error details */}
      <div className={classNames(['collapse', { show: isDetailsVisible }])}>
        <div className="error-details">
          {props.description && (
            <div className="error-description">
              <div dangerouslySetInnerHTML={{ __html: marked(props.description) }} />
            </div>
          )}
          <div className="error-list">
            <p className="error-list-heading">The full list of error messages:</p>
            <ul>
              {props.messages.map((message, index) => (
                <li key={index}>{message}</li>
              ))}
            </ul>
          </div>
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
