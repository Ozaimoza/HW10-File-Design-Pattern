const express = require ('express')
const routers = require ('./routes')
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const PORT = 3000;
const app = express();



app.set("view engine", "ejs")
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.urlencoded( {extended : false} ))

app.use(routers)

app.listen(PORT, ()=>{
    console.log(`APPS started at ${PORT}`);
});