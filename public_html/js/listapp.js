var listapp = (function() {
    return{
        searchList: function (){
            document.getElementById('search').style.height="5em";
            document.getElementById('search').style.margin="5px";
            document.getElementById('search').innerHTML = "";
            var myform = document.createElement("div");
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
            var keyword = document.getElementById("SearchKey").value;
            keyword = keyword.toLowerCase();
            var currentPage = "SearchItems";
            localStorage.setItem("currentPage", currentPage);

            jsonData = localStorage.alldata;
            var dataArray = new Array();
            var dataArray = JSON.parse(jsonData);
            console.log(dataArray);
            
            // dataArray.filter(function (person) { return dataArray.title == "sushi" });

            var resultlist = new Array();
            var i = 0;

            
            console.log(dataArray.length);
            for (i = 0; i < dataArray.length; i++){
                
                value = dataArray[i].title;
                value = value.toLowerCase();
                console.log(value + " = " + keyword);
                var regexp = new RegExp(keyword, "gi");
                if (regexp.test(value)){
                    var tmparray = new Array();
                    tmparray[0] =  dataArray[i].list_item_id;
                    tmparray[1] =  dataArray[i].title;
                    tmparray[2] =  "0";
                    tmparray[3] =  dataArray[i].status;
                    resultlist.push(tmparray);
                    console.log(tmparray);

                }       

            }
            console.log(resultlist);
            while (document.getElementById('content').firstChild) {
                document.getElementById('content').removeChild(document.getElementById('content').firstChild);
            }
            var listDiv = document.createElement('div');
            listDiv.setAttribute('id', 'lists');
            listDiv.appendChild(document.createElement('ul'));
            listDiv.appendChild(listapp.makeUL(resultlist));
            document.getElementById('content').appendChild(listDiv);           
 
        },
        addList: function(){
            if (localStorage.currentPage === "ListItems"){
                listapp.addListItem();
                return;
            }
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
        addListItem: function(){
            var list_item_name = document.createElement("input");
            list_item_name.setAttribute('type', 'text');

            var accept_button = document.createElement('span');
            accept_button.setAttribute('class', 'glyphicon glyphicon-ok');
            accept_button.setAttribute('onclick', 'listapp.saveNewListItem(this.parentElement.children[0].value)');

            var cancel_button = document.createElement('span');
            cancel_button.setAttribute('class', 'glyphicon glyphicon-remove');
            cancel_button.setAttribute('onclick', 'this.parentElement.remove()');

            var list_item = document.createElement("li");
            list_item.appendChild(list_item_name);
            list_item.appendChild(accept_button);
            list_item.appendChild(cancel_button);

            if(document.getElementById('lists').firstChild.firstChild){
                var sibling = document.getElementById('lists').firstChild.firstChild;
                var parentDiv = sibling.parentNode;
                parentDiv.insertBefore(list_item, sibling);
            } else {
                document.getElementById('lists').firstChild.appendChild(list_item);
            }
        },
        saveNewList: function(list_name){
            var data = '';
            if(list_name){
                data += 'list_name='+ list_name + '&user_id='+localStorage.id;
                var request = this.ajaxRequest('POST', 'php/new_list.php', data);
                request.onreadystatechange = function(){
                    if (request.readyState===4 && request.status===200) {
                        listapp.getLists();
                    }
                }
            }
        },
        saveNewListItem: function(list_item_name){
            var data = '';
            if(list_item_name){
                data += 'list_item_name=' + list_item_name + '&list_id=' + localStorage.currentListID;
                var request = this.ajaxRequest('POST', 'php/new_listitem.php', data);
                request.onreadystatechange = function(){
                    if (request.readyState===4 && request.status===200) {
                        listapp.getListItems(localStorage.currentListID);
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
        complete_itemitem: function(list_item_id){
            if(list_item_id){
                data = 'list_item_id='+ list_item_id;
                var request = this.ajaxRequest('POST', 'php/complete_listitem.php', data);
                request.onreadystatechange = function(){
                    if (request.readyState==4 && request.status==200) {
                        listapp.getListItems(localStorage.currentListID);
                    }
                }
            }
        },
        resetstatus_itemitem: function(list_item_id){
            if(list_item_id){
                data = 'list_item_id='+ list_item_id;
                var request = this.ajaxRequest('POST', 'php/resetstatus_listitem.php', data);
                request.onreadystatechange = function(){
                    if (request.readyState==4 && request.status==200) {
                        listapp.getListItems(localStorage.currentListID);
                    }
                }
            }
        },
        get_alldata: function (){
            var data = {};
            while (!localStorage.id){
                //sleep("500");
                
            }
            data.id = localStorage.id;                     
            var request = this.ajaxRequestjson('POST', 'php/get_alldata.php', data);
            request.onreadystatechange = function(){
                if (request.readyState===4 && request.status===200) {
                        localStorage.setItem("alldata", request.responseText);
                }
            };
        },
        login: function (){
            var data = {};
            data.id = localStorage.id;
            data.user_name = localStorage.user_name;
            data.email = localStorage.email;
                      
            var request = this.ajaxRequestjson('POST', 'php/get_user.php', data);

            request.onreadystatechange = function(){
                if (request.readyState===4 && request.status===200) {
                    listapp.get_alldata();

                }
            };
        },
        showMenu: function (){
            var request = this.ajaxRequest('GET', 'include/menu.html');
            request.onreadystatechange = function(){
                if (request.readyState===4 && request.status===200) {
                    document.getElementById("main-menu").innerHTML = request.responseText;
                }
            }
        },
        getLists: function (){
            var currentPage = "Lists";
            localStorage.setItem("currentPage", currentPage);
            if (localStorage.currentListID){
                localStorage.removeItem('currentListID');
            }
            while (document.getElementById('content').firstChild) {
                document.getElementById('content').removeChild(document.getElementById('content').firstChild);
            }
            // Add the contents of lists[] to #lists:
            var listDiv = document.createElement('div');
            listDiv.setAttribute('id', 'lists');

            //Get all lists
            var request = this.ajaxRequest('POST', 'php/get_lists.php', 'user_id='+localStorage.id);
            request.onreadystatechange = function(){
                if (request.readyState===4 && request.status===200) {
                    //create lists array and sort alphabetically by default
                    if(request.responseText.length){
                        var lists = JSON.parse(request.responseText);
                        localStorage.setItem("lists", request.responseText);
                        listDiv.appendChild(listapp.makeUL(lists));
                    } else {
                        listDiv.appendChild(document.createElement('ul'));
                    }
                    document.getElementById('content').appendChild(listDiv);
                }
            }
        },
        getListItems: function (list_id){
            var currentPage = "ListItems";
            localStorage.setItem("currentPage", currentPage);
            localStorage.setItem("currentListID", list_id);
            while (document.getElementById('content').firstChild) {
                document.getElementById('content').removeChild(document.getElementById('content').firstChild);
            }
            // Add the contents of lists[] to #lists:
            var listDiv = document.createElement('div');
            listDiv.setAttribute('id', 'lists');

            //Get all lists
            var request = this.ajaxRequest('POST', 'php/get_listitems.php', 'list_id='+list_id);
            request.onreadystatechange = function(){
                if (request.readyState===4 && request.status===200) {
                    //create lists array and sort alphabetically by default
                    if(request.responseText.length){
                        var lists = JSON.parse(request.responseText);
                        localStorage.setItem("listitems", request.responseText);
                        listDiv.appendChild(listapp.makeUL(lists));
                    } else {
                        listDiv.appendChild(document.createElement('ul'));
                    }
                    document.getElementById('content').appendChild(listDiv);
                }
            }
        },
        clear: function (){
            var content = document.getElementById("content");
            content.outerHTML = "";
            var search = document.getElementById("search");
            search.outerHTML = "";
            var menu = document.getElementById("main-menu");
            menu.outerHTML = "<h1>List App</h1>";           
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
                href.setAttribute('href', '#');
                if (localStorage.currentPage==="Lists"){
                    href.setAttribute('onclick', 'listapp.getListItems(\''+lists[i][0]+'\')');
                }
                href.setAttribute('id', 'Lists'+lists[i][0]);
                href.setAttribute('class', 'list');

                rename_list.setAttribute('class', 'glyphicon glyphicon-pencil');
                rename_list.setAttribute('onclick', 'listapp.show_rename_list(this.parentElement.getAttribute("data-list-id"));');

                delete_list.setAttribute('class', 'glyphicon glyphicon-trash');
                delete_list.setAttribute('onclick', 'listapp.delete_list(this.parentElement.getAttribute("data-list-id"));');
                

                item.appendChild(href);
                item.appendChild(delete_list);
                item.appendChild(rename_list);
                
                if ((localStorage.currentPage==="ListItems") || (localStorage.currentPage==="SearchItems")){
                    var checkbox = document.createElement('INPUT');
                    checkbox.setAttribute('type', 'checkbox');
                    checkbox.setAttribute('class', 'completeBox');
                    if (lists[i][3]==="Completed"){
                        checkbox.setAttribute('checked', 'checked');
                        checkbox.setAttribute('onclick', 'listapp.resetstatus_itemitem(this.parentElement.getAttribute("data-list-id"));');
                    }else{
                        checkbox.setAttribute('onclick', 'listapp.complete_itemitem(this.parentElement.getAttribute("data-list-id"));');
                    }
                    item.appendChild(checkbox);
                }

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
        },
        ajaxRequestjson: function(method, url, data){
            myData = JSON.stringify(data);
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open(method,url,true);
            xmlhttp.setRequestHeader("Content-Type", "application/json");
            xmlhttp.send(myData);
            return xmlhttp;
        }
    };
})();


function sleep(milliSeconds){
var startTime = new Date().getTime(); // get the current time
while (new Date().getTime() < startTime + milliSeconds); // hog cpu
}