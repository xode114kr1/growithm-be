const mongoose = require("mongoose");

async function startTx(req, res, next) {
  const session = await mongoose.startSession();
  session.startTransaction();
  req.dbSession = session;
  return next();
}

async function endTx(req, res, next) {
  const session = req.dbSession;
  if (!session) return next();

  try {
    if (session.inTransaction()) {
      await session.commitTransaction();
    }
    return next();
  } catch (err) {
    return next(err);
  } finally {
    await session.endSession().catch(() => {});
    req.dbSession = null;
  }
}

module.exports = { startTx, endTx };
