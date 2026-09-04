import nodemailer from "nodemailer";
import { getConfig } from "./env";

const createTransporter = () => {
  const config = getConfig();
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: config.EMAIL_USER,
      pass: config.EMAIL_PASS,
    },
  });
};

export default createTransporter;
