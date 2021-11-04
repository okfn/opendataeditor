import cors from 'cors'
import morgan from 'morgan'
import express from 'express'
export type IRequest = express.Request
export type IResponse = express.Response

export class Server {
  protected app: express.Express
  protected server?: any

  constructor() {
    this.app = express()
    this.app.use(express.json({ limit: '10mb' }))
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(morgan('tiny'))
    this.app.use(cors())
    this.app.get('/', this.home)
  }

  // Listen

  start({ port }: { port: number }) {
    this.server = this.app.listen(port, () => {
      console.log(`Server listening on port ${port}!`)
    })
  }

  stop() {
    if (this.server) {
      this.server.close()
    }
  }

  // Routes

  protected async home(_request: IRequest, response: IResponse) {
    response.send('Hello World!')
  }
}
