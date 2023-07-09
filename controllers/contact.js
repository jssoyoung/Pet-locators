// Import nodemailer to send emails:
const nodemailer = require('nodemailer');

// Define transporter to send emails:
const transporter = nodemailer.createTransport({
  host: 'smtp.zoho.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
  // TODO: Implement SSL certification
  tls: {
    rejectUnauthorized: false,
  },
});

// Render contact page:
exports.getContact = (req, res) => {
  // Destructure user_name and email from session object; short-circuiting
  const { user_name: name, email } = req.session.user || {};
  res.render('contact', {
    name: name,
    email: email,
    isLoggedIn: req.session.isLoggedIn,
  });
};

exports.postContact = async (req, res) => {
  // Destructure user_name and email from session object; short-circuiting
  const { user_name: name, email } = req.session.user || {};
  const content = req.body.message;
  // Define mail options:
  const mailOptions = {
    from: process.env.EMAIL,
    to: process.env.EMAIL,
    subject: "User's Contact Form",
    text: `Username: ${name} (Email: ${email}): ${content}`,
  };

  try {
    // Send email:
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Message sent successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Failed to send message' });
  }
};
