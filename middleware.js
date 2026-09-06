function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) return next();
  return res.redirect("/login");
}
function redirectIfIAuth(req, res, next) {
  if (req.isAuthenticated()) return res.redirect("profile");
  return next();
}
module.exports = {
  checkAuthentication,
  redirectIfIAuth,
};
