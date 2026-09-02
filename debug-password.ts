import bcrypt from 'bcryptjs';
import fs from 'fs';

async function debugPassword() {
  console.log('\n?? Debugging admin password...\n');
  
  // Read the admin data
  const adminData = JSON.parse(fs.readFileSync('data/admins.json', 'utf8'));
  const admin = adminData[0];
  
  console.log('Admin username:', admin.username);
  console.log('Stored password hash:', admin.password);
  
  const testPassword = 'Admin123456';
  
  // Test the password
  const isValid = await bcrypt.compare(testPassword, admin.password);
  console.log('\nPassword test result:', isValid);
  
  if (!isValid) {
    console.log('\n? Password doesn\'t match. Let\'s create a new hash...');
    
    // Create a new hash
    const salt = await bcrypt.genSalt(10);
    const newHash = await bcrypt.hash(testPassword, salt);
    console.log('New hash:', newHash);
    
    // Update the admin
    admin.password = newHash;
    fs.writeFileSync('data/admins.json', JSON.stringify([admin], null, 2));
    console.log('\n? Admin password updated!');
    console.log('Username: admin');
    console.log('Password: Admin123456');
  } else {
    console.log('\n? Password is correct!');
  }
}

debugPassword();
