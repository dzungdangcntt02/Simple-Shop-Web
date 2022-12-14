/* eslint-disable */
import mongoose from 'mongoose'

import { adminRole, userRole } from '../../src/config/setup.mjs'
import { Role } from '../../src/models/role.model.mjs'

const dbname = 'testDB'
const options = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}
const uri = `mongodb://localhost:27017/${dbname}`

const checkAdminRoleExists = Role.find({ name: adminRole.name })
const checkUserRoleExists = Role.find({ name: userRole.name })

const setupTestDB = () => {
  beforeAll(() => {
    mongoose.connect(uri, options)
      .then(async () => {
        await mongoose.connection.dropDatabase();
        const adminRoles = await checkAdminRoleExists
        const userRoles = await checkUserRoleExists

        if (adminRoles.length <= 0 && userRoles.length <= 0) {
          Role.create(adminRole, userRole)
          console.log('Created roles for test env'.cyan)
        }
      })
      .catch(err => console.log(err))
  });

  beforeEach(async () => {
    // Delete all old collections
    await Promise.all(Object.values(mongoose.connection.collections).map(async (collection) => {
      if (collection.name !== 'roles') return collection.deleteMany()
    }));
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.disconnect();
  });
};

export default setupTestDB
