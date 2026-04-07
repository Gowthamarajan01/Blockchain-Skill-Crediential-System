const mongoose = require('mongoose');

const credentialSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    skillName: {
        type: String,
        required: true,
    },
    certificateImage: {
        type: String,
        default: null
    },
    issueDate: {
        type: Date,
        default: Date.now,
    },
    credentialId: {
        type: String,
        required: true,
        unique: true,
    },
    blockchainHash: {
        type: String,
        required: true,
    },
    issuer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, {
    timestamps: true
});

const Credential = mongoose.model('Credential', credentialSchema);
module.exports = Credential;
