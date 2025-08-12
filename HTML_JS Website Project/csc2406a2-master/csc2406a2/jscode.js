$(document).ready(function () {

    //Initially hides vehicle container
    $('#vehicles-container').hide();
    //Toggles visibility of vehicles container for e-vehicles question
    $('input[name="e-vehicles"]').on('change', function () {
        $('#vehicles-container').toggle($('#vehicles-yes').is(':checked'));
    });

    //Initially hides additional questions for phone and email contact
    $('#phone-followup, #email-followup').hide();
    //Exposes relevant hidden question based on user input
    $('input[name="contact"]').on('change', function () {
        $('#phone-followup, #email-followup').hide();
        if ($('#contact-phone').is(':checked')) {
            $('#phone-followup').show();
        }
        else if ($('#contact-email').is(':checked')) {
            $('#email-followup').show();
        }
    });

    //Stores reference to people container for dynamic content
    const peopleContainer = document.getElementById('people-container'); 

    //  Language questions - shows hidden question if Yes is selected by user
    $(peopleContainer).on('change', 'input[name^="language"]', function () {
        const index = $(this).attr('id').split('-').pop();  
        $('#other-language-container-' + index).toggle($('#language-yes-' + index).is(':checked'));
    });

    //  Disability questions - shows hidden question if yes is selected by user
    $(peopleContainer).on('change', 'input[name^="disability"]', function () {
        const index = $(this).attr('id').split('-').pop();
        $('#disability-container-' + index).toggle($('#disability-yes-' + index).is(':checked'));
    });

    // Help questions - shows hidden questions if yes is selected by user
    $(peopleContainer).on('change', 'input[name^="help"]', function () {
        const index = $(this).attr('id').split('-').pop();
        $('#help-container-' + index).toggle($('#help-yes-' + index).is(':checked'));
    });

    //  Country of Birth questions - hides / shows arrival year question based on country selection by user
    $(peopleContainer).on('change', 'select[name^="country"]', function () {
        const index = $(this).attr('id').split('-').pop();
        const arrivalYearContainer = $('#arrival-container-' + index);  
        if ($(this).val() === 'Australia') {
            arrivalYearContainer.hide();
        } else {
            arrivalYearContainer.show();
        }
        //If user selects Australia, this question remains hidden. For all other choices, this question is exposed
    });

    });

//Script runs after document is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    const peopleNoInput = document.getElementById('peopleNo');
    const personTemplate = document.getElementById('person-template');
    const peopleContainer = document.getElementById('people-container');
    const peopleSection = document.getElementById('peopleSection');

    //Funtion to validate address details
    function validateAddress() {
        if ($('#streetNo').val() === '' || $('#street').val() === '' || $('#suburb').val() === '' || $('#state').val() === '' || $('#postcode').val() === '') {
            displayAddressError('All address fields are required.');
            return false;
        } else {
            clearAddressError();
            return true;
        }
    }
    
    //Displays address error message
    function displayAddressError(message) {
        $('#address-error').text(message).show();  
        $('#address-error').removeClass('error-message');
        $('#address-error').addClass('error-message');
    }
    
    //Clears address error message
    function clearAddressError() {
        $('#address-error').text('').hide(); 
    }

    // Function to validate dwelling details - NOTE: Time Constraints prevented completion of full validation coding **NOT FUNCTIONAL FOR THIS OR FOLLOWING SECTIONS**
    function validateDwelling() {
    if ($('#type').val() === '' || $('#status').val() === '' || $('#energy').val() === '' || $('#internet').val() === '' || $('#usage').val() === '' || $('#bedroomNumber').val() === '') {
        displayDwellingError('All dwelling fields are required.');
        return false;
    } else {
        clearDwellingError();
        return true;
    }
}

//NOTE: Time Constraints prevented completion of full validation coding **NOT FUNCTIONAL FOR THIS OR FOLLOWING SECTIONS**
function displayDwellingError(message) {
    $('#dwelling-error').text(message).show();
    $('#dwelling-error').removeClass('error-message');
    $('#dwelling-error').addClass('error-message');
}

