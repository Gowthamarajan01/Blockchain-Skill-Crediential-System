const Credential = require('../models/Credential');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const crypto = require('crypto');
const asyncHandler = require('express-async-handler');
const fs = require('fs');


// Simulating blockchain saving logic
const saveToBlockchain = (hash) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                transactionId: `0x${crypto.randomBytes(32).toString('hex')}`,
                timestamp: new Date()
            });
        }, 1000);
    });
};

// @desc    Issue new credential
// @route   POST /api/credentials/issue
// @access  Private/Admin
const issueCredential = asyncHandler(async (req, res) => {
    try {
        const { userEmail, skillName } = req.body;
        const certificateImage = req.file ? req.file.path.replace(/\\/g, '/') : null;

        const recipient = await User.findOne({ email: userEmail });
        if (!recipient) {
            res.status(404);
            throw new Error('Recipient user not found');
        }

        // Generate unique ID
        const credentialId = `CRED-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
        
        // Generate data for hash
        const dataToHash = `${recipient._id}-${recipient.name}-${skillName || 'Certificate'}-${credentialId}-${req.user._id}`;
        
        // Generate SHA-256 Hash
        const hash = crypto.createHash('sha256').update(dataToHash).digest('hex');

        // Simulate blockchain transaction
        const blockchainTx = await saveToBlockchain(hash);

        // Save transaction to DB
        const transaction = await Transaction.create({
            credentialId,
            transactionId: blockchainTx.transactionId,
            hashStrored: hash,
            timestamp: blockchainTx.timestamp
        });

        // Save Credential DB
        const credential = await Credential.create({
            user: recipient._id,
            userName: recipient.name,
            skillName: skillName || 'Certificate Uploaded',
            certificateImage,
            credentialId,
            blockchainHash: hash,
            issuer: req.user._id
        });

        res.status(201).json({
            credential,
            transaction
        });
    } catch (error) {
        // Cleanup orphaned uploaded file if creation fails
        if (req.file && req.file.path) {
            fs.unlink(req.file.path, (err) => {
                if (err) console.error("Failed to delete orphaned file:", err);
            });
        }
        throw error;
    }
});

// @desc    Get user credentials
// @route   GET /api/credentials/my
// @access  Private
const getMyCredentials = asyncHandler(async (req, res) => {
    const credentials = await Credential.find({ user: req.user._id }).populate('issuer', 'name');
    res.json(credentials);
});

// @desc    Get all credentials
// @route   GET /api/credentials
// @access  Private/Admin
const getAllCredentials = asyncHandler(async (req, res) => {
    const credentials = await Credential.find({}).populate('user', 'name email').populate('issuer', 'name');
    res.json(credentials);
});

// @desc    Verify credential 
// @route   GET /api/credentials/verify/:idOrHash
// @access  Public
const verifyCredential = asyncHandler(async (req, res) => {
    const { idOrHash } = req.params;

    // We can search by CredentialId or BlockchainHash
    const credential = await Credential.findOne({
        $or: [{ credentialId: idOrHash }, { blockchainHash: idOrHash }]
    }).populate('user', 'name').populate('issuer', 'name');

    if (!credential) {
        return res.status(404).json({ valid: false, message: 'Credential not found' });
    }

    // Now let's verify if the hash exists in our "blockchain" simulation (Transaction collection)
    const transaction = await Transaction.findOne({ credentialId: credential.credentialId });

    if (!transaction) {
        return res.status(400).json({ valid: false, message: 'Transaction record not found on blockchain' });
    }

    // Reconstruct data to hash to verify tampering (Optional but good practice)
    const dataToHash = `${credential.user._id}-${credential.userName}-${credential.skillName}-${credential.credentialId}-${credential.issuer._id}`;
    const calculatedHash = crypto.createHash('sha256').update(dataToHash).digest('hex');

    if (calculatedHash !== credential.blockchainHash || calculatedHash !== transaction.hashStrored) {
         return res.status(400).json({ valid: false, message: 'Hash mismatch: Data has been tampered' });
    }

    res.json({
        valid: true,
        credential,
        transaction
    });
});

// @desc    Delete credential 
// @route   DELETE /api/credentials/:credentialId
// @access  Private/Admin
const deleteCredential = asyncHandler(async (req, res) => {
    const { credentialId } = req.params;

    const credential = await Credential.findOne({ credentialId });
    if (!credential) {
        return res.status(404).json({ message: 'Credential not found' });
    }

    // Attempt to delete associated certificate image if it exists
    if (credential.certificateImage) {
        fs.unlink(credential.certificateImage, (err) => {
            if (err) console.error("Failed to delete certificate image:", err);
        });
    }

    await Credential.deleteOne({ credentialId });
    await Transaction.deleteOne({ credentialId });

    res.json({ message: 'Credential deleted successfully' });
});

module.exports = { issueCredential, getMyCredentials, getAllCredentials, verifyCredential, deleteCredential };

