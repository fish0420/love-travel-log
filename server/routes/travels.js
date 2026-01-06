// 檔案: /server/routes/travels.js
const express = require('express');
const { getTravelEntries, addTravelEntry, deleteTravelEntry, updateTravelEntry } = require('../controllers/travels');

const router = express.Router();

// 路由：
// GET /api/v1/travels/:location - 取得特定地點紀錄
router.route('/:location').get(getTravelEntries);

// POST /api/v1/travels - 新增紀錄 (管理後台使用)
router.route('/').post(addTravelEntry); 

// 🎯 新增：針對單一 ID 的操作 (更新, 刪除)
// PUT /api/v1/travels/:id - 更新紀錄
// DELETE /api/v1/travels/:id - 刪除紀錄
router.route('/:id')
    .put(updateTravelEntry)
    .delete(deleteTravelEntry); 

module.exports = router;