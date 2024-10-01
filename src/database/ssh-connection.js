const mongoose = require("mongoose");
import config from "../conf";
import { createTunnel } from "tunnel-ssh";

const sshOptions = {
  username: config.database.ssh_username,
  password: config.database.ssh_password, // Use password for authentication
  host: config.database.ssh_host, // SSH server address
  port: parseInt(config.database.ssh_port, 10) || 22, // SSH server port, default to 22
};

async function createSshTunnel(sshOptions, port, autoClose = true) {
  let forwardOptions = {
    srcAddr: "127.0.0.1",
    srcPort: 27017,
    dstAddr: "127.0.0.1",
    dstPort: 27017,
  };

  let tunnelOptions = {
    autoClose: autoClose,
  };

  let serverOptions = {
    port: port,
  };

  try {
    await createTunnel(
      tunnelOptions,
      serverOptions,
      sshOptions,
      forwardOptions
    );
  } catch (error) {
    console.log("Error creating tunnel", error);
  }
}

export async function connectToSSHDatabase() {
  try {
    // Set up the SSH tunnel
    await createSshTunnel(sshOptions, 27017);

    // Connect to MongoDB through the SSH tunnel using Mongoose
    const mongoUri = `mongodb://localhost:27017/${config.database.name}`;
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Database connected using ssh");

    // Return the Mongoose connection
    return mongoose.connection;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    process.exit(1); // Exit on error
  }
}
