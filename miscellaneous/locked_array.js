var lockedArray;
(()=>{
  lockedArray = function(from)
  {
    var key = {};
    var locked = false;

    var array = from instanceof Array ? from : [];

    Object.defineProperty(this, "key", {
      enumerable:true,
      get:()=>{
        if(!locked)
        {
          locked = true;
          return key;
        }
        else return;
      }
    });

    Object.defineProperty(this, "lock", {
      enumerable:true,
      get:()=>{return ()=>{locked = true;}}
    });

    Object.defineProperty(this, "unlock", {
      enumerable:true,
      get:()=>{return k=>{
        if(k === key) locked = false;
        else throw new Error("Key is invalid.");
      }}
    });

    Object.defineProperty(this, "value", {
      enumerable:true,
      get:()=>{return Array.from(array);}
    });

    Object.defineProperty(this, "add", {
      enumerable:true,
      get:() => { return element => {
        if(!locked) array.push(element);
        else throw new Error("Array is locked.");
      }}
    });

    var remove = element => {
      let index = array.indexOf(element);
      if(index < 0)
      {
        throw new Error("Passed value 'element' does not exist in the array.");
        return;
      }
      if(!locked) array.splice(index, 1);
      else throw new Error("Array is locked.");
    }
    Object.defineProperty(this, "remove", {
      enumerable:true,
      get:()=>{return remove;}
    });
    
    Object.defineProperty(this, "includes", {
      enumerable:true,
      get:()=>{return element=>{return array.indexOf(element) >= 0}}
    });
  }
})()
const LockedArray = lockedArray;
lockedArray = undefined;
delete(lockedArray);

LockedArray.prototype.valueOf = function valueOf()
{return this.value}
LockedArray.prototype.toString = function toString()
{return this.value.toString()}

module.exports = LockedArray;
