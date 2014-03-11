// Search function will return the name and value from localstorage.
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
