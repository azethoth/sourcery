(function() {
  var endTagRegex = /\s|\/?&gt;/

  // create the markup for the tag counts table
  var tagCountMarkup = function(tagCounts) {
    var counts = [];
    for (var tag in tagCounts) {
      if (tagCounts.hasOwnProperty(tag)) {
        var anchor = '<a href="javascript:void(0);" data-tag-type="' + tag + '">' + tag + '</a>';
        counts.push('<tr><td>' + anchor + '</td><td>' + tagCounts[tag] + '</td></tr>');
      }
    }
    return counts;
  }

  // handle clicks on the tags
  var handleTagClick = function(tag) {
    var content = $('#markup');
    // remove any existing highlighting
    content.find('.highlight').removeClass('highlight');

    content.find('.' + tag).addClass('highlight');
  };

  // fetch the markup from the server and render it
  var fetchPage = function(url) {
    $.ajax('https://peaceful-garden-3713.herokuapp.com/fetch?url=' + url).success(function(data) {
      // wrap each line in a <span> so we can style them
      var lines = data.lines;
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

      // remove any existing counts
      $('#counts tr[data-keep!="true"]').remove();

      // display the counts
      $('#counts tr:last').after(tagCountMarkup(data.tags));
    }).error(function() {
      alert('Sorry, we ran into an error');
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

    // handle clicks on the tags
    $('#counts').click(function(event) {
      var tag = $(event.target).data('tag-type');
      handleTagClick(tag);
    })
  })
})()

