//=================================================
//	 Steampunk clock calendar 2.9 (MkII)
//	 Written by: Dean Beedell
//
//       Dean.beedell@lightquick.co.uk
//	 Copyright (C) 2011 All Rights Reserved.
//=================================================
// reprogram the pendulum to use less cpu
// change the code to handle preferences correctly (onPreferencesChanged) - done
// JSLint-ed the code
//
// new 12hr clock face instead of the 16hr item
// new weekday indicator and brass toggle
// new chain to mute the ticks
// fixed bug with the alarm toggles disappearing when an alarm was set
// Turn the valve upside down and add a cog or two
// pendulum no stops when cpu reaches a pre-set limit
// when pendulum is stopped it no longer disappears
// added the newer slider code to stretch the cable
// added improved graphics
// added menu preferences to find help &c.
// check the handling of the prefs
// ensure the pendulum shows after a restart
// The A Key should cancel an alarm if pressed a second time
// When an alarm key is pressed the alarm slider should be released
// When an alarm key is pressed a second time alarm mode should be cancelled
// When an alarm is displayed the day of the week indicator should change to the day of the alarm
// Fixed saturday indicator flag size
// Check the chain pull animation
// Adjust the hand centres
// Hand images to change
// Sorted and added start up messages
// add extra lines on the reboot of the o/s
// add a pop up plaque asking are you sure you want to delete this alarm?
// change the timer handling to reduce the overhead of continuous checking - done
// move chimes to separate timers
// change the clock so that the first bell ring is dead on the o'clock
// only move the second hand every second, others don't need to move until the specific time
// ticking synced by running a modulo 30 count instead of a timer - tested and abandoned
// failed to resolve variations of the pendulum issue
// mute chime button not moving any more
// 16 o'clock on the console during chimes
// tidy code
// add resizing of the whole clock, hoffset, voffset, width, height
// test resizing successfully
// tick chain not working
// fix 12/24hr digital clock
// pull chain amount when resized
// slider time movement when resized is not proportional
// alarm toggles aren't shown when smaller when set Alarm is pressed
// second click on an alarm toggle cancels the alarm
// the links in the help drop-downs now resize
// the backscreen repositions incorrectly after the clock is resized
//
// 2.9 changes
//
// view the alarms in non-edit mode, the slider should not move
// edit alarm mode, the slider should move
// when the slider is set to the middle position the digits should be modifiable/rotatable
// when in view mode, clicking on the next alarm displays the next and cancels the previous
// the alarm pop up needs to be on top of the log text
// add key presses H, A, L, M, P, T, S, W, B
// add left and right keypresses for the slider
// add key presses 1,2,3,4,5
// added code to validate the date
// the counters now rotate via a hover-over and mousewheel when in alarm mode
// modified the preferences to allow more control over the counters
// add up and down keypresses for the crank handle
// crank handle repositions incorrectly after the clock is resized
// pendulum moves to the wrong position when resized
// add screen images based upon time spans
// add left and right keypresses for the slider - WIP
// when slider is moved a simultaneous shift key press keeps it in the same position.
// add math to the slider, replacing ranges
// add preferences for math/range options
// standardise all debug statements
// add very quiet sounds - done
// modify the crank handle to allow an intermediate position
// pendulum position bug after resizing
// crank handle position after resizing
// set the crank position to the middle on startup
// take all javascript code from the .kon file and place it into the .js
// brassbuttonP resize position corrected
// brassbuttonM resize position corrected
// brassbuttonL resize position corrected
// brassbuttonA and slider resize position corrected
// brassbuttonT resize position corrected
// brassbuttonS resize position corrected
// brassbuttonW resize position corrected
// brassbuttonB resize position corrected
// add mousescroll for the hour and minute sliders
// clicking on an alarm and then clicking the A-toggle should edit the current alarm - not yet working
// pressing A and then clicking on an alarm and sliding the time allows editing of the current alarm - Works
// fix timecount causing positive increments when decrementing, added a check and a switch from positive to negative
// pressing A and then clicking on an alarm and scrolling the date manually should allow editing of the current alarm - unknown
// if alarm is playing then do not show the alarm details prior to deletion
// if a alarm toggle is pressed and a till alarm raised, a further press on the toggle should lower the till alarm
// pressing the 1 alarm toggle causes the others to stop popping out - fixed

//*****************************************************
// Things to do :
//
// add an optional text field that is displayed when the alarm is viewed or edited - unsure of this requirement
// add a calendar on the pull down below - thinking about this...

// test and fix alarms

//   test the alarm actually rings when set  - it does
//   test the cancelling of the alarm whilst ringing - it cancels

//   set alarm 1 to 1 day beyond
//   set alarm 2 to 1hr beyond
//   set alarm 3 to 20 mins beyond
//   set alarm 4 to 5 mins beyond
//   set alarm 5 to 2 mins beyond

// restart the widget when one alarm has passed

// hide the alarms in the prefs?
// debug to zero

// click on date /allows up/down keypresses to increment/decrement date
// click on month /allows up/down keypresses to increment/decrement month
// click on year /allows up/down keypresses to increment/decrement year
// click on hours /allows up/down keypresses to increment/decrement hours
// click on mins /allows up/down keypresses to increment/decrement mins

// crankhandle - position at startup
//*****************************************************

   var debugFlg = 1;
   var globals = this;	// must be at global level
   var bgresult;

   var timecount =0;
   var basetimecurrent = 0;  //no. of milliseconds since 1970
   var timeaccelerationfactor = 1.7;
   var hoveredOverTill =0;

//variables for the view screen raising or lowering

   var terminal = new Array();
   var screentext = "text";

// preference Variables

   var widgetID = "Steampunk clock calendar";
   var soundLevelPrefFlg = preferences.soundLevelPref.value;
   var tickingPrefFlg = preferences.soundLevelPref.value;
   var pendulumPrefFlg = preferences.pendulumPref.value;
   var mutechimes = false;

// variables for canvas dropdown

   var hidedropdown = true;
   var doubleClickTime = 0;
   var dropdownactive = false;
   var helpdropdownactiveFlg = false;
   var alarmdropdownactive = false;
   var termsdropdownactive = false;

   var sliderSetClicked = false;
   var tollbellcount= 0;
   var sliderMechanismStatus = "held";

// variables set for the pendulum

   var gravity = -0.0110808; //originally -.005, tuned to -0.110808 as it approximates a 1 second interval
   var acceleration = 0.1;  //0.1
   var velocity = 0.18; //.18
   var angle = 8;  // 8   (.4 radians = 22.91 degrees)

//variables for sounds

   var chime1 = "Resources/quarterchime.mp3";
   var chime2 = "Resources/halfchime.mp3";
   var chime3 = "Resources/threequarterchime.mp3";
   var chime4 = "Resources/fullchime.mp3";

   var tickingSound = "Resources/ticktock.mp3" ;
   var nothing = "Resources/nothing.mp3" ;
   var belltoll01 = "Resources/belltoll01.mp3" ;
   var singleBell = "Resources/singleBell.mp3" ;
   var twoBells = "Resources/twoBells.mp3";
   var clunk = "Resources/clunk.mp3";
   var zzzz = "Resources/zzzz.mp3";
   var buzzer = "Resources/buzzer.mp3";
   var rollerblind ="Resources/rollerblind.mp3";
   var rollerblindup ="Resources/rollerblind-up.mp3";
   var rollerblinddown ="Resources/rollerblind-down.mp3";
   var alarmbells  = "Resources/alarmbells.mp3" ;
   var till  = "Resources/nothing.mp3";
   var tingingSound = "Resources/ting.mp3";
   var chimelength = "15";
   var counter ="Resources/counter.mp3";
   var counter2 ="Resources/counter-quiet.mp3";
   var lock = "Resources/lock.mp3";
   var pageFumble = "Resources/page-fumble.mp3";

// time variables

   var time = new Date();
   var months;
   var hr= 0;
   var mn;
   var se;
   var dt;
   var mnth;
   var yr;
   var oldyear;
   var hour;
   var mins;
   var secs;
   var date;
   var month;
   var year ;

//alarm variables       humanreadablealarmdate

   var raisealarmflg = false;
   var selectedAlarm = 1;
   var alarmtime = 0; 
   var alarmToUse = 0;
   var humanreadablealarmdate = new Date(0);

   var selectedAlarm = 0;

   var clockScale = 100 ;

   //variables for the alarm toggle positions
   var flag01HoffsetIn= 0;    //Math.round( 615 * (clockScale / 100))
   var flag02HoffsetIn= 0;
   var flag03HoffsetIn= 0;
   var flag04HoffsetIn= 0;
   var flag05HoffsetIn= 0;

   //variables for the alarm toggle positions
   var flag01HoffsetOut = 0;
   var flag02HoffsetOut = 0;
   var flag03HoffsetOut = 0;
   var flag04HoffsetOut = 0;
   var flag05HoffsetOut = 0;

//more implied globals yet to be defined will go here

    var helpCanvasDisplayed = 1;
    var runmode = "startup";
    var currIcon = "Resources/dockIcon.png";

    var vitalitycnt = 0;
    var tickcnt = 0;
    var prefsFlg = 0; // var to determine whether the prefs have been saved
    
    var mainWindowwidthDefault  = mainWindow.width;
    var mainWindowheightDefault = mainWindow.height;

    var helpBottomhoffsetDefault = helpBottom.hoffset;
    var helpBottomvoffsetDefault = helpBottom.voffset;
    var helpBottomwidthDefault =  helpBottom.width;
    var helpBottomheightDefault =  helpBottom.height;

    var backscreenhoffsetDefault = backscreen.hoffset;
    var backscreenvoffsetDefault = backscreen.voffset;
    var backscreenwidthDefault =  backscreen.width;
    var backscreenheightDefault =  backscreen.height;

    var backscreenhoffsetCurrent = backscreen.hoffset;
    var backscreenvoffsetCurrent = backscreen.voffset;

    var brassButtonBhoffsetDefault =  brassButtonB.hoffset;
    var brassButtonBvoffsetDefault =  brassButtonB.voffset;
    var brassButtonBwidthDefault =  brassButtonB.width;
    var brassButtonBheightDefault =  brassButtonB.height;

    var brassButtonThoffsetDefault =  brassButtonT.hoffset;
    var brassButtonTvoffsetDefault =  brassButtonT.voffset;
    var brassButtonTwidthDefault =  brassButtonT.width;
    var brassButtonTheightDefault =  brassButtonT.height;

    var screentophoffsetDefault =  screentop.hoffset;
    var screentopvoffsetDefault =  screentop.voffset;
    var screentopwidthDefault =  screentop.width;
    var screentopheightDefault =  screentop.height;

    var clearscreenhoffsetDefault =  clearscreen.hoffset;
    var clearscreenvoffsetDefault =  clearscreen.voffset;
    var clearscreenwidthDefault =  clearscreen.width;
    var clearscreenheightDefault =  clearscreen.height;

    var clearscreen2hoffsetDefault =  clearscreen2.hoffset;
    var clearscreen2voffsetDefault =  clearscreen2.voffset;
    var clearscreen2widthDefault =  clearscreen2.width;
    var clearscreen2heightDefault =  clearscreen2.height;

    var pastimagehoffsetDefault =  pastimage.hoffset;
    var pastimagevoffsetDefault =  pastimage.voffset;
    var pastimagewidthDefault =  pastimage.width;
    var pastimageheightDefault =  pastimage.height;

    var lhHingehoffsetDefault =  lhHinge.hoffset;
    var lhHingevoffsetDefault =  lhHinge.voffset;
    var lhHingewidthDefault =  lhHinge.width;
    var lhHingeheightDefault =  lhHinge.height;

    var rhHingehoffsetDefault =  rhHinge.hoffset;
    var rhHingevoffsetDefault =  rhHinge.voffset;
    var rhHingewidthDefault =  rhHinge.width;
    var rhHingeheightDefault =  rhHinge.height;

    var till01hoffsetDefault =  till01.hoffset;
    var till01voffsetDefault =  till01.voffset;
    var till01widthDefault =  till01.width;
    var till01heightDefault =  till01.height;

    var till02hoffsetDefault =  till02.hoffset;
    var till02voffsetDefault =  till02.voffset;
    var till02widthDefault =  till02.width;
    var till02heightDefault =  till02.height;

    var till03hoffsetDefault =  till03.hoffset;
    var till03voffsetDefault =  till03.voffset;
    var till03widthDefault =  till03.width;
    var till03heightDefault =  till03.height;

    var till04hoffsetDefault =  till04.hoffset;
    var till04voffsetDefault =  till04.voffset;
    var till04widthDefault =  till04.width;
    var till04heightDefault =  till04.height;

    var till05hoffsetDefault =  till05.hoffset;
    var till05voffsetDefault =  till05.voffset;
    var till05widthDefault =  till05.width;
    var till05heightDefault =  till05.height;

    var pendulumSethoffsetDefault =  pendulumSet.hoffset;
    var pendulumSetvoffsetDefault =  pendulumSet.voffset;
    var pendulumSetwidthDefault =  pendulumSet.width;
    var pendulumSetheightDefault =  pendulumSet.height;

    var pendulumSethRegistrationPointDefault = pendulumSet.hRegistrationPoint;
    var pendulumSetvRegistrationPointDefault = pendulumSet.vRegistrationPoint;

    var dropdownhoffsetDefault =  dropdown.hoffset;
    var dropdownvoffsetDefault =  dropdown.voffset;
    var dropdownwidthDefault =  dropdown.width;
    var dropdownheightDefault =  dropdown.height;

    var drawstringhoffsetDefault =  drawstring.hoffset;
    var drawstringvoffsetDefault =  drawstring.voffset;
    var drawstringwidthDefault =  drawstring.width;
    var drawstringheightDefault =  drawstring.height;

    var brassbuttonHhoffsetDefault = brassbuttonH.hoffset;
    var brassbuttonHvoffsetDefault = brassbuttonH.voffset;
    var brassbuttonHwidthDefault = brassbuttonH.width;
    var brassbuttonHheightDefault = brassbuttonH.height;

    var brassbuttonAhoffsetDefault = brassbuttonA.hoffset;
    var brassbuttonAvoffsetDefault = brassbuttonA.voffset;
    var brassbuttonAwidthDefault = brassbuttonA.width;
    var brassbuttonAheightDefault = brassbuttonA.height;

    var brassbuttonLhoffsetDefault = brassbuttonL.hoffset;
    var brassbuttonLvoffsetDefault = brassbuttonL.voffset;
    var brassbuttonLwidthDefault = brassbuttonL.width;
    var brassbuttonLheightDefault = brassbuttonL.height;

    var brassbuttonMhoffsetDefault = brassbuttonM.hoffset;
    var brassbuttonMvoffsetDefault = brassbuttonM.voffset;
    var brassbuttonMwidthDefault = brassbuttonM.width;
    var brassbuttonMheightDefault = brassbuttonM.height;

    var brassbuttonPhoffsetDefault = brassbuttonP.hoffset;
    var brassbuttonPvoffsetDefault = brassbuttonP.voffset;
    var brassbuttonPwidthDefault = brassbuttonP.width;
    var brassbuttonPheightDefault = brassbuttonP.height;

    var woodenBarhoffsetDefault =  woodenBar.hoffset;
    var woodenBarvoffsetDefault =  woodenBar.voffset;
    var woodenBarwidthDefault =  woodenBar.width;
    var woodenBarheightDefault =  woodenBar.height;

    var bigdropdowncanvashoffsetDefault =  bigdropdowncanvas.hoffset;
    var bigdropdowncanvasvoffsetDefault =  bigdropdowncanvas.voffset;
    var bigdropdowncanvaswidthDefault =  bigdropdowncanvas.width;
    var bigdropdowncanvasheightDefault =  bigdropdowncanvas.height;

    var helpbrassbuttonhoffsetDefault =  helpbrassbutton.hoffset;
    var helpbrassbuttonvoffsetDefault =  helpbrassbutton.voffset;
    var helpbrassbuttonwidthDefault =  helpbrassbutton.width;
    var helpbrassbuttonheightDefault =  helpbrassbutton.height;

    var helptexthoffsetDefault =  helptext.hoffset;
    var helptextvoffsetDefault =  helptext.voffset;
    var helptextwidthDefault =  helptext.width;
    var helptextheightDefault =  helptext.height;

    var termstexthoffsetDefault =  termstext.hoffset;
    var termstextvoffsetDefault =  termstext.voffset;
    var termstextwidthDefault =  termstext.width;
    var termstextheightDefault =  termstext.height;

    var alarmtexthoffsetDefault =  alarmtext.hoffset;
    var alarmtextvoffsetDefault =  alarmtext.voffset;
    var alarmtextwidthDefault =  alarmtext.width;
    var alarmtextheightDefault =  alarmtext.height;

    var helpDrawstringhoffsetDefault =  helpDrawstring.hoffset;
    var helpDrawstringvoffsetDefault =  helpDrawstring.voffset;
    var helpDrawstringwidthDefault =  helpDrawstring.width;
    var helpDrawstringheightDefault =  helpDrawstring.height;

    var backgroundItemshoffsetDefault =  backgroundItems.hoffset;
    var backgroundItemsvoffsetDefault =  backgroundItems.voffset;
    var backgroundItemswidthDefault =  backgroundItems.width;
    var backgroundItemsheightDefault =  backgroundItems.height;

    var bottomBoxSethoffsetDefault =  bottomBoxSet.hoffset;
    var bottomBoxSetvoffsetDefault =  bottomBoxSet.voffset;
    var bottomBoxSetwidthDefault =  bottomBoxSet.width;
    var bottomBoxSetheightDefault =  bottomBoxSet.height;

    var heaterCoilhoffsetDefault =  heaterCoil.hoffset;
    var heaterCoilvoffsetDefault =  heaterCoil.voffset;
    var heaterCoilwidthDefault =  heaterCoil.width;
    var heaterCoilheightDefault =  heaterCoil.height;

    var orangeHeaterGlowhoffsetDefault =  orangeHeaterGlow.hoffset;
    var orangeHeaterGlowvoffsetDefault =  orangeHeaterGlow.voffset;
    var orangeHeaterGlowwidthDefault =  orangeHeaterGlow.width;
    var orangeHeaterGlowheightDefault =  orangeHeaterGlow.height;

    var meridienLetterSethoffsetDefault =  meridienLetterSet.hoffset;
    var meridienLetterSetvoffsetDefault =  meridienLetterSet.voffset;
    var meridienLetterSetwidthDefault =  meridienLetterSet.width;
    var meridienLetterSetheightDefault =  meridienLetterSet.height;

    var antipostLetterSethoffsetDefault =  antipostLetterSet.hoffset;
    var antipostLetterSetvoffsetDefault =  antipostLetterSet.voffset;
    var antipostLetterSetwidthDefault =  antipostLetterSet.width;
    var antipostLetterSetheightDefault =  antipostLetterSet.height;

    var monthLetter1LetterSethoffsetDefault =  monthLetter1LetterSet.hoffset;
    var monthLetter1LetterSetvoffsetDefault =  monthLetter1LetterSet.voffset;
    var monthLetter1LetterSetwidthDefault =  monthLetter1LetterSet.width;
    var monthLetter1LetterSetheightDefault =  monthLetter1LetterSet.height;

    var monthLetter3SetLetterSethoffsetDefault =  monthLetter3SetLetterSet.hoffset;
    var monthLetter3SetLetterSetvoffsetDefault =  monthLetter3SetLetterSet.voffset;
    var monthLetter3SetLetterSetwidthDefault =  monthLetter3SetLetterSet.width;
    var monthLetter3SetLetterSetheightDefault =  monthLetter3SetLetterSet.height;

    var monthLetter2LetterSethoffsetDefault =  monthLetter2LetterSet.hoffset;
    var monthLetter2LetterSetvoffsetDefault =  monthLetter2LetterSet.voffset;
    var monthLetter2LetterSetwidthDefault =  monthLetter2LetterSet.width;
    var monthLetter2LetterSetheightDefault =  monthLetter2LetterSet.height;

    var yearNumber4LetterSethoffsetDefault =  yearNumber4LetterSet.hoffset;
    var yearNumber4LetterSetvoffsetDefault =  yearNumber4LetterSet.voffset;
    var yearNumber4LetterSetwidthDefault =  yearNumber4LetterSet.width;
    var yearNumber4LetterSetheightDefault =  yearNumber4LetterSet.height;

    var yearNumber3LetterSethoffsetDefault =  yearNumber3LetterSet.hoffset;
    var yearNumber3LetterSetvoffsetDefault =  yearNumber3LetterSet.voffset;
    var yearNumber3LetterSetwidthDefault =  yearNumber3LetterSet.width;
    var yearNumber3LetterSetheightDefault =  yearNumber3LetterSet.height;

    var yearNumber2LetterSethoffsetDefault =  yearNumber2LetterSet.hoffset;
    var yearNumber2LetterSetvoffsetDefault =  yearNumber2LetterSet.voffset;
    var yearNumber2LetterSetwidthDefault =  yearNumber2LetterSet.width;
    var yearNumber2LetterSetheightDefault =  yearNumber2LetterSet.height;

    var yearNumber1LetterSethoffsetDefault =  yearNumber1LetterSet.hoffset;
    var yearNumber1LetterSetvoffsetDefault =  yearNumber1LetterSet.voffset;
    var yearNumber1LetterSetwidthDefault =  yearNumber1LetterSet.width;
    var yearNumber1LetterSetheightDefault =  yearNumber1LetterSet.height;

    var dayNumber2LetterSethoffsetDefault =  dayNumber2LetterSet.hoffset;
    var dayNumber2LetterSetvoffsetDefault =  dayNumber2LetterSet.voffset;
    var dayNumber2LetterSetwidthDefault =  dayNumber2LetterSet.width;
    var dayNumber2LetterSetheightDefault =  dayNumber2LetterSet.height;

    var dayNumber1LetterSethoffsetDefault =  dayNumber1LetterSet.hoffset;
    var dayNumber1LetterSetvoffsetDefault =  dayNumber1LetterSet.voffset;
    var dayNumber1LetterSetwidthDefault =  dayNumber1LetterSet.width;
    var dayNumber1LetterSetheightDefault =  dayNumber1LetterSet.height;

    var flag01hoffsetDefault =  flag01.hoffset;
    var flag01voffsetDefault =  flag01.voffset;
    var flag01widthDefault =  flag01.width;
    var flag01heightDefault =  flag01.height;

    var flag02hoffsetDefault =  flag02.hoffset;
    var flag02voffsetDefault =  flag02.voffset;
    var flag02widthDefault =  flag02.width;
    var flag02heightDefault =  flag02.height;

    var flag03hoffsetDefault =  flag03.hoffset;
    var flag03voffsetDefault =  flag03.voffset;
    var flag03widthDefault =  flag03.width;
    var flag03heightDefault =  flag03.height;

    var flag04hoffsetDefault =  flag04.hoffset;
    var flag04voffsetDefault =  flag04.voffset;
    var flag04widthDefault =  flag04.width;
    var flag04heightDefault =  flag04.height;

    var flag05hoffsetDefault =  flag05.hoffset;
    var flag05voffsetDefault =  flag05.voffset;
    var flag05widthDefault =  flag05.width;
    var flag05heightDefault =  flag05.height;

    var crankhoffsetDefault =  crank.hoffset;
    var crankvoffsetDefault =  crank.voffset;
    var crankwidthDefault =  crank.width;
    var crankheightDefault =  crank.height;

    var topShelfhoffsetDefault =  topShelf.hoffset;
    var topShelfvoffsetDefault =  topShelf.voffset;
    var topShelfwidthDefault =  topShelf.width;
    var topShelfheightDefault =  topShelf.height;

    var mainCasingSurroundhoffsetDefault =  mainCasingSurround.hoffset;
    var mainCasingSurroundvoffsetDefault =  mainCasingSurround.voffset;
    var mainCasingSurroundwidthDefault =  mainCasingSurround.width;
    var mainCasingSurroundheightDefault =  mainCasingSurround.height;

    var cableCornerhoffsetDefault =  cableCorner.hoffset;
    var cableCornervoffsetDefault =  cableCorner.voffset;
    var cableCornerwidthDefault =  cableCorner.width;
    var cableCornerheightDefault =  cableCorner.height;

    var brassButtonShoffsetDefault =  brassButtonS.hoffset;
    var brassButtonSvoffsetDefault =  brassButtonS.voffset;
    var brassButtonSwidthDefault =  brassButtonS.width;
    var brassButtonSheightDefault =  brassButtonS.height;

    var brassButtonWhoffsetDefault =  brassButtonW.hoffset;
    var brassButtonWvoffsetDefault =  brassButtonW.voffset;
    var brassButtonWwidthDefault =  brassButtonW.width;
    var brassButtonWheightDefault =  brassButtonW.height;

    var topDigitalClockhoffsetDefault =  topDigitalClock.hoffset;
    var topDigitalClockvoffsetDefault =  topDigitalClock.voffset;
    var topDigitalClockwidthDefault =  topDigitalClock.width;
    var topDigitalClockheightDefault =  topDigitalClock.height;

    var minutesNumber2SethoffsetDefault =  minutesNumber2Set.hoffset;
    var minutesNumber2SetvoffsetDefault =  minutesNumber2Set.voffset;
    var minutesNumber2SetwidthDefault =  minutesNumber2Set.width;
    var minutesNumber2SetheightDefault =  minutesNumber2Set.height;

    var minutesNumber1SethoffsetDefault =  minutesNumber1Set.hoffset;
    var minutesNumber1SetvoffsetDefault =  minutesNumber1Set.voffset;
    var minutesNumber1SetwidthDefault =  minutesNumber1Set.width;
    var minutesNumber1SetheightDefault =  minutesNumber1Set.height;

    var hour2LetterSethoffsetDefault =  hour2LetterSet.hoffset;
    var hour2LetterSetvoffsetDefault =  hour2LetterSet.voffset;
    var hour2LetterSetwidthDefault =  hour2LetterSet.width;
    var hour2LetterSetheightDefault =  hour2LetterSet.height;

    var hour1LetterSethoffsetDefault =  hour1LetterSet.hoffset;
    var hour1LetterSetvoffsetDefault =  hour1LetterSet.voffset;
    var hour1LetterSetwidthDefault =  hour1LetterSet.width;
    var hour1LetterSetheightDefault =  hour1LetterSet.height;

    var cableWheelSethoffsetDefault =  cableWheelSet.hoffset;
    var cableWheelSetvoffsetDefault =  cableWheelSet.voffset;
    var cableWheelSetwidthDefault =  cableWheelSet.width;
    var cableWheelSetheightDefault =  cableWheelSet.height;

    var barhoffsetDefault =  bar.hoffset;
    var barvoffsetDefault =  bar.voffset;
    var barwidthDefault =  bar.width;
    var barheightDefault =  bar.height;

    var sliderSethoffsetDefault =  sliderSet.hoffset;
    var sliderSetvoffsetDefault =  sliderSet.voffset;
    var sliderSetwidthDefault =  sliderSet.width;
    var sliderSetheightDefault =  sliderSet.height;

    var cablehoffsetDefault =  cable.hoffset;
    var cablevoffsetDefault =  cable.voffset;
    var cablewidthDefault =  cable.width;
    var cableheightDefault =  cable.height;

    var clockSethoffsetDefault =  clockSet.hoffset;
    var clockSetvoffsetDefault =  clockSet.voffset;
    var clockSetwidthDefault =  clockSet.width;
    var clockSetheightDefault =  clockSet.height;

    var hourHandhoffsetDefault =  hourHand.hoffset;
    var hourHandvoffsetDefault =  hourHand.voffset;
    var hourHandwidthDefault =  hourHand.width;
    var hourHandheightDefault =  hourHand.height;

    var hourHandhRegistrationPointDefault = hourHand.hRegistrationPoint;
    var hourHandvRegistrationPointDefault = hourHand.vRegistrationPoint;

    var minuteHandhoffsetDefault =  minuteHand.hoffset;
    var minuteHandvoffsetDefault =  minuteHand.voffset;
    var minuteHandwidthDefault =  minuteHand.width;
    var minuteHandheightDefault =  minuteHand.height;

    var minuteHandhRegistrationPointDefault = minuteHand.hRegistrationPoint;
    var minuteHandvRegistrationPointDefault = minuteHand.vRegistrationPoint;

    var secondHandhoffsetDefault =  secondHand.hoffset;
    var secondHandvoffsetDefault =  secondHand.voffset;
    var secondHandwidthDefault =  secondHand.width;
    var secondHandheightDefault =  secondHand.height;

    var secondHandhRegistrationPointDefault = secondHand.hRegistrationPoint;
    var secondHandvRegistrationPointDefault = secondHand.vRegistrationPoint;

    var holehoffsetDefault =  hole.hoffset;
    var holevoffsetDefault =  hole.voffset;
    var holewidthDefault =  hole.width;
    var holeheightDefault =  hole.height;

    var grommethoffsetDefault =  grommet.hoffset;
    var grommetvoffsetDefault =  grommet.voffset;
    var grommetwidthDefault =  grommet.width;
    var grommetheightDefault =  grommet.height;

    var pinhoffsetDefault =  pin.hoffset;
    var pinvoffsetDefault =  pin.voffset;
    var pinwidthDefault =  pin.width;
    var pinheightDefault =  pin.height;

    var bellSethoffsetDefault =  bellSet.hoffset;
    var bellSetvoffsetDefault =  bellSet.voffset;
    var bellSetwidthDefault =  bellSet.width;
    var bellSetheightDefault =  bellSet.height;

    var clapperhoffsetDefault =  clapper.hoffset;
    var clappervoffsetDefault =  clapper.voffset;
    var clapperwidthDefault =  clapper.width;
    var clapperheightDefault =  clapper.height;

    var clapperRighthoffsetDefault =  clapperRight.hoffset;
    var clapperRightvoffsetDefault =  clapperRight.voffset;
    var clapperRightwidthDefault =  clapperRight.width;
    var clapperRightheightDefault =  clapperRight.height;

    var weekdayhoffsetDefault =  weekday.hoffset;
    var weekdayvoffsetDefault =  weekday.voffset;
    var weekdaywidthDefault =  weekday.width;
    var weekdayheightDefault =  weekday.height;

    var weekdaytexthoffsetDefault =  weekdaytext.hoffset;
    var weekdaytextvoffsetDefault =  weekdaytext.voffset;
    var weekdaytextwidthDefault =  weekdaytext.width;
    var weekdaytextheightDefault =  weekdaytext.height;

    var chainhoffsetDefault =  chain.hoffset;
    var chainvoffsetDefault =  chain.voffset;
    var chainwidthDefault =  chain.width;
    var chainheightDefault =  chain.height;

    var clockDeletionhoffsetDefault =   clockDeletion.hoffset;
    var clockDeletionvoffsetDefault =   clockDeletion.voffset;
    var clockDeletionwidthDefault   =   clockDeletion.width;
    var clockDeletionheightDefault  =   clockDeletion.height;

    var plaqueLinkhoffsetDefault =   plaqueLink.hoffset;
    var plaqueLinkvoffsetDefault =   plaqueLink.voffset;
    var plaqueLinkwidthDefault   =   plaqueLink.width;
    var plaqueLinkheightDefault  =   plaqueLink.height;

    var plaquetickhoffsetDefault =   plaquetick.hoffset;
    var plaquetickvoffsetDefault =   plaquetick.voffset;
    var plaquetickwidthDefault   =   plaquetick.width;
    var plaquetickheightDefault  =   plaquetick.height;
                                                     helpTop
    var helpTophoffsetDefault = helpTop.hoffset;
    var helpTopvoffsetDefault = helpTop.voffset;
    var helpTopwidthDefault =  helpTop.width;
    var helpTopheightDefault =  helpTop.height;

    var terminal00hoffsetDefault = terminal00.hoffset;
    var terminal01hoffsetDefault = terminal01.hoffset;
    var terminal02hoffsetDefault = terminal02.hoffset;
    var terminal03hoffsetDefault = terminal03.hoffset;
    var terminal04hoffsetDefault = terminal04.hoffset;
    var terminal05hoffsetDefault = terminal05.hoffset;
    var terminal06hoffsetDefault = terminal06.hoffset;
    var terminal07hoffsetDefault = terminal07.hoffset;
    var terminal08hoffsetDefault = terminal08.hoffset;
    var terminal09hoffsetDefault = terminal09.hoffset;
    var terminal10hoffsetDefault = terminal10.hoffset;
    var terminal11hoffsetDefault = terminal11.hoffset;
    var terminal12hoffsetDefault = terminal12.hoffset;
    var terminal13hoffsetDefault = terminal13.hoffset;
    var terminal14hoffsetDefault = terminal14.hoffset;
    var terminal15hoffsetDefault = terminal15.hoffset;

    var terminal00voffsetDefault = terminal00.voffset;
    var terminal01voffsetDefault = terminal01.voffset;
    var terminal02voffsetDefault = terminal02.voffset;
    var terminal03voffsetDefault = terminal03.voffset;
    var terminal04voffsetDefault = terminal04.voffset;
    var terminal05voffsetDefault = terminal05.voffset;
    var terminal06voffsetDefault = terminal06.voffset;
    var terminal07voffsetDefault = terminal07.voffset;
    var terminal08voffsetDefault = terminal08.voffset;
    var terminal09voffsetDefault = terminal09.voffset;
    var terminal10voffsetDefault = terminal10.voffset;
    var terminal11voffsetDefault = terminal11.voffset;
    var terminal12voffsetDefault = terminal12.voffset;
    var terminal13voffsetDefault = terminal13.voffset;
    var terminal14voffsetDefault = terminal14.voffset;
    var terminal15voffsetDefault = terminal15.voffset;

    var CopyrighthoffsetDefault  = Copyright.hoffset;
    var CopyrightvoffsetDefault  = Copyright.voffset;
    var TermshoffsetDefault      = Terms.hoffset;
    var TermsvoffsetDefault      = Terms.voffset;
    var PrivacyhoffsetDefault    = Privacy.hoffset;
    var PrivacyvoffsetDefault    = Privacy.voffset;
    var DownloadhoffsetDefault   = Download.hoffset;
    var DownloadvoffsetDefault   = Download.voffset;
    var ReadhoffsetDefault       = Read.hoffset;
    var ReadvoffsetDefault       = Read.voffset;

    //

    pastimage.src= "";
    var shiftKeyFlag = 0;
    var timeDeviation = 0;
    var timeDeviationFlg = 0;
    var lastCrankPosition = "up";
    var pendulumPressed = 0;
    var rotatorTypeClicked = 0;

