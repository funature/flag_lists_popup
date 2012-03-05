
/**
 * @file
 * The Flag lists popup module js file.
 */

/**
 * Attaches the Flag Lists Popup behavior to all required links
 */
Drupal.behaviors.FLP = function (context) {
  jQuery('.flp-wrapper', context).each(function () {
    new Drupal.FLP(this);
  });
};

/**
 * An Flag Lists Popup object
 */
Drupal.FLP = function (wrapper) {
  // objects
  var flp = this;
  this.wrapper = wrapper;
  this.trigger = jQuery('.flp-trigger', this.wrapper).get(0);
  this.popup = jQuery('.flp-popup', this.wrapper).get(0);
  this.links = jQuery('a', this.popup);
  this.input = jQuery('input', this.popup);
  // options
  this.nid = this.wrapper.id.substr(0, this.wrapper.id.length - 8);
  this.distance = 10;
  this.time = 250;
  this.delay = 500;
  // helper variables
  this.timer = null;
  this.visible = false;
  this.shown = false;
  // act with popup
  jQuery([this.trigger, this.popup])
    .mouseover(function (event) { flp.showpopup(this, event); })
    .mouseout(function (event) { flp.hidepopup(this, event); });
  // act with links
  jQuery(this.links)
    .click(function (event) { return flp.clicklink(this, event); });
  // act with create list input
  jQuery(this.input)
    .keypress(function(event) { flp.createnew(this, event); });

};

/**
 * Handler for the "mouseover" event
 */
Drupal.FLP.prototype.showpopup = function (o, e) {
  // object
  var flp = this;
  // stops the hide event if we move from the trigger to the popup element
  if ( this.timer ) clearTimeout(this.timer);
  // don't trigger the animation again if we're being shown, or already visible
  if ( this.visible || this.shown ) return;
  // reset position of popup box
  this.shown = true;
  jQuery(this.popup)
    // brings the popup back in to view
    .css({ top: 20, left: 0, display: 'block' })
    // (we're using chaining on the popup) now animate it's opacity and position
    .animate({ bottom: '+=' + this.distance + 'px', opacity: 1 }, this.time, 'swing', function () {
      // once the animation is complete, set the tracker variables
      flp.visible = true;
      flp.shown = false;
    });
};

/**
 * Handler for the "mouseout" event
 */
Drupal.FLP.prototype.hidepopup = function (o, e) {
  // object
  var flp = this;
  // reset the timer if we get fired again - avoids double animations
  if ( this.timer ) clearTimeout(this.timer);
  // store the timer so that it can be cleared in the mouseover if required
  this.timer = setTimeout(function () {
    flp.timer = null;
    jQuery(flp.popup).animate({ bottom: '+=' + flp.distance + 'px', opacity: 0 }, flp.time, 'swing', function () {
      // once the animate is complete, set the tracker variables
      flp.visible = false;
      // hide the popup entirely after the effect (opacity alone doesn't do the job)
      jQuery(flp.popup).css('display', 'none');
    });
  }, this.delay);
};

/**
 * Handler for the "click" event
 */
Drupal.FLP.prototype.clicklink = function (o, e) {
  var link = o;
  jQuery.post(link.href, { 'flagStatus': jQuery(link).hasClass('flp-selected') }, function(data) {
    var json = eval("(" + data + ")");
    if ( json.status ) {
      jQuery(link).attr('class', json.flagStatus ? 'flp-selected' : 'flp-active');
    }
    else {
      console.log(json.errorMessage); // DEV
    }
  });
  return false;
};

/**
 * Handler for the "keypress" event
 */
Drupal.FLP.prototype.createnew = function (o, e) {
  // variables
  var input = o, event = e, flp = this;
  // remove error mark if anykey presed
  jQuery(input).removeClass('flp-error');
  // on not enter press
  if ( event.which != 13 || input.value.length <= 3) {
    return;
  }
  // ajax act
  jQuery.post('/flp-ajax/new', {
    'nodeNid': flp.nid,
    'nodeType': input.id.substr(0, input.id.length - 11),
    'flagTitle': input.value,
  }, function(data) {
    var json = eval("(" + data + ")");
    if (json.status) {
      // create new link for class
      var item = jQuery('<li>', { text: '' });
      var link = jQuery('<a>')
        .text(json.flag.title)
        .attr('href', json.flag.url)
        .click(function (event) { return flp.clicklink(this, event); })
        .appendTo(item);
      // append to list
      jQuery(input)
        .val('')
        .parent('li')
        .before(item);
      // select created list
      jQuery(link).click();
      // update links
      flp.links = jQuery('a', flp.popup);
    }
    else {
      // mark it as error
      jQuery(input).addClass('flp-error');
      console.dir(json); // DEV
    }
  });
  // prevent any other activity
  event.preventDefault();
};
