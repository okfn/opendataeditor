declare module '*.jpg' {
  export default '' as string
}

declare module '*.png' {
  export default '' as string
}

declare module '*.svg' {
  export default '' as string
}

declare module '*.yaml' {
  const data: any
  export default data
}
