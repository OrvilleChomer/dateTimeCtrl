import DateTimeCtrl from 'https://orvillechomer.github.io/dateTimeCtrl/dtTimeCtrl-1.0.1.min.js'


function pageSetup() {
  genCtrl();
} // end of function pageSetup()


function genCtrl() {
  const sampleCtrlNd = document.getElementById("sampleCtrl");
  const dtCtrl = new DateTimeCtrl();
  
  sampleCtrlNd.innerHTML = dtCtrl.newCtrlMarkup({field:"apptDate",pickDateCaption:"Pick Appointment Date",editTime:true});
  
  dtCtrl.activateControls();
} // end of function genCtrl()


window.addEventListener('load', pageSetup);
