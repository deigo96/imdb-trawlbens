const express = require('express')
const movieRouter = require('./routes/movies')
const port = 9000
const app = express()

// swagger
const swagger = require('swagger-ui-express')
const apiDocumentation = require('./apidocs.json')
app.use('/api-docs', swagger.serve, swagger.setup(apiDocumentation))

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api/movies", movieRouter)

app.listen(port, () => console.log(`Server started on port ${port}`))