//===========================================
// Startup function
//===========================================
function startup()
{

   if (debugFlg === 1) {print("%KON-I-INFO,Running startup "+ preferences.hrPref.value)};
   screenwrite("Steampunk O/S ver 1.0 (mechanical 0.1 hz)");
   screenwrite("Copyright Lightquick (Imperial Industries) ");
   screenwrite("Running startup "+ preferences.hrPref.value);

    debugFlg = preferences.debugflgPref.value;
    if (debugFlg === "1") {
		preferences.imageEditPref.hidden=false;
	} else {
		preferences.imageEditPref.hidden=true;		
	}

// Resize the clock

   resizeClock();

// check the widget is on-screen
   mainScreen();

// create the licence window
   createLicence(mainWindow);

// Read preferences

   mutechimes = preferences.chimesPref.value;
   tickingPrefFlg = preferences.soundsPref.value;
   pendulumPrefFlg = preferences.pendulumPref.value;
   dropdown.visible= false;

// preferences determine sound volume on startup

   changeLoudness();

// preferences determine sound volume on startup

   SetCrankPositiononStartup();

// preferences determine loud button position on startup

   setBrassbuttonLOnStartup();

// hide pendulum on startup if the configuration states to do so

   setThePendulum();

// put the icon in the dock

   showdockicon();

// check whether ticking or not

   checkticking();

   screenwrite("volume is set to "+ preferences.soundLevelPref.value);
   if (debugFlg === 1) {print("%KON-I-INFO,Volume is set to "+ preferences.soundLevelPref.value)};

// mute chime

   togglechimes();

   screenwrite("chime is set to "+ preferences.chimesPref.value);
   //if (debugFlg === 1) {print("%KON-I-INFO,Chime is set to "+ preferences.chimesPref.value)};

// function to count the alarms

   determineNextAlarmAvailable();

//check the alarms and prepare to ring a bell

   ShallWeRingAlarm();

//check the alarms and raise a flag

   pushOutAlarmToggles();

//check the alarms and raise a flag

   checkLockState();

//set the visibility of the weekday indicator

   setWeekdayIndicator();

//set the visibility of the console screen

   screenset();

//set the visibility of the console screen

   checkbackscreen();

//set the visibility of the time machine screen

   checktimemachine();

// build the menu

   setmenu();

// this is an important parameter - it determines what happens in some functions that
// are called during startup and normal running.

//run the main routine once during startup

   updateTime();

// trigger the build of the vitality.

   vitalitycnt = 59;

// show the help page on startup

   if (prefsFlg === 1) {
   		prefsFlg = 0;
   	} else {
        showHelpPage();
   }

// change the runmode from startup

   runmode = "running";
}
//=====================
//End function startup
//=====================


//======================================================================================
// Function to move the main_window onto the main screen
//======================================================================================
function mainScreen() {
    
    // if the mainWindow is not visible all the v/hoffsets return a false (-1) value
    mainWindow.visible = true;
    
    // if the widget is off screen then move into the viewable window
    if (mainWindow.hOffset < -332) {
        mainWindow.hOffset = -300;
    }
    if (mainWindow.vOffset  < -225) {
        mainWindow.vOffset = -150; // avoid Mac toolbar
    }
    if (mainWindow.hOffset +332 > screen.width - 50) {
        mainWindow.hOffset = screen.width - mainWindow.width;
    }
    if (mainWindow.vOffset +270> screen.height - 50) {
        mainWindow.vOffset = screen.height - (mainWindow.height - 300 ); // avoid Mac toolbar
    }
    // calculate the current hlocation in % of the screen
    //store the current hlocation in % of the screen
    if ( preferences.hLocationPercPref.value != 0) {
      preferences.hLocationPercPref.value = (mainWindow.hoffset / screen.width)* 100;
    }
    if ( preferences.vLocationPercPref.value != 0) {
      preferences.vLocationPercPref.value = (mainWindow.voffset / screen.height)* 100;
    }
    // now move the widget to a preferred location if one has been set
    if (preferences.hoffsetpref.value > 0) {
        mainWindow.hOffset = parseInt(preferences.hoffsetpref.value, 10);
    }
    if (preferences.voffsetpref.value > 0) {
        mainWindow.vOffset = parseInt(preferences.voffsetpref.value, 10);
    }

}
//=====================
//End function
//=====================


//===========================================
// this function opens the online help file
//===========================================
function menuitem1OnClick() {
    var answer = alert("This button opens a browser window and connects to the help page for this widget. Do you wish to proceed?", "Open Browser Window", "No Thanks");
    if (answer === 1) {
		openURL("https://www.facebook.com/profile.php?id=100012278951649");
    }
}
//=====================
//End function
//=====================

//===========================================
// this function opens the URL for paypal
//===========================================
function menuitem2OnClick() {
    var answer = alert("Help support the creation of more widgets like this, send us a beer! This button opens a browser window and connects to the Paypal donate page for this widget). Will you be kind and proceed?", "Open Browser Window", "No Thanks");
    if (answer === 1) {
                openURL("https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=info@lightquick.co.uk&currency_code=GBP&amount=2.50&return=&item_name=Donate%20a%20Beer");
    }
}
//=====================
//End function
//=====================


//===========================================
// this function opens my Amazon URL wishlist
//===========================================
function menuitem3OnClick() {
    var answer = alert("Help support the creation of more widgets like this. Buy me a small item on my Amazon wishlist! This button opens a browser window and connects to my Amazon wish list page). Will you be kind and proceed?", "Open Browser Window", "No Thanks");
    if (answer === 1) {
        openURL("http://www.amazon.co.uk/gp/registry/registry.html?ie=UTF8&id=A3OBFB6ZN4F7&type=wishlist");
    }
}
//=====================
//End function
//=====================

//===========================================
// this function opens other widgets URL
//===========================================
function menuitem5OnClick() {
    var answer = alert("This button opens a browser window and connects to the Steampunk widgets page on my site. Do you wish to proceed", "Open Browser Window", "No Thanks");
    if (answer === 1) {
		openURL("https://www.deviantart.com/yereverluvinuncleber/gallery/59981269/yahoo-widgets");
    }
}
//=====================
//End function
//=====================
//===========================================
// this function opens the download URL
//===========================================
function menuitem6OnClick() {
    var answer = alert("Download latest version of the widget - this button opens a browser window and connects to the widget download page where you can check and download the latest zipped .WIDGET file). Proceed?", "Open Browser Window", "No Thanks");
    if (answer === 1) {
		openURL("https://www.deviantart.com/yereverluvinuncleber/art/Steampunk-Clock-Calendar-MKII-2-9-RC-277413550");
        
        //openURL("http://lightquick.co.uk/jdownloads/steampunk-clock-calendar-yahoo-widget.html?Itemid=264");
    }
}
//=====================
//End function
//=====================
//===========================================
// this function opens the browser at the contact URL
//===========================================
function menuitem7OnClick() {
    var answer = alert("Visiting the support page - this button opens a browser window and connects to our contact us page where you can send us a support query or just have a chat). Proceed?", "Open Browser Window", "No Thanks");
    if (answer === 1) {
		openURL("http://www.facebook.com/profile.php?id=100012278951649");
    }
}
//=====================
//End function
//=====================


//===========================================
// this function opens the browser at the contact URL
//===========================================
function facebookChat() {
    var answer = alert("Visiting the Facebook chat page - this button opens a browser window and connects to our Facebook chat page.). Proceed?", "Open Browser Window", "No Thanks");
    if (answer === 1) {
        openURL("http://www.facebook.com/profile.php?id=100012278951649");
    }
}
//=====================
//End function
//=====================

//===========================================
// this function edits the widget
//===========================================
function editWidget() {
    //var answer = alert("Editing the widget. Proceed?", "Open Editor", "No Thanks");
    //if (answer === 1) {
		//uses the contents of imageEditPref to initiate your default editor
        performCommand("menu");
    //}
}
//=====================
//End function
//=====================



//===========================================
// this function allows a spacer in the menu
//===========================================
function nullfunction() { print("null"); }
//=====================
//End function
//=====================

//===========================================
// this function causes explorer to be opened and the file selected
//===========================================
function findWidget() {

 var widgetName = "Steampunk clock calendar MKII.widget";
		// temporary development version of the widget
 var widgetFullPath = convertPathToPlatform(system.userWidgetsFolder + "/" + widgetName);
 var alertString = "The widget folder is: \n";
 alertString += system.userWidgetsFolder + " \n\n";
 alertString += "The widget name is: \n";
 alertString += widgetName+".\n ";
 var answer = alert(alertString, "Open the widget's folder?", "No Thanks");
 if (answer === 1) {
            if (filesystem.itemExists(widgetFullPath) )   {
              //dosCommand = "Explorer.exe /e, /select,E:\\Documents and Settings\\Dean Beedell\\My Documents\\My Widgets\\mars 2.widget";
              dosCommand = "Explorer.exe /e, /select," + widgetFullPath;
              //print("dosCommand "+dosCommand);
              //var explorerExe = runCommand(dosCommand, "bgResult");
              filesystem.reveal(widgetFullPath);
            }
 }
}
//=====================
//End function
//=====================


//======================================================================================
// function 
//======================================================================================
widget.onRunCommandInBgComplete = function () {
    var theTag = system.event.data;
    //print("onRunCommandInBgComplete for tag: " + bgresult);
    if (theTag === "runningTask") {
        if (widget.debug === "on") {
            //print(preferences.imageCmdPref.value + "\n\n" + runningTask);
        } else {
            //alert(preferences.imageCmdPref.value + "\n\n" + runningTask);
        }
    }
};
//=====================
//End function
//=====================

//=========================================================================
// this function assigns translations to preference descriptions and titles
//=========================================================================
function setmenu() {
    	var items = [], item;

        item = new MenuItem();
        item.title = "Buy a beer with Paypal";
        item.onSelect = function () {
            menuitem2OnClick();
        };
	items.push(item);

        item = new MenuItem();
        item.title = "Donate some candy/sweets via Amazon";
        item.onSelect = function () {
            menuitem3OnClick();
        };
	items.push(item);

        item = new MenuItem();
        item.title = "";
        item.onSelect = function () {
            nullfunction();
        };
	items.push(item);

        item = new MenuItem();
        item.title = "See More Steampunk Widgets";
        item.onSelect = function () {
            menuitem5OnClick();
        };
	items.push(item);

	item = new MenuItem();
	item.title = "Download Latest Version";
	item.onSelect = function () {
		menuitem6OnClick();
	};
	items.push(item);
        
       	item = new MenuItem();
	item.title = "Display Licence Agreement...";
	item.onSelect = function () {
		displayLicence();
	};
	items.push(item);

	item = new MenuItem();
	item.title = "Contact Support";
	item.onSelect = menuitem7OnClick;
	items.push(item);

        item = new MenuItem();
        item.title = "";
        item.onSelect = function () {
            nullfunction();
        };
	items.push(item);

       	item = new MenuItem();
	item.title = "Chat about Steampunk Widgets on Facebook";
	item.onSelect = function () {
		facebookChat();
	};
	items.push(item);

        item = new MenuItem();
        item.title = "";
        item.onSelect = function () {
            nullfunction();
        };
	items.push(item);

	item = new MenuItem();
	item.title = "Reveal Widget in Windows Explorer";
	item.onSelect = function () {
		findWidget();
	};
	items.push(item);

        item = new MenuItem();
        item.title = "";
        item.onSelect = function () {
            nullfunction();
        };
	items.push(item);
	
	if (preferences.imageEditPref.value != "" && debugFlg === "1") {
		mItem = new MenuItem();
		mItem.title = "Edit Widget using " + preferences.imageEditPref.value ;
		mItem.onSelect = function () {
			editWidget();
		};
			items.push(mItem);
	}


	

	item = new MenuItem();
	item.title = "Reload Widget (F5)";
	item.onSelect = function () {
		reloadWidget();
	};
	items.push(item);
	mainWindow.contextMenuItems = items;

}
//=====================
//End function
//=====================


//=====================================================================================
// function to put a small icon into the dock before the vitality routine gets a chance
//=====================================================================================
function showdockicon()
{
   var dockIcon=XMLDOM.parse(filesystem.readFile("dock.xml"));
   widget.setDockItem(dockIcon);
   //mainWindow.visible = true;
   screenwrite("running showdockicon");
   if (debugFlg === 1) {print("%KON-I-INFO, Running showdockicon")};
}
//=====================
//End function
//=====================



//===========================================
// this is the main function that really does all the work
//===========================================
function updateTime()
{

// bespoke cursor
   mainWindow.style.cursor = "Resources/pointer.cur";
   //style.cursor = "url(icons/cursor.cur)";

//initialise the time function

   time = new Date();

//returns the date/time in a string format

   //returns the date/time in a string format
   hr= time.getHours();
   mn= time.getMinutes();
   se = time.getSeconds();
   dt= time.getDate();
   wkd= time.getDay();
   mnth= time.getMonth();
   yr= time.getFullYear();

   returndateandtimevalues();

//display the letters and numbers of the time

   updatecounters();

//display the letters and numbers of the day of the week  MON, TUE &c

   updateweekday();

// check preferences once every second to hide pendulum

   setThePendulum();

// build vitality periodically

   vitality();

// mute chime - not required in the one second timer

   mutechimes = preferences.chimesPref.value;
   //if (debugFlg === 1) {print("%KON-I-INFO,chime ",mins,secs,chime2,mutechimes = preferences.chimesPref.value)};
   if (mutechimes == "no chime")
   {
         //do nothing I suppose in this empty block
   }
   else
   {
        if ((mins == 14) && (secs == 58)) // 2 seconds before
        {
	       
        		if (preferences.soundPref === "enabled") {
        		play(chime1, false);
        	}
           screenwrite("chiming quarter hour");
           if (debugFlg === 1) {print("%KON-I-INFO,chiming quarter hour ",chime1,mutechimes, preferences.chimesPref.value)};
	}
	else if ((mins == 29) && (secs == 54)) // 6 seconds before
        {
	       
        if (preferences.soundPref === "enabled") {
        		play(chime2, false);
        	}
	   screenwrite("chiming half hour ");
           if (debugFlg === 1) {print("%KON-I-INFO,chiming half hour ",chime2,mutechimes, preferences.chimesPref.value)};
        }
	else if ((mins == 44) && (secs == 51))  //9 seconds before
        {
	       
        if (preferences.soundPref === "enabled") {
        		play(chime3, false);
        	}
           screenwrite("chiming three-quarter hour ");
           if (debugFlg === 1) {print("%KON-I-INFO,chiming three-quarter hour ",chime3,mutechimes, preferences.chimesPref.value)};
	}
	else if ((mins == 59) && (secs == 42))     // 18 seconds before the o'clock
        {
          // this should occur
	       
        if (preferences.soundPref === "enabled") {
        		play(chime4, false);
        	}
           screenwrite("chiming  full hour ");
           if (debugFlg === 1) {print("%KON-I-INFO,chiming  full hour ",chime4,mutechimes, preferences.chimesPref.value)};
           bellTimer.ticking = true;
        }

   //check the alarms and prepare to ring a bell

        ShallWeRingAlarm();
   }
}
//=====================
//End function updatetime()
//=====================

//=========================================================
// Function to stretch the cable
//=========================================================
function stretchCable() {
//now calculate the stretch of the cable
    cable.hOffset = sliderSet.hOffset + (sliderSet.width);
    cable.Width = (cableWheelSet.hOffset + cableWheelSet.width) - (cable.hOffset);
}
//=====================
//End function
//=====================

//===========================================
// function to pull down the help canvas
//===========================================
function dropdownmove()
{
    //if (debugFlg === 1) {print("%KON-I-INFO,mousedown registered here ")};
    if (dropdownactive === false)
    {
        
        	if (preferences.soundPref === "enabled") {
        		play(rollerblind, false);
        	}
        dropdownactive = true;
 	dropdown.voffset = 420 * (clockScale / 100);
 	drawstring.voffset = 602 * (clockScale / 100);
 	dropdownactive = true;
 	dropdown.visible= true;
        screenwrite("Dropdown canvas rolling down");
    }
    else {
        
        	if (preferences.soundPref === "enabled") {
        		play(rollerblindup, false);
        	}
        dropdownactive = false;
	dropdown.voffset =239 * (clockScale / 100);
 	drawstring.voffset = 420 * (clockScale / 100);
 	dropdown.visible= false;
        screenwrite("Dropdown canvas rolling up");
    }
    if (debugFlg === 1) {print("%KON-I-INFO,Running dropdownmove")};
}
//=====================
//End function
//=====================

//===========================================
// function to pull down the help canvas
//===========================================
function helpdropdownmove()
{
       displayHelp1();
       if ( preferences.showHelpPref.value == "display" ) {
          helpBottom.visible = true;
          helpTop.visible = true;
      	      
        	if (preferences.soundPref === "enabled") {
        		play(pageFumble, false);
        	}
       }

}
//=====================
//End function
//=====================

//===========================================
// function to close down the big help canvas
//===========================================
function closehelpdropdown()
{
        //not quite sure why I have to make this woodenBar visible again, but I do...
        helptext.visible= false;
        alarmtext.visible= false;
        termstext.visible= false;
        
        	if (preferences.soundPref === "enabled") {
        		play(rollerblindup, false);
        	}
        Copyright.visible = false;
        Terms.visible = false;
        Privacy.visible = false;
        Download.visible = false;
        Read.visible = false;
        bigdropdowncanvas.visible= false;
       	helpDrawstring.visible= false;
        //about the largest interval that I can use where the sleep goes largely unnoticed elsewhere
        sleep(500);
        
        if (preferences.soundPref === "enabled") {
        		play(clunk, false);
        	}
        woodenBar.visible=false;
        helpbrassbutton.visible=false;
}
//=====================
//End function
//=====================

