// Contact Form Handler with AWS API Gateway
const API_ENDPOINT = 'YOUR_API_GATEWAY_ENDPOINT_HERE'; // You'll get this after deploying

const contactForm = {
    form: {
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: '',
        website: '' // Honeypot field for spam prevention
    },
    formTouched: false,
    submitting: false,
    formAlert: null,

    validEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },

    async submitForm() {
        this.formTouched = true;
        this.formAlert = null;

        // Validate required fields
        if (!this.form.name || !this.form.email || !this.form.message) {
            this.formAlert = {
                type: 'danger',
                message: 'Please fill in all required fields.'
            };
            return;
        }

        // Validate email format
        if (!this.validEmail(this.form.email)) {
            this.formAlert = {
                type: 'danger',
                message: 'Please enter a valid email address.'
            };
            return;
        }

        this.submitting = true;

        try {
            const response = await fetch(API_ENDPOINT, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(this.form)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                this.formAlert = {
                    type: 'success',
                    message: data.message || 'Thank you! Your message has been sent successfully. We\'ll get back to you soon.'
                };

                // Reset form
                this.form = {
                    name: '',
                    email: '',
                    phone: '',
                    company: '',
                    subject: '',
                    message: '',
                    website: ''
                };
                this.formTouched = false;

                // Scroll to alert
                document.getElementById('formAlert').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                throw new Error(data.message || 'Failed to send message');
            }
        } catch (error) {
            console.error('Error:', error);
            this.formAlert = {
                type: 'danger',
                message: 'Sorry, there was an error sending your message. Please try again or email us directly at contact@printsmith.ie'
            };
        } finally {
            this.submitting = false;
        }
    }
};

// Initialize if using vanilla JS (without Vue)
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    if (form && typeof Vue === 'undefined') {
        // Vanilla JS implementation
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('email').value,
                phone: document.getElementById('phone').value,
                company: document.getElementById('company').value,
                subject: document.getElementById('subject').value,
                message: document.getElementById('message').value,
                website: document.querySelector('[name="website"]').value
            };

            const submitBtn = form.querySelector('button[type="submit"]');
            const alertDiv = document.getElementById('formAlert');
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Sending...';

            try {
                const response = await fetch(API_ENDPOINT, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData)
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    alertDiv.innerHTML = `<div class="alert alert-success">${data.message || 'Thank you! Your message has been sent successfully.'}</div>`;
                    form.reset();
                } else {
                    throw new Error(data.message || 'Failed to send message');
                }
            } catch (error) {
                console.error('Error:', error);
                alertDiv.innerHTML = `<div class="alert alert-danger">Sorry, there was an error sending your message. Please try again or email us directly at contact@printsmith.ie</div>`;
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16" style="vertical-align: middle; margin-right: 6px;"><path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576 6.636 10.07Zm6.787-8.201L1.591 6.602l4.339 2.76 7.494-7.493Z"/></svg>Send Message';
                alertDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    }
});
