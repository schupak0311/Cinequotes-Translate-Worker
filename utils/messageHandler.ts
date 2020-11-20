// @ts-nocheck
const translate = require("@vitalets/google-translate-api");
import firestore from "../firestore";

const messageHandler = (message: any) => {
  console.log(`Received message ${message.id}:`);
  console.log(`\tData: ${message.data}`);

  const data = JSON.parse(message.data);
  translate(data.quoteEN, { from: "en", to: "fr" })
    .then((res) => {
      firestore.collection("quotes").doc(data.id).update({ quoteFN: res.text });
    })
    .catch((err) => {
      console.error(err);
    });

  message.ack();
};

export default messageHandler;
