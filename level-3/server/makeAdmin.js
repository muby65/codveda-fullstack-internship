require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

async function main() {
  const email = (process.argv[2] || '').toLowerCase();

  if (!email) {
    console.log('Usage: node makeAdmin.js user@example.com');
    process.exit(1);
  }

  await mongoose.connect(process.env.MONGODB_URI);
  const user = await User.findOneAndUpdate({ email }, { role: 'admin' }, { new: true });

  console.log(user ? `${user.email} is now an admin` : 'No user found with that email');
  await mongoose.disconnect();
}

main().catch(err => {
  console.error(err.message);
  process.exit(1);
});
