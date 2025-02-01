import jwt from 'jsonwebtoken';
const generateTocken = (id, isAdmin) => {
    console.log(`id ${id}, role:${isAdmin}`);
    return jwt.sign({ id: id, role: isAdmin }, process.env.JWT_SECRET, { expiresIn: '30d' });
};
export default generateTocken;
