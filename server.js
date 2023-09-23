//Question 1

const express = require("express");
const cors = require("cors");
const axios = require("axios");


const app = express();
app.use(cors());
const PORT = 3000;

const api_data = {
  companyName: "Train Central",
  clientID: "75b29ded-ab8c-401d-badc-f8d1e4474df5",
  clientSecret: "xdvaxpBsNpXgbltt",
  ownerName: "Vamsi Krishna",
  ownerEmail: "pvamsikri2003@gmail.com",
  rollNo: "20J41A05A6",
};
let auth_token = "";

async function getToken(api_data) {
  try {
    const response = await axios.post(
      "http://20.244.56.144/train/auth",
      api_data
    );
    const token = response.data.access_token;
    return token;
  } catch (error) {
    console.error("Error : ", error);
    throw error;
  }
}

setInterval(async () => {
  auth_token = await getToken(api_data);
}, 30000);

async function fetchTrains() {
  const AUTH_TOKEN = await getToken(api_data);
  try {
    const headers = {
      Authorization: `Bearer ${AUTH_TOKEN}`, // Corrected Bearer token formatting
    };
    const res = await axios.get("http://20.244.56.144/train/trains", {
      headers,
    });
    const trains_data = res.data;
    return trains_data;
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}

app.get("/", async (req, res) => {
  try {
    const trains_data = await fetchTrains();


    res.json(trains_data);
    console.log(trains_data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

app.get("/getTrain/:trainId", async (req, res) => {
  try {
    const trainNumber = req.params.trainId;
    const AUTH_TKN = await getToken(api_data);

    const headers = {
      Authorization: `Bearer ${AUTH_TKN}`, // Corrected Bearer token formatting
    };

    const train_data = await axios.get(
      `http://20.244.56.144/train/trains/${trainNumber}`, // Corrected URL formatting
      { headers }
    );
    res.json(train_data.data);
  } catch (error) {
    console.error("Unable to fetch data", error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:{PORT}`);
});
