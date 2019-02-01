# DIETactics
## Contents
    * Description
    * Features
    * Technologies
    * Challenges and Solutions
    * MVP
    * Stretch Goals
    * Authors

## Description
This project is a Node/Express-based application that allows users to create diet plans based on their input (current weight, height, target weight, and activity level). Users can log into their profile and view/update the progress on their current diet.

### Features
* To be declared...

## Technologies
* HTML/CSS/JavaScript
* Node/Express
* MySQL
* Chart.js
* Nutritionix API

## Challenges and Solutions
* Table Structure
    * Initially we had decided upon having two tables to store information for single users: one for basic log-in information, and one for all of the statistics needed for the app. Upon further inspection, though, we realized that it would be more efficient and organized to consolidate all of that information into one single table. We then needed to reformat our initial queries to input registration information into the database and get said information for the profile creation process.

## MVP
* Create a Node/Express app that can track daily exercise and nutrition information
* Requirements:
    * User's login information is stored within a MySQL database
    * User's profile information is also stored within a MySQL database
    * Chart display for the user's progress towards their target weight
    * Separate pages depending on log-in status (i.e. logged in vs. not logged in)

## Stretch Goals
* Create section for administrative users (i.e. certified dieticians)
* Provide detailed reports on progress measuring from starting weight to target weight

## Authors
* Sean McQuaid
    * Contributions:
        * Project Management, Database Initialization
    * [GitHub Profile](https://github.com/seanmcquaid)
* Greg Roques
    * Contributions:
        * Wireframing, Responsive Design
    * [GitHub Profile](https://github.com/GregRoques)
* Michael Rubino
    * Contributions:
        * Concept, Wireframing, Responsive Design
    * [GitHub Profile](https://github.com/rubinoAM)