const Posts = require('../models/postModel');
const Report = require('../models/reportModel');
const Users = require('../models/userModel');

class APIfeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  paginating() {
    const page = this.queryString.page * 1 || 1
    const limit = this.queryString.limit * 1 || 9
    const skip = (page - 1) * limit
    this.query = this.query.skip(skip).limit(limit)
    return this;
  }
}

const reportCtrl = {
  createReport: async (req, res) => {
    try {
      const { postId, userId, reason } = req.body;
      const reportedBy = req.user._id;
  
      if (!postId || !userId || !reason) {
        return res.status(400).json({ msg: req.__('report.missing_fields') });
      }
  
      // ❗ Verificar si ya existe un reporte duplicado
      const existingReport = await Report.findOne({ postId, reportedBy });
  
      if (existingReport) {
        return res.status(400).json({ msg: req.__('report.already_reported') });
      }
  
      const newReport = new Report({
        postId,
        userId,
        reportedBy,
        reason,
      });
  
      await newReport.save();
      res.json({ msg: req.__('report.create_success') });
    } catch (err) {
      return res.status(500).json({ msg: req.__('report.server_error') });
    }
  },
  
  getReports: async (req, res) => {
    try {
      const reports = await Report.find()
        .populate("userId", "username avatar")
        .populate("reportedBy", "username avatar")
        .populate("postId", "title")
        .exec();

      res.json({ reports, result: reports.length });
    } catch (err) {
      return res.status(500).json({ msg: req.__('report.server_error') });
    }
  },

  getMostReportedUsers: async (req, res) => {
    try {
      const mostReportedUsers = await Report.aggregate([
        { $group: { _id: "$userId", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $project: {
            _id: 1,
            count: 1,
            "user.username": 1,
            "user.avatar": 1,
          },
        },
      ]);

      res.json({ mostReportedUsers });
    } catch (err) {
      return res.status(500).json({ msg: req.__('report.server_error') });
    }
  },

  getMostActiveReporters: async (req, res) => {
    try {
      const mostActiveReporters = await Report.aggregate([
        { $group: { _id: "$reportedBy", count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "user",
          },
        },
        { $unwind: "$user" },
        {
          $project: {
            _id: 1,
            count: 1,
            "user.username": 1,
            "user.avatar": 1,
          },
        },
      ]);

      res.json({ mostActiveReporters });
    } catch (err) {
      return res.status(500).json({ msg: req.__('report.server_error') });
    }
  },
};

module.exports = reportCtrl;
