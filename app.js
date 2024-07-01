const axios = require("axios");
const express = require("express");
const requestIp = require("request-ip");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

const port = process.env.PORT || 3000;

app.use(requestIp.mw());

const getWeather = async (city) => {
  const API_KEY = process.env.API_KEY;
  console.log(API_KEY);
  try {
    const response = await axios(
      `https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}&aqi=no`
    );
    return response.data;
  } catch (error) {
    
    console.log("Something went wrong", error);
  }
};

app.get("/api/hello", async (req, res) => {
  const clientIp = req.clientIp;
  const visitorName = req.query.visitor_name || "Guest"

  try {
    var resp = await axios.get(`http://ip-api.com/json/${clientIp}`);

    const city = resp.data.city;


    const getWeatherData = await getWeather(resp.data.city);

    if (getWeatherData) {
      const temperatureInCelsius = getWeatherData.current.temp_c;
      const greeting = `Hello, ${visitorName}!, the temperature is ${temperatureInCelsius} degrees Celsius in ${city}`;

      res.json({
        client_ip: clientIp,
        location: city,
        greeting: greeting,
      });
    } else {
      throw new Error("Failed to fetch weather data");
    }
  } catch (error) {
    console.error("Something went wrong:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(port, () => {
  console.log(`server is running on port ${port}......`);
});
