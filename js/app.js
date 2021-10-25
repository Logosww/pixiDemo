var toggle_btn;
var big_wrapper;
const main = document.querySelector('main');

declare();

let isDark = false;

events();

function toggleAnimation(){
  isDark = !isDark;
  let clone = big_wrapper.cloneNode(true);
  if(isDark){
    clone.classList.remove('light');
    clone.classList.add('dark');
  }
  else{
    clone.classList.remove('dark');
    clone.classList.add('light');
  }
  clone.classList.add('copy');
  main.appendChild(clone);

  clone.addEventListener('animationend', () => {
    big_wrapper.remove();
    clone.classList.remove('copy');

    declare();
    events();
  })
}

function declare(){
  toggle_btn = document.querySelector('.toggle-btn');
  big_wrapper = document.querySelector('.big-wrapper');
}

function events(){
  toggle_btn.addEventListener('click',toggleAnimation);
}