const request = require("request");
const redis = require("redis");

const client = redis.createClient();

const movie = async (req, res, next) => {
  const title = req.query.title;
  if(!title) {
    res.status(400).send({
      status: 400,
      message: "Masukan judul film"
    })
    return
  }
  await client.connect();

  const dataTitle = await client.get(title);
  if (dataTitle) {
    res.status(200).json(JSON.parse(dataTitle));
    client.quit()
  } else {
    const options = {
      method: "GET",
      url: `https://online-movie-database.p.rapidapi.com/auto-complete?q=${title}`,
      qs: { q: title },
      headers: {
        "X-RapidAPI-Key": "a553b227a6msh537fce1b58b7c67p15d455jsn53ea9024e2c0",
        "X-RapidAPI-Host": "online-movie-database.p.rapidapi.com",
        useQueryString: true,
      },
    };

    request(options, async (error, response, body) => {
      if (error) {
        res.status(400);
        throw new Error("error");
      }

      try {
        const data = JSON.parse(body);

        if (data === null) {
          res.send({
            status: 200,
            message: "Judul film tidak ditemukan",
          });
          return;
        }
        client.setEx(title, 3600, body);
        client.quit();
        res.status(200).json(data.d);
      } catch (error) {
        res.send({
          status: 400,
          message: "Film tidak ditemukan",
        });
      }
    });
  }
  client.quit();
};

const detail = async (req, res) => {
  const id = req.query.id;
  if(!id){
    res.status(400).send({
      status: 400,
      message: "Masukan id film"
    })
    return
  }
  await client.connect();

  const dataRedis = await client.get(id);
  if (dataRedis) {
    res.json(JSON.parse(dataRedis));
    client.quit();
  } else {
    const options = {
      method: "GET",
      url: "https://online-movie-database.p.rapidapi.com/title/get-details",
      qs: { tconst: id },
      headers: {
        "X-RapidAPI-Key": "a553b227a6msh537fce1b58b7c67p15d455jsn53ea9024e2c0",
        "X-RapidAPI-Host": "online-movie-database.p.rapidapi.com",
        useQueryString: true,
      },
    };

    request(options, (error, response, body) => {
      if (error) {
        res.status(400);
        throw new Error(error);
      }

      try {
        const detail = JSON.parse(body);

        if (detail === null) {
          res.send({
            status: 200,
            message: "movie tidak ditemukan",
          });
          return;
        }
        client.setEx(id, 3600, body);
        client.quit();
        res.status(200).json(detail);
      } catch (error) {
        res.send({
          status: 400,
          message: "Film tidak ditemukan",
        });
      }
    });
  }

};

module.exports = { movie, detail };
