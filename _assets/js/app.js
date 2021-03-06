  $(document).ready(function() {
  
  // all of this is from home.js - we may not need it all.
  $(".js-search-select").chosen(function() {
    return {
      width: "100%"
    };
  });
  $("input.keywords").each(function() {
    return $(this).tagsInput({
      autocomplete_url: $(this).data("query_path")
    });
  });
  $("span.category > input[type=checkbox]").change(function() {
    var chbx;
    chbx = $(this);
    if (chbx.is(':checked')) {
      return chbx.parent().addClass("checked");
    } else {
      return chbx.parent().removeClass("checked");
    }
  });
  $("a.js-follow").on("click", function(e) {
    var el;
    e.preventDefault();
    el = $(this);
    $.ajax(el.attr("href"), {
      type: el.hasClass("following") ? "DELETE" : "PUT",
      dataType: 'json',
      statusCode: {
        201: function() {
          el.html("Unfollow").addClass("following");
          return el.html("Unfollow").addClass("link_following");
        },
        204: function() {
          el.html("Follow").removeClass("following");
          return el.html("Follow").removeClass("link_following");
        }
      }
    });
    return false;
  });
 
  $(".field__label_inside").inFieldLabels();
  
  $(document).on("click", function(){
    $(this).find('.dropdown__menu').hide();
    $(".js-dropdown").parent().removeClass('active');
  });

  $(document).on("click", ".js-dropdown", function(e){
    e.preventDefault();
    e.stopPropagation();
    $this_menu = $(this).closest(".js-dropdown").parent().find('.dropdown__menu');
    $this_menu.toggle();
    $('.dropdown__menu').not($this_menu).hide();
    $('.dropdown__menu').not($this_menu).parent().removeClass('is-active');
    $(this).closest(".js-dropdown").parent().toggleClass('is-active');
  });

  $(document).on("click", ".js-accordion", function(e) {
    var $this_menu;
    e.preventDefault();
    e.stopPropagation();
    $this_menu = $(this).parent().find('.list__body');
    $this_menu.toggle();
    $('.list_accordion .list__body').not($this_menu).slideUp(200);
    $('.list_accordion .list__body').not($this_menu).parent().removeClass('active');
    return $(this).parent().toggleClass('active');
  });
  $(document).on("click", ".nav-bar_user .js-dropdown-notifications", function(e) {
    var url;
    e.preventDefault();
    e.stopPropagation();
    url = $(this).attr("href");
    return $.ajax(url, {
      type: 'POST',
      success: function(data, textStatus, jqXHR) {
        $(".js-notifications-count-number").remove();
        return $(".js-notifications-icon").removeClass("icon_alert_special").addClass("icon_alert_white");
      }
    });
  });
  


  // begin new UX js
  $('js-autogrow').autoGrow();

});


