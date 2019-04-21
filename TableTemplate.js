'use strict';
// used in cs142-template-processor.js
// the header is a td(row) of table
// we should fill in the new table in <p><\p> tag 
// visit the table by id("table1" and "table2")
// table[index] is the same as table.rows.item(item)

class TableTemplate {    
    static fillIn(id, dictionary, columnName) {
        // extract content of table
        var table = document.getElementById(id);
        var rows = table.rows;
        var columnNameRow = rows[0];
        
        // replace columnName of a certain table
        var processor;
        processor = new Cs142TemplateProcessor(columnNameRow.innerHTML);
        columnNameRow.innerHTML = processor.fillIn(dictionary);
        
        // get index of column which should be modified in array col
        var col = new Array(columnNameRow.cells.length);
        if(!columnName) {
            for(let i=0; i<columnNameRow.cells.length; i++) { 
                col[i] = 1;
            }
        } else {
            for(let i=0; i<columnNameRow.cells.length; i++) {
                if(columnNameRow.cells[i].innerHTML === columnName) {
                    col[i] = 1;
                }
            }
        }
        
        //console.log(col);

        // replace cell content, where col[index] === 1
        for (let i=1; i<table.rows.length; i++) {
            // for each row, modify the selected column
            var row = rows[i];
            for(let j=0; j<col.length; j++) {
                if(col[j] === 1) {
                    var cell = row.cells[j];
                    processor = new Cs142TemplateProcessor(cell.innerHTML);
                    cell.innerHTML = processor.fillIn(dictionary);
                }
            }
        }

        // change hidden to be visible
        if (table.style.visibility === 'hidden') {
            table.style.visibility = 'visible';
        }    
    }
}