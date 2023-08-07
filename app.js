var accessToken = getHashValue("access_token");
var user = null;
var client;
function getHashValue(key) {
  matches = location.hash.match(new RegExp(key + "=([^&]*)"));
  return matches ? matches[1] : null;
}
function generateCreateSubscriptionObject(type, version, id) {
  return {
    type,
    version,
    condition: {
      broadcaster_user_id: "636874779",
    },
    transport: {
      method: "websocket",
      session_id: id,
    },
  };
}
async function createEventSubSubscription(
  clientId,
  accessToken,
  type,
  version,
  id,
) {
  return await fetch("https://api.twitch.tv/helix/eventsub/subscriptions", {
    method: "POST",
    headers: {
      "Client-ID": clientId,
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(generateCreateSubscriptionObject(type, version, id)),
  }).then(async (res) => {
    if (res.status != 202) {
      console.log(await res.json());
    }
  });
}
async function connectAndStartOverlay() {
  client = new WebSocket("wss://eventsub.wss.twitch.tv/ws");
  client.onopen = (event) => {
    console.log("EventSub Connection established!");
  };
  client.onmessage = async (event) => {
    let data = JSON.parse(event.data);
    if (data.metadata?.message_type == "session_welcome") {
      let id = data.payload.session.id;
      console.log(`ID: ${id}`);
      // https://dev.twitch.tv/docs/api/reference/#create-eventsub-subscription
      await createEventSubSubscription(
        "zfn1oby6tb4zse68tdtg9ekj4g3c1l",
        accessToken,
        "channel.poll.begin",
        "1",
        id,
      );
      await createEventSubSubscription(
        "zfn1oby6tb4zse68tdtg9ekj4g3c1l",
        accessToken,
        "channel.poll.progress",
        "1",
        id,
      );
      await createEventSubSubscription(
        "zfn1oby6tb4zse68tdtg9ekj4g3c1l",
        accessToken,
        "channel.poll.end",
        "1",
        id,
      );
      await createEventSubSubscription(
        "zfn1oby6tb4zse68tdtg9ekj4g3c1l",
        accessToken,
        "channel.prediction.begin",
        "1",
        id,
      );
      await createEventSubSubscription(
        "zfn1oby6tb4zse68tdtg9ekj4g3c1l",
        accessToken,
        "channel.prediction.progress",
        "1",
        id,
      );
      await createEventSubSubscription(
        "zfn1oby6tb4zse68tdtg9ekj4g3c1l",
        accessToken,
        "channel.prediction.lock",
        "1",
        id,
      );
      await createEventSubSubscription(
        "zfn1oby6tb4zse68tdtg9ekj4g3c1l",
        accessToken,
        "channel.prediction.end",
        "1",
        id,
      );
    }
    if (data.subscription?.type == "channel.poll.begin") {
      console.log("TODO: Show Poll Overlay");
      console.log(`Title: ${data.event.title}`);
      for (let i = 0; i < data.event.choices.length; i++) {
        console.log(`Choice ${i + 1}: ${data.event.choices[i].title}`);
      }
      console.log(
        `Bits Voting: ${data.event.bits_voting.amount_per_vote} (Enabled: ${data.event.bits_voting.is_enabled})`,
      );
      console.log(
        `Channel Points Voting: ${data.event.channel_points_voting.amount_per_vote} (Enabled: ${data.event.channel_points_voting.is_enabled})`,
      );
      console.log(
        `Started At: ${data.event.started_at} / Ends At: ${data.event.ends_at}`,
      );
    }
    if (data.subscription?.type == "channel.poll.progress") {
      console.log("TODO: Update Poll Overlay");
      console.log(`Title: ${data.event.title}`);
      for (let i = 0; i < data.event.choices.length; i++) {
        console.log(
          `Choice ${i + 1}: ${data.event.choices[i].title} - ${
            data.event.choices[i].bits_votes
          } - ${data.event.choices[i].channel_points_votes} - ${
            data.event.choices[i].votes
          }`,
        );
      }
      console.log(
        `Bits Voting: ${data.event.bits_voting.amount_per_vote} (Enabled: ${data.event.bits_voting.is_enabled})`,
      );
      console.log(
        `Channel Points Voting: ${data.event.channel_points_voting.amount_per_vote} (Enabled: ${data.event.channel_points_voting.is_enabled})`,
      );
      console.log(
        `Started At: ${data.event.started_at} / Ends At: ${data.event.ends_at}`,
      );
    }
    if (data.subscription?.type == "channel.poll.end") {
      console.log("TODO: Hide Poll Overlay");
      console.log(`Title: ${data.event.title}`);
      for (let i = 0; i < data.event.choices.length; i++) {
        console.log(
          `Choice ${i + 1}: ${data.event.choices[i].title} - ${
            data.event.choices[i].bits_votes
          } - ${data.event.choices[i].channel_points_votes} - ${
            data.event.choices[i].votes
          }`,
        );
      }
      console.log(
        `Bits Voting: ${data.event.bits_voting.amount_per_vote} (Enabled: ${data.event.bits_voting.is_enabled})`,
      );
      console.log(
        `Channel Points Voting: ${data.event.channel_points_voting.amount_per_vote} (Enabled: ${data.event.channel_points_voting.is_enabled})`,
      );
      console.log(
        `Started At: ${data.event.started_at} / Ends At: ${data.event.ends_at}`,
      );
    }
    if (data.subscription?.type == "channel.prediction.begin") {
      console.log("TODO: Show Prediciton Overlay");
      console.log(`Title: ${data.event.title}`);
      for (let i = 0; i < data.event.outcomes.length; i++) {
        console.log(
          `Outcome ${i + 1}: ${data.event.outcomes[i].title} - ${
            data.event.outcomes[i].color
          }`,
        );
      }
      console.log(
        `Started At: ${data.event.started_at} / Locks At: ${data.event.locks_at}`,
      );
    }
    if (data.subscription?.type == "channel.prediction.progress") {
      console.log("TODO: Update Prediction Overlay");
      console.log(`Title: ${data.event.title}`);
      for (let i = 0; i < data.event.outcomes.length; i++) {
        console.log(
          `Outcome ${i + 1}: ${data.event.outcomes[i].title} - ${
            data.event.outcomes[i].color
          } - ${data.event.outcomes[i].users} - ${
            data.event.outcomes[i].channel_points
          }`,
        );
        for (
          let j = 0;
          j < event.data.event.outcomes[i].top_predictors.length;
          j++
        ) {
          console.log(
            `Top Predictor ${j + 1}: ${
              data.event.outcomes[i].top_predictors[j].user_name
            } - ${
              data.event.outcomes[i].top_predictors[j].channel_points_used
            }`,
          );
        }
      }
      console.log(
        `Started At: ${data.event.started_at} / Locks At: ${data.event.locks_at}`,
      );
    }
    if (data.subscription?.type == "channel.prediction.lock") {
      console.log("TODO: Lock Prediction Overlay");
      console.log(`Title: ${data.event.title}`);
      for (let i = 0; i < data.event.outcomes.length; i++) {
        console.log(
          `Outcome ${i + 1}: ${data.event.outcomes[i].title} - ${
            data.event.outcomes[i].color
          } - ${data.event.outcomes[i].users} - ${
            data.event.outcomes[i].channel_points
          }`,
        );
        for (
          let j = 0;
          j < event.data.event.outcomes[i].top_predictors.length;
          j++
        ) {
          console.log(
            `Top Predictor ${j + 1}: ${
              data.event.outcomes[i].top_predictors[j].user_name
            } - ${
              data.event.outcomes[i].top_predictors[j].channel_points_used
            }`,
          );
        }
      }
      console.log(
        `Started At: ${data.event.started_at} / Locked At: ${data.event.locked_at}`,
      );
    }
    if (data.subscription?.type == "channel.prediction.end") {
      console.log("TODO: Hide Prediction Overlay");
      console.log(`Title: ${data.event.title}`);
      for (let i = 0; i < data.event.outcomes.length; i++) {
        console.log(
          `Outcome ${i + 1}: ${data.event.outcomes[i].title} - ${
            data.event.outcomes[i].color
          } - ${data.event.outcomes[i].users} - ${
            data.event.outcomes[i].channel_points
          }`,
        );
        for (
          let j = 0;
          j < event.data.event.outcomes[i].top_predictors.length;
          j++
        ) {
          console.log(
            `Top Predictor ${j + 1}: ${
              data.event.outcomes[i].top_predictors[j].user_name
            } - ${
              data.event.outcomes[i].top_predictors[j].channel_points_used
            }`,
          );
        }
      }
      console.log(`Status: ${data.event.status}`);
      console.log(
        `Started At: ${data.event.started_at} / Ended At: ${data.event.ended_at}`,
      );
    }
  };
}
if (window.accessToken) {
  connectAndStartOverlay();
}
