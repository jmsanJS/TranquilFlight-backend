var express = require("express");
var router = express.Router();

//const User = require("../models/users");
const { checkBody } = require("../modules/checkBody");

const XRapidAPIKey = process.env.XRapidAPIKey;

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

            if (data[0].departure.revisedTime === undefined && data[0].arrival.revisedTime === undefined){
                res.json({ result: true, flightData: 
                    {
                        flightNumber:data[0].number,
                        date:req.params.date,
                        airline:data[0].airline.name,
                        status:data[0].status,
                        lastUpdateUTC:data[0].lastUpdatedUtc,
                        distance:data[0].greatCircleDistance.km,
                        departure:{iata:data[0].departure.airport.iata,
                                    city:data[0].departure.airport.municipalityName,
                                    terminal:data[0].departure.terminal,
                                    countryCode:data[0].departure.airport.countryCode,
                                    scheduledTimeUTC:data[0].departure.scheduledTime.utc,
                                    scheduledTimeLocal:data[0].departure.scheduledTime.local,
                                    revisedTimeUTC:'',
                                    revisedTimeLocal:''
                                },
                        arrival : {iata:data[0].arrival.airport.iata,
                            city:data[0].arrival.airport.municipalityName,
                            terminal:data[0].arrival.terminal,
                            countryCode:data[0].arrival.airport.countryCode,
                            scheduledTimeUTC:data[0].arrival.scheduledTime.utc,
                            scheduledTimeLocal:data[0].arrival.scheduledTime.local,
                            revisedTimeUTC:'',
                            revisedTimeLocal:''
                        },
                    } 
                });
            }else if (data[0].departure.revisedTime && data[0].arrival.revisedTime){
                res.json({ result: true, flightData: 
                    {
                        flightNumber:data[0].number,
                        date:req.params.date,
                        airline:data[0].airline.name,
                        status:data[0].status,
                        lastUpdateUTC:data[0].lastUpdatedUtc,
                        distance:data[0].greatCircleDistance.km,
                        departure:{iata:data[0].departure.airport.iata,
                                    city:data[0].departure.airport.municipalityName,
                                    terminal:data[0].departure.terminal,
                                    countryCode:data[0].departure.airport.countryCode,
                                    scheduledTimeUTC:data[0].departure.scheduledTime.utc,
                                    scheduledTimeLocal:data[0].departure.scheduledTime.local,
                                    revisedTimeUTC:data[0].departure.revisedTime.utc,
                                    revisedTimeLocal:data[0].departure.revisedTime.local
                                },
                        arrival : {iata:data[0].arrival.airport.iata,
                            city:data[0].arrival.airport.municipalityName,
                            terminal:data[0].arrival.terminal,
                            countryCode:data[0].arrival.airport.countryCode,
                            scheduledTimeUTC:data[0].arrival.scheduledTime.utc,
                            scheduledTimeLocal:data[0].arrival.scheduledTime.local,
                            revisedTimeUTC:data[0].arrival.revisedTime.utc,
                            revisedTimeLocal:data[0].arrival.revisedTime.local
                        },
                    } 
                });
            }else if (data[0].departure.revisedTime && data[0].arrival.revisedTime === undefined){
                res.json({ result: true, flightData: 
                    {
                        flightNumber:data[0].number,
                        date:req.params.date,
                        airline:data[0].airline.name,
                        status:data[0].status,
                        lastUpdateUTC:data[0].lastUpdatedUtc,
                        distance:data[0].greatCircleDistance.km,
                        departure:{iata:data[0].departure.airport.iata,
                                    city:data[0].departure.airport.municipalityName,
                                    terminal:data[0].departure.terminal,
                                    countryCode:data[0].departure.airport.countryCode,
                                    scheduledTimeUTC:data[0].departure.scheduledTime.utc,
                                    scheduledTimeLocal:data[0].departure.scheduledTime.local,
                                    revisedTimeUTC:data[0].departure.revisedTime.utc,
                                    revisedTimeLocal:data[0].departure.revisedTime.local
                                },
                        arrival : {iata:data[0].arrival.airport.iata,
                            city:data[0].arrival.airport.municipalityName,
                            terminal:data[0].arrival.terminal,
                            countryCode:data[0].arrival.airport.countryCode,
                            scheduledTimeUTC:data[0].arrival.scheduledTime.utc,
                            scheduledTimeLocal:data[0].arrival.scheduledTime.local,
                            revisedTimeUTC:'',
                            revisedTimeLocal:''
                        },
                    } 
                });
            }else if (data[0].departure.revisedTime === undefined && data[0].arrival.revisedTime){
                res.json({ result: true, flightData: 
                    {
                        flightNumber:data[0].number,
                        date:req.params.date,
                        airline:data[0].airline.name,
                        status:data[0].status,
                        lastUpdateUTC:data[0].lastUpdatedUtc,
                        distance:data[0].greatCircleDistance.km,
                        departure:{iata:data[0].departure.airport.iata,
                                    city:data[0].departure.airport.municipalityName,
                                    terminal:data[0].departure.terminal,
                                    countryCode:data[0].departure.airport.countryCode,
                                    scheduledTimeUTC:data[0].departure.scheduledTime.utc,
                                    scheduledTimeLocal:data[0].departure.scheduledTime.local,
                                    revisedTimeUTC:'',
                                    revisedTimeLocal:''
                                },
                        arrival : {iata:data[0].arrival.airport.iata,
                            city:data[0].arrival.airport.municipalityName,
                            terminal:data[0].arrival.terminal,
                            countryCode:data[0].arrival.airport.countryCode,
                            scheduledTimeUTC:data[0].arrival.scheduledTime.utc,
                            scheduledTimeLocal:data[0].arrival.scheduledTime.local,
                            revisedTimeUTC:data[0].arrival.revisedTime.utc,
                            revisedTimeLocal:data[0].arrival.revisedTime.local
                        },
                    } 
                });
            }else{
                res.json({ result: false, error: "Une erreur s'est produite, veuillez réessayer plus tard" });
            }
        }else if (!data){
            res.json({ result: false, error: 'Vol introuvable' });
        }
    });
});

module.exports = router;
