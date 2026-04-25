require("dotenv").config();
const Pepesan = require("pepesan");
const { fetchLatestBaileysVersion } = require("@whiskeysockets/baileys");
const qrcode = require("qrcode-terminal");
const router = require("./router");

// Ambil variabel environment
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
    // --- KONFIGURASI DATABASE ---
    sessionStorage: {
      type: "mongodb",
      uri: MONGODB_URI, // Ambil dari file .env atau env di Koyeb
      collectionName: "whatsapp_session"
    },
    // ----------------------------
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
  await pepesan.connect();
})();
