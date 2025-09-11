// Stripe payment processing functionality
(function() {
    // Stripe configuration
    const STRIPE_PUBLISHABLE_KEY = 'pk_live_51RhBvJFEabsYMr13oYmInfUEf77gmvioUxMbpcW1N5kZfm8cfgd43gfw3qGPFO20q66T4uP5UY4kgo2wqy7rXimj002dWJtPzd'; // Stripe live publishable key
    
    // Server API endpoints
    const API_URL = 'http://localhost:3000';
    
    // Initialize Stripe
    let stripe;
    let elements;
    let card;
    let form;
    
    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        initializeStripe();
        
        // Set up event listeners for the donation form
        form = document.getElementById('donation-form');
        if (form) {
            form.addEventListener('submit', handleDonationSubmit);
        }
    });
    
    // Initialize Stripe and create card elements
    function initializeStripe() {
        stripe = Stripe(STRIPE_PUBLISHABLE_KEY);
        elements = stripe.elements();
        
        // Create and mount the card element
        const style = {
            base: {
                color: '#32325d',
                fontFamily: '"Open Sans", sans-serif',
                fontSmoothing: 'antialiased',
                fontSize: '16px',
                '::placeholder': {
                    color: '#aab7c4'
                }
            },
            invalid: {
                color: '#dc3545',
                iconColor: '#dc3545'
            }
        };
        
        card = elements.create('card', { style: style });
        
        // Mount the card element to the DOM
        const cardElement = document.getElementById('card-element');
        if (cardElement) {
            card.mount('#card-element');
            
            // Handle real-time validation errors from the card element
            card.on('change', function(event) {
                const displayError = document.getElementById('card-errors');
                if (event.error) {
                    displayError.textContent = event.error.message;
                } else {
                    displayError.textContent = '';
                }
            });
        }
    }
    
    // Handle donation form submission
    async function handleDonationSubmit(event) {
        event.preventDefault();
        
        const submitButton = form.querySelector('button[type="submit"]');
        const paymentMessage = document.getElementById('payment-message');
        
        // Disable the submit button to prevent multiple submissions
        submitButton.disabled = true;
        submitButton.textContent = 'Processing...';
        
        // Get donation amount
        let donationAmount;
        if (form.amount.value === 'other') {
            donationAmount = form['custom-amount'].value;
        } else {
            donationAmount = form.amount.value;
        }
        
        // Validate the donation amount
        if (!donationAmount || isNaN(donationAmount) || donationAmount <= 0) {
            showError('Please enter a valid donation amount.');
            return;
        }
        
        try {
            // Get donor information for metadata
            const metadata = {
                name: form.name.value,
                email: form.email.value,
                frequency: form.frequency.value
            };
            
            // Create a payment intent via the server
            const response = await fetch(`${API_URL}/create-payment-intent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    amount: donationAmount,
                    currency: 'usd',
                    description: `${metadata.frequency} donation from ${metadata.name}`,
                    metadata
                })
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create payment intent');
            }
            
            const { clientSecret } = await response.json();
            
            // Confirm the payment with the card element
            const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: card,
                    billing_details: {
                        name: metadata.name,
                        email: metadata.email
                    }
                }
            });
            
            if (error) {
                // Show error message
                showError(error.message);
            } else if (paymentIntent.status === 'succeeded') {
                // Show success message
                paymentMessage.textContent = 'Payment successful! Thank you for your donation.';
                paymentMessage.style.color = '#28a745';
                paymentMessage.style.display = 'block';
                
                // Reset form
                form.reset();
                card.clear();
                
                // Hide the other amount field if it was displayed
                document.getElementById('other-amount').style.display = 'none';
                
                // Send email notification using EmailJS
                sendDonationConfirmationEmail(donationAmount, paymentIntent.id);
            }
        } catch (error) {
            showError(error.message || 'An unexpected error occurred. Please try again later.');
            console.error('Payment error:', error);
        } finally {
            // Re-enable the submit button
            submitButton.disabled = false;
            submitButton.textContent = 'Complete Donation';
        }
    }
    
    // Send donation confirmation email
    function sendDonationConfirmationEmail(amount, paymentId) {
        // Get form values
        const name = form.name.value;
        const email = form.email.value;
        const frequency = form.frequency.value;
        
        // Get EmailJS configuration from email-handler.js
        // In a real implementation, you would structure this better
        // This is a simplified approach for demo purposes
        const templateParams = {
            name: name,
            email: email,
            amount: '$' + amount,
            frequency: frequency,
            to_email: "letsmakeadifference4u@gmail.com",
            payment_id: paymentId || 'PAYMENT-' + Math.random().toString(36).substring(2, 10).toUpperCase()
        };
        
        // Send the email using EmailJS
        // Note: This assumes emailjs is already initialized in email-handler.js
        emailjs.send(window.SERVICE_ID || 'YOUR_SERVICE_ID', window.DONATION_TEMPLATE_ID || 'donation_form', templateParams)
            .then(function() {
                console.log('Donation confirmation email sent successfully');
            }, function(error) {
                console.error('Failed to send donation confirmation email:', error);
            });
    }
    
    // Show error message
    function showError(message) {
        const errorElement = document.getElementById('card-errors');
        errorElement.textContent = message;
        
        const submitButton = form.querySelector('button[type="submit"]');
        submitButton.disabled = false;
        submitButton.textContent = 'Complete Donation';
    }
})();
