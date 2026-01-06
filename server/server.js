const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const MONGO_URI = 'mongodb+srv://emileort2_db_user:416011c8763@cluster0.y1jwgb7.mongodb.net/?appName=Cluster0';

// 應用程式實例
const app = express();

// 資料庫連線函數
const connectDB = async () => {
    try {
        const conn = await mongoose.connect(MONGO_URI, {
           
            serverSelectionTimeoutMS: 50000, // 新增：設定伺服器選擇超時時間為 50 秒
            family:4,
        });
        console.log(`✅ MongoDB 已連線: ${conn.connection.host}`);
    } catch (err) {
        console.error(`❌ 資料庫連線錯誤: ${err.message}`);
        console.error('請檢查您的 MONGO_URI 和 MongoDB Atlas 的網路存取 (IP 白名單)。');
        process.exit(1);
    }
};

// 執行連線
connectDB();

// 允許 Express 接收 JSON 格式的請求內容
app.use(express.json());

// CORS 
// 允許所有來源 (例如 localhost:5500) 存取您的 API
app.use(cors());

// 引入路由
const travelRoutes = require('./routes/travels');
app.use('/api/v1/travels', travelRoutes); // 定義 API 基礎路徑

// 測試路由
app.get('/', (req, res) => {
    res.send('愛情旅遊記 後端 API 服務運行中...');
});

// 定義伺服器 Port 號
const PORT = 5000;

// 啟動伺服器
const server = app.listen(
    PORT,
    console.log(`伺服器運行在 Development 模式，Port: ${PORT}`)
);