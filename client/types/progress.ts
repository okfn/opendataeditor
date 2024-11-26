export type IProgress = {
  type: 'error' | string
  title?: string
  message?: string
  blocking?: boolean
}
