import * as React from 'react'
import noop from 'lodash/noop'
import { IPipeline } from '../../interfaces/pipeline'
import Task from './Task'

export interface PipelineProps {
  pipeline: IPipeline
  onSave?: (pipeline: IPipeline) => void
}

export default function Pipeline(props: PipelineProps) {
  const pipeline = props.pipeline
  const onSave = props.onSave || noop
  if (!pipeline.tasks.length) return null
  return <Task task={pipeline.tasks[0]} onSave={(task) => onSave({ tasks: [task] })} />
}
