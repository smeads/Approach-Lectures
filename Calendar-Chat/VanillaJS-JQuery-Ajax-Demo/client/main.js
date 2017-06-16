class Calendar {
  //do something with the data here
  constructor(schedule) {

  }
}

class Event {
  constructor(data) {
    this.startTime = data.startTime;
    this.endTime = data.endTime;
    this.description = data.description;
  }
}

class Day {
  constructor(name) {
    this.name = name;
    this.events = [];
    this.addEvent = (eventData) => {
      this.events.push(new Event(eventData));
    }
    this.orderEvents = () => {
      //go through events and sort them by start and end time
    }
  }
}

class Week {
  constructor(number) {
    this.days = [];
    this.addDay = (name) => {
      const day = new Day(name);
      this.days.push(day);
    }
  }
}

$(document).on('ready', () => {
  const title = $('<h1>').text('Social Calendar');
  $('body').append(title);
  console.log(title);

  // Make an AJAX request to the server, then do something with the result!
  const calendarUrl = `http://slack-server.elasticbeanstalk.com/calendar/15`;

  $.ajax({
    type: 'GET',
    url: calendarUrl,
    dataType: 'json',
    success: data => {
      // console.log(data);
    },
    error: error => {
      console.log(error);
    }
  })
});
