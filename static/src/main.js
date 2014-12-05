(function() {
  var endTagRegex = /\s|\/?&gt;/

  var fetchPage = function(url) {
    // call server to fetch page html
    $.ajax('http://localhost:4242/fetch?url=' + url).success(function(data) {
      var html = data.html;
      var lines = html.split('\n');
      var wrappedLines = [];
      for (var i = 0; i < lines.length; ++i) {
        var line = lines[i];
        var trimmedLine = line.trim();
        if (trimmedLine.indexOf('&lt;') === 0) {
          var startIndex = trimmedLine && trimmedLine[4] === '/' ? 5 : 4;
          // the tag could have a space after it or it could be something like <title> or <br/>
          var endIndex = trimmedLine.search(endTagRegex);
          wrappedLines.push('<span class="' + trimmedLine.substring(startIndex, endIndex) + '">' + line + '</span>');
        } else {
          wrappedLines.push(line);
        }
      }
      $('#markup').html(wrappedLines.join('\n'));
    })
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

