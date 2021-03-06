const express = require('express')

const app = express()
const PORT = process.env.PORT || 3001

const morgan = require('morgan')
const cors = require('cors')

const { closer, getPopular, getNearby, getNew } = require('./controller.js')

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms'))

///  ROUTES
// home
app.get('/', (req, res) => res.send('<h1>Welcome homepage</h1>'))

//discovery with queries
app.get('/api/discovery', (req, res) => {
  let discovery = {
    sections: [],
  }
  //customer's location

  console.log(req.query.lat)
  console.log(req.query.lon)
  if (req.query.lon && req.query.lat) {
    const customerLocation = [req.query.lon, req.query.lat]
    //get all close restaurants (within 1.5km)
    const closerRestaurants = closer(customerLocation)

    // populate discovery && don't return empty section
    if (getPopular(closerRestaurants).restaurants.length !== 0) {
      discovery.sections.push(getPopular(closerRestaurants))
    }
    if (getNew(closerRestaurants).restaurants.length !== 0) {
      discovery.sections.push(getNew(closerRestaurants))
    }
    if (
      getNearby(closerRestaurants, customerLocation).restaurants.length !== 0
    ) {
      discovery.sections.push(getNearby(closerRestaurants, customerLocation))
    }
    res.json(discovery)
  } else {
    return res.status(400).json({
      error:
        'Bad Request : include lat and lon in the request ie  ?lat=60.167692&lon=24.964',
    })
  }
})

// LISTEN
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
