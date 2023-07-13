# Steampunk-clock-calendar-version-2.9
 
Steampunk Clock Calendar Yahoo Widget, written in Javascript and XML for the Yahoo 
Widget (Konfabulator) Engine. Created for XP, Vista, Win7, 8, 10+ as well as the 
Apple Mac OSX prior to Catalina. 

![wotw-clock-help-preview](https://github.com/yereverluvinunclebert/Steampunk-clock-calendar-version-2.9/assets/2788342/81d32fa2-5b79-4615-b31b-ce46c767ee87)

This Steampunk Clock Calendar Yahoo widget is an attractive steampunk widget for 
your desktop. It is a deliberately complex clock. Functional and gorgeous at the 
same time. This Widget is a moveable widget that you can move anywhere around the 
desktop as you require.

![steampunk_clock_calendar_mkii__2_9__rc_by_yereverluvinuncleber-d4l5xny](https://github.com/yereverluvinunclebert/Steampunk-clock-calendar-version-2.9/assets/2788342/f2dc5337-0c98-418c-9b68-2374ae7c4222)

The widget can be resized - Hover the cursor over the widget. Press the CTRL key 
and use your mousewheel up or down. The widget will resize dynamically.

The tool has two modes, Clock mode and Alarm mode. n clock mode the clock ticks, the calendar shows the date.
In alarm mode you can set alarms and when the time has passed the alarm will sound.

Instructions for use:

![lookatme](https://github.com/yereverluvinunclebert/Steampunk-clock-calendar-version-2.9/assets/2788342/d8878f9f-a95a-46f0-8fad-d3cf2573aa1a)

By the left of the calendar are five brass toggles/keys. Pressing on each will have the following effect:

H Key - will show the first help canvas indicated by the brass number 1 on the top left of the wooden
bar. clicking on the brassnumber 1 will select the next drop down help canvas.
Clicking on the ring pull at the bottom will make the current canvas go away.

A Key - will activate the alarm mode and will also show the help canvas the first time
it is pressed. Click on the ring pull at the bottom to make the canvas go away
(f you do this note that it will still be in alarm mode). Clicking on the bell set will also cause
the clock to go into alarm mode.

When you have pressed the A key it will release the slider and you may move it to the right
or left and change time. When you have selected the date/time you want then move the slider
to the central position and click on the bell set. The alarm will set. You can set up to five alarms.

Alarm mode -  Normal operation is this: When the slider is released the further you move the slider from the
centre position the more quickly the date/time will change.

When you are ready to set the alarm, click the bellset, two bells will sound and the alarm is set.

* Please note that while the timepiece in Alarm Mode all clock functions are switched off *
* Alarms will not sound whilst in alarm mode *

To cancel an alarm setting or viewing operation just click on the clock face.
To cancel a ringing alarm - just click on the bellset.

![wotw-clock-help-image](https://github.com/yereverluvinunclebert/Steampunk-clock-calendar-version-2.9/assets/2788342/00887907-e663-448a-b322-7d6584d95512)

Each time you press the alarm bell to set an alarm, a pop-up will display indicating
which alarm you are going to set. Each time you press the A key, it will select the next alarm.
To the right of the clock there are from zero to five alarm toggles depending on how many alarms you
have previously set. f you click on the toggle it will display the date and time set for this alarm.
If you then click on the associated 'cash-register-style' pop-up it will allow you to delete this alarm.

L Key - gently quietens the whole clock: ticking, chimes, alarm sounds all reduced by 21db.

M Key - leaves all other sounds alone but turns off only the chimes. Another click turns the
         chimes back on again. You will see the bell clapper move to/from the bell set.

P Key - Turns off the pendulum. Another click turns it on again. Single-click on the pendulum itself
         also turns off the pendulum.

Crank - The hand crank is the master volume control. Crank it down to mute all sounds and crank
         it up to restore the sound back to the level it was prior to muting.

To the left of the digital clock is another brass toggle:

S Key - Raises the transparent screen logging the various controls you select. Because the screen is
         transparent the text may be hard to see when used on a dark desktop background. A new 'B' key
         will also appear on the right of the screen frame that allows you to raise/lower the back screen.
         This will allow you to read the text.
	 
![wotw-clock-help-imageII](https://github.com/yereverluvinunclebert/Steampunk-clock-calendar-version-2.9/assets/2788342/ca4d4f68-ee8c-4d93-a684-3ee90907192a)

The screen currently only displays clock/calendar operations but may do more in the future.

At the back-end there are more preferences that may be changed, all are documented by an associated description.

All javascript widgets need an engine to function, in this case the widget uses 
the Yahoo Widget Konfabulator engine. The engine interprets the javascript and 
creates the widget according to the XML description and using the images you 
provide. 

Built using: 

	RJTextEd Advanced Editor  https://www.rj-texted.se/ 
	Adobe Photoshop CS ver 8.0 (2003)  https://www.adobe.com/uk/products/photoshop/free-trial-download.html  
	Yahoo Widgets SDK: engine (Konfabulator), runtime, debugger & documentation

Tested on :

	ReactOS 0.4.14 32bit on virtualBox    
	Windows 7 Professional 32bit on Intel    
	Windows 7 Ultimate 64bit on Intel    
	Windows 7 Professional 64bit on Intel    
	Windows XP SP3 32bit on Intel    
	Windows 10 Home 64bit on Intel    
	Windows 10 Home 64bit on AMD    
	Windows 11 64bit on Intel  
	                                   
 Dependencies:
 
 o A windows-alike o/s such as Windows XP, 7-11 or Apple Mac OSX prior to Catalina.    	
 
 o Installation of the yahoo widget SDK runtime engine  
 
	Yahoo widget engine for Windows - http://g6auc.me.uk/ywidgets_sdk_setup.exe  
	Yahoo widget engine for Mac - https://rickyromero.com/widgets/downloads/yahoo-widgets-4.5.2.dmg


Running the widget using a javascript engine frees javascript from running only 
within the captivity of a browser, you will now be able to run these widgets on 
your Windows desktop as long as you have the correct widget engine installed.


 
Instructions for running Yahoo widgets on Windows
=================================================

1. Install yahoo widget SDK runtime engine
2. Download the gauge from this repo.
3. Unzip it
4. Double-click on the resulting .KON file and it will install and run

Instructions for running Yahoo widgets on Mac OS/X ONLY
========================================================

1. Install yahoo widget SDK runtime engine for Mac
2. Download the gauge from this repo.
3. Unzip it
4. For all all recent versions of Mac OS/X up to and including Mojave, edit the following 
file:

com.yahoo.widgetengine.plist which is in /Users/xxx/Library/Preferences. Look 
for these lines: 
   
	<key>DockOpen</key>  
	<string>false</string>  

Change to false if it is true.

5. Double-click on the widgets .KON file and it will install and run

Wit these instructions you should be able to start Yahoo! Widgets and the 
menubar item should appear. Widgets can then be started from the menubar or by 
double-clicking on the KON file in the usual way.



LICENCE AGREEMENTS:

Copyright 2023 Dean Beedell

In addition to the GNU General Public Licence please be aware that you may use
any of my own imagery in your own creations but commercially only with my
permission. In all other non-commercial cases I require a credit to the
original artist using my name or one of my pseudonyms and a link to my site.
With regard to the commercial use of incorporated images, permission and a
licence would need to be obtained from the original owner and creator, ie. me.
