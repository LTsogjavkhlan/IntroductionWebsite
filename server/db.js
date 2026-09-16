const dns = require('dns');
const mongoose = require('mongoose');

// On some Windows setups, Node's DNS resolver picks up the router's IPv6
// link-local DNS server, which fails SRV lookups (mongodb+srv://) even
// though the OS resolver works fine. Pointing Node at public DNS servers
// avoids that without needing a different connection-string format.
dns.setServers(['8.8.8.8', '1.1.1.1']);

async function connectDB() {
    if (!process.env.MONGODB_URI) {
        throw new Error('MONGODB_URI is not set in .env');
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
}

module.exports = { connectDB, mongoose };
