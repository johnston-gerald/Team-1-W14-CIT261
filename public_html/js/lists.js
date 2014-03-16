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
        var rename_list = document.createElement('span');
        var delete_list = document.createElement('span');

        // Set the contents:
        href.appendChild(document.createTextNode(array[i]));

        // Set the URL and class
        href.setAttribute('href', '#');
        href.setAttribute('class', 'list');
        rename_list.setAttribute('class', 'glyphicon glyphicon-chevron-pencil');
        delete_list.setAttribute('class', 'glyphicon glyphicon-chevron-trash');
        item.appendChild(href);
        item.appendChild(rename_list);
        item.appendChild(delete_list);

        // Add it to the list:
        list.appendChild(item);
    }

    // Return the list:
    return list;
}
// Add the contents of lists[] to #lists:
document.getElementById('lists').appendChild(makeUL(lists));

console.log(makeUL(lists));