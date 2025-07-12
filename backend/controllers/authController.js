const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const handleLogin = async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) {
        return res.status(400).json({ error: 'Veuillez remplir tous les champs' });
    }
    try {
        const user = await prisma.user.findFirst({
            where: {
                email: email,
            },
        })
        if (!user) {
            return res.status(404).json({ error: 'Email ou mot de passe incorrect' });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(404).json({ error: 'Email ou mot de passe incorrect' });
        }
        const accessToken = jwt.sign(
            {
                userInfo:{
                    id:user.user_id,
                    role:user.role
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn:'15m'}
        )
        console.log("access token is :",accessToken.userInfo)
        const refreshToken = jwt.sign(
            {id:user.user_id,role:user.role},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn:'7d'}
        )

        await prisma.refreshtoken.create({
            data: {
                token: refreshToken,
                user_id: user.user_id,
            },
        })

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,maxAge: 7*24*60*60*1000, secure: true })
        //save the access token in the memory not in local storage
        res.json({ role: user.role, accessToken });
    } catch (error) {
        res.status(500).json({ error: 'Une erreur est survenue lors de la connexion' });
    }
}

const handleLogout = async (req, res) => {
//delete the refreshtoken from db when user logout 
// and also delete the accesstoken in the frontend(memory of the app)
    const cookies = req.cookies
    if(!cookies?.refreshToken) {
        return res.sendStatus(204) // famech cookie déja
    }
    const refreshToken = cookies.refreshToken
    try {
        const user = await prisma.user.findFirst({
            where: {
                refreshtoken: {
                    some: { token: refreshToken }, // Recherche dans les tokens associés
                },
            },
        })

        console.log(user)
        if (!user) {
            res.clearCookie('refreshToken',{
                httpOnly: true, secure: true })
                return res.sendStatus(204)

        }

        //delete the refreshtoken from db
        await prisma.refreshtoken.deleteMany({
            where: {
                token: refreshToken,
            },
        })
        res.clearCookie('refreshToken',{
                httpOnly: true, secure: true })
        return res.sendStatus(204)

    } catch (error) {
        console.error('Erreur lors de la déconnexion :', error);
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
}

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies
    if(!cookies?.refreshToken) {
        return res.status(401).json({ error: 'Veuillez vous connecter' });
    }
    const refreshToken = cookies.refreshToken
    try {
        const user = await prisma.user.findFirst({
            where: {
                refreshtoken: {
                    some: { token: refreshToken }, // Recherche dans les tokens associés
                },
            },
        })

        console.log(user)
        if (!user) {
            return res.status(403).json({ error: 'Token invalide' });

        }
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            console.log("this is the decoded",decoded)
            if (err || decoded.id!==user.user_id) {
                return res.status(403).json({ error: 'Token invalide' });
            }
            const accessToken = jwt.sign(
                        {
                            userInfo : {
                                id:decoded.id,
                                role:decoded.role
                            }
                        },
                        process.env.ACCESS_TOKEN_SECRET,
                        {expiresIn:'15m'}
                    )
            res.json({ email:user.email,role: user.role, accessToken })
            
        })

    } catch (error) {
        res.status(500).json({ error: 'Erreur interne du serveur' });
    }
}

module.exports = {
    handleLogin,
    handleLogout,
    handleRefreshToken,
}