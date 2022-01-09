function getBathValue() {
    var uiBathrooms = document.getElementsByName("gridRadios_bathRoom");
    for(var i in uiBathrooms) {
      if(uiBathrooms[i].checked) {
          return parseInt(i)+1;
      }
    }
    return -1; // Invalid Value
  }
  
  function getBHKValue() {
    var uiBHK = document.getElementsByName("gridRadios");
    for(var i in uiBHK) {
      if(uiBHK[i].checked) {
          return parseInt(i)+1;
      }
    }
    return -1; // Invalid Value
  }
  
  function onClickedEstimatePrice() {
    console.log("Estimate price button clicked");
    var sqft = document.getElementById("uiSqft");
    var bhk = getBHKValue();
    var bathrooms = getBathValue();
    var location = document.getElementById("uiLocations");
    var estPrice = document.getElementById("uiEstimatedPrice");
  
    var url = "http://127.0.0.1:5000/predict_home_price"; //Use this if you are NOT using nginx which is first 7 tutorials
    // var url = "/api/predict_home_price"; // Use this if  you are using nginx. i.e tutorial 8 and onwards
  
    $.post(url, {
        total_sqft: parseFloat(sqft.value),
        bhk: bhk,
        bath: bathrooms,
        location: location.value
    },function(data, status) {
        console.log(data.estimated_price);
        estPrice.innerHTML = "<h2>" + (data.data_info[0]).toString() + " Tk</h2>";
        console.log(status);

        const bhk_lsit = data.data_info[1];
        const price_list = data.data_info[2];
        console.log(bhk_lsit);
        console.log(price_list);

      const mini_price = [];
      const maxi_price = [];
      const price_val = [];
      const x = 0;
      for(var i = 0; i < price_list.length; i++){
        // console.log(price_list[i]);
        mini_price.push(price_list[i][0]);
        maxi_price.push(price_list[i][1]);
        price_val.push(price_list[i][2]);
        
      }
      console.log(mini_price)
      console.log(maxi_price)
      console.log(mini_price)
      var min0 = mini_price[0];
      var min1 = mini_price[1];
      var min2 = mini_price[2];
      var min3 = mini_price[3];
      var min4 = mini_price[4];
      var min5 = mini_price[5];


      var max0 = maxi_price[0];
      var max1 = maxi_price[1];
      var max2 = maxi_price[2];
      var max3 = maxi_price[3];
      var max4 = maxi_price[4];
      var max5 = maxi_price[5];


      var prc0 = price_val[0];
      var prc1 = price_val[1];
      var prc2 = price_val[2];
      var prc3 = price_val[3];
      var prc4 = price_val[4];
      var prc5 = price_val[5];
      

        


      google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(drawChart);

      function drawChart() {

        var x1 = bhk_lsit[1];
        var x2 = bhk_lsit[2];
        var x3 = bhk_lsit[3];
        var x4 = bhk_lsit[4];
        var x5 = bhk_lsit[5];
        var data = google.visualization.arrayToDataTable([
          ['Bed Room', 'Percentage number'],
          ['BHK 1',     x1],
          ['BHK 2',      x2],
          ['BHK 3',  x3],
          ['BHK 4', x4],
          ['BHK 5',    x5]
        ]);

        var options = {
          title: 'Comaprison of Bed Number in ' + location.value
        };

        var chart = new google.visualization.PieChart(document.getElementById('piechart'));

        chart.draw(data, options);
      }


      google.charts.load("current", {'packages':['corechart']});
      google.charts.setOnLoadCallback(drawChart2);
      function drawChart2() {
        var data = google.visualization.arrayToDataTable([
          ["Element", "Density", { role: "style" } ],
          [parseInt(min0 / 100000) + "LK--" + parseInt(max0 / 100000) + "LK", prc0 , "#b87333"],
          [parseInt(min1 / 100000) + "LK--" + parseInt(max1 / 100000) + "LK", prc1 , "silver"],
          [parseInt(min2 / 100000) + "LK--" + parseInt(max2 / 100000) + "LK", prc2 , "#b87333"],
          [parseInt(min3 / 100000) + "LK--" + parseInt(max3 / 100000) + "LK", prc3 , "silver"],
          [parseInt(min4 / 100000) + "LK--" + parseInt(max4 / 100000) + "LK", prc4 , "#b87333"],
          [parseInt(min5 / 100000) + "LK--" + parseInt(max5 / 100000) + "LK", prc5 , "silver"],
          // ["Silver", 10.49, "silver"],
          // ["Gold", 19.30, "gold"],
          // ["Platinum", 21.45, "color: #e5e4e2"]
        ]);
  
        var view = new google.visualization.DataView(data);
  
        var options = {
          title: "Price comaparison in " + location.value,
          width: 800,
          height: 400,
          bar: {groupWidth: "90%"},
          legend: { position: "none" },
        };
        var chart = new google.visualization.ColumnChart(document.getElementById("columnchart_values"));
        chart.draw(view, options);
    }







    });

  }
  
  function onPageLoad() {
    console.log( "document loaded" );
    var url = "http://127.0.0.1:5000/get_location_names"; // Use this if you are NOT using nginx which is first 7 tutorials
    // var url = "/api/get_location_names"; // Use this if  you are using nginx. i.e tutorial 8 and onwards
    $.get(url,function(data, status) {
        console.log("got response for get_location_names request");
        if(data) {
            var locations = data.locations;
            var uiLocations = document.getElementById("uiLocations");
            $('#uiLocations').empty();
            for(var i in locations) {
                var opt = new Option(locations[i]);
                $('#uiLocations').append(opt);
            }
        }
    });
  }
  
  window.onload = onPageLoad;