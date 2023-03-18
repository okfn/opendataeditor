export interface IHelp {
  [path: string]: [title: string, link: string, description: string]
}
export interface IHelpItem {
  path: string
  title: string
  description: string
  link: string
}
