;(function($){

    var availableGroups = [
      "Analytics",
      "Engineering",
      "Design",
      "Finance",
      "New Hires",
      "Marketing",
      "Product",
      "QA",
      "Sales"
    ];
    var availableTags = [
      "arches",
      "crust",
      "facts",
      "info",
      "new",
      "rangers"
    ];
    var availableCategories = [
      "Advanced Training",
      "Basic Training",
      "Park Information"
    ];

    var availableContributors = [
      "Andy O.",
      "Craig M.",
      "Dave M.",
      "Geno S.",
      "Heidi F.",
      "Jayden A.",
      "Sushma P."
    ];

    // Plugin
    jQuery.fn.contribute = function(option)
    {
      return this.each(function()
      {
        var $obj = $(this);

        var data = $obj.data('contribute');
        if (!data)
        {
          $obj.data('Contribute', (data = new Contribute(this, option)));
        }
      });
    };


    var Contribute = function (element, options) {

      this.$el = $(element);


      // Options
      this.opts = $.extend({

        redactorEditor: String() +
        '<i class="js-grab-handle post__section-grab"></i>' +
        '<i class="js-grab-handle post__section-grab"></i>' +
        '<i class="js-grab-handle post__section-grab"></i>' +
        '<i class="js-grab-handle post__section-grab"></i>' +
        '<nav class="post__section-nav">' +
        '<i class="icon icon_grabber_transparent js-grab-handle"></i>' +
        '<i class="icon icon_trash_transparent js-delete-section"></i>' +
        '</nav>' +
        '<section class="js-redactor" data-placeholder="Continue writing..."></section>' +
        '</section>',

        linkStart: String() +
        '<section id="link-start" class="post__section post__section_dark post__section_loading hidden">' +
        '<nav class="post__section-nav">' +
        '<i class="icon icon_grabber_transparent js-grab-handle"></i>' +
        '<i class="icon icon_trash_transparent js-delete-section"></i>' +
        '</nav>'
      }, options, this.$el.data());

      this.init();
    };

    Contribute.prototype = {

        //
        init: function(){

          var _self = this;

          // setup event handlers

          // delete section
          $(".js-delete-section").on("click", function(e){
            var $target = $(e.target);
            var $section = $target.parent().parent();
            $.proxy(_self.deleteSection($section), _self)
          }); 
          $(".js-delete-section-cancel").on("click", $.proxy(this.closeDialog, this)); 
          // $(".js-delete-section-confirm").on("click", function(e){
          //   var $target = $(e.target);
          //   var $section = $target.parent();
          //   $.proxy(self.confirmDelete($section), self)
          // }); 

          this.$autoSaveEl = $(".js-autosave").on("click", $.proxy(this.autoSave, this));
          this.$autoSaveEl.on("click", $.proxy(this.autoSave, this));

          // For file uploading
          this.$fileUploadBtn = $(".js-input-file").change(this.fileUpload);
          this.$coverImageUploadBtn = $(".js-header-image").change(this.headerImageUpload);
          
          // For adding link
          this.$addLinkBtn = $(".js-link-input-toggle").on("click", $.proxy(this.startWebLink, this));
          $('.media-composer_input .input_textarea_plain').keypress(function(e) {
            if(e.which == 13) {
              _self.finishWebLink();
            }
          });

          // initialize redactor
          this.initializeRedactor($(".js-redactor"));

          // script for the redactor placeholder text
          $(document).on('change keydown keypress input', '[data-placeholder]', function() {
              if (this.textContent) {
                this.dataset.divPlaceholderContent = 'true';
              }
              else {
                delete(this.dataset.divPlaceholderContent);
              }
          });
          $('[data-placeholder]').change();


          // sortable sections
          $( "#contribute" ).sortable(
            { 
              axis: "y",
              scroll: true,
              scrollSensitivity: 100,
              scrollSpeed: 100,
              placeholder: "post__section_placeholder",
              handle: ".js-grab-handle",
              update: function(event,ui){
              contribute.autoSave();
            }
          });

  
          // Tags, groups, categories, contributors input
          $("#js-groups").tagsInput({
             'defaultText':'Add groups',
              autocomplete_url:'/keywords',
             'autocomplete': {'source': availableGroups,}
          });
          $("#js-tags").tagsInput({
             'defaultText':'Add tags',
              autocomplete_url:'/keywords',
             'autocomplete': {'source': availableTags}
          });
          $("#js-categories").tagsInput({
             'defaultText':'Add categories',
              autocomplete_url:'/keywords',
             'autocomplete': {'source': availableCategories}
          });
          $("#js-contributors").tagsInput({
             'defaultText':'Add contributors',
              autocomplete_url:'/keywords',
             'autocomplete': {'source': availableContributors}
          });

          // Toggle media composer
          $(".js-toggle").on("click", function(){
            $(this).parent().toggleClass("is-active")
          });

          $(".js-cancel-section").click(function() {
            $('.media-composer').removeClass("is-active");
            $('.media-composer__link').fadeIn("fast");
            $(".js-link-input").removeClass("is-active");
            $('.media-composer_input .input_textarea_plain').blur();
          });


          // Trigger flash message
          $('.js-alert').addClass("is-active").delay(4000).queue(function() {
            $(this).removeClass("is-active");
            $(this).dequeue();
          });

          // Grow text fields
          $(".js-autogrow").autoGrow();

          // Does the press enter for link input
          $(".js-link-entry").focus(function() {
            $(this).parent().find('.field__tip').fadeIn(200);
          });
          $(".js-link-entry").blur(function() {
            $(this).parent().find('.field__tip').fadeOut(200);
          });

          // For post button dropdown
          $(".button_with-options .dropdown__menu-link").click(function() {
            var txt = $(this).text();
            $(".button_with-options .dropdown__menu-link").removeClass("state_active");
            $(this).addClass("state_active");
            $('.button_main').empty();
            $('.button_main').append(txt);
          });

          // For header color changes
          $('.js-header-color').click(function() {
            var color = $(this).css("background-color");
            $('.js-header-color').removeClass('is-active');
            $(this).addClass('is-active');
            $('.post__header').css("background-color",color);
          });


          // For header removal
          $('.js-remove-header').click(function() {
            $('.icon_close_white').addClass('hidden');
            $('.icon_paintbrush_white').removeClass('hidden');
            $('.post__header').removeClass('is-uploaded');
          });

          

          // // For section removal confirm
          // $('.js-delete-section-confirm').click(function() {
          //   $('.dialog-window__wrapper').removeClass('is-active');
          // });

          // // For section removal cancel
          // $('.js-delete-section-cancel').click(function() {
          // });


          // For media composer only to be fixed to bottom when there's little or no content
          function mediacomposer() { 
            var post = parseInt($('.post').css("height"), 10) + parseInt($('.post').css("padding"), 10) + parseInt($('.post').css("borderTopWidth"), 10) + parseInt($('.post').css("borderBottomWidth"), 10);
            var page_height = parseInt($(window).height(), 10); 
            if (post > page_height) {
              $('.media-composer').addClass('not-fixed');
            }
            else {
              $('.media-composer').removeClass('not-fixed');
            }
          }
          $(mediacomposer);
          $(window).resize(mediacomposer);  
          $('html').on("keyup", mediacomposer);  
          $(document).click(mediacomposer);


          // $("html").on("keydown", function(event){
          //   $("pre").removeClass("prettyprint").removeClass("prettyprinted").delay(10).queue(function() {
          //     $("pre").addClass("prettyprint");
          //     $(this).dequeue();
          //   });
          // });

          // For scrolling to make page full height after initial 68px
          var $element = $('.post'), className = 'is-scrolled';
          $(document).scroll(function() {
            $element.toggleClass(className, $(document).scrollTop() >= 50);
          });

          // For hiding draggers in focus
          $('.redactor_editor').focus(function() {
            $(this).parent().parent().find('.post__section-grab').hide();
          });
          // For showing draggers in blur
          $('.redactor_editor').blur(function() {
            $(this).parent().parent().find('.post__section-grab').show();
          });

          // For scrolling to make page full height after initial 68px
          var postHeight = $('.post').height();
          var actionsHeight = $('.box_post-actions').height();
          var classBottomName = 'is-at-bottom';
          var isPosted = ($('.post').hasClass('is-posted').length) ? false : true;
          $(document).scroll(function() {
            if (isPosted) {
              $(".page").toggleClass(classBottomName, $(document).scrollTop() >= postHeight - actionsHeight - 104);
            }
          });

          $(".is_editing .post__section").on('mouseenter',
            function(){
              var mediaComposer =  '<footer class="media-composer">' +
                                      '<section id="link-start" class="media-composer_input js-link-input">' +
                                      '<nav class="post__section-nav">' +
                                      '<i class="icon icon_trash_transparent js-cancel-section mtm"></i>' +
                                      '</nav>' +
                                      '<textarea placeholder="Type, or paste a URL, or embed code" class="input input_textarea_plain input_textarea_plain_inverted js-autogrow"></textarea>' +
                                      '</section>' +
                                      '<a name="Add File"  class="media-composer__link media-composer__link_upload js-upload file js-toggle">' +
                                      '<i class="icon icon_upload_white"></i>' +
                                      '<input type="file" class="js-input-file input_file">' +
                                      '</a>' +
                                      '<a name="Add Link"  class="media-composer__link media-composer__link_link js-link-input-toggle js-toggle">' +
                                      '<i class="icon icon_link_white"></i>' +
                                      '</a>' +
                                      '<a  class="media-composer__link media-composer__link_add js-toggle">' +
                                      '<i class="icon icon_plus_text">+</i>' +
                                      '</a>' +
                                      '<a  name="Record Your Screen" class="media-composer__link media-composer__link_screen js-toggle" onclick="alert(\'screencast\');">' +
                                      '<i class="icon icon_cursor_white"></i>' +
                                      '</a>' +
                                      '<a  name="Record From Webcam" class="media-composer__link media-composer__link_webcam js-toggle" onclick="alert(\'webcam\');">' +
                                      '<i class="icon icon_camera_white"></i>' +
                                      '</a>' +  
                                      '</footer>';
              $(mediaComposer).prependTo(this);
              $(mediaComposer).appendTo(this);
              $('.post__section').not(':hidden').first().find(".media-composer:first-child").hide();
              $('.post__section').not(':hidden').last().find(".media-composer:last-child").hide();
              $(".post__section .js-toggle").on("click", function(){
                $(this).parent().toggleClass("is-active");
              });          
            })
            .on('mouseleave', function() {
              $(".post__section .media-composer").remove();
            });

        },

        //autosave text 
        autoSave: function () {
          $el = this.$autoSaveEl
          $el.text("Saving..");
          setTimeout(function() {
            $el .text("Saved");
          }, 2000);
        },

        // For section removal
        deleteSection: function(section) {
          _self = this
          $('.dialog-window__wrapper').addClass('is-active');
          $(".js-delete-section-confirm").on("click", function(e){
            $.proxy(_self.confirmDelete(section), _self)
          }); 
          this.autoSave();
        },

        confirmDelete: function(section){
          this.closeDialog();
          //$('#link-finish').slideUp();
          //alert(section)
          section.slideUp();
          section.remove();
        },

        // custom format heading button
        formatHeading: function() {
          $(".js-redactor").execCommand('formatblock', "<h3>");
        },

        // custom format quote button
        formatQuote: function() {
          $(".js-redactor").execCommand('formatblock', "<blockquote>");
        },

        // custom format code button
        formatCode: function() {
          $(".js-redactor").execCommand('formatblock', "<pre>");
        },

        fileUpload: function() {
          $('.post__section_status, .status-bar_uploading').removeClass('hidden');
          $('.media-composer').removeClass('is-active');
          $('#redactor_content_2').parent().parent().removeClass("hidden").hide().slideDown();
          $('#redactor_content_2').setFocus();
          $("html, body").animate({ scrollTop: $(document).height() }, "slow");
          $('.status-bar__meter').animate({
              width: '100%',
          }, {
              easing: 'linear',
              duration: 4000,
              step: function(now) {

                  var data = now;
                  var onepercent = 365 / 100 * 1
                  datatwo = data.toFixed(0);
                  datapos = (Math.abs(datatwo));

                  $('.js-upload-percent').html(datapos + '%');
              }
          });
          $('.status-bar_uploading').delay(4000).queue(function() {
            $(this).addClass("hidden");
            $(this).dequeue();
            $('.status-bar_processing').removeClass("hidden");
            $('.status-bar_processing').delay(1000).queue(function() {
              $(this).addClass("hidden");
              $('.post__section_image').removeClass('hidden').hide().slideDown();
              $(this).dequeue();
              $("html, body").animate({ scrollTop: $(document).height() }, "slow");
            });;
         });;
        },

        headerImageUpload: function(){
          $('.post__header').addClass('is-uploaded');
          $('.icon_close_white').removeClass('hidden');
          $('.icon_paintbrush_white').addClass('hidden');
        },

        closeDialog: function(){
          $('.dialog-window__wrapper').addClass('animate-out').delay(400).queue(function() {
            $('.dialog-window__wrapper').removeClass('animate-out').removeClass('is-active');
            $(this).dequeue();
          });
        },

        initializeRedactor: function(el){
          el.redactor(
            { 
              air: true,
              focus: true,
              airButtons: ['bold', 'italic', 'link', '|', 'unorderedlist', 'orderedlist','|', 'heading', 'quote', 'code'],
              buttonsCustom: {
                heading: {
                    title: 'Heading', 
                    callback: this.formatHeading
                },
                quote: {
                    title: 'Quote', 
                    callback: this.formatQuote
                },
                code: {
                    title: 'Code', 
                    callback: this.formatCode
                },
                autosave: '/save.php', 
                interval: 10, // seconds
                autosaveCallback: this.autoSave()
              }

            }
          );

          //this.$redactor.first().setFocus();
        },

        insertRedactorEditor: function(){
          div = $("<section class='post__section is-formatted'>").append(this.opts.redactorEditor);
          this.$el.append(div);
          redactor = div.find(".js-redactor");
          this.initializeRedactor(redactor);
        },

        startWebLink: function(){
          $('.media-composer__link').fadeOut("fast");
          this.$el.append(this.opts.linkStart);
          $(".js-link-input").addClass("is-active");
          $('.media-composer_input .input_textarea_plain').focus();
        },
        finishWebLink: function(){
          $(this).val("");
          $(this).blur();
          $(".media-composer").removeClass("is-active");
          $('.media-composer__link').fadeIn("fast");
          $(".js-link-input").removeClass("is-active");
          $(".post__section_loading").removeClass("hidden");
          $('#link-finish').delay(1000).queue(function() {
            $(this).removeClass("hidden");
            $('.post__section_loading').addClass("hidden");
            $(this).dequeue();
            $("html, body").animate({ scrollTop: $(document).height() }, "slow");
          });
          this.insertRedactorEditor();
          // $('#redactor_content_3').parent().parent().removeClass("hidden").hide().slideDown();
          // $('#redactor_content_3').setFocus();
        } 


    };

})(jQuery);