import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../app/models/user";

export default (app) => {
  // 初始化passport module
  app.use(passport.initialize());
  app.use(passport.session());

  // Facebook strategy
  // passport.use(
  //   new FacebookStrategy(
  //     {
  //       clientID: process.env.FACEBOOK_ID,
  //       clientSecret: process.env.FACEBOOK_SECRET,
  //       callbackURL: process.env.FACEBOOK_CALLBACK,
  //       profileFields: ["email", "displayName"],
  //     },
  //     (accessToken, refreshToken, profile, done) => {
  //       const { name, email } = profile._json;
  //       User.findOne({ email }).then((user) => {
  //         if (user) return done(null, user);
  //         const randomPassword = Math.random().toString(36).slice(-8);
  //         bcrypt
  //           .genSalt(10)
  //           .then((salt) => bcrypt.hash(randomPassword, salt))
  //           .then((hash) =>
  //             User.create({
  //               name,
  //               email,
  //               password: hash,
  //             })
  //           )
  //           .then((user) => done(null, user))
  //           .catch((err) => done(err, false));
  //       });
  //     }
  //   )
  // );

  // 設定LocalStrategy
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
      },
      (email, password, done) => {
        User.findOne({ email })
          .then((user) => {
            if (!user) {
              return done(null, false, {
                message: "That email is not registered",
              });
            }
            return bcrypt.compare(password, user.password).then((isMatch) => {
              if (!isMatch) {
                return done(null, false, {
                  message: "email or pw incorrect!",
                });
              }
              return done(null, user);
            });
          })
          .catch((err) => done(err, false));
      }
    )
  );
  // 序列化、反序列化
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser((id, done) => {
    User.findById(id)
      .lean()
      .then((user) => done(null, user))
      .catch((err) => done(err, null));
  });
};

// JWT
// TOKEN / REFRESH TOKEN
