function sendMail(contactForm) {
    emailjs.send("gmail", "template_9x75h1p", {
            "from_name": contactForm.name.value,
            "from_email": contactForm.emailaddress.value
        })
        .then(
            function(response) {
                console.log("SUCCESS", response);
            },
            function(error) {
                console.log("FAILED", error);
            });
}