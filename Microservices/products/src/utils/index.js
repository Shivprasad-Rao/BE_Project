const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const amqplib = require("amqplib");

const {
  BASE_URL,
  APP_SECRET = "be_project",
  EXCHANGE_NAME = "ONLINE_STORE",
  MSG_QUEUE_URL = "amqps://hcepeuuh:deMtu7BvflkTdeokbmhiDPk6P7Russe4@puffin.rmq2.cloudamqp.com/hcepeuuh",
} = require("../config");

//Utility functions
module.exports.GenerateSalt = async () => {
  return await bcrypt.genSalt();
};

module.exports.GeneratePassword = async (password, salt) => {
  return await bcrypt.hash(password, salt);
};

module.exports.ValidatePassword = async (
  enteredPassword,
  savedPassword,
  salt
) => {
  return (await this.GeneratePassword(enteredPassword, salt)) === savedPassword;
};

module.exports.GenerateSignature = async (payload) => {
  try {
    return await jwt.sign(payload, APP_SECRET, { expiresIn: "30d" });
  } catch (error) {
    console.log(error);
    return error;
  }
};

module.exports.ValidateSignature = async (req) => {
  try {
    const signature = req.headers.authorization;
    console.log(signature);
    const payload = await jwt.verify(signature.split(" ")[1], APP_SECRET);
    req.user = payload;
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

module.exports.FormateData = (data) => {
  if (data) {
    return { data };
  } else {
    throw new Error("Data Not found!");
  }
};

//Raise Events
module.exports.PublishCustomerEvent = async (payload) => {
  axios.post("http://customer:8001/app-events/", {
    payload,
  });

  //     axios.post(`${BASE_URL}/customer/app-events/`,{
  //         payload
  //     });
};

module.exports.PublishShoppingEvent = async (payload) => {
  // axios.post('http://gateway:8000/shopping/app-events/',{
  //         payload
  // });

  axios.post(`http://shopping:8003/app-events/`, {
    payload,
  });
};

//Message Broker

module.exports.CreateChannel = async () => {
  try {
    const connection = await amqplib.connect(MSG_QUEUE_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(EXCHANGE_NAME, "direct", { durable: true });
    return channel;
  } catch (err) {
    throw err;
  }
};

module.exports.PublishMessage = (channel, service, msg) => {
  channel.publish(EXCHANGE_NAME, service, Buffer.from(msg));
  console.log("Sent: ", msg);
};
