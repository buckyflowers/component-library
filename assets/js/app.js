$(document).ready(function(){
  // $('textarea').autoGrow();
});

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