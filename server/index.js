const express = require('express');
const bodyParser = require('body-parser');

const Orgs = require('../database/Org.js');
const Events = require('../database/Event.js');

const app = express();

const PORT = 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/event(/summary)?/:eventId', (req, res) => {
  const eventData = {
    title: '',
    org_name: '',
    org_private: false,
  };
  return Events.findOne({ eventId: req.params.eventId })
    .then((event) => {
      eventData.title = event.title;
      if (!/summary/.test(req.url)) {
        eventData.local_date_time = event.local_date_time;
      }
      return Orgs.findOne({ orgId: event.orgId }, 'org_name org_private');
    })
    .then((org) => {
      eventData.org_name = org.org_name;
      eventData.org_private = org.org_private;
      res.json(eventData);
    });
});

app.get('/event/org/members/:eventId', (req, res) => Events.findOne({ eventId: req.params.eventId })
  .then((event) => Orgs.findOne({ orgId: event.orgId }, 'members'))
  .then((org) => {
    res.json(org.members);
  }));

app.get('/event/timedate/:eventId', (req, res) => Events.findOne({ eventId: req.params.eventId })
  .then((event) => {
    const timedate = {
      local_date_time: event.local_date_time,
      description: event.series.description ? event.series.description : '',
    }
    res.json(timedate);
  }));

app.listen(PORT, () => {
  console.log(`Event module listening on port ${PORT}`);
});
