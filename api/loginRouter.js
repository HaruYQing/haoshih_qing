const express = require('express');
const session = require('express-session');
const loginRouter = express.Router()
const bcrypt = require('bcrypt');
const path = require('path');
const secretGenerator = require('../public/secretGenerator.js');
const multer = require('multer');
const fs = require('fs');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cors = require('cors');
var config = require("./databaseConfig.js")
var conn = config.connection

// change: 
// 1. body-parser -> express
// 2. db -> conn
// 3. /login -> /
// 4. 首頁 / -> /home 

// unchange
// 1. passport的路徑
// 2. google登入的路徑
// 3. secretGenerator檔案上傳到專案並改引用路徑

// loginRouter.set('view engine', 'ejs');
// loginRouter.set('views', path.join(__dirname, 'views'));

loginRouter.use(express.urlencoded({ extended: true }));
loginRouter.use(express.json());

// --------測試路由用----------
// http://localhost:3200/login
loginRouter.get('/', function (req, res) { res.send('OK') })

// http://localhost:3200/login/test
loginRouter.get('/test', function (req, res) {
    const conn = req.app.get('connection')
    conn.query("SELECT * FROM member WHERE uid = 1", function (err, result) { res.json(result) })
})
// --------測試路由用----------



// 設置 session
let secret;
const secretFile = 'session_secret.txt';
secret = secretGenerator.readSecretFromFile(secretFile);
if (!secret) {
    secret = secretGenerator.generateSecret();
    secretGenerator.saveSecretToFile(secret, secretFile);
}

loginRouter.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}));

const uploadDir = path.join(__dirname, 'uploads');

// 確保上傳目錄存在
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}


// 設置 multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir)
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/png" || file.mimetype === "image/jpeg") {
        cb(null, true);
    } else {
        cb(new Error("只接受 PNG 和 JPG 格式的圖片"), false);
    }
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter
})

const uploadFields = upload.fields([
    { name: 'logo_img', maxCount: 1 },
    { name: 'brand_img01', maxCount: 1 },
    { name: 'brand_img02', maxCount: 1 },
    { name: 'brand_img03', maxCount: 1 },
    { name: 'brand_img04', maxCount: 1 },
    { name: 'brand_img05', maxCount: 1 }
]);

// // 首頁
loginRouter.get('/home', (req, res) => {
    if (req.session.loggedin) {
        res.render('index', {
            userName: req.session.userName,
            userType: req.session.userType
        });
    } else {
        res.render('index', {
            userName: null,
            userType: null
        });
    }
});

// 登入頁面
loginRouter.get('/', (req, res) => {
    res.render('login', { error: null });
});

// 註冊頁面
loginRouter.get('/register', (req, res) => {
    res.render('register', { error: null });
});

