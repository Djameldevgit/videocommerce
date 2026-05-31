const axios = require('axios');

const Users = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sendMail = require('./sendMail')
const sendCustomEmail = require('./sendCustomEmail')
const { google } = require('googleapis')
const { OAuth2 } = google.auth
const { CLIENT_URL } = process.env

const client = new OAuth2(process.env.GOOGLE_CLIENT_ID)
 
 
 
const authCtrl = {
 
    register: async (req, res) => {
        try {
            const { username, email, password } = req.body
            
            // Validaciones básicas
            if (!username || !email || !password) {
                return res.status(400).json({msg: "Please fill in all fields."})
            }
    
            let newUserName = username.toLowerCase().replace(/ /g, '')
    
            const user_name = await Users.findOne({username: newUserName})
            if(user_name) return res.status(400).json({msg: "This username already exists."})
    
            const user_email = await Users.findOne({email})
            if(user_email) return res.status(400).json({msg: "This email already exists."})
    
            if(password.length < 6)
            return res.status(400).json({msg: "Password must be at least 6 characters."})
    
            const passwordHash = await bcrypt.hash(password, 12)
    
            const newUser = new Users({
                username: newUserName, 
                email, 
                password: passwordHash
            })
    
            const access_token = createAccessToken({id: newUser._id})
            const refresh_token = createRefreshToken({id: newUser._id})
    
            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/api/refresh_token',
                maxAge: 30*24*60*60*1000 // 30 days
            })
    
            await newUser.save()
    
            res.json({
                msg: 'Register Success!',
                access_token,
                user: {
                    ...newUser._doc,
                    password: ''
                }
            })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body

            const user = await Users.findOne({email})
            .populate("followers following", "avatar username   followers following")

            if(!user) return res.status(400).json({msg: "This email does not exist."})

            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch) return res.status(400).json({msg: "Password is incorrect."})

            const access_token = createAccessToken({id: user._id})
            const refresh_token = createRefreshToken({id: user._id})

            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/api/refresh_token',
                maxAge: 30*24*60*60*1000 // 30days
            })

            res.json({
                msg: 'Login Success!',
                access_token,
                user: {
                    password: ''
                }
            })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    login: async (req, res) => {
        try {
            const { email, password } = req.body

            const user = await Users.findOne({email})
            .populate("followers following", "avatar username  followers following")

            if(!user) return res.status(400).json({msg: "This email does not exist."})

            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch) return res.status(400).json({msg: "Password is incorrect."})

            const access_token = createAccessToken({id: user._id})
            const refresh_token = createRefreshToken({id: user._id})

            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/api/refresh_token',
                maxAge: 30*24*60*60*1000 // 30days
            })

            res.json({
                msg: 'Login Success!',
                access_token,
                user: {
                    ...user._doc,
                    password: ''
                }
            })
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    },
    sendActivationEmail: async (req, res) => {
        try {
            const user = await Users.findById(req.user._id);
            if (!user)
                return res.status(400).json({ msg: req.__('auth.user_not_found') });

            if (user.isVerified)
                return res.status(400).json({ msg: req.__('auth.already_verified') });

            const activation_token = createActivationToken({ id: user._id });
            const url = `${CLIENT_URL}/user/activate/${activation_token}`;

            await sendMail(user.email, url, req.getLocale(), 'activation');

            res.json({ msg: req.__('activation_email_sent') });
        } catch (err) {
            return res.status(500).json({ msg: req.__('auth.server_error') });
        }
    },



    activationAccount: async (req, res) => {
        try {
            const { activation_token } = req.body;
            const decoded = jwt.verify(activation_token, process.env.ACTIVATION_TOKEN_SECRET);
            const { id } = decoded;

            const user = await Users.findById(id);
            if (!user) return res.status(400).json({ msg: req.__('auth.user_not_found') });

            if (user.isVerified)
                return res.status(400).json({ msg: req.__('auth.already_verified') });

            user.isVerified = true;
            await user.save();

            // Devolver usuario actualizado
            res.json({
                msg: req.__('auth.account_activated'),
                user
            });
        } catch (err) {
            return res.status(500).json({ msg: req.__('auth.server_error') });
        }
    },
    toggleVerification : async (req, res) => {
        try {
          const { id } = req.params; // userId
          const user = await Users.findById(id);
          if (!user) return res.status(404).json({ msg: "Usuario no encontrado" });
      
          user.isVerified = !user.isVerified; // alternar true/false
          await user.save();
      
          res.json({
            msg: `El usuario ahora está ${user.isVerified ? "verificado ✅" : "no verificado ❌"}`,
            user,
          });
        } catch (err) {
          return res.status(500).json({ msg: "Error en el servidor" });
        }
      },

    forgotPassword: async (req, res) => {
        try {
            const { email } = req.body;
            const user = await Users.findOne({ email });
            if (!user)
                return res.status(400).json({ msg: req.__('auth.email_not_exist') });

            const access_token = createAccessToken({ id: user._id });
            const url = `${CLIENT_URL}/user/reset/${access_token}`;

            await sendMail(user.email, url, req.getLocale(), 'reset');

            res.json({ msg: req.__('auth.reset_email_sent') });
        } catch (err) {
            return res.status(500).json({ msg: req.__('auth.server_error') });
        }
    },


    resetPassword: async (req, res) => {
        try {
            const { password } = req.body;
            const passwordHash = await bcrypt.hash(password, 12);

            await Users.findOneAndUpdate(
                { _id: req.user.id },
                { password: passwordHash }
            );

            res.json({ msg: req.__('auth.password_changed') });
        } catch (err) {
            return res.status(500).json({ msg: req.__('auth.server_error') });
        }
    },




    sendEmailsParaUsers: async (req, res) => {
        try {
            const { recipients, subject, message, url } = req.body;
            const lang = req.getLocale() || 'es';

            if (!recipients || !Array.isArray(recipients) || recipients.length === 0)
                return res.status(400).json({ msg: 'No se seleccionaron destinatarios.' });

            if (!subject || !message)
                return res.status(400).json({ msg: 'Faltan el asunto o el mensaje.' });

            const users = await Users.find({ _id: { $in: recipients } });
            const emails = users.map(user => user.email);

            for (const email of emails) {
                await sendMail(email, url || '#', lang, 'informativo', subject, message);
            }


            return res.json({ msg: `✅ Correos enviados a ${emails.length} usuarios.` });

        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },



    googleLogin: async (req, res) => {
        try {
            const { tokenId } = req.body;

            const verify = await client.verifyIdToken({
                idToken: tokenId,
                audience: process.env.GOOGLE_CLIENT_ID
            });

            const { email_verified, email, name, picture } = verify.payload;

            if (!email_verified) {
                return res.status(400).json({ msg: "Email verification failed." });
            }

            const password = email + process.env.GOOGLE_SECRET;
            const passwordHash = await bcrypt.hash(password, 12);

            let user = await Users.findOne({ email });

            if (user) {
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch)
                    return res.status(400).json({ msg: "Password is incorrect." });
                // ✅ Si existe pero aún no está verificado, lo marcamos como verificado:
                if (!user.isVerified) {
                    user.isVerified = true;
                    await user.save();
                }

            } else {
                const username = email.split("@")[0].toLowerCase().replace(/\s/g, '');

                user = new Users({
                    name,
                    username,
                    email,
                    password: passwordHash,
                    avatar: picture,
                    isVerified: true // ✅ Usuario de confianza, marcado como verificado
                });

                await user.save();
            }


            const access_token = createAccessToken({ id: user._id });
            const refresh_token = createRefreshToken({ id: user._id });

            res.cookie("refreshtoken", refresh_token, {
                httpOnly: true,
                path: "/api/refresh_token",
                maxAge: 30 * 24 * 60 * 60 * 1000 // 30 días
            });

            res.json({
                msg: "Login success!",
                access_token,
                user: {
                    ...user._doc,
                    password: ''
                }
            });

        } catch (err) {
            return res.status(500).json({ msg: err.message });
        }
    },

    facebookLogin: async (req, res) => {
        try {
            const { accessToken, userID } = req.body;

            // 1. Llamada a la API de Facebook para obtener datos del usuario
            const URL = `https://graph.facebook.com/v2.9/${userID}?fields=id,name,email,picture&access_token=${accessToken}`;
            const response = await axios.get(URL);

            const { email, name, picture } = response.data;

            if (!email)
                return res.status(400).json({ msg: "Tu cuenta de Facebook no tiene un correo confirmado." });

            // 2. Creamos una contraseña segura basada en el email y una secret
            const password = email + process.env.FACEBOOK_SECRET;
            const passwordHash = await bcrypt.hash(password, 12);

            // 3. Buscamos el usuario por email
            let user = await Users.findOne({ email });

            if (user) {
                // Si existe, validamos la contraseña generada
                const isMatch = await bcrypt.compare(password, user.password);
                if (!isMatch) return res.status(400).json({ msg: "Autenticación fallida." });

                // Si existe y no está verificado, lo marcamos como verificado
                if (!user.isVerified) {
                    user.isVerified = true;
                    await user.save();
                }
            } else {
                // 4. Si no existe, generamos un username a partir del correo
                const username = email.split("@")[0].toLowerCase().replace(/\s/g, '');

                // 5. Creamos el nuevo usuario
                user = new Users({
                    name,
                    username,
                    email,
                    password: passwordHash,
                    avatar: picture.data.url,
                    isVerified: true  // 👈 Se considera confiable porque viene de Facebook
                });

                await user.save();
            }

            // 6. Creamos y devolvemos tokens
            const access_token = createAccessToken({ id: user._id });
            const refresh_token = createRefreshToken({ id: user._id });

            res.cookie('refreshtoken', refresh_token, {
                httpOnly: true,
                path: '/api/refresh_token',
                maxAge: 30 * 24 * 60 * 60 * 1000 // 30 días
            });

            res.json({
                msg: "Inicio de sesión exitoso",
                access_token,
                user: {
                    ...user._doc,
                    password: ''
                }
            });

        } catch (err) {
            console.error(err);
            return res.status(500).json({ msg: "Error del servidor en login con Facebook." });
        }
    },

    logout: async (req, res) => {
        try {
            res.clearCookie('refreshtoken', { path: '/api/refresh_token' })
            return res.json({ msg: req.__('auth.logout_success') })
        } catch (err) {
            return res.status(500).json({ msg: req.__('auth.server_error') })
        }
    },








    generateAccessToken: async (req, res) => {
        try {
            const rf_token = req.cookies.refreshtoken
            if (!rf_token)
                return res.status(400).json({ msg: req.__('auth.login_required') })

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, async (err, result) => {
                if (err)
                    return res.status(400).json({ msg: req.__('auth.login_required') })

                const user = await Users.findById(result.id).select("-password")
                    .populate('followers following', 'avatar username followers following')

                if (!user)
                    return res.status(400).json({ msg: req.__('auth.user_not_found') })

                const access_token = createAccessToken({ id: result.id })

                res.json({
                    access_token,
                    user
                })
            })
        } catch (err) {
            return res.status(500).json({ msg: req.__('auth.server_error') })
        }
    }
}

const createActivationToken = (payload) => {
    return jwt.sign(payload, process.env.ACTIVATION_TOKEN_SECRET, { expiresIn: '5m' })
}
const createAccessToken = (payload) => {
    return jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })
}

const createRefreshToken = (payload) => {
    return jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '30d' })
}

module.exports = authCtrl
