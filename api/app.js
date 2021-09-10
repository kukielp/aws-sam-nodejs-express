const express = require('express')
const app = express()
const router = express.Router()
const bodyParser = require('body-parser')
const cors = require('cors')
const path = require('path')

let FruitBox = [];

//Static content ie images
app.use('/static', express.static('static'))

router.use(cors())
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

router.get('/', function(req, res) {
    res.render('index', { fruitBox: FruitBox })
})

router.get('/index', function(req, res) {
    res.render('index', { fruitBox: FruitBox })
})

router.get("/ping", async (req, res) => {
    const result = { incomming : 'ping ', resonse : 'pong '}
    res.send(JSON.stringify(result))
});

router.get("/fruitbox", async (req, res) => {
    res.send(JSON.stringify(FruitBox))
});

router.get("/fruitbox/:item", async (req, res) => {
    const item = parseInt(req.params.item)
    res.send(JSON.stringify(FruitBox[item]))
});

router.post('/fruitbox', async (req, res) => {
    let result
    try{
        const fruitName = req.body.fruitName;
        const qty = req.body.qty;
        const item = { fruit: fruitName, qty : qty}
        FruitBox.push(item)
        result = FruitBox
        res.status(200)
    }catch(e){
        console.log(e)
        result = { errorMessage : 'Ensure your POST body conatains both a fruitName and a qty and content type is application/json '}
        res.status(500);
    }

    res.send(result)

})

app.use('/', router)

module.exports = app;