//NOTE: Time Constraints prevented completion of full validation coding **NOT FUNCTIONAL FOR THIS OR FOLLOWING SECTIONS**
function clearDwellingError() {
    $('#dwelling-error').text('').hide();
}

    //Event listener controlling number of people input
    peopleNoInput.addEventListener('change', function () {
        //converts input to integer
        const numberOfPeople = parseInt(this.value);
        peopleContainer.innerHTML = '';

        //Checks if input is a number greater than 0
        if (!isNaN(numberOfPeople) && numberOfPeople > 0) {
            //Loop that dynamically creates sections for each person
            for (let i = 1; i <= numberOfPeople; i++) {
                //Clones content of Person form section
                const clone = personTemplate.content.cloneNode(true);

                const elementsToUpdate = clone.querySelectorAll('*');
                elementsToUpdate.forEach(element => {
                    //Replaces index placeholder in HTML ID with current person number
                    if (element.id) {
                        element.id = element.id.replace(/\$\{index\}/g, i);
                    }
                    //Replaces placeholder to match updated input ID
                    if (element.getAttribute('for')) {
                        element.setAttribute('for', element.getAttribute('for').replace(/\$\{index\}/g, i));
                    }
                    //Uniquely identifies form fields
                    if (element.name && element.name.includes('${index}')) {
                        element.name = element.name.replace('${index}', i);
                    }
                    //Updates text showing the current person's number
                    if (element.classList.contains('people-number')) {
                        element.textContent = ' ' + i;
                    }
                });
                //Appends updated clone to the people container
                peopleContainer.appendChild(clone);
            }
            //Shows main person section, starting only with Person 1
            showMainSection(peopleSection);
            showPersonSection(0);
        }
    });

    //Event listener controlling number of animals input
    const animalNoInput = document.getElementById('animalNo');
    const animalTemplate = document.getElementById('animal-template');
    const animalContainer = document.getElementById('animal-container');
    const maxAnimals = 50; //Maximum number of animals allowed
    if (animalNoInput) {
        //Listener is triggered if number of animal types is changed
        animalNoInput.addEventListener('change', function () {
            const numberOfAnimals = parseInt(this.value);
            animalContainer.innerHTML = '';

            //Value needs to be valid number greater than 0
            if (!isNaN(numberOfAnimals) && numberOfAnimals > 0) {

                //Loops creates new animal sub-section for entered number of animal types
                for (let i = 1; i <= numberOfAnimals; i++) {
                    const templateContent = animalTemplate.content.cloneNode(true);
                    const elementsToUpdate = templateContent.querySelectorAll('*');
                    elementsToUpdate.forEach(element => {
                        //Replaces index placeholder in ID with current animal number
                        if (element.id) {
                            element.id = element.id.replace(/\$\{index\}/g, i);
                        }
                        //Replaces index placeholder in 'for' attributes - labels
                        if (element.getAttribute('for')) {
                            element.setAttribute('for', element.getAttribute('for').replace(/\$\{index\}/g, i));
                        }
                        //Uniquely identifies each animals input fields
                        if (element.name && element.name.includes('${index}')) {
                            element.name = element.name.replace('${index}', i);
                        }
                        //Updates text to reflect current animal type number
                        if (element.classList.contains('animal-number')) {
                            element.textContent = ' ' + i;
                        }
                    });
                    //Appends populates animal section to animal container
                    animalContainer.appendChild(templateContent);
                }
            }
        });
    }

    //Help button which toggles visibility of help section pop-ups
    document.querySelectorAll('.help-button').forEach(button => {
        button.addEventListener('click', function () {
            //Gets value of 'data-help-id', pointing to corresponding help ID's
            const helpId = this.getAttribute('data-help-id');
            //Uses ID to find related help element in DOM
            const helpPopup = document.getElementById(helpId);
    
            if (helpPopup) {
                //Makes sure only one pop-up is visible at a time
                document.querySelectorAll('.help-popup').forEach(popup => {
                    if (popup !== helpPopup) popup.style.display = 'none';
                });
                //Toggles visibility of selected pop-up
                helpPopup.style.display = helpPopup.style.display === 'block' ? 'none' : 'block';
            }
        });
    });

    const addressSection = document.getElementById('addressSection');
    const dwellingSection = document.getElementById('dwellingSection');
    const animalSection = document.querySelector('.animalSection');
    const surveySection = document.querySelector('.censusSection');
    const nextToPeopleBtn = document.getElementById('nextToPeople');
    const prevToAddressBtn = document.getElementById('prevToAddress');
    const nextDwellingBtn = document.getElementById('nextDwelling');
    const previousToPeopleBtn = document.getElementById('previousToPeople');
    const nextToAnimalBtn = document.getElementById('nextToAnimal');
    const prevToAnimalsBtn = document.getElementById('prevToAnimals');
    const nextToSurveyBtn = document.getElementById('nexttoSurvey');
    const prevToSurveyBtn = document.getElementById('prevToSurvey');
    const prevPersonBtn = document.getElementById('prevPersonBtn');
    const nextPersonBtn = document.getElementById('nextPersonBtn');

    let currentSection = addressSection;
    let currentPersonIndex = 0;

    const progressBar = document.getElementById('progressBar');
    const totalSections = 5;  

    //Functions to assist with navigating through each form section

    //Hides all main sections of form
    function hideAllMainSections() {
        addressSection.style.display = 'none';
        peopleSection.style.display = 'none';
        dwellingSection.style.display = 'none';
        animalSection.style.display = 'none';
        surveySection.style.display = 'none';
    }

    //Displays each section and updates progress bar
    function showMainSection(section) {
        hideAllMainSections();
        section.style.display = 'block'; //shows selected section
        currentSection = section;
        updateProgressBar();  //updates progress bar
    }

    //Shows specific person form
    function showPersonSection(index) {
        const personSections = peopleContainer.querySelectorAll('.person-section');
        //Shows section that matches index - other sections not displayed
        personSections.forEach((section, i) => {
            section.style.display = i === index ? 'block' : 'none';
        });
        currentPersonIndex = index; //updates index

        //Shows / hides relationship container, dependent on which person is filling out the form (certain question/s not visible to person 1)
        const relationshipContainers = peopleContainer.querySelectorAll('.relationship-container');
        const relationshipLabels = peopleContainer.querySelectorAll('label[for^="relationship-"]'); // Select labels that start with "relationship-"
        relationshipContainers.forEach((container, i) => {
            container.style.display = index === 0 ? 'none' : 'block';
    });
    relationshipLabels.forEach((label, i) => {
        label.style.display = index === 0 ? 'none' : 'block';
    });

        //Navigation buttons
        if (prevPersonBtn) prevPersonBtn.style.display = index > 0 ? 'inline-block' : 'none';
        if (nextPersonBtn) nextPersonBtn.style.display = index < personSections.length - 1 ? 'inline-block' : 'none';
        if (nextDwellingBtn) nextDwellingBtn.style.display = index === personSections.length - 1 ? 'inline-block' : 'none';
    }

    //Navigation from Address section to People Section
    if (nextToPeopleBtn) {
        nextToPeopleBtn.addEventListener('click', () => {
            if (validateAddress()) {
                showMainSection(peopleSection);
                const personSections = peopleContainer.querySelectorAll('.person-section');
                if (personSections.length > 0) {
                    showPersonSection(0);
                }
            }
        });
    }
    
    //Navigation from Dwelling section to Animal Section
    if (nextToAnimalBtn) {
        nextToAnimalBtn.addEventListener('click', () => {
            if (validateDwelling()) {  //NON-FUNCTIONAL AT SUBMISSION
                showMainSection(animalSection);
                const animalSections = animalContainer.querySelectorAll('.animal-section');
                if (animalSections.length > 0) {
                    showAnimalSection(0);
                }
            }
        });
    }

    //Navigation buttons to move between sections
    if (prevToAddressBtn) prevToAddressBtn.addEventListener('click', () => showMainSection(addressSection));
    if (nextDwellingBtn) nextDwellingBtn.addEventListener('click', () => showMainSection(dwellingSection));
    if (previousToPeopleBtn) previousToPeopleBtn.addEventListener('click', () => showMainSection(peopleSection));
    if (nextToAnimalBtn) nextToAnimalBtn.addEventListener('click', () => showMainSection(animalSection));
    if (prevToAnimalsBtn) prevToAnimalsBtn.addEventListener('click', () => showMainSection(dwellingSection));
    if (nextToSurveyBtn) nextToSurveyBtn.addEventListener('click', () => showMainSection(surveySection));
    if (prevToSurveyBtn) prevToSurveyBtn.addEventListener('click', () => showMainSection(animalSection));
    if (prevPersonBtn) {
        prevPersonBtn.addEventListener('click', () => {
            if (currentPersonIndex > 0) {
                showPersonSection(currentPersonIndex - 1);
            }
        });
    }

    //Navigation buttons to move between people
    if (nextPersonBtn) {
        nextPersonBtn.addEventListener('click', () => {
            const personSections = peopleContainer.querySelectorAll('.person-section');
            if (currentPersonIndex < personSections.length - 1) {
                showPersonSection(currentPersonIndex + 1);
            }
        });
    }

    //Updates progress bar dependent on current progress through form
    function updateProgressBar() {
        let sectionNumber = 1;
        if (currentSection === addressSection) sectionNumber = 1;
        else if (currentSection === peopleSection) sectionNumber = 2;
        else if (currentSection === dwellingSection) sectionNumber = 3;
        else if (currentSection === animalSection) sectionNumber = 4;
        else if (currentSection === surveySection) sectionNumber = 5;

        const progress = ((sectionNumber - 1) / totalSections) * 100;
        progressBar.style.width = progress + '%';
        progressBar.innerHTML = Math.round(progress) + '%';
    }

    //Hides all sections initially, showing only address section first
    hideAllMainSections();
    showMainSection(addressSection);
    updateProgressBar();
});
