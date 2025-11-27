// Email handling functionality using EmailJS
(function() {
    // EmailJS configuration
    const PUBLIC_KEY = "YOUR_PUBLIC_KEY"; // You'll need to replace this with your actual EmailJS public key
    const SERVICE_ID = "YOUR_SERVICE_ID"; // Replace with your EmailJS service ID
    const CONTACT_TEMPLATE_ID = "contact_form"; // Replace with your contact form template ID
    const VOLUNTEER_TEMPLATE_ID = "volunteer_form"; // Replace with your volunteer form template ID
    const DONATION_TEMPLATE_ID = "donation_form"; // Replace with your donation form template ID
    
    // Make these variables accessible to other scripts
    window.PUBLIC_KEY = PUBLIC_KEY;
    window.SERVICE_ID = SERVICE_ID;
    window.DONATION_TEMPLATE_ID = DONATION_TEMPLATE_ID;
    
    // Initialize EmailJS
    function initEmailJS() {
        emailjs.init(PUBLIC_KEY);
    }
    
    // Handle contact form submission
    function handleContactFormSubmit(event) {
        event.preventDefault();
        
        const form = event.target;
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        
        // Change button text to indicate loading
        submitButton.textContent = "Sending...";
        submitButton.disabled = true;
        
        // Prepare template parameters
        const templateParams = {
            name: form.name.value,
            email: form.email.value,
            subject: form.subject.value,
            message: form.message.value,
            to_email: "letsmakeadifference4u@gmail.com"
        };
        
        // Send the email
        emailjs.send(SERVICE_ID, CONTACT_TEMPLATE_ID, templateParams)
            .then(function() {
                alert("Your message has been sent successfully!");
                form.reset();
            }, function(error) {
                console.error("Email sending failed:", error);
                alert("Sorry, there was an error sending your message. Please try again later.");
            })
            .finally(function() {
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            });
    }
    
    // Handle volunteer form submission
    function handleVolunteerFormSubmit(event) {
        event.preventDefault();
        
        const form = event.target;
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        
        // Change button text to indicate loading
        submitButton.textContent = "Sending...";
        submitButton.disabled = true;
        
        // Get selected interests
        const interestsInputs = form.querySelectorAll('input[name="interests"]:checked');
        const interests = Array.from(interestsInputs).map(input => input.value).join(", ");
        
        // Get selected availability
        const availabilityInputs = form.querySelectorAll('input[name="availability"]:checked');
        const availability = Array.from(availabilityInputs).map(input => input.value).join(", ");
        
        // Prepare template parameters
        const templateParams = {
            fullName: form.fullName.value,
            email: form.email.value,
            phone: form.phone.value,
            address: form.address.value,
            emergencyContact: form.emergencyContact.value,
            interests: interests,
            availability: availability,
            skills: form.skills.value,
            whyVolunteer: form.whyVolunteer.value,
            heardAbout: form.heardAbout.value,
            to_email: "letsmakeadifference4u@gmail.com"
        };
        
        // Send the email
        emailjs.send(SERVICE_ID, VOLUNTEER_TEMPLATE_ID, templateParams)
            .then(function() {
                alert("Your volunteer application has been submitted successfully!");
                form.reset();
            }, function(error) {
                console.error("Email sending failed:", error);
                alert("Sorry, there was an error submitting your application. Please try again later.");
            })
            .finally(function() {
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            });
    }
    
    // Handle donation form submission
    function handleDonationFormSubmit(event) {
        event.preventDefault();
        
        const form = event.target;
        const submitButton = form.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.textContent;
        
        // Change button text to indicate loading
        submitButton.textContent = "Processing...";
        submitButton.disabled = true;
        
        // Get donation amount
        let donationAmount;
        if (form.amount.value === 'other') {
            donationAmount = form['custom-amount'].value;
        } else {
            donationAmount = form.amount.value;
        }
        
        // Prepare template parameters
        const templateParams = {
            name: form.name.value,
            email: form.email.value,
            amount: '$' + donationAmount,
            frequency: form.frequency.value,
            to_email: "letsmakeadifference4u@gmail.com"
        };
        
        // Send the email
        emailjs.send(SERVICE_ID, DONATION_TEMPLATE_ID, templateParams)
            .then(function() {
                alert("Thank you for your donation! A receipt has been sent to your email.");
                form.reset();
                // Hide the other amount field if it was displayed
                document.getElementById('other-amount').style.display = 'none';
            }, function(error) {
                console.error("Donation processing failed:", error);
                alert("Sorry, there was an error processing your donation. Please try again later.");
            })
            .finally(function() {
                submitButton.textContent = originalButtonText;
                submitButton.disabled = false;
            });
    }
    
    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', function() {
        // Initialize EmailJS
        initEmailJS();
        
        // Set up event listeners for forms
        const contactForm = document.querySelector('.contact-form form');
        if (contactForm) {
            contactForm.addEventListener('submit', handleContactFormSubmit);
        }
        
        const volunteerForm = document.getElementById('volunteerForm');
        if (volunteerForm) {
            volunteerForm.addEventListener('submit', handleVolunteerFormSubmit);
        }
        
        const donationForm = document.querySelector('.donation-form form');
        if (donationForm) {
            donationForm.addEventListener('submit', handleDonationFormSubmit);
        }
    });
})();