//===========================================
// function to switch on the alarm system
//===========================================
function switchAlarmsOn()
{
  today=new Date();
  //alarmtime = 0;
  clockTimer.ticking=false;

  //alarmtime = today.getTime();  //no. of milliseconds since 1970
  basetimecurrent = today.getTime();  //no. of milliseconds since 1970
  //if (debugFlg === 1) {print("%KON-I-INFO,basetimecurrent ",basetimecurrent);};

  //take the offset from the middle of the slider and divide by 100;
  timeaccelerationfactor = 100/54;
  //if (debugFlg === 1) {print("%KON-I-INFO,timeaccelerationfactor ",timeaccelerationfactor);};

  screenwrite("Leaving Clock Alarm Mode");
  screenwrite("Entering Alarm Mode");
  screenwrite("Slider Mechanism Released, click bell to set");

  //display the correct till pop up

  //if (alarmToUse == 0) {
    determineNextAlarmAvailable();
  //}
  // if no alarms have been set then display the drop down
  //if (debugFlg === 1) {print("%KON-I-INFO,mousedown registered here ", alarmToUse);};

  brassbuttonA.hoffset = ( 295 * (clockScale / 100));
      
        if (preferences.soundPref === "enabled") {
        		play(clunk, false);
        	}

 	//release the slider mechanism
  sliderMechanismStatus = "released";
      
        if (preferences.soundPref === "enabled") {
        		play(zzzz, false);
        	}

  sleep(300);

  sliderSet.hoffset = Math.round( 395 * (clockScale / 100));
  orangeHeaterGlow.hoffset = Math.round( 425 * (clockScale / 100));
  stretchCable();
  resetTillAndToggles();
  sleep(1000);
      
        if (preferences.soundPref === "enabled") {
        		play(till, false);
        	}


  if  (alarmToUse == 1)
  {
      till01.visible=true;
      flag01.hoffset=flag01HoffsetOut;
  }
  if  (alarmToUse == 2)
  {
      till02.visible=true;
      flag02.hoffset=flag02HoffsetOut;
  }
  if  (alarmToUse == 3)
  {
      till03.visible=true;
      flag03.hoffset=flag03HoffsetOut;
  }
  if  (alarmToUse == 4)
  {
      till04.visible=true;
      flag04.hoffset=flag04HoffsetOut;
  }
  if  (alarmToUse == 5)
  {
      till05.visible=true;
      flag05.hoffset=flag05HoffsetOut;
  }
}
//=====================
//End function
//=====================

//===========================================
// Function to slide the time slider mouse down
//===========================================
function getmousedown()
{
   sliderSetClicked = true;
   if (sliderMechanismStatus == "held") {
        screenwrite("slider mechanism held, press A to release");
        if (debugFlg === 1) {print("%KON-I-INFO,attempting to move slider before alarm button pressed");};
   } else {
            counterTimer.ticking= true;
   }
}
//=====================
//End function
//=====================

//===========================================
// Function to handle the time slider mouse up
//===========================================
function sliderSetOnMouseUp()
{
  if(sliderSetClicked === true)
   {
      sliderSetClicked = false;
      sliderSet.onMouseMove= null;
   }
   //if (debugFlg === 1) {print("%KON-I-INFO, shiftKeyFlag "+shiftKeyFlag);};
   if (sliderMechanismStatus == "released" && shiftKeyFlag == 0) {
       //return slider to middle position
       counterTimer.ticking= false;
       sliderSet.hoffset = Math.round( 395 * (clockScale / 100));
       orangeHeaterGlow.hoffset = Math.round( 425 * (clockScale / 100));
       stretchCable();
   }
   shiftKeyFlag = 0;
}
//=====================
//End function
//=====================

//===========================================
// Function to slide the slider
//===========================================
function sliderSetOnMouseMove() {
      if (sliderMechanismStatus == "held") {
            
        if (preferences.soundPref === "enabled") {
        		play(buzzer, false);
        	}
      }
      else
      {
        sliderSet.hOffset = system.event.hOffset - (35* (clockScale / 100));
        constrainSliderSet();
      }
}
//=====================
//End function
//=====================


//===========================================
// Function to constraing the time slider within bounds
//===========================================
function constrainSliderSet() {
    var rightmost,
        leftmost,
        sliderwidth,
        currpos;

    if (sliderMechanismStatus == "held") {
               
        if (preferences.soundPref === "enabled") {
        		play(buzzer, false);
        	}
    } else {
        if(sliderSetClicked === true) {
            //turn off the weekday indicator as it would be continuously changing (and dinging)
            if (preferences.weekdayPref.value == "raised")
            {
                   weekdaytoggle();
            }
            //determine slider travel limits
            rightmost = bar.hOffset + bar.width - (113 * (clockScale / 100)); //leftmost limit
            leftmost = bar.hOffset + (25 * (clockScale / 100)); // rightmost limit
            if (sliderSet.hOffset >= rightmost) { //568
                sliderSet.hOffset = rightmost;
            }
            if (sliderSet.hOffset <= leftmost) { //262
                sliderSet.hOffset = leftmost;
            }
            orangeHeaterGlow.hoffset = sliderSet.hoffset+(32* (clockScale / 100));
            //acceleration = timeaccelerationfactor * (sliderSet.hoffset - (396* (clockScale / 100)));
            counterTimer.ticking= true;

            stretchCable();

            if (preferences.rangeMathPrefFlg.value == "maths") {
               //calculate the percentage
                sliderwidth = rightmost - leftmost;
                currpos = sliderSet.hOffset - leftmost;
                perc = parseInt((currpos / sliderwidth) * 100, 10);
                if (perc < 0) {
                    perc = 0;
                }
                // determine the percentage from the middle of the slider
                if (perc <=50) {  // negative value
                    
                    if (timeDeviationFlg == 1) {
                       timecount = 0;     // this zeroes the timecount when the slider was previously positive
                    }
                    timeDeviationFlg = 0;
                    perc = perc - 50;
                    perc = perc * 2;
                    perc = Math.abs(perc);
                } else if (perc >50) { // positive
                    if (timeDeviationFlg == 0) {
                       timecount = 0;     // this zeroes the timecount when the slider was previously negative
                    }
                    timeDeviationFlg = 1;
                    perc = perc - 50;
                    perc = perc * 2;
                }
                //if (debugFlg === 1) {print("%KON-I-INFO, perc before "+perc);};
                // given a percentage calculates the logarithmic value
                timeDeviation = logslider(perc);
                //if (debugFlg === 1) {print("%KON-I-INFO, timeDeviation "+timeDeviation);};
            }
            vitality();
                
        	if (preferences.soundPref === "enabled") {
        		play(zzzz, false);
        	}
        }
    }
}
//=====================
//End function
//=====================



//===========================================
// Function to slide the volume slider
//===========================================
sliderSet.onMouseWheel = function () {
//function sliderSetOnMouseWheel() {
    var delta = system.event.scrollDelta;
      if (sliderMechanismStatus == "held") {
                 
        	if (preferences.soundPref === "enabled") {
        		play(buzzer, false);
        	}
      }
      else
      {
      sliderSetClicked = true;
        if (delta !== 0) {
            sliderSet.hOffset += delta * (clockScale / 100);
            constrainSliderSet();
        }
      }
}
//=====================
//End function
//=====================

//===========================================
// Function to determine what happens when the mouse is pressed on the size slider
//===========================================
function sliderSetOnMouseDown() {
//      if (debugFlg === 1) {print("%KON-I-INFO,Running function sliderSetOnMouseDown");};
    checkTimer.ticking = false;
    sliderSetClicked = true;
    shiftKeyFlag = 0;
//      if (debugFlg === 1) {print("%KON-I-INFO,Leaving function sliderSetOnMouseDown " +clicked);};
}
//=====================
//End function
//=====================


//===========================================
// function to play sounds
//===========================================
function tick() {
   if (preferences.soundsPref.value == "tick")
    {
      tickTimer.interval = 30;
          
        if (preferences.soundPref === "enabled") {
        		play(tickingSound, false);
        	}
    }
}
//=====================
//End function
//=====================

//===========================================
// function to toll the bell x no. of times, called by the belltimer
//===========================================
function tollbell ()
{
     var tollhours = hr;
     //stop it striking more than 12 times on a 24hr clock
     if (preferences.hrPref.value == "24hr")
     {
        if (hr>12) {tollhours=(hr-12);}
     }

     //do not ask for whom the bell tolls, it tolls for thee...when the counter reaches 8
     if (tollbellcount >= 8)
     {
             
        if (preferences.soundPref === "enabled") {
        		play(belltoll01, false);
        	}
       	 tollbellcount = tollbellcount + 1;
         screenwrite( "toll no."+ (tollbellcount-8) +" for "+hr+ " o'clock + belltimer = "+ bellTimer.ticking);
         if (debugFlg === 1) {print("%KON-I-INFO,tollbellcount =  ",tollbellcount, " tolling the hour ",hr, "o'clock , belltimer is set to ", bellTimer.ticking);};
     }
     else         //pause for 16 seconds (8 x belltimer.interval (2))
     {
	 tollbellcount = tollbellcount + 1;
         screenwrite("tollbellcount =  "+tollbellcount);
         if (debugFlg === 1) {print("%KON-I-INFO,tollbellcount =  ",tollbellcount );};
     }
     // turn off the belltimer to stop the bell from tolling

     if (tollbellcount >= tollhours+8)
     {
            bellTimer.ticking= false;
            tollbellcount = 0;
            screenwrite("Just struck "+hr+ " o'clock, belltimer set to "+ bellTimer.ticking);
            if (debugFlg === 1) {print("%KON-I-INFO,tollbellcount =  ",tollbellcount + " completed tolling the bell, just struck ",hr, "o'clock, belltimer is now set to ", bellTimer.ticking);};
     }
}
//=====================
//End function
//=====================

//===========================================
// function to check ticking
//===========================================
function checkticking()
{
// if the preferences say tick then tick on startup!
   if (tickingPrefFlg != preferences.soundsPref.value || runmode == "startup")
   {
         screenwrite("ticking changed from "+tickingPrefFlg+ " to "+ preferences.soundsPref.value);
         if (debugFlg === 1) {print("%KON-I-INFO,ticking changed from",tickingPrefFlg, "to", preferences.soundsPref.value);};

         if (preferences.soundsPref.value == "tick")
            {
                tickTimer.ticking = true;
                tickTimer.reset();
                tickTimer.interval=30;
                if (runmode != "startup") {tick();}
            }
         else
            {
                    
        	if (preferences.soundPref === "enabled") {
        		play(nothing, true);
        	}
                tickTimer.ticking = false;
                tickTimer.reset();
            }
         tickingPrefFlg = preferences.soundsPref.value;
   }
}
//=====================
//End function
//=====================

//===========================================
// function to turn off the pendulum when clicked
//===========================================
function setThePendulum() {
   if (pendulumPrefFlg != preferences.pendulumPref.value || runmode == "startup")
   {
      if (debugFlg === 1) {print("%KON-I-INFO,runmode =",runmode);};
      if (debugFlg === 1) {print("%KON-I-INFO,setting pendulum from",pendulumPrefFlg, "to", preferences.pendulumPref.value);};
      screenwrite("setting pendulum from "+pendulumPrefFlg+ " to "+ preferences.pendulumPref.value);
      if (preferences.pendulumPref.value == "swing")
         {
             pendulumSet.visible = true;
             pendulumTimer.ticking = true;
             pendulumSet.rotation = 180 + angle;
             pendulumPrefFlg = "swing";
             preferences.pendulumPref.value = pendulumPrefFlg ;
             brassbuttonP.hoffset = ( 295 * (clockScale / 100));
             pendulumSet.voffset = ( 292 * (clockScale / 100));
             //alert("here 1");
             if (debugFlg === 1) {print("%KON-I-INFO, 1. pendulumSet.voffset " + pendulumSet.voffset)};
         }
      else
         {
             pendulumSet.visible = true;
             pendulumTimer.ticking = false;
             pendulumPrefFlg = "noswing";
             preferences.pendulumPref.value = pendulumPrefFlg ;
             brassbuttonP.hoffset = ( 290 * (clockScale / 100));
             pendulumSet.voffset = ( 587 * (clockScale / 100))
             //alert("here 1");
             if (debugFlg === 1) {print("%KON-I-INFO, 2. pendulumSet.voffset " + pendulumSet.voffset)};
         }
         pendulumPrefFlg = preferences.pendulumPref.value;
   }
}
//=====================
//End function
//=====================


//===========================================
// function to hide the pendulum
//===========================================
function  togglethependulum()
{
      pendulumPressed = 1;
      if (preferences.pendulumPref.value == "swing")
         {
             pendulumTimer.ticking = false;
             pendulumPrefFlg = "noswing";
             preferences.pendulumPref.value = pendulumPrefFlg ;
             brassbuttonP.hoffset = ( 290 * (clockScale / 100));
             pendulumSet.voffset = ( 292 * (clockScale / 100));
                 
        if (preferences.soundPref === "enabled") {
        		play(clunk, false);
        	}
             screenwrite("pendulum "+pendulumPrefFlg);
             //alert("here 2");
             if (debugFlg === 1) {print("%KON-I-INFO, pendulum 4 " + pendulumPrefFlg)};

         }
      else
         {
             pendulumSet.rotation = 180 +angle
             pendulumTimer.ticking = true;
             pendulumPrefFlg = "swing";
             preferences.pendulumPref.value = pendulumPrefFlg ;
             brassbuttonP.hoffset = ( 295 * (clockScale / 100));
             pendulumSet.voffset = ( 292 * (clockScale / 100));
             //alert("here 2");
             if (debugFlg === 1) {print("%KON-I-INFO, 4. pendulumSet.voffset " + pendulumSet.voffset)};
             
                 
        if (preferences.soundPref === "enabled") {
        		play(clunk, false);
        	}
             screenwrite("pendulum "+pendulumPrefFlg);
             if (debugFlg === 1) {print("%KON-I-INFO, pendulum 5 " + pendulumPrefFlg)};
         }
         pendulumPrefFlg = preferences.pendulumPref.value;
}
//=====================
//End function
//=====================


//===========================================
// function to check and change the loudness
//===========================================
function setBrassbuttonMOnStartup () {

   //if (debugFlg === 1) {print("%KON-I-INFO, preferences.chimesPref.value "+preferences.chimesPref.value);};
   if (preferences.chimesPref.value == "no chime")
   {
       brassbuttonM.hoffset = ( 295 * (clockScale / 100));
   }
   else
   {
       brassbuttonM.hoffset = ( 290 * (clockScale / 100));
   }
}
//=====================
//End function
//=====================


//===========================================
// function to check and change the loudness
//===========================================
function setBrassbuttonTOnStartup () {

   //if (debugFlg === 1) {print("%KON-I-INFO, preferences.chimesPref.value "+preferences.chimesPref.value);};
   if (preferences.timeMachinePrefFlg.value == "raised" )
   {
        brassButtonT.hoffset=(320 * (clockScale / 100)) ;
   }
   else
   {
        brassButtonT.hoffset=(315 * (clockScale / 100)) ;
   }
}
//=====================
//End function
//=====================


//===========================================
// function to check and change the loudness
//===========================================
function setBrassbuttonSOnStartup () {

   //if (debugFlg === 1) {print("%KON-I-INFO, preferences.chimesPref.value "+preferences.chimesPref.value);};
   if (preferences.screenPrefFlg.value == "raised")
   {
        brassButtonS.hoffset=(335 * (clockScale / 100)) ;
   }
   else
   {
        brassButtonS.hoffset=(330 * (clockScale / 100)) ;
   }
}
//=====================
//End function
//=====================

//===========================================
// function to check and change the loudness
//===========================================
function setBrassbuttonWOnStartup () {

   //if (debugFlg === 1) {print("%KON-I-INFO, preferences.chimesPref.value "+preferences.chimesPref.value);};
   if (preferences.weekdayPref.value == "raised")
   {
        brassButtonW.hoffset=(335 * (clockScale / 100)) ;
   }
   else
   {
        brassButtonW.hoffset=(330 * (clockScale / 100)) ;
   }
}
//=====================
//End function
//=====================


//===========================================
// function to check and change the loudness
//===========================================
function setBrassbuttonPOnStartup () {

   //if (debugFlg === 1) {print("%KON-I-INFO, preferences.chimesPref.value "+preferences.chimesPref.value);};
   if (preferences.pendulumPref.value == "swing")
   {
       brassbuttonP.hoffset = ( 295 * (clockScale / 100));
   }
   else
   {
       brassbuttonP.hoffset = ( 290 * (clockScale / 100));
   }
}
//=====================
//End function
//=====================


//===========================================
// function to check and change the loudness
//===========================================
function setBrassbuttonBOnStartup () {

   //if (debugFlg === 1) {print("%KON-I-INFO, preferences.chimesPref.value "+preferences.chimesPref.value);};
   if (preferences.backscreenPrefFlg.value == "raised")
   {
        brassButtonB.hoffset=(575 * (clockScale / 100)) ;
   }
   else
   {
        brassButtonB.hoffset=(582 * (clockScale / 100)) ;
   }
}
//=====================
//End function
//=====================


//===========================================
// function to check and change the loudness
//===========================================
function togglechimes () {
   if (preferences.chimesPref.value == "no chime" || runmode == "startup")
   {
       preferences.chimesPref.value = "chime";
       screenwrite("unmute chimes volume from no chime to chime");
       if (debugFlg === 1) {print("%KON-I-INFO, unmute chimes volume from no chime to chime ")};
       chimesOn ();
   }
   else
   {
       preferences.chimesPref.value = "no chime";
       screenwrite("mute chime volume from chime to nochime");
       if (debugFlg === 1) {print("%KON-I-INFO,unmute chimes volume from chime to nochime");};
       chimesOff ();
   }
       
        if (preferences.soundPref === "enabled") {
        		play(clunk, false);
        	}

}
//=====================
//End function
//=====================

//===========================================
// function to turn chimes on
//===========================================
function chimesOn () {
       brassbuttonM.hoffset = ( 290 * (clockScale / 100));
       preferences.chimesPref.value = "chime";
       clapper.visible=true;
       clapperRight.visible=false;
           
        if (preferences.soundPref === "enabled") {
        		play(singleBell, false);
        }
}
//=====================
//End function
//=====================

//===========================================
// function to turn chimes off
//===========================================
function chimesOff () {
       preferences.chimesPref.value = "no chime";
       brassbuttonM.hoffset = ( 295 * (clockScale / 100));
       clapper.visible=false;
       clapperRight.visible=true;
}
//=====================
//End function
//=====================



//===========================================
// function to set an alarm
//===========================================
function setalarm () {
      humanreadablealarmdate = new Date(alarmtime);
      if (debugFlg === 1) {print("%setalarm-I-INFO, 2 alarmtime ",alarmtime);};
      if (debugFlg === 1) {print("%setalarm-I-INFO, 2 humanreadablealarmdate ",humanreadablealarmdate);};
      //if (debugFlg === 1) {print("%setalarm-I-INFO,sliderMechanismStatus",sliderMechanismStatus);};
      if (sliderMechanismStatus == "held") {
          if (debugFlg === 1) {print("%KON-I-INFO,attempting to set alarm");};
          screenwrite("attempting to set alarm");
          clapper.visible=false;
          clapperRight.visible=true;
          sleep(500);
          //play a bell
              
        if (preferences.soundPref === "enabled") {
        		play(singleBell, false);
        	}
          clapper.visible=true;
          clapperRight.visible=false;
          //show alarm drop down canvas
          switchAlarmsOn();
      }
      else
      {
  	//play two bells
              
        if (preferences.soundPref === "enabled") {
        		play(twoBells, false);
        	}
          clapper.visible=false;
          clapperRight.visible=true;
          sleep(150);
          clapper.visible=true;
          clapperRight.visible=false;
          sleep(150);
          clapper.visible=false;
          clapperRight.visible=true;
          sleep(150);
          clapper.visible=true;
          clapperRight.visible=false;
          //increment the alarm counter
          sleep(1000);
              
        if (preferences.soundPref === "enabled") {
        		play(till, false);
        	}
              
        if (preferences.soundPref === "enabled") {
        		play(clunk, false);
        	}

          if (alarmToUse == 1)
          {
              preferences.alarm1.value = RoundFixed(alarmtime, 0);         // store the date/time in a permanent field
              alarm1 = alarmtime;                           // store the date/time in a variable too for faster(?) access
              till01.visible=false;
              flag01.hoffset=flag01HoffsetIn;
          }
          if (alarmToUse == 2)
          {
              preferences.alarm2.value = RoundFixed(alarmtime, 0);         // store the date/time in a permanent field
              alarm2 = alarmtime;                           // store the date/time in a variable too for faster(?) access
              till02.visible=false;
              flag02.hoffset=flag02HoffsetIn;
          }
          if (alarmToUse == 3)
          {
              preferences.alarm3.value = RoundFixed(alarmtime, 0);
              alarm3 = alarmtime;
              till03.visible=false;
              flag03.hoffset=flag03HoffsetIn;
          }
          if (alarmToUse == 4)
          {
              preferences.alarm4.value = RoundFixed(alarmtime, 0);
              alarm4 = alarmtime;
              till04.visible=false;
              flag04.hoffset=flag04HoffsetIn;
          }
          if (alarmToUse == 5)
          {
              preferences.alarm5.value = RoundFixed(alarmtime, 0);
              alarm5 = alarmtime;
              till05.visible=false;
              flag05.hoffset=flag05HoffsetIn;
          }
          if (debugFlg === 1) {print("%KON-I-INFO,setting alarm no. ", alarmToUse);};
          screenwrite("setting alarm no. "+alarmToUse);
          if (debugFlg === 1) {print("%KON-I-INFO,alarmtime "+ alarmtime);};
          var writeablestring = ""+humanreadablealarmdate; //this converts the variable into a string and shortens it to fit.
          writeablestring = writeablestring.substring(0,34);
          screenwrite(writeablestring);
          pushOutAlarmToggles ();
          cancelalarmmode();
          runmode = "returning";
      }
}
//=====================
//End function
//=====================

//===========================================
// function to raise a flag
//===========================================
function updateweekday() {
//display the letters and numbers of the time
   weekdaytext.src = 'Resources/weekday'+(wkd+1) +'.png';
}
//=====================
//End function
//=====================

//===========================================
// function to raise a flag
//===========================================
function updatecounters() {
//determine which number to display on the hour
   //if (hr < 10) {hour = "0" + hr};

         hour = padToLeft(hour, "0", 2);

   hour1LetterSet.src = 'Resources/small'+hour.substring(0,1)+'.png';
   hour2LetterSet.src = 'Resources/small'+hour.substring(1,2)+'.png';

//determine which number to display on the minutes
   //if (mn < 10) {mins = "0" + mn};

            mins = padToLeft(mins, "0", 2);

   minutesNumber2Set.src = 'Resources/small'+mins.substring(0,1)+'.png';
   minutesNumber1Set.src = 'Resources/small'+mins.substring(1,2)+'.png';


//determine which number to display on the minutes
   //if (dt < 10) {dt = "0" + dt};
   //print ("updatecounters ************************ dt "+dt);
   //print ("updatecounters ************************ date "+date);
   dt = dt.toString();
   dt = padToLeft(dt, "0", 2);

   dayNumber1LetterSet.src = 'Resources/big'+dt.substring(0,1)+'.png';
   dayNumber2LetterSet.src = 'Resources/big'+dt.substring(1,2)+'.png';

//no need to normalise month as it is already a string ie. Nov

   //print ("updatecounters ********* outgoing month "+month);

   monthLetter1LetterSet.src = 'Resources/bigletter'+month.substring(0,1)+'.png';
   monthLetter2LetterSet.src = 'Resources/smallletter'+month.substring(1,2)+'.png';
   monthLetter3SetLetterSet.src = 'Resources/smallletter'+month.substring(2,3)+'.png';

// no need to normalise the year
   year = year.toString();
   yearNumber1LetterSet.src = 'Resources/big'+year.substring(0,1)+'.png';
   yearNumber2LetterSet.src = 'Resources/big'+year.substring(1,2)+'.png';
   yearNumber3LetterSet.src = 'Resources/big'+year.substring(2,3)+'.png';
   yearNumber4LetterSet.src = 'Resources/big'+year.substring(3,4)+'.png';

//determine which letter to display on the anti/post meridien display

   antipostLetterSet.src = 'Resources/ampmletter'+am_pm.substring(0,1)+'.png';
   meridienLetterSet.src = 'Resources/ampmletter'+am_pm.substring(1,2)+'.png';

// rotate clock hands

// only move the second hand every second, others don't need to move until the specific time
// this assumes that the rotation function is a heavier cpu user than the if... statement

   // if the time is close to the minute change (within 1 second) then
   if (secs >=59 && runmode == "running")  {
      hourHand.rotation = ((hour*30)+(mins/2));
      minuteHand.rotation = ((mins*6)+(secs/10));
   } else if ( runmode != "running" ) {
      hourHand.rotation = ((hour*30)+(mins/2));
      minuteHand.rotation = ((mins*6)+(secs/10));
      runmode = "running"
   }
   // do this every second
   secondHand.rotation = secs * 6;
}
//=====================
//End function
//=====================

//===========================================
// returns the date/time in a string format
//===========================================
function returndateandtimevalues() {

//   if (debugFlg === 1) {print("%KON-I-INFO,time.getHours()",hr);};
//   if (debugFlg === 1) {print("%KON-I-INFO,time.getMinutes()",mn);};

// adjust hours from 24-hour time to 12 hour time

   if (preferences.hrPref.value == "12hr")
   {
       if (hr>12) {hr=(hr-12);}
       if(hr==0){hr=12;am_pm='am';}
       else if(hr<12){am_pm='am';}
       else if(hr==12){am_pm='pm';}
       else if(hr>12){am_pm='pm';}
   } else {    // 24hr
       if(hr<12){am_pm='am';}
       else if(hr==12){am_pm='pm';}
       else if(hr>12){am_pm='pm';}
   }

   //if (debugFlg === 1) {print("%KON-I-INFO, Running function updateTime "+ preferences.hrPref.value);};

// change the month to a string
   months = new Array(12);
   months[0] = "Jan";
   months[1] = "Feb";
   months[2] = "Mar";
   months[3] = "Apr";
   months[4] = "May";
   months[5] = "Jun";
   months[6] = "Jul";
   months[7] = "Aug";
   months[8] = "Sep";
   months[9] = "Oct";
   months[10] = "Nov";
   months[11] = "Dec";

// change the month to a string
   weekdays = new Array(8);
   weekdays[0] = "Sun";
   weekdays[1] = "Mon";
   weekdays[2] = "Tue";
   weekdays[3] = "Wed";
   weekdays[4] = "Thu";
   weekdays[5] = "Fri";
   weekdays[6] = "Sat";
   weekdays[7] = "Sun";

// normalise from variables to strings
   hour = ''+hr;
   mins = ''+mn;
   secs = ''+se;
   date = ''+dt;
   day = ''+wkd;
   wkdy = ''+weekdays[wkd];
   month = ''+months[mnth];
   //print ("month "+ month);
   year = ''+yr;
}
//=====================
//End function
//=====================

