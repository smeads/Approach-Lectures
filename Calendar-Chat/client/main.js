const calendarUrl = `http://slack-server.elasticbeanstalk.com/calendar/15`;
const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

// create week days table
createWeekdays = array => {
  array.forEach((day, i) => {
    $('#weekdays-container').append(`<div class="weekday" id=${i + 1}><h4>${day}</h4></div>`);
  });
}

let count = 0;

class Calendar {
  constructor(schedule) {
    this.schedule = schedule;
    this.dates = Object.keys(schedule);
    this.weeks = [];
    this.addWeek = number => {
      const week = new Week(number);
      this.weeks.push(week);
    }
  }
}

// Set Weeks
Calendar.prototype.setWeeks = function() {
  // loops through dates array
  for (let i = 0; i < this.dates.length; i += 1) {
    // use moment.js to compare date's week number
    if (moment(Date.parse(this.dates[i])).week() !== moment(Date.parse(this.dates[i + 1])).week()) {
      // call addWeek passing in the date
      this.addWeek(moment(Date.parse(this.dates[i])).week());
    }
  }
}

// Set Days
Calendar.prototype.setDays = function() {
  // loop through weeks array
  for (let i = 0; i < this.weeks.length - 1; i += 1) {
  // loop 7 times to add 7 days to each week
    for (let j = 1; j <= 7; j += 1) {
      // pass in j as number
      this.weeks[i].addDay(j);
    }
  }
}

// Set Events
Calendar.prototype.setEvents = function() {
  for (let i = 0; i < this.weeks.length - 1; i += 1) {
    for (let j = 0; j < this.dates.length; j += 1) {
      if (moment(Date.parse(this.dates[j])).week() === this.weeks[i].weeknumber) {
        for (let k = 0; k <= 6; k += 1) {
          if (moment(Date.parse(this.dates[j])).day() === this.weeks[i].days[k].number) {
            for (let event of this.schedule[this.dates[j]]) {
              // pass in event object
              this.weeks[i].days[k].addEvent(event);
            }
          }
        }
      }
    }
  }
}

// display events on weekdays
Calendar.prototype.displayEvents = function(num) {
  let days = this.weeks[num].days;

  for (let i = 0; i < days.length; i += 1) {
    if (days[i].events.length === 0) {
      $(`#${i + 1}`).append(`<p class="events">No Scheduled Events</p>`);
    } else {
      for (let j = 0; j < days[i].events.length; j += 1) {
        $(`#${i + 1}`).append(`<p class="events">${days[i].events[j].summary }</p>`);
      }

    }
  }
}

class Event {
  constructor(data) {
    this.summary = data.summary;
    this.start = data.start;
    this.end = data.end;
    this.description = data.description;
  }
}

class Day {
  constructor(number) {
    this.number = number;
    this.events = [];
    this.addEvent = (eventData) => {
      this.events.push(new Event(eventData));
    }
  }
}

class Week {
  constructor(weeknumber) {
    this.weeknumber = weeknumber;
    this.days = [];
    this.addDay = (number) => {
      const day = new Day(number);
      this.days.push(day);
    }
  }
}

// previous week button
$('#prev-btn').on('click', (event) => {
  event.preventDefault();
  if ($('.events')) {
    $('.events').remove();
  }
  count -= 1;
  getSchedule(calendarUrl, count);
});

// next week button
$('#next-btn').on('click', (event) => {
  event.preventDefault();
  if ($('.events')) {
    $('.events').remove();
  }
  count += 1;
  getSchedule(calendarUrl, count);
});

// AJAX get request for getting schedule
getSchedule = (url, num) => {
  $.ajax({
    type: 'GET',
    url: url,
    dataType: 'json',
    success: data => {
      let calendar = new Calendar(data);
      calendar.setWeeks();
      calendar.setDays();
      calendar.setEvents();
      calendar.displayEvents(num);
      console.log(calendar.weeks);
    },
    error: error => {
      console.log(error);
    }
  });
}

$(document).on('ready', () => {
  const title = $('<h1>').text('Codesmith Calendar');
  $('#main-header').append(title);

  createWeekdays(weekdays);
  getSchedule(calendarUrl, count);
});
