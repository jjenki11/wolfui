!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).PromiseWorker=e()}}(function(){return function i(f,s,a){function u(r,e){if(!s[r]){if(!f[r]){var n="function"==typeof require&&require;if(!e&&n)return n(r,!0);if(c)return c(r,!0);var o=new Error("Cannot find module '"+r+"'");throw o.code="MODULE_NOT_FOUND",o}var t=s[r]={exports:{}};f[r][0].call(t.exports,function(e){return u(f[r][1][e]||e)},t,t.exports,i,f,s,a)}return s[r].exports}for(var c="function"==typeof require&&require,e=0;e<a.length;e++)u(a[e]);return u}({1:[function(e,r,n){"use strict";var o=0;function f(e,r){var n=r.data;if(Array.isArray(n)&&!(n.length<2)){var o=n[0],t=n[1],i=n[2],f=e._callbacks[o];f&&(delete e._callbacks[o],f(t,i))}}function t(e){var r=this;r._worker=e,r._callbacks={},e.addEventListener("message",function(e){f(r,e)})}t.prototype.postMessage=function(e){var r=this,t=o++,i=[t,e];return new Promise(function(n,o){if(r._callbacks[t]=function(e,r){if(e)return o(new Error(e.message));n(r)},void 0!==r._worker.controller){var e=new MessageChannel;e.port1.onmessage=function(e){f(r,e)},r._worker.controller.postMessage(i,[e.port2])}else r._worker.postMessage(i)})},r.exports=t},{}]},{},[1])(1)});