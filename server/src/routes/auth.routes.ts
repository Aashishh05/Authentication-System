import { Router } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { config } from "../config";
import User from "../models/User";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";
import * as ctrl from "../controllers/auth.controller";
import {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
  refreshSchema,
  logoutSchema,
} from "../validators/auth.validator";

passport.use(
  new GoogleStrategy(
    {
      clientID: config.google.clientId!,
      clientSecret: config.google.clientSecret!,
      callbackURL: config.google.callbackUrl!,
    },
    async (_at: string, _rt: string, profile: any, done: (error: Error | null, user?: any) => void) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error("No email from Google"));

        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({
            name: profile.displayName,
            email,
            googleId: profile.id,
            avatar: profile.photos?.[0]?.value,
            isVerified: true,
            password: await import("bcryptjs").then(b => b.hash(profile.id, 12)),
          });
        } else if (!user.googleId) {
          user.googleId = profile.id;
          user.isVerified = true;
          await user.save();
        }
        done(null, user);
      } catch (err) {
        done(err as Error);
      }
    }
  )
);

passport.serializeUser((user: any, done) => done(null, user));
passport.deserializeUser((user: any, done) => {
  // Convert full User document to JwtPayload for type consistency
  if (user && user._id && user.role) {
    done(null, { id: user._id.toString(), role: user.role });
  } else {
    done(null, user);
  }
});

const router = Router();

// Type-safe route handlers for routes using authenticate middleware
const logoutAllHandler = (req: any, res: any, next: any) => ctrl.logoutAllController(req, res, next);
const meHandler = (req: any, res: any, next: any) => ctrl.meController(req, res, next);
const changePasswordHandler = (req: any, res: any, next: any) => ctrl.changePasswordController(req, res, next);

router.post("/register", validate(registerSchema), ctrl.registerController);
router.post("/login", validate(loginSchema), ctrl.loginController);
router.post("/refresh", validate(refreshSchema), ctrl.refreshController);
router.post("/logout", validate(logoutSchema), ctrl.logoutController);
router.post("/logout-all", authenticate, logoutAllHandler);
router.get("/me", authenticate, meHandler);
router.get("/verify-email/:token", validate(verifyEmailSchema), ctrl.verifyEmailController);
router.post("/forgot-password", validate(forgotPasswordSchema), ctrl.forgotPasswordController);
router.post("/reset-password/:token", validate(resetPasswordSchema), ctrl.resetPasswordController);
router.post("/change-password", authenticate, validate(changePasswordSchema), changePasswordHandler);

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: `${config.clientUrl}/login?error=oauth` }),
  async (req: any, res) => {
    // Convert full User document to JwtPayload for consistency
    if (req.user && req.user._id && req.user.role) {
      req.user = { id: req.user._id.toString(), role: req.user.role };
    }
    res.redirect(`${config.clientUrl}/oauth/callback`);
  }
);

export default router;