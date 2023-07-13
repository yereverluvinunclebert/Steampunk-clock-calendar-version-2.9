This is the Steampunk Clock/Calendar Help file.

Version 2.7 (MkII)

Information :

The real changes provided in the latest version are the ability to resize the clock, the new day of the week 
indicator, the slider animation is much slicker, slider can be operated with your mouse scroll wheel, 
reduced cpu usage overall, lower cpu required by the pendulum swing action, many bugs fixed, slicker 
operation in general, standard 12 hour clock face, a right click menu with plenty of options and links, 
more documentation and more back end preferences to configure and play with. Some of the graphics have 
also been improved upon.

I wrote this tool as  heartily dislike the Windows operating system's limited choice of interface. The user
interface should be separated from the operating system functions allowing you to theme the GU as you wish.
Fed up of the glossy cr@p that was shipped with the later versions of Windows  decided to make a series of
widgets that can replace certain system functions. Windows is shipped with a particularly rubbish clock and if
you have XP you don't have access to Vista's sidebar. So this clock was created to cater for a certain taste.
It is steampunk (whatever that means) and unashamedly so. f you want to make any recommendations then please do.

The Pendulum is switched off by default, there is a good reason for this:

The graphics of a swinging pendulum in Javascript requires processor power. Some ntel single core or older
dual core machines may take exception to the pendulum and cause it to use of a lot of cpu.  have a dual core
Pentium D 3.0 ghz system that is no slouch, it runs twice as fast as my laptop. However, when the pendulum is
turned on it travels at a third of the speed when compared to the laptop and uses an inordinate amount of the cpu.
don't know why this is but it does not happen on slower machines with core2duo processor.  guess this is to do
with some processor design element that allows it to cater for certain animation functions better. The pendulum is
pure math so it could be a shortcoming in this area. t has a side-effect, if you right click in order to get the
preferences screen it may refuse to show immediately and then wait for 30 seconds or more before it appears. f it
does not then close the widget, restart and click on the pendulum, it will turn off the swing and the preferences
will then be accessible.

This widget works with Windows XP SP3, it has not been tested on Vista, Windows 7 and only lightly on Macs. However,
we have received no report of errors on these o/s. t has no specific Windows functionality and so should work for
Macs too, if you have any problems please post your email queries to news@lightquick.co.uk. Your post will go onto
the blog and  will endeavour to answer them as soon as  can.

The tool has two modes, Clock mode and Alarm mode. n clock mode the clock ticks, the calendar shows the date.
In alarm mode you can set alarms and when the time has passed the alarm will sound.

Instructions for use:

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

         The screen currently only displays clock/calendar operations but may do more in the future.

At the back-end there are more preferences that may be changed, all are documented by an associated description.

Report any bugs back and  will fix them.



            END