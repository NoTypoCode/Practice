(() => {
    const theForm = document.getElementById('theForm');
    const authpage = document.getElementById('authpage');
    const cardDropdown = document.getElementById('CardSelector');
    const dealerDropdown = document.getElementById('Dealer');
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    const login = document.getElementById('login');
    const pdfButton = document.getElementById('pdfButton');
    const amount = document.getElementById('amount');
    const customer = document.getElementById('name');
    const cardnumber = document.getElementById('cardnumber');
    const address = document.getElementById('address');
    const state = document.getElementById('state');
    const city = document.getElementById('city');
    const zip = document.getElementById('zip');
    const exp = document.getElementById('exp');
    const cvv = document.getElementById('cvv');

    theForm.style.display = 'none';
    //options for the dropdown
    const creditcards = ['Amex', 'Visa', 'MasterCard', 'Discover'];
    const dealerships = ['Jeep', 'Lexus', 'Mercedes', 'Toyota', 'Honda', 'Hyundai', 'Mazda'];
    const allstates = ["NY", "NJ", "", "-- ", "AK", "AL", "AR", "AS", "AZ", "CA", "CO", "CT", "DC", "DE", "FL", "GA", "GU", "HI", "IA", "ID", "IL", "IN", "KS", "KY", "LA", "MA", "MD", "ME", "MI", "MN", "MO", "MS", "MT", "NC", "ND", "NE", "NH", "NM", "NV", "OH", "OK", "OR", "PA", "PR", "RI", "SC", "SD", "TN", "TX", "UT", "VA", "VI", "VT", "WA", "WI", "WV", "WY"];

    //get the date for the pdf later on
    const today = new Date().toLocaleDateString('en-US', { month: "long", day: "numeric", year: "numeric" }).replace(',', '');

    //use the functions to populate the dropdown menus
    addOptions(cardDropdown, creditcards);
    addOptions(dealerDropdown, dealerships);
    addOptions(state, allstates);
    cardnumber.addEventListener('input', e => {
        setCardType(cardnumber.value);
    });


    //variables for the selected option 
    let data = {
        selectedCreditCard: undefined,
        selectedDealership: undefined
    };

    //setting the variable (using the function) to the selection from the dropdown menu
    dropdownSelection(cardDropdown, data, 'selectedCreditCard');
    dropdownSelection(dealerDropdown, data, 'selectedDealership');


    //using the jsPDF library  
    let newPDF = new jsPDF();

    //block unwanted users- cheap way out
    login.addEventListener('click', e => {
        e.preventDefault();

        if (username.value === 'admin' && password.value === 'jmauto') {
            theForm.style.display = 'flex';
            pdfButton.disabled = false;
            authpage.remove();

        } else { alert('Enter username and password'); }
    });

    //hitting the submit button will generate a PDF with the selected details
    pdfButton.addEventListener('click', async (e) => {
        e.preventDefault();


        //this would be the async/await to use the backend of the app
        const backdata = {
            name: customer.value,
            dealer: data.selectedDealership,
            creditCard: data.selectedCreditCard,
            amount: parseFloat(amount.value),
        };

        try {
            const response = await fetch('/leaser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(backdata),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const responseData = await response.json();
            console.log('Data successfully posted:', responseData);
            // Handle any further actions after successful post
        } catch (error) {
            console.error('There was a problem with the fetch operation:', error);
        };

        console.log(`We have used the ${data.selectedCreditCard} to pay ${data.selectedDealership} $${amount.value} for ${customer.value}`);

        //get the logo for the top of the pdf
        const img = new Image();
        img.src = 'images/image001.png';

        const companyname = 'JM Auto Group LLC';

        //I should prob make vars for x and y axis placements...

        newPDF.addImage(img, 'png', 20, 20, 100, 30);
        newPDF.setFontType("bold").text(`${companyname}`, 165, 30, 'center')
        newPDF.setFontType('normal').setFontSize(12).text(`\n109 Ave M\nBrooklyn, NY 11230\n\nPh: 718 - 627 - 7100\nFx: 718 - 627 - 8855`, 165, 30, 'center');

        //I should write the text in the middle of the page 
        newPDF.setFontType("bold").text(`CREDIT CARD AUTHORIZATION FORM`, 100, 85, 'center');

        newPDF.setFontType("normal").text(`Date: ${today}`, 20, 100);
        newPDF.text(`DEALER: ${data.selectedDealership}`, 20, 105);
        newPDF.text(`CUSTOMER NAME: ${customer.value}`, 20, 115)
        newPDF.setFontType("normal").text(`Please charge $${amount.value} on ${data.selectedCreditCard} ${cardnumber.value}   Expiration ${exp.value} CVV:${cvv.value} to pay ${data.selectedDealership} for ${customer.value}'s car ajaksjan;KJD;Laksjd`, 30, 125, { maxWidth: 165 });
        newPDF.text(`Billing address: ${address.value} ${city.value}, ${state.value} ${zip.value}`, 30, 140)

        newPDF.output('dataurlnewwindow');

        //newPDF.save(`${document.getElementById('name')} ${today}.pdf`);


        //reset the pdf to be empty for the next customer input
        newPDF = new jsPDF();

        //reset the form to blank so that can start over
        theForm.reset();


    })




    //where I put all the reusable functions

    //get all the options from arrays into the dropdown menus
    function addOptions(menu, thearray) {
        thearray.forEach(element => {
            menu.append(new Option(element))
        })
    }

    //set the variable to the selected option from the dropdown menu
    function dropdownSelection(dropdown, targetObject, key) {
        dropdown.addEventListener('change', e => {
            targetObject[key] = e.target.value;
        });
    }


    function setCardType(cardnumber) {

        switch (cardnumber.substring(0, 1)) {
            case '3':
                cardDropdown.value = 'Amex';
                break;
            case '4':
                cardDropdown.value = 'Visa';
                break;
            case '5':
                cardDropdown.value = 'MasterCard';
                break;
            case '6':
                cardDropdown.value = 'Discover';
                break;
            default:
                cardDropdown.value = '';
                break;
        }
    }

})();