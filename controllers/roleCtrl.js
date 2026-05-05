const Users = require("../models/userModel");
 
const roleCtrl = {

 
    searchUser: async (req, res) => {
        try {
            const users = await Users.find({username: {$regex: req.query.username}})
            .limit(10).select("username avatar")
            
            res.json({users})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },


    UserRoleNoIdentificado: async (req, res) => {
        const { role } = req.body;
        try {
            const user = await Users.findByIdAndUpdate(req.params.id, { role }, { new: true });
            if (!user) return res.status(404).json({ msg: role.user_not_found });

            res.json({ msg: role.role_assigned });
        } catch (error) {
            res.status(500).json({ msg: role.update_error });
        }
    },

    assignUserRole: async (req, res) => {
        const { role } = req.body;
        try {
            const user = await Users.findByIdAndUpdate(req.params.id, { role }, { new: true });
            if (!user) return res.status(404).json({ msg: role.user_not_found });

            res.json({ msg: role.role_assigned });
        } catch (error) {
            res.status(500).json({ msg: role.update_error });
        }
    },

    assignUserProRole: async (req, res) => {
        const { role } = req.body;
        try {
            const user = await Users.findByIdAndUpdate(req.params.id, { role }, { new: true });
            if (!user) return res.status(404).json({ msg: role.user_not_found });

            res.json({ msg: role.userpro });
        } catch (error) {
            res.status(500).json({ msg: role.update_error });
        }
    },

    assignModeratorRole: async (req, res) => {
        const { role } = req.body;
        try {
            const user = await Users.findByIdAndUpdate(req.params.id, { role }, { new: true });
            if (!user) return res.status(404).json({ msg: role.user_not_found });

            res.json({ msg: role.moderator_assigned });
        } catch (error) {
            res.status(500).json({ msg: role.update_error });
        }
    },

    assignAdminRole: async (req, res) => {
        const { role } = req.body;
        try {
            const user = await Users.findByIdAndUpdate(req.params.id, { role }, { new: true });
            if (!user) return res.status(404).json({ msg: role.user_not_found });

            res.json({ msg: role.admin_assigned });
        } catch (error) {
            res.status(500).json({ msg: role.update_error });
        }
   
},

updateRole: async (req, res) => {
    const { role } = req.body;
    try {
      const user = await Users.findByIdAndUpdate(
        req.params.id,
        { role },
        { 
          new: true,
          select: '-password' // Excluir datos sensibles
        }
      );

      if (!user) return res.status(404).json({ msg: role.user_not_found });

      // Respuesta optimizada para Redux
      res.json({
        msg: role.role_updated,
        user: {
          _id: user._id,
          username: user.username,
          avatar: user.avatar,
          role: user.role,
          // Incluir otros campos necesarios en el frontend
          isVerified: user.isVerified,
          isActive: user.isActive
        }
      });

    } catch (err) {
      console.error('Error updating role:', err);
      res.status(500).json({ 
        msg: role.update_error,
        error: err.message 
      });
    }
  }
 
  
 }




module.exports = roleCtrl;