import * as React from 'react'
import noop from 'lodash/noop'
import { IInquiry } from '../../interfaces/inquiry'
import Task from './Task'

export interface InquiryProps {
  inquiry: IInquiry
  onSave?: (inquiry: IInquiry) => void
}

export default function Inquiry(props: InquiryProps) {
  const inquiry = props.inquiry
  const onSave = props.onSave || noop
  if (!inquiry.tasks.length) return null
  return <Task task={inquiry.tasks[0]} onSave={(task) => onSave({ tasks: [task] })} />
}
