var express = require("express");
var router = express.Router();

//const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");

const XRapidAPIKey = process.env.XRapidAPIKey;


//Route du front pour contacter le back
// fetch('http://localhost:3000/flights', {
//     method:'GET',
//     headers: { 'Content-Type': 'application/json' },
// 	body: JSON.stringify({ flightNumber: flightNumber, date: formatedDate }),
// }).then(response => response.json())
// .then(data => {
//     if (data.result) {

//     }else if (data.result===false){

//     }
// });

router.get("/:flightNumber/:date", (req, res) => {

    if (req.params.flightNumber === 'null' && req.params.date === 'null') {
        res.json({
        result: false,
        error: "Tous les champs doivent être renseignés",
        });
        return;
    }

    fetch(`https://aerodatabox.p.rapidapi.com/flights/number/${req.params.flightNumber}/${req.params.date}`, {
        method: 'GET',
        headers: { 
            'X-RapidAPI-Key': XRapidAPIKey,
            'X-RapidAPI-Host': 'aerodatabox.p.rapidapi.com' },
    }).then(response => response.json())
    .then(data => {
        if (data) {
            console.log('test', data)
            res.json({ result: true, flightData: data });
        }else if (!data){
            res.json({ result: false, error: 'Vol introuvable' });
        }
    });
});

module.exports = router;
