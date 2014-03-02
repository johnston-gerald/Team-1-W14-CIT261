//create lists array and sort alphabetically by default
var lists = [
    "Shopping",
    "To Do",
    "Homework",
    "Reminders",
    "Work"
].sort();
//lists.reverse() will sort in descending order

function makeUL(array) {
    // Create the list element:
    var list = document.createElement('ul');

    for(var i = 0; i < array.length; i++) {
        // Create the list item:
        var item = document.createElement('li');
        var href = document.createElement('a');
        var span = document.createElement('span');
        
        //item.appendChild('a href="#"');

        // Set its contents:
        href.appendChild(document.createTextNode(array[i]));
        
        // Set the URL and class
        href.setAttribute('href', '#');
        href.setAttribute('class', 'list');
        span.setAttribute('class', 'glyphicon glyphicon-chevron-right');
        item.appendChild(href);
        item.appendChild(span);
        
        // Add it to the list:
        list.appendChild(item);
    }

    // Finally, return the constructed list:
    return list;
}
// Add the contents of lists[] to #lists:
document.getElementById('lists').appendChild(makeUL(lists));