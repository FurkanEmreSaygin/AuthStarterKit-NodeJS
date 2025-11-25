const passport = require("passport");
const {ExtractJwt , Strategy} = require("passport-jwt");
const config = require("../config")
const Users = require("../db/models/Users")
const UserRoles = require("../db/models/UserRoles")
const RolesPrivileges = require("../db/models/RolesPrivileges")

module.exports = function(){
    let strategy = new Strategy({
        secretOrKey: config.JWT.SECRET,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }, async (payload, done) => {
        try {
          let user = await Users.findOne({ _id: payload.id });
          if (user) {
            let userRole = await UserRoles.find({
              user_id: user._id,
              is_active: true,
            });
            let rolePrivileges = await RolesPrivileges.find({
              role_id: { $in: userRole.map((u) => u.role_id) },
              is_active: true,
            });
            done(null, {
              id: user._id,
              email: user.email,
              roles: rolePrivileges,
              first_name: user.first_name,
              last_name: user.last_name,
              exp: parseInt(Date.now() / 1000) * config.JWT.EXPIRE_TIME,
            });
          } else {
            done(new Error("User not found"), null);
          }
        } catch (err) {
            done(err, null);
        }
    });
    passport.use(strategy);
    return {
        initialize: function(){
            return passport.initialize();
        },
        authenticate: function(){
            return passport.authenticate("jwt", {session: false});
        }
    }
}