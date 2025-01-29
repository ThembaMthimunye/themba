import nodemailer from "nodemailer";

// Create the transporter for Brevo SMTP
const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com", // Use the correct SMTP host for Brevo (formerly Sendinblue)
  port: 587, // Port 587 for TLS, 465 for SSL, or 25 for non-encrypted
  secure: false, // False for TLS (Port 587) or true for SSL (Port 465)
  auth: {
    user: "846915001@smtp-brevo.com", // Your email address
    pass: "V85nQ2SAP9JEXct0",
  },
});

// Verify connection configuration
transporter.verify((error, success) => {
  if (error) {
    console.error("SMTP Connection Error:", error);
  } else {
    console.log("SMTP Connection successful!");
  }
});

// Export the transporter object for use in other modules
export default transporter;
