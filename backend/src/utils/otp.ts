import axios from "axios";

export const sendOtp = async (phone: string) => {
  const baseURL = "https://api.afromessage.com/api/challenge";
  const expiresIn = 300;
  const response = await axios.get(baseURL, {
    headers: {
      Authorization: `Bearer ${process.env.AFRO_MESSAGE_TRIAL_TOKEN}`,
    },
    params: {
      from: process.env.AFRO_MESSAGE_IDENTIFIER_ID,
      // sender: process.env.AFRO_MESSAGE_SENDER_ID,
      to: phone,
      len: 6,
      t: 0,
      ttl: expiresIn,
      pr: "Your 5-min OTP code is",
      ps: ". DONOT SHARE WITH ANYONE",
      sb: "1",
      sa: "0",
    },
  });

  const result = response.data;

  if (result.acknowledge !== "success") {
    throw new Error(result.response?.errors || "Failed to send OTP");
  }

  return {
    verificationId: result.response.verificationId,
    expiresIn,
    code: result.response.code, // for dev purposes
  };
};

export const verifyOtp = async (
  phone: string,
  code: string,
  verificationId?: string,
) => {
  const baseURL = "https://api.afromessage.com/api/verify";

  const response = await axios.get(baseURL, {
    headers: {
      Authorization: `Bearer ${process.env.AFRO_MESSAGE_TRIAL_TOKEN}`,
    },
    params: {
      to: phone,
      code,
      vc: verificationId,
    },
  });

  const result = response.data;

  if (result.acknowledge !== "success") {
    throw new Error(result.response?.errors || "Invalid or expired code");
  }

  return result.response;
};
