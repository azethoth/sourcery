(function() {
  var fetchPage = function(url) {
    // call server to fetch page html
  };

  $(function() {
    // handle enter key being pressed and trigger ajax request
    $('#url').keyup(function(event) {
      if (event.keyCode == '13') {
        var url = $(event.currentTarget).val() || '';
        fetchPage(url);
      }
    });
  })
})()

