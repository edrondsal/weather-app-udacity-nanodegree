/*--------------------------------------------------------
Server code for Wheather Journal App. UDACITY Project - Front End Developper Nanodegree
version: 0.0.1
created on: 23/05/20
last modified: 23/05/20
Updates:
23/05/20    File Creation
23/05/20    Dependencies, and setup of Express, Body-Parser and CORS
23/05/20    GET and POST Routes
24/05/20    Add data to weathreProjectData
author: E. RONDON
----------------------------------------------------------*/

// Setup all dependencies
const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');

//initialize global data
let weatherProjectData = {};

// Start up an instance of app
const app = express();

//Configuration of express to use body-parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//Configuration of express to use  Cors for cross origin allowance
app.use(cors());

/* Initializing the main project folder */
app.use(express.static('website'));

const port = 8000;
const server = app.listen(port,listening);

/**
 * @description Function working as the callback of the listen function used to create the server
 * @since      0.0.1
 * @access     private
*/
function listening(){
    console.log(`server running in localhots:${port}`);
}

//Configuration of GET route
app.get('/weatherdata',getRouteCallback)

//Configuration of POST route
app.post('/weatherdata', postRouteCallback);

/**
 * @description Function working as the callback of the get route
 * @since   0.0.1
 * @access  private
 * @param   {Request}   request
 * @param   {Response}  response
 * @returns {Response}  response containing weather 
*/
function getRouteCallback(request, response) {
    response.send(weatherProjectData)
}

/**
 * @description Function working as the callback of the post route
 * @since   0.0.1
 * @access  private
 * @param   {Request}   request
 * @param   {Response}  response
 * @returns {Response}  response
*/
function postRouteCallback(request, response) {
    let object = request.body;
    weatherProjectData[object.key] = object.data;
    console.log(weatherProjectData);
    response.send(object);
}