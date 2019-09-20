const one = function(){
    return {name:'one'};
};

one.my_func = function(){
    return {name: 'my_func'};
};

console.log(one());
console.log(one.my_func());
