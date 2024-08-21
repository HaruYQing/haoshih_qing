const bcrypt = require('bcrypt');
const mysql = require('mysql');
var config = require("../api/databaseConfig.js")
var conn = config.connection

// 要更新的用戶資訊
const users = [
  { type: 'member', account: 'abc123123', password: '12345678', email: '123@gmail.com' },
  { type: 'member', account: 'cbacba123', password: '11223344', email: 'cba@gmail.com' },
  { type: 'member', account: 'aaabbbccc', password: 'aaa123123', email: 'aaa@gmail.com' },
  { type: 'vendor', account: 'petpet123', password: 'petpet123', email: 'pet@gmail.com' },
  { type: 'vendor', account: 'cake1234', password: 'cake1234', email: 'cake@gmail.com' }
];

// 連接到資料庫
conn.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');

  // 更新所有用戶的密碼
  updatePasswords(users);
});

function updatePasswords(users) {
  if (users.length === 0) {
    console.log('All passwords updated');
    conn.end();
    return;
  }

  const user = users.shift(); // 取出並移除第一個用戶

  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      console.error(`Error hashing password for ${user.account}:`, err);
      updatePasswords(users); // 繼續處理下一個用戶
      return;
    }

    const table = user.type === 'member' ? 'member' : 'vendor';
    const updateQuery = `UPDATE ${table} SET password = ? WHERE account = ? AND email = ?`;
    
    conn.query(updateQuery, [hash, user.account, user.email], (err, result) => {
      if (err) {
        console.error(`Error updating password for ${user.account}:`, err);
      } else if (result.affectedRows === 0) {
        console.log(`No matching user found for ${user.account}`);
      } else {
        console.log(`Password updated successfully for ${user.account}`);
      }

      // 繼續處理下一個用戶
      updatePasswords(users);
    });
  });
}