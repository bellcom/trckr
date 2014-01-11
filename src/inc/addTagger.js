/**
 *  WTF!?!?!?
 */

$.fn.addTagger = function(mode, id){
  var number = id;
  var taggerId = '.addtagger';
  var inputId = '.input' + number;
  var lastfocus;

  this.addClass('input' + number);
  this.addClass('tagger-input');
  this.attr('data-inputid', number);
 
  if($('.addtagger').length == 0){
    $('body').append('<ul class="addtagger dropdown-menu" style="position: absolute; display:none; z-index: 3000;"></ul>');

    utils.get_clients(function(data){
      $.each(data, function(){
        $(taggerId).append('<li class="tagger-client"><a>' + this.name + '</a></li>');
      });
    });
    
    $('body').on('keyup', '.tagger-input', function(event){
      lastfocus = $('input:focus').data('inputid');
    });
      
    var searchTimeout = null;

    // Handle key input
    $('body').on('keyup', '.tagger-input', function(event){
      if($(this).hasClass('clientonly')){
        $(taggerId).show();

        var position = $(this).offset();
        $(taggerId).css("left", position.left);
        $(taggerId).css("top", position.top + 27);

        var val = $(this).val();

        $('.tagger-client').show();

        if(val){
          $('.tagger-client').each(function(){
            if($(this).text().toLowerCase().indexOf(val.toLowerCase()) === -1){
              $(this).hide();
            }
          });
        }
      } 
      else
      {
        var el = this;
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(function(){
            searchClient(el);
        }, 200);
      }
    });

    function searchClient(el){
      var val = $(el).val();
      var chr = val.slice(-1);
      var input_client = val.split('@');


      if(input_client[1]){
        $('.tagger-client').show();
        $('.tagger-client').each(function(){
          if($(this).text().toLowerCase().indexOf(input_client[1].toLowerCase()) === -1){
            $(this).hide();
            if($('.tagger-client:visible').length === 1){
              $('.tagger-client').removeClass('active');
              $('.tagger-client:visible').addClass('active');
            }

            if($('.tagger-client:visible').length === 0){
              $('.tagger-client').removeClass('active');
            }
          }
        });
      }

      if ( chr === '@' ) {
        var position = $(el).offset();
        $(taggerId).css("left", position.left);
        $(taggerId).css("top", position.top + 27);
      }

      if ( val.indexOf('@') === -1){
        $(taggerId).hide();
      }
      else {
        $(taggerId).show();
      }
    }

    // Function for handling client selection
    var selectClient = function(){
      var val = $('.input' + lastfocus).val();
      var input_client = val.split('@');
      
      if(input_client.length === 2 ){
        var text = input_client[0] + '@' + $('.tagger-client.active').text();
      }
      else {
        var text = $('.tagger-client.active').text();
      }

      // If no client is active, just let the text be.
      if(!$('.tagger-client.active').length){
        text = val;
      }
      $('.input' + lastfocus).val(text);

      $('.input' + lastfocus).focus();
    
      $('.input'+lastfocus).trigger('tagger:select', {id: lastfocus, text: text});
    }

      $('body').on('keydown', '.tagger-input', function(event){
      // Movement in list of clients
      if(event.keyCode === 40 || event.keyCode === 38){
        event.preventDefault();

        if(!($('.tagger-client.active').is(':visible')) || $('.tagger-client.active').length === 0){
          $('.tagger-client').removeClass('active');
          $('.tagger-client').nextAll(':visible:first').addClass('active');
        }
        else {
          $('.tagger-client').removeClass('prev-active');
          $('.tagger-client.active').addClass('prev-active');
          $('.tagger-client').removeClass('active');

          // Down
          if(event.keyCode === 40){
            $('.tagger-client.prev-active').nextAll(':visible:first').addClass('active');
          }
          // Up
          else {
            $('.tagger-client.prev-active').prevAll(':visible:first').addClass('active');
          }
        }
      }

      // Enter
      if(event.keyCode === 13 && $('.'+id).is(":visible")){
        event.preventDefault();
        $(taggerId).fadeOut(400);
        selectClient();
      }

      // Tab
      if(event.keyCode === 9){
        $(taggerId).fadeOut(400);
        selectClient();
      }
    });

    // Handle click
    $('body').on('click', '.tagger-client', function(event){
      // The select client function adds the item that has the class
      // active, so therefore
      $('.tagger-client').removeClass('active');
      $(this).addClass('active'); 
      // Go!
      $(taggerId).fadeOut(400);
      selectClient();
    });
  }
};
