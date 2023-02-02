// TODO: review this file (why we have it?)
declare module '*.jpg' {
  export default '' as string
}
declare module '*.png' {
  export default '' as string
}
declare module '*.yaml' {
  const data: any
  export default data
}
