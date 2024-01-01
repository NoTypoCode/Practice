(() => {
    const theForm = document.getElementById('theForm');
    const cardDropdown = document.getElementById('CardSelector');
    const dealerDropdown = document.getElementById('Dealer');
    const pdfButton = document.getElementById('pdfButton');
    const amount = document.getElementById('amount');
    const customer = document.getElementById('name')


    //options for the dropdown
    const creditcards = ['Amex', 'Visa', 'MasterCard', 'Discover'];
    const dealerships = ['Jeep', 'Lexus', 'Mercedes', 'Toyota', 'Honda', 'Hyundai', 'Mazda'];

    //get the date for the pdf later on
    const today = new Date().toLocaleDateString('en-US', { month: "long", day: "numeric", year: "numeric" }).replace(',', '');

    //use the functions to populate the dropdown menus
    addOptions(cardDropdown, creditcards);
    addOptions(dealerDropdown, dealerships);


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

    //hitting the submit button will generate a PDF with the selected details
    pdfButton.addEventListener('click', async (e) => {
        e.preventDefault();

        //using the backend of the app 
        await fetch('/send-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                customer: document.getElementById('name').value,
                amount: amount.value,
                cc_type: data.selectedCreditCard,
                dealership: data.selectedDealership
            })
        });

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
        newPDF.text(`We have used the ${data.selectedCreditCard} to pay ${data.selectedDealership} $${amount.value} for ${customer.value}'s car`, 10, 70);

        newPDF.output('dataurlnewwindow');

        //newPDF.save(`${document.getElementById('name')} ${today}.pdf`);

        
        //reset the pdf to be empty for the next customer input
        newPDF = new jsPDF();

        //reset the form to blank so that can start over
        customer.value = '';
        amount.value = '';
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



})();