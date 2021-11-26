export interface IDetector {
  bufferSize: number
  sampleSize: number
  fieldType?: string
  fieldNames?: string[]
  fieldConfidence?: number
  fieldFloatNumbers?: boolean
  fieldMissingValues?: string
  schemaSync?: boolean
  schemaPatch?: object
}
