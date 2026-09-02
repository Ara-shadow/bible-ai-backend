import { AdminModel } from './src/models/index.js';
import { hashPassword } from './src/utils/bcrypt.js';

async function createAdmin() {
  console.log('\n?? Creating admin account...\n');
  
  const username = 'admin';
  const email = 'admin@example.com';
  const password = 'Admin123456';

  try {
    // Check if admin already exists
    const existing = await AdminModel.findOne({ username });
    if (existing) {
      console.log('? Admin already exists!');
      console.log('Username:', existing.username);
      console.log('Email:', existing.email);
      return;
    }

    // Create new admin
    const hashedPassword = await hashPassword(password);
    const admin = await AdminModel.create({
      username,
      email,
      password: hashedPassword,
    });

    console.log('? Admin created successfully!');
    console.log('   Username:', admin.username);
    console.log('   Email:', admin.email);
    console.log('   Password:', password);
    console.log('\nYou can now log in at: http://localhost:5173/admin/login');

  } catch (error) {
    console.error('? Error:', error);
  }
}

createAdmin();
