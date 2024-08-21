exports.queryAsync = function (conn, sql, values) {
  return new Promise((resolve, reject) => {
    conn.query(sql, values, (err, result) => {
      if (err) {
        console.error("SQL Error: ", err);
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

// 引用密碼雜湊加密模組
const bcrypt = require("bcrypt");
// 密碼雜湊加密函式
exports.hashPW = async function (originalPW) {
  const saltRounds = 10;
  try {
    const hash = await bcrypt.hash(originalPW, saltRounds);
    return hash;
  } catch (error) {
    console.error("Error hashing password:", error);
    throw error;
  }
};
// 雜湊密碼驗證函式
exports.verifyPW = async function (originalPW, hashedPW) {
  try {
    const isMatch = await bcrypt.compare(originalPW, hashedPW);
    return isMatch;
  } catch (error) {
    console.error("Error verifying password:", error);
  }
};

// 資料庫更新函式 ==> 攤主會員資料
exports.updateVendorProfile = async function (conn, vid, profileData) {
  return new Promise((resolve, reject) => {
    const keys = Object.keys(profileData);
    // 如果都沒填寫，就不執行動作
    if (keys.length === 0) {
      resolve();
      return;
    }
    // 依照有填寫的欄位動態生成 SQL語法
    let sql = `UPDATE vendor SET ${keys
      .map((key) => `${key} = ?`)
      .join(",")} WHERE vid = ?`;
    let params = [...Object.values(profileData), vid];
    // 更新資料庫
    conn.query(sql, params, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

// 資料庫更新函式 ==> 交易設定
exports.updateVendorPayment = async function (conn, vid, bankInfo) {
  return new Promise((resolve, reject) => {
    const keys = Object.keys(bankInfo);
    // 如果都沒填寫，就不執行動作
    if (keys.length === 0) {
      resolve();
      return;
    }
    // 依照有填寫的欄位動態生成 SQL語法
    let sql = `UPDATE vendor SET ${keys
      .map((key) => `${key} = ?`)
      .join(",")} WHERE vid = ?`;
    let params = [...Object.values(bankInfo), vid];
    // 更新資料庫
    conn.query(sql, params, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

// 資料庫更新函式 ==> 攤位資訊
exports.updateStallProfile = async function (conn, vinfo, stallData) {
  return new Promise((resolve, reject) => {
    const keys = Object.keys(stallData);
    // 如果都沒填寫，就不執行動作
    if (keys.length === 0) {
      resolve({ message: "No fields to update" });
      return;
    }
    // 依照有填寫的欄位動態生成 SQL語法
    let sql = `UPDATE vendor_info SET ${keys
      .map((key) => `${key} = ?`)
      .join(",")} WHERE vinfo = ?`;
    let params = [...Object.values(stallData), vinfo];
    // 更新資料庫
    conn.query(sql, params, (err, result) => {
      if (err) {
        console.error("Error in updateStallProfile:", err);
        reject(err);
      } else {
        resolve({
          message: "Stall Profile updated successfully",
          affectedRows: result.affectedRows,
          changedRows: result.changedRows,
        });
      }
    });
  });
};