//===========================================
// cancel alarm mode
//===========================================
function cancelalarmmode() {
      if (sliderMechanismStatus == "released")
      {
              
        if (preferences.soundPref === "enabled") {
        		play(clunk, false);
        	}
          screenwrite("Cancelling setting alarm");
          screenwrite("Entering clock mode");
          runmode = "returning";
          //hold the slider mechanism
       	  sliderMechanismStatus = "held";
       	  sliderSet.hoffset = 335* (clockScale / 100);
       	  orangeHeaterGlow.hoffset = 367* (clockScale / 100);
          stretchCable();
          brassbuttonA.hoffset=(290 * (clockScale / 100));
          //brassbuttonA.hoffset = 290;
          counterTimer.ticking= false;
          hourHand.opacity =255;
          minuteHand.opacity =255;
          secondHand.opacity =255;
          alarmtime = 0;
          basetimecurrent = 0;
          timecount = 0;
          clockTimer.ticking=true;
              
        if (preferences.soundPref === "enabled") {
        		play(till, false);
        	}
          resetTillAndToggles();
          displayBlankCounters();
      }
      else
      {
              
        if (preferences.soundPref === "enabled") {
        		play(till, false);
        	}
              
        if (preferences.soundPref === "enabled") {
        		play(clunk, false);
        	}
          resetTillAndToggles();
          clockTimer.ticking=true;
          screenwrite("Cancelling Alarm View Mode");
          displayBlankCounters();
      }
}
//=====================
//End function
//=====================



//===========================================
// returns the date/time in a string format
//===========================================
function weekdaytoggle()
{
         
        if (preferences.soundPref === "enabled") {
        		play(till, false);
        	}
         
        if (preferences.soundPref === "enabled") {
        		play(clunk, false);
        	}
     if (preferences.weekdayPref.value == "raised")
     {
        screenwrite("raise week indicator");
        weekdaytext.visible = false;
        weekday.visible = false;
        preferences.weekdayPref.value = "lowered";
        brassButtonW.hoffset=(330 * (clockScale / 100)) ;
     }
     else
     {
        screenwrite("lower week indicator");
        weekdaytext.visible = true;
        weekday.visible = true;
        preferences.weekdayPref.value = "raised";
        brassButtonW.hoffset=(335 * (clockScale / 100)) ;
     }
     screenwrite("week indicator set to "+ preferences.weekdayPref.value);
}
//=====================
//End function
//=====================

//===========================================
// returns the date/time in a string format
//===========================================
function setWeekdayIndicator()
{
         
        if (preferences.soundPref === "enabled") {
        		play(till, false);
        	}
         
        if (preferences.soundPref === "enabled") {
        		play(clunk, false);
        	}
     if (preferences.weekdayPref.value == "lowered")
     {
        weekdaytext.visible = false;
        weekday.visible = false;
        brassButtonW.hoffset=(330 * (clockScale / 100)) ;
     }
     else
     {
        weekdaytext.visible = true;
        weekday.visible = true;
        brassButtonW.hoffset=(335 * (clockScale / 100)) ;
     }
     screenwrite("week indicator set to "+ preferences.weekdayPref.value);
}
//=====================
//End function
//=====================


//===========================================
// returns the date/time in a string format
//===========================================
function screentoggle()
{
         
        if (preferences.soundPref === "enabled") {
        		play(clunk, false);
        	}
         
        if (preferences.soundPref === "enabled") {
        		play(zzzz, false);
        	}
     if (preferences.screenPrefFlg.value == "raised")
     {
          preferences.screenPrefFlg.value = "lowered";
          screensetlow();
     }
     else if (preferences.screenPrefFlg.value == "lowered")
     {
          preferences.screenPrefFlg.value = "raised";
          screensethigh();
     }
}
//=====================
//End function
//=====================

//===========================================
//
//===========================================
function screenset()
{
     if (preferences.screenPrefFlg.value == "raised")
     {
          screensethigh();
     }
     else if (preferences.screenPrefFlg.value == "lowered")
     {
          screensetlow();
     }
}
//=====================
//End function
//=====================

//===========================================
// returns the date/time in a string format
//===========================================
function screensethigh()
{
        clearscreen2.tooltip="to lower kinematoscope press S toggle";
        screenwrite("raise screen");
        clearscreen.visible= true;
        pastimage.visible= true;
        rhHinge.visible=true;
        lhHinge.visible=true;
        brassButtonB.visible=true;
        brassButtonT.visible=true;
        //brassButtonS.hoffset=335;
        brassButtonS.hoffset=(335 * (clockScale / 100)) ;

        terminal00.visible = true;
        terminal01.visible = true;
        terminal02.visible = true;
        terminal03.visible = true;
        terminal04.visible = true;
        terminal05.visible = true;
        terminal06.visible = true;
        terminal07.visible = true;
        terminal08.visible = true;
        terminal09.visible = true;
        terminal10.visible = true;
        terminal11.visible = true;
        terminal12.visible = true;
        terminal13.visible = true;
        terminal14.visible = true;
        terminal15.visible = true;

        pastimage.visible= true;

        clearscreen.visible= true;
}
//=====================
//End function
//=====================

//===========================================
// returns the date/time in a string format
//===========================================
function screensetlow()
{
        clearscreen2.tooltip="raise kinematoscope";
        brassButtonS.hoffset=(330 * (clockScale / 100)) ;
        brassButtonB.visible=false;
        brassButtonT.visible=false;
        backscreen.visible= false;
        clearscreen.visible= false;
        pastimage.visible= false;
        preferences.backscreenPrefFlg.value =  "lowered";

        terminal00.visible = false;
        terminal01.visible = false;
        terminal02.visible = false;
        terminal03.visible = false;
        terminal04.visible = false;
        terminal05.visible = false;
        terminal06.visible = false;
        terminal07.visible = false;
        terminal08.visible = false;
        terminal09.visible = false;
        terminal10.visible = false;
        terminal11.visible = false;
        terminal12.visible = false;
        terminal13.visible = false;
        terminal14.visible = false;
        terminal15.visible = false;
        rhHinge.visible=false;
        lhHinge.visible=false;

}
//=====================
//End function
//=====================

//===========================================
// returns the date/time in a string format
//===========================================
function screenwrite(screentext)
{
  for (var a =0;a<=14;a++)
  {
      terminal[15-a] = terminal[15-a-1];
  }
  terminal[0] = screentext;
  //if (debugFlg === 1) {print("%KON-I-INFO,screentext ", screentext);};

  terminal00.data =   terminal[0];
  terminal01.data =   terminal[1];
  terminal02.data =   terminal[2];
  terminal03.data =   terminal[3];
  terminal04.data =   terminal[4];
  terminal05.data =   terminal[5];
  terminal06.data =   terminal[6];
  terminal07.data =   terminal[7];
  terminal08.data =   terminal[8];
  terminal09.data =   terminal[9];
  terminal10.data =   terminal[10];
  terminal11.data =   terminal[11];
  terminal12.data =   terminal[12];
  terminal13.data =   terminal[13];
  terminal14.data =   terminal[14];
  terminal15.data =   terminal[15];

  //if (debugFlg === 1) {print("%KON-I-INFO,terminal00.data ", terminal00.data);};
}
//=====================
//End function
//=====================

//===========================================
//
//===========================================
function togglebackscreen()
{
  if (debugFlg === 1) {print("%KON-I-INFO,preferences.backscreenPrefFlg.value "+preferences.backscreenPrefFlg.value);};
         
        if (preferences.soundPref === "enabled") {
        		play(clunk, false);
        	}

     if (preferences.backscreenPrefFlg.value == "raised")
     {
        backscreen.voffset = clearscreen.voffset + 215 * (clockScale / 100);

        backscreenvoffsetCurrent = backscreen.voffset;

        preferences.backscreenPrefFlg.value = "lowered";
        screenwrite("lower back screen");
        brassButtonB.hoffset=(582 * (clockScale / 100)) ;
     }
     else if (preferences.backscreenPrefFlg.value == "lowered")
     {
        backscreen.visible = true;
        backscreen.voffset = clearscreen.voffset + 5 * (clockScale / 100);

        backscreenvoffsetCurrent = backscreen.voffset;

        preferences.backscreenPrefFlg.value = "raised";
        screenwrite("raise back screen");
        brassButtonB.hoffset=(575 * (clockScale / 100)) ;
     }
}
//=====================
//End function
//=====================

//===========================================
//
//===========================================
function toggletimemachine()
{
  if (debugFlg === 1) {print("%KON-I-INFO,preferences.timeMachinePrefFlg.value "+preferences.timeMachinePrefFlg.value);};
         
        if (preferences.soundPref === "enabled") {
        		play(clunk, false);
        	}

     if (preferences.timeMachinePrefFlg.value == "raised" )
     {
        pastimage.visible = false;
        preferences.timeMachinePrefFlg.value = "lowered";
        screenwrite("lower time display");
        brassButtonT.hoffset=(315 * (clockScale / 100)) ;
     }
     else if (preferences.timeMachinePrefFlg.value == "lowered")
     {
        pastimage.visible = true;
        preferences.timeMachinePrefFlg.value = "raised";
        screenwrite("raise time display");
        brassButtonT.hoffset=(320 * (clockScale / 100)) ;
     }
}
//=====================
//End function
//=====================


//===========================================
//
//===========================================
function checktimemachine()
{
  if (debugFlg === 1) {print("%KON-I-INFO,preferences.timeMachinePrefFlg.value "+preferences.timeMachinePrefFlg.value);};
     screenwrite("preferences.timeMachinePrefFlg.value "+preferences.timeMachinePrefFlg.value);

     if (preferences.timeMachinePrefFlg.value == "lowered" )
     {
        pastimage.visible = false;
        screenwrite("lower time display");
        brassButtonT.hoffset=(315 * (clockScale / 100)) ;
     }
     else if (preferences.timeMachinePrefFlg.value == "raised")
     {
        pastimage.visible = true;
        screenwrite("raise time display");
        brassButtonT.hoffset=(320 * (clockScale / 100)) ;
     }
}
//=====================
//End function
//=====================

//===========================================
//
//===========================================
function checkbackscreen()
{
     if (debugFlg === 1) {print("%KON-I-INFO,preferences.backscreenPrefFlg.value "+preferences.backscreenPrefFlg.value);};
     screenwrite("preferences.backscreenPrefFlg.value "+preferences.backscreenPrefFlg.value);

     if (preferences.backscreenPrefFlg.value == "raised")
     {
        backscreen.visible = true;
        backscreen.voffset = clearscreen.voffset + 5 * (clockScale / 100);

        backscreenvoffsetCurrent = backscreen.voffset;

        screenwrite("raise back screen");
        brassButtonB.hoffset=(575 * (clockScale / 100)) ;
     }
     else if (preferences.backscreenPrefFlg.value == "lowered")
     {
        backscreen.voffset = clearscreen.voffset + 215 * (clockScale / 100);

        backscreenvoffsetCurrent = backscreen.voffset;

        screenwrite("lower back screen");
        brassButtonB.hoffset=(582 * (clockScale / 100)) ;
     }
}
//=====================
//End function
//=====================

//========================================================
// function to push out an alarm toggle if an alarm is set
//========================================================
function pushOutAlarmToggles () {
      if (debugFlg === 1) {print("%KON-I-INFO,push out alarm toggles");};
      screenwrite("push out alarm toggles ");

      if (preferences.alarm1.value != 0) {
        flag01.src="Resources/flag01.png";
        flag01.tooltip = "click to view alarm no.1";
      }
      else
      {
          flag01.src="Resources/flag0.png";
      }
      if (preferences.alarm2.value != 0)
      {
        sleep(100);
        flag02.src="Resources/flag02.png";
        flag02.tooltip = "click to view alarm no.2";
      }
      else
      {
          flag02.src="Resources/flag0.png";
      }

      if (preferences.alarm3.value != 0)
      {
        sleep(100);
        flag03.src="Resources/flag03.png";
        flag03.tooltip = "click to view alarm no.3";
      }
      else
      {
          flag03.src="Resources/flag0.png";
      }

      if (preferences.alarm4.value != 0)
      {
        sleep(100);
        flag04.src="Resources/flag04.png";
        flag04.tooltip = "click to view alarm no.4";
      }
      else
      {
          flag04.src="Resources/flag0.png";
      }

      if (preferences.alarm5.value != 0)
      {
        sleep(100);
        flag05.src="Resources/flag05.png";
        flag05.tooltip = "click to view alarm no.5";
      }
      else
      {
          flag05.src="Resources/flag0.png";
      }
}
//=====================
//End function
//=====================


//========================================================
//check the lock state
//========================================================
function checkLockState () {
    // set the widget lock status if pinned
    if (preferences.widgetLockPref.value === "1") {
		mainWindow.locked = true;
                
                //mainWindow.hoffset = parseInt(preferences.hoffsetpref.value, 10);
        	//mainWindow.voffset = parseInt(preferences.hoffsetpref.value, 10);

                log ( "Setting the locking pin ");
		pin.src = "Resources/pin.png";
                //check the level of sound first
                if (preferences.soundLevelPref.value != "silent")
                {
            		    
        if (preferences.soundPref === "enabled") {
        		play(lock, false);
        	}
                }
    } else {
		pin.src = "Resources/pin-shadow.png";
    }
}
//=====================
//End function
//=====================


//===========================================
// function ring alarm bell
//===========================================
function ringalarmbell() {
     //ring alarm
         
        if (preferences.soundPref === "enabled") {
        		play(alarmbells, false);
        	}
}
//=====================
//End function
//=====================

//===========================================
//check the alarms and raise a flag or two
//===========================================
function ShallWeRingAlarm()
{
  // if an alarm is currently being raised then the function is immediately exited
  // ie. don't raise a second alarm

  if (raisealarmflg === true) {return};

  alarm1 = parseFloat(preferences.alarm1.value);
  alarm2 = parseFloat(preferences.alarm2.value);
  alarm3 = parseFloat(preferences.alarm3.value);
  alarm4 = parseFloat(preferences.alarm4.value);
  alarm5 = parseFloat(preferences.alarm5.value);
  /*
  if (debugFlg === 1) {
     print("%KON-I-INFO,checking alarms", raisealarmflg);
     print("basetimecurrent "+basetimecurrent);
     print("alarm1 "+alarm1);
     print("alarm2 "+alarm2);
     print("alarm3 "+alarm3);
     print("alarm4 "+alarm4);
     print("alarm5 "+alarm5);
  }
  */
  // if an alarm is raised the function is immediately exited

  if (alarm1 > 0)
  {
     selectedAlarm = 1;
     today=new Date();
     basetimecurrent = today.getTime();  //no. of milliseconds since 1970
     //if current time is beyond the alarm time, the ringer has not already activated and the alarm sounds are on.
     if (basetimecurrent >= alarm1 && alarmTimer.ticking == false && preferences.alarmPref.value != "silent")
     {
        raisealarmflg = true;
        var humanreadablealarmdate = new Date(alarm1);
        var temp1 = ""+ humanreadablealarmdate;
        var writeablestring = temp1.substring(0,34);

        screenwrite("Alarm 1 Raised!");
        screenwrite(writeablestring);

        till01.visible=true;
        flag01.hoffset=flag01HoffsetOut;

        alarm1 = 0;
        preferences.alarm1.value = 0;
        alarmTimer.ticking = true;
        //bellSet.onmousedown="confirmalarm()";
        return;
     }
  }

  if (alarm2 > 0)
  {
     selectedAlarm = 2;
     today=new Date();
     basetimecurrent = today.getTime();  //no. of milliseconds since 1970

     if (basetimecurrent >= alarm2 && alarmTimer.ticking == false && preferences.alarmPref.value != "silent")
     {
        raisealarmflg = true;
        var humanreadablealarmdate = new Date(alarm2);
        var temp1 = ""+ humanreadablealarmdate;
        var writeablestring = temp1.substring(0,34);
        screenwrite("Alarm 2 Raised!");
        screenwrite(writeablestring);

        till02.visible=true;
        flag02.hoffset=flag02HoffsetOut;

        alarm2 = 0;
        preferences.alarm2.value = 0;
        alarmTimer.ticking = true;
        //bellSet.onmousedown="confirmalarm()";
        return;
     }
  }

  if (alarm3 > 0)
  {
     selectedAlarm = 3;
     today=new Date();
     basetimecurrent = today.getTime();  //no. of milliseconds since 1970
     if (basetimecurrent >= alarm3 && alarmTimer.ticking == false && preferences.alarmPref.value != "silent")
     {
        raisealarmflg = true;
        var humanreadablealarmdate = new Date(alarm3);
        var temp1 = ""+ humanreadablealarmdate;
        var writeablestring = temp1.substring(0,34);
        screenwrite("Alarm 3 Raised!");
        screenwrite(writeablestring);

        till03.visible=true;
        flag03.hoffset=flag03HoffsetOut;

        alarm3 = 0;
        preferences.alarm3.value = 0;
        alarmTimer.ticking = true;
        //bellSet.onmousedown="confirmalarm()";
        return;
     }
  }

  if (alarm4 > 0)
  {
     selectedAlarm = 4;

     //raise flag no. 4;
     today=new Date();
     basetimecurrent = today.getTime();  //no. of milliseconds since 1970
     if (basetimecurrent >= alarm4 && alarmTimer.ticking == false && preferences.alarmPref.value != "silent")
     {
        raisealarmflg = true;
        var humanreadablealarmdate = new Date(alarm4);
        var temp1 = ""+ humanreadablealarmdate;
        var writeablestring = temp1.substring(0,34);
        screenwrite("Alarm 4 Raised!");
        screenwrite(writeablestring);

        till04.visible=true;
        flag04.hoffset=flag04HoffsetOut;

        alarm4 = 0;
        preferences.alarm4.value = 0;
        alarmTimer.ticking = true;
        //bellSet.onmousedown="confirmalarm()";
        return;
     }
   }

  if (alarm5 > 0)
  {
     selectedAlarm = 5;

     today=new Date();
     basetimecurrent = today.getTime();  //no. of milliseconds since 1970

     if (basetimecurrent >= alarm5 && alarmTimer.ticking == false && preferences.alarmPref.value != "silent")
     {
        raisealarmflg = true;
        var humanreadablealarmdate = new Date(alarm5);
        var temp1 = ""+ humanreadablealarmdate;
        var writeablestring = temp1.substring(0,34);
        screenwrite("Alarm 5 Raised!");
        screenwrite(writeablestring);

        till05.visible=true;
        flag05.hoffset=flag05HoffsetOut;

        alarm5 = 0;
        preferences.alarm5.value = 0;
        alarmTimer.ticking = true;
        //bellSet.onmousedown="confirmalarm()";
        return;
     }
  }
 }
//=====================
//End function
//=====================

//===============================================
// function to reset the till pop-ups and Toggles
//===============================================
function   resetTillAndToggles()
{
  till01.visible=false;
  till02.visible=false;
  till03.visible=false;
  till04.visible=false;
  till05.visible=false;

  flag01.hoffset=Math.round( 585 * (clockScale / 100));
  flag02.hoffset=Math.round( 592 * (clockScale / 100));
  flag03.hoffset=Math.round( 603 * (clockScale / 100));
  flag04.hoffset=Math.round( 609 * (clockScale / 100));
  flag05.hoffset=Math.round( 611 * (clockScale / 100));
}
//=====================
//End function
//=====================

//===============================================
// function to determine the next alarm available
//===============================================
function determineNextAlarmAvailable()
{

        var lastAlarmUsed = 1;
        lastAlarmUsed = alarmToUse;

        //if all alarms taken, base the next alarm upon the last used.

        if (preferences.alarm1.value != 0 && preferences.alarm2.value != 0 && preferences.alarm3.value != 0 && preferences.alarm4.value != 0 && preferences.alarm5.value != 0 )
        {
            if (lastAlarmUsed <=4)
            {
                 alarmToUse = lastAlarmUsed + 1;
            }
            else
            {
                 alarmToUse = 1;
            }
        }
        else
        {
            //if not all alarms taken, then select the lowest alarm available

            alarmToUse = 1;


            if (preferences.alarm1.value == 0)
            {
               alarmToUse = 1;
               return;
            }
            if (preferences.alarm2.value == 0)
            {
               alarmToUse = 2;
               return;
            }
            if (preferences.alarm3.value == 0)
            {
               alarmToUse = 3;
               return;
            }
            if (preferences.alarm4.value == 0)
            {
               alarmToUse = 4;
               return;
            }
            if (preferences.alarm5.value == 0)
            {
               alarmToUse = 5;
               return;
            }
        }

}
//=====================
//End function
//=====================

//===========================================
// function to show an alarm using the till pop-ups
//===========================================
function showAlarm()
{
  clockTimer.ticking=false;
      
        if (preferences.soundPref === "enabled") {
        		play(clunk, false);
        	}
  resetTillAndToggles();
  timeDeviation = 0;

  if  (selectedAlarm == 1)
  {
      //alarmTextOne.hOffset=backscreen.hOffset+20;
      //alarmTextOne.vOffset=backscreen.vOffset+20;
      //alarmTextOne.visible=true;
      till01.visible=true;
      flag01.hoffset=flag01HoffsetOut;
      alarmtime = parseFloat(preferences.alarm1.value);
      //if (debugFlg === 1) {print("%KON-I-INFO,alarmtime "+ alarmtime);};
  }
  if  (selectedAlarm == 2)
  {
      till02.visible=true;
      flag02.hoffset=flag02HoffsetOut;
      alarmtime = parseFloat(preferences.alarm2.value);
  }
  if  (selectedAlarm == 3)
  {
      till03.visible=true;
      flag03.hoffset=flag03HoffsetOut;
      alarmtime = parseFloat(preferences.alarm3.value);
  }

  if  (selectedAlarm == 4)
  {
      till04.visible=true;
      flag04.hoffset=flag04HoffsetOut;
      alarmtime = parseFloat(preferences.alarm4.value);
  }
  if  (selectedAlarm == 5)
  {
      till05.visible=true;
      flag05.hoffset=flag05HoffsetOut;
      alarmtime = parseFloat(preferences.alarm5.value);
  }
 displayCounters();
}
//===========================================
// end function
//===========================================


//===========================================
//display blank counters
//===========================================
function displayCounters()
{
      
        if (preferences.soundPref === "enabled") {
        		play(till, false);
        	}
  displayBlankCounters();

      
        if (preferences.soundPref === "enabled") {
        		play(clunk, false);
        	}  //find a sound
  sleep(300);

  humanreadablealarmdate = new Date(alarmtime);

  var writeablestring = (""+humanreadablealarmdate); //this converts the variable into a string and shortens it to fit.
  writeablestring = writeablestring.substring(0,34);

  screenwrite("Viewing Alarm Number "+ selectedAlarm);
  screenwrite(""+writeablestring);
  if (debugFlg === 1) {print("%KON-I-INFO,writeablestring "+ writeablestring);};

  //returns the date/time in a string format

  hr = humanreadablealarmdate.getHours();
  mn = humanreadablealarmdate.getMinutes();
  se = humanreadablealarmdate.getSeconds();
  dt = humanreadablealarmdate.getDate();

  //print ("6 ************************ dt "+dt);


  wkd= humanreadablealarmdate.getDay();
  mnth = humanreadablealarmdate.getMonth();
  yr = humanreadablealarmdate.getFullYear();

  returndateandtimevalues();

  //display the letters and numbers of the time

  updatecounters();

//display the letters and numbers of the day of the week

  updateweekday();
              
//set the visibility of the weekday indicator

  setWeekdayIndicator();
}
//=====================
//End function
//=====================

 //===========================================
// function called when someone presses the till flag
//===========================================
function confirmalarm()
{
  var alarmReading = 0;

  if  (selectedAlarm == 1)
  {
      alarmReading = preferences.alarm1.value;
  }
  if  (selectedAlarm == 2)
  {
      alarmReading = preferences.alarm2.value;
  }
  if  (selectedAlarm == 3)
  {
      alarmReading = preferences.alarm3.value;
  }
  if  (selectedAlarm == 4)
  {
      alarmReading = preferences.alarm4.value;
  }
  if  (selectedAlarm == 5)
  {
      alarmReading = preferences.alarm5.value;
  }

  //if alarm is not playing then show the alarm details prior to deletion
   if (raisealarmflg === false)
   {
      if  (alarmReading != 0)
      {
             
        if (preferences.soundPref === "enabled") {
        		play(clunk, false);
        	}
             
        if (preferences.soundPref === "enabled") {
        		play(tingingSound, false);
        	}
         clockDeletion.visible = true;
         plaqueLink.visible = true;
         plaquetick.visible = true;
      } else {
         deletealarm(); // if the alarm is zero then simply delete
      }
   } else {   //if alarm is playing then simply delete the alarm
      deletealarm();
   }
}
//=====================
//End function
//=====================

