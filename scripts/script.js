// Toasts
const toast = (msg, classes = "") => M.toast({html: msg, classes: classes})
const succ = (msg) => toast(msg, "green")
const fail = (msg) => toast(msg, "red")

// Initialize the menu
$("#nav").children().clone().appendTo("#hamborger")
  .children("a").addClass("white-text")
$(document).ready(() => $('.sidenav').sidenav());

// Initialize Modals
$(document).ready(() => $('.modal').modal())

// 'TODO' Floats
$(".TODO").click(() => toast("TODO, haven't implemented that yet"))