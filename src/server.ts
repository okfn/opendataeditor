import cors from 'cors'
import morgan from 'morgan'
import multer from 'multer'
import express from 'express'
export type IRequest = express.Request
export type IResponse = express.Response
const upload = multer()

export class Server {
  protected app: express.Express
  protected server?: any

  constructor() {
    this.app = express()
    this.app.use(express.json({ limit: '10mb' }))
    this.app.use(express.urlencoded({ extended: true }))
    this.app.use(morgan('tiny'))
    this.app.use(cors())
    this.app.post('/', upload.single('file'), this.main)
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

  protected async main(request: IRequest, response: IResponse) {
    console.log(request.file)
    console.log(request.body)
    response.send('Hello World!')
  }
}
