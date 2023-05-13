const express = require('express');
const { default: mongoose } = require('mongoose');
const userRouter = require('./routes/userRouter');
const postRouter = require('./routes/postRouter');
const multer = require('multer');
const cors = require('cors');
const app = express();
const http = require('http');
const { loginValidation, registerValidation } = require('./utils/validations');
const handleValidationErrors = require('./utils/handleValidationErrors');
const { userController } = require('./controllers/userController');
const checkAuth = require('./utils/checkAuth');
const server = http.createServer(app);

mongoose
	.connect('mongodb+srv://Zeynab:241761331z@cluster0.xtyohvz.mongodb.net/unsplash')
	.then((res) => {
		console.log('Connected!');
	})
	.catch((err) => {
		console.log('Connection error!');
	});

app.use(express.json());
app.use(cors());

const storage = multer.diskStorage({
	destination: (_, __, cb) => {
		cb(null, 'uploads');
	},
	filename: (_, file, cb) => {
		cb(null, file.originalname);
	},
});

const upload = multer({ storage });
app.use('/uploads', express.static('uploads'));

app.post('/upload', upload.single('image'), (req, res) => {
	console.log(req.headers.authorization);
	res.json({
		url: `/uploads/${req.file.originalname}`,
	});
});

app.get('/auth/', checkAuth, userController.getAll);
app.get('/auth/me', checkAuth, userController.getMe);
app.post('/auth/login', loginValidation, handleValidationErrors, userController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, userController.register);

app.use('/posts', postRouter);
app.use('/users', userRouter);

server.listen(8080, () => {
	console.log('listening on *:8080');
});
