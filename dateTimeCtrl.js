/****************************************************************************

  dateTimeCtrl.js
  
  eventually, give option to pick another month/year when date value is 
  blank other than the Current month/year as a starting point on the calendar.
  
  Developer:                Orville Paul Chomer
  Twitter:                  @orvilleChomer
  Glitch Profile:           https://glitch.com/@OrvilleChomer
  CodePen Profile:          https://codepen.io/orvilleChomer
  Web Site:                 http://chomer.com
  Github:                   https://github.com/OrvilleChomer
  Project Github Repo:      https://github.com/OrvilleChomer/dateTimeCtrl
  
 ****************************************************************************/

const gblDateCtrlInfoByFieldName = [];
const gblDateCtrlInfoByIndex = [];
const gblDateCtrlState = {};


 /****************************************************************************
  ****************************************************************************/
  export default function DateTimeCtrl() {
    console.log("DateTimeCtrl constructor called");
    const dtCtrl = this;
    const Q = '"';
    
    const cssSelectors = {};
    defineCssSelectors();
    
    if (typeof gblDateCtrlState.configured === "undefined") {
      genCtrlStylesIfNeeded();
      gblDateCtrlState.configured = true;
    } // end if
    
   /****************************************************************************
   
   .dateValue - selected date/time value (string) if none selected yet, it is blank!
   
    ****************************************************************************/
    dtCtrl.newCtrlMarkup = function(params) {
      const ctrl = {};
      ctrl.field = params.field;
      setPropValue(ctrl,params,{type:'string',propName:'dateValue'})
      setPropValue(ctrl,params,{type:'string',propName:'pickDateCaption',defValue:'Pick Date'});
      setPropValue(ctrl,params,{type:'boolean',propName:'editTime'});
      let sDef = "Form Date";
      
      if (ctrl.editTime === true) {
        sDef = "Form Date and Time";
      } // end if
      
      setPropValue(ctrl,params,{type:'string',propName:'formCaption',defValue:sDef});
      
      gblDateCtrlInfoByFieldName[ctrl.field] =  ctrl;
      gblDateCtrlInfoByIndex.push(ctrl);
      
      let s = [];
      
      s.push("<div>"); // control container wrapper - open
        s.push("<div class='datetimeCtrlCtr' >"); // control container - open
      
        // data that is Saved goes in this INPUT tag
        s.push("<input ");
        s.push("type='hidden' ");
        s.push("id='frmItm"+ctrl.field+"' ");            
        s.push(">");
      
        // data that is Displayed nicely formatted goes in this INPUT tag
        s.push("<input ");
        s.push("class='dateTime' readonly ");
        s.push("id='frmItm"+ctrl.field+"_vw' ");
        s.push("style="+Q);

        s.push(Q);
        s.push(">");
      
        // elipses button...
        s.push("<button ");
        s.push("data-field="+Q+ctrl.field+Q+" ");
        s.push("class='dateTimeButton' ");
        s.push("id='frmItm"+ctrl.field+"_btn' ");
        
        s.push(">...</button>");
      
        s.push("</div>"); // control container  - close
      s.push("</div>"); // control container wrapper - close
      
      return s.join("");
    } // newCtrlMarkup() method

    
    
   /****************************************************************************
      in the JavaScript code using this date control...
      call this AFTER adding all date controls to the form!
  
      once this is done, any date controls added will work as they should.
    ****************************************************************************/    
    dtCtrl.activateControls = function() {
      const nMax = gblDateCtrlInfoByIndex.length;
      for (let n=0;n<nMax;n++) {
        const ctrl = gblDateCtrlInfoByIndex[n];
        const hiddenNd = document.getElementById("frmItm"+ctrl.field);
        const dateTimeNd = document.getElementById("frmItm"+ctrl.field+"_vw");
        const dateTimeButtonNd = document.getElementById("frmItm"+ctrl.field+"_btn");
        
        dateTimeButtonNd.addEventListener('click', dtCtrl.calendarPopupClicked); // capture elipses button being clicked
        
        // ok, we are doing a little bit More than attaching events... :)
        ctrl.hiddenInput = hiddenNd;
        ctrl.dateTimeInput = dateTimeNd;
        ctrl.dateTimeButton = dateTimeButtonNd;
        
      } // next n
      
    } // activateControls method
    
    
   /****************************************************************************
      Is run when the user clicks the [<] button on the calendar popup
      called by Public function with same name
    ****************************************************************************/    
    dtCtrl.calPrev = function(event) {
      const btn = event.target;
      const sField = btn.dataset.field;
      const ctrl = gblDateCtrlInfoByFieldName[sField];
      let nMonth = ctrl.pickDate.getMonth();
      let nYear = ctrl.pickDate.getFullYear();
      
      nMonth = nMonth - 1;
      
      if (nMonth<0) {
        nMonth = 11;
        nYear = nYear - 1;
        ctrl.pickDate.setFullYear(nYear);
      } // end if
      
      ctrl.pickDate.setMonth(nMonth);
      
      buildCalendarPopup(ctrl);
    } // end of calPrev()
    
   /****************************************************************************
      is run when the user clicks the [...] button on the date control
      in order to bring up the calendar popup!
      called by Public function with same name
    ****************************************************************************/    
    dtCtrl.calendarPopupClicked = function(event) {
      const elipsesBtn = event.target;
      const sField = elipsesBtn.dataset.field;
      const ctrl = gblDateCtrlInfoByFieldName[sField];
      let pickDate = new Date();
      
      pickDate.setHours(14); // 3 PM  (base 0)
      pickDate.setMinutes(0);
      
      if (ctrl.dateValue !== "") {
        pickDate = new Date(ctrl.dateValue);
        ctrl.selDateTime = new Date(ctrl.dateValue);
        ctrl.selMonth = ctrl.selDateTime.getMonth();
        ctrl.selDate = ctrl.selDateTime.getDate();
        ctrl.selYear = ctrl.selDateTime.getFullYear();
        ctrl.hasValue = true;
      } else {
        ctrl.hasValue = false;
      } // end if
      
      ctrl.pendingSelDatePicked = false;
      ctrl.pickDate = pickDate;
      
      buildCalendarPopup(ctrl);
    } // end of calendarPopupClicked()
    
    
    
   /****************************************************************************
      Is run when the user clicks the [>] button on the calendar popup
      called by Public function with same name
    ****************************************************************************/    
    dtCtrl.calNext = function(event) {
      const btn = event.target;
      const sField = btn.dataset.field;
      const ctrl = gblDateCtrlInfoByFieldName[sField];
      let nMonth = ctrl.pickDate.getMonth();
      let nYear = ctrl.pickDate.getFullYear();
      
      nMonth = nMonth + 1;
      
      if (nMonth>11) {
        nMonth = 0;
        nYear = nYear + 1;
        ctrl.pickDate.setFullYear(nYear);
      } // end if
      
      ctrl.pickDate.setMonth(nMonth);
      
      buildCalendarPopup(ctrl);
    } // end of calNext()
    
    
    
    
   /****************************************************************************
      Is run when the user clicks the [SET] button on the calendar popup
      called by Public function with same name
    ****************************************************************************/    
    dtCtrl.calSetDateTime = function(event) {
      const btn = event.target;
      const sField = btn.dataset.field;
      const ctrl = gblDateCtrlInfoByFieldName[sField];
      
      if (ctrl.pendingSelDatePicked) {
        const selDate = new Date();
        const pendingSelDate = ctrl.pendingSelDate;
        selDate.setMonth(pendingSelDate.getMonth());
        selDate.setDate(pendingSelDate.getDate());
        selDate.setFullYear(pendingSelDate.getFullYear());
        selDate.setHours(pendingSelDate.getHours());
        selDate.setMinutes(pendingSelDate.getMinutes());
        ctrl.selDate = selDate;
        ctrl.dateValue = selDate + ""; // date value cast as a string
        ctrl.pendingSelDate = undefined;
        ctrl.pendingSelDatePicked = false;
        ctrl.hasValue = true;
        ctrl.hiddenInput.value = ctrl.dateValue; 
       
        ctrl.dateTimeInput.value = formattedDateTime(ctrl); // displayed read only
      } // end if
      
      
      hideCalendarCtl();
      
    } // end of calSetDateTime()
    
    
    
    
   /****************************************************************************
      Is run when the user clicks the [Today] button on the calendar popup
      called by Public function with same name
    ****************************************************************************/    
    dtCtrl.calToday = function(event) {
      const btn = event.target;
      const sField = btn.dataset.field;
      const ctrl = gblDateCtrlInfoByFieldName[sField];
      const todaysDate = new Date();
      
      ctrl.pickDate.setMonth(todaysDate.getMonth());
      ctrl.pickDate.setDate(todaysDate.getDate());
      ctrl.pickDate.setFullYear(todaysDate.getFullYear());
      buildCalendarPopup(ctrl);
    } // end of calToday()
        
    
    
    
    /****************************************************************************
      can return a ctrl object based on a valid field name
    ****************************************************************************/   
    dtCtrl.getCtrl = function(sField) {
      const ctrl = gblDateCtrlInfoByFieldName[sField];
      return ctrl;
      
    } // end of getCtrl method
    
    
    
    
   /****************************************************************************
      Build and display the calendar popup based on values in ctrl object
      Private function
      
      pickDate is like the navigation date which may or may not match the 
      current date value
    ****************************************************************************/      
    function buildCalendarPopup(ctrl) {
      let s=[];
      let nTop;
      let nLeft;
      const nPageWidth = window.innerWidth;
      const nPageHeight = window.innerHeight;
      let sCaption = "Select Date";
      let pickDate = ctrl.pickDate; // where we are pointing and poking around!  :P
      let todaysDate = new Date();
      
      
      
      
      let nYear = pickDate.getFullYear();
      const nStartWeekDay = getStartWeekDayForMonth(pickDate);
      const nTotDaysInMonth = getTotalDaysInMonth(pickDate);
      const sMonthName = getFullMonthName(pickDate);
      
      // portrait
      let nPopupOffset = Math.floor(nPageWidth * .05);
      let nPopupWidth = nPageWidth - (nPopupOffset * 2);
      //let nPopupHeight = nPopupWidth + Math.floor(nPopupWidth * .1);
      let nPopupHeight = nPopupWidth;
      let nBlockSize = Math.floor(nPopupWidth / 7.5);
  
          // landscape
      if (nPageWidth > nPageHeight) {
        nPopupOffset = Math.floor(nPageHeight * .05);
        nPopupHeight = nPageHeight - (nPopupOffset * 2);
        nPopupWidth = nPopupHeight;
        nBlockSize = Math.floor(nPopupHeight / 7.5);
        //nPopupHeight = nPopupHeight + Math.floor(nPopupHeight * .1);
      } // end if
      
      if (typeof ctrl.pickDateCaption === "string") {
        sCaption = ctrl.pickDateCaption;
      } // end if
      
      
      // show "custom" caption for the date/time field being edited:
      s.push("<div class='calCaption' ");
      s.push("style="+Q);
      s.push("width:"+(nPopupWidth-20)+"px;")
      s.push(Q);
      s.push(">");
      s.push(sCaption);
      s.push(":</div>"); // calCaption
      
      
      // close button
      s.push("<button "); 
      s.push("class='closeBtn' ");
      s.push("id='calPopupCloseBtn' ");
      s.push("onclick="+Q);
      s.push("hideCalendarCtl()"+Q+" ");
      s.push(">");
      s.push("✖</button>"); 
      
      s.push("<div class='calMonthYear'>");
      s.push("<span class='calMonthName'>"+sMonthName+"&nbsp;</span>");
      s.push("<span class='calYear'>"+pickDate.getFullYear()+"</span>");
      s.push("</div>"); // calMonthYear

      s.push("<button class='calPrevBtn' id='calPopupPrevBtn' ");    
      s.push("data-field="+Q+ctrl.field+Q+" ");
      s.push("title='previous month' ");
      s.push(">");
      s.push("&lt;</button>");


      // Today button
      s.push("<button class='calTodayBtn' id='calPopupTodayBtn' ");   
      s.push("data-field="+Q+ctrl.field+Q+" ");
      s.push("title='jump to today' ");    
      s.push(">");
      s.push("Today</button>");


      // next month button
      s.push("<button class='calNextBtn' id='calPopupNextBtn' ");    
      s.push("data-field="+Q+ctrl.field+Q+" ");
      s.push("title='next month' ");
      s.push(">");
      s.push("&gt;</button>");

      // *** build day of week header for the calendar...
      nTop = 90;
      const sDays = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
      nLeft = 20;
      for (let n=0;n<7;n++) {
        s.push("<div class='calWeekday' ");
        s.push("style="+Q);
        s.push("left:"+(nLeft)+"px;");
        s.push("top:"+(nTop)+"px;");
        s.push("width:"+(nBlockSize)+"px;");
        s.push("height:"+(nBlockSize)+"px;");

        if (n===0 || n===6) {
          s.push("color:gray;");
        } // end if

        s.push(Q);
        s.push(">");
        s.push(sDays[n]);
        s.push("&nbsp;</div>");
        nLeft = nLeft + nBlockSize - 1;
      } // next n
      
      
      // *** BUILD ACTUAL CALENDAR SQUARES:
      let weekDate = 0;
      nTop = nTop + 20;
      
      for (let n=0;n<6;n++) {
      
        nLeft = 20;
        for (let n2=0;n2<7;n2++) {
          let sClass = "calBlock1 calDateBlock"; //  calDateBlock is programatically used not visually

          if (n2===0 || n2===6) {
            sClass = "calBlock2 calDateBlock";
          } // end if

          if (weekDate===0) {
            if (nStartWeekDay===n2) {
              weekDate = weekDate + 1;
            } // end if
          } else {
            weekDate = weekDate + 1;
          } // end if/else
          
          if (weekDate===0 || weekDate > nTotDaysInMonth) {
            sClass = "calBlockEmpty";
          } else {
            // was the date previously selected...
            if (ctrl.hasValue) {
              // and does the selected date match the current date block?
              if (ctrl.selMonth === pickDate.getMonth() &&
                  ctrl.selDate === weekDate &&
                  ctrl.selYear === pickDate.getFullYear()) {
                sClass = "calBlockSel calDateBlock";
              } // end if
            } // end if (hasValue)
          } // end if
          
          s.push("<div class='"+sClass+"' ");

          s.push("style="+Q);
          s.push("left:"+(nLeft)+"px;");
          s.push("top:"+(nTop)+"px;");
          s.push("width:"+(nBlockSize)+"px;");
          s.push("height:"+(nBlockSize)+"px;");        
          s.push(Q);

          if (weekDate>0 && weekDate <= nTotDaysInMonth) {
            s.push("data-field="+Q+ctrl.field+Q+" ");
            s.push("data-weekday="+Q+n2+Q+" ");
            s.push("data-month="+Q+pickDate.getMonth()+Q+" ");
            s.push("data-date="+Q+(weekDate)+Q+" ");
            s.push("data-year="+Q+pickDate.getFullYear()+Q+" ");
          } // end if
          
          
          s.push(">");

          

          if (weekDate>0 && weekDate <= nTotDaysInMonth) {
            // display any info for actual date...
            let bIsToday = false;
            let testDate = new Date();
            testDate.setFullYear(nYear);
            testDate.setMonth(pickDate.getMonth());
            testDate.setDate(weekDate);

            if (todaysDate.getDate() === testDate.getDate() &&
                todaysDate.getMonth() === testDate.getMonth() &&
                todaysDate.getFullYear() === testDate.getFullYear()) {
                bIsToday = true;
            } // end if

            s.push("<div ");

            if (bIsToday) {
              s.push("class='calToday' ");
              s.push("title='Today\'s Date ");
            } else {
              s.push("class='calOtherDays' ");
            } // end if

            s.push("style="+Q);
            s.push("position:absolute;");
            s.push("right:6px;");
            s.push("top:3px;");

            if (!bIsToday) {
              if (n2===0 || n2===6) {
                s.push("color:gray;");
              } // end if
            } // end if

            s.push(Q);
            s.push(">");
            s.push(""+(weekDate)); // a number from 1 to 31 !!!
            s.push("</div>");
          } // end if

          s.push("</div>"); // end of calBlock
          nLeft = nLeft + nBlockSize - 1;
        } // next n2 (day)
        nTop = nTop + nBlockSize - 1;
      } // next n (week)
  
      /****************************************************************************
       Calendar Popup's Date/Time Box
        - Only displays if a date was picked previously or above in calendar
          otherwise it is invisible.
        - Displays the Date Picked (Read Only)
        - Allows the editing of the time... hours / minutes / AM/PM
        - And displays a [SET] button which will set the control to the date/time displayed 
          and hide the calendar popup
      ****************************************************************************/
      nTop = nTop + 10;    
      s.push("<div id='calDateTimeBox' ");
      s.push("style="+Q);
      s.push("top:"+(nTop)+"px;");
      s.push("width:"+(nBlockSize * 7 - 6)+"px;");
      s.push(Q);
      s.push(">");     
      
        s.push("<input id='calDateDsp' value='' readonly ");
        s.push(">");
        
        s.push("<span class='calAt' ");
        s.push(">@</span>");
      
        let nHours = pickDate.getHours()+1;
        let sAMSelected = " selected";
        let sPMSelected = "";
        let sMinutes = pickDate.getMinutes()+"";
      
        if (sMinutes.length === 1) {
          sMinutes = "0"+sMinutes;
        } // end if
      
        if (nHours > 12) {
          nHours = nHours - 12;
          sAMSelected = "";
          sPMSelected = " selected";
        } // end if
      
        s.push("<input id='calHourEntry' value='"+(nHours)+"' maxlength='2' ");
        s.push(">");
      
        s.push("<span class='calColonSep' ");
        s.push(">:</span>");
      
        s.push("<input id='calMinuteEntry' value='"+sMinutes+"' maxlength='2' ");
        s.push(">");
      
        s.push("<select id='calAmPmSelect' ");
        s.push(">");
          s.push("<option value='AM'"+sAMSelected+">AM</option>");
          s.push("<option value='PM'"+sPMSelected+">PM</option>");
        s.push("</select>");
      
        s.push("<button id='calSetDateBtn' ");
        s.push("data-field="+Q+ctrl.field+Q+" ");
        s.push(">SET</button>");
      
      s.push("</div>"); // end of date/time display and time edit and SET button!
      // ####################################################################################
      
      
      
      
      s.push("</div>"); // end of calWrapper      
      
      let calPopupNd = document.getElementById("calPopup");
      
      if (calPopupNd == null) {
        calPopupNd = document.createElement("div");
        calPopupNd.id = "calPopup";
        calPopupNd.style.position = "absolute";
        calPopupNd.style.zIndex = "200"; // calendar popup appears Above the Tint layer
        document.body.appendChild(calPopupNd);   
      } // end if
      
      // position our popup on the display:
      calPopupNd.style.left = (nPopupOffset)+"px";
      calPopupNd.style.top = (nPopupOffset)+"px";
      calPopupNd.style.width = (nPopupWidth)+"px";
      calPopupNd.style.height = (nPopupHeight)+"px";
      
      calPopupNd.innerHTML = s.join(""); // Render our calendar...
      
      if (ctrl.hasValue) {
        let calDateDspNd = document.getElementById("calDateDsp");
        const dt = new Date(ctrl.dateValue);      
        const sDate = formattedDate(dt);
        calDateDspNd.value = sDate;
      } // end if (ctrl.hasValue)
      
      calPopupNd.style.display = "block";
      
      
      
      // attach event handlers to controls on the calendar popup:
      // --------------------------------------------------------      
      const calPopupCloseBtnNd = document.getElementById("calPopupCloseBtn");
      const calPopupPrevBtnNd = document.getElementById("calPopupPrevBtn");
      const calPopupTodayBtnNd = document.getElementById("calPopupTodayBtn");
      const calPopupNextBtnNd = document.getElementById("calPopupNextBtn");
      const calSetDateBtnNd = document.getElementById("calSetDateBtn");
      calPopupCloseBtnNd.addEventListener('click', hideCalendarCtl);
      calPopupPrevBtnNd.addEventListener('click', dtCtrl.calPrev);
      calPopupTodayBtnNd.addEventListener('click', dtCtrl.calToday);
      calPopupNextBtnNd.addEventListener('click', dtCtrl.calNext);
      calSetDateBtnNd.addEventListener('click', dtCtrl.calSetDateTime);
      
      const calDateBlocks = document.getElementsByClassName("calDateBlock");
      const nMax = calDateBlocks.length;
      for (let n=0;n<nMax;n++) {
        const calDateBlock = calDateBlocks[n];
        calDateBlock.addEventListener('click', calSelDate);
      } // next n
      // --------------------------------------------------------   
      
      
      // setup tint layer between popup and normal display:
      let tintNd = document.getElementById("tint");
      if (tintNd == null) {
        tintNd = document.createElement("div");
        tintNd.id = "tint";
        tintNd.style.background = "black";
        tintNd.style.opacity = ".6";
        tintNd.style.position = "absolute";
        tintNd.style.left = "0px";
        tintNd.style.top = "0px";
        tintNd.style.zIndex = "100";  // tint layer appears Above regular page, but Below any popup (like calPopup)
        document.body.appendChild(tintNd); 
      } // end if
      
      tintNd.style.width = (nPageWidth)+"px";
      tintNd.style.height = (nPageHeight)+"px";      
      tintNd.style.display = "block";
    } // end of function buildCalendarPopup()
    
  
   
    


 /****************************************************************************
  Private function
  User clicked on date block for a date...
  ****************************************************************************/
  function calSelDate(event) {
    
    // if there is a calendar date on the current calendar that is selected,
    // unselect it (via css classes)
    const calSelBlocks = document.getElementsByClassName("calBlockSel");
    let nMax = calSelBlocks.length; // really should only be 0 or 1
    for(let n=0;n<nMax;n++) {
      const oldCalSelBlock = calSelBlocks[0];
      const nWeekday = oldCalSelBlock.dataset.weekday - 0;
      let sClass = "calBlock1 calDateBlock"; //  calDateBlock is programatically used not visually

          if (nWeekday===0 || nWeekday===6) {
            // formatting for weekend dates (Sunday and Saturday)
            oldCalSelBlock.className = "calBlock2 calDateBlock";
          } else {
            // formatting for all the other days of the week...
            oldCalSelBlock.className = "calBlock1 calDateBlock";
          } // end if
      
    } // next n
    
    const calDateDspNd = document.getElementById("calDateDsp");
    const dateBlock = event.target;
    const dtCtrl = new DateTimeCtrl();
    const sField = dateBlock.dataset.field;
    const nMonth = dateBlock.dataset.month - 0;
    const nDate = dateBlock.dataset.date - 0;
    const nYear = dateBlock.dataset.year - 0;
    const ctrl = dtCtrl.getCtrl(sField);
    const pendingSelDate = new Date();
    const pickDate = ctrl.pickDate;
    pendingSelDate.setMonth(pickDate.getMonth());
    pendingSelDate.setDate(nDate);
    pendingSelDate.setFullYear(pickDate.getFullYear());
    pendingSelDate.setHours(pickDate.getHours());
    pendingSelDate.setMinutes(pickDate.getMinutes());
    ctrl.pendingSelDate = pendingSelDate;
    ctrl.pendingSelDatePicked = true;
    dateBlock.className = "calBlockSel calDateBlock"; // show the date the user picked with a selection highlight color

    calDateDspNd.value = formattedDate(pendingSelDate); // show the date picked in a formatted manner
    
  //  ctrl.hasValue = true;
  //  ctrl.dateValue = selDate+"";
  //  ctrl.hiddenInput.value = ctrl.dateValue;
        
  } // end of function calSelDate()
    
    
    
    
  /****************************************************************************
      Private function
    ****************************************************************************/     
    function defineCssSelectors() {
      cssSelectors["#calAmPmSelect"] = "calAmPmSelect";
    } // end of function defineCssSelectors()
    
    
    
    
  /****************************************************************************
      Private function
    ****************************************************************************/     
    function formattedDate(dt) {
      
      if (typeof dt === "undefined") {
        return "";
      } // end if
      
      let sMonth = (dt.getMonth()+1)+"";
      
      if (sMonth.length ===1) {
        sMonth = "0" + sMonth;
      } // end if
      
      let sDay = (dt.getDate())+"";
      
      if (sDay.length ===1) {
        sDay = "0" + sDay;
      } // end if
      
      let sDate = sMonth + "/" + sDay + "/"+dt.getFullYear();
      return sDate;
    } // end of function formattedDate()
    
    
    
    
    
   /****************************************************************************
      Private function
    ****************************************************************************/      
    function formattedDateTime(ctrl) {
      let sDate = "";
      
      if (ctrl.dateValue === "") {
        return "";
      } // end if
      
      const dt = new Date(ctrl.dateValue);
      
      sDate = formattedDate(dt);
      
      if (ctrl.editTime) {
        sDate = sDate + " @ " + formattedTime(dt);
      } // end if (ctrl.editTime)
      
      return sDate;
    } // end of function formattedDateTime()
    
    
    
    
  /****************************************************************************
      Nicely formatted time (hours and minutes... no seconds)!
      Private function
    ****************************************************************************/     
    function formattedTime(dt) {
      let sAMPM = " AM";
      let nHour = dt.getHours()+1;
      
      if (nHour > 12) {
        nHour = nHour - 12;
        sAMPM = " PM";
      } // end if
      
      let sMinutes = dt.getMinutes()+"";
      if (sMinutes.length ===1) {
        sMinutes = "0" + sMinutes;
      } // end if
      
      let sTime = (nHour)+":"+sMinutes+sAMPM;
      
      return sTime;
    } // end of function formattedTime()
    
    
    
    
   /****************************************************************************
      Private function
    ****************************************************************************/
    function genCtrlStylesIfNeeded() {
      let s=[];
      let dateCtrlStyle = document.getElementById("chomerDateTimeCtrlStyles");
      
      if (dateCtrlStyle != null) {
        return; // already there, no need to add
      } // end if
      
      
      s.push("#calAmPmSelect {");
      s.push("  position:absolute;");
      s.push("  box-sizing:border-box;");
      s.push("  top:9px;");
      s.push("  left:225px;");
      s.push("  font-size:18pt;");
      s.push("}");
      
      s.push(".calAt {");
      s.push("  position:absolute;");
      s.push("  overflow:hidden;");
      s.push("  box-sizing:border-box;");
      s.push("  top:9px;");
      s.push("  left:126px;");
      s.push("  font-size:16pt;");
      s.push("  background:white;");
      s.push("}");
      
      
      s.push(".calBlock1 {");
      s.push("  position:absolute;");
      s.push("  overflow:hidden;");
      s.push("  box-sizing:border-box;");
      s.push("  border:solid silver .5px;");
      s.push("  background:white;");
      s.push("}");

      s.push(".calBlock2 {");
      s.push("  position:absolute;");
      s.push("  overflow:hidden;");
      s.push("  box-sizing:border-box;");
      s.push("  border:solid silver .5px;");
      s.push("  background:#f2f2f2;");
      s.push("}");
      
      s.push(".calBlockSel {");
      s.push("  position:absolute;");
      s.push("  overflow:hidden;");
      s.push("  box-sizing:border-box;");
      s.push("  border:solid silver .5px;");
      s.push("  background:#0099cc;");
      s.push("}");
      

      s.push(".calBlock1:hover {");
      s.push("  background:#e6e6ff;");
      s.push("  cursor:pointer;");
      s.push("}");

      s.push(".calBlock2:hover {");
      s.push("  background:#e6e6ff;");
      s.push("  cursor:pointer;");
      s.push("}");
      
      s.push(".calBlockSel:hover {");      
      s.push("  background:lightyellow;");
      s.push("  cursor:pointer;");
      s.push("}");      
      
      s.push(".calBlockEmpty {");
      s.push("  position:absolute;");
      s.push("  overflow:hidden;");
      s.push("  box-sizing:border-box;");
      s.push("  border:solid silver .5px;");
      s.push("  background:#ebebe0;");
      s.push("}");
      

      s.push(".calBlockSel {");
      s.push("  background:#ffd9b3;");
      s.push("}");


      s.push(".calBtn {");
      s.push("  position:absolute;");
      s.push("  overflow:hidden;");
      s.push("  height:35px;");
      s.push("  top:6px;");
      s.push("  cursor:pointer;");
      s.push("}");

      s.push(".calCaption {");
      s.push("  position:absolute;");
      s.push("  overflow:hidden;");
      s.push("  box-sizing:border-box;");
      s.push("  left:20px;");
      s.push("  top:8px;");
      s.push("  width: 300px;");
      s.push("  font-size:24pt;");
      s.push("  color:#0066cc;");
      s.push("}"); 
      
      s.push(".calColonSep {");
      s.push("  position:absolute;");
      s.push("  overflow:hidden;");
      s.push("  box-sizing:border-box;");
      s.push("  left:180px;");
      s.push("  top:6px;");
      s.push("  width: 300px;");
      s.push("  font-size:16pt;");
      s.push("}"); 
      
      
      s.push("#calDateDsp {");
      s.push("  position:absolute;");
      s.push("  box-sizing:border-box;");
      s.push("  left:0px;");
      s.push("  top:3px;");
      s.push("  width: 120px;");
      s.push("  text-align:center;");
      s.push("  font-size:12pt;");
      s.push("}"); 
      
      s.push("#calDateTimeBox {");
      s.push("  position:absolute;");
      s.push("  overflow:hidden;");
      s.push("  box-sizing:border-box;");
      s.push("  left:20px;");
      s.push("  width: 300px;");
      s.push("  height:65px;");
      s.push("  border:solid white 1px;");
      s.push("  border-radius:5px;");
      s.push("}"); 
      
      s.push("#calHourEntry {");
      s.push("  position:absolute;");
      s.push("  box-sizing:border-box;");
      s.push("  text-align:center;");
      s.push("  left:148px;");
      s.push("  top:3px;");
      s.push("  width: 32px;");
      s.push("  border:solid silver 1px;");
      s.push("  border-radius:5px;");
      s.push("}"); 
      
      
      s.push(".calNextBtn {"); 
      s.push("  position:absolute;");
      s.push("  box-sizing:border-box;");
      s.push("  overflow:hidden;");
      s.push("  height:35px;");
      s.push("  top:45px;");
      s.push("  right:48px;");
      s.push("  width:35px;");
      s.push("  font-size:16pt;");
      s.push("  border-radius:3px;");
      s.push("  border:solid gray 1px;");
      s.push("  cursor:pointer;");
      s.push("}");  
      
      
      s.push("#calMinuteEntry {"); 
      s.push("  position:absolute;");
      s.push("  box-sizing:border-box;");
      s.push("  top:3px;");
      s.push("  left:187px;");
      s.push("  width:32px;");
      s.push("  border-radius:5px;");
      s.push("  border:solid silver 1px;");
      s.push("}"); 
      
      
      s.push(".calMonthName {"); 
      s.push("  font-weight:bold;"); 
      s.push("  font-size:24pt;"); 
      s.push("}"); 

      s.push(".calMonthYear {"); 
      s.push("  position:absolute;"); 
      s.push("  left:20px;"); 
      s.push("  top:50px;"); 
      s.push("  width: 300px;"); 
      s.push("}"); 
      
      s.push(".calOtherDays {");
      s.push("  width:30px;");
      s.push("  height:30px;");
      s.push("  overflow:hidden;");
      s.push("  text-align:center;");
      s.push("  line-height:30px;");
      s.push("}");
      
      
      s.push("#calPopup {");
      s.push("  position:absolute;");
      s.push("  overflow:hidden;");
      s.push("  box-sizing:border-box;");
      s.push("  display:none;");
      s.push("  z-index:950;");
      s.push("  background:white;");
      s.push("  width:600px;");
      s.push("  height:700px;");
      s.push("  border:solid silver 3px;");
      s.push("  border-radius:6px;");
      s.push("}");

      s.push(".calPrevBtn {"); 
      s.push("  position:absolute;");
      s.push("  box-sizing:border-box;");
      s.push("  overflow:hidden;");
      s.push("  height:35px;");
      s.push("  top:45px;");
      s.push("  right:162px;");
      s.push("  width:35px;");
      s.push("  font-size:16pt;");
      s.push("  border-radius:3px;");
      s.push("  border:solid gray 1px;");
      s.push("  cursor:pointer;");
      s.push("}");  
      
      
      s.push(".calToday {");
      s.push("  background:red;");
      s.push("  width:30px;");
      s.push("  height:30px;");
      s.push("  border-radius:50%;");
      s.push("  font-weight:bold;");
      s.push("  color:white;");
      s.push("  text-align:center;");
      s.push("  line-height:30px;");
      s.push("}");

      
      
      s.push("#calSetDateBtn {");
      s.push("  position:absolute;");
      s.push("  overflow:hidden;");
      s.push("  box-sizing:border-box;");
      s.push("  top:3px;");
      s.push("  left:320px;");
      s.push("  cursor:pointer;");
      //s.push("  width: 300px;");
      s.push("  height:35px;");
      s.push("  border-radius:3px;");
      s.push("  border:solid gray 1px;");
      s.push("  font-size:16pt;");
      s.push("}"); 
      
      s.push(".calTodayBtn {");
      s.push("  position:absolute;");
      s.push("  box-sizing:border-box;");
      s.push("  overflow:hidden;");
      s.push("  height:35px;");
      s.push("  top:45px;");
      s.push("  right:85px;");
      s.push("  width:75px;");
      s.push("  font-size:16pt;");
      s.push("  border-radius:3px;");
      s.push("  border:solid gray 1px;");
      s.push("  cursor:pointer;");
      s.push("}");
      
      
      s.push(".calWeekday {");
      s.push("  position:absolute;");
      s.push("  text-align:right;");
      s.push("}");
      
      
      /* (.calWrapper)
         allows to easily offset calendar itself Down
         in the popup leaving room above it for 
         information telling the user what they're selecting: */
      s.push(".calWrapper {");
      s.push("  position:absolute;");
      s.push("  left:0px;");
      s.push("  top:64px;");
      s.push("}");
      
      

      s.push(".calYear {");
      s.push("  font-size:24pt;");
      s.push("}");

      s.push(".closeBtn {");
      s.push("  position:absolute;");
      s.push("  overflow:hidden;");
      s.push("  box-sizing:border-box;");
      s.push("  top:3px;");
      s.push("  right:5px;");
      s.push("  width:35px;");
      s.push("  height:35px;");
      s.push("  border-radius:3px;");
      s.push("  border:solid #490a09 1px;");
      s.push("  color:white;");
      s.push("  text-shadow: -1px -1px gray;");
      //background: linear-gradient(to bottom, #808080, #3fada8);
      s.push("  background: linear-gradient(to bottom, #dc9589 0%, #a64231 49%, #973c2d 50%, #e97f3f 94%, #dfbb58 100%);");
      s.push("  padding:0px;");
      s.push("  font-size:20pt;");
      s.push("  line-height:20px;");
      s.push("  cursor:pointer;");
      s.push("}");    
      
      // used for calendar control on input form:
      s.push(".dateTime {");
      s.push("  position:absolute;");
      s.push("  left:0px;");
      s.push("  top:0px;");
      s.push("  width:160px;");
      s.push("  font-size:10pt;");
      s.push("  border-radius:5px 0px 0px 5px;");
      s.push("  margin-right:0px;");
      s.push("  margin-top:2px;");
      s.push("}");

      s.push(".dateTimeButton {");
      s.push("  position:absolute;");
      s.push("  overflow:hidden;");
      s.push("  left:160px;");
      s.push("  top:0px;");
      s.push("  width:120px;");
      s.push("  border:solid gray 1px;");
      s.push("  border-radius:0px 5px 5px 0px;");
      s.push("  margin-left:0px;");
      s.push("  margin-top:2px;");
      s.push("  box-shadow:none;");
      s.push("  width:30px;");
      s.push("  font-weight:bold;");
      s.push("  height:28px;");
      s.push("  cursor:pointer;");
      s.push("}");

      s.push(".datetimeCtrlCtr {");
      s.push("  position:relative;");
      s.push("  left:0px;");
      s.push("  top:0px;");
      s.push("  height:32px;");
      s.push("}");
      
      dateCtrlStyle = document.createElement("style");
      dateCtrlStyle.id = "chomerDateTimeCtrlStyles";
      dateCtrlStyle.innerHTML = s.join("\n");
      
      document.body.appendChild(dateCtrlStyle); 
    } // end of function  genCtrlStylesIfNeeded()
    
    
    
    
  /*************************************************************************
    Private function
  *************************************************************************/
  function getFullMonthName(dt) {
    const nMonth = dt.getMonth();
    const sMonthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];

    return sMonthNames[nMonth];
  } // end of function getFullMonthName(dt)
    
    
    /****************************************************************************
      what day of the week does the 1st begin on...
      Private function
    ****************************************************************************/
    function getStartWeekDayForMonth(dt) {
      const firstDateInMonth = new Date();
      firstDateInMonth.setDate(1);
      firstDateInMonth.setMonth(dt.getMonth());
      firstDateInMonth.setFullYear(dt.getFullYear());
      return firstDateInMonth.getDay();
    } // end of function  getLastDateInMonth()
    
    
    

  /*************************************************************************
    return total number of days in a month
    Private function
  *************************************************************************/
  function getTotalDaysInMonth(dt) {
    let nYear = dt.getFullYear();
    let nMonth = dt.getMonth()+1;

    if (nMonth>11) {
      nMonth = 1;
      nYear = nYear + 1;
    } // end if

    let firstDateOfNextMonth = new Date();
    firstDateOfNextMonth.setFullYear(nYear);
    firstDateOfNextMonth.setDate(1);
    firstDateOfNextMonth.setMonth(nMonth);
    const nMsInDay = 1000 * 60 * 60 * 24;
    let lastDateOfCurrentMonth = new Date();
    lastDateOfCurrentMonth.setTime(firstDateOfNextMonth.getTime()-nMsInDay);

    return lastDateOfCurrentMonth.getDate();
  }// end of function getTotalDaysInMonth()

    
 /****************************************************************************
   Private function
   called to hide the calendar popup and the tint panel
  ****************************************************************************/
  function hideCalendarCtl(event) {
    const calPopupNd = document.getElementById("calPopup");
    calPopupNd.innerHTML = "";
    calPopupNd.style.display = "none";
    const tintNd = document.getElementById("tint");
    
    if (tintNd) {
      tintNd.style.display = "none";
    } // end if
  } // end of function hideCalendarCtl()    
    
    
   /****************************************************************************
      Private function
    ****************************************************************************/
    function setPropValue(ctrl,inputParams,params) {
      const sType = params.type;
      const sPropName = params.propName;
      let defValue;
      
      if (sType === "boolean") {
        defValue = false;
      } // end if
      
      if (sType === "string") {
        defValue = "";
      } // end if
      
      if (sType === "number") {
        defValue = 0;
      } // end if
      
      if (sType === "date") {
        defValue = new Date();
      } // end if
      
      if (sType === "date") {
        if (params.defValue instanceof Date) {
          defValue = params.defValue;
        } // end if
      } else if (typeof params.defValue === sType) {
        defValue = params.defValue;
      } // end if
      
      ctrl[sPropName] = defValue;
      
      if (sType === "date") {
        if (inputParams[sPropName] instanceof Date) {
          ctrl[sPropName] = inputParams[sPropName];
        } // end if
        return;
      } // end if
      
      if (typeof inputParams[sPropName] === sType) {
        ctrl[sPropName] = inputParams[sPropName];
      } // end if
      
    } // end of function setPropValue()
    
    
    
  } // end of function DateTimeCtrl()

