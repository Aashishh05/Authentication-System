import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../middleware/auth";
import {
  register,
  login,
  refresh,
  logout,
  logoutAll,
  me,
  verifyEmail,
  forgotPassword,
  resetPassword,
  changePassword,
  googleAuth,
} from "../services/auth.service";
import { ERROR_MESSAGES, HTTP_STATUS } from "../constants";
import { AppError } from "../errors";

const handleError = (error: unknown, res: Response, _next: NextFunction) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
      errors: error.errors,
    });
  }
  console.error("Controller error:", error);
  return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    message: ERROR_MESSAGES.INTERNAL_ERROR,
  });
};

export const registerController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;
    const result = await register(name, email, password);
    return res.status(HTTP_STATUS.CREATED).json(result);
  } catch (error) {
    return handleError(error, res, next);
  }
};

export const loginController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const result = await login(email, password, res);
    return res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    return handleError(error, res, next);
  }
};

export const refreshController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.refreshToken;
    const result = await refresh(token, res);
    return res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    return handleError(error, res, next);
  }
};

export const logoutController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.refreshToken;
    const result = await logout(token, res);
    return res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    return handleError(error, res, next);
  }
};

export const logoutAllController = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await logoutAll(req.user!.id, res);
    return res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    return handleError(error, res, next);
  }
};

export const meController = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await me(req.user!.id);
    return res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    return handleError(error, res, next);
  }
};

export const verifyEmailController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = Array.isArray(req.params.token) ? req.params.token[0] : req.params.token;
    const result = await verifyEmail(token);
    return res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    return handleError(error, res, next);
  }
};

export const forgotPasswordController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;
    const result = await forgotPassword(email);
    return res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    return handleError(error, res, next);
  }
};

export const resetPasswordController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = Array.isArray(req.params.token) ? req.params.token[0] : req.params.token;
    const { password } = req.body;
    const result = await resetPassword(token, password);
    return res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    return handleError(error, res, next);
  }
};

export const changePasswordController = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const result = await changePassword(req.user!.id, currentPassword, newPassword);
    return res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    return handleError(error, res, next);
  }
};

export const googleAuthController = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const profile = req.user; // Set by passport
    const result = await googleAuth(profile, res);
    return res.status(HTTP_STATUS.OK).json(result);
  } catch (error) {
    return handleError(error, res, next);
  }
};