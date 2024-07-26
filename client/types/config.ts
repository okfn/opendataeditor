export interface IConfig {
  system: ISystemConfig
  project: IProjectConfig
  folder: string
  hideWelcomeScreen: boolean
}

export interface ISystemConfig {
  openaiApiKey?: string
}

export interface IProjectConfig {
  name?: string
}
