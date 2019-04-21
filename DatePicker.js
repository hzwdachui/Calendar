'use strict';
class DatePicker {
	
	constructor(id, callback) {
		this.id = id;
		this.callback = callback;
		this.weekName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
		this.months = ["January","February","March","April","May","June",
		"July","August","September","October","November","December"];
		this.month_normal = [31,28,31,30,31,30,31,31,30,31,30,31];
		this.month_olympic = [31,29,31,30,31,30,31,31,30,31,30,31];
	}
	
	render(date) {
		// argument consisting of a Date object
		// selects a particular month (the object can refer to any time within the month). 
		// When render is invoked it replaces the contents of the 
		// date picker's div with HTML that displays a small one-month calendar 
		var parent = document.getElementById(this.id);
		parent.appendChild(this.createCalendar(date));
	}
	
	createCalendar (date) {
		// 1. create a table and set attributes
		var table = document.createElement("table");
		table.setAttribute("id", "table");
		// 1.1 set content
		// I must add 'this' here, I don't know why 
		this.addHead(table, date); 
		let flag = {value : 0}; // check if there is row7;

		for(var i=1;i<8;i++){
			// row
			var _tr = table.insertRow(i);	
			for(var j=0;j<7;j++){
				// column
				var _td=_tr.insertCell(j);	
				if(i === 1){
					this.addWeek(j, _td);
				} else {
					this.addDay(i, j, date, _td, flag);
				}
			}
		}
		// if there isn't row7, delete it
		if(flag.value !== 1) {
			table.deleteRow(7);
			if(table.rows[6].cells[0].innerHTML === "1"){
				table.deleteRow(6);
			}
		}
		
		// 1.2 get container and append the table
		// we do it in render()
		// var container = document.getElementById("datepicker1");
		// container.appendChild(table);
		

		return table;
	}
	
	// 2. implement table content functions
	// 2.1 add head line
	addHead (table, date) {
		// month and year
		var head = table.createTHead();
		var headRow = head.insertRow(0);

		var leftArrowCell = headRow.insertCell(0);
		leftArrowCell.innerHTML = "<";
		leftArrowCell.setAttribute("id", "LeftArrow");
		
		var monthCell = headRow.insertCell(1);
		monthCell.innerHTML = this.months[date.getMonth()] + "   " + date.getFullYear();
		monthCell.colSpan = "5";

		var rightArrowCell = headRow.insertCell(2);
		rightArrowCell.innerHTML = ">";
		rightArrowCell.setAttribute("id", "RightArrow");
		
		// event handler.
		leftArrowCell.addEventListener("click", () => {
			table.remove();
			date.setMonth(date.getMonth() - 1);
			console.log(date);
			this.render(date);
		});

		rightArrowCell.addEventListener("click", () => {
			table.remove();
			date.setMonth(date.getMonth() + 1);
			console.log(date);	
			this.render(date);
		});
	}
	
	// 2.2 add week line
	addWeek(j, _td) {
		// var _tn = document.createTextNode(weekName[j]);
		var _tn = this.weekName[j];
		_td.innerHTML = _tn;
	}

	// 2.3 add day content
	addDay(i, j, date, _td, flag) {
		// row = i; col = j
		// _td is this cell 
		var my_year = date.getFullYear();
		var my_month = date.getMonth();
		var my_day = date.getDate();
		// calculate the start day of a month
		function dayStart(month, year) {
			var tmpDate = new Date(year, month, 1);
			return (tmpDate.getDay());
		}
		// calculate leap year
		var self = this; // cannot call this.month_normal in the daysMonth function
		function daysMonth(month, year) {
			var leap = (year%4===0 && year%100!==0 || year%400 ===0);
			if (leap) {
				return (self.month_olympic[month]);
			} else {
				return (self.month_normal[month]);
			}
		}
		var firstDay = dayStart(my_month, my_year); 
		var totalDay = daysMonth(my_month, my_year);
		var lastDate = new Date(date);
		lastDate.setMonth(lastDate.getMonth()-1);
		var nextDate = new Date(date);
		nextDate.setMonth(nextDate.getMonth()+1);
		var _tn;
		
		if(i === 2 && j < firstDay) {
			// last month
			_tn = daysMonth(lastDate.getMonth(), lastDate.getFullYear()) + (j-firstDay+1);
			_td.innerHTML = _tn;
			_td.setAttribute("id" , "other");
			// this.hintClick(_td, lastDate, _tn);
		} else if((i-2)*7+j-firstDay+1 <= totalDay){
			// date: (i-2)*7+j-firstDay+1
			_tn = (i-2)*7+j-firstDay+1;
			_td.setAttribute("id" , "this");
			_td.innerHTML = _tn;
			this.hintClick(_td, date,_tn);
			if(i === 7) {
				flag.value = 1;
			}
		} else {
			// next month
			if(flag.value === 1 || i < 7) {
				_td.setAttribute("id" , "other");
				_tn = (i-2)*7+j-firstDay+1-totalDay;
				_td.innerHTML = _tn;
				// this.hintClick(_td, nextDate, _tn);
			}
		}
	}

	hintClick(_td, date,_tn) {
		let property = {
			month: this.months[date.getMonth()],
			day: _tn,
			year: date.getFullYear()
		};
		_td.addEventListener("click", () => {
			this.callback(this.id, property);
		});
	}
}

