const User = require('../models/user');
const bcrypt = require('bcrypt');

const registerUser = async (req, res) => {
  try {
    const { name, birthdate, nickname, password, email, phone, gender, country, city } = req.body;

    // Validación simple de campos
    if (!name || !birthdate || !nickname || !password || !email || !phone || !gender || !country || !city) {
      return res.status(400).json({ msg: "Please enter all fields" });
    }

    // Verifica si el usuario ya existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Encriptar la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Crear nuevo usuario
    const newUser = new User({
      name,
      birthdate,
      nickname,
      password: hashedPassword,
      email,
      phone,
      gender,
      country,
      city,
    });

    // Guardar usuario en la base de datos
    await newUser.save();

    res.status(201).json({ msg: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
};

module.exports = { registerUser };