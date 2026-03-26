const userAuth = async (req, res, next) => {
    try {
        //get auth header
        const authHeader = req.headers['authorization'];
        //get token from header
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'Log in' });
        }
        //decode token - edited out - using verify instead - more secure, prevents forging a token
        //const decodeObject = jwt.decode(token);
        //if(!decodeObject){
        //    return res.status(401).json({ error: 'Invalid token' });
        //} 
        const decodeObject = jwt.verify(
        token,
        process.env.JWT_SECRET
        );
        //get user id from token
        const {_id} = decodeObject;
        //find user by id
        const user = await User.findById(_id);
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        //attach user to request object
        req.user = user;
        
        console.log('Outgoing Headers:', res.getHeaders()); //testig purposes, not needed
        next();
    } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
        return res.status(401).json({ error: 'Token expired' });
    }
    if (error instanceof jwt.JsonWebTokenError) {
        return res.status(401).json({ error: 'Invalid token' });
    }
    return res.status(400).json({ message: error.message || 'Server error' });
}
}
