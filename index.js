require("dotenv").config();
const Pepesan = require("pepesan");
const { fetchLatestBaileysVersion } = require("@whiskeysockets/baileys");
const qrcode = require("qrcode-terminal");
const router = require("./router");
const { ALLOWED_NUMBERS, PORT, MONGODB_URI } = process.env;

(async () => {
  const { version } = await fetchLatestBaileysVersion();
  const config = {
    allowedNumbers:
      ALLOWED_NUMBERS && ALLOWED_NUMBERS.trim() !== ""
        ? ALLOWED_NUMBERS.split(",")
        : null,
    browserName: "Tikko Bot",
    version,
    // Konfigurasi session storage ke MongoDB agar tidak perlu scan ulang di hosting
    sessionStorage: {
      type: "mongodb",
      uri: MONGODB_URI,
      collectionName: "tikko_session",
    },
    server: {
      port: PORT || 3000,
    },
    onQR: (id, state) => {
      if (state.qr) {
        console.log("\n--- SCAN QR CODE DI BAWAH INI ---");
        qrcode.generate(state.qr, { small: true });
      }
    },
  };

  const pepesan = Pepesan.init(router, config);

  // Endpoint Health Check untuk cron-job.org agar bot tidak "tidur" di Render
  pepesan.app.get("/", (req, res) => {
    res.send("Tikko Bot is running...");
  });

  await pepesan.connect();
})();