//===========================================
// function to delete an alarm using the till pop-ups or bellset
//===========================================
function deletealarm()
{
    // this is called when someone presses the till flag
  alarmTimer.ticking = false;
  //bellSet.onmousedown="switchAlarmsOn();";
  //bellSet.onmousedown="setalarm();";

  if (raisealarmflg === true)
  {
     screenwrite("Turning alarm off "+selectedAlarm);
  }
  else
  {
     screenwrite("Removing Alarm Number "+selectedAlarm);
  }

  raisealarmflg = false;

  if  (selectedAlarm == 1)
  {
      till01.visible=false;
      flag01.src="Resources/flag0.png";
      flag01.hoffset=flag01HoffsetIn;
      preferences.alarm1.value = 0;
  }
  if  (selectedAlarm == 2)
  {
      till02.visible=false;
      flag02.src="Resources/flag0.png";
      flag02.hoffset=flag02HoffsetIn;
      preferences.alarm2.value = 0;
  }
  if  (selectedAlarm == 3)
  {
      till03.visible=false;
      flag03.src="Resources/flag0.png"
      flag03.hoffset=flag03HoffsetIn;
      preferences.alarm3.value = 0;
  }
  if  (selectedAlarm == 4)
  {
      till04.visible=false;
      flag04.src="Resources/flag0.png"
      flag04.hoffset=flag04HoffsetIn;
      preferences.alarm4.value = 0;
  }
  if  (selectedAlarm == 5)
  {
      till05.visible=false;
      flag05.src="Resources/flag0.png"
      flag05.hoffset=flag05HoffsetIn;
      preferences.alarm5.value = 0;
  }
      
        if (preferences.soundPref === "enabled") {
        		play(till, false);
        	}  //find a sound

//  displayBlankCounters();

      
        if (preferences.soundPref === "enabled") {
        		play(clunk, false);
        	}  //find a sound

  cancelalarmmode();
  pushOutAlarmToggles ()
}
//=====================
//End function
//=====================

//===========================================
// function to Displaying Blank Counters
//===========================================
function displayBlankCounters()
{
   //display blank counters

   var sleepvalue = 1;

   if (preferences.counterPref.value == "disabled")
   {
     sleepvalue = preferences.counterPrefdelay.value;
   }
   else
   {
     sleepvalue = preferences.counterPrefdelay.value;
   }

   if (preferences.counterPref.value != "disabled")
   {
      for (var a =0;a<=9;a++)
      {
          hour1LetterSet.src = 'Resources/small'+a+'.png';
          sleep(sleepvalue);
              
        if (preferences.soundPref === "enabled") {
        		play(counter, false);
        	}
      }
   }
   hour1LetterSet.src = 'Resources/smallblanknumber.png';

   if (preferences.counterPref.value != "disabled")
   {
      for (var a =0;a<=9;a++)
      {
          hour2LetterSet.src = 'Resources/small'+a+'.png';
          sleep(sleepvalue);
              
        if (preferences.soundPref === "enabled") {
        		play(counter, false);
        	}
       }
   }

   hour2LetterSet.src = 'Resources/smallblanknumber.png';

//determine which number to display on the minutes

   if (preferences.counterPref.value != "disabled")
   {
       for (var a =0;a<=9;a++)
       {
          minutesNumber2Set.src = 'Resources/small'+a+'.png';
          sleep(sleepvalue);
              
        if (preferences.soundPref === "enabled") {
        		play(counter, false);
        	}
       }
   }

   minutesNumber2Set.src = 'Resources/smallblanknumber.png';

   if (preferences.counterPref.value != "disabled")
   {
       for (var a =0;a<=9;a++)
       {
          minutesNumber1Set.src = 'Resources/small'+a+'.png';
          sleep(sleepvalue);
              
        if (preferences.soundPref === "enabled") {
        		play(counter, false);
        	}
       }
   }

   minutesNumber1Set.src = 'Resources/smallblanknumber.png';

//determine which number to display on the minutes
   if (preferences.counterPref.value != "disabled")
   {
       for (var a =0;a<=9;a++)
       {
          dayNumber1LetterSet.src = 'Resources/big'+a+'.png';
          sleep(sleepvalue);
              
        if (preferences.soundPref === "enabled") {
        		play(counter, false);
        	}
       }
   }

   dayNumber1LetterSet.src = 'Resources/bigblanknumber.png';

   if (preferences.counterPref.value != "disabled")
   {
       for (var a =0;a<=9;a++)
       {
          dayNumber2LetterSet.src = 'Resources/big'+a+'.png';
          sleep(sleepvalue);
              
        if (preferences.soundPref === "enabled") {
        		play(counter, false);
        	}
       }
   }

   dayNumber2LetterSet.src = 'Resources/bigblanknumber.png';

//no need to normalise month as it is already a string ie. Nov
   sleep(25);
   monthLetter1LetterSet.src = 'Resources/bigblankletter.png';
   sleep(25);
   monthLetter2LetterSet.src = 'Resources/bigblankletter.png';
   sleep(25);
   monthLetter3SetLetterSet.src = 'Resources/bigblankletter.png';

// no need to normalise the year

   if (preferences.counterPref.value != "disabled")
   {
       for (var a =0;a<=9;a++)
       {
          yearNumber1LetterSet.src = 'Resources/big'+a+'.png';
          sleep(sleepvalue);
              
        if (preferences.soundPref === "enabled") {
        		play(counter, false);
        	}
       }
   }

   yearNumber1LetterSet.src = 'Resources/bigblanknumber.png';

   if (preferences.counterPref.value != "disabled")
   {
       for (var a =0;a<=9;a++)
       {
          yearNumber2LetterSet.src = 'Resources/big'+a+'.png';
          sleep(sleepvalue);
              
        if (preferences.soundPref === "enabled") {
        		play(counter, false);
        	}
       }
   }

   yearNumber2LetterSet.src = 'Resources/bigblanknumber.png';

   if (preferences.counterPref.value != "disabled")
   {
       for (var a =0;a<=9;a++)
       {
          yearNumber3LetterSet.src = 'Resources/big'+a+'.png';
          sleep(sleepvalue);
              
        if (preferences.soundPref === "enabled") {
        		play(counter, false);
        	}
       }
   }

   yearNumber3LetterSet.src = 'Resources/bigblanknumber.png';

   if (preferences.counterPref.value != "disabled")
   {
       for (var a =0;a<=9;a++)
       {
          yearNumber4LetterSet.src = 'Resources/big'+a+'.png';
          sleep(sleepvalue);
              
        if (preferences.soundPref === "enabled") {
        		play(counter, false);
        	}
       }
   }

   yearNumber4LetterSet.src = 'Resources/bigblanknumber.png';

       
        if (preferences.soundPref === "enabled") {
        		play(clunk, false);
        	}
}
//=====================
//End function
//=====================

//==============================================================================
// gives you back a number, accurate to the number of decimal places you specify
//==============================================================================
function Round(Number, DecimalPlaces)
{
   return Math.round(parseFloat(Number) * Math.pow(10, DecimalPlaces)) / Math.pow(10, DecimalPlaces);
}
//=====================
//End function
//=====================


//==============================================================================
// returns a string fixed to the required number of decimal places
//==============================================================================
function RoundFixed(Number, DecimalPlaces)
{
   return Round(Number, DecimalPlaces).toFixed(DecimalPlaces);
}
//=====================
//End function
//=====================





//===============================
// function to select a canvas
//===============================
function selectCanvas()
{
   helpCanvasDisplayed = helpCanvasDisplayed + 1;

   if (helpCanvasDisplayed >= 4)
   {
           
        if (preferences.soundPref === "enabled") {
        		play(rollerblindup, false);
       }
       closehelpdropdown();
       helpCanvasDisplayed = 1;
   }

   //screenwrite(helpCanvasDisplayed);

   if (helpCanvasDisplayed == 1)
   {
       displayHelp1();
   }

   if (helpCanvasDisplayed == 2)
   {
       displayHelp2();
   }

   if (helpCanvasDisplayed == 3)
   {
       displayHelp3();
   }
}
//=====================
//End function
//=====================

//===============================
// function to select a canvas
//===============================
function displayHelp1()
{
        brassbuttonH.visible= false;

            
        if (preferences.soundPref === "enabled") {
        		play(clunk, false);
        	}
            
        if (preferences.soundPref === "enabled") {
        		play(rollerblinddown, false);
        	}
        sleep(300);

        brassbuttonH.visible= false;
        woodenBar.voffset=259* (clockScale / 100);
        woodenBar.visible=true;
        helpbrassbutton.src='Resources/brassbutton1.png';
        helpbrassbutton.visible=true;

        sleep(300);

        helpdropdownactiveFlg = true;
        bigdropdowncanvas.voffset= 255* (clockScale / 100);

 	bigdropdowncanvas.visible= true;
        helptext.visible= true;
 	//helpDrawstring.visible= true;
 	//helpDrawstring.voffset= 686;
        screenwrite("Opening Help Canvas");
        if (debugFlg === 1) {print("%KON-I-INFO,Opening helpdropdownmove");};

        sleep(500);
}

//=====================
//End function
//=====================

//===============================
// function to select a canvas
//===============================
function displayHelp2()
{
        closehelpdropdown();
        sleep(300);

            
        if (preferences.soundPref === "enabled") {
        		play(clunk, false);
        	}
            
        if (preferences.soundPref === "enabled") {
        		play(rollerblinddown, false);
        }
        sleep(300);

        woodenBar.voffset=259* (clockScale / 100);
        woodenBar.visible=true;
        brassbuttonH.visible= false;
        helpbrassbutton.src='Resources/brassbutton2.png';
        helpbrassbutton.visible=true;

        sleep(300);

        helpdropdownactive = true;
        alarmtext.visible= true;

 	bigdropdowncanvas.visible= true;
        bigdropdowncanvas.voffset= 255* (clockScale / 100);
        alarmtext.voffset = 255* (clockScale / 100);

        screenwrite("Opening Alarm Help Canvas");
        if (debugFlg === 1) {print("%KON-I-INFO,Opening Alarm Help");};
}

//=====================
//End function
//=====================

//===============================
// function to select a canvas
//===============================
function displayHelp3()
{
        closehelpdropdown();
        sleep(300);

            
        if (preferences.soundPref === "enabled") {
        		play(clunk, false);
        	}
            
        if (preferences.soundPref === "enabled") {
        		play(rollerblinddown, false);
        }

        sleep(300);

        woodenBar.voffset=259* (clockScale / 100);
        woodenBar.visible=true;

        brassbuttonH.visible= false;

        helpbrassbutton.src='Resources/brassbutton3.png';
        helpbrassbutton.visible=true;

        sleep(300);

        helpdropdownactive = true;
        termstext.visible= true;
        Copyright.visible = true;
        Terms.visible = true;
        Privacy.visible = true;
        Download.visible = true;
        Read.visible = true;

        bigdropdowncanvas.voffset= 255* (clockScale / 100);
 	    bigdropdowncanvas.visible= true;

        termstext.voffset = 265* (clockScale / 100);

        screenwrite("Opening Dropdown Canvas");
        if (debugFlg === 1) {print("%KON-I-INFO,Opening helpdropdownmove");};
}

//=====================
//End function
//=====================

//===============================
// function to
//===============================
function changePrefs()
{
         screenwrite("Preferences Changed");
         if (debugFlg === 1) {print("%KON-I-INFO,Preferences Changed");};
		 prefsFlg = 1;
		 startup();
         
         /*
         changeLoudness();
         checkticking();
         setWeekdayIndicator();
         screenset();
         resizeClock();
         */
}

//=====================
//End function
//=====================

