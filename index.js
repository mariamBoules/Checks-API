const app = require('./app')
const port = process.env.PORT


app.listen(3000, ()=>{
    console.log('Server is up and running on port', port)
})