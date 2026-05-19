// models/Payment.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    // Referencia al usuario (de tu modelo userModel)
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',  // ← IMPORTANTE: 'user' en minúscula, como tu modelo
        required: true
    },
    
    // Datos del plan (coincide con tus campos)
    plan: {
        type: String,
        enum: ['basic', 'pro', 'business'],  // free no requiere pago
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    duration: {
        type: Number,  // meses
        required: true
    },
    category: String,
    discount: Number,
    freeMonths: Number,
    
    // Datos de Chargily
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    chargilyCheckoutId: String,
    chargilyPaymentId: String,
    
    // Estado del pago
    status: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'expired', 'refunded'],
        default: 'pending'
    },
    
    // Fechas
    paidAt: Date,
    expiresAt: {
        type: Date,
        default: () => new Date(+new Date() + 48 * 60 * 60 * 1000)
    }
}, {
    timestamps: true
});

// Índices
paymentSchema.index({ userId: 1, status: 1 });
paymentSchema.index({ orderId: 1 });
paymentSchema.index({ createdAt: 1 });

module.exports = mongoose.model('Payment', paymentSchema);