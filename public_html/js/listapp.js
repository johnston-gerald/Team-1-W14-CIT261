var listapp = (function() {
    return{
        addList: function(){
            var textfield = document.createElement("input");
            var list = document.createElement("li");
            list.appendChild(textfield);
            document.getElementById('lists-container').appendChild(list);
        },
        login: function (){
            var data = {};
            data.id = localStorage.id;
            data.user_name = localStorage.user_name;
            data.email = localStorage.email;
            console.log(data);
            console.log(localStorage);
            var request = this.ajaxRequest('POST', 'php/get_user.php', data);

            request.onreadystatechange = function(){
                if (request.readyState==4 && request.status==200) {
                    //localStorage.lists = request.reponseText.lists;
                }
            }
        },
        showMenu: function (){
            var request = this.ajaxRequest('GET', 'include/menu.html');
            request.onreadystatechange = function(){
                if (request.readyState==4 && request.status==200) {
                    document.getElementById("main-menu").innerHTML = request.responseText;
                }
            }
        },
        showLists: function (){
            
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

                    // Set the contents:
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

                // Return the list:
                return list;
            }
            // Add the contents of lists[] to #lists:
            document.getElementById('content').appendChild(makeUL(lists));

            for(i=0;i < localStorage.lists;i++){

            }
//            var request = this.ajaxRequest('GET', 'include/lists.html');
//            request.onreadystatechange = function(){
//                if (request.readyState==4 && request.status==200) {
//                    document.getElementById("content").innerHTML = request.responseText;
//                }
//            }
        },
        ajaxRequest: function(method, url, data){
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open(method,url,true);
            xmlhttp.send(data);
            return xmlhttp;
        }
    };
})();