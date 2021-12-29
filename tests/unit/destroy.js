QUnit.test('.destroy("all") removes all inline CSS and fullpage classes', function(assert) {
    var id = '#fullpage';

    appendLazyElements(id);

    var FP = initFullpageNew(id, Object.assign({}, allBasicOptions, {
        sectionsColor: ['yellow', 'green', 'purple', 'orange'],
        paddingTop: '20px',
        paddingBottom: '20px'
    }));

    var $SECTION_SEL = $(SECTION_SEL),
        $SLIDE_SEL = $(SLIDE_SEL),
        $html = $('html');
        $body = $('body');

    FP.destroy('all');

    // and make sure we cleaned it up. note: this requires checking the uncomputed
    // CSS or jQuery will give us computed values, which are unhelpful here
    assert.equal($SECTION_SEL.get(0).style.height, '', SECTION_SEL + ' should have an empty string height');
    assert.equal($SECTION_SEL.get(0).style.backgroundColor, '', SECTION_SEL + ' should have an empty string background-color');
    assert.equal($SECTION_SEL.get(0).style.paddingTop, '', SECTION_SEL + ' should have an empty string paddingTop');
    assert.equal($SECTION_SEL.get(0).style.paddingBottom, '', SECTION_SEL + ' should have an empty string paddingBottom');
    assert.equal($SLIDE_SEL.get(0).style.width, '', SLIDE_SEL + ' should have an empty string width');
    assert.equal($html.get(0).style.overflow, '', 'html should have an empty string overflow');
    assert.equal($html.get(0).style.height, '', 'html should have an empty string height');
    assert.equal($body.get(0).style.overflow, '', 'body should have an empty string overflow');
    assert.equal($body.get(0).style.height, '', 'body should have an empty string height');

    //no data-src or data-srcset should be present
    assert.equal(isAnyLazyLoaded($(SECTION_SEL).eq(0)), false, 'We expect no lazy elements to be loaded on 1st section');
    assert.equal(areOthersLazyLoaded(), false, 'We expect no lazy elements to be loaded in other sections');

    // check for <html/> classes
    assert.equal($html.hasClass(ENABLED), false, 'html should not have the ' + ENABLED + ' class');
    assert.equal($html.hasClass(RESPONSIVE), false, 'html should not have the ' + RESPONSIVE + ' class');

    //destroyed
    assert.equal($(id).hasClass(DESTROYED), true, 'fullpage.js container should have the ' + DESTROYED + ' class');

    //no table classes
    assert.equal($(id).find(TABLE_CELL_SEL).length, 0, 'Sections or slides should not containt the ' + TABLE_CELL_SEL + ' class');

    //no SLIDES_CONTAINER_SEL classes
    assert.equal($(id).find(SLIDES_CONTAINER_SEL).length, 0, 'Sections or slides should not containt the ' + SLIDES_CONTAINER_SEL + ' class');

    //no SLIDES_WRAPPER_SEL classes
    assert.equal($(id).find(SLIDES_WRAPPER_SEL).length, 0, 'Sections or slides should not containt the ' + SLIDES_WRAPPER_SEL + ' class');

    //maintains original styles
    assert.equal($(id).find('#section2')[0].style.backgroundColor, 'blue', 'Sections or slides should maintain previous inline styles');

    // check for <body/> classes
    $.each($body.get(0).className.split(/\s+/), function(index, className) {
        assert.equal(className.indexOf(VIEWING_PREFIX), -1, 'body should not have a ' + VIEWING_PREFIX + '-* class');
    });

    //no scrollable sections
    assert.equal($(SECTION_SEL + ', ' + SLIDE_SEL).find(SCROLLABLE_SEL).length, 0, 'Sections or slides should not containt the ' + SCROLLABLE_SEL + ' class');
    assert.equal($(SECTION_SEL + ', ' + SLIDE_SEL).find('.fp-scroller').length, 0, 'Sections or slides should not containt the fp-scroller class');

    //arrows
    var numArrowsAndBullets = $(document).find(SECTION_NAV_SEL + ', ' + SLIDES_NAV_SEL +  ', ' + SLIDES_ARROW_SEL).length;
    assert.equal(numArrowsAndBullets, 0, 'html should not contain any of the bullets or arrows generated by fullPage.js');

    //container transforms
    assert.deepEqual(getTransformFromElement($(id)), ['0', '0', '0'], 'fullPage.js container should have no transformations');

    //internal selectors
    var usedSelectors = [SECTION_SEL, SLIDE_SEL, SLIDES_CONTAINER_SEL];
    $.each(usedSelectors, function(index, value){
        assert.equal($(id).find(value).length, 0, 'fullpage.js container should not contain any internal selectors generated by fullPage.js');
    });
});
/*
var g_fullpageEvents = [];
//https://gist.github.com/alessioalex/fc536ef87713d0a9ed89
// http://stackoverflow.com/questions/4787698/failure-to-override-elements-addeventlistener-in-firefox
function interceptEvents(id){
    Error.stackTraceLimit = Infinity;

    var _interfaces = Object.getOwnPropertyNames(window).filter(function(i) {
      return /^HTML/.test(i);
    }).map(function(i) {
      return window[i];
    });

    // var _interfaces = [ HTMLDivElement, HTMLImageElement, HTMLUListElement, HTMLElement, HTMLDocument ];
    for (var i = 0; i < _interfaces.length; i++) {
      (function(original) {
        _interfaces[i].prototype.addEventListener = function(type, listener, useCapture) {
            g_fullpageEvents.push(listener.name);
          console.log('addEventListener ' + type, listener, useCapture);
          console.log('--------');

          return original.apply(this, arguments);
        }

        _interfaces[i].prototype.removeEventListener = function(type, listener, useCapture) {
            if(g_fullpageEvents){
                var index = g_fullpageEvents.indexOf(listener.name);
                if(index > -1){
                    g_fullpageEvents.splice(index, 1);
                }
            }
        }
      })(_interfaces[i].prototype.addEventListener);
    }
}

QUnit.test('.destroy("all") removes all fullpage.js event listeners', function(assert) {
    var id = '#fullpage';

    interceptEvents(id);

    var FP = initFullpageNew(id, Object.assign({}, allBasicOptions, {navigation:true, slidesNavigation: true}));
    console.warn(g_fullpageEvents);

    var $SECTION_SEL = $(SECTION_SEL),
        $SLIDE_SEL = $(SLIDE_SEL),
        $html = $('html');
        $body = $('body');

    FP.destroy('all');
    console.warn(g_fullpageEvents);

    //adding a fake navigation
    var nav = '<div id="fp-nav" class="fp-right" style="margin-top: -23.5px;"><ul><li><a href="#page1" class="active"><span></span></a><div class="fp-tooltip fp-right">nada</div></li><li><a href="#page2"><span></span></a><div class="fp-tooltip fp-right">demo</div></li></ul></div>';
    $('body').append(nav);

    assert.ok(true);
});*/