//===============================
// function to resizeClock
//===============================
function resizeClock()
{


        //if (debugFlg === 1) {print("%KON-I-INFO,Resizing preferences.maxWidthPref.value ",preferences.maxWidthPref.value);};

        //screenwrite("resizing reduction "+ Math.abs(reduction) +"%");

        clockScale = preferences.maxWidthPref.value ;
        //clockScale = 25;     //smaller

        //if (debugFlg === 1) {print("%KON-I-INFO,preferences.maxWidthPref.value ",preferences.maxWidthPref.value);};
	//if (debugFlg === 1) {print("%KON-I-INFO,reduction ",reduction);};
	//if (debugFlg === 1) {print("%KON-I-INFO,clockScale ",clockScale);};

	mainWindow.width  = mainWindowwidthDefault * (clockScale / 100) ;
	mainWindow.height = mainWindowheightDefault * (clockScale / 100) ;

        //body.hoffset =  bodyhoffsetDefault * (clockScale / 100);
        //body.voffset =  bodyvoffsetDefault * (clockScale / 100);
        //body.width =  bodywidthDefault * (clockScale / 100);
        //body.height =  bodyheightDefault * (clockScale / 100);

	//background1.hoffset = _background1hoffsetDefault * (clockScale / 100);
	//background1.voffset = _background1voffsetDefault * (clockScale / 100);
	//background1.width   = _background1widthDefault * (clockScale / 100);
	//background1.height  = _background1heightDefault * (clockScale / 100);

        brassButtonB.hoffset =  brassButtonBhoffsetDefault * (clockScale / 100);
        brassButtonB.voffset =  brassButtonBvoffsetDefault * (clockScale / 100);
        brassButtonB.width =  brassButtonBwidthDefault * (clockScale / 100);
        brassButtonB.height =  brassButtonBheightDefault * (clockScale / 100);

        brassButtonT.hoffset =  brassButtonThoffsetDefault * (clockScale / 100);
        brassButtonT.voffset =  brassButtonTvoffsetDefault * (clockScale / 100);
        brassButtonT.width =  brassButtonTwidthDefault * (clockScale / 100);
        brassButtonT.height =  brassButtonTheightDefault * (clockScale / 100);

        screentop.hoffset =  screentophoffsetDefault * (clockScale / 100);
        screentop.voffset =  screentopvoffsetDefault * (clockScale / 100);
        screentop.width =  screentopwidthDefault * (clockScale / 100);
        screentop.height =  screentopheightDefault * (clockScale / 100);

        clearscreen.hoffset =  clearscreenhoffsetDefault * (clockScale / 100);
        clearscreen.voffset =  clearscreenvoffsetDefault * (clockScale / 100);
        clearscreen.width =  clearscreenwidthDefault * (clockScale / 100);
        clearscreen.height =  clearscreenheightDefault * (clockScale / 100);

        helpBottom.hoffset =  helpBottomhoffsetDefault * (clockScale / 100);
        helpBottom.voffset =  helpBottomvoffsetDefault * (clockScale / 100);
        helpBottom.width =  helpBottomwidthDefault * (clockScale / 100);
        helpBottom.height =  helpBottomheightDefault * (clockScale / 100);

        backscreen.hoffset = backscreenhoffsetCurrent * (clockScale / 100);

         if (preferences.backscreenPrefFlg.value == "raised")
         {
            backscreen.voffset = clearscreen.voffset + 5 * (clockScale / 100);
         }
         else if (preferences.backscreenPrefFlg.value == "lowered")
         {
            backscreen.voffset = clearscreen.voffset + 225 * (clockScale / 100);

         }

        backscreen.width =  backscreenwidthDefault * (clockScale / 100);
        backscreen.height =  backscreenheightDefault * (clockScale / 100);

        clearscreen2.hoffset =  clearscreen2hoffsetDefault * (clockScale / 100);
        clearscreen2.voffset =  clearscreen2voffsetDefault * (clockScale / 100);
        clearscreen2.width =  clearscreen2widthDefault * (clockScale / 100);
        clearscreen2.height =  clearscreen2heightDefault * (clockScale / 100);

        pastimage.hoffset =  pastimagehoffsetDefault * (clockScale / 100);
        pastimage.voffset =  pastimagevoffsetDefault * (clockScale / 100);
        pastimage.width =  pastimagewidthDefault * (clockScale / 100);
        pastimage.height =  pastimageheightDefault * (clockScale / 100);

        lhHinge.hoffset =  lhHingehoffsetDefault * (clockScale / 100);
        lhHinge.voffset =  lhHingevoffsetDefault * (clockScale / 100);
        lhHinge.width =  lhHingewidthDefault * (clockScale / 100);
        lhHinge.height =  lhHingeheightDefault * (clockScale / 100);

        rhHinge.hoffset =  rhHingehoffsetDefault * (clockScale / 100);
        rhHinge.voffset =  rhHingevoffsetDefault * (clockScale / 100);
        rhHinge.width =  rhHingewidthDefault * (clockScale / 100);
        rhHinge.height =  rhHingeheightDefault * (clockScale / 100);

        till01.hoffset =  till01hoffsetDefault * (clockScale / 100);
        till01.voffset =  till01voffsetDefault * (clockScale / 100);
        till01.width =  till01widthDefault * (clockScale / 100);
        till01.height =  till01heightDefault * (clockScale / 100);

        till02.hoffset =  till02hoffsetDefault * (clockScale / 100);
        till02.voffset =  till02voffsetDefault * (clockScale / 100);
        till02.width =  till02widthDefault * (clockScale / 100);
        till02.height =  till02heightDefault * (clockScale / 100);

        till03.hoffset =  till03hoffsetDefault * (clockScale / 100);
        till03.voffset =  till03voffsetDefault * (clockScale / 100);
        till03.width =  till03widthDefault * (clockScale / 100);
        till03.height =  till03heightDefault * (clockScale / 100);

        till04.hoffset =  till04hoffsetDefault * (clockScale / 100);
        till04.voffset =  till04voffsetDefault * (clockScale / 100);
        till04.width =  till04widthDefault * (clockScale / 100);
        till04.height =  till04heightDefault * (clockScale / 100);

        till05.hoffset =  till05hoffsetDefault * (clockScale / 100);
        till05.voffset =  till05voffsetDefault * (clockScale / 100);
        till05.width =  till05widthDefault * (clockScale / 100);
        till05.height =  till05heightDefault * (clockScale / 100);

        pendulumSet.hoffset =  pendulumSethoffsetDefault * (clockScale / 100);
        if (preferences.pendulumPref.value == "swing")
         {
             pendulumSet.voffset = ( 292 * (clockScale / 100));
             //print("here 2 swing voffset "+ pendulumSet.voffset);
             //print("here 2 swing vRegistrationPoint "+ pendulumSet.vRegistrationPoint);
         }
        else
         {   // not quite sure why but
             if (pendulumPressed == 1) {
                pendulumSet.voffset = ( 292 * (clockScale / 100));  // when the pendulumSet has been pressed
             } else {
                pendulumSet.voffset = ( 587 * (clockScale / 100));  // when the pendulum has never been swung
             }
             //print("here 3 noswing voffset "+ pendulumSet.voffset);
             //print("here 3 noswing vRegistrationPoint "+ pendulumSet.vRegistrationPoint);
        }
        pendulumSet.width =  pendulumSetwidthDefault * (clockScale / 100);
        pendulumSet.height =  pendulumSetheightDefault * (clockScale / 100);
        pendulumSet.hRegistrationPoint = pendulumSethRegistrationPointDefault * (clockScale / 100);
        pendulumSet.vRegistrationPoint = pendulumSetvRegistrationPointDefault * (clockScale / 100);

        dropdown.hoffset =  dropdownhoffsetDefault * (clockScale / 100);
        dropdown.voffset =  dropdownvoffsetDefault * (clockScale / 100);
        dropdown.width =  dropdownwidthDefault * (clockScale / 100);
        dropdown.height =  dropdownheightDefault * (clockScale / 100);

        drawstring.hoffset =  drawstringhoffsetDefault * (clockScale / 100);
        drawstring.voffset =  drawstringvoffsetDefault * (clockScale / 100);
        drawstring.width =  drawstringwidthDefault * (clockScale / 100);
        drawstring.height =  drawstringheightDefault * (clockScale / 100);

        brassbuttonH.hoffset =  brassbuttonHhoffsetDefault * (clockScale / 100);
        brassbuttonH.voffset =  brassbuttonHvoffsetDefault * (clockScale / 100);
        brassbuttonH.width =  brassbuttonHwidthDefault * (clockScale / 100);
        brassbuttonH.height =  brassbuttonHheightDefault * (clockScale / 100);

        brassbuttonA.hoffset =  brassbuttonAhoffsetDefault * (clockScale / 100);
        brassbuttonA.voffset =  brassbuttonAvoffsetDefault * (clockScale / 100);
        brassbuttonA.width =  brassbuttonAwidthDefault * (clockScale / 100);
        brassbuttonA.height =  brassbuttonAheightDefault * (clockScale / 100);

        brassbuttonL.hoffset =  brassbuttonLhoffsetDefault * (clockScale / 100);
        brassbuttonL.voffset =  brassbuttonLvoffsetDefault * (clockScale / 100);
        brassbuttonL.width =  brassbuttonLwidthDefault * (clockScale / 100);
        brassbuttonL.height =  brassbuttonLheightDefault * (clockScale / 100);

        brassbuttonM.hoffset =  brassbuttonMhoffsetDefault * (clockScale / 100);
        brassbuttonM.voffset =  brassbuttonMvoffsetDefault * (clockScale / 100);
        brassbuttonM.width =  brassbuttonMwidthDefault * (clockScale / 100);
        brassbuttonM.height =  brassbuttonMheightDefault * (clockScale / 100);

        brassbuttonP.hoffset =  brassbuttonPhoffsetDefault * (clockScale / 100);
        brassbuttonP.voffset =  brassbuttonPvoffsetDefault * (clockScale / 100);
        brassbuttonP.width =  brassbuttonPwidthDefault * (clockScale / 100);
        brassbuttonP.height =  brassbuttonPheightDefault * (clockScale / 100);

        woodenBar.hoffset =  woodenBarhoffsetDefault * (clockScale / 100);
        woodenBar.voffset =  woodenBarvoffsetDefault * (clockScale / 100);
        woodenBar.width =  woodenBarwidthDefault * (clockScale / 100);
        woodenBar.height =  woodenBarheightDefault * (clockScale / 100);

        bigdropdowncanvas.hoffset =  bigdropdowncanvashoffsetDefault * (clockScale / 100);
        bigdropdowncanvas.voffset =  bigdropdowncanvasvoffsetDefault * (clockScale / 100);
        bigdropdowncanvas.width =  bigdropdowncanvaswidthDefault * (clockScale / 100);
        bigdropdowncanvas.height =  bigdropdowncanvasheightDefault * (clockScale / 100);

        helpbrassbutton.hoffset =  helpbrassbuttonhoffsetDefault * (clockScale / 100);
        helpbrassbutton.voffset =  helpbrassbuttonvoffsetDefault * (clockScale / 100);
        helpbrassbutton.width =  helpbrassbuttonwidthDefault * (clockScale / 100);
        helpbrassbutton.height =  helpbrassbuttonheightDefault * (clockScale / 100);

        helptext.hoffset =  helptexthoffsetDefault * (clockScale / 100);
        helptext.voffset =  helptextvoffsetDefault * (clockScale / 100);
        helptext.width =  helptextwidthDefault * (clockScale / 100);
        helptext.height =  helptextheightDefault * (clockScale / 100);

        termstext.hoffset =  termstexthoffsetDefault * (clockScale / 100);
        termstext.voffset =  termstextvoffsetDefault * (clockScale / 100);
        termstext.width =  termstextwidthDefault * (clockScale / 100);
        termstext.height =  termstextheightDefault * (clockScale / 100);

        alarmtext.hoffset =  alarmtexthoffsetDefault * (clockScale / 100);
        alarmtext.voffset =  alarmtextvoffsetDefault * (clockScale / 100);
        alarmtext.width =  alarmtextwidthDefault * (clockScale / 100);
        alarmtext.height =  alarmtextheightDefault * (clockScale / 100);

        helpDrawstring.hoffset =  helpDrawstringhoffsetDefault * (clockScale / 100);
        helpDrawstring.voffset =  helpDrawstringvoffsetDefault * (clockScale / 100);
        helpDrawstring.width =  helpDrawstringwidthDefault * (clockScale / 100);
        helpDrawstring.height =  helpDrawstringheightDefault * (clockScale / 100);

        backgroundItems.hoffset =  backgroundItemshoffsetDefault * (clockScale / 100);
        backgroundItems.voffset =  backgroundItemsvoffsetDefault * (clockScale / 100);
        backgroundItems.width =  backgroundItemswidthDefault * (clockScale / 100);
        backgroundItems.height =  backgroundItemsheightDefault * (clockScale / 100);

        bottomBoxSet.hoffset =  bottomBoxSethoffsetDefault * (clockScale / 100);
        bottomBoxSet.voffset =  bottomBoxSetvoffsetDefault * (clockScale / 100);
        bottomBoxSet.width =  bottomBoxSetwidthDefault * (clockScale / 100);
        bottomBoxSet.height =  bottomBoxSetheightDefault * (clockScale / 100);

        heaterCoil.hoffset =  heaterCoilhoffsetDefault * (clockScale / 100);
        heaterCoil.voffset =  heaterCoilvoffsetDefault * (clockScale / 100);
        heaterCoil.width =  heaterCoilwidthDefault * (clockScale / 100);
        heaterCoil.height =  heaterCoilheightDefault * (clockScale / 100);

        orangeHeaterGlow.hoffset =  orangeHeaterGlowhoffsetDefault * (clockScale / 100);
        orangeHeaterGlow.voffset =  orangeHeaterGlowvoffsetDefault * (clockScale / 100);
        orangeHeaterGlow.width =  orangeHeaterGlowwidthDefault * (clockScale / 100);
        orangeHeaterGlow.height =  orangeHeaterGlowheightDefault * (clockScale / 100);

        meridienLetterSet.hoffset =  meridienLetterSethoffsetDefault * (clockScale / 100);
        meridienLetterSet.voffset =  meridienLetterSetvoffsetDefault * (clockScale / 100);
        meridienLetterSet.width =  meridienLetterSetwidthDefault * (clockScale / 100);
        meridienLetterSet.height =  meridienLetterSetheightDefault * (clockScale / 100);

        antipostLetterSet.hoffset =  antipostLetterSethoffsetDefault * (clockScale / 100);
        antipostLetterSet.voffset =  antipostLetterSetvoffsetDefault * (clockScale / 100);
        antipostLetterSet.width =  antipostLetterSetwidthDefault * (clockScale / 100);
        antipostLetterSet.height =  antipostLetterSetheightDefault * (clockScale / 100);

        monthLetter1LetterSet.hoffset =  monthLetter1LetterSethoffsetDefault * (clockScale / 100);
        monthLetter1LetterSet.voffset =  monthLetter1LetterSetvoffsetDefault * (clockScale / 100);
        monthLetter1LetterSet.width =  monthLetter1LetterSetwidthDefault * (clockScale / 100);
        monthLetter1LetterSet.height =  monthLetter1LetterSetheightDefault * (clockScale / 100);

        monthLetter3SetLetterSet.hoffset =  monthLetter3SetLetterSethoffsetDefault * (clockScale / 100);
        monthLetter3SetLetterSet.voffset =  monthLetter3SetLetterSetvoffsetDefault * (clockScale / 100);
        monthLetter3SetLetterSet.width =  monthLetter3SetLetterSetwidthDefault * (clockScale / 100);
        monthLetter3SetLetterSet.height =  monthLetter3SetLetterSetheightDefault * (clockScale / 100);

        monthLetter2LetterSet.hoffset =  monthLetter2LetterSethoffsetDefault * (clockScale / 100);
        monthLetter2LetterSet.voffset =  monthLetter2LetterSetvoffsetDefault * (clockScale / 100);
        monthLetter2LetterSet.width =  monthLetter2LetterSetwidthDefault * (clockScale / 100);
        monthLetter2LetterSet.height =  monthLetter2LetterSetheightDefault * (clockScale / 100);

        yearNumber4LetterSet.hoffset =  yearNumber4LetterSethoffsetDefault * (clockScale / 100);
        yearNumber4LetterSet.voffset =  yearNumber4LetterSetvoffsetDefault * (clockScale / 100);
        yearNumber4LetterSet.width =  yearNumber4LetterSetwidthDefault * (clockScale / 100);
        yearNumber4LetterSet.height =  yearNumber4LetterSetheightDefault * (clockScale / 100);

        yearNumber3LetterSet.hoffset =  yearNumber3LetterSethoffsetDefault * (clockScale / 100);
        yearNumber3LetterSet.voffset =  yearNumber3LetterSetvoffsetDefault * (clockScale / 100);
        yearNumber3LetterSet.width =  yearNumber3LetterSetwidthDefault * (clockScale / 100);
        yearNumber3LetterSet.height =  yearNumber3LetterSetheightDefault * (clockScale / 100);

        yearNumber2LetterSet.hoffset =  yearNumber2LetterSethoffsetDefault * (clockScale / 100);
        yearNumber2LetterSet.voffset =  yearNumber2LetterSetvoffsetDefault * (clockScale / 100);
        yearNumber2LetterSet.width =  yearNumber2LetterSetwidthDefault * (clockScale / 100);
        yearNumber2LetterSet.height =  yearNumber2LetterSetheightDefault * (clockScale / 100);

        yearNumber1LetterSet.hoffset =  yearNumber1LetterSethoffsetDefault * (clockScale / 100);
        yearNumber1LetterSet.voffset =  yearNumber1LetterSetvoffsetDefault * (clockScale / 100);
        yearNumber1LetterSet.width =  yearNumber1LetterSetwidthDefault * (clockScale / 100);
        yearNumber1LetterSet.height =  yearNumber1LetterSetheightDefault * (clockScale / 100);

        dayNumber2LetterSet.hoffset =  dayNumber2LetterSethoffsetDefault * (clockScale / 100);
        dayNumber2LetterSet.voffset =  dayNumber2LetterSetvoffsetDefault * (clockScale / 100);
        dayNumber2LetterSet.width =  dayNumber2LetterSetwidthDefault * (clockScale / 100);
        dayNumber2LetterSet.height =  dayNumber2LetterSetheightDefault * (clockScale / 100);

        dayNumber1LetterSet.hoffset =  dayNumber1LetterSethoffsetDefault * (clockScale / 100);
        dayNumber1LetterSet.voffset =  dayNumber1LetterSetvoffsetDefault * (clockScale / 100);
        dayNumber1LetterSet.width =  dayNumber1LetterSetwidthDefault * (clockScale / 100);
        dayNumber1LetterSet.height =  dayNumber1LetterSetheightDefault * (clockScale / 100);

        flag01.hoffset =  flag01hoffsetDefault * (clockScale / 100);
        flag01.voffset =  flag01voffsetDefault * (clockScale / 100);
        flag01.width =  flag01widthDefault * (clockScale / 100);
        flag01.height =  flag01heightDefault * (clockScale / 100);

        flag02.hoffset =  flag02hoffsetDefault * (clockScale / 100);
        flag02.voffset =  flag02voffsetDefault * (clockScale / 100);
        flag02.width =  flag02widthDefault * (clockScale / 100);
        flag02.height =  flag02heightDefault * (clockScale / 100);

        flag03.hoffset =  flag03hoffsetDefault * (clockScale / 100);
        flag03.voffset =  flag03voffsetDefault * (clockScale / 100);
        flag03.width =  flag03widthDefault * (clockScale / 100);
        flag03.height =  flag03heightDefault * (clockScale / 100);

        flag04.hoffset =  flag04hoffsetDefault * (clockScale / 100);
        flag04.voffset =  flag04voffsetDefault * (clockScale / 100);
        flag04.width =  flag04widthDefault * (clockScale / 100);
        flag04.height =  flag04heightDefault * (clockScale / 100);

        flag05.hoffset =  flag05hoffsetDefault * (clockScale / 100);
        flag05.voffset =  flag05voffsetDefault * (clockScale / 100);
        flag05.width =  flag05widthDefault * (clockScale / 100);
        flag05.height =  flag05heightDefault * (clockScale / 100);

        crank.hoffset =  crankhoffsetDefault * (clockScale / 100);
        crank.voffset =  crankvoffsetDefault * (clockScale / 100);
        crank.width =  crankwidthDefault * (clockScale / 100);
        crank.height =  crankheightDefault * (clockScale / 100);

        // dean
        if (preferences.crankHandlePref.value == "down") {
           crank.voffset=(377 * (clockScale / 100));
        } else {
           crank.voffset=(340 * (clockScale / 100));
        }

        topShelf.hoffset =  topShelfhoffsetDefault * (clockScale / 100);
        topShelf.voffset =  topShelfvoffsetDefault * (clockScale / 100);
        topShelf.width =  topShelfwidthDefault * (clockScale / 100);
        topShelf.height =  topShelfheightDefault * (clockScale / 100);

        mainCasingSurround.hoffset =  mainCasingSurroundhoffsetDefault * (clockScale / 100);
        mainCasingSurround.voffset =  mainCasingSurroundvoffsetDefault * (clockScale / 100);
        mainCasingSurround.width =  mainCasingSurroundwidthDefault * (clockScale / 100);
        mainCasingSurround.height =  mainCasingSurroundheightDefault * (clockScale / 100);

        cableCorner.hoffset =  cableCornerhoffsetDefault * (clockScale / 100);
        cableCorner.voffset =  cableCornervoffsetDefault * (clockScale / 100);
        cableCorner.width =  cableCornerwidthDefault * (clockScale / 100);
        cableCorner.height =  cableCornerheightDefault * (clockScale / 100);

        brassButtonS.hoffset =  brassButtonShoffsetDefault * (clockScale / 100);
        brassButtonS.voffset =  brassButtonSvoffsetDefault * (clockScale / 100);
        brassButtonS.width =  brassButtonSwidthDefault * (clockScale / 100);
        brassButtonS.height =  brassButtonSheightDefault * (clockScale / 100);

        brassButtonW.hoffset =  brassButtonWhoffsetDefault * (clockScale / 100);
        brassButtonW.voffset =  brassButtonWvoffsetDefault * (clockScale / 100);
        brassButtonW.width =  brassButtonWwidthDefault * (clockScale / 100);
        brassButtonW.height =  brassButtonWheightDefault * (clockScale / 100);

        topDigitalClock.hoffset =  topDigitalClockhoffsetDefault * (clockScale / 100);
        topDigitalClock.voffset =  topDigitalClockvoffsetDefault * (clockScale / 100);
        topDigitalClock.width =  topDigitalClockwidthDefault * (clockScale / 100);
        topDigitalClock.height =  topDigitalClockheightDefault * (clockScale / 100);

        minutesNumber2Set.hoffset =  minutesNumber2SethoffsetDefault * (clockScale / 100);
        minutesNumber2Set.voffset =  minutesNumber2SetvoffsetDefault * (clockScale / 100);
        minutesNumber2Set.width =  minutesNumber2SetwidthDefault * (clockScale / 100);
        minutesNumber2Set.height =  minutesNumber2SetheightDefault * (clockScale / 100);

        minutesNumber1Set.hoffset =  minutesNumber1SethoffsetDefault * (clockScale / 100);
        minutesNumber1Set.voffset =  minutesNumber1SetvoffsetDefault * (clockScale / 100);
        minutesNumber1Set.width =  minutesNumber1SetwidthDefault * (clockScale / 100);
        minutesNumber1Set.height =  minutesNumber1SetheightDefault * (clockScale / 100);

        hour2LetterSet.hoffset =  hour2LetterSethoffsetDefault * (clockScale / 100);
        hour2LetterSet.voffset =  hour2LetterSetvoffsetDefault * (clockScale / 100);
        hour2LetterSet.width =  hour2LetterSetwidthDefault * (clockScale / 100);
        hour2LetterSet.height =  hour2LetterSetheightDefault * (clockScale / 100);

        hour1LetterSet.hoffset =  hour1LetterSethoffsetDefault * (clockScale / 100);
        hour1LetterSet.voffset =  hour1LetterSetvoffsetDefault * (clockScale / 100);
        hour1LetterSet.width =  hour1LetterSetwidthDefault * (clockScale / 100);
        hour1LetterSet.height =  hour1LetterSetheightDefault * (clockScale / 100);

        cableWheelSet.hoffset =  cableWheelSethoffsetDefault * (clockScale / 100);
        cableWheelSet.voffset =  cableWheelSetvoffsetDefault * (clockScale / 100);
        cableWheelSet.width =  cableWheelSetwidthDefault * (clockScale / 100);
        cableWheelSet.height =  cableWheelSetheightDefault * (clockScale / 100);

        bar.hoffset =  barhoffsetDefault * (clockScale / 100);
        bar.voffset =  barvoffsetDefault * (clockScale / 100);
        bar.width =  barwidthDefault * (clockScale / 100);
        bar.height =  barheightDefault * (clockScale / 100);

        sliderSet.hoffset =  sliderSethoffsetDefault * (clockScale / 100);
        sliderSet.voffset =  sliderSetvoffsetDefault * (clockScale / 100);
        sliderSet.width =  sliderSetwidthDefault * (clockScale / 100);
        sliderSet.height =  sliderSetheightDefault * (clockScale / 100);

        cable.hoffset =  cablehoffsetDefault * (clockScale / 100);
        cable.voffset =  cablevoffsetDefault * (clockScale / 100);
        cable.width =  cablewidthDefault * (clockScale / 100);
        cable.height =  cableheightDefault * (clockScale / 100);

        clockSet.hoffset =  clockSethoffsetDefault * (clockScale / 100);
        clockSet.voffset =  clockSetvoffsetDefault * (clockScale / 100);
        clockSet.width =  clockSetwidthDefault * (clockScale / 100);
        clockSet.height =  clockSetheightDefault * (clockScale / 100);

        hourHand.hoffset =  hourHandhoffsetDefault * (clockScale / 100);
        hourHand.voffset =  hourHandvoffsetDefault * (clockScale / 100);
        hourHand.width =  hourHandwidthDefault * (clockScale / 100);
        hourHand.height =  hourHandheightDefault * (clockScale / 100);

        hourHand.hRegistrationPoint = hourHandhRegistrationPointDefault * (clockScale / 100);
        hourHand.vRegistrationPoint = hourHandvRegistrationPointDefault * (clockScale / 100);

        minuteHand.hoffset =  minuteHandhoffsetDefault * (clockScale / 100);
        minuteHand.voffset =  minuteHandvoffsetDefault * (clockScale / 100);
        minuteHand.width =  minuteHandwidthDefault * (clockScale / 100);
        minuteHand.height =  minuteHandheightDefault * (clockScale / 100);

        minuteHand.hRegistrationPoint = minuteHandhRegistrationPointDefault * (clockScale / 100);
        minuteHand.vRegistrationPoint = minuteHandvRegistrationPointDefault * (clockScale / 100);

        secondHand.hoffset =  secondHandhoffsetDefault * (clockScale / 100);
        secondHand.voffset =  secondHandvoffsetDefault * (clockScale / 100);
        secondHand.width =  secondHandwidthDefault * (clockScale / 100);
        secondHand.height =  secondHandheightDefault * (clockScale / 100);

        secondHand.hRegistrationPoint = secondHandhRegistrationPointDefault * (clockScale / 100);
        secondHand.vRegistrationPoint = secondHandvRegistrationPointDefault * (clockScale / 100);

        hole.hoffset =  holehoffsetDefault * (clockScale / 100);
        hole.voffset =  holevoffsetDefault * (clockScale / 100);
        hole.width =  holewidthDefault * (clockScale / 100);
        hole.height =  holeheightDefault * (clockScale / 100);

        grommet.hoffset =  grommethoffsetDefault * (clockScale / 100);
        grommet.voffset =  grommetvoffsetDefault * (clockScale / 100);
        grommet.width =  grommetwidthDefault * (clockScale / 100);
        grommet.height =  grommetheightDefault * (clockScale / 100);

        pin.hoffset =  pinhoffsetDefault * (clockScale / 100);
        pin.voffset =  pinvoffsetDefault * (clockScale / 100);
        pin.width =  pinwidthDefault * (clockScale / 100);
        pin.height =  pinheightDefault * (clockScale / 100);

        bellSet.hoffset =  bellSethoffsetDefault * (clockScale / 100);
        bellSet.voffset =  bellSetvoffsetDefault * (clockScale / 100);
        bellSet.width =  bellSetwidthDefault * (clockScale / 100);
        bellSet.height =  bellSetheightDefault * (clockScale / 100);

        clapper.hoffset =  clapperhoffsetDefault * (clockScale / 100);
        clapper.voffset =  clappervoffsetDefault * (clockScale / 100);
        clapper.width =  clapperwidthDefault * (clockScale / 100);
        clapper.height =  clapperheightDefault * (clockScale / 100);

        clapperRight.hoffset =  clapperRighthoffsetDefault * (clockScale / 100);
        clapperRight.voffset =  clapperRightvoffsetDefault * (clockScale / 100);
        clapperRight.width =  clapperRightwidthDefault * (clockScale / 100);
        clapperRight.height =  clapperRightheightDefault * (clockScale / 100);

        weekday.hoffset =  weekdayhoffsetDefault * (clockScale / 100);
        weekday.voffset =  weekdayvoffsetDefault * (clockScale / 100);
        weekday.width =  weekdaywidthDefault * (clockScale / 100);
        weekday.height =  weekdayheightDefault * (clockScale / 100);

        weekdaytext.hoffset =  weekdaytexthoffsetDefault * (clockScale / 100);
        weekdaytext.voffset =  weekdaytextvoffsetDefault * (clockScale / 100);
        weekdaytext.width =  weekdaytextwidthDefault * (clockScale / 100);
        weekdaytext.height =  weekdaytextheightDefault * (clockScale / 100);

        chain.hoffset =  chainhoffsetDefault * (clockScale / 100);
        chain.voffset =  chainvoffsetDefault * (clockScale / 100);
        chain.width =  chainwidthDefault * (clockScale / 100);
        chain.height =  chainheightDefault * (clockScale / 100);

        clockDeletion.hoffset =  clockDeletionhoffsetDefault * (clockScale / 100);
        clockDeletion.voffset =  clockDeletionvoffsetDefault * (clockScale / 100);
        clockDeletion.width =  clockDeletionwidthDefault * (clockScale / 100);
        clockDeletion.height =  clockDeletionheightDefault * (clockScale / 100);

        plaqueLink.hoffset =  plaqueLinkhoffsetDefault * (clockScale / 100);
        plaqueLink.voffset =  plaqueLinkvoffsetDefault * (clockScale / 100);
        plaqueLink.width =  plaqueLinkwidthDefault * (clockScale / 100);
        plaqueLink.height =  plaqueLinkheightDefault * (clockScale / 100);

        plaquetick.hoffset =  plaquetickhoffsetDefault * (clockScale / 100);
        plaquetick.voffset =  plaquetickvoffsetDefault * (clockScale / 100);
        plaquetick.width =  plaquetickwidthDefault * (clockScale / 100);
        plaquetick.height =  plaquetickheightDefault * (clockScale / 100);

        helpTop.hoffset =  helpTophoffsetDefault * (clockScale / 100);
        helpTop.voffset =  helpTopvoffsetDefault * (clockScale / 100);
        helpTop.width =  helpTopwidthDefault * (clockScale / 100);
        helpTop.height =  helpTopheightDefault * (clockScale / 100);

        //now change the fonts

        terminal00.size = 8 * (clockScale / 100);
        terminal01.size = 8 * (clockScale / 100);
        terminal02.size = 8 * (clockScale / 100);
        terminal03.size = 8 * (clockScale / 100);
        terminal04.size = 8 * (clockScale / 100);
        terminal05.size = 8 * (clockScale / 100);
        terminal06.size = 8 * (clockScale / 100);
        terminal07.size = 8 * (clockScale / 100);
        terminal08.size = 8 * (clockScale / 100);
        terminal09.size = 8 * (clockScale / 100);
        terminal10.size = 8 * (clockScale / 100);
        terminal11.size = 8 * (clockScale / 100);
        terminal12.size = 8 * (clockScale / 100);
        terminal13.size = 8 * (clockScale / 100);
        terminal14.size = 8 * (clockScale / 100);
        terminal15.size = 8 * (clockScale / 100);

        terminal00.hoffset = terminal00hoffsetDefault * (clockScale / 100);
        terminal01.hoffset = terminal01hoffsetDefault * (clockScale / 100);
        terminal02.hoffset = terminal02hoffsetDefault * (clockScale / 100);
        terminal03.hoffset = terminal03hoffsetDefault * (clockScale / 100);
        terminal04.hoffset = terminal04hoffsetDefault * (clockScale / 100);
        terminal05.hoffset = terminal05hoffsetDefault * (clockScale / 100);
        terminal06.hoffset = terminal06hoffsetDefault * (clockScale / 100);
        terminal07.hoffset = terminal07hoffsetDefault * (clockScale / 100);
        terminal08.hoffset = terminal08hoffsetDefault * (clockScale / 100);
        terminal09.hoffset = terminal09hoffsetDefault * (clockScale / 100);
        terminal10.hoffset = terminal10hoffsetDefault * (clockScale / 100);
        terminal11.hoffset = terminal11hoffsetDefault * (clockScale / 100);
        terminal12.hoffset = terminal12hoffsetDefault * (clockScale / 100);
        terminal13.hoffset = terminal13hoffsetDefault * (clockScale / 100);
        terminal14.hoffset = terminal14hoffsetDefault * (clockScale / 100);
        terminal15.hoffset = terminal15hoffsetDefault * (clockScale / 100);


        terminal00.voffset = terminal00voffsetDefault * (clockScale / 100);
        terminal01.voffset = terminal01voffsetDefault * (clockScale / 100);
        terminal02.voffset = terminal02voffsetDefault * (clockScale / 100);
        terminal03.voffset = terminal03voffsetDefault * (clockScale / 100);
        terminal04.voffset = terminal04voffsetDefault * (clockScale / 100);
        terminal05.voffset = terminal05voffsetDefault * (clockScale / 100);
        terminal06.voffset = terminal06voffsetDefault * (clockScale / 100);
        terminal07.voffset = terminal07voffsetDefault * (clockScale / 100);
        terminal08.voffset = terminal08voffsetDefault * (clockScale / 100);
        terminal09.voffset = terminal09voffsetDefault * (clockScale / 100);
        terminal10.voffset = terminal10voffsetDefault * (clockScale / 100);
        terminal11.voffset = terminal11voffsetDefault * (clockScale / 100);
        terminal12.voffset = terminal12voffsetDefault * (clockScale / 100);
        terminal13.voffset = terminal13voffsetDefault * (clockScale / 100);
        terminal14.voffset = terminal14voffsetDefault * (clockScale / 100);
        terminal15.voffset = terminal15voffsetDefault * (clockScale / 100);

        Copyright.size = 10 * (clockScale / 100);
        Copyright.hoffset = CopyrighthoffsetDefault * (clockScale / 100);
        Copyright.voffset = CopyrightvoffsetDefault * (clockScale / 100);
        Terms.size = 10 * (clockScale / 100);
        Terms.hoffset = TermshoffsetDefault * (clockScale / 100);
        Terms.voffset = TermsvoffsetDefault * (clockScale / 100);
        Privacy.size = 10 * (clockScale / 100);
        Privacy.hoffset= PrivacyhoffsetDefault * (clockScale / 100);
        Privacy.voffset= PrivacyvoffsetDefault * (clockScale / 100);
        Download.size = 10 * (clockScale / 100);
        Download.hoffset = DownloadhoffsetDefault * (clockScale / 100);
        Download.voffset = DownloadvoffsetDefault * (clockScale / 100);
        Read.size = 10 * (clockScale / 100);
        Read.hoffset = ReadhoffsetDefault * (clockScale / 100);
        Read.voffset = ReadvoffsetDefault * (clockScale / 100);


   //variables for the alarm toggle positions
   flag01HoffsetIn= Math.round( 585 * (clockScale / 100));
   flag02HoffsetIn= Math.round( 592 * (clockScale / 100));
   flag03HoffsetIn= Math.round( 603 * (clockScale / 100));
   flag04HoffsetIn= Math.round( 609 * (clockScale / 100));
   flag05HoffsetIn= Math.round( 611 * (clockScale / 100));
   //variables for the alarm toggle positions
   flag01HoffsetOut = Math.round( 590 * (clockScale / 100));
   flag02HoffsetOut = Math.round( 597 * (clockScale / 100));
   flag03HoffsetOut = Math.round( 608 * (clockScale / 100));
   flag04HoffsetOut = Math.round( 614 * (clockScale / 100));
   flag05HoffsetOut = Math.round( 615 * (clockScale / 100));

   //these preserve the positioning of the toggle buttons after a resize

   setBrassbuttonLOnStartup();
   setBrassbuttonMOnStartup();
   setBrassbuttonPOnStartup();
   setBrassbuttonAOnStartup();
   setBrassbuttonTOnStartup();
   setBrassbuttonSOnStartup();
   setBrassbuttonWOnStartup();
   setBrassbuttonBOnStartup();
}

//=====================
//End function
//=====================



//==============================================================================
//  turnoffticking
//==============================================================================
function turnoffticking()
{
         if (preferences.soundsPref.value=="no tick")
         {
            play (clunk);
            preferences.soundsPref.value="tick";
            checkticking();
            chain.voffset = chain.voffset + (40 * (clockScale / 100));
            sleep (200);
            chain.voffset = 275 * (clockScale / 100);
         }
         else
         {
            chain.voffset = chain.voffset + (40 * (clockScale / 100));
            sleep (200);
            chain.voffset = 275 * (clockScale / 100);
            play (clunk);
            sleep (500);
            preferences.soundsPref.value="no tick";
            checkticking();
         }
}
//=====================
//End function
//=====================

//===========================================
// this is the main function that really does all the work
//===========================================
function vitality() {
    vitalitycnt = vitalitycnt + 1 ; // update the dock vitality once a minute.
    if (vitalitycnt !== 60 && runmode != "startup") {
        return;
    }
    screenwrite("building Dock Vitality using " + wkdy + " " + hr + ":" + mn);
    if (debugFlg === 1) {print("%KON-I-INFO,building dock vitality " + wkdy);};
    if (hr < 10) {hr = "0" + hr };
    if (mn < 10) {mn = "0" + mn };
    buildVitality("Resources/dockicon.png",wkdy,hr,mn);
    vitalitycnt = 0 ; // update the drives once a minute.
}
//=====================
//End function
//=====================


