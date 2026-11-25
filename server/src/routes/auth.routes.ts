import { Router } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validate";
import * as c from "../controllers/auth.controller";
import { signRefreshToken, hashToken } from "../utils/tokens";
import {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "../utils/validate";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
    },
    async (_at: any, _rt: any, profile: any, done: any) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) return done(new Error("No email from Google"));
        let user = await User.findOne({ email });
        if (!user) {
          user = await User.create({
            name: profile.displayName, email,
            googleId: profile.id, avatar: profile.photos?.[0]?.value,
            isVerified: true,
          });
        } else if (!user.googleId) {
          user.googleId = profile.id;   // link existing account
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

const router = Router();

router.post("/register", validate(registerSchema), c.register);
router.post("/login", validate(loginSchema), c.login);
router.post("/refresh", c.refresh);
router.post("/logout", c.logout);
router.post("/logout-all", authenticate, c.logoutAll);
router.get("/me", authenticate, c.me);
router.get("/verify-email/:token", validate(verifyEmailSchema), c.verifyEmail);
router.post("/forgot-password", validate(forgotPasswordSchema), c.forgotPassword);
router.post("/reset-password/:token", validate(resetPasswordSchema), c.resetPassword);
router.post("/change-password", authenticate, validate(changePasswordSchema), c.changePassword);

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], session: false }));
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: `${process.env.CLIENT_URL}/login?error=oauth` }),
  async (req: any, res) => {
    const user = req.user;
    const refreshToken = signRefreshToken({ id: user._id.toString(), role: user.role });
    await User.updateOne({ _id: user._id }, { $push: { refreshTokens: hashToken(refreshToken) } });
    // We don't set the cookie here because the flow goes through the frontend OAuthCallback page
    // The frontend will call /auth/refresh after the redirect
    res.redirect(`${process.env.CLIENT_URL}/oauth/callback`);
  }
);

export default router;