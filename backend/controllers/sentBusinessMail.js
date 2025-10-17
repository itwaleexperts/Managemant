const nodemailer = require("nodemailer");

exports.sendBusniessMali = async (req, res) => {
  try {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: email,
      to: process.env.SUPER_ADMIN_EMAIL,
      subject: "New Business Signup Request",
      text: `
        New business signup request received:
        Name: ${name}
        Email: ${email}
        Phone: ${phone}
      `,
      html: `
        <h3>New Business Signup Request</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, message: "Business signup request sent successfully" });
  } catch (error) {
    console.log("Error sending email:", error);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
};