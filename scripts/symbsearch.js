/*
  General information:
  Symb  => "Symbol"
  Cat   => "Category"
*/
const listjs = require('list.js');
const $ = require('jquery'); //would like to remove it
const {clipboard, ipcRenderer} = require('electron');
let symbarray = require('./data/symbols.json');
let symbs = [];
let symblist;
let catlist;
let catSelected;
let symbSelected;

class Symb {
  constructor(name,symb,cat) {
    this.name = name;
    this.symb = symb;
    this.cat = cat;
  }
}

init();

function init() {
  for (let i=0; i<symbarray.length; i++) {
    symbs[i] = new Symb(symbarray[i][0],symbarray[i][1],symbarray[i][2]);
  }
  const options = {
    valueNames: [ 'symb', 'name' ],
    item: '<li><h3 class="symb"></h3><p class="name"></p></li>'
  };
  symblist = new List('symblist', options, symbs);
  createCatFilter();
}

function createCatFilter() {
  let cats = getCats();
  cats.unshift('all');
  let a;
  let form = document.getElementById('cat-filter');
  for (let i=0; i<cats.length; i++) {
    a = document.createElement('option');
    catValid = setValidName(cats[i]);
    a.setAttribute('value', catValid);
    a.setAttribute('tabindex', '-1');
    a.innerHTML = cats[i];
    if (i === 0) {
      a.setAttribute('selected', 'true');
    }
    a.setAttribute('id', 'cat-' + catValid);
    form.addEventListener('change', function() {
      changeCat();
    });
    form.appendChild(a);
  }
  catlist = $('#cat-filter option');
}
function setValidName(word) {
  return word.replace(/ /g,"_");
}
function setNormalName(word) {
  return word.replace("_"," ");
}
function getCats() {
  let cats = [];
  for (let i=0; i<symbs.length; i++) {
    cats.push(symbs[i].cat);
  }
  cats = removeDoubles(cats);
  return cats;
}
function removeDoubles(a) {
  var seen = {};
  var out = [];
  var j = 0;
  for (let i = 0; i < a.length; i++) {
    let item = a[i];
    if (seen[item] !== 1) {
      seen[item] = 1;
      out[j++] = item;
    }
  }
  return out;
}
function setFocus() {
  document.getElementById('searchbox').focus();
}
function changeCat() {
  c = setNormalName(document.getElementById('cat-filter').value);
  console.log(c)
  symblist.remove();
  symblist.add(symbs);
  let cats = getCats();
  if (c != 'all') {
    for (let i=0; i<cats.length; i++) {
      if (cats[i] != c) {
        symblist.remove('cat', cats[i])
      }
    }
  }
  setFocus();
}

//Eventlistener

$('input[name="cats"]').on('change', changeCat);

$(window).keydown(function(e){
  if ($('.selected') == null) {
    symbSelected = false;
  }
  switch (e.which) {
    case 40: // arrow down
      selectNextSymb();
      break;
    case 38: // arrow up
      selectPrevSymb();
      break;
    case 13: // enter
      copySymb();
      break;
    case 18: // alt
      selectNextCat();
      break;
    default:
      return;
  }
});
function selectNextSymb() {
  let li = $('li');
  if (symbSelected){
    symbSelected.removeClass('selected');
    next = symbSelected.next();
    if (next.length > 0){
      symbSelected = next.addClass('selected');
    } else {
      symbSelected = li.first().addClass('selected');
    }
  } else {
    symbSelected = li.first().addClass('selected');
  }
  $('.selected')[0].scrollIntoView(true);
}
function selectPrevSymb() {
  let li = $('li');
  if (symbSelected){
    symbSelected.removeClass('selected');
    next = symbSelected.prev();
    if (next.length > 0){
      symbSelected = next.addClass('selected');
    } else {
      symbSelected = li.last().addClass('selected');
    }
  } else {
    symbSelected = li.last().addClass('selected');
  }
  $('.selected')[0].scrollIntoView(true);
}
function copySymb() {
  clipboard.writeText($('.selected h3').text())
  console.log(clipboard.readText())
  $('#searchbox').select();
  //MESSAGE
  ipcRenderer.send('asynchronous-message', 'hide');
}
function selectNextCat() {
  if (catSelected != undefined) {
    next = catSelected.next();
    if (next.length > 0) {
      catSelected = next.prop('selected', true);
    } else {
      catSelected = catlist.first().prop('selected', true);
    }
  } else {
    catSelected = catlist.first();
    next = catSelected.next();
    catSelected = next;
    catSelected.prop('selected', true);
  }
  changeCat();
  symbSelected = null;
}
function quit() {
  ipcRenderer.send('asynchronous-message', 'quit');
}
