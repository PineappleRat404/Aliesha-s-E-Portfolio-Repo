//Converts plain-text passwords to hashed for all user roles
require('dotenv').config();
const bcrypt = require('bcrypt');
const { Customer, Technician, Administrator } = require('./src/models'); 

async function hashPasswordsForModel(model, idFieldName) {
  const users = await model.findAll();

  for (const user of users) {
    const plainPassword = user.password;

    if (plainPassword && !plainPassword.startsWith('$2b$') && !plainPassword.startsWith('$2a$')) {
      const hashed = await bcrypt.hash(plainPassword, 10);
      user.password = hashed;
      await user.save();
      console.log(`Password for ${model.name} ID ${user[idFieldName]} hashed.`);
    } else {
      console.log(`${model.name} ID ${user[idFieldName]} password already hashed.`);
    }
  }
}

async function migratePasswords() {
  try {
    await hashPasswordsForModel(Customer, 'customerid');
    await hashPasswordsForModel(Technician, 'techid');
    await hashPasswordsForModel(Administrator, 'username'); 

    console.log('\n All passwords migrated!');
    process.exit(0);
  } catch (error) {
    console.error('\n Migration error:', error);
    process.exit(1);
  }
}

migratePasswords();
