var listapp = (function() {
    return{
        searchList: function (){
            if(document.getElementById('search').style.visibility==="hidden"){
                document.getElementById('search').style.visibility="visible";
            }    
            else{
               document.getElementById('search').style.visibility="hidden"; 
            }
        },        
        doSearchList: function(){
            // Search function will return the name and value from localstorage.
            var keyword = document.getElementById("SearchKey").value;
            var currentPage = "SearchItems";
            localStorage.setItem("currentPage", currentPage);

            jsonData = localStorage.alldata;
            var dataArray = JSON.parse(jsonData);

            var resultlist = new Array();
            var i = 0;
            
            for (i = 0; i < dataArray.length; i++){
                
                value = dataArray[i].title;
                var regexp = new RegExp(keyword, "gi");
                if (regexp.test(value)){
                    var tmparray = new Array();
                    tmparray[0] =  dataArray[i].list_item_id;
                    tmparray[1] =  dataArray[i].title;
                    tmparray[2] =  "0";
                    tmparray[3] =  dataArray[i].status;
                    resultlist.push(tmparray);

                }       

            }
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

            list_name.focus();
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

            list_item_name.focus();
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
                };
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
        delete_list_item: function (list_item_id){
            data = 'list_item_id='+list_item_id;
            var request = this.ajaxRequest('POST', 'php/delete_list_item.php', data);
            request.onreadystatechange = function(){
                if (request.readyState==4 && request.status==200) {
                    listapp.getListItems(localStorage.currentListID);
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
        show_rename_list_item: function (list_item_id){
            //Get Old list
            list_item_input = document.querySelector('[data-list-item-id="'+list_item_id+'"]');

            var list_item_name = document.createElement("input");
            list_item_name.setAttribute('type', 'text');
            list_item_name.setAttribute('value', list_item_input.firstChild.innerText);

            var accept_button = document.createElement('span');
            accept_button.setAttribute('class', 'glyphicon glyphicon-ok');
            accept_button.setAttribute('onclick', 'listapp.rename_list_item('+list_item_id+', this.parentElement.firstChild.value)');

            var cancel_button = document.createElement('span');
            cancel_button.setAttribute('class', 'glyphicon glyphicon-remove');
            cancel_button.setAttribute('onclick', 'listapp.getListItems('+localStorage.currentListID+')');

            var list_item = document.createElement("li");
            list_item.appendChild(list_item_name);
            list_item.appendChild(accept_button);
            list_item.appendChild(cancel_button);

            list_item_input.parentElement.insertBefore(list_item, list_item_input);

            list_item_name.focus();
            list_item_name.value = list_item_name.value;

            //Remove old list
            list_item_input.parentElement.removeChild(list_item_input);
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
        rename_list_item: function(list_item_id, list_item_name){
            if(list_item_name){
                data = 'list_item_name='+ list_item_name + '&list_item_id='+list_item_id;
                var request = this.ajaxRequest('POST', 'php/rename_list_item.php', data);
                request.onreadystatechange = function(){
                    if (request.readyState==4 && request.status==200) {
                        listapp.getListItems(localStorage.currentListID);
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
                        if (localStorage.currentPage==="SearchItems"){
                            //listapp.doSearchList()
                        }else{
                            //listapp.getListItems(localStorage.currentListID);
                        }
                    }
                };
            }
        },
        resetstatus_itemitem: function(list_item_id){
            if(list_item_id){
                data = 'list_item_id='+ list_item_id;
                var request = this.ajaxRequest('POST', 'php/resetstatus_listitem.php', data);
                request.onreadystatechange = function(){
                        if (localStorage.currentPage==="SearchItems"){
                            //listapp.doSearchList()
                        }else{
                            //listapp.getListItems(localStorage.currentListID);
                        }
                };
            }
        },
        get_alldata: function (){
            var data = {};
            data.id = localStorage.id;                     
            var request = this.ajaxRequestJSON('POST', 'php/get_alldata.php', data);
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
                      
            var request = this.ajaxRequestJSON('POST', 'php/get_user.php', data);

            request.onreadystatechange = function(){
                if (request.readyState===4 && request.status===200) {
                    listapp.get_alldata();

                }
            };
        },
        showMenu: function (){
            var request = this.ajaxRequestJSON('GET', 'include/menu.html?cache='+new Date().getTime());
            request.onreadystatechange = function(){
                if (request.readyState===4 && request.status===200) {
                    document.getElementById("main-menu").innerHTML = "";
                    document.getElementById("main-menu").innerHTML = request.responseText;
                }
            }
        },
        showOptionsMenu: function (){
            if(document.getElementById('options-menu').style.height == '56px'){
                document.getElementById('options-menu').style.height = '0px';
                document.getElementById('credits').style.border = 'none';
                document.getElementById('logout').style.border = 'none';
                document.getElementById('options-menu').style.visibility = 'hidden';
            } else {
                document.getElementById('options-menu').style.height = '56px';
                document.getElementById('credits').style.border = 'solid 1px #CCC';
                document.getElementById('logout').style.border = 'solid 1px #CCC';
                document.getElementById('options-menu').style.visibility = 'visible';
            }
        },
        getLists: function (){
            var currentPage = "Lists";
            localStorage.setItem("currentPage", currentPage);
            document.getElementById('search').style.visibility="hidden";
            
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
            content.innerHTML = "<h1>List App</h1>";
            document.getElementById('search').style.visibility="hidden";
            var menu = document.getElementById("main-menu");
            menu.innerHTML = "";           
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
                rename_list.setAttribute('class', 'glyphicon glyphicon-pencil');

                var delete_list = document.createElement('span');
                delete_list.setAttribute('class', 'glyphicon glyphicon-trash');


                // Set the contents:
                href.appendChild(document.createTextNode(lists[i][1]));

                // Set the URL and class
                href.setAttribute('href', '#');
                if (localStorage.currentPage==="Lists"){
                    item.setAttribute('data-list-id', lists[i][0]);
                    href.setAttribute('onclick', 'listapp.getListItems(\''+lists[i][0]+'\')');
                    rename_list.setAttribute('onclick', 'listapp.show_rename_list(this.parentElement.getAttribute("data-list-id"));');
                    delete_list.setAttribute('onclick', 'listapp.delete_list(this.parentElement.getAttribute("data-list-id"));');
                }
                href.setAttribute('id', 'Lists'+lists[i][0]);
                href.setAttribute('class', 'list');

                item.appendChild(href);
                item.appendChild(delete_list);
                item.appendChild(rename_list);
                
                if ((localStorage.currentPage==="ListItems") || (localStorage.currentPage==="SearchItems")){
                    item.setAttribute('data-list-item-id', lists[i][0]);
                    rename_list.setAttribute('onclick', 'listapp.show_rename_list_item(this.parentElement.getAttribute("data-list-item-id"));');
                    delete_list.setAttribute('onclick', 'listapp.delete_list_item(this.parentElement.getAttribute("data-list-item-id"));');
                    var checkbox = document.createElement('INPUT');
                    checkbox.setAttribute('type', 'checkbox');
                    checkbox.setAttribute('class', 'completeBox');
                    if (lists[i][3]==="Completed"){
                        checkbox.setAttribute('checked', 'checked');
                        checkbox.setAttribute('onclick', 'listapp.resetstatus_itemitem(this.parentElement.getAttribute("data-list-item-id"));');
                    }else{
                        checkbox.setAttribute('onclick', 'listapp.complete_itemitem(this.parentElement.getAttribute("data-list-item-id"));');
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
        ajaxRequestJSON: function(method, url, data){
            myData = JSON.stringify(data);
            console.log(myData);
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open(method,url,true);
            xmlhttp.setRequestHeader("Content-Type", "application/json");
            xmlhttp.send(myData);
            return xmlhttp;
        }
    };
})();