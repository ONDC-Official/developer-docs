const express = require("express");
const sodium = require("sodium-native");
const crypto = require("crypto");
const axios = require("axios");
const app = express();
const port = 9900;

const createSigningString = (data) => {
  const { country, domain, type, city, subscriberId } = data;
  return [country, domain, type, city, subscriberId].join("|");
};

const getEnvDetails = (env) => {
  let envLink = "";
  if (env === "preprod") {
    envLink = "https://preprod.registry.ondc.org/ondc/vlookup";
  } else if (env === "prod") {
    envLink = "https://prod.registry.ondc.org/vlookup";
  } else if (env === "staging") {
    envLink = "https://staging.registry.ondc.org/vlookup";
  } else {
    throw new Error("Unsupported environment");
  }
  return envLink;
};

const fetchRegistryResponse = async (
  requestId,
  timestamp,
  signature,
  searchParameters,
  senderSubscriberId,
  envLink
) => {
  try {
    const response = await axios.post(envLink, {
      sender_subscriber_id: senderSubscriberId,
      request_id: requestId,
      timestamp,
      search_parameters: searchParameters,
      signature,
    });
    return response;
  } catch (error) {
    return error;
  }
};

const getVLookUpData = async (signature, data) => {
  try {
    const requestId = crypto.randomUUID();
    const timestamp = new Date().toISOString();
    const { country, domain, type, city, subscriberId } = data;
    const searchParameters = {
      country,
      domain,
      type,
      city,
      subscriber_id: subscriberId,
    };
    const senderSubscriberId = data.senderSubscriberId;
    const envLink = getEnvDetails(data.env);

    const res = await fetchRegistryResponse(
      requestId,
      timestamp,
      signature,
      searchParameters,
      senderSubscriberId,
      envLink
    );
    return res;
  } catch (error) {
    logError("getVLookUpData", error);
    throw error;
  }
};

const signData = (message, privateKey) => {
  const signature = new Uint8Array(sodium.crypto_sign_BYTES);
  sodium.crypto_sign_detached(signature, message, privateKey);
  return signature;
};

const sign = (signingString, privateKey) => {
  let privateKeyBytes = Buffer.from(privateKey, "base64");
  const message = Buffer.from(signingString);

  if (privateKeyBytes.length !== sodium.crypto_sign_SECRETKEYBYTES) {
    return "Invalid private key length";
  }
  privateKey = new Uint8Array(privateKeyBytes);

  const signature = signData(message, privateKey);

  signatureBase64 = Buffer.from(signature).toString("base64");

  return signatureBase64;
};

const vLookUp = async (data) => {
  try {
    const signingString = createSigningString(data);
    const signature = sign(signingString, data.privateKey);
    let res = await getVLookUpData(signature, data);
    res = res.data;
    return res;
  } catch (error) {
    logError("vLookUp", error);
    throw error;
  }
};

const logError = (location, error) => {
  console.error(`Error in ${location}:`, error);
};

app.use(express.json());

// Route for signing your data
app.post("/vlookup/sign", (req, res) => {
  try {
    const data = req.body;
    const signingString = createSigningString(data);
    const signature = sign(signingString, data.privateKey);
    res.status(200).send({ success: true, signature });
  } catch (error) {
    logError("/vlookup/sign", error);
    res.status(400).send({ success: false, response: error.message });
  }
});

// Route for vlookup
app.post("/vlookup", async (req, res) => {
  try {
    const response = await vLookUp(req.body);
    res.status(200).send({ success: true, response });
  } catch (error) {
    logError("/vlookup", error);
    res.status(400).send({ success: false, response: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
