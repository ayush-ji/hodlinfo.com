var express = require('express')
const bodyParser = require('body-parser')
var mongoose = require('mongoose')
const axios = require('axios')
const path = require('path')

var app = express()

const PORT = 3000
const url = "https://api.wazirx.com/api/v2/tickers"

// Establish connection with MongoDB database Atlas using Mongoose
mongoose.connect('mongodb+srv://ayush:ayush123@clusterone.9nyzv.mongodb.net/HoldInfoDB', (err) => {
    console.log("ERROR : " + err)
})

//This will import Result Schema
//Mongoose always work with Schema 
//Schema provide the high-level interface to work with MongoDB
var Result = require(path.join(__dirname , './models' + '/result.js'))

//This vaiable will hold all the fetched data from API
var tickerData = []

// Data Update Function
function tickerDataUpdate() {
    Result.collection.drop();

    axios.get(url)
    .then(async res => {

        tickerData = [];
        var topTenResult = Object.keys(res.data).slice(0, 10)
        topTenResult.forEach((item) => tickerData.push(res.data[item]))
        
        var allDocuments = await Result.find({})

        tickerData.forEach(async (item, index) => {
    
            if ( allDocuments.length == 0 ) {
                var newRecord = new Result( 
                    {
                        number : index,
                        name : item.name,
                        last : item.last,
                        buy : item.buy,
                        Sell : item.sell,
                        volume : item.volume,
                        base_unit : item.base_unit,
                        quote_unit : item.quote_unit
                    }
                ).save((err) => {
                    if (err == null) {
                        console.log('Added!')
                    } else console.log("Error !")
                })
            }
        })        
    }).catch(error => {
        console.error(error + '  ' + 999)
      })
}

tickerDataUpdate();

//This will set express rules
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(bodyParser.urlencoded({extended : false}))

//Home page of website
app.get('/', async (req, res) => {
    await tickerDataUpdate()   
    res.render('index', {data : tickerData})
    console.log(tickerData.btcinr)
})

//Listen on Specified PORT
app.listen(PORT, () => {
    console.log('SERVER STARTED\nPORT : ' + PORT)
})