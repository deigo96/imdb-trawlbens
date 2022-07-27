const request = require("request");

const movie = (req, res) => {
  const title = req.query.title;

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

  request(options, (error, response, body) => {
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
      res.status(200).json(data.d);
    } catch (error) {
      res.send({
        status: 400,
        message: "Film tidak ditemukan",
      });
    }
  });
};

const detail = async (req, res) => {
  const id = req.query.id;

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
      res.status(200).json(detail);
    } catch (error) {
      res.send({
        status: 400,
        message: "Film tidak ditemukan",
      });
    }
  });
};

module.exports = { movie, detail };
