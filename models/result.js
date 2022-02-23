var mongoose = require('mongoose');

var ResultSchema = new mongoose.Schema(
    {
        number : Number,
        name : String,
        last : Number,
        buy : Number,
        Sell : Number,
        volume : Number,
        base_unit : String,
        quote_unit : String,
    }
)

module.exports = mongoose.model("Result", ResultSchema);