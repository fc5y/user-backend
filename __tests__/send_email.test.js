const assert = require("assert");
const { createMessage, sendMail } = require("../utils/email-sender");

describe("Test sending email", function () {
  it("test sending email to backend email", function () {
    const message = createMessage(
      "Back end team <backend@freecontest.net>",
      "This is a test",
      "Unit test"
    );
    assert.equal(sendMail(message), true);
  });
});
