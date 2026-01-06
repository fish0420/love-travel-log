// 檔案: /server/controllers/travels.js
const TravelEntry = require('../models/TravelEntry'); // 引入資料模型

// @desc    取得所有或特定地點的旅遊紀錄
// @route   GET /api/v1/travels/:location
// @access  Public (由於是公開的旅遊紀錄，設定為公開)
exports.getTravelEntries = async (req, res, next) => {
    try {
        const { location } = req.params; // 從 URL 參數中取得地點 (e.g., '東京')
        
        let query = {};
        if (location && location !== 'all') { // 如果 URL 參數有地點，則加入查詢條件
            // Mongoose 查詢：查找 location 欄位符合參數值的紀錄
            query.location = location;
        }

        const travels = await TravelEntry.find(query).sort({ travelDate: -1 }); // 依日期降冪排序

        res.status(200).json({
            success: true,
            count: travels.length,
            data: travels
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ 
            success: false, 
            error: '無法取得旅遊紀錄數據' 
        });
    }
};

// @desc    【管理用】新增一筆旅遊紀錄
// @route   POST /api/v1/travels
// @access  Private (需登入/授權才能操作)
exports.addTravelEntry = async (req, res, next) => {
    try {
        const travel = await TravelEntry.create(req.body); // 接收前端送來的 JSON 資料並建立紀錄

        res.status(201).json({
            success: true,
            data: travel
        });

    } catch (err) {
        // 處理 Mongoose 驗證錯誤 (例如必填欄位沒填)
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({
                success: false,
                error: messages
            });
        } else {
            console.error(err);
            return res.status(500).json({
                success: false,
                error: '無法新增旅遊紀錄'
            });
        }
    }
};

// @desc    【管理用】刪除單筆旅遊紀錄
// @route   DELETE /api/v1/travels/:id
// @access  Private
exports.deleteTravelEntry = async (req, res, next) => {
    try {
        const travel = await TravelEntry.findById(req.params.id);

        if (!travel) {
            return res.status(404).json({ success: false, error: '找不到該紀錄' });
        }

        // 執行刪除
        await TravelEntry.deleteOne({ _id: req.params.id }); 

        res.status(200).json({ success: true, data: {} });

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: '無法刪除旅遊紀錄' });
    }
};

// @desc    【管理用】更新單筆旅遊紀錄
// @route   PUT /api/v1/travels/:id
// @access  Private
exports.updateTravelEntry = async (req, res, next) => {
    try {
        const travel = await TravelEntry.findByIdAndUpdate(req.params.id, req.body, {
            new: true, // 返回更新後的文檔
            runValidators: true // 確保更新時也執行驗證規則
        });

        if (!travel) {
            return res.status(404).json({ success: false, error: '找不到該紀錄' });
        }

        res.status(200).json({ success: true, data: travel });

    } catch (err) {
        // 處理驗證錯誤
        if (err.name === 'ValidationError') {
            const messages = Object.values(err.errors).map(val => val.message);
            return res.status(400).json({ success: false, error: messages });
        } else {
            console.error(err);
            return res.status(500).json({ success: false, error: '無法更新旅遊紀錄' });
        }
    }
};