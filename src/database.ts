import dotenv from 'dotenv'
import { Pool } from 'pg'

dotenv.config()
const {
POSTGRES_HOST,
POSTGRES_DB,
POSTGRES_USER,
POSTGRES_PASSWORD,
TEST_HOST,
TEST_DB,
TEST_USER,
TEST_PASSWORD,
NODE_ENV
} = process.env 
let client: Pool

if (NODE_ENV == 'dev') {
  client = new Pool({
    host: POSTGRES_HOST,
    database: POSTGRES_DB,
    user: POSTGRES_USER,
    password: POSTGRES_PASSWORD,
  })
      ;
} else {
  client = new Pool({
    host: TEST_HOST,
    database: TEST_DB,
    user: TEST_USER,
    password: TEST_PASSWORD,
  });
}

export default client
