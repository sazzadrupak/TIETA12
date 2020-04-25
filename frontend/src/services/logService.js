import * as Sentry from "@sentry/browser";

function init() {
  Sentry.init({
    dsn: "https://76a6672aa8e942fca41be07c92a370c6@sentry.io/5188859",
  });
}

function log(error) {
  Sentry.withScope((scope) => {
    Sentry.captureException(error);
  });
}

export default {
  init,
  log,
};
