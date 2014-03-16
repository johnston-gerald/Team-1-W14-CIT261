var listapp = (function() {
    return{
        searchList: function (){
            document.getElementById('search').innerHTML = "";
            var myform = document.createElement("form");
            var searchfield = document.createElement("input");
            searchfield.setAttribute('placeholder', 'Search');
            searchfield.setAttribute('id', 'SearchKey');
            var btn=document.createElement("button");
            var t=document.createTextNode("Search");
            btn.appendChild(t);
            btn.setAttribute('onclick', 'listapp.doSearchList()');
            myform.appendChild(searchfield);
            myform.appendChild(btn);
            document.getElementById('search').appendChild(myform);
        },
        doSearchList: function(){
            // Search function will return the name and value from localstorage.
            var keyword = document.getElementById("SearchKey");
            
            searchList(keyword);
            
            function searchList(keyword) {
                keyword = keyword.toLowerCase();
                var i;
                for (i = 0; i < localStorage.length; i++){
                    var name = localStorage.key(i);
                    var value = localStorage.getItem(name);
                    value = value.toLowerCase();
                    var regexp = new RegExp(keyword, "gi");
                    var mysearch = value.search(regexp);
                    if (mysearch !== -1){
                        return i + " " + name + " " + value;
                    }
                }

            }
 
        },
        addList: function(){
            var list_name = document.createElement("input");
            list_name.setAttribute('type', 'text');

            var accept_button = document.createElement('span');
            accept_button.setAttribute('class', 'glyphicon glyphicon-ok');
            accept_button.setAttribute('onclick', 'listapp.saveNewList(this.parentElement.children[0].value)');

            var cancel_button = document.createElement('span');
            cancel_button.setAttribute('class', 'glyphicon glyphicon-remove');
            cancel_button.setAttribute('onclick', 'this.parentElement.remove()');

            var list = document.createElement("li");
            list.appendChild(list_name);
            list.appendChild(accept_button);
            list.appendChild(cancel_button);

            if(document.getElementById('lists').firstChild.firstChild){
                var sibling = document.getElementById('lists').firstChild.firstChild;
                var parentDiv = sibling.parentNode;
                parentDiv.insertBefore(list, sibling);
            } else {
                document.getElementById('lists').firstChild.appendChild(list);
            }
        },
        saveNewList: function(list_name){
            var data = '';
            if(list_name){
                data += 'list_name='+ list_name + '&user_id='+localStorage.id;
                var request = this.ajaxRequest('POST', 'php/new_list.php', data);
                request.onreadystatechange = function(){
                    if (request.readyState==4 && request.status==200) {
                        listapp.getLists();
                    }
                }
            }
        },
        delete_list: function (list_id){
            data = 'list_id='+list_id;
            var request = this.ajaxRequest('POST', 'php/delete_list.php', data);
            request.onreadystatechange = function(){
                if (request.readyState==4 && request.status==200) {
                    listapp.getLists();
                }
            }
        },
        show_rename_list: function (list_id){
            //Get Old list
            list_input = document.querySelector('[data-list-id="'+list_id+'"]');

            var list_name = document.createElement("input");
            list_name.setAttribute('type', 'text');
            list_name.setAttribute('value', list_input.firstChild.innerText);

            var accept_button = document.createElement('span');
            accept_button.setAttribute('class', 'glyphicon glyphicon-ok');
            accept_button.setAttribute('onclick', 'listapp.rename_list('+list_id+', this.parentElement.firstChild.value)');

            var cancel_button = document.createElement('span');
            cancel_button.setAttribute('class', 'glyphicon glyphicon-remove');
            cancel_button.setAttribute('onclick', 'listapp.getLists()');

            var list = document.createElement("li");
            list.appendChild(list_name);
            list.appendChild(accept_button);
            list.appendChild(cancel_button);

            list_input.parentElement.insertBefore(list, list_input);

            list_name.focus();
            list_name.value = list_name.value;

            //Remove old list
            list_input.parentElement.removeChild(list_input);
        },
        rename_list: function(list_id, list_name){
            if(list_name){
                data = 'list_name='+ list_name + '&list_id='+list_id;
                var request = this.ajaxRequest('POST', 'php/rename_list.php', data);
                request.onreadystatechange = function(){
                    if (request.readyState==4 && request.status==200) {
                        listapp.getLists();
                    }
                }
            }
        },
        login: function (){
            var data = {};
            data.id = localStorage.id;
            data.user_name = localStorage.user_name;
            data.email = localStorage.email;
            var request = this.ajaxRequest('POST', 'php/get_user.php', data);

            request.onreadystatechange = function(){
                if (request.readyState==4 && request.status==200) {
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
        getLists: function (){
            while (document.getElementById('content').firstChild) {
                document.getElementById('content').removeChild(document.getElementById('content').firstChild);
            }
            // Add the contents of lists[] to #lists:
            var listDiv = document.createElement('div');
            listDiv.setAttribute('id', 'lists');

            //Get all lists
            var request = this.ajaxRequest('POST', 'php/get_lists.php', 'user_id='+localStorage.id);
            request.onreadystatechange = function(){
                if (request.readyState==4 && request.status==200) {
                    //create lists array and sort alphabetically by default
                    if(request.responseText.length){
                        var lists = JSON.parse(request.responseText);
                        listDiv.appendChild(listapp.makeUL(lists));
                    } else {
                        listDiv.appendChild(document.createElement('ul'));
                    }
                    document.getElementById('content').appendChild(listDiv);
                }
            }
        },
        makeUL: function(lists) {
            // Create the list element:
            lists.sort(function(a,b) {
                if(a[1] < b[1]) return -1;
                if(a[1] > b[1]) return 1;
                return 0;
            });
            var list = document.createElement('ul');

            for(var i = 0; i < lists.length; i++) {
                // Create the list item:
                var item = document.createElement('li');
                var href = document.createElement('a');
                var rename_list = document.createElement('span');
                var delete_list = document.createElement('span');

                item.setAttribute('data-list-id', lists[i][0]);

                // Set the contents:
                href.appendChild(document.createTextNode(lists[i][1]));

                // Set the URL and class
                href.setAttribute('href', '#'+lists[i][0]);
                href.setAttribute('class', 'list');

                rename_list.setAttribute('class', 'glyphicon glyphicon-pencil');
                rename_list.setAttribute('onclick', 'listapp.show_rename_list(this.parentElement.getAttribute("data-list-id"));');

                delete_list.setAttribute('class', 'glyphicon glyphicon-trash');
                delete_list.setAttribute('onclick', 'listapp.delete_list(this.parentElement.getAttribute("data-list-id"));');

                item.appendChild(href);
                item.appendChild(delete_list);
                item.appendChild(rename_list);

                // Add it to the list:
                list.appendChild(item);
            }

            // Return the list:
            return list;
        },
        ajaxRequest: function(method, url, data){
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open(method,url,true);
            xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            xmlhttp.send(data);
            return xmlhttp;
        }
    };
})();