// 註冊
loginRouter.post('/register/:userType', uploadFields
    , (req, res) => {
        // console.log('收到註冊請求:', req.body);
        const { userType } = req.params;
        try {
            const {
                user_type, first_name, last_name, nickname, tw_id, account,
                phone, email, address, password, doubleCheck,
                brand_name, brand_type, content, fb, ig, web // 攤販特有
            } = req.body;

            // 詳細驗證
            let errors = [];

            // 通用驗證
            if (!account || !/^[a-zA-Z0-9]{8,12}$/.test(account)) {
                errors.push('帳號需要 8-12 個英數字');
            }

            if (!password || !/^[a-zA-Z0-9!@#$%^&*()]{8,12}$/.test(password)) {
                errors.push('密碼需要 8-12 個字符');
            }

            if (password !== doubleCheck) {
                errors.push('密碼和確認密碼不相同');
            }

            if (!first_name || !/^[\u4e00-\u9fa5]+$/.test(first_name)) {
                errors.push('名字只能填寫中文');
            }

            if (!last_name || !/^[\u4e00-\u9fa5]+$/.test(last_name)) {
                errors.push('姓氏只能填寫中文');
            }

            if (!nickname || !/^[\u4e00-\u9fa5]{1,8}$/.test(nickname)) {
                errors.push('暱稱中文8個字內');
            }

            if (!tw_id || !/^[A-Z](1|2)\d{8}$/.test(tw_id)) {
                errors.push('請輸入有效的台灣身分證字號');
            }

            if (!phone || !/^09\d{8}$/.test(phone)) {
                errors.push('請輸入有效的手機號碼');
            }

            if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                errors.push('請輸入有效的電子信箱地址');
            }

            if (!address) {
                errors.push('地址為必填項目');
            }

            // 攤販特定驗證
            if (user_type === 'vendor') {
                if (!brand_name) {
                    errors.push('品牌名稱為必填項目');
                }
                if (!brand_type) {
                    errors.push('品牌類型為必填項目');
                }
                if (errors.length > 0) {
                    // console.log('驗證錯誤:', errors);
                    return res.status(400).json({ success: false, error: errors });
                }

            }


            // 檢查帳號是否已存在
            const checkAccountQuery = `
        SELECT 'member' as type FROM member WHERE account = ? OR email = ?
        UNION ALL
        SELECT 'vendor' as type FROM vendor WHERE account = ? OR email = ?`;
            conn.query(checkAccountQuery, [account, email, account, email], (err, results) => {
                if (err) {
                    console.error('檢查帳號時發生錯誤:', err);
                    return res.status(500).json({ success: false, error: '數據庫錯誤，請稍後再試' });
                }
                if (results.length > 0) {
                    return res.status(400).json({ success: false, error: '此帳號或電子郵件已存在' });
                }

                // 密碼加密
                bcrypt.hash(password, 10, (err, hash) => {
                    if (err) {
                        console.error('密碼加密錯誤:', err);
                        return res.status(500).json({ success: false, error: '密碼加密錯誤，請稍後再試' });
                    }

                    if (userType === 'vendor') {
                        handleVendorRegistration(req, res, hash);
                    } else {
                        handleMemberRegistration(req, res, hash);
                    }
                });
            });
        } catch (error) {
            console.error('註冊過程中發生錯誤:', error);
            res.status(500).json({ success: false, error: '伺服器錯誤，請稍後再試' });
        }
    });

