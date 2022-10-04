/* eslint-disable */
import mongoose from 'mongoose'

const dbname = process.env.DB_NAME || 'testDB'
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}
const uri = `mongodb://localhost:27017/${dbname}`

const setupTestDB = () => {
  beforeAll(() => {
    mongoose.connect(uri, options)
      .then(() => { })
      .catch(e => { })
  });

  beforeEach(async () => {
    // Delete all old collections
    await Promise.all(Object.values(mongoose.connection.collections).map(async (collection) => collection.deleteMany()));
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });
};

export default setupTestDB
