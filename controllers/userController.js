const path = require('path');
const multer = require('multer');
const sharp = require('sharp');
const { fileTypeFromBuffer } = require('file-type');
const AppError = require('../utils/appError');
const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const factory = require('./handlerFactory');

// USING distorage
// const multerStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'public/img/users');
//   },
//   filename: (req, file, cb) => {
//     // user-7463742874ba-3222222.jpeg
//     const ext = file.mimetype.split('/')[1];
//     cb(null, `user-${req.user.id}-${Date.now()}.${ext}`);
//   },
// });

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

const multerStorage = multer.memoryStorage();

const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

const multerFilter = (req, file, cb) => {
  try {
    //1. Check MIME type (quick first check)
    if (!file.mimetype.startsWith('image/')) {
      return cb(
        new AppError('Not an image! Please upload only images.', 400),
        false
      );
    }

    // 2. Validate file extension
    const ext = path.extname(file.originalname).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      return cb(
        new AppError(
          `Invalid extension! Allowed extensions: ${allowedExtensions.join(
            ', '
          )}`,
          400
        ),
        false
      );
    }
    return cb(null, true);
  } catch (err) {
    cb(new AppError(err.message), false);
  }
};

const validateFileBuffer = async (file) => {
  //validates both the file extension and actual content (magic numbers) to prevent spoofing or file upload attacks
  try {
    if (!file) throw new Error('Upload fail please try again');

    const fileType = await fileTypeFromBuffer(file.buffer);
    if (!fileType || !allowedMimeTypes.includes(fileType?.mime)) {
      throw new Error(
        `Invalid image content! Allowed extensions: ${allowedExtensions.join(
          ', '
        )}`
      );
    }

    return;
  } catch (err) {
    throw new Error(err.message);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single('photo');

exports.resizeUserPhoto = catchAsync(async (req, res, next) => {
  try {
    await validateFileBuffer(req.file);

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

    sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({
        quality: 90,
      })
      .toFile(`public/img/users/${req.file.filename}`);

    next();
  } catch (err) {
    next(new AppError(err.message, 400));
  }
});

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create if user POST's password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword',
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, 'name', 'email');
  if (req.file) filteredBody.photo = req.file.filename;

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not define! Please use /signup instead',
  });
};

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, {
    active: false,
  });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);

// Do NOT update password with this!
exports.updateUser = factory.updateOne(User);

exports.deleteUser = factory.deleteOne(User);