// 處理攤販註冊
function handleVendorRegistration(req, res, hash) {
    const {
        account, first_name, last_name, phone, address, email, tw_id,
        brand_name, brand_type, content, fb, ig, web
    } = req.body;

    const logo_img = req.files['logo_img'] ? req.files['logo_img'][0].path : '';
    const brand_imgs = ['brand_img01', 'brand_img02', 'brand_img03', 'brand_img04', 'brand_img05'].map(field =>
        req.files[field] ? req.files[field][0].path : ''
    );

    const insertVendorInfoQuery = `
    INSERT INTO vendor_info 
    (brand_name, brand_type, logo_img, brand_img01, brand_img02, brand_img03, brand_img04, brand_img05, content, fb, ig, web) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    conn.query(insertVendorInfoQuery, [
        brand_name, brand_type, logo_img, ...brand_imgs,
        content || '', fb || '', ig || '', web || ''
    ], (err, infoResult) => {
        if (err) {
            console.error('攤販資訊註冊錯誤:', err);
            return res.status(500).json({ success: false, error: '攤販註冊錯誤，請稍後再試' });
        }

        const vinfoId = infoResult.insertId;

        const insertVendor = 'INSERT INTO vendor (account, password, first_name, last_name, phone, address, email, tw_id, vinfo) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        conn.query(insertVendor, [account, hash, first_name, last_name, phone, address, email, tw_id, vinfoId], (err, vendorResult) => {
            if (err) {
                console.error('攤販註冊錯誤:', err);
                conn.query('DELETE FROM vendor_info WHERE vinfo = ?', [vinfoId], (deleteErr) => {
                    if (deleteErr) console.error('刪除失敗的 vendor_info 記錄時出錯:', deleteErr);
                });
                return res.status(500).json({ success: false, error: '攤販註冊錯誤，請稍後再試' });
            }

            // console.log('攤販註冊成功:', account);
            res.json({ success: true, message: '註冊成功' });
        });
    });
}

// 處理會員註冊
function handleMemberRegistration(req, res, hash) {
    const { account, first_name, last_name, nickname, phone, address, email, tw_id } = req.body;

    const insertMemberQuery = 'INSERT INTO member (account, password, first_name, last_name, nickname, phone, address, email, tw_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    conn.query(insertMemberQuery, [account, hash, first_name, last_name, nickname || '', phone, address, email, tw_id], (err, result) => {
        if (err) {
            console.error('會員註冊錯誤:', err);
            return res.status(500).json({ success: false, error: '會員註冊錯誤，請稍後再試' });
        }
        // console.log('會員註冊成功:', account);
        res.json({ success: true, message: '註冊成功' });
    });
}


// 登入
loginRouter.post('/', (req, res) => {
    const { account, password, userType } = req.body;
    // console.log(`收到 ${userType} 類型的登入請求，帳號：`, account);

    const table = userType === 'member' ? 'member' : 'vendor';
    const query = `SELECT * FROM ${table} WHERE account = ? OR email = ?`;

    conn.query(query, [account, account], (err, results) => {
        if (err) {
            console.error(`查詢 ${table} 表時發生數據庫錯誤:`, err);
            return res.status(500).json({ error: '伺服器錯誤' });
        }

        if (results.length > 0) {
            bcrypt.compare(password, results[0].password, (err, isMatch) => {
                if (err) {
                    console.error('比較密碼時發生錯誤:', err);
                    return res.status(500).json({ error: '內部伺服器錯誤' });
                }
                if (isMatch) {
                    req.session.loggedin = true;
                    req.session.userName = results[0].account;
                    req.session.userType = userType;
                    console.log(`${userType} 登入成功:`, results[0].account);
                    return res.json({
                        success: true,
                        userType: userType,
                        userName: results[0].account,
                        uid: results[0].uid,
                        email: results[0].email,
                        firstName: results[0].first_name,
                        lastName: results[0].last_name,
                        phone: results[0].phone,
                        vendorName: userType === 'vendor' ? results[0].brand_name : null,
                        vid: userType === 'vendor' ? results[0].vid : null,
                    });
                } else {
                    // console.log(`${userType} 密碼錯誤:`, account);
                    return res.status(401).json({ success: false, error: '帳號或密碼錯誤' });
                }
            });
        } else {
            // console.log('找不到帳號:', account);
            return res.status(401).json({ success: false, error: '帳號或密碼錯誤' });
        }
    });
});



// 登出
loginRouter.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('登出時發生錯誤:', err);
            return res.status(500).json({ success: false, message: '登出失敗' });
        }
        res.json({ success: true, message: '登出成功' });
    });
});

loginRouter.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // Multer 錯誤
        console.error('Multer error:', err);
        return res.status(400).json({ success: false, error: `上傳錯誤: ${err.message}` });
    } else if (err) {
        // 其他錯誤
        console.error('Server error:', err);
        return res.status(500).json({ success: false, error: '伺服器錯誤' });
    }
    next();
});

//localstorage
//會員uid抓取
loginRouter.get('/:uid', function (req, res) {
    conn.query(
        "SELECT uid, nickname FROM member WHERE uid = ?",
        [req.params.uid],
        function (err, result) {
            // console.log(result);
            res.json(result[0]);
        }
    )
})

//攤販vid抓取
loginRouter.get('/vendor/:vid', function (req, res) {
    conn.query(
        `SELECT vendor.vid, vendor_info.brand_name FROM vendor JOIN vendor_info ON vendor.vinfo = vendor_info.vinfo WHERE vid = ?`,
        [req.params.vid],
        function (err, result) {
            // console.log(result);
            res.json(result[0]);
        }
    )
})


// // 設置 Passport(google)
// const clientID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
// const clientSecret = process.env.REACT_APP_GOOGLE_CLIENT_SECRET;
// const callbackURL = process.env.REACT_APP_GOOGLE_CALLBACK_URL;
// passport.use(new GoogleStrategy({
//     clientID: clientID,
//     clientSecret: clientSecret,
//     callbackURL: callbackURL,
//     prompt: 'select_account',
//     passReqToCallback: true
// },
//     function (req, accessToken, refreshToken, profile, cb) {
//         // 您需要檢查用戶是否已存在，如果不存在則創建新用戶
//         const { id, displayName, emails } = profile;
//         const email = emails && emails.length > 0 ? emails[0].value : null;
//         if (!email) {
//             return cb(new Error('google信箱失敗'));
//         }

//         const userType = req.session.googleAuthUserType || 'member';  // 默認為會員
//         const table = userType === 'member' ? 'member' : 'vendor';

//         // 使用 email 查找或建立用戶
//         conn.query(`SELECT * FROM ${table} WHERE email = ?`, [email], (err, results) => {
//             if (err) return cb(err);

//             if (results.length > 0) {
//                 const existingUser = results[0];
//                 if (existingUser.account.startsWith(userType)) {
//                     // 帳號通過，返回
//                     return cb(null, { ...existingUser, userType });
//                 } else {
//                     // 帳戶已申請為其他用戶，送出錯誤訊息
//                     return cb(null, { error: 'account_exists', message: '此帳號已申請為其他使用身分' });
//                 }
//             } else {
//                 // 創建新用戶
//                 const newUser = {
//                     account: email,
//                     email: email,
//                     first_name: profile.name && profile.name.givenName ? profile.name.givenName : '',
//                     last_name: profile.name && profile.name.familyName ? profile.name.familyName : '',
//                     // 其他欄位設置為空字串
//                 };

//                 conn.query(`INSERT INTO ${userType === 'member' ? 'member' : 'vendor'} SET ?`, newUser, (err, result) => {
//                     if (err) {
//                         if (err.code === 'ER_DUP_ENTRY') {
//                             return cb(null, { error: 'account_exists', message: '此帳號已申請為其他使用身分' });
//                         }
//                         return cb(err);
//                     }
//                     newUser.id = result.insertId;
//                     newUser.userType = userType;
//                     return cb(null, newUser);
//                 });
//             }
//         });
//     }));

// // 初始化 Passport
// loginRouter.use(passport.initialize());
// loginRouter.use(passport.session());

// // Google 登入路由
// loginRouter.get('/auth/google', (req, res, next) => {
//     req.session.googleAuthUserType = req.query.userType;
//     next();
// },
//     passport.authenticate('google', { scope: ['profile', 'email'] }));

// loginRouter.get('/auth/google/callback',
//     passport.authenticate('google', { failureRedirect: 'http://localhost:3000/login' }),
//     function (req, res) {
//         console.log('Google 回調觸發，用戶數據:', req.user)
//         if (!req.user) {
//             return res.redirect('http://localhost:3000/login?error=登入失敗');
//         }

//         if (req.user.error === 'account_exists') {
//             // 將錯誤消息儲存在 session 中
//             req.session.authError = req.user.message;
//             return res.redirect('http://localhost:3000/login?error=' + encodeURIComponent(req.user.message));
//         }

//         const userType = req.session.userType || 'member';  // 默認為會員
//         const userData = {
//             success: true,
//             userType: userType,
//             userName: req.user.account,
//             uid: req.user.id,
//             email: req.user.email,
//             firstName: req.user.first_name,
//             lastName: req.user.last_name
//         };


//         if (!email) {
//             return res.redirect('/');
//         }
//         // 根據用戶類型查詢相應的表
//         const table = userType === 'member' ? 'member' : 'vendor';

//         conn.query(`SELECT * FROM ${table} WHERE email = ?`, [email], (err, results) => {
//             if (err) {
//                 console.error('Database error:', err);
//                 return res.redirect('/');
//             }

//             if (results.length > 0) {
//                 // 用戶存在，直接登入
//                 req.session.loggedin = true;
//                 req.session.userName = results[0].account;
//                 req.session.userType = userType;
//                 res.redirect('/');
//             } else {
//                 // 用戶不存在，創建新用戶
//                 const newUser = {
//                     account: email,
//                     email: email,
//                     first_name: req.user.name && req.user.name.givenName ? req.user.name.givenName : '',
//                     last_name: req.user.name && req.user.name.familyName ? req.user.name.familyName : '',
//                     // 其他欄位設置為默認值
//                 };

//                 conn.query(`INSERT INTO ${table} SET ?`, newUser, (err, result) => {
//                     if (err) {
//                         console.error('Error creating new user:', err);
//                         return res.redirect('/');
//                     }

//                     req.session.loggedin = true;
//                     req.session.userName = newUser.account;
//                     req.session.userType = userType;
//                     res.redirect('/');
//                 });
//             }
//         });

//         // 將用戶數據作為 URL 參數傳遞
//         const userDataParam = encodeURIComponent(JSON.stringify(userData));
//         res.redirect(`http://localhost:3000/login?googleLoginData=${userDataParam}`);
//     }
// );



module.exports = loginRouter;