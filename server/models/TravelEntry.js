// 引入 Mongoose
const mongoose = require('mongoose');

// 定義 TravelEntry 的 Schema (資料模型結構)
const TravelEntrySchema = new mongoose.Schema({
    // 專題提案中指定的旅遊地點，如「東京」、「香港」等
    location: {
        type: String,
        required: [true, '旅遊地點是必填的'],
        enum: ['夏日東京', '大阪', '橫濱', '秋季東京']// 限制地點為提案中的四個
    },
    // 該筆紀錄的日期
    travelDate: {
        type: Date,
        required: [true, '旅遊日期是必填的']
    },
    // 該地點的旅遊前言或簡介
    preface: {
        type: String,
        trim: true,
        maxlength: [500, '前言內容不能超過 500 個字']
    },
    // 核心日記或活動內容列表
    contents: [
        {
            // 例如: '迪士尼飯店' 或 '車站的光影'
            title: {
                type: String,
                required: true,
                trim: true
            },
            // 具體日記內容或說明
            description: {
                type: String,
                required: true,
                trim: true
            },
            // 圖片/照片的 URL
            imageUrl: {
                type: String,
                default: 'default-image.jpg'
            },
            // 如果需要記錄小標題的時間 (例如: 07/01)
            contentDate: {
                type: String 
            }
        }
    ],
    // 追蹤紀錄建立時間
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    // 啟用虛擬屬性 (virtuals)，讓物件轉換成 JSON 時包含 getter
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true }
});

// 匯出模型，供 Express 應用程式使用
module.exports = mongoose.model('TravelEntry', TravelEntrySchema);