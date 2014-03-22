function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

var message = "";

for (var i = 0; i <= 5000000000; i += 1){
   var j = i;
}
message = numberWithCommas(j);
postMessage(message);