//===========================================
// returns the date/time in a string format
//===========================================
function changecounter() {

              hourHand.opacity =100;
              minuteHand.opacity =100;
              secondHand.opacity =100;
              var rotatingFlg = true;


              if (preferences.rangeMathPrefFlg.value == "maths") {
                //if (debugFlg === 1) {print("%KON-I-INFO, calculating using "+preferences.rangeMathPrefFlg.value);};

                if (sliderSet.hoffset-(396* (clockScale / 100)) <=(-1* (clockScale / 100))  && sliderSet.hoffset-(396* (clockScale / 100)) >(-4* (clockScale / 100)))
                {
                      hourHand.opacity =255;
                      minuteHand.opacity =255;
                      secondHand.opacity =255;
                      rotatingFlg = false;
                }


                 //advance or retreat seconds
                 if (timeDeviationFlg == 0) {
                    //timeDeviation = Math.abs(timeDeviation);
                    timecount = timecount - timeDeviation;
                 } else {
                    //timeDeviation = Math.abs(timeDeviation);
                    timecount = timecount + timeDeviation;
                 }
              }

              //if (debugFlg === 1) {print("%KON-I-INFO, timeDeviationFlg "+timeDeviationFlg);};
              //if (debugFlg === 1) {print("%KON-I-INFO, timeDeviation "+timeDeviation);};
              //if (debugFlg === 1) {print("%KON-I-INFO, timecount "+timecount);};


                 // the old method of advancing or retarding by range rather than math
                 // now no longer utilised, retained for testing re: cpu usage.
              if (preferences.rangeMathPrefFlg.value == "range") {
                if (debugFlg === 1) {print("%KON-I-INFO, calculating using "+preferences.rangeMathPrefFlg.value);};
                  if (sliderSet.hoffset-(396* (clockScale / 100)) <=(-1* (clockScale / 100))  && sliderSet.hoffset-(396* (clockScale / 100)) >(-4* (clockScale / 100)))
                  {
                        hourHand.opacity =255;
                        minuteHand.opacity =255;
                        secondHand.opacity =255;
                        rotatingFlg = false;
                  }
                 else if (sliderSet.hoffset-(396* (clockScale / 100)) <=(-4* (clockScale / 100)) && sliderSet.hoffset-(396* (clockScale / 100)) >(-8* (clockScale / 100)))
                 {
                     timecount = timecount - 15000; // 30 seconds
                 }
                 else if (sliderSet.hoffset-(396* (clockScale / 100)) <=(-8* (clockScale / 100)) && sliderSet.hoffset-(396* (clockScale / 100)) >(-12* (clockScale / 100)))
                 {
                     timecount = timecount - 30000; // 1 minute
                 }
                 else if (sliderSet.hoffset-(396* (clockScale / 100)) <=(-12* (clockScale / 100)) && sliderSet.hoffset-(396* (clockScale / 100)) >(-16* (clockScale / 100)))
                 {
                     timecount = timecount - 300000; // 10 minutes
                 }
                 else if (sliderSet.hoffset-(396* (clockScale / 100)) <=(-16* (clockScale / 100)) && sliderSet.hoffset-(396* (clockScale / 100)) >(-20* (clockScale / 100)))
                 {
                     timecount = timecount - 900000; // 30 minutes
                 }
                 else if (sliderSet.hoffset-(396* (clockScale / 100)) <=(-20* (clockScale / 100)) && sliderSet.hoffset-(396* (clockScale / 100)) >(-24* (clockScale / 100)))
                 {
                     timecount = timecount - 1800000; // 1 hour
                 }
                 else if (sliderSet.hoffset-(396* (clockScale / 100)) <=(-24* (clockScale / 100)) && sliderSet.hoffset-(396* (clockScale / 100)) >(-28* (clockScale / 100)))
                 {
                     timecount = timecount - 7400000; // 4 hours
                 }
                 else if (sliderSet.hoffset-(396* (clockScale / 100)) <=(-28* (clockScale / 100)) && sliderSet.hoffset-(396* (clockScale / 100)) >(-32* (clockScale / 100)))
                 {
                     timecount = timecount - 43400000; // 1 day
                 }
                 else if (sliderSet.hoffset-(396* (clockScale / 100)) <=(-32* (clockScale / 100)) && sliderSet.hoffset-(396* (clockScale / 100)) >(-36* (clockScale / 100)))
                 {
                     timecount = timecount - 175600000; // 4 days
                 }
                 else if (sliderSet.hoffset-(396* (clockScale / 100)) <=(-36* (clockScale / 100)) && sliderSet.hoffset-(396* (clockScale / 100)) >(-40* (clockScale / 100)))
                 {
                     timecount = timecount - 702400000; // 16 days
                 }
                 else if (sliderSet.hoffset-(396* (clockScale / 100)) <=(-40* (clockScale / 100)) && sliderSet.hoffset-(396* (clockScale / 100)) >(-44* (clockScale / 100)))
                 {
                     timecount = timecount - 1258000000; // 1 month
                 }
                 else if (sliderSet.hoffset-(396* (clockScale / 100)) <=(-44* (clockScale / 100)))
                 {
                     timecount = timecount - 5052000000; // 4 months
                 }

                 //advance seconds
    
                 if (sliderSet.hoffset-(396* (clockScale / 100)) >=(0* (clockScale / 100))  && sliderSet.hoffset-(396* (clockScale / 100)) <(4* (clockScale / 100)))
                 {
                        hourHand.opacity =255;
                        minuteHand.opacity =255;
                        secondHand.opacity =255;
                        rotatingFlg = false;
                 }
                 else if (sliderSet.hoffset-(396* (clockScale / 100)) >=(4* (clockScale / 100)) && sliderSet.hoffset-(396* (clockScale / 100)) <(8* (clockScale / 100)))
                 {
                     timecount = timecount + 15000; // 30 seconds
                 }
                 else if (sliderSet.hoffset-(396* (clockScale / 100)) >=(8* (clockScale / 100)) && sliderSet.hoffset-(396* (clockScale / 100)) <(12* (clockScale / 100)))
                 {
                     timecount = timecount + 30032; // 1 minute
                 }
                 else if (sliderSet.hoffset-(396* (clockScale / 100)) >=(12* (clockScale / 100)) && sliderSet.hoffset-(396* (clockScale / 100)) <(16* (clockScale / 100)))
                 {
                     timecount = timecount + 300023; // 10 minutes
                 }
                 else if (sliderSet.hoffset-(396* (clockScale / 100)) >=(16* (clockScale / 100)) && sliderSet.hoffset-(396* (clockScale / 100)) <(20* (clockScale / 100)))
                 {
                     timecount = timecount + 900099; // 30 minutes
                 }
                 else if (sliderSet.hoffset-(396* (clockScale / 100)) >=(20* (clockScale / 100)) && sliderSet.hoffset-(396* (clockScale / 100)) <(24* (clockScale / 100)))
                 {
                     timecount = timecount + 1800064; // 1 hour
                 }
                 else if (sliderSet.hoffset-(396* (clockScale / 100)) >=(24* (clockScale / 100)) && sliderSet.hoffset-(396* (clockScale / 100)) <(28* (clockScale / 100)))
                 {
                     timecount = timecount + 7200777; // 4 hours
                 }
                 else if (sliderSet.hoffset-(396* (clockScale / 100)) >=(28* (clockScale / 100)) && sliderSet.hoffset-(396* (clockScale / 100)) <(32* (clockScale / 100)))
                 {
                     timecount = timecount + 43404568; // 1 day
                 }
                 else if (sliderSet.hoffset-(396* (clockScale / 100)) >=(32* (clockScale / 100)) && sliderSet.hoffset-(396* (clockScale / 100)) <(36* (clockScale / 100)))
                 {
                     timecount = timecount + 175600678; // 4 days
                 }
                 else if (sliderSet.hoffset-(396* (clockScale / 100)) >=(36* (clockScale / 100)) && sliderSet.hoffset-(396* (clockScale / 100)) <(40* (clockScale / 100)))
                 {
                     timecount = timecount + 702406672; // 16 days
                 }
                 else if (sliderSet.hoffset-(396* (clockScale / 100)) >=(40* (clockScale / 100)) && sliderSet.hoffset-(396* (clockScale / 100)) <(44* (clockScale / 100)))
                 {
                     timecount = timecount + 1258034006; // 1 month
                 }
                 else if (sliderSet.hoffset-(396* (clockScale / 100)) >=(44* (clockScale / 100)))
                 {
                     timecount = timecount + 5052000008; // 4 months
                 }
             }

             //if (debugFlg === 1) {print("%KON-I-INFO,value =  ",sliderSet.hoffset-(396* (clockScale / 100)));};
             //if (debugFlg === 1) {print("%KON-I-INFO,timecount",timecount);};

             // uses basetime when there is no previous alarm, otherwise is a deviation from the alarm time - dean
             if (alarmtime == 0 ) {
                 alarmtime = basetimecurrent + timecount;
             } else {
                 alarmtime = alarmtime + timecount;
             }

             humanreadablealarmdate = new Date(alarmtime);

              if (debugFlg === 1) {print("%setalarm-I-INFO, 1 alarmtime ",alarmtime);};
              if (debugFlg === 1) {print("%setalarm-I-INFO, 1 humanreadablealarmdate ",humanreadablealarmdate);};

             //if (debugFlg === 1) {print("%KON-I-INFO,mydate",mydate);};

             //returns the date/time in a string format

             hr= humanreadablealarmdate.getHours();
             mn= humanreadablealarmdate.getMinutes();
             se = humanreadablealarmdate.getSeconds();
             dt= humanreadablealarmdate.getDate();

             //print ("3 ************************ dt "+dt);

             wkd= humanreadablealarmdate.getDay();
             mnth= humanreadablealarmdate.getMonth();
             yr= humanreadablealarmdate.getFullYear();

             if ( preferences.timeMachinePrefFlg.value == "raised" ) {
                if (filesystem.itemExists("Resources/" + yr + ".jpg") && oldyear != yr)   {
                   timeMachineTimer.ticking = true;
                }
             }

             returndateandtimevalues();

             //display the letters and numbers of the time

             updatecounters();

            //turn off the weekday indicator as it would be continuously changing (and dinging)
            if (preferences.weekdayPref.value == "raised" && rotatingFlg === true )
            {
                   weekdaytoggle();
            }
             //display the letters and numbers of the day of the week

             updateweekday();
}
//=====================
//End function
//=====================


//==============================================================================
//  this simoply fades in an image
//==============================================================================
function timeMachineTimerTicking()
{
                   pastimage.src= "Resources/" + yr + ".jpg";
                   pastimage.opacity = 0;
                   pastimage.visible= true;
                   for (var a =0;a<=20;a++)
                   {
                       pastimage.opacity = pastimage.opacity + 12;
                       sleep(5);
                   }
                   oldyear = yr;
                   timeMachineTimer.ticking = false;
}
//=====================
//End function
//=====================


//==============================
// pins the widget in place
//==============================
grommet.onMouseDown = function () {
	if (!mainWindow.locked) {
                mainWindow.locked = true;

                preferences.hoffsetpref.value = mainWindow.hoffset;
        	preferences.voffsetpref.value = mainWindow.voffset;

                preferences.widgetLockPref.value = "1";
		pin.src = "Resources/pin.png";
                //lockArea.vOffset = lockArea.vOffset - 10 * Scale; ;
	} else {
                mainWindow.locked = false;

                preferences.hoffsetpref.value = 0;
        	preferences.voffsetpref.value = 0;

	        // this does not work yet
		//lockArea.vOffset = lockArea.vOffset + 10 * Scale; ;
		pin.src = "Resources/pin-shadow.png";
		preferences.widgetLockPref.value = "0";
 }
    //check the level of sound first
    if (preferences.soundLevelPref.value != "silent")
    {
		    
        if (preferences.soundPref === "enabled") {
        		play(lock, false);
        	}
    }
};
//=====================
//End function
//=====================

//==============================
// these functions handle the clicks
//==============================
minutesNumber1Set.onMouseDown = function () {
      rotatorTypeClicked = "1";
      if (debugFlg === 1) {print("rotatorTypeClicked "+ rotatorTypeClicked);};

};

minutesNumber2Set.onMouseDown = function () {
      rotatorTypeClicked = "2";
      if (debugFlg === 1) {print("rotatorTypeClicked "+ rotatorTypeClicked);};
};

hour2LetterSet.onMouseDown = function () {
      rotatorTypeClicked = "3";
      if (debugFlg === 1) {print("rotatorTypeClicked "+ rotatorTypeClicked);};
};

hour1LetterSet.onMouseDown = function () {
      rotatorTypeClicked = "4";
      if (debugFlg === 1) {print("rotatorTypeClicked "+ rotatorTypeClicked);};
};

monthLetter1LetterSet.onMouseDown = function () {
      rotatorTypeClicked = "5";
      if (debugFlg === 1) {print("rotatorTypeClicked "+ rotatorTypeClicked);};
};

monthLetter2LetterSet.onMouseDown = function () {
      rotatorTypeClicked = "6";
      if (debugFlg === 1) {print("rotatorTypeClicked "+ rotatorTypeClicked);};
};

monthLetter3SetLetterSet.onMouseDown = function () {
      rotatorTypeClicked = "7";
      if (debugFlg === 1) {print("rotatorTypeClicked "+ rotatorTypeClicked);};
};

dayNumber1LetterSet.onMouseDown = function () {
      rotatorTypeClicked = "8";
      if (debugFlg === 1) {print("rotatorTypeClicked "+ rotatorTypeClicked);};
};

dayNumber2LetterSet.onMouseDown = function () {
      rotatorTypeClicked = "9";
      if (debugFlg === 1) {print("rotatorTypeClicked "+ rotatorTypeClicked);};
};

yearNumber1LetterSet.onMouseDown = function () {
      rotatorTypeClicked = "10";
      if (debugFlg === 1) {print("rotatorTypeClicked "+ rotatorTypeClicked);};
};

yearNumber2LetterSet.onMouseDown = function () {
      rotatorTypeClicked = "11";
      if (debugFlg === 1) {print("rotatorTypeClicked "+ rotatorTypeClicked);};
};

yearNumber3LetterSet.onMouseDown = function () {
      rotatorTypeClicked = "12";
      if (debugFlg === 1) {print("rotatorTypeClicked "+ rotatorTypeClicked);};
;}

yearNumber4LetterSet.onMouseDown = function () {
      rotatorTypeClicked = "13";
      if (debugFlg === 1) {print("rotatorTypeClicked "+ rotatorTypeClicked);};
};
//=====================
//End function
//=====================



//==============================
// these functions...
//==============================
minutesNumber1Set.onMouseWheel = function (event) {
      incrementSingleMinutes(event.scrollDelta);
};

minutesNumber2Set.onMouseWheel = function (event) {
      incrementTenMinutes(event.scrollDelta);
};

hour2LetterSet.onMouseWheel = function (event) {
      incrementSingleHour(event.scrollDelta);
};

hour1LetterSet.onMouseWheel = function (event) {
      incrementSingleHour(event.scrollDelta);
};

monthLetter1LetterSet.onMouseWheel = function (event) {
      incrementMonth(event.scrollDelta);
};

monthLetter2LetterSet.onMouseWheel = function (event) {
      incrementMonth(event.scrollDelta);
};

monthLetter3SetLetterSet.onMouseWheel = function (event) {
      incrementMonth(event.scrollDelta);
};

dayNumber1LetterSet.onMouseWheel = function (event) {
  incrementDay(event.scrollDelta);
};

dayNumber2LetterSet.onMouseWheel = function (event) {
  incrementDay(event.scrollDelta);
};

yearNumber1LetterSet.onMouseWheel = function (event) {
      incrementMillenia(event.scrollDelta);
};

yearNumber2LetterSet.onMouseWheel = function (event) {
      incrementCentury(event.scrollDelta);
};

yearNumber3LetterSet.onMouseWheel = function (event) {
      incrementDecade(event.scrollDelta);
;}

yearNumber4LetterSet.onMouseWheel = function (event) {
      incrementYear(event.scrollDelta);
};
//=====================
//End function
//=====================

//==============================================================================
//  this increments the month indicator
//==============================================================================
function incrementMonth(scrollData) {
     var nmnth = 0;
     //print ("incrementMonth 1 ******** incoming month "+month);
     if (clockTimer.ticking==false) {
         screenwrite("changing the Month");
         nmnth = Number(mnth);
         if (scrollData > 0) {
                 nmnth = nmnth + 1;
                 if (nmnth >11 ) {
                   nmnth = 0;
                 }
         } else if (scrollData < 0) {
                 nmnth = nmnth - 1;
                 if (nmnth <0 ) {
                   nmnth = 11;
                 }
         }
         mnth = nmnth;
         month = months[mnth];

         // build a date string
         var dateStr = dt+"\/"+(mnth+1)+"\/"+year;
         //print("dateStr "+ dateStr);

        // check the date is valid
         var validDate = checkDate (dateStr)
         //print("validDate "+ validDate);

         // if not valid decrement the month by one
         if (validDate != true) {
             nmnth = nmnth - 1;
         }
         month = months[nmnth];

         updatecounters();
             
        if (preferences.soundPref === "enabled") {
        		play(counter2, false);
        	}
         createTimeStamp();
     }
}
//========================
// END function
//========================



//==============================
// this functions...
//==============================
function incrementSingleHour(scrollData) {
     var thour = 0;
     if (clockTimer.ticking==false) {
         screenwrite("changing the single hour");
         thour = Number(hour);

         if (scrollData > 0) {
                 thour = thour + 1;
                 if (thour >12 ) {
                   thour = 0;
                 }
         } else if (scrollData < 0) {
                 thour = thour - 1;
                 if (thour <0 ) {
                   thour = 12;
                 }
         }
         hour = thour.toString();

         updatecounters();
             
        if (preferences.soundPref === "enabled") {
        		play(counter2, false);
        	}
         createTimeStamp();
     }
}
//========================
// END function
//========================



//==============================
// this functions...
//==============================
function incrementTenMinutes(scrollData) {
     var tmins = 0;
     //print ("incrementMonth 1 ******** incoming month "+month);
     if (clockTimer.ticking==false) {
         screenwrite("changing the ten minute");
         tmins = Number(mins);
         if (scrollData > 0) {
                 tmins = tmins + 10;
                 if (tmins >59 ) {
                   tmins = 0;
                 }
         } else if (scrollData < 0) {
                 tmins = tmins - 10;
                 if (tmins <0 ) {
                   tmins = 59;
                 }
         }
         mins = tmins.toString();

         updatecounters();
             
        if (preferences.soundPref === "enabled") {
        		play(counter2, false);
        	}
         createTimeStamp();
     }
}
//========================
// END function
//========================



//==============================
// this functions...
//==============================
function incrementSingleMinutes(scrollData) {
     var tmins = 0;
     //print ("incrementMonth 1 ******** incoming month "+month);
     if (clockTimer.ticking==false) {
         screenwrite("changing the single minute");
         tmins = Number(mins);
         if (scrollData > 0) {
                 tmins = tmins + 1;
                 if (tmins >59 ) {
                   tmins = 0;
                 }
         } else if (scrollData < 0) {
                 tmins = tmins - 1;
                 if (tmins <0 ) {
                   tmins = 59;
                 }
         }
         mins = tmins.toString();
         mins = padToLeft(mins, "0", 2);

         updatecounters();
             
        if (preferences.soundPref === "enabled") {
        		play(counter2, false);
        	}
         createTimeStamp();
     }
}
//========================
// END function
//========================

//==============================================================================
//  this increments the day indicator
//==============================================================================
function incrementDay(scrollData) {
     var ndt = 0;
     if (clockTimer.ticking==false) {
         screenwrite("changing the Day");
         ndt = Number(dt);

         if (scrollData > 0) {
                 ndt = ndt + 1;
                 if (ndt >31 ) {
                   ndt = 1;
                 }
         } else if (scrollData < 0) {
                 ndt = ndt - 1;
                 if (ndt <=0 ) {
                   ndt = 31;
                 }
         }

         // build a date string
         var dateStr = ndt+"\/"+(mnth+1)+"\/"+year;
         // check the date is valid
         var validDate = checkDate (dateStr)
         // if not valid decrement the day by one
         if (validDate != true) {
             ndt = ndt - 1;
         }

         dt = ndt.toString();
         dt = padToLeft(dt, "0", 2);

         updatecounters();
             
        if (preferences.soundPref === "enabled") {
        		play(counter2, false);
        	}
         createTimeStamp();
     }
}
//========================
// END function
//========================

//==============================================================================
//  this increments the millenia indicator
//==============================================================================
function incrementMillenia(scrollData) {
     var nyear = 0;
     if (clockTimer.ticking==false) {
         screenwrite("changing the Millenia");
         //print("using mousewheel");
         //print("year = " +year);
         nyear = Number(year);
         if (scrollData > 0) {
                 nyear = nyear + 1000;
         } else if (scrollData < 0) {
                 nyear = nyear - 1000;
                 if (nyear <=0 ) {
                   nyear = 0;
                 }
         }
         year = nyear.toString();
         year = padToLeft(year, "0", 4);
         //print("nyear = " + nyear);
         //print("year = " + year);
         updatecounters();
             
        if (preferences.soundPref === "enabled") {
        		play(counter2, false);
        	}
         createTimeStamp();
     }
}
//========================
// END function
//========================

//==============================================================================
//  this increments the Century indicator
//==============================================================================
function incrementCentury(scrollData) {
     var nyear = 0;
     if (clockTimer.ticking==false) {
         screenwrite("changing the Century");
         //print("using mousewheel");
         //print("year = " +year);
         nyear = Number(year);
         if (scrollData > 0) {
                 nyear = nyear + 100;
         } else if (scrollData < 0) {
                 nyear = nyear - 100;
                 if (nyear <=0 ) {
                   nyear = 0;
                 }
         }
         year = nyear.toString();
         year = padToLeft(year, "0", 4);
         //print("nyear = " + nyear);
         //print("year = " + year);
         updatecounters();
             
        if (preferences.soundPref === "enabled") {
        		play(counter2, false);
        	}
         createTimeStamp();
     }
}
//========================
// END function
//========================

//==============================================================================
//  this increments the decade indicator
//==============================================================================
function incrementDecade(scrollData) {
     var nyear = 0;
     if (clockTimer.ticking==false) {
         screenwrite("changing the Decade");
         //print("using mousewheel");
         //print("year = " +year);
         nyear = Number(year);
         //print("nyear = " + nyear);
         if (scrollData > 0) {
                 nyear = nyear + 10;
         } else if (scrollData < 0) {
                 nyear = nyear - 10;
                 if (nyear <=0 ) {
                   nyear = 0;
                 }
         }
         year = nyear.toString();
         year = padToLeft(year, "0", 4);

         //print("year = " + year);
         updatecounters();
             
        if (preferences.soundPref === "enabled") {
        		play(counter2, false);
        	}
         createTimeStamp();
     }
}
//========================
// END function
//========================
//==============================================================================
//  this increments the year indicator
//==============================================================================
function incrementYear(scrollData) {
     var nyear = 0;
     if (clockTimer.ticking==false) {
         screenwrite("changing the Year");
         //print("using mousewheel");
         //print("1 year = " + year);
         nyear = Number(year);
         //print("1 nyear = " + nyear);
         if (scrollData > 0) {
                 nyear = nyear + 1;
         } else if (scrollData < 0) {
                 nyear = nyear - 1;
                 if (nyear <=0 ) {
                   nyear = 0;
                 }
         }
         year = nyear.toString();
         year = padToLeft(year, "0", 4);
         updatecounters();
             
        if (preferences.soundPref === "enabled") {
        		play(counter2, false);
        	}
         createTimeStamp();
     }
}
//========================
// END function
//========================


//==============================================================================
//  create a unix time from the various bits
//==============================================================================
function createTimeStamp() {

        var datestr = wkdy+", "+dt+" "+month+" "+year+" "+hour+":"+mins+":00";  //+"T"+hour+":"+mins+":00";
        //print(">>>>>>>>>>datestr "+datestr);

        alarmtime = new Date(datestr);
        alarmtime = alarmtime.getTime();
        //print(">>>>>>>>>>alarmtime "+alarmtime);

        //var humanreadablealarmdate = new Date(alarmtime);
        //print(">>>>>>>>>>humanreadablealarmdate "+humanreadablealarmdate);
}
//========================
// END function
//========================


//==============================================================================
//  pad a string out to four characters
//==============================================================================
function padToLeft(stringToPad, padString, length) {
    var str = stringToPad;
    while (str.length < length)
    str = padString + str;
    return str;
}
//========================
// END function
//========================

//the following function needs to operate on both the background and background2 faces, as the ctrl event can only be caught by the
//onMouseWheel itself on one object the event cannot be referred to by the key click on another object. The function would have to be duplicated
//for the background and background2 objects. Instead I have made the background object opacity to 1 so it seems as if it is not
//visible but it still responds to keyclicks and mousewheel movements even when supposedly 'invisible' - see the showFace function.
//==================================
//  function to capture a resize
//==================================
clearscreen2.onMouseWheel = function (event) {
	var size = Number(preferences.maxWidthPref.value),
		maxLength = Number(preferences.maxWidthPref.maxLength),
		minLength = Number(preferences.maxWidthPref.minLength),
		ticks = Number(preferences.maxWidthPref.ticks),
		step = Math.round((maxLength - minLength) / (ticks - 1));

	//if (event.ctrlKey) {
		if (event.scrollDelta > 0) {
			if (preferences.MouseWheelPref.value === "down") {
				size -= step;
				if (size < minLength) {
					size = minLength;
				}
			} else {
				size += step;
				if (size > maxLength) {
					size = maxLength;
				}
			}
		} else if (event.scrollDelta < 0) {
			if (preferences.MouseWheelPref.value === "down") {
				size += step;
				if (size > maxLength) {
					size = maxLength;
				}
			} else {
				size -= step;
				if (size < minLength) {
					size = minLength;
				}
			}
		}
		preferences.maxWidthPref.value = String(size);
                //screenwrite("using mousewheel");
                resizeClock();
	//}
};
//=====================
//End function
//=====================

//=========================================================================
// this function
//=========================================================================
function checkDate (dateStr) {
    s = dateStr.split('/');
    d = new Date(+s[2], s[1]-1, +s[0]);
    if (Object.prototype.toString.call(d) === "[object Date]") {
        if (!isNaN(d.getTime()) && d.getDate() == s[0] &&
            d.getMonth() == (s[1] - 1)) {
            return true;
        }
    }
    return "Invalid date!";
}
//=====================
//End function
//=====================

//=========================================================================
// this function
//=========================================================================
function brassbuttonAOnClick () {
  if (debugFlg === 1) {print("%KON-I-INFO, pressing the A key "+system.event.keyCode);};
  shiftKeyFlag = 0;
  if (sliderMechanismStatus == "released")
  {
	if (raisealarmflg != true) {
           cancelalarmmode();
        }
  }
	else
  {
  //alarmToUse = 0;
  //turn off the weekday indicator as it would be continuously changing (and dinging)
  if (preferences.weekdayPref.value == "raised" )
  {
      weekdaytoggle();
  }
      switchAlarmsOn();
  }
}
//=====================
//End function
//=====================


//=========================================================================
// this function
//=========================================================================
function brassbuttonLOnMouseDown() {
    if (preferences.loudnessPref.value == "on"){
       //if (debugFlg === 1) {print("%KON-I-INFO, brassbuttonLOnMouseDown setting to off");};
       preferences.loudnessPref.value = "off";
       brassbuttonL.hoffset = ( 290 * (clockScale / 100));
    } else {
       //if (debugFlg === 1) {print("%KON-I-INFO, brassbuttonLOnMouseDown setting to on");};
       preferences.loudnessPref.value = "on";
       brassbuttonL.hoffset = ( 295 * (clockScale / 100));
    }
        
        if (preferences.soundPref === "enabled") {
        		play(clunk, false);
        	}
    changeLoudness();
}
//=====================
//End function
//=====================


//=========================================================================
// this function
//=========================================================================
function setBrassbuttonLOnStartup() {
    if (preferences.loudnessPref.value == "on"){
       brassbuttonL.hoffset = ( 295 * (clockScale / 100));
    } else {
       brassbuttonL.hoffset = ( 290 * (clockScale / 100));
    }
}
//=====================
//End function
//=====================

//=========================================================================
// this function
//=========================================================================
function setBrassbuttonAOnStartup() {
    if (sliderMechanismStatus == "released") {
           brassbuttonA.hoffset = ( 295 * (clockScale / 100));
           sliderSet.hoffset = Math.round( 395 * (clockScale / 100));
           orangeHeaterGlow.hoffset = Math.round( 425 * (clockScale / 100));
           stretchCable();
    } else {
           brassbuttonA.hoffset = ( 290 * (clockScale / 100));
    }
}
//=====================
//End function
//=====================


