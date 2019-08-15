const snoowrap = require("snoowrap");

// https://github.com/reddit-archive/reddit/wiki/OAuth2#application-only-oauth
const AppOnlyOAuth = (clientId) => {
  console.info("Requester refresh!");
  return new Promise((resolve, reject) => {
    let headers = new Headers();
    headers.append("Authorization", "Basic " + btoa(`${clientId}:`));
    headers.append("Content-Type", "application/x-www-form-urlencoded");

    let params = new URLSearchParams();
    params.append(
      "grant_type",
      "https://oauth.reddit.com/grants/installed_client"
    );
    params.append("device_id", "DO_NOT_TRACK_THIS_DEVICE");

    fetch("https://www.reddit.com/api/v1/access_token", {
      method: "POST",
      body: params,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${Buffer.from("f6izM-6-3NbhKQ:").toString(
          "base64"
        )}`,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.error) console.error(response.error);
        console.log(response);
        resolve(new snoowrap({ clientId, ...response }));
      })
      .catch((error) => reject(error));
  });
};

export default AppOnlyOAuth;