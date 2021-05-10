

/**
 * Question 1
 */

 var name = 'window'

 var person1 = {
   name: 'person1',
   show: function () {
     return () => console.log(this.name)
   }
 }
 var person2 = { name: 'person2' }
 
 person1.show()()  //person1
 person1.show().call(person2) //person1
 person1.show.call(person2)() // person2

 

