const User = require('./models/userModel');
let users = []

const EditData = (data, id, call) => {
    const newData = data.map(item => 
        item.id === id ? {...item, call} : item
    )
    return newData;
}

// ✅ Helper para obtener array de followers de forma segura
const getSafeFollowers = (user) => {
    if (!user) return [];
    const followers = user.followers;
    if (Array.isArray(followers)) return followers;
    return [];
}

const SocketServer = (socket) => {
    // Connect - Disconnect
    socket.on('joinUser', async (user) => {
        users.push({id: user._id, socketId: socket.id, followers: user.followers || []})
        
        try {
            await User.findByIdAndUpdate(user._id, {
                isOnline: true,
                lastConnectedAt: new Date(),
                lastOnline: new Date(),
                socketId: socket.id
            });
            
            socket.broadcast.emit('userOnline', { 
                userId: user._id,
                lastOnline: new Date()
            });
            
        } catch (err) {
            console.error('Error en joinUser:', err);
        }
    })

    socket.on('disconnect', async () => {
        const data = users.find(user => user.socketId === socket.id)
        if(data){
            try {
                await User.findByIdAndUpdate(data.id, {
                    isOnline: false,
                    lastDisconnectedAt: new Date(),
                    lastOnline: new Date()
                });
                
                socket.broadcast.emit('userOffline', { 
                    userId: data.id,
                    lastOnline: new Date(),
                    lastDisconnectedAt: new Date()
                });
                
            } catch (err) {
                console.error('❌ Error en disconnect DB update:', err);
            }
        }
    })

    socket.on('userActivity', async (userId) => {
        try {
            await User.findByIdAndUpdate(userId, {
                lastActivity: new Date(),
                lastOnline: new Date()
            });
        } catch (err) {
            console.error('Error en userActivity:', err);
        }
    })

    // TYPING
    socket.on('typing-start', (data) => {
        const user = users.find(user => user.id === data.recipient)
        user && socket.to(`${user.socketId}`).emit('typing-start-to-client', {
            sender: data.sender,
            chatId: data.chatId
        })
    })

    socket.on('typing-stop', (data) => {
        const user = users.find(user => user.id === data.recipient)
        user && socket.to(`${user.socketId}`).emit('typing-stop-to-client', {
            sender: data.sender,
            chatId: data.chatId
        })
    })

    // ✅ Likes - CORREGIDO
    socket.on('likePost', newPost => {
        // Validar que newPost y newPost.user existan
        if (!newPost || !newPost.user) return;
        
        const followers = getSafeFollowers(newPost.user);
        const ids = [...followers, newPost.user._id]
        const clients = users.filter(user => ids.includes(user.id))

        if(clients.length > 0){
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('likeToClient', newPost)
            })
        }
    })

    socket.on('unLikePost', newPost => {
        if (!newPost || !newPost.user) return;
        
        const followers = getSafeFollowers(newPost.user);
        const ids = [...followers, newPost.user._id]
        const clients = users.filter(user => ids.includes(user.id))

        if(clients.length > 0){
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('unLikeToClient', newPost)
            })
        }
    })

    // ✅ Comments - CORREGIDO (misma protección)
    socket.on('createComment', newPost => {
        if (!newPost || !newPost.user) return;
        
        const followers = getSafeFollowers(newPost.user);
        const ids = [...followers, newPost.user._id]
        const clients = users.filter(user => ids.includes(user.id))

        if(clients.length > 0){
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('createCommentToClient', newPost)
            })
        }
    })

    socket.on('deleteComment', newPost => {
        if (!newPost || !newPost.user) return;
        
        const followers = getSafeFollowers(newPost.user);
        const ids = [...followers, newPost.user._id]
        const clients = users.filter(user => ids.includes(user.id))

        if(clients.length > 0){
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('deleteCommentToClient', newPost)
            })
        }
    })

    // Follow
    socket.on('follow', newUser => {
        const user = users.find(user => user.id === newUser._id)
        user && socket.to(`${user.socketId}`).emit('followToClient', newUser)
    })

    socket.on('unFollow', newUser => {
        const user = users.find(user => user.id === newUser._id)
        user && socket.to(`${user.socketId}`).emit('unFollowToClient', newUser)
    })

    // ✅ Notification - CORREGIDO
    socket.on('createNotify', msg => {
        if (!msg || !msg.recipients || !Array.isArray(msg.recipients)) {
            console.log('❌ createNotify: recipients no válido', msg);
            return;
        }

        const clients = users.filter(user => msg.recipients.includes(user.id));
        
        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('createNotifyToClient', msg);
            });
        }
    });

    socket.on('removeNotify', msg => {
        if (!msg || !msg.recipients || !Array.isArray(msg.recipients)) {
            console.log('❌ removeNotify: recipients no válido', msg);
            return;
        }

        const clients = users.filter(user => msg.recipients.includes(user.id));
        
        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('removeNotifyToClient', msg);
            });
        }
    });

    // Message
    socket.on('addMessage', msg => {
        const user = users.find(user => user.id === msg.recipient)
        user && socket.to(`${user.socketId}`).emit('addMessageToClient', msg)
    })

    // Check User Online / Offline
    socket.on('checkUserOnline', data => {
        const following = users.filter(user => 
            data.following.find(item => item._id === user.id)
        )
        socket.emit('checkUserOnlineToMe', following)

        const clients = users.filter(user => 
            data.followers.find(item => item._id === user.id)
        )

        if(clients.length > 0){
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('checkUserOnlineToClient', data._id)
            })
        }
    })

    // Call User
    socket.on('callUser', data => {
        users = EditData(users, data.sender, data.recipient)
        
        const client = users.find(user => user.id === data.recipient)

        if(client){
            if(client.call){
                socket.emit('userBusy', data)
                users = EditData(users, data.sender, null)
            }else{
                users = EditData(users, data.recipient, data.sender)
                socket.to(`${client.socketId}`).emit('callUserToClient', data)
            }
        }
    })

    socket.on('endCall', data => {
        const client = users.find(user => user.id === data.sender)

        if(client){
            socket.to(`${client.socketId}`).emit('endCallToClient', data)
            users = EditData(users, client.id, null)

            if(client.call){
                const clientCall = users.find(user => user.id === client.call)
                clientCall && socket.to(`${clientCall.socketId}`).emit('endCallToClient', data)

                users = EditData(users, client.call, null)
            }
        }
    })
}

module.exports = SocketServer