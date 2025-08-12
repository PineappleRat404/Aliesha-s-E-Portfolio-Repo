# Setup and Installation Instructions: 

To get the application up and running, you will need Git and Docker installed on your machine.

1. Clone the repository - skip this step if you have direct access to the files:

```bash
git clone https://gitea.usq.edu.au/U1086555/CSC3480_A1_U1086555.git
```

2. Navigate into the project root directory: 

### `cd CSC3480_A1_U1086555/sportspro`


3. Initial Database Setup (IMPORTANT - First-time setup only) - ENSURE DOCKER DESKTOP IS OPEN:
When you start the Dockerized PostgreSQL service for the first time, it will create an empty database. To populate it with the provided sample data, follow these steps:

    a. From the sportspro/ directory:


### `docker-compose up -d postgres`

    b. Import the provided data into the Dockerized database:
    The sportprodb_backup.sql file, containing the database schema and initial data, should be located in this sportspro/ directory. From the sportspro/ directory:

### `cat sportprodb_backup.sql | docker exec -i sportspro_db psql -U postgres -d sportprodb`

You will be prompted for the password for the Dockerized postgres user (which is postgres).

4. Build and Start the entire application stack using Docker Compose:

From the sportspro/ directory, run:

### `docker-compose up -d --build`

This command will build the backend and nginx (which includes the React frontend build) Docker images, and start all three services (backend, nginx, postgres) in detached mode. 

# Project Structure
```
sportspro/
├── server/src
│   ├── controllers/
│   │   ├── administratorController.js
│   │   ├── controllerMain.js
│   │   ├── countryController.js
│   │   ├── customerController.js
│   │   ├── incidentController.js
│   │   ├── loginController.js
│   │   ├── productController.js
│   │   ├── registrationController.js
│   │   ├── technicianController.js
│   ├── models/
│   │   ├── Administrator.js
│   │   ├── Country.js
│   │   ├── Customer.js
│   │   ├── Incident.js
│   │   ├── index.js
│   │   ├── Product.js
│   │   ├── Registration.js
│   │   ├── Technician.js
│   │   ├── User.js
│   ├── routes/
│   │   ├── administratorRoutes.js
│   │   ├── countryRoutes.js
│   │   ├── customerRoutes.js
│   │   ├── incidentRoutes.js
│   │   ├── loginRoutes.js
│   │   ├── productRoutes.js
│   │   ├── registrationRoutes.js
│   │   ├── technicianRoutes.js
│   ├── middleware/
│   │   ├── auth.js
│   ├── util/
│   │   ├── database.js
│   ├── migration.js
│   ├── package-lock.json
│   ├── package.json
│   ├── .env
│   ├── app.js
│   ├── constant.js
├── nginx
│   │   ├── default.config
│   │   ├── dockerfile
├── client/myapp
│   ├── public/
│   │   ├── index.html
│   │   ├── favicon.ico
│   │   ├── logo192.png
│   │   ├── logo512.png
│   │   ├── manifest.json
│   ├── src/
│   │   │   ├── App.js
│   │   │   ├── App.css
│   │   │   ├── App.test.js
│   │   │   ├── reportWebVitals.js
│   │   │   ├── setupTests.js
│   │   │   ├── assign_incident.js
│   │   │   ├── create_incident.js
│   │   │   ├── customers.js
│   │   │   ├── DB_Schema.txt
│   │   │   ├── display_incidents.js
│   │   │   ├── home.js
│   │   │   ├── index.js
│   │   │   ├── logo.svg
│   │   │   ├── products.js
│   │   │   ├── register_product.js
│   │   │   ├── technicians.js
│   │   │   ├── update_incident.js
│   ├── package.json
│   ├── package-lock.json
│   ├── Dockerfile
│   ├── .gitignore
│   ├── README.md
├── docker-compose.yml
├── .gitignore
```

# Access Swagger UI at
```
http://localhost:3001/api-docs/
```

# Assumptions
The following assumptions have been made: 
- User already has necessary software installed prior to running the program (Node JS, git ( if necessary), npm, VSCode (or other text editor), Docker). 
- User has some background knowledge of what functions the project should perform. 


# Instructions for running and testing the application
Once you have completed the "Setup and Installation" steps and all Docker containers are running (check with docker-compose ps), follow the instructions below to access and test the application.

1. Access the Frontend Application:

Open your web browser and navigate to: 

```
http://localhost:8080/
```

2. Login:
Use your administrator, technician, or customer credentials to log in. Test Credentials have been provided below for each user role: 

Administrator:
- super_user_jane@sportspro.com
- secure_pass_2

Technician:
- aliesha.s@sportspro.com
- password123

Customer:
- elena.p@example.com
- customerpass3

3. Application Pages:
The application is broken into the following pages:

    LOGIN: The login page allows the user to login and see a role-based dashboard that is customised to display only the options that user role has access to. 

    MANAGE PRODUCTS: The main screen displays a list of all products in the database. To add a new product, scroll to the bottom of the page and input the requested information. Click Add Product when done. You will see the new product displayed at the bottom of the product list. To delete a product, click on the delete button next to that product.

    MANAGE TECHNICIANS: The main screen displays a list of all technicians in the database. To add a new technician, scroll to the bottom of the page and input the requested information. Click Add Technician when done. You will see the new technician displayed at the bottom of the technician list. To delete a technician, click on the delete button next to that technician.

    MANAGE CUSTOMERS: The main screen displays a search box that you can use to search for a customer by last name. Input entered here can include partial or full surnames. When input has been entered, click search and results will show in the Results section of the screen. To edit a customer's information, search for that customer, and click View/Edit. Amend their information as necessary and click Update Customer.

    CREATE INCIDENT: The main screen allows the user to select a customer and product from the database. Once these have been selected, input a title and description of the incident and click Create Incident. You should receive a success message to confirm that a new incident has been created.

    ASSIGN INCIDENT: The main screen displays a list of any incidents that haven't yet been assigned to a technician. To allocate, click Select next to an incident, select a technician from the dropdown box and click Assign Incident.

    DISPLAY INCIDENT: The main page provides a range of options that you can use to filter incident results. To do this, select filters as necessary from the drop-down menus and click Apply Filters.

    UPDATE INCIDENT: The main page provides a drop-down that you can use to search for incidents that have been assigned to a specific technician. To do this, select a technician from the dropdown and click Get Incidents. Locate the incident to update and click Select. Update the incident information as required, or check Close this incident and click Update Incident. You should receive a success message to confirm this has been completed.

    REGISTER PRODUCT: The customer can select a product from the dropdown and click Register Product.


