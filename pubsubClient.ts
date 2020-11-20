const { PubSub } = require("@google-cloud/pubsub");
const grpc = require("@grpc/grpc-js");
import messageHandler from "./utils/messageHandler"

const [pubsubHost, pubsubPort] = process.env.PUBSUB_EMULATOR_HOST.split(":");
const options = {
  projectId: "dummy", // projectId doesn’t matter while using the emulator
  servicePath: pubsubHost,
  port: pubsubPort,
  sslCreds: grpc.credentials.createInsecure(),
};

const pubsub = new PubSub(options);

export const createSubscription = async (
  topicName: string,
  subscriptionName: string
) => {
  try {
    await pubsub.topic(topicName).createSubscription(subscriptionName);
  } catch (e) {
    console.warn(e.details);
  }
};

export const listenForPullMessages = (
  subscriptionName: string,
  timeout: number
) => {
  const subscription = pubsub.subscription(subscriptionName);

  subscription.on("message", messageHandler);

  setTimeout(() => {
    subscription.removeListener("message", messageHandler);
  }, timeout * 10000);
};
