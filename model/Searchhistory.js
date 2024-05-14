const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/login-app-db');
const searchHistorySchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    query: String,
    timestamp: {
        type: Date,
        default: Date.now
    }
});

const SearchHistory = mongoose.model('SearchHistory', searchHistorySchema);

module.exports = SearchHistory;
