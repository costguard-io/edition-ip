// Stripe settings
let stripeKey = (window.location.hostname.includes('localhost') || window.location.hostname.includes('.test'))
    ? 'pk_test_51QTQWQBf6hlTgk0U9vP2iDqx8vqR5AHEzs6WR1neGObUIrAu3hvvbVJKdQBfWP81alIAC0RIiC7hkAant0gjNuMx00VrjdiokU'
    : 'pk_live_51QTQWQBf6hlTgk0UCQblUE2hmMIUSoWG6eeZq7WiM2Futy4WrGA2GfVZkT9qRcUFvf4be56x4ZiAwU4Dpj1ruYx900bI6llX2h';

let stripe = Stripe(stripeKey);
const stripeCard = stripe.elements().create('card', {
    style: {
        base: {
            color: '#333333',
            fontWeight: '400',
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSize: '16px',
            '::placeholder': {
                color: '#333333',
            },
        },
        invalid: {
            color: '#dc3545',
            iconColor: '#dc3545',
        },
    }
    , hidePostalCode: true
});

const activateStripeElements = function (selector) {

    try {
        //console.log('Activating Sripe Card Element');
        stripeCard.mount(selector);
    } catch (e) {
        console.log(e);
        return;
    }

// Handle real-time validation errors
    stripeCard.on('change', function (event) {
        const displayError = document.getElementById('card-errors');
        const cardElementDiv = document.getElementById('card-element');

        if (event.error) {
            displayError.textContent = event.error.message;
        } else {
            displayError.textContent = '';
        }

        // Add or remove 'not-empty' class based on card input
        if (event.complete || event.value) {
            cardElementDiv.classList.add('not-empty');
        } else {
            cardElementDiv.classList.remove('not-empty');
        }
    });

// Handle focus events on the card element
    stripeCard.on('focus', function () {
        const cardElementDiv = document.getElementById('card-element');
        cardElementDiv.classList.add('StripeElement--focus');
    });

    stripeCard.on('blur', function () {
        const cardElementDiv = document.getElementById('card-element');
        cardElementDiv.classList.remove('StripeElement--focus');
    });

// Submit form when button is clicked

}

const stripeSubmitFunction = async function () {
    try {
        const result = await stripe.createToken(stripeCard);

        if (result.error) {
            // Inform the user if there was an error
            const errorElement = document.getElementById('card-errors');
            errorElement.textContent = result.error.message;
            return null; // Return null to indicate failure
        } else {
            // Return the token id
            return result.token.id;
        }
    } catch (err) {
        console.error(err);
        return null; // Return null to indicate failure
    }
};
