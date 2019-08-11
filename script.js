var years = {
  "2019": 2,
  "2020": 3,
  "2021": 4
};

var months_config = [
  { month: "january", days: 31, tag: 'TAG_JANUARY' },
  { month: "february", days: 28, tag: 'TAG_FEBRUARY' },
  { month: "march", days: 31, tag: 'TAG_MARCH' },
  { month: "april", days: 30, tag: 'TAG_APRIL' },
  { month: "may", days: 31, tag: 'TAG_MAY' },
  { month: "june", days: 30, tag: 'TAG_JUNE' },
  { month: "july", days: 31, tag: 'TAG_JULY' },
  { month: "august", days: 31, tag: 'TAG_AUGUST' },
  { month: "september", days: 30, tag: 'TAG_SEPTEMBER' },
  { month: "october", days: 31, tag: 'TAG_OCTOBER' },
  { month: "november", days: 30, tag: 'TAG_NOVEMBER'},
  { month: "december", days: 31, tag: 'TAG_DECEMBER' }
];

var user_data = {
  2019 : {
    
  }
}

var SetupUserData = (function(){
  var data = {};
  
  var getFromLocalStorage = function(){
    
  };
  
  var buildNewData = function(){
    [].forEach.call(months_config, function(month){
      user_data[2019][month.month] = {};
      for(var i = 1; i <= month.days; i++){
        user_data[2019][month.month][i] = {
          tasks: {
            a: {
              label: 'Task A',
              hours: 0
            },
            b: {
              label: 'Task B',
              hours: 0
            },
            c: {
             label: 'Task C',
             hours: 0
            },
            d: {
              label: 'Task D',
              hours: 0
            }
          }
        };
      }
    });
  };
  
  var init = function(){
    
    if(localStorage.getItem('user_data')){
      user_data = JSON.parse(localStorage.getItem('user_data'));

    } else {
      buildNewData();
    }
    
  };
  
  return {
    init: init
  }
  
})();




var MonthBrowser = (function(){
  var container = document.getElementById('month-browser-container');
  var init = function(){
    var html = [];
    [].forEach.call(months_config, function(month, index){
      html.push('<button data-type="browser-month" data-month="' + index + '">' + month.tag + '</button>');
    });
    
    container.innerHTML = html.join('');
  };
  return{
    init: init
  };
})();

MonthBrowser.init();



var CalanderBuilder = (function() {
  var calander_container = document.getElementById('calander');

  
  
  var buildTasks = function(tasks){
    var html = [];
    for (var task in tasks) {
      if (tasks.hasOwnProperty(task)) {
        html.push([
          '<div class="task-container">',
            '<label for="a">'+tasks[task].label+'</label>',
            '<input type="number" data-task-id="'+task+'" min="0" max="8" step="0.25" value="' + tasks[task].hours + '">',
          '</div>'
        ].join(''))
      }
    }
    return html.join('');
  };
  
  var buildDate = function(day, month, year) {
    
    var tasks = user_data[year][month][day + 1]['tasks'];

    var total_hours;
    if(user_data[year][month][day + 1]['total_hours']){
      total_hours = user_data[year][month][day + 1]['total_hours'];
    } else {
      total_hours = 0;
    }
    

    var html = [
      '<td data-day="'+ (day + 1) +'" data-month="'+ month +'" data-year="'+ year +'" data-hours="'+total_hours+'">', 
        '<span data-type="date">' + (day + 1) + '</span>',
        '<span data-type="total-hours" >' + total_hours + '</span>',
        buildTasks(tasks),
      '</td>'
    ];
    return html.join("");
  };

  var buildMonthTitle = function(month, year) {
    html = [
      '<thead>',
        "<tr>",
          '<td colspan="7">' + month + " " + year + "</td>",
        "</td>",
        "<tr>",
          "<td>Sunday</td>",
          "<td>Monday</td>",
          "<td>Tuesday</td>",
          "<td>Wednesday</td>",
          "<td>Thurday</td>",
          "<td>Friday</td>",
          "<td>Saturday</td>",
        "</tr>",
      '<thead>'
    ];

    return html.join("");
  };


  var buildMonth = function(month, year) {
    var html = [];
    var first_day_of_month = dayOfWeek(month.month + ' 1' + ', ' + year);
    
    // Month, Year - Table Title
    html.push( buildMonthTitle(month.month, year) );
    
    var bool_day = false;
    var row_index = first_day_of_month;
    
    // Adds Every 7 Days into a Group.
    for (var i = 0; i < month.days; i++) {
      
      if(row_index % 7 === 0){
        html.push('<tr>');
      }
      
      // Empty Days In Front of The First of Month
      if(!bool_day){
        for(var j = 0; j < first_day_of_month; j++){
          html.push('<td></td>');
        }
      }
      
      // Day Cells
      html.push( buildDate(i, month.month, year) );
      
      
      if(row_index % 7 === 6){
        html.push('</tr>');
      }
      
      bool_day = true;
      row_index = row_index + 1;
    }
    
    
    calander_container.innerHTML = html.join("");
  };
  
  var dayOfWeek = function(date_string){
    var dt = new Date(date_string);
    return dt.getDay();
  };

  var init = function(month, year) {
    buildMonth(months_config[month], year);
  };
  return {
    init: init
  };
})();


SetupUserData.init();
CalanderBuilder.init(1, "2019");




var totalHoursDays = function(tasks){
  var sum = 0;
  for(var task in tasks){
    sum = sum + tasks[task].hours;
  }
  
  return sum;
};

document.getElementsByTagName('body')[0].addEventListener('click', function(e){
  
  
  // IF Task Hours
  if(e.target.nodeName === 'INPUT' && e.target.hasAttribute('data-task-id') ){
    var task = e.target;
    var date = e.target.parentNode.parentNode;
    var day = date.getAttribute('data-day');
    var month = date.getAttribute('data-month');
    var year = date.getAttribute('data-year');
    
    var total_hours_display = date.querySelector('[data-type="total-hours"]');

    var total_hours_day = totalHoursDays(user_data[year][month][day]['tasks']);

    if(total_hours_day <= 8){
      
      user_data[year][month][day]['tasks'][task.getAttribute('data-task-id')]['hours'] = parseFloat(task.value);
      
      
      
      
      user_data[year][month][day]['total_hours'] = total_hours_day;
      
      date.setAttribute('data-hours', total_hours_day);
      total_hours_display.innerHTML = total_hours_day;
      
      localStorage.setItem('user_data', JSON.stringify(user_data) );
    } else {
      task.value = user_data[year][month][day]['tasks'][task.getAttribute('data-task-id')]['hours'];
    }
  }
  
  if(e.target.nodeName === 'BUTTON' && e.target.getAttribute('data-type') === 'browser-month'){
    var button = e.target;
    var month = button.getAttribute('data-month');
    var year = button.parentNode.getAttribute('data-year');
    
    CalanderBuilder.init(month, year);
  }
  
  
});


//localStorage.removeItem('user_data');