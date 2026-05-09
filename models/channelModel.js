// models/Channel.js
const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, maxlength: 50 },
    activity: { type: String, required: true, trim: true, maxlength: 100 },
    description: { type: String, trim: true, maxlength: 500, default: '' },
    avatar: { type: String, default: 'https://res.cloudinary.com/dfjipgj2o/image/upload/v1777859039/avatar_cvr2e3.jpg' },
    cover: { type: String, default: '' },
    phone: { type: String, trim: true, default: '' },
    phoneHidden: { type: Boolean, default: false },
    email: { type: String, trim: true, lowercase: true, default: '' },
    website: { type: String, trim: true, default: '' },
    wilaya: { type: String, trim: true, index: true, default: '' },
    commune: { type: String, trim: true, default: '' },
    location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number], default: [0, 0] }
    },
    delivery: {
        available: { type: Boolean, default: false },
        cost: { type: Number, default: 0 },
        estimatedDays: { type: Number, default: 0 },
        zones: [{ type: String }]
    },
    businessHours: {
        monday: { open: String, close: String },
        tuesday: { open: String, close: String },
        wednesday: { open: String, close: String },
        thursday: { open: String, close: String },
        friday: { open: String, close: String },
        saturday: { open: String, close: String },
        sunday: { open: String, close: String }
    },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
    followersCount: { type: Number, default: 0 },
    totalVideos: { type: Number, default: 0 },
    totalViews: { type: Number, default: 0 },
    totalLikes: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isVerified: { type: Boolean, default: false },
    settings: {
        allowComments: { type: Boolean, default: true },
        allowSharing: { type: Boolean, default: true },
        moderateComments: { type: Boolean, default: false }
    }
}, { timestamps: true });

channelSchema.index({ location: '2dsphere' });
channelSchema.index({ wilaya: 1, commune: 1 });
channelSchema.index({ owner: 1 });
channelSchema.index({ name: 'text' });

channelSchema.pre('save', function(next) {
    if (this.isModified('followers')) this.followersCount = this.followers.length;
    next();
});

channelSchema.methods.toggleFollow = async function(userId) {
    const index = this.followers.indexOf(userId);
    let isFollowing = false;
    if (index === -1) {
        this.followers.push(userId);
        isFollowing = true;
    } else {
        this.followers.splice(index, 1);
        isFollowing = false;
    }
    this.followersCount = this.followers.length;
    await this.save();
    return { isFollowing, followersCount: this.followersCount };
};

channelSchema.methods.updateStats = async function() {
    const Video = mongoose.model('Video');
    const stats = await Video.aggregate([
        { $match: { channel: this._id, isActive: true, pendiente: false } },
        { $group: {
            _id: null,
            totalVideos: { $sum: 1 },
            totalViews: { $sum: '$views' },
            totalLikes: { $sum: { $size: '$likes' } }
        }}
    ]);
    if (stats.length) {
        this.totalVideos = stats[0].totalVideos;
        this.totalViews = stats[0].totalViews;
        this.totalLikes = stats[0].totalLikes;
    } else {
        this.totalVideos = 0;
        this.totalViews = 0;
        this.totalLikes = 0;
    }
    await this.save();
    return this;
};

module.exports = mongoose.model('Channel', channelSchema);