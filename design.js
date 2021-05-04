class Car {
  constructor(id,name){
    this.id = this.id
    this.name = this.name
  }
}


class Trip {
  constructor(car) {
    this.car = car
  }

  //
  start() {
    return `${this.car.id}-${this.car.name}`
  }

  end(distance) {
    return this.car.price * distance
  }
}

class QuickCar extends Car{
  constructor(id,name,distance){
    constructor(id,name)
    this.price = 1
  }


}

class TypicalCar extends Car {
  constructor(id, name) {
    constructor(id, name)
    this.price = 2
  }
}