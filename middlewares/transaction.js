const mongoose = require("mongoose");

async function startTx(req, res, next) {
  const session = await mongoose.startSession();
  session.startTransaction();
  req.dbSession = session;

  // finish: 응답이 정상적으로 전송 완료된 시점
  res.once("finish", async () => {
    try {
      if (!req.dbSession) return;

      if (res.statusCode >= 200 && res.statusCode < 400) {
        await session.commitTransaction();
      } else {
        await session.abortTransaction();
      }
    } catch (e) {
      try {
        await session.abortTransaction();
      } catch (_) {}
    } finally {
      await session.endSession();
      req.dbSession = null;
    }
  });

  // close: 클라이언트가 중간에 끊은 경우(전송 완료 전)
  res.once("close", async () => {
    try {
      if (!req.dbSession) return;
      await session.abortTransaction();
    } catch (_) {
    } finally {
      await session.endSession();
      req.dbSession = null;
    }
  });

  next();
}

module.exports = { startTx };
