/* утилиты */
const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
const money = n => n.toLocaleString("ru-RU") + " ₽";
const pad = n => String(n).padStart(2, "0");

const pistonHead = $('#pistonGroup'),
    conrod = $('#conrod'),
    crankPin = $('#crankPin');

let rotation = 0,
    radius = 35,
    position = 40;

(function animation(){
    rotation += 0.02;
    const fingerX = Math.sin(rotation) * radius;
    const fingerY = Math.cos(rotation) * radius;
    crankPin.setAttribute("transform", `translate(${fingerX}, ${-fingerY})`);
    const pistonOffset = (1 - Math.cos(rotation)) * radius * 2;
    pistonHead.setAttribute("transform", "translate(0, " + (-20 + pistonOffset) + ")");
    requestAnimationFrame(animation)

})()


