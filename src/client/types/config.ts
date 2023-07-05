export interface IConfig {
  system: ISystemConfig
  project: IProjectConfig
}

export interface ISystemConfig {
  openaiApiKey?: string
}

export interface IProjectConfig {}