//=========================================================================
// these functions
//=========================================================================
brassbuttonA.onMouseDown = function () {
      brassbuttonAOnClick();
}
brassbuttonH.onMouseDown = function () {
  helpdropdownmove();
}
brassbuttonL.onMouseDown = function () {
  brassbuttonLOnMouseDown();
}
brassbuttonM.onMouseDown = function () {
  togglechimes();
}
brassbuttonP.onMouseDown = function () {
  togglethependulum();
}
brassButtonT.onMouseDown = function () {
  toggletimemachine();
}
brassButtonS.onMouseDown = function () {
  screentoggle();
}
brassButtonW.onMouseDown = function () {
  weekdaytoggle();
}
brassButtonB.onMouseDown = function () {
  togglebackscreen();
}
flag01.onMouseDown = function () {
  flag01OnMouseDown();
}
flag02.onMouseDown = function () {
  flag02OnMouseDown();
}
flag03.onMouseDown = function () {
  flag03OnMouseDown();
}
flag04.onMouseDown = function () {
  flag04OnMouseDown();
}
flag05.onMouseDown = function () {
  flag05OnMouseDown();
}
//=====================
//End function
//=====================

//=========================================================================
// this function is called on a press of the number 1 toggle
//=========================================================================
function flag01OnMouseDown() {
  if (raisealarmflg != true) {
    if (debugFlg === 1) {print("%KON-I-INFO, flag01OnMouseDown " + raisealarmflg);};

    if (selectedAlarm == "1") {
  	if (raisealarmflg != true) {
             cancelalarmmode();
          }
    } else {
        selectedAlarm = 1;
        alarmToUse = 1;
        showAlarm();
    }
  }
}
//=====================
//End function
//=====================

//=========================================================================
// this function
//=========================================================================
function flag02OnMouseDown() {
  if (raisealarmflg != true) {
    if (debugFlg === 1) {print("%KON-I-INFO, flag02OnMouseDown " + raisealarmflg);};

    if (selectedAlarm == "2") {
  	if (raisealarmflg != true) {
             cancelalarmmode();
          }
    } else {
        selectedAlarm = 2;
        alarmToUse = 2;
        showAlarm();
    }
  }
}
//=====================
//End function
//=====================

//=========================================================================
// this function
//=========================================================================
function flag03OnMouseDown() {
  if (raisealarmflg != true) {
    if (debugFlg === 1) {print("%KON-I-INFO, flag03OnMouseDown " + raisealarmflg);};

    if (selectedAlarm == "3") {
	if (raisealarmflg != true) {
           cancelalarmmode();
        }
    } else {
        selectedAlarm = 3;
        alarmToUse = 3;
        showAlarm();
    }
  }
}
//=====================
//End function
//=====================

//=========================================================================
// this function
//=========================================================================
function flag04OnMouseDown() {
  if (raisealarmflg != true) {
    if (debugFlg === 1) {print("%KON-I-INFO, flag04OnMouseDown " + raisealarmflg);};

    if (selectedAlarm == "4") {
	if (raisealarmflg != true) {
           cancelalarmmode();
        }
    } else {
        selectedAlarm = 4;
        alarmToUse = 4;
        showAlarm();
    }
  }
}
//=====================
//End function
//=====================

//=========================================================================
// this function
//=========================================================================
function flag05OnMouseDown() {
  if (raisealarmflg != true) {
    if (debugFlg === 1) {print("%KON-I-INFO, flag05OnMouseDown " + raisealarmflg);};

    if (selectedAlarm == "5") {
	if (raisealarmflg != true) {
           cancelalarmmode();
        }
    } else {
        selectedAlarm = 5;
        alarmToUse = 5;
        showAlarm();
    }
  }
}
//=====================
//End function
//=====================


//=========================================================================
// this function determines the logarithmic value of the time slider
//=========================================================================
function logslider(position) {
  // position will be between 0 and 100
  var minp = 0;
  var maxp = 100;

  // The result should be between 100 an 10000000
  var minv = Math.log(15000);
  var maxv = Math.log(5052000000);

  // calculate adjustment factor
  var logScale = (maxv-minv) / (maxp-minp);
  position = Math.exp(minv + logScale*(position-minp));
  //if (debugFlg === 1) {print("%KON-I-INFO, position "+position);};

  return (position) ;
}
//=====================
//End function
//=====================

//===========================================
// function to change the loudness
//===========================================
function changeLoudness () {
      if (debugFlg === 1) {print("%KON-I-INFO, changeLoudness");};

      if (preferences.loudnessPref.value == "off") {
         screenwrite("changing volume from "+soundLevelPrefFlg+ " to "+ preferences.soundLevelPref.value);
         if (debugFlg === 1) {print("%KON-I-INFO,changing general volume from",soundLevelPrefFlg, "to", preferences.soundLevelPref.value);};
         if (preferences.crankHandlePref.value == "up")
         {
               preferences.soundLevelPref.value = "quiet";
               setQuietSounds();
         }

         if (preferences.crankHandlePref.value == "middle")
         {
               preferences.soundLevelPref.value = "vquiet";
               setVquietSounds();
         }

         if (preferences.crankHandlePref.value == "down")
         {
               preferences.soundLevelPref.value = "silent";
               playNothing();
         }
      }

      // in addition
      if (preferences.loudnessPref.value == "on")
         {
           if (preferences.crankHandlePref.value == "down") {
               playNothing();
           }
           if (preferences.crankHandlePref.value == "middle") {
               playNothing();
               setQuietSounds();
           }
           if (preferences.crankHandlePref.value == "up") {
               playNothing();
               setLoudSounds();
           }
        }

        soundLevelPrefFlg = preferences.soundLevelPref.value;
        sleep(300);
            
        if (preferences.soundPref === "enabled") {
        		play(nothing, true);
        	}
        tickTimer.reset();
        tick();
}
//=====================
//End function
//=====================

//===============================
// function to set the crank handle position
//===============================
function handleUpArrow () {
        if (debugFlg === 1) {print("rotatorTypeClicked "+ rotatorTypeClicked);};
        crankUp();
}
//=====================
//End function
//=====================

//===============================
// function to set the crank handle position
//===============================
function handleDownArrow () {
          if (debugFlg === 1) {print("rotatorTypeClicked "+ rotatorTypeClicked);};
          crankDown();
}
//=====================
//End function
//=====================



//===============================
// function to set the crank handle position
//===============================
function crankUp () {
           if (debugFlg === 1) {print("%KON-I-INFO,volume cranked up");};
               
        if (preferences.soundPref === "enabled") {
        		play(cranksound, false);
        	}
           //crank.voffset=(340 * (clockScale / 100));
           //    
        if (preferences.soundPref === "enabled") {
        		play(clunk, false);
        	}
           //crank.src='Resources/crank-middle.png';
           //sleep(700);

               
        if (preferences.soundPref === "enabled") {
        		play(clunk, false);
        	}
           crank.voffset=(340 * (clockScale / 100));
           crank.src='Resources/crank-up.png';
           crank.tooltip="crank me down for silence";
           preferences.crankHandlePref.value = "up";
          // restore the level of sound as to before the mute
           changeLoudness();
}
//=====================
//End function
//=====================
//===============================
// function to set the crank handle position
//===============================
function crankMiddle () {
           if (debugFlg === 1) {print("%KON-I-INFO,volume cranked middle");};
               
        if (preferences.soundPref === "enabled") {
        		play(cranksound, false);
        	}
           //crank.voffset=(340 * (clockScale / 100));
           //    
        if (preferences.soundPref === "enabled") {
        		play(clunk, false);
        	}
           //crank.src='Resources/crank-middle.png';
           //sleep(700);

               
        if (preferences.soundPref === "enabled") {
        		play(clunk, false);
        	}
           crank.voffset=(340 * (clockScale / 100));
           crank.src='Resources/crank-middle.png';
           //crank.tooltip="crank me down for silence";
           preferences.crankHandlePref.value = "middle";
          // restore the level of sound as to before the mute
           changeLoudness();
}
//=====================
//End function
//=====================
//===============================
// function to set the crank handle position
//===============================
function crankDown () {
           if (debugFlg === 1) {print("%KON-I-INFO,volume cranked down");};
           //crank.voffset=(340 * (clockScale / 100));
               
        if (preferences.soundPref === "enabled") {
        		play("Resources/crank.mp3", false);
        	}
           //    
        if (preferences.soundPref === "enabled") {
        		play("Resources/clunk.mp3", false);
        	}
           //crank.src='Resources/crank-middle.png';
           //sleep(700);
               
        if (preferences.soundPref === "enabled") {
        		play(clunk, false);
        	}

           crank.voffset=(377 * (clockScale / 100));
           crank.src='Resources/crank-down.png';
           crank.tooltip="crank me up to make more sound";
           preferences.crankHandlePref.value = "down";
          // restore the level of sound as to before the mute
           changeLoudness();
 }
//=====================
//End function
//=====================

//===============================
// function to change the volume
//===============================
crank.onMouseDown = function () {
        changeCrankPosition();
}
//=====================
//End function
//=====================

//===============================
// function to change the crank Position and then toggle the sound
//===============================
function changeCrankPosition()
{
    //if (debugFlg === 1) {print("%KON-I-INFO, cranking ");};
    //  if (debugFlg === 1) {print("%KON-I-INFO, cranking >",preferences.crankHandlePref.value+"< before");};
    //check the level of sound first
    if (preferences.crankHandlePref.value == "down") {
      //if (debugFlg === 1) {print("%KON-I-INFO, cranking to middle");};
      preferences.lastCrankPosition.value = "down";
      crankMiddle();
      return;
    }
    if (preferences.crankHandlePref.value == "middle") {
        //if (debugFlg === 1) {print("%KON-I-INFO, cranking to down");};
        if (preferences.lastCrankPosition.value == "up") {
           crankDown ();
           return;
        } else {
        //if (debugFlg === 1) {print("%KON-I-INFO, cranking to up");};
           crankUp ();
           return;
        }
    }
    if (preferences.crankHandlePref.value == "up") {
      //if (debugFlg === 1) {print("%KON-I-INFO, cranking to middle");};
      preferences.lastCrankPosition.value = "up";
      crankMiddle();
      return;
    }
}
//=====================
//End function
//=====================

//===============================
// function to turn off the sound
//===============================
function SetCrankPositiononStartup()
{
        if (debugFlg === 1) {print("%KON-I-INFO, SetCrankPositiononStartup "+ preferences.crankHandlePref.value);};
        if (preferences.crankHandlePref.value == "up") {
           crank.voffset=(340 * (clockScale / 100));
           crank.src='Resources/crank-up.png';
           crank.tooltip="crank me down to quieten the whole clock";
        }
        if (preferences.crankHandlePref.value == "middle") {
           crank.voffset=(340 * (clockScale / 100));
           crank.src='Resources/crank-middle.png';
           crank.tooltip="crank me either up or down to change the sound";
        }
        if (preferences.crankHandlePref.value == "down") {
           crank.voffset=(340 * (clockScale / 100));
           crank.src='Resources/crank-down.png';
           crank.tooltip="crank me up to make some sound";
        }
        crank.visible=true;
}
//=====================
//End function
//=====================



//===========================================
// function to set loud sounds
//===========================================
function setLoudSounds() {
               chime1 = "Resources/quarterchime.mp3";
               chime2 = "Resources/halfchime.mp3";
               chime3 = "Resources/threequarterchime.mp3";
               chime4 = "Resources/fullchime.mp3";
               tickingSound = "Resources/ticktock.mp3" ;
               belltoll01 = "Resources/belltoll01.mp3" ;
               singleBell = "Resources/singleBell.mp3";
               twoBells = "Resources/twoBells.mp3";
               clunk = "Resources/clunk.mp3";
               zzzz = "Resources/zzzz.mp3";
               buzzer = "Resources/buzzer.mp3";
               alarmbells  = "Resources/alarmbells.mp3";
               till  = "Resources/till01.mp3";
               rollerblind ="Resources/rollerblind.mp3";
               rollerblindup ="Resources/rollerblind-up.mp3";
               rollerblinddown ="Resources/rollerblind-down.mp3";
               counter ="Resources/counter.mp3";
               cranksound = "Resources/crank.mp3"
               tingingSound ="Resources/tingingSound.mp3";
               counter2 ="Resources/counter2.mp3";
               lock ="Resources/lock.mp3";
               //brassbuttonL.hoffset=290;
               //brassbuttonL.hoffset=(290 * (clockScale / 100));
}
//=====================
//End function
//=====================




//===========================================
// function to set very quiet sounds
//===========================================
function setVquietSounds() {
               if (debugFlg === 1) {print("%KON-I-INFO, setting very quiet sounds");};
               chime1 = "Resources/quarterchime-vquiet.mp3";
               chime2 = "Resources/halfchime-vquiet.mp3";
               chime3 = "Resources/threequarterchime-vquiet.mp3";
               chime4 = "Resources/fullchime-vquiet.mp3";
               tickingSound = "Resources/ticktock-vquiet.mp3" ;
               belltoll01 = "Resources/belltoll-vquiet.mp3" ;
               singleBell = "Resources/singleBell-vquiet.mp3";
               twoBells = "Resources/twoBells-vquiet.mp3";
               clunk = "Resources/clunk-vquiet.mp3";
               zzzz = "Resources/zzzz-vquiet.mp3";
               buzzer = "Resources/buzzer-vquiet.mp3";
               alarmbells  = "Resources/alarmbells-vquiet.mp3";
               till  = "Resources/till01-vquiet.mp3";
               rollerblind ="Resources/rollerblind-vquiet.mp3";
               rollerblindup ="Resources/rollerblind-up-vquiet.mp3";
               rollerblinddown ="Resources/rollerblind-down-vquiet.mp3";
               counter ="Resources/counter-vquiet.mp3";
               cranksound = "Resources/crank-vquiet.mp3"
               tingingSound ="Resources/tingingSound-vquiet.mp3";
               counter2 ="Resources/counter2-vquiet.mp3";
               lock ="Resources/lock-vquiet.mp3";
}
//=====================
//End function
//=====================


//===========================================
// function to set an alarm
//===========================================
function setQuietSounds() {
               if (debugFlg === 1) {print("%KON-I-INFO, setting quiet sounds");};
               chime1 = "Resources/quarterchime-quiet.mp3";
               chime2 = "Resources/halfchime-quiet.mp3";
               chime3 = "Resources/threequarterchime-quiet.mp3";
               chime4 = "Resources/fullchime-quiet.mp3";
               tickingSound = "Resources/ticktock-quiet.mp3" ;
               belltoll01 = "Resources/belltoll-quiet.mp3" ;
               singleBell = "Resources/singleBell-quiet.mp3";
               twoBells = "Resources/twoBells-quiet.mp3";
               clunk = "Resources/clunk-quiet.mp3";
               zzzz = "Resources/zzzz-quiet.mp3";
               buzzer = "Resources/buzzer-quiet.mp3";
               alarmbells  = "Resources/alarmbells-quiet.mp3";
               till  = "Resources/till01-quiet.mp3";
               rollerblind ="Resources/rollerblind-quiet.mp3";
               rollerblindup ="Resources/rollerblind-up-quiet.mp3";
               rollerblinddown ="Resources/rollerblind-down-quiet.mp3";
               counter ="Resources/counter-quiet.mp3";
               cranksound = "Resources/crank-quiet.mp3"
               tingingSound ="Resources/nothing.mp3";
               counter2 ="Resources/nothing.mp3";
               lock ="Resources/nothing.mp3";

}
//=====================
//End function
//=====================


//===========================================
// function to set an alarm
//===========================================
function playNothing () {
               if (debugFlg === 1) {print("%KON-I-INFO, setting silent sounds,");};
               // set the sounds to play the nothing sound
               chime1 = "Resources/nothing.mp3";
               chime2 = "Resources/nothing.mp3";
               chime3 = "Resources/nothing.mp3";
               chime4 = "Resources/nothing.mp3";
               tickingSound = "Resources/nothing.mp3";
               belltoll01 = "Resources/nothing.mp3";
               singleBell = "Resources/nothing.mp3";
               twoBells = "Resources/nothing.mp3";
               clunk = "Resources/nothing.mp3";
               zzzz = "Resources/nothing.mp3";
               buzzer = "Resources/nothing.mp3";
               alarmbells  = "Resources/nothing.mp3";
               till  = "Resources/nothing.mp3";
               rollerblind ="Resources/nothing.mp3";
               rollerblindup ="Resources/nothing.mp3";
               rollerblinddown ="Resources/nothing.mp3";
               counter ="Resources/nothing.mp3";
               tingingSound ="Resources/nothing.mp3";
               counter2 ="Resources/nothing.mp3";
               cranksound ="Resources/counter2-vquiet.mp3";
               lock ="Resources/nothing.mp3";

               // now play the sounds with the nothing sound to flush the sound buffers
                   
        if (preferences.soundPref === "enabled") {
        		play(chime1, false);
        	}
                   
        if (preferences.soundPref === "enabled") {
        		play(chime2, false);
        	}
                   
        if (preferences.soundPref === "enabled") {
        		play(chime3, false);
        	}
                   
        if (preferences.soundPref === "enabled") {
        		play(chime4, false);
        	}
                   
        if (preferences.soundPref === "enabled") {
        		play(tickingSound, false);
        	}
                   
        if (preferences.soundPref === "enabled") {
        		play(belltoll01, false);
        	}
                   
        if (preferences.soundPref === "enabled") {
        		play(singleBell, false);
        	}
                   
        if (preferences.soundPref === "enabled") {
        		play(twoBells, false);
        	}
                   
        if (preferences.soundPref === "enabled") {
        		play(clunk, false);
        	}
                   
        if (preferences.soundPref === "enabled") {
        		play(zzzz, false);
        	}
                   
        if (preferences.soundPref === "enabled") {
        		play(buzzer, false);
        	}
                   
        if (preferences.soundPref === "enabled") {
        		play(alarmbells, false);
        	}
                   
        if (preferences.soundPref === "enabled") {
        		play(till, false);
        	}
                   
        if (preferences.soundPref === "enabled") {
        		play(rollerblind, false);
        	}
                   
        if (preferences.soundPref === "enabled") {
        		play(rollerblindup, false);
        	}
                   
        if (preferences.soundPref === "enabled") {
        		play(rollerblinddown, false);
        	}
                   
        if (preferences.soundPref === "enabled") {
        		play(counter, false);
        	}
                   
        if (preferences.soundPref === "enabled") {
        		play(tingingSound, false);
        	}
                   
        if (preferences.soundPref === "enabled") {
        		play(counter2, false);
        	}
                   
        if (preferences.soundPref === "enabled") {
        		play(lock, false);
        	}
                   
        if (preferences.soundPref === "enabled") {
        		play(cranksound, false);
        	}

               cranksound = "Resources/crank-nothing.mp3"
                   
        if (preferences.soundPref === "enabled") {
        		play(cranksound, false);
        	}
}
//=====================
//End function
//=====================


//===========================================
// function to raise the back screen
//===========================================
brassButtonB.onMouseDown = function () {
      togglebackscreen();
}
//=====================
//End function
//=====================



//===========================================
// function to toggle the screen top
//===========================================
screentop.onMouseDown = function () {
    screentoggle();
}
//=====================
//End function
//=====================


//===========================================
// function to turn off the pendulum
//===========================================
pendulumSet.onMouseDown = function () {
   togglethependulum();
}
//=====================
//End function
//=====================


//===========================================
// function to turn off the pendulum
//===========================================
dropdown.onMouseDown = function () {
	dropdownmove();
}
//=====================
//End function
//=====================



//===========================================
// function to turn off the pendulum
//===========================================
drawstring.onMouseDown = function () {
	dropdownmove();
}
//=====================
//End function
//=====================


//===========================================
// function to turn off the pendulum
//===========================================
bigdropdowncanvas.onMouseDown = function () {
        closehelpdropdown();
        brassbuttonH.visible= true;
}
//=====================
//End function
//=====================


//===========================================
// function to turn off the pendulum
//===========================================
helpbrassbutton.onMouseDown = function () {
	selectCanvas();
}
//=====================
//End function
//=====================


//===========================================
// function to turn off the pendulum
//===========================================
helpDrawstring.onMouseDown = function () {
    closehelpdropdown();
    brassbuttonH.visible= true;
}
//=====================
//End function
//=====================

//===========================================
// function to turn off the pendulum
//===========================================
sliderSet.onMouseDown = function () {
       getmousedown();
}
//=====================
//End function
//=====================

//===========================================
// function to turn off the pendulum
//===========================================
sliderSet.onMouseDrag = function () {
    sliderSetOnMouseMove();
}
//=====================
//End function
//=====================

//===========================================
// function to
//===========================================
sliderSet.onMouseUp = function () {
      sliderSetOnMouseUp();
}
//=====================
//End function
//=====================

//===========================================
// function to
//===========================================
chain.onMouseDown = function () {
	turnoffticking();
}
//=====================
//End function
//=====================



//===========================================
// function to
//===========================================
clockSet.onMouseDown = function () {
	if (raisealarmflg != true) {
           alarmtime = today.getTime();  //no. of milliseconds since 1970
           displayCounters();
           //cancelalarmmode();
        }
}
//=====================
//End function
//=====================


//===========================================
// function to
//===========================================
clockSet.onMultiClick = function () {
        if (system.event.clickCount == 2)
	if (raisealarmflg != true) {
           //cancelalarmmode();
        }
}
//=====================
//End function
//=====================

//===========================================
// function to
//===========================================
 till01.onMouseDown = function () {
                               confirmalarm();
}
//=====================
//End function
//=====================

//===========================================
// function to
//===========================================
 till01.onMouseEnter = function () {
                               till01.src="Resources/till01-red.png";
}
//=====================
//End function
//=====================

//===========================================
// function to
//===========================================
 till01.onMouseExit = function () {
                               till01.src="Resources/till01.png";
}
//=====================
//End function
//=====================

//===========================================
// function to
//===========================================
 till02.onMouseDown = function () {
                               confirmalarm();
}
//=====================
//End function
//=====================
//===========================================
// function to
//===========================================
 till02.onMouseEnter = function () {
                               till02.src="Resources/till02-red.png";
}
//=====================
//End function
//=====================
//===========================================
// function to
//===========================================
 till02.onMouseExit = function () {
                               till02.src="Resources/till02.png";
}
//=====================
//End function
//=====================


//===========================================
// function to
//===========================================
 till03.onMouseDown = function () {
                               confirmalarm();
}
//=====================
//End function
//=====================
//===========================================
// function to
//===========================================
 till03.onMouseEnter = function () {
                               till03.src="Resources/till03-red.png";
}
//=====================
//End function
//=====================
//===========================================
// function to
//===========================================
 till03.onMouseExit = function () {
                               till03.src="Resources/till03.png";
}
//=====================
//End function
//=====================

//===========================================
// function to
//===========================================
till04.onMouseDown = function () {
      confirmalarm();
}
//=====================
//End function
//=====================
//===========================================
// function to
//===========================================
till04.onMouseEnter = function () {
      till04.src="Resources/till04-red.png";
}
//=====================
//End function
//=====================
//===========================================
// function to
//===========================================
till04.onMouseExit = function () {
      till04.src="Resources/till04.png";
}
//=====================
//End function
//=====================

//===========================================
// function to
//===========================================
till05.onMouseDown = function () {
      confirmalarm();
}
//=====================
//End function
//=====================
//===========================================
// function to
//===========================================
till05.onMouseEnter = function () {
      till05.src="Resources/till05-red.png";
}
//=====================
//End function
//=====================
//===========================================
// function to
//===========================================
till05.onMouseExit = function () {
     till05.src="Resources/till05.png";
}
//=====================
//End function
//=====================


//===========================================
// function to
//===========================================
bellSet.onMouseDown = function () {
      setalarm();
}
//=====================
//End function
//=====================

//===========================================
// function to turn the chimes off with the clapper
//===========================================
clapper.onMouseDown = function () {
      togglechimes();
}
//=====================
//End function
//=====================

//===========================================
// function to turn the chimes off with the clapper
//===========================================
clapperRight.onMouseDown = function () {
       togglechimes();
}
//=====================
//End function
//=====================

//===========================================
// function to toggle the weekday flag
//===========================================
weekday.onMouseDown = function () {
       weekdaytoggle();
}
//=====================
//End function
//=====================

//===========================================
// function to highlight the weekday flag
//===========================================
weekday.onMouseEnter = function () {
       weekday.src="Resources/weekday-red.png";
}
//=====================
//End function
//=====================


//===========================================
// function to close the weekday flag
//===========================================
weekday.onMouseExit = function () {
       weekday.src="Resources/weekday.png";
}
//=====================
//End function
//=====================


//===========================================
// function to close the plaque
//===========================================
clockDeletion.onMouseDown = function () {
        plaquetick.visible = false;
        plaqueLink.visible = false;
        clockDeletion.visible = false;
            
        if (preferences.soundPref === "enabled") {
        		play(tingingSound, false);
        	}
}
//=====================
//End function
//=====================


//===========================================
// function to
//===========================================
plaqueLink.onMouseDown = function () {
              
        if (preferences.soundPref === "enabled") {
        		play(zzzz, false);
        	}
          openURL("http://lightquick.co.uk/instructions-for-the-steampunk-clock-calendar-2.html?Itemid=264");
}
//=====================
//End function
//=====================
                                                       
//===========================================
// function to close the plaque and delete the alarm
//===========================================
plaquetick.onMouseDown = function () {
              
        if (preferences.soundPref === "enabled") {
        		play(tingingSound, false);
        	}
          clockDeletion.visible = false;
          plaqueLink.visible = false;
          plaquetick.visible = false;
          deletealarm();
}
//=====================
//End function
//=====================


//===========================================
// function to close the help page
//===========================================
helpBottom.onMouseDown = function () {
           helpBottom.visible = false;
           helpTop.visible = false;
      	       
        if (preferences.soundPref === "enabled") {
        		play(pageFumble, false);
        	}
}
//=====================
//End function
//=====================

//===========================================
// function to show help page on startup
//===========================================
function showHelpPage() {
    if ( preferences.showHelpPref.value == "display" ) {
          helpBottom.visible = true;
          helpTop.visible = true;
    }
}
//=====================
//End function
//=====================


//=====================
// function to carry out a command
//=====================
function performCommand(method) {
    var answer;

    
            
        if (preferences.soundPref === "enabled") {
        		play(tingingSound, false);
        	}

        print("method "+method);
        if (method === "menu") {
         	runCommandInBg(preferences.imageEditPref.value, "runningTask");        		
        } else {
        	runCommandInBg(preferences.imageCmdPref.value, "runningTask");        	
        }

}
//=====================
//End function
//=====================






//=====================
//End steampunkclock.js
//=====================



