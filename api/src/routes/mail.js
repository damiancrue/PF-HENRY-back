const nodemailer = require("nodemailer");
require("dotenv").config();
const { Router } = require("express");
const router = Router();

const { ADMIN_MAIL, PASS_MAIL, HOST_MAIL, PORT_MAIL, ADMIN_CONTACT } =
  process.env;

const transporter = nodemailer.createTransport({
  host: HOST_MAIL,
  port: PORT_MAIL,
  auth: {
    user: ADMIN_MAIL,
    pass: PASS_MAIL,
  },
});

router.post("/contact", (req, res) => {
  if (!req.body) res.status(400).send("No body provided");

  try {
    const { name, lastname, email, subject, message } = req.body;

    const info = `Name: ${name}\nLastname: ${lastname}\nemail: ${email}\nMessage: ${message}`;

    const details = {
      from: ADMIN_MAIL,
      to: ADMIN_CONTACT,
      subject: subject,
      text: info,
    };

    transporter.sendMail(details, (err, info) => {
      if (err) {
        res.status(500).send(err.message);
      } else {
        console.log(info.envelope);
        console.log(info.response);
        res.status(200).json(req.body);
      }
    });
  } catch (e) {
    console.log(e);
    res.status(500).send(err.message);
  }
});

router.post("/contact/response", (req, res) => {
  if (!req.body) res.status(400).send("No body provided");

  try {
    const { name, lastname, email } = req.body;

    const responseMail = `Hello! ${name} ${lastname}\nThank you for contacting us, we will contact you shortly.`;

    const detailsResponse = {
      from: ADMIN_MAIL,
      to: email,
      subject: "Request received",
      text: responseMail,
    };

    transporter.sendMail(detailsResponse, (err, info) => {
      if (err) {
        res.status(500).send(err.message);
      } else {
        console.log(info.envelope);
        console.log(info.response);
        res.status(200).json(req.body);
      }
    });
  } catch (e) {
    console.log(e);
    res.status(500).send(err.message);
  }
});

router.post("/register/response", (req, res) => {
  if (!req.body) res.status(400).send("No body provided");

  try {
    const { name, email } = req.body;

    const responseMail = `Hello! ${name}\nWe hope you are well. Your registration process on our platform has been completed successfully.\nThank you for choosing us.`;

    const detailsResponse = {
      from: ADMIN_MAIL,
      to: email,
      subject: "Successful registration",
      text: responseMail,
    };

    transporter.sendMail(detailsResponse, (err, info) => {
      if (err) {
        res.status(500).send(err.message);
      } else {
        console.log(info.envelope);
        console.log(info.response);
        res.status(200).json(req.body);
      }
    });
  } catch (e) {
    console.log(e);
    res.status(500).send(err.message);
  }
});

router.post("/review/response", (req, res) => {
  if (!req.body) res.status(400).send("No body provided");

  try {
    const { email } = req.body;

    const responseMail = `Hello!\nYour review has been created successfully.\nGreetings.`;

    const detailsResponse = {
      from: ADMIN_MAIL,
      to: email,
      subject: "Review created",
      text: responseMail,
    };

    transporter.sendMail(detailsResponse, (err, info) => {
      if (err) {
        res.status(500).send(err.message);
      } else {
        console.log(info.envelope);
        console.log(info.response);
        res.status(200).json(req.body);
      }
    });
  } catch (e) {
    console.log(e);
    res.status(500).send(err.message);
  }
});

router.post("/purchase/response", (req, res) => {
  if (!req.body) res.status(400).send("No body provided");

  try {
    const { email, name, purchase_id } = req.body;

    const purchaseCode = parseInt(purchase_id) + 2000;

    const responseMail = `Hello! ${name}\nYour purchase has been made successfully. Your purchase confirmation code is: ${purchaseCode}\n
    \nHere are some rules that we would like you to keep in mind when you go to see the film:
    \n1-Only occupy the seats you have assigned. Try to access your seat disturbing as little as possible.
    \n2-Keep your phone off or on silent. Don't take pictures with flash.
    \n3-Make as little noise as possible so as not to interfere with other people who are also enjoying the movie.
    \n4-At the end of the function, please deposit the garbage in the containers designated for that purpose.\n
    \nWe hope you enjoy the feature. Thank you for choosing us.
    \nGreetings.`;

    const detailsResponse = {
      from: ADMIN_MAIL,
      to: email,
      subject: "Purchase confirmation",
      text: responseMail,
    };

    transporter.sendMail(detailsResponse, (err, info) => {
      if (err) {
        res.status(500).send(err.message);
      } else {
        console.log(info.envelope);
        console.log(info.response);
        res.status(200).json(req.body);
      }
    });
  } catch (e) {
    console.log(e);
    res.status(500).send(err.message);
  }
});

module.exports = router;
