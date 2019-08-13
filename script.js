var TODAY = new Date();
var ACTIVE_YEAR = new Date();

var months_config = [
  { key: "jan", tag: 'TAG_JANUARY' },
  { key: "feb", tag: 'TAG_FEBRUARY' },
  { key: "mar", tag: 'TAG_MARCH' },
  { key: "apr", tag: 'TAG_APRIL' },
  { key: "may", tag: 'TAG_MAY' },
  { key: "jun", tag: 'TAG_JUNE' },
  { key: "jul", tag: 'TAG_JULY' },
  { key: "aug", tag: 'TAG_AUGUST' },
  { key: "sept", tag: 'TAG_SEPTEMBER' },
  { key: "oct", tag: 'TAG_OCTOBER' },
  { key: "nov", tag: 'TAG_NOVEMBER'},
  { key: "dec", tag: 'TAG_DECEMBER' }
];

var user_data = {}

var SetupUserData = (function(){
  var data = {};


  var buildNewMonth = function(year, month){
    var end_day = new Date(year, month + 1, 0).getDate();

      for(var i = 1; i <= end_day; i++){
        if(!user_data[year][months_config[month]['key']][i]){
          user_data[year][months_config[month]['key']][i] = {
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
      }
  };
  
  var buildNewYear = function(year){

    if(!user_data[year]){
      user_data[year] = {};
    }

    [].forEach.call(months_config, function(month, index){

      if(!user_data[year][month.key]){
        user_data[year][month.key] = {};
      }
      buildNewMonth(year, index);
    });
  };
  
  var init = function(year){
    
    if(localStorage.getItem('user_data')){
      user_data = JSON.parse(localStorage.getItem('user_data'));

    }

    buildNewYear(year);
    
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
            '<input type="number" data-task-id="'+task+'" min="0" max="8" step="1" value="' + tasks[task].hours + '">',
          '</div>'
        ].join(''))
      }
    }
    return html.join('');
  };
  
  var buildDate = function(day, month, year) {


    var day_of_week = new Date( month + '' + (day + 1) + ', ' + year ).getDay();

    
    var tasks = user_data[year][month][day + 1]['tasks'];

    var total_hours;
    if(user_data[year][month][day + 1]['total_hours']){
      total_hours = user_data[year][month][day + 1]['total_hours'];
    } else {
      total_hours = 0;
    }
    
    var today_class = '';
    if(day + 1 === TODAY.getDate()){
      today_class = 'date-cell-today';
    }

    var html = [
      '<td data-date="'+ (day + 1) +'" data-month="'+ month +'" data-year="'+ year +'" data-hours="'+total_hours+'" data-dayofweek="'+day_of_week+'" class="'+today_class+'">', 
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
          '<td colspan="7">' + months_config[month].key + " " + year + "</td>",
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
    var start_day = new Date(year, month, 1).getDay();
    var end_day = new Date(year, month + 1, 0).getDate();

    var bool_day = false;
    var row_index = start_day;

    // Month, Year - Table Title
    html.push( buildMonthTitle(month, year) );
    
    // Adds Every 7 Days into a Group.
    for (var i = 0; i < end_day; i++) {
      
      if(row_index % 7 === 0){
        html.push('<tr>');
      }
      
      // Empty Days In Front of The First of Month
      if(!bool_day){
        for(var j = 0; j < start_day; j++){
          html.push('<td></td>');
        }
      }
      
      // Day Cells
      html.push( buildDate(i, months_config[month].key, year) );
      
      
      if(row_index % 7 === 6){
        html.push('</tr>');
      }
      
      bool_day = true;
      row_index = row_index + 1;
    }
    
    
    calander_container.innerHTML = html.join("");
  };

  var init = function(month, year) {
    buildMonth(month, year);
  };
  return {
    init: init
  };
})();






SetupUserData.init(TODAY.getFullYear());
CalanderBuilder.init(TODAY.getMonth(), TODAY.getFullYear());








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
    var task_id = task.getAttribute('data-task-id');
    var date_cell = e.target.parentNode.parentNode;
    var date = date_cell.getAttribute('data-date');
    var month = date_cell.getAttribute('data-month');
    var year = date_cell.getAttribute('data-year');
    
    var total_hours_display = date_cell.querySelector('[data-type="total-hours"]');
    var total_hours_day = totalHoursDays(user_data[year][month][date]['tasks']);
    var new_total = (parseFloat(task.value) + total_hours_day);


    if( user_data[year][month][date]['tasks'][task_id]['hours'] <= 8){
        
      user_data[year][month][date]['tasks'][task_id]['hours'] = parseFloat(task.value);

      total_hours_day = totalHoursDays(user_data[year][month][date]['tasks']);
      
      
      user_data[year][month][date]['total_hours'] = total_hours_day;
      
      date_cell.setAttribute('data-hours', total_hours_day);
      total_hours_display.innerHTML = total_hours_day;
      
      localStorage.setItem('user_data', JSON.stringify(user_data) );
    } else {

      task.value = user_data[year][month][date]['tasks'][task.getAttribute('data-task-id')]['hours'];
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