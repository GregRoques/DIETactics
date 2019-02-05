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
* Calculates recommended daily caloric intake for maintaining weight and for losing 1 pound per week.
* Creates a chart for the user that shows their caloric intake during the past week (7 days).

## Technologies
* HTML/CSS/JavaScript
* Node/Express
* MySQL
* Chart.js
* Nutritionix API

## Challenges and Solutions
* Table Structure
    * Initially we had decided upon having two tables to store information for single users: one for basic log-in information, and one for all of the statistics needed for the app. Upon further inspection, though, we realized that it would be more efficient and organized to consolidate all of that information into one single table. We then needed to reformat our initial queries to input registration information into the database and get said information for the profile creation process.
* Using Queries to Populate Profile Update Form
    * For the user form to update a user's profile, we needed to populate said form with all of the current values for every editable record. The issue we came into was that some of the form inputs were select elements, meaning that there was no editable text involved with those inputs. To work with this type of structure, we included an if statement in Node for each individual option element that works with a ternary operator in order to add a value of "selected."

    ```
    <option id="male" value="male" <%= (data.sex=='male')?'selected':'' %>>Male</option>
    ...
    <option id="foot-0" value="0" <%= (data.heightFeet==0)?'selected':'' %>>0</option>
    ```

## MVP
* Create a Node/Express app that can track daily exercise and nutrition information
* Requirements:
    * User's login information is stored within a MySQL database
    * User's profile information is also stored within a MySQL database
    * Chart display for the user's progress towards their target weight
    * Separate pages depending on log-in status (i.e. logged in vs. not logged in)

## Stretch Goals
* Create section for administrative users (i.e. certified dieticians)
    * Status: Incomplete
* Provide detailed reports on progress measuring from starting weight to target weight
    * Status: Incomplete

## Authors
* Sean McQuaid
    * Contributions:
        * Project Management, Database Initialization & Maintenance, Password Encryption, Responsive Design, Router Management, Chart.js Implementation, Nutritionix API Implementation, Imperial to Metric Calculations 
    * [GitHub Profile](https://github.com/seanmcquaid)
* Greg Roques
    * Contributions:
        * Wireframing, Responsive Design, Local Sessions, Router Management, Password Encryption, Nutritionix API Implementation, Database Maintenance, Harris-Benedict Equation Implementation
    * [GitHub Profile](https://github.com/GregRoques)
* Michael Rubino
    * Contributions:
        * Concept, Wireframing, Front End Development, Responsive Design, Login/Logout Functionality, Edit Profile Form & Database Connection, RegEx Validation
    * [GitHub Profile](https://github.com/rubinoAM)