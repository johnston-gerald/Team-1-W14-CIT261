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
            for(i=0;i < localStorage.lists;i++){

            }
            var request = this.ajaxRequest('GET', 'include/lists.html');
            request.onreadystatechange = function(){
                if (request.readyState==4 && request.status==200) {
                    document.getElementById("content").innerHTML = request.responseText;
                }
            }
        },
        ajaxRequest: function(method, url, data){
            var xmlhttp = new XMLHttpRequest();
            xmlhttp.open(method,url,true);
            xmlhttp.send(data);
            return xmlhttp;
        }
    };
})();