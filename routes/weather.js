var express = require("express");
var router = express.Router();

//const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");

const WEATHER_API_KEY = process.env.WEATHER_API_KEY;


// const weatherDataResponse = await fetch(`http://localhost:3000/weather/${city}`)

// if (!weatherDataResponse.ok) {
//     throw new Error(`HTTP error! Status: ${response.status}`);
// }

// const weatherData = await weatherDataResponse.json();



router.get("/:city", async (req, res) => {

    const getCityIdResponse = await fetch(`https://www.meteosource.com/api/v1/free/find_places?text=${req.params.city}`, {
    method: 'GET',
    headers: { 
        'X-API-Key': WEATHER_API_KEY},
    })
    if (!getCityIdResponse.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const cityData = await getCityIdResponse.json();

    if(cityData.length>0){
        const getWeatherDataResponse = await fetch(`https://www.meteosource.com/api/v1/free/point?place_id=${cityData[0].place_id}&sections=daily&timezone=auto`, {
            method: 'GET',
            headers: { 
                'X-API-Key': WEATHER_API_KEY},
        })

        if (!getWeatherDataResponse.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const weatherData = await getWeatherDataResponse.json();

        if(weatherData.daily.data){
            res.json({result:true, weatherData:weatherData})
        }else{
            res.json({result:false, error:'impossible de récupérer les données météo'})
        }

    }else{
        res.json({result:false, error:`Ville inconnue : ${req.params.city}`})
    }
    
});

module.exports = router;
