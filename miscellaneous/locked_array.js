"use strict";

const LockedArray = function(from) {
  const key = Symbol();
  let locked = false;

  let array;
  try {
    array = Array.from(from);
  } catch(e) {
    array = [];
  }

  Object.defineProperty(this, "key", {
    enumerable:true,
    get:()=>{
      if(!locked) {
        locked = true;
        return key;
      }
      else return;
    }
  });

  Object.defineProperty(this, "lock", {
    enumerable:true,
    value:function lock(){locked = true},
    writable:false
  });

  Object.defineProperty(this, "unlock", {
    enumerable:true,
    value:function unlock(k) {
      if(k === key) locked = false;
      else throw new Error("Key is invalid.");
    },
    writable:false
  });

  Object.defineProperty(this, "value", {
    enumerable:true,
    get:()=>{return Array.from(array)}
  });

  Object.defineProperty(this, "add", {
    enumerable:true,
    value:function add(element) {
      if(!locked) array.push(element);
      else throw new Error("Array is locked.");
    },
    writable:false
  });

  Object.defineProperty(this, "remove", {
    enumerable:true,
    value:function remove(element) {
      let index = array.indexOf(element);
      if(index < 0) {
        throw new Error("Passed value 'element' does not exist in the array.");
        return;
      }
      if(!locked) array.splice(index, 1);
      else throw new Error("Array is locked.");
    },
    writable:true
  });
    
  Object.defineProperty(this, "includes", {
    enumerable:true,
    value:function includes(element) {return array.indexOf(element) >= 0},
    writable:false
  });

  Object.defineProperty(this, "find", {
    enumerable:true,
    value:function find(options) {
      var result = [];
      let p = Object.getOwnPropertyNames(options);
      for(var i = 0; i < this.value.length; i++) {
        var valid = true;
        for(let _i = 0; _i < p.length; _i++)
          if(this.value[i][p[_i]] != options[p[_i]]) {
            valid = false;
            break;
          }
        if(valid) result.push(this.value[i]);
      }
      return result;
    },
    writable:false
  });

  Object.defineProperty(this, "findOne", {
    enumerable:true,
    value:function findOne(options) {
      let filteredResults = this.find(options);
      return filteredResults.length > 0 ? filteredResults[0] : null;
    },
    writable:false
  });
}

LockedArray.prototype.valueOf = function valueOf()
{return this.value}
LockedArray.prototype.toString = function toString()
{return "[object LockedArray]"}

module.exports = LockedArray;