QUnit.test('.destroy("all") with css3:false ', function(assert) {
    var id = '#fullpage';
    var FP = initFullpageNew(id, Object.assign({}, allBasicOptions, {css3: false}));

    assert.deepEqual($(id).css('top'), '0px', 'fullPage.js container should have top: 0');
});

QUnit.test('.destroy("all") with css3:true & autoScrolling:false', function(assert) {
    var id = '#fullpage';
    var FP = initFullpageNew(id, Object.assign({}, allBasicOptions, {css3: true, autoScrolling:false}));

    //scrolling the content
    $('html,body').scrollTop(600);

    FP.destroy('all');

    assert.deepEqual($(id).css('top'), 'auto', 'fullPage.js container should have top: auto');
    assert.deepEqual($('html,body').scrollTop(), 0, 'fullPage.js container should have scrollTop: 0');
});

QUnit.test('.destroy("all") with css3:true & scrollBar:true', function(assert) {
    var id = '#fullpage';
    var FP = initFullpageNew(id, Object.assign({}, allBasicOptions, {css3: true, scrollBar: true}));

    //scrolling the content
    $('html,body').scrollTop(600);

    FP.destroy('all');

    assert.deepEqual($(id).css('top'), 'auto', 'fullPage.js container should have top: auto');
    assert.deepEqual($('html,body').scrollTop(), 0, 'fullPage.js container should have scrollTop: 0');
});

//common test when fullpage.js uses scrollbar
function checkDestroyWhenScrollBarPresent(assert, options){
    var id = '#fullpage';
    var FP = initFullpageNew(id, options);

    //scrolling the content
    $('html,body').scrollTop(600);

    FP.destroy('all');

    assert.deepEqual($(id).css('top'), 'auto', 'fullPage.js container should have top: auto');
    assert.deepEqual($('html,body').scrollTop(), 0, 'fullPage.js container should have scrollTop: 0');
}

QUnit.test('.destroy("all") with css3:true & autoScrolling:false', function(assert) {
    checkDestroyWhenScrollBarPresent(assert, Object.assign({}, allBasicOptions, {css3: true, autoScrolling:false}));
});

QUnit.test('.destroy("all") with css3:true & scrollBar:true', function(assert) {
    checkDestroyWhenScrollBarPresent(assert, Object.assign({}, allBasicOptions, {css3: true, scrollBar:true}));
});

QUnit.test('.destroy("all") with css3:false & autoScrolling:false', function(assert) {
    checkDestroyWhenScrollBarPresent(assert, Object.assign({}, allBasicOptions, {css3: false, autoScrolling:false}));
});

QUnit.test('.destroy("all") with css3:false & scrollBar:true', function(assert) {
    checkDestroyWhenScrollBarPresent(assert, Object.assign({}, allBasicOptions, {css3: false, scrollBar:true}));
});
