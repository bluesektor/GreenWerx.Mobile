import { Component, OnInit } from '@angular/core';
 

@Component({
  selector: 'app-honeypot',
  templateUrl: './honeypot.component.html',
  styleUrls: ['./honeypot.component.scss']
})
export class HoneyPotComponent implements OnInit {

  public fieldName: string;
  public fieldValue: string;

  constructor() {
    this.fieldName = 'website';
  }

  ngOnInit() {
  }


}

/*

Concept

By adding a invisible field to your forms that only spambots can see, you can trick 
them into revealing that they are spambots and not actual end-users.
HTML

<input type="checkbox" name="contact_me_by_fax_only" value="1" style="display:none !important" tabindex="-1" autocomplete="off">

a text box seems to be better
<input type="text" name="a_password" style="display:none !important" tabindex="-1" autocomplete="off">

Here we have a simple checkbox that:

    Is hidden with CSS.
    Has an obscure but obviously fake name.
    Has a default value equivalent 0.
    Can't be filled by auto-complete
    Can't be navigated to via the Tab key. (See tabindex)

Server-Side

On the server side we want to check to see if the value exists and has a value other than 0, and 
if so handle it appropriately. This includes logging the attempt and all the submitted fields.

In PHP it might look something like this:


$honeypot = FALSE;
if (!empty($_REQUEST['contact_me_by_fax_only']) && (bool) $_REQUEST['contact_me_by_fax_only'] == TRUE) {
    $honeypot = TRUE;
    log_spambot($_REQUEST);
    # treat as spambot
} else {
    # process as normal
}


Fallback

This is where the log comes in. In the event that somehow one of your users ends up being marked as spam, 
your log will help you recover any lost information. It will also allow you to study any bots running on you site, should they be 

modified in the future to circumvent your honeypot.
Reporting

Many services allow you to report known spambot IPs via an API or by uploading a list. 
(Such as CloudFlare) Please help make the internet a safer place by reporting all the spambots and spam IPs you find.
Advanced

If you really need to crack down on a more advanced spambot, there are some additional things you can do:

    Hide honeypot field purely with JS instead of plain CSS
    Use realistic form input names that you don't actually use. (such as "phone" or "website")
    Include form validation in honeypot algorithm. (most end-user will only get 1 or 2 fields wrong; 
      spambots will typically get most of the fields wrong)
    Use a service like CloudFlare that automatically blocks known spam IPs
    Have form timeouts, and prevent instant posting. (forms submitted in under 3 seconds of the page loading are typically spam)
    Prevent any IP from posting more than once a second.
    For more ideas look here: How to create a "Nuclear" honeypot to catch form spammers



You can listen for window.onmousemove (for desktop) and window.onorientationchange/ontouchstart (for mobile) 
events and require a certain amount of variation from the inputs to determine if your user is human. I believe this is how 

Google’s “are you a robot” auto-captcha works

*/

