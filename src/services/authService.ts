import { App, Credentials, User } from 'realm-web'
import MongoDBDatabase = Realm.Services.MongoDBDatabase

const app = new App({ id: 'bg-index-wsvuk' })

export class AuthService {
  constructor(
    private db: MongoDBDatabase,
    private user: User
  ) {}

  static async create(): Promise<AuthService> {
    const user = app.currentUser ?? (await app.logIn(Credentials.anonymous()))
    return new AuthService(
      user.mongoClient('mongodb-atlas').db('bg-index'),
      user
    )
  }

  async signIn(email: string, password: string): Promise<void> {
    this.user = await app.logIn(Credentials.emailPassword(email, password))
    this.db = this.user.mongoClient('mongodb-atlas').db('bg-index')
  }

  async signOut(): Promise<void> {
    await this.user.logOut()
  }

  isSignedIn(): boolean {
    return this.user.providerType !== 'anon-user'
  }

  getDatabase(): MongoDBDatabase {
    return this.db
  }
}
