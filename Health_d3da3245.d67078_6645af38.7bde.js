// Simple liveness
msg.payload = {
  status: "OK",
  timestamp: new Date().toISOString(),
  service: "Ulta Conv AI Lab"
};
return msg;