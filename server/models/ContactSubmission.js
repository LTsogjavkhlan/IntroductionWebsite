const { mongoose } = require('../db.js');

const contactSubmissionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, default: '' },
    email: { type: String, required: true },
    subject: { type: String, default: '' },
    message: { type: String, required: true },
    sourcePage: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ContactSubmission', contactSubmissionSchema);
