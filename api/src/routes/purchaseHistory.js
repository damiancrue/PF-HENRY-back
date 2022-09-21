const { Router } = require("express");
const { getHistory } = require("../controllers/getHistory");
const { getHistoryById } = require("../controllers/getHistoryById");
const { getHistoryByUser } = require("../controllers/getHistoryByUser");
const { getHistoryActive } = require("../controllers/getHistoryActive");
const { getHistoryDelete } = require("../controllers/getHistoryDelete");
const { postHistory } = require("../controllers/postHistory");
const { putHistory } = require("../controllers/putHistory");
const { deleteHistory } = require("../controllers/deleteHistory");
const { activeHistory } = require("../controllers/activeHistory");

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const history = await getHistory();
    if (history.length > 0) {
      res.status(200).send(history);
    } else {
      res.status(404).send({ message: "No history found" });
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

router.get("/byEmail", async (req, res, next) => {
  const { user_email } = req.query;

  try {
    const history = await getHistoryByUser(user_email);
    if (history.length > 0) {
      res.status(200).send(history);
    } else {
      res.status(404).send({ message: "No history found" });
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

router.get("/active", async (req, res, next) => {
  try {
    const history = await getHistoryActive();
    if (history.length > 0) {
      res.status(200).send(history);
    } else {
      res.status(404).send({ message: "No history found" });
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

router.get("/delete", async (req, res, next) => {
  try {
    const history = await getHistoryDelete();
    if (history.length > 0) {
      res.status(200).send(history);
    } else {
      res.status(404).send({ message: "No history found" });
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

router.get("/:history_id", async (req, res, next) => {
  const { history_id } = req.params;

  try {
    const history = await getHistoryById(history_id);
    if (history) {
      res.status(200).send(history);
    } else {
      res.status(404).send("No matches were found");
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

router.post("/create", async (req, res, next) => {
  if (!req.body) res.send("The form is empty");

  try {
    const history = await postHistory(req.body);
    res.status(200).send(history);
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

router.put("/update/:history_id", async (req, res, next) => {
  const { history_id } = req.params;

  try {
    const history = await putHistory(history_id, req.body);
    if (history) {
      res.status(200).send(history);
    } else {
      res.status(404).send("No matches were found");
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

router.delete("/delete/:history_id", async (req, res, next) => {
  const { history_id } = req.params;

  try {
    const result = await deleteHistory(history_id);
    if (result) res.status(200).send(result);
    else {
      res.status(404).send("No matches were found");
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

router.put("/active/:history_id", async (req, res, next) => {
  const { history_id } = req.params;

  try {
    const result = await activeHistory(history_id);
    if (result) res.status(200).send(result);
    else {
      res.status(404).send("No matches were found");
    }
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
});

module.exports = router;
