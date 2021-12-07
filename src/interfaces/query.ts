export interface IQuery {
  pickFields?: (string | number)[]
  skipFields?: (string | number)[]
  limitFields?: number
  offsetFields?: number
  pickRows?: (string | number)[]
  skipRows?: (string | number)[]
  limitRows?: number
  offsetRows?: number
}
