const express = require('express')
const movieRouter = require('./routes/movies')
const port = 9000

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/movies", movieRouter)

app.listen(port, () => console.log(`Server started on port ${